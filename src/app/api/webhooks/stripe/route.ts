import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role key to bypass RLS for server-side logging
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    console.error('Missing Stripe environment variables.');
    return NextResponse.json(
      { error: 'Server configuration error: Missing Stripe secrets.' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-01-27.acacia' as any,
  });

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header.' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle successful checkout completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerName = session.metadata?.customer_name || session.customer_details?.name || 'Online Customer';
    const customerCode = session.metadata?.customer_code || 'WEB-ONLINE';
    // Use Stripe Session ID or Payment Intent as the receipt number
    const receiptNumber = session.id.slice(-16).toUpperCase();
    const currentDate = new Date().toISOString();

    // Retrieve items stored in session metadata
    let lineItems = [];
    if (session.metadata?.cart_payload) {
      try {
        lineItems = JSON.parse(session.metadata.cart_payload);
      } catch (e) {
        console.error('Error parsing cart_payload metadata:', e);
      }
    }

    if (lineItems.length > 0) {
      const recordsToInsert = lineItems.map((item: any) => ({
        receipt_number: receiptNumber,
        sale_date: currentDate,
        customer_code: customerCode,
        customer_name: customerName,
        client_code: customerCode,
        sku: item.sku || 'ONLINE-ITEM',
        item_name: item.name,
        quantity: item.quantity || 1,
        subtotal: Number(item.subtotal || item.total || 0),
        sales_tax: Number(item.tax || 0),
        total_price: Number(item.total || 0),
        register: 'Stripe Web Checkout',
        cashier: 'Online Self-Checkout',
      }));

      const { error: dbError } = await supabase
        .from('client_sales_history')
        .insert(recordsToInsert);

      if (dbError) {
        console.error('Supabase write error:', dbError);
        return NextResponse.json({ error: dbError.message }, { status: 500 });
      }
    } else {
      // Fallback: single summary record if detailed cart payload wasn't present
      const orderTotal = Number(((session.amount_total || 0) / 100).toFixed(2));
      const { error: dbError } = await supabase
        .from('client_sales_history')
        .insert([
          {
            receipt_number: receiptNumber,
            sale_date: currentDate,
            customer_code: customerCode,
            customer_name: customerName,
            client_code: customerCode,
            sku: 'ORDER-TOTAL',
            item_name: 'Online Checkout Order',
            quantity: 1,
            subtotal: orderTotal,
            sales_tax: 0,
            total_price: orderTotal,
            register: 'Stripe Web Checkout',
            cashier: 'Online Self-Checkout',
          },
        ]);

      if (dbError) {
        console.error('Supabase write error (fallback):', dbError);
        return NextResponse.json({ error: dbError.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
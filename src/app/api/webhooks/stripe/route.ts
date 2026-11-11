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

    const customerEmail = session.customer_details?.email || session.customer_email || '';
    const customerName = session.metadata?.customer_name || session.customer_details?.name || 'Store Customer';
    const clientCode = session.metadata?.customer_code || 'GUEST';
    const transactionId = session.id;
    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : '';

    // Retrieve items stored in session metadata
    let lineItems = [];
    if (session.metadata?.cart_payload) {
      try {
        lineItems = JSON.parse(session.metadata.cart_payload);
      } catch (e) {
        console.error('Error parsing cart_payload metadata:', e);
      }
    }

    // Insert sales records into client_sales_history
    if (lineItems.length > 0) {
      const recordsToInsert = lineItems.map((item: any) => ({
        client_code: clientCode,
        client_name: customerName,
        client_email: customerEmail,
        item_sku: item.sku || 'WEB-SKU',
        item_name: item.name,
        quantity: item.quantity || 1,
        subtotal: item.subtotal || item.total,
        tax: item.tax || '0.00',
        total: item.total,
        transaction_id: transactionId,
        payment_intent_id: paymentIntentId,
        sale_date: new Date().toISOString(),
      }));

      const { error: dbError } = await supabase
        .from('client_sales_history')
        .insert(recordsToInsert);

      if (dbError) {
        console.error('Supabase write error:', dbError);
        return NextResponse.json({ error: dbError.message }, { status: 500 });
      }
    } else {
      // Fallback: single summary record if item payload was empty
      const { error: dbError } = await supabase
        .from('client_sales_history')
        .insert([
          {
            client_code: clientCode,
            client_name: customerName,
            client_email: customerEmail,
            item_sku: 'ORDER-TOTAL',
            item_name: 'Online Checkout Order',
            quantity: 1,
            subtotal: ((session.amount_total || 0) / 100).toFixed(2),
            tax: '0.00',
            total: ((session.amount_total || 0) / 100).toFixed(2),
            transaction_id: transactionId,
            payment_intent_id: paymentIntentId,
            sale_date: new Date().toISOString(),
          },
        ]);

      if (dbError) {
        console.error('Supabase fallback write error:', dbError);
        return NextResponse.json({ error: dbError.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
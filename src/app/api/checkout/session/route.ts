import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error('Missing STRIPE_SECRET_KEY in environment variables.');
      return NextResponse.json(
        { error: 'Server configuration error: Stripe key missing.' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: '2025-01-27.acacia' as any,
    });

    const { items, customerEmail, customerName, clientCode } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://birdsofparadiseks.net';

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.item_name || item.name || 'Store Item',
          metadata: {
            sku: item.sku || 'WEB-SKU',
          },
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity) || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail || undefined,
      line_items,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store?canceled=true`,
      metadata: {
        customer_name: customerName || '',
        customer_code: clientCode || '',
        cart_payload: JSON.stringify(
          items.map((i: any) => ({
            sku: i.sku || 'WEB-SKU',
            name: i.item_name || i.name,
            quantity: i.quantity || 1,
            total: (Number(i.price) * (i.quantity || 1)).toFixed(2),
            subtotal: (Number(i.price) * (i.quantity || 1)).toFixed(2),
            tax: '0.00',
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe session route error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
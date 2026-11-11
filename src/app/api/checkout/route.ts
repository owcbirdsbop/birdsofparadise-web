import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side admin client to write safely bypassing RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, items, subtotal, tax, total } = body;

    if (!email || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Email and items are required.' },
        { status: 400 }
      );
    }

    // Generate unique web receipt number
    const receiptNumber = `WEB-${Date.now().toString().slice(-6)}`;

    // Invoke the SQL procedure
    const { data, error } = await supabaseAdmin.rpc('record_web_order', {
      p_customer_email: email,
      p_customer_name: name || 'Valued Flock Customer',
      p_receipt_number: receiptNumber,
      p_subtotal: subtotal,
      p_sales_tax: tax,
      p_total_price: total,
      p_items: items,
    });

    if (error) {
      console.error('Order recording error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      receiptNumber,
      customerCode: data.customer_code,
    });
  } catch (err: any) {
    console.error('Checkout route error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
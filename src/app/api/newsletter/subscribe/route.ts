import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      firstName, 
      lastName, 
      phone, 
      address, 
      city, 
      state, 
      zip, 
      birdDetails 
    } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing customer
    const { data: existing, error: searchError } = await supabaseAdmin
      .from('clients')
      .select('customer_code')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (searchError) throw searchError;

    const profileData = {
      first_name: firstName?.trim() || undefined,
      last_name: lastName?.trim() || undefined,
      phone: phone?.trim() || undefined,
      street_address: address?.trim() || undefined,
      city: city?.trim() || undefined,
      state: state?.trim() || undefined,
      postal_code: zip?.trim() || undefined,
      opted_in_marketing: true,
      enable_promotional_emails: 1,
      marketing_opt_in_at: new Date().toISOString()
    };

    if (existing) {
      await supabaseAdmin
        .from('clients')
        .update(profileData)
        .eq('customer_code', existing.customer_code);
    } else {
      const randomCode = 'WEB-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      const { error: insertError } = await supabaseAdmin
        .from('clients')
        .insert({
          customer_code: randomCode,
          email: cleanEmail,
          ...profileData
        });

      if (insertError) throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: 'Flock membership confirmed!',
      discountCode: 'WELCOME15'
    });
  } catch (err: any) {
    console.error('Newsletter signup error:', err);
    return NextResponse.json(
      { error: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
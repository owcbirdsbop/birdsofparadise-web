import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Prevent Next.js build-time prerendering/module evaluation crashes
export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase environment variables are missing.');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

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
    const supabaseAdmin = getSupabaseAdmin();

    // Check for existing customer in clients table
    const { data: existing, error: searchError } = await supabaseAdmin
      .from('clients')
      .select('customer_code, notes')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (searchError) throw searchError;

    // Map form fields to the exact columns of public.clients
    const profileData: Record<string, any> = {
      first_name: firstName?.trim() || undefined,
      last_name: lastName?.trim() || undefined,
      mobile_number: phone?.trim() || undefined,
      phone_number: phone?.trim() || undefined,
      shipping_address_street_address: address?.trim() || undefined,
      shipping_address_city: city?.trim() || undefined,
      shipping_address_province_state: state?.trim() || undefined,
      shipping_address_postcode_zip_code: zip?.trim() || undefined,
      address_line_1: address?.trim() || undefined,
      city: city?.trim() || undefined,
      state: state?.trim() || undefined,
      zip: zip?.trim() || undefined,
      opted_in_marketing: true,
      enable_promotional_emails: 1,
      marketing_opt_in_at: new Date().toISOString()
    };

    // If bird details are provided, append them cleanly to notes
    if (birdDetails?.trim()) {
      const birdNote = `Flock Info: ${birdDetails.trim()}`;
      if (existing?.notes) {
        profileData.notes = `${existing.notes} | ${birdNote}`;
      } else {
        profileData.notes = birdNote;
      }
    }

    if (existing) {
      const { error: updateError } = await supabaseAdmin
        .from('clients')
        .update(profileData)
        .eq('customer_code', existing.customer_code);

      if (updateError) throw updateError;
    } else {
      const randomCode = 'WEB-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      const { error: insertError } = await supabaseAdmin
        .from('clients')
        .insert({
          customer_code: randomCode,
          email: cleanEmail,
          customer_group_name: 'Online Retail',
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
      { error: err.message || 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
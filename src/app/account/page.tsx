'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AccountPage() {
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    async function loadAccount() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (data) {
        setClient(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setPhone(data.mobile_number || data.phone_number || '');
        setStreet(data.shipping_address_street_address || data.address_line_1 || '');
        setCity(data.shipping_address_city || data.city || '');
        setState(data.shipping_address_province_state || data.state || '');
        setZip(data.shipping_address_postcode_zip_code || data.zip || '');
      }
      setLoading(false);
    }

    loadAccount();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    setSaving(true);
    setSuccessNotice(false);

    const { error } = await supabase
      .from('clients')
      .update({
        first_name: firstName,
        last_name: lastName,
        mobile_number: phone,
        shipping_address_street_address: street,
        shipping_address_city: city,
        shipping_address_province_state: state,
        shipping_address_postcode_zip_code: zip,
      })
      .eq('customer_code', client.customer_code);

    if (!error) {
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/store');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center font-sans">
        <p className="text-stone-500 font-semibold text-sm">Loading your flock profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/store" className="text-xs font-bold text-emerald-800 hover:underline">
                ← Workshop Store
              </Link>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 font-mono">
                Code: {client?.customer_code}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Welcome back, {client?.first_name || 'Companion Care Customer'}!
            </h1>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="text-xs font-bold text-stone-600 hover:text-rose-700 bg-white border border-stone-300 px-3.5 py-2 rounded-xl transition cursor-pointer self-start sm:self-auto"
          >
            Sign Out
          </button>
        </div>

        {/* Overview Stats: Store Credit & Loyalty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Store Credit Balance
            </span>
            <div className="text-2xl font-black text-stone-900 mt-1">
              ${Number(client?.store_credit_balance || 0).toFixed(2)}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Usable on showroom pickups or workshop shipping.
            </p>
          </div>

          <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Showroom Loyalty Points
            </span>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              {Number(client?.loyalty_balance || 0).toFixed(0)} pts
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Earned on local nursery, nutrition, and toy purchases.
            </p>
          </div>
        </div>

        {/* Profile & Shipping Address Editor */}
        <div className="mt-8 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-extrabold text-stone-900 mb-1">
            Personal &amp; Default Shipping Details
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Keep your shipping destination and phone number updated for direct workshop orders.
          </p>

          {successNotice && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
              ✓ Information updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="text"
                  disabled
                  value={client?.email || ''}
                  className="w-full px-3 py-2 border border-stone-200 bg-stone-100 rounded-lg text-sm text-stone-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(316) 555-0199"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="123 Main St"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Postal / ZIP Code
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
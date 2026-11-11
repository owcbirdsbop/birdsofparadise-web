'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface OrderLineItem {
  id: number;
  sku: string;
  item_name: string;
  quantity: number;
  subtotal: number;
  sales_tax: number;
  total_price: number;
}

interface ReceiptGroup {
  receipt_number: string;
  sale_date: string;
  register?: string;
  cashier?: string;
  total_amount: number;
  total_tax: number;
  total_subtotal: number;
  items: OrderLineItem[];
}

export default function AccountPage() {
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [orders, setOrders] = useState<ReceiptGroup[]>([]);
  const [expandedReceipt, setExpandedReceipt] = useState<string | null>(null);
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
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const userEmail = user.email?.toLowerCase().trim();

        // 1. Fetch client by auth_user_id first
        let { data: clientRecord } = await supabase
          .from('clients')
          .select('*')
          .eq('auth_user_id', user.id)
          .maybeSingle();

        // 2. If not linked yet, fall back to email match and link auth_user_id
        if (!clientRecord && userEmail) {
          const { data: emailMatch } = await supabase
            .from('clients')
            .select('*')
            .ilike('email', userEmail)
            .maybeSingle();

          if (emailMatch) {
            clientRecord = emailMatch;
            await supabase
              .from('clients')
              .update({ auth_user_id: user.id })
              .eq('customer_code', emailMatch.customer_code);
          }
        }

        if (clientRecord) {
          setClient(clientRecord);
          setFirstName(clientRecord.first_name || '');
          setLastName(clientRecord.last_name || '');
          setPhone(clientRecord.mobile_number || clientRecord.phone_number || '');
          setStreet(clientRecord.shipping_address_street_address || clientRecord.address_line_1 || '');
          setCity(clientRecord.shipping_address_city || clientRecord.city || '');
          setState(clientRecord.shipping_address_province_state || clientRecord.state || '');
          setZip(clientRecord.shipping_address_postcode_zip_code || clientRecord.zip || '');

          // 3. Fetch sales history for this client
          if (clientRecord.customer_code) {
            const { data: salesRows, error: salesError } = await supabase
              .from('client_sales_history')
              .select('*')
              .eq('customer_code', clientRecord.customer_code)
              .order('sale_date', { ascending: false });

            if (!salesError && salesRows) {
              // Group individual line items by receipt_number
              const receiptsMap: { [key: string]: ReceiptGroup } = {};

              salesRows.forEach((row: any) => {
                const receiptKey = row.receipt_number || 'RECEIPT-UNKNOWN';

                if (!receiptsMap[receiptKey]) {
                  receiptsMap[receiptKey] = {
                    receipt_number: row.receipt_number,
                    sale_date: row.sale_date,
                    register: row.register,
                    cashier: row.cashier,
                    total_amount: 0,
                    total_tax: 0,
                    total_subtotal: 0,
                    items: [],
                  };
                }

                receiptsMap[receiptKey].total_amount += Number(row.total_price || 0);
                receiptsMap[receiptKey].total_tax += Number(row.sales_tax || 0);
                receiptsMap[receiptKey].total_subtotal += Number(row.subtotal || 0);

                receiptsMap[receiptKey].items.push({
                  id: row.id,
                  sku: row.sku,
                  item_name: row.item_name,
                  quantity: Number(row.quantity || 1),
                  subtotal: Number(row.subtotal || 0),
                  sales_tax: Number(row.sales_tax || 0),
                  total_price: Number(row.total_price || 0),
                });
              });

              // Convert dictionary to ordered array
              const sortedReceipts = Object.values(receiptsMap).sort(
                (a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()
              );

              setOrders(sortedReceipts);
            }
          }
        }
      } catch (err) {
        console.error('Error loading account:', err);
      } finally {
        setLoading(false);
      }
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

  const toggleReceipt = (receiptNo: string) => {
    setExpandedReceipt((prev) => (prev === receiptNo ? null : receiptNo));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center font-sans">
        <p className="text-stone-500 font-semibold text-sm">Loading your flock profile &amp; purchases...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/store" className="text-xs font-bold text-emerald-800 hover:underline">
                ← Workshop Store
              </Link>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 font-mono">
                Code: {client?.customer_code || 'Unlinked'}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Sales & Orders History Section */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                Purchase &amp; Receipt History
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Complete record of in-store showroom and workshop transactions.
              </p>
            </div>
            <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
              {orders.length} {orders.length === 1 ? 'Receipt' : 'Receipts'}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="border border-dashed border-stone-200 rounded-xl p-8 text-center bg-stone-50/50">
              <span className="text-2xl block mb-2">🪶</span>
              <p className="text-sm font-bold text-stone-700">No recorded purchases found</p>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Receipts linked to your customer code ({client?.customer_code || 'pending'}) will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const isExpanded = expandedReceipt === order.receipt_number;

                return (
                  <div
                    key={order.receipt_number}
                    className="border border-stone-200 rounded-xl overflow-hidden transition"
                  >
                    {/* Receipt Accordion Header */}
                    <div
                      onClick={() => toggleReceipt(order.receipt_number)}
                      className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:bg-stone-50 select-none transition"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-stone-900">
                            Receipt #{order.receipt_number}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Completed
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">
                          {new Date(order.sale_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {order.register ? ` • Register: ${order.register}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">
                            Total
                          </span>
                          <span className="text-sm font-black text-stone-900">
                            ${order.total_amount.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-stone-400 text-xs font-bold px-2 py-1 bg-stone-100 rounded-lg">
                          {isExpanded ? '▲ Hide' : '▼ View Items'}
                        </span>
                      </div>
                    </div>

                    {/* Expandable Line Items Table */}
                    {isExpanded && (
                      <div className="border-t border-stone-200 bg-stone-50/70 p-4 space-y-3">
                        <div className="divide-y divide-stone-200 text-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-2.5 flex justify-between items-center">
                              <div className="space-y-0.5">
                                <p className="font-bold text-stone-800">{item.item_name}</p>
                                <p className="text-[11px] text-stone-500">
                                  SKU: {item.sku || 'N/A'} • Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-stone-900">
                                  ${item.total_price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Breakdown Totals */}
                        <div className="border-t border-stone-200 pt-3 flex flex-col items-end gap-1 text-xs text-stone-600">
                          <div className="flex justify-between w-44">
                            <span>Subtotal:</span>
                            <span className="font-medium">${order.total_subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between w-44">
                            <span>Sales Tax:</span>
                            <span className="font-medium">${order.total_tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between w-44 font-bold text-stone-900 text-sm pt-1 border-t border-stone-200">
                            <span>Total:</span>
                            <span>${order.total_amount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Profile & Shipping Address Editor */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
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
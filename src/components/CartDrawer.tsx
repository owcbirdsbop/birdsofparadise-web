'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
  } = useCart();

  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (cart.length === 0 || checkingOut) return;
    setCheckingOut(true);
    setCheckoutError(null);

    try {
      // 1. Fetch current signed-in user session if available
      const { data: { user } } = await supabase.auth.getUser();

      let clientCode = '';
      let customerName = '';
      const customerEmail = user?.email || '';

      if (user) {
        const { data: clientRecord } = await supabase
          .from('clients')
          .select('customer_code, first_name, last_name')
          .eq('auth_user_id', user.id)
          .maybeSingle();

        if (clientRecord) {
          clientCode = clientRecord.customer_code || '';
          customerName = [clientRecord.first_name, clientRecord.last_name].filter(Boolean).join(' ');
        }
      }

      // 2. Request Stripe Checkout Session
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            sku: item.sku,
            item_name: item.name,
            price: item.retail_price,
            quantity: item.quantity,
          })),
          customerEmail,
          customerName,
          clientCode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to initialize secure checkout.');
      }

      // 3. Redirect to Stripe's hosted checkout page
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'An unexpected error occurred during checkout.');
      setCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Darkened backdrop */}
      <div
        onClick={() => !checkingOut && setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div>
              <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <span>🛒 Workshop Basket</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">Kansas Handcrafted Enrichment</p>
            </div>
            <button
              type="button"
              disabled={checkingOut}
              onClick={() => setIsCartOpen(false)}
              className="text-stone-400 hover:text-stone-700 text-xl font-bold p-1 rounded-md cursor-pointer disabled:opacity-40"
            >
              ✕
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                <span className="text-4xl block mb-2">🪵</span>
                <p className="text-sm font-semibold">Your basket is currently empty.</p>
                <p className="text-xs mt-1 text-stone-400">Add handcrafted items from our workshop catalog!</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.sku}
                  className="flex gap-4 p-3 border border-stone-200 rounded-xl bg-white shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-stone-100">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">🪵</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 truncate">{item.name}</h4>
                    <span className="text-[10px] text-stone-400 font-mono block">{item.sku}</span>
                    <span className="text-xs font-black text-stone-800 mt-1 block">
                      ${item.retail_price.toFixed(2)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          type="button"
                          disabled={checkingOut}
                          onClick={() => updateQuantity(item.sku, -1)}
                          className="px-2 py-0.5 text-xs font-bold text-stone-600 hover:bg-stone-200 rounded-l cursor-pointer disabled:opacity-40"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-extrabold text-stone-900">{item.quantity}</span>
                        <button
                          type="button"
                          disabled={checkingOut || item.quantity >= item.web_stock}
                          onClick={() => updateQuantity(item.sku, 1)}
                          className="px-2 py-0.5 text-xs font-bold text-stone-600 hover:bg-stone-200 rounded-r cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled={checkingOut}
                        onClick={() => removeFromCart(item.sku)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold ml-auto cursor-pointer disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-stone-600">
                <span>Workshop Subtotal</span>
                <span className="text-xl font-black text-stone-900">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Taxes and flat-rate workshop shipping calculated at checkout.
              </p>

              {checkoutError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold">
                  ⚠️ {checkoutError}
                </div>
              )}

              <button
                type="button"
                disabled={checkingOut}
                onClick={handleCheckout}
                className="w-full bg-[#065f46] hover:bg-[#044331] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
              >
                {checkingOut ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Connecting to Secure Checkout...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <span>➔</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
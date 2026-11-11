'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    // Clear the cart contents upon confirmed successful checkout
    if (!cleared) {
      if (typeof clearCart === 'function') {
        clearCart();
      }
      setCleared(true);
    }
  }, [clearCart, cleared]);

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-stone-50 font-sans">
      <div className="max-w-md w-full bg-white border border-stone-200 rounded-3xl p-8 text-center shadow-xl space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
          ✓
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-sm text-stone-600">
            Thank you for supporting Birds of Paradise. Your workshop order has been received and logged.
          </p>
        </div>

        {sessionId && (
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-left">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Stripe Transaction ID
            </span>
            <span className="text-xs font-mono text-stone-700 break-all select-all">
              {sessionId}
            </span>
          </div>
        )}

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/account"
            className="w-full bg-[#065f46] hover:bg-[#044331] text-white font-bold py-3 px-4 rounded-xl transition text-center text-sm shadow-md"
          >
            View My Order History & Receipts
          </Link>
          <Link
            href="/store"
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3 px-4 rounded-xl transition text-center text-sm"
          >
            Return to Store
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-500">Loading order details...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
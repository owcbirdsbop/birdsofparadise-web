'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export default function CartButton() {
  const { setIsCartOpen, totalItems } = useCart();

  return (
    <button
      type="button"
      onClick={() => setIsCartOpen(true)}
      aria-label={`Open shopping cart with ${totalItems} items`}
      className="relative flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition cursor-pointer"
    >
      <span className="text-base">🛒</span>
      <span className="hidden sm:inline">Cart</span>
      {totalItems > 0 ? (
        <span className="bg-amber-400 text-stone-900 text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
          {totalItems}
        </span>
      ) : (
        <span className="text-[11px] text-emerald-200 font-semibold">0</span>
      )}
    </button>
  );
}
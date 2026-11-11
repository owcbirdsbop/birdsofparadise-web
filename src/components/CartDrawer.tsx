'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

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

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Darkened backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
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
              onClick={() => setIsCartOpen(false)}
              className="text-stone-400 hover:text-stone-700 text-xl font-bold p-1 rounded-md cursor-pointer"
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
                          onClick={() => updateQuantity(item.sku, -1)}
                          className="px-2 py-0.5 text-xs font-bold text-stone-600 hover:bg-stone-200 rounded-l cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-extrabold text-stone-900">{item.quantity}</span>
                        <button
                          type="button"
                          disabled={item.quantity >= item.web_stock}
                          onClick={() => updateQuantity(item.sku, 1)}
                          className="px-2 py-0.5 text-xs font-bold text-stone-600 hover:bg-stone-200 rounded-r cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.sku)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold ml-auto cursor-pointer"
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
              <button
                type="button"
                onClick={() => alert(`Starting Stripe checkout session for $${subtotal.toFixed(2)}...`)}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <span>➔</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
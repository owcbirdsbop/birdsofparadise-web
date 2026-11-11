import React from 'react';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import CartButton from '@/components/CartButton';
import UserNav from '@/components/UserNav';

export const metadata = {
  title: 'Workshop Store | Birds of Paradise',
  description:
    'Handcrafted bird toys, perches, and custom nutrition direct from our Kansas workshop.',
};

export default function StorePage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      {/* Top Banner */}
      <div className="bg-amber-800 text-amber-50 px-4 py-2 text-center text-xs sm:text-sm font-medium tracking-wide">
        Visit our Wichita Showroom at 1842 S. Woodlawn Blvd • Direct Online Workshop Shipping
      </div>

      {/* Main Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-stone-200">
        <div>
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-stone-900 hover:text-emerald-900 transition"
          >
            Birds of Paradise
          </Link>
          <span className="block text-xs uppercase tracking-widest text-amber-700 font-semibold">
            Workshop Store
          </span>
        </div>

        {/* Navigation Actions: Home Link, User Account Pill, and Cart Drawer Trigger */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-stone-600 hover:text-stone-900 text-xs sm:text-sm font-bold px-3 py-2 rounded-md hover:bg-stone-100 transition hidden sm:inline-block"
          >
            ← Back to Home
          </Link>
          <UserNav />
          <CartButton />
        </div>
      </nav>

      {/* Store Header Banner */}
      <header className="max-w-6xl mx-auto px-6 pt-10 pb-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Online Store &amp; Workshop Catalog
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
          Every piece is built on our workshop benches using untreated pine, bird-safe dyes, and
          stainless hardware. Dedicated online stock is ready for immediate packing and shipment.
        </p>
      </header>

      {/* Full Filterable, Paginated Catalog */}
      <ProductGrid />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-10 px-6 mt-16 border-t border-stone-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div>
            <strong className="text-white">Birds of Paradise</strong> • 1842 S. Woodlawn Blvd,
            Wichita, KS 67218
          </div>
          <div>
            &copy; {new Date().getFullYear()} Birds of Paradise. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
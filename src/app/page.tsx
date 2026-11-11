import React from 'react';
import Link from 'next/link';
import FeaturedShowcase from '@/components/FeaturedShowcase';
import FlockNewsletterSignup from '@/components/FlockNewsletterSignup';
import CartButton from '@/components/CartButton';
import UserNav from '@/components/UserNav';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      <div className="bg-amber-800 text-amber-50 px-4 py-2 text-center text-sm font-medium tracking-wide">
        Visit our Wichita Store at 1842 S. Woodlawn Blvd, Wichita, Kansas 67218
      </div>

      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-stone-200">
        <div>
          <span className="text-xl font-bold tracking-tight text-stone-900">Birds of Paradise</span>
          <span className="block text-xs uppercase tracking-widest text-amber-700 font-semibold">Wichita, Kansas</span>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/store" 
            className="text-stone-700 hover:text-stone-900 font-bold text-xs sm:text-sm px-3 py-2 rounded-lg hover:bg-stone-100 transition hidden sm:inline-block"
          >
            Browse Workshop Goods
          </Link>
          <UserNav />
          <CartButton />
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="text-amber-800 font-semibold uppercase tracking-wider text-sm mb-3">
          Generations of Companion Care
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight mb-6">
          Handcrafted Enrichment &amp; Ethical Companion Care
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto mb-8">
          Locally built natural wood toys, bird-safe hardware, and an unhurried, visit-first retail environment in Wichita.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="#visit" 
            className="bg-stone-900 hover:bg-stone-800 text-white font-medium px-6 py-3 rounded-md transition"
          >
            Visit Our Showroom
          </a>
          <Link 
            href="/store" 
            className="bg-amber-700 hover:bg-amber-800 text-white font-medium px-6 py-3 rounded-md transition"
          >
            Shop Workshop Toys ➔
          </Link>
        </div>
      </section>

      <section className="bg-amber-100/60 border-y border-amber-200/80 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-3">Our In-Person Companion Philosophy</h2>
          <p className="text-stone-700 leading-relaxed mb-4">
            Every companion bird is a lifelong family member, not cargo.
            <br />
            <strong>We do not ship live birds under any circumstance.</strong>
          </p>
          <p className="text-stone-600 text-sm leading-relaxed">
            We invite families to visit our Wichita Store in person, spend unhurried time with our companions, and let the right bond form naturally with zero sales pressure.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
        <div className="p-6 rounded-lg border border-stone-200 bg-white shadow-sm">
          <h3 className="text-xl font-bold text-stone-900 mb-2">Handcrafted Kansas Enrichment</h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-4">
            Built from untreated natural pine, bird-safe food dyes, and solid stainless steel hardware. Engineered right here in our Kansas woodshop for heavy chewers, foragers, and curious minds.
          </p>
          <Link 
            href="/store" 
            className="text-amber-800 font-semibold text-sm hover:underline inline-flex items-center gap-1"
          >
            Shop workshop toys ready to ship nationwide &rarr;
          </Link>
        </div>

        <div className="p-6 rounded-lg border border-stone-200 bg-white shadow-sm">
          <h3 className="text-xl font-bold text-stone-900 mb-2">In-Store Supplies &amp; Nutrition</h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-4">
            Looking for daily feed and care essentials? Stop by our Woodlawn showroom for clean, quality nutrition, trusted cage supplies, and direct flock support.
          </p>
          <a 
            href="#visit" 
            className="text-amber-800 font-semibold text-sm hover:underline inline-flex items-center gap-1"
          >
            View showroom hours &amp; directions &rarr;
          </a>
        </div>
      </section>

      <FeaturedShowcase />

      <section className="px-6 pb-12">
        <FlockNewsletterSignup />
      </section>

      <section id="visit" className="bg-stone-900 text-stone-300 py-16 px-6">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Wichita Retail Showroom</h2>
            <p className="text-base text-stone-300 mb-2"><strong>Birds of Paradise</strong></p>
            <p className="text-stone-400 text-sm mb-4 leading-relaxed">
              1842 S. Woodlawn Blvd<br />
              Wichita, KS 67218
            </p>
            <p className="text-stone-400 text-sm">
              Stop in to pick up store supplies, browse in-person enrichment, or meet our nursery flock.
            </p>
          </div>

          <div className="flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-stone-800 pt-6 sm:pt-0 sm:pl-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Direct Workshop Orders</h3>
              <p className="text-stone-400 text-sm mb-4">
                We craft and ship our full line of natural wood toys and enrichment products across the country directly from our woodshop.
              </p>
              <Link 
                href="/store" 
                className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline"
              >
                Visit the Full Online Store &rarr;
              </Link>
            </div>
            <div className="text-xs text-stone-500 pt-4 border-t border-stone-800">
              &copy; {new Date().getFullYear()} Birds of Paradise. All rights reserved.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
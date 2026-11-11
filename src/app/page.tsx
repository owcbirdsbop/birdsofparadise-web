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
            Browse Catalog
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
          A Gentle, Ethical Home for Kansas Birds &amp; Their Families
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto mb-8">
          We provide locally crafted natural enrichment, custom nutrition, and an unhurried, visit-first environment.
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
            Explore Online Store ➔
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
            Built from untreated natural pine, bird-safe vegetable dyes, and solid stainless hardware. Made right here in Kansas for heavy chewers, foragers, and curious minds.
          </p>
          <Link 
            href="/store" 
            className="text-amber-800 font-semibold text-sm hover:underline inline-flex items-center gap-1"
          >
            Order toys for shipping or store pickup &rarr;
          </Link>
        </div>

        <div className="p-6 rounded-lg border border-stone-200 bg-white shadow-sm">
          <h3 className="text-xl font-bold text-stone-900 mb-2">Custom Seed Blends &amp; Nutrition</h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-4">
            Freshly mixed house blends, premium clean seeds, and vet-recommended staple diets formulated to keep your flock vibrant and active.
          </p>
          <Link 
            href="/store" 
            className="text-amber-800 font-semibold text-sm hover:underline inline-flex items-center gap-1"
          >
            Browse available blends in our store &rarr;
          </Link>
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
              Stop in to talk with our team, pick up bulk nutrition, or ask about our nursery flock.
            </p>
          </div>

          <div className="flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-stone-800 pt-6 sm:pt-0 sm:pl-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Direct Workshop Orders</h3>
              <p className="text-stone-400 text-sm mb-4">
                Shop dry goods, handcrafted toys, and custom nutrition directly online with dedicated workshop stock.
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
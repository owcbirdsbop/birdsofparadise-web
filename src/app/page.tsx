import React from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      {/* Top Banner */}
      <div className="bg-amber-800 text-amber-50 px-4 py-2 text-center text-sm font-medium tracking-wide">
        Visit our Wichita Showroom at 1842 S. Woodlawn Blvd &bull; Caring for Kansas Flocks Since the 1950s
      </div>

      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-stone-200">
        <div>
          <span className="text-xl font-bold tracking-tight text-stone-900">Birds of Paradise</span>
          <span className="block text-xs uppercase tracking-widest text-amber-700 font-semibold">Wichita, Kansas</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <a 
            href="https://theperkyperch.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-md shadow-sm transition"
          >
            Shop Toys & Supplies 🛒
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="text-amber-800 font-semibold uppercase tracking-wider text-sm mb-3">
          Generations of Companion Care
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight mb-6">
          A Gentle, Ethical Home for Kansas Birds & Their Families
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto mb-8">
          Continuing a proud legacy rooted in Wall Seed Co. and four decades of Birds of Paradise. 
          We provide locally crafted natural enrichment, custom nutrition, and an unhurried, visit-first environment.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="#visit" 
            className="bg-stone-900 hover:bg-stone-800 text-white font-medium px-6 py-3 rounded-md transition"
          >
            Visit Our Showroom
          </a>
          <a 
            href="https://theperkyperch.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white border border-stone-300 hover:border-stone-400 text-stone-700 font-medium px-6 py-3 rounded-md transition"
          >
            Browse Products at The Perky Perch &rarr;
          </a>
        </div>
      </section>

      {/* Ethical Standard / No Shipping */}
      <section className="bg-amber-100/60 border-y border-amber-200/80 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-3">Our In-Person Companion Philosophy</h2>
          <p className="text-stone-700 leading-relaxed mb-4">
            Every companion bird is a lifelong family member, not cargo. <strong>We do not ship live birds under any circumstance.</strong>
          </p>
          <p className="text-stone-600 text-sm leading-relaxed">
            We invite prospective families to visit our Wichita nursery in person, spend unhurried time with our companions, and let the right bond form naturally with zero sales pressure.
          </p>
        </div>
      </section>

      {/* Core Highlights */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
        <div className="p-6 rounded-lg border border-stone-200 bg-white shadow-sm">
          <h3 className="text-xl font-bold text-stone-900 mb-2">Handcrafted Kansas Enrichment</h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-4">
            Built from untreated natural pine, bird-safe vegetable dyes, and solid stainless hardware. Made right here in Kansas for heavy chewers, foragers, and curious minds.
          </p>
          <a 
            href="https://theperkyperch.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-amber-800 font-semibold text-sm hover:underline"
          >
            Order toys for shipping or store pickup &rarr;
          </a>
        </div>

        <div className="p-6 rounded-lg border border-stone-200 bg-white shadow-sm">
          <h3 className="text-xl font-bold text-stone-900 mb-2">Custom Seed Blends & Nutrition</h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-4">
            Freshly mixed house blends, premium clean seeds, and vet-recommended staple diets formulated to keep your flock vibrant and active.
          </p>
          <span className="text-stone-500 text-sm italic">Available in-store and online at The Perky Perch</span>
        </div>
      </section>

      {/* Showroom Details */}
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
              <h3 className="text-lg font-semibold text-white mb-2">Community & Orders</h3>
              <p className="text-stone-400 text-sm mb-4">
                Shop dry goods, toys, and supplies online anytime through <strong>The Perky Perch</strong>.
              </p>
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
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface ToyItem {
  sku: string;
  name: string;
  description: string | null;
  retail_price: number | null;
  web_stock: number;
  is_showroom_only: boolean;
  enrichment_category: string | null;
  image_url: string | null;
  for_sb: boolean;
  for_mb: boolean;
  for_lb: boolean;
}

export default function FeaturedShowcase() {
  const [featuredToys, setFeaturedToys] = useState<ToyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data, error } = await supabase
          .from('toy_catalog')
          .select(`
            sku,
            name,
            description,
            retail_price,
            web_stock,
            is_showroom_only,
            enrichment_category,
            image_url,
            for_sb,
            for_mb,
            for_lb
          `)
          .eq('is_web_active', true);

        if (!error && data && data.length > 0) {
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          setFeaturedToys(shuffled.slice(0, 3));
        }
      } catch (err) {
        console.error('Featured toys fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-14 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-800 font-extrabold">
            Featured Workshop Spotlight
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Handcrafted Kansas Avian Enrichment
          </h2>
        </div>
        <Link
          href="/store"
          className="text-xs font-bold text-emerald-800 hover:text-emerald-900 mt-2 sm:mt-0 flex items-center gap-1 group"
        >
          <span>View All Products in Online Store</span>
          <span className="group-hover:translate-x-0.5 transition-transform">➔</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-500 font-medium text-sm">
          Loading featured items...
        </div>
      ) : featuredToys.length === 0 ? (
        <div className="text-center py-12 text-stone-500 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-sm">
          Check back soon for featured workshop builds!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {featuredToys.map((item) => (
              <div
                key={item.sku}
                className="flex flex-col justify-between bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="w-full h-48 bg-stone-100 relative flex items-center justify-center overflow-hidden border-b border-stone-100">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-stone-400">
                      <span className="text-3xl">🪵</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider mt-1 text-stone-400">
                        Natural Kansas Wood
                      </span>
                    </div>
                  )}

                  <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-stone-700 px-2.5 py-1 rounded-md shadow-sm backdrop-blur-sm border border-stone-200">
                    {item.enrichment_category || 'Enrichment'}
                  </span>

                  <div className="absolute top-3 right-3">
                    {item.is_showroom_only ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md border border-amber-300 shadow-sm">
                        Showroom Only
                      </span>
                    ) : item.web_stock > 0 ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md border border-emerald-300 shadow-sm">
                        {item.web_stock} in stock
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-1 rounded-md border border-rose-300 shadow-sm">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex gap-1.5 mb-2.5">
                    {item.for_sb && (
                      <span className="text-[9.5px] font-bold uppercase tracking-wide text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Small Bird
                      </span>
                    )}
                    {item.for_mb && (
                      <span className="text-[9.5px] font-bold uppercase tracking-wide text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Medium Bird
                      </span>
                    )}
                    {item.for_lb && (
                      <span className="text-[9.5px] font-bold uppercase tracking-wide text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                        Large Bird
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-stone-900 leading-snug mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[10.5px] text-stone-400 font-mono mb-2">
                    SKU: {item.sku}
                  </p>
                  <p className="text-stone-600 text-xs leading-relaxed mb-4 line-clamp-2">
                    {item.description || 'Natural enrichment handcrafted in our Kansas workshop.'}
                  </p>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
                  <span className="text-xl font-black text-stone-900">
                    ${Number(item.retail_price || 0).toFixed(2)}
                  </span>

                  {item.is_showroom_only ? (
                    <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg">
                      Showroom Exclusive
                    </span>
                  ) : item.web_stock > 0 ? (
                    <Link
                      href="/store"
                      className="text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-3.5 py-1.5 rounded-lg shadow-sm transition"
                    >
                      Shop Now ➔
                    </Link>
                  ) : (
                    <span className="text-xs font-bold text-stone-400 bg-stone-100 px-3 py-1.5 rounded-lg">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-sm px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <span>Explore All Workshop Stock in Our Store</span>
              <span>➔</span>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
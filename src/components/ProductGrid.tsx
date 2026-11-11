'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useCart } from '@/context/CartContext';

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

export default function ProductGrid() {
  const { addToCart } = useCart();
  const [toys, setToys] = useState<ToyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SB' | 'MB' | 'LB' | 'SHOWROOM'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    async function fetchToys() {
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
          .eq('is_web_active', true)
          .order('name', { ascending: true });

        if (error) {
          setErrorMsg(error.message);
        } else if (data) {
          setToys(data);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to fetch catalog');
      } finally {
        setLoading(false);
      }
    }

    fetchToys();
  }, []);

  const filteredToys = useMemo(() => {
    return toys.filter((item) => {
      if (activeFilter === 'SB') return item.for_sb;
      if (activeFilter === 'MB') return item.for_mb;
      if (activeFilter === 'LB') return item.for_lb;
      if (activeFilter === 'SHOWROOM') return item.is_showroom_only;
      return true;
    });
  }, [toys, activeFilter]);

  const totalStorePages = Math.ceil(filteredToys.length / itemsPerPage) || 1;
  const visibleToys = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredToys.slice(start, start + itemsPerPage);
  }, [filteredToys, currentPage, itemsPerPage]);

  const handleFilterChange = (filter: 'ALL' | 'SB' | 'MB' | 'LB' | 'SHOWROOM') => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  return (
    <section id="products" className="max-w-6xl mx-auto px-6 py-12 font-sans">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-800 font-extrabold">
            Direct from Our Kansas Workshop
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Handcrafted Avian Woodcraft &amp; Enrichment
          </h2>
        </div>
        <p className="text-xs text-stone-500 mt-2 sm:mt-0 font-medium">
          Dedicated online inventory • Independent of floor stock
        </p>
      </div>

      {/* Bird Size & Availability Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {[
          { key: 'ALL', label: 'All Catalog' },
          { key: 'SB', label: '🐣 Small Birds' },
          { key: 'MB', label: '🦜 Medium Birds' },
          { key: 'LB', label: '🦅 Large Macaws/Cockatoos' },
          { key: 'SHOWROOM', label: '🏢 Showroom Exclusives' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleFilterChange(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              activeFilter === tab.key
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* States: Loading, Error, Empty, or Product Grid */}
      {loading ? (
        <div className="text-center py-16 text-stone-500 font-medium text-sm">
          Loading workshop inventory...
        </div>
      ) : errorMsg ? (
        <div className="text-center py-8 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl text-sm font-semibold">
          Error loading catalog: {errorMsg}
        </div>
      ) : filteredToys.length === 0 ? (
        <div className="text-center py-16 text-stone-500 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-sm">
          No items found matching the selected filter.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleToys.map((item) => (
              <div
                key={item.sku}
                className="flex flex-col justify-between bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Product Image / Fallback Header */}
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

                  {/* Enrichment Category Badge */}
                  <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-stone-700 px-2.5 py-1 rounded-md shadow-sm backdrop-blur-sm border border-stone-200">
                    {item.enrichment_category || 'Enrichment'}
                  </span>

                  {/* Stock or Showroom Tag */}
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

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Sizing Badges */}
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
                  <p className="text-stone-600 text-xs leading-relaxed mb-4 line-clamp-3">
                    {item.description ||
                      'Handcrafted natural woodcraft and enrichment built right here on our Kansas workshop benches.'}
                  </p>
                </div>

                {/* Pricing & Add to Cart Footer */}
                <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">
                      Online Price
                    </span>
                    <span className="text-xl font-black text-stone-900">
                      ${Number(item.retail_price || 0).toFixed(2)}
                    </span>
                  </div>

                  {item.is_showroom_only ? (
                    <a
                      href="https://maps.google.com/?q=1842+S+Woodlawn+St,+Wichita,+KS+67218"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3.5 py-2 rounded-xl transition inline-flex items-center gap-1.5"
                    >
                      <span>🏢</span>
                      <span>Visit Showroom</span>
                    </a>
                  ) : item.web_stock > 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        addToCart({
                          sku: item.sku,
                          name: item.name,
                          retail_price: Number(item.retail_price || 0),
                          web_stock: item.web_stock,
                          image_url: item.image_url,
                          enrichment_category: item.enrichment_category,
                        })
                      }
                      className="text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-4 py-2 rounded-xl shadow-sm transition cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>🛒</span>
                      <span>Add to Cart</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="text-xs font-bold text-stone-400 bg-stone-100 px-3.5 py-2 rounded-xl cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalStorePages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-10 pt-4 border-t border-stone-200 gap-4">
              <span className="text-xs font-semibold text-stone-500">
                Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredToys.length)} of {filteredToys.length} products
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    const el = document.getElementById('products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-stone-300 bg-white text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition cursor-pointer"
                >
                  ◀ Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalStorePages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalStorePages, p + 1));
                    const el = document.getElementById('products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-stone-300 bg-white text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition cursor-pointer"
                >
                  Next ▶
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
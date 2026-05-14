"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useAllProducts } from "@/hooks/useContract";
import { CATEGORY_LABELS } from "@/lib/contracts";
import { useState } from "react";

const ALL = "All";

export default function MarketplacePage() {
  const { products, isLoading, tokenCount } = useAllProducts();
  const [activeCategory, setActiveCategory] = useState(ALL);

  const categories = [ALL, ...CATEGORY_LABELS];

  const filtered = activeCategory === ALL
    ? products
    : products.filter((p) => p && CATEGORY_LABELS[Number(p.category)] === activeCategory);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">Mantle Sepolia</p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Green asset marketplace</h1>
              <p className="text-gray-500 mt-1">
                Real African green inventory, tokenized on Mantle.
                {tokenCount > 0 && (
                  <span className="ml-2 text-green-600 font-semibold">{tokenCount} asset{tokenCount !== 1 ? "s" : ""} on-chain.</span>
                )}
              </p>
            </div>
            {/* Live badge */}
            <span className="shrink-0 hidden sm:flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>
        </div>

        {/* Sidebar + grid layout */}
        <div className="flex gap-8">
          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">Categories</p>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-green-600 text-white shadow-sm shadow-green-200"
                      : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                  }`}
                >
                  {cat}
                </button>
              ))}

              {/* Sidebar info card */}
              <div className="mt-6 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="text-xs font-semibold text-gray-700 mb-1">Platform fee</div>
                <div className="text-2xl font-bold text-green-600">2.5%</div>
                <div className="text-xs text-gray-400 mt-1">on every sale · paid in MNT</div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile category pills */}
            <div className="flex flex-wrap gap-2 mb-6 lg:hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-green-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Loading skeletons */}
            {isLoading && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
                ))}
              </div>
            )}

            {/* Product grid */}
            {!isLoading && filtered.length > 0 && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p) =>
                  p ? (
                    <ProductCard
                      key={p.tokenId}
                      tokenId={p.tokenId}
                      vendor={p.vendor}
                      category={Number(p.category)}
                      pricePerUnit={p.pricePerUnit}
                      available={p.available}
                      co2SavedKgPerUnit={p.co2SavedKgPerUnit}
                      active={p.active}
                      metadataURI={p.metadataURI}
                    />
                  ) : null
                )}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No products in this category yet</h3>
                <p className="text-gray-400 mb-6">Be the first to tokenize African green inventory on Mantle.</p>
                <a
                  href="/list"
                  className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
                >
                  List your inventory
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

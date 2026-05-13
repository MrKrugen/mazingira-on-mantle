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
    : products.filter((p) => CATEGORY_LABELS[p!.category] === activeCategory);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Green asset marketplace</h1>
          <p className="text-gray-500">
            Real African green inventory, tokenized on Mantle.
            {tokenCount > 0 && (
              <span className="ml-2 text-green-600 font-medium">{tokenCount} asset{tokenCount !== 1 ? "s" : ""} on-chain.</span>
            )}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
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

        {/* Loading */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100" />
            ))}
          </div>
        )}

        {/* Products grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No products listed yet</h3>
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

      <Footer />
    </main>
  );
}

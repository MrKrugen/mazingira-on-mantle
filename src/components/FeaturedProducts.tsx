"use client";

import Link from "next/link";
import { formatEther } from "viem";
import { useAllProducts } from "@/hooks/useContract";
import { CATEGORY_LABELS } from "@/lib/contracts";
import { parseMetadata } from "@/lib/metadata";

const CATEGORY_ICONS = ["⚡", "♻️", "🌽", "👜", "🏗️", "🌿"];
const CATEGORY_GRADIENTS = [
  "from-yellow-50 to-amber-100",
  "from-teal-50 to-cyan-100",
  "from-lime-50 to-green-100",
  "from-purple-50 to-violet-100",
  "from-orange-50 to-amber-100",
  "from-blue-50 to-sky-100",
];

export function FeaturedProducts() {
  const { products, isLoading } = useAllProducts();
  const featured = products.filter(Boolean).slice(0, 6);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">Live on Mantle</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Featured green assets</h2>
            <p className="text-gray-500 mt-2">Real African inventory, tokenized on-chain.</p>
          </div>
          <Link
            href="/marketplace"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
          >
            View all →
          </Link>
        </div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        )}

        {!isLoading && featured.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => {
              if (!p) return null;
              const category = Number(p.category);
              const { name, image } = parseMetadata(p.metadataURI);
              const icon = CATEGORY_ICONS[category] ?? "🌱";
              const gradient = CATEGORY_GRADIENTS[category] ?? "from-green-50 to-emerald-100";
              const price = formatEther(p.pricePerUnit);
              const categoryLabel = CATEGORY_LABELS[category] ?? "Green";

              return (
                <Link
                  key={p.tokenId}
                  href={`/marketplace/${p.tokenId}`}
                  className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-green-200 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className={`h-44 relative overflow-hidden bg-linear-to-br ${gradient}`}>
                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-25 select-none">
                      {icon}
                    </div>
                    {image && (
                      <img
                        src={image}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold bg-green-50 text-green-700 border border-green-100 px-2.5 py-0.5 rounded-full">
                        {icon} {categoryLabel}
                      </span>
                      <span className="text-xs text-gray-400">{p.available.toString()} avail.</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mt-2 mb-1 group-hover:text-green-700 transition-colors line-clamp-2 leading-snug">
                      {name || `Token #${p.tokenId}`}
                    </h3>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                      <span className="font-bold text-gray-900">{price} MNT</span>
                      <span className="text-xs text-emerald-600 font-medium">
                        🌱 {p.co2SavedKgPerUnit.toString()} kg CO₂
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!isLoading && featured.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🌱</div>
            <p>No products listed yet.</p>
          </div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Link href="/marketplace" className="text-sm font-semibold text-green-700">View all →</Link>
        </div>
      </div>
    </section>
  );
}

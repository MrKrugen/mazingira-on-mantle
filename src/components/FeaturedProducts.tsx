"use client";

import Link from "next/link";
import { useAllProducts } from "@/hooks/useContract";
import { ProductCard } from "@/components/ProductCard";

export function FeaturedProducts() {
  const { products, isLoading } = useAllProducts();
  const featured = products.filter(Boolean).slice(0, 6);

  return (
    <section className="bg-[#f5f7f2] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Live inventory</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-stone-950">Featured green assets</h2>
            <p className="mt-3 max-w-2xl text-stone-600">
              Real African product batches with a clearer price, supply, vendor, and carbon signal.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex w-fit rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-black text-stone-900 shadow-sm transition-colors hover:border-emerald-300 hover:text-emerald-800"
          >
            View all assets
          </Link>
        </div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[350px] animate-pulse rounded-[1.5rem] border border-stone-200 bg-white" />
            ))}
          </div>
        )}

        {!isLoading && featured.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) =>
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

        {!isLoading && featured.length === 0 && (
          <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-white p-10 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-3xl bg-lime-100 text-sm font-black text-emerald-950">
              M
            </div>
            <h3 className="text-lg font-black text-stone-900">No products listed yet</h3>
            <p className="mt-2 text-sm text-stone-500">The marketplace is ready for its first tokenized green inventory batch.</p>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useAllProducts } from "@/hooks/useContract";
import { CATEGORY_LABELS } from "@/lib/contracts";
import { parseMetadata } from "@/lib/metadata";

const ALL = "All";

export default function MarketplacePage() {
  const { products, isLoading, tokenCount } = useAllProducts();
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [search, setSearch] = useState("");

  const categories = [ALL, ...CATEGORY_LABELS];

  const productRows = useMemo(
    () =>
      products
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .map((p) => {
          const metadata = parseMetadata(p.metadataURI);
          return {
            ...p,
            name: metadata.name || `Token #${p.tokenId}`,
            categoryLabel: CATEGORY_LABELS[Number(p.category)] ?? "Green Product",
          };
        }),
    [products]
  );

  const filtered = productRows.filter((p) => {
    const categoryMatch = activeCategory === ALL || p.categoryLabel === activeCategory;
    const q = search.trim().toLowerCase();
    const searchMatch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.vendor.toLowerCase().includes(q);
    return categoryMatch && searchMatch;
  });

  const topSupply = [...productRows]
    .sort((a, b) => Number(b.available - a.available))
    .slice(0, 3);
  const recent = [...productRows].sort((a, b) => b.tokenId - a.tokenId).slice(0, 4);

  return (
    <main className="min-h-screen bg-[#f5f7f2]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-28 pb-20">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#132317] text-white shadow-2xl shadow-emerald-950/15">
          <div className="absolute inset-0 moire-panel opacity-40" />
          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-lime-300 glow-lime">Mantle marketplace</p>
              <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight">
                Green{" "}
                <span className="text-lime-300 glow-lime">asset exchange</span>
              </h1>
              <p className="mt-4 max-w-2xl text-stone-300 leading-7">
                Search tokenized African inventory, compare category and carbon signals, then move straight into the purchase flow.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 min-w-56">
              <div className="text-4xl font-black text-lime-200 glow-lime">{tokenCount}</div>
              <div className="mt-1 text-sm font-semibold text-stone-300">
                asset{tokenCount === 1 ? "" : "s"} on-chain
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-lime-300 px-3 py-1 text-xs font-black text-stone-950">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-900" />
                Live
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Quick actions</p>
              <div className="mt-4 grid gap-2">
                <Link href="/list" className="rounded-2xl bg-[#132317] px-4 py-3 text-sm font-black text-white hover:bg-stone-800">
                  List inventory
                </Link>
                <Link href="/agent" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm font-black text-stone-800 hover:border-emerald-300">
                  Ask AI agent
                </Link>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Categories</p>
              <div className="mt-4 space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full rounded-2xl px-3 py-2.5 text-left text-sm font-bold transition-all ${
                      activeCategory === cat
                        ? "bg-lime-200 text-stone-950"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-950"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Top supply</p>
              <div className="mt-4 space-y-3">
                {topSupply.length > 0 ? topSupply.map((p) => (
                  <Link key={p.tokenId} href={`/marketplace/${p.tokenId}`} className="block rounded-2xl bg-stone-50 p-3 hover:bg-lime-50">
                    <p className="line-clamp-1 text-sm font-black text-stone-900">{p.name}</p>
                    <p className="mt-1 text-xs text-stone-500">{p.available.toString()} units available</p>
                  </Link>
                )) : (
                  <p className="text-sm text-stone-500">No live listings yet.</p>
                )}
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="rounded-[1.5rem] border border-stone-200 bg-white p-3 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex-1 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                  <label htmlFor="market-search" className="sr-only">Search marketplace</label>
                  <input
                    id="market-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search product, category, or wallet address"
                    className="w-full bg-transparent text-sm font-semibold text-stone-900 outline-none placeholder:text-stone-400"
                  />
                </div>
                <Link
                  href="/list"
                  className="rounded-2xl bg-lime-300 px-5 py-3 text-center text-sm font-black text-stone-950 hover:bg-lime-200"
                >
                  List inventory
                </Link>
              </div>
            </div>

            <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2 lg:hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${
                    activeCategory === cat ? "bg-[#132317] text-white" : "bg-white text-stone-600 ring-1 ring-stone-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {isLoading && (
              <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[350px] animate-pulse rounded-[1.5rem] border border-stone-200 bg-white" />
                ))}
              </div>
            )}

            {!isLoading && filtered.length > 0 && (
              <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p) => (
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
                ))}
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="mt-6 rounded-[1.75rem] border border-dashed border-stone-300 bg-white p-12 text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-3xl bg-lime-100 text-sm font-black text-emerald-950">
                  M
                </div>
                <h3 className="text-lg font-black text-stone-900">No matching assets</h3>
                <p className="mt-2 text-sm text-stone-500">Try a different category, search term, or list the first inventory batch.</p>
              </div>
            )}
          </section>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Recent activity</p>
              <div className="mt-4 space-y-3">
                {recent.length > 0 ? recent.map((p) => (
                  <Link key={p.tokenId} href={`/marketplace/${p.tokenId}`} className="block rounded-2xl border border-stone-100 p-3 hover:border-emerald-200">
                    <div className="flex items-center justify-between gap-3">
                      <p className="line-clamp-1 text-sm font-black text-stone-900">Token #{p.tokenId}</p>
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
                        Live
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-stone-500">{p.name}</p>
                  </Link>
                )) : (
                  <p className="text-sm text-stone-500">New listings will appear here.</p>
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-lime-300 p-5 text-stone-950 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-900">Investor read</p>
              <h3 className="mt-3 text-xl font-black leading-tight">Real stock, visible terms, on-chain settlement.</h3>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                Each card keeps price, unit, vendor, available supply, and CO2 impact close to the action.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}

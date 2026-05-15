"use client";

import { useAllProducts } from "@/hooks/useContract";

export function ImpactStats() {
  const { tokenCount } = useAllProducts();

  const stats = [
    { value: tokenCount > 0 ? `${tokenCount}` : "0", label: "Assets on-chain", badge: "Live" },
    { value: "6", label: "Green categories", badge: "Curated" },
    { value: "2.5%", label: "Platform fee", badge: "Fixed" },
    { value: "AI", label: "Price discovery", badge: "Assisted" },
  ];

  return (
    <section className="bg-[#f5f7f2] pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 rounded-[1.75rem] border border-stone-200 bg-white p-3 shadow-xl shadow-stone-950/5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl bg-stone-50 p-5 ring-1 ring-stone-100">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{s.badge}</span>
                <span className="h-2 w-2 rounded-full bg-lime-400" />
              </div>
              <div className="mt-5 text-3xl font-black tracking-tight text-stone-950">{s.value}</div>
              <div className="mt-1 text-sm font-semibold text-stone-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useAllProducts } from "@/hooks/useContract";

export function ImpactStats() {
  const { tokenCount } = useAllProducts();

  const stats = [
    { value: tokenCount > 0 ? `${tokenCount}` : "—", label: "Assets on-chain", badge: "live" },
    { value: "6", label: "Green categories", badge: "active" },
    { value: "2.5%", label: "Platform fee", badge: "fixed" },
    { value: "Claude", label: "AI price discovery", badge: "AI" },
  ];

  return (
    <section className="py-14 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all group"
            >
              <div className="text-3xl font-bold text-gray-900 tracking-tight mb-1 group-hover:text-green-700 transition-colors">
                {s.value}
              </div>
              <div className="text-sm text-gray-500 mb-3">{s.label}</div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full">
                {s.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

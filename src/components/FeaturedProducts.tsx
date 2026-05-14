"use client";

import Link from "next/link";

// Placeholder cards — replaced with live on-chain data in Week 2
const DEMO_PRODUCTS = [
  { id: 1, name: "Biomass Briquettes — 500kg Batch", vendor: "Nairobi Green Fuels", category: "Clean Energy", price: "0.15 MNT/unit", co2: "120", available: 500, image: "🪵" },
  { id: 2, name: "Recycled PET Pellets — 200kg", vendor: "WasteNot Kenya", category: "Waste & Recycling", price: "0.08 MNT/unit", co2: "45", available: 200, image: "♻️" },
  { id: 3, name: "Organic Maize — 1 Tonne Lot", vendor: "Rift Valley Organics", category: "Sustainable Agri", price: "0.25 MNT/unit", co2: "30", available: 1000, image: "🌽" },
  { id: 4, name: "Upcycled Ankara Tote Bags ×50", vendor: "Jua Kali Studios", category: "Upcycled Fashion", price: "1.2 MNT/unit", co2: "8", available: 50, image: "👜" },
  { id: 5, name: "Solar Panel Array — 5kW", vendor: "SunPower EA", category: "Clean Energy", price: "120 MNT/unit", co2: "2400", available: 10, image: "☀️" },
  { id: 6, name: "Compressed Earth Blocks ×1000", vendor: "BuildGreen Tz", category: "Green Building", price: "0.05 MNT/unit", co2: "180", available: 1000, image: "🧱" },
];

export function FeaturedProducts() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured green assets</h2>
            <p className="text-gray-500">Real African inventory, tokenized on Mantle.</p>
          </div>
          <Link href="/marketplace" className="text-sm font-semibold text-green-700 hover:text-green-800">
            View all →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_PRODUCTS.map((p) => (
            <Link key={p.id} href={`/marketplace/${p.id}`} className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-green-200 transition-all">
              {/* Image area */}
              <div className="h-32 bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center text-5xl">
                {p.image}
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{p.category}</span>
                  <span className="text-xs text-gray-400">{p.available} available</span>
                </div>
                <h3 className="font-semibold text-gray-900 mt-2 mb-1 group-hover:text-green-700 transition-colors">{p.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{p.vendor}</p>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{p.price}</span>
                  <span className="text-xs text-emerald-600 font-medium">🌱 {p.co2} kg CO₂ saved</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

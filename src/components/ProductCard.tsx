"use client";

import Link from "next/link";
import { formatEther } from "viem";
import { CATEGORY_LABELS } from "@/lib/contracts";
import { parseMetadata } from "@/lib/metadata";

const CATEGORY_ICONS = ["⚡", "♻️", "🌾", "👜", "🪵", "🌿"];
const CATEGORY_GRADIENTS = [
  "from-amber-100 via-yellow-50 to-white",
  "from-cyan-100 via-teal-50 to-white",
  "from-lime-100 via-green-50 to-white",
  "from-violet-100 via-fuchsia-50 to-white",
  "from-orange-100 via-stone-50 to-white",
  "from-sky-100 via-blue-50 to-white",
];

type ProductCardProps = {
  tokenId: number;
  vendor: string;
  category: number;
  pricePerUnit: bigint;
  available: bigint;
  co2SavedKgPerUnit: bigint;
  active: boolean;
  metadataURI: string;
};

export function ProductCard({
  tokenId,
  vendor,
  category,
  pricePerUnit,
  available,
  co2SavedKgPerUnit,
  active,
  metadataURI,
}: ProductCardProps) {
  if (!active) return null;

  const { name, image } = parseMetadata(metadataURI);
  const categoryLabel = CATEGORY_LABELS[category] ?? "Green Product";
  const icon = CATEGORY_ICONS[category] ?? "🌿";
  const gradient = CATEGORY_GRADIENTS[category] ?? "from-green-100 via-emerald-50 to-white";
  const priceFormatted = formatEther(pricePerUnit);
  const shortVendor = `${vendor.slice(0, 6)}...${vendor.slice(-4)}`;
  const displayName = name || `Token #${tokenId}`;

  return (
    <Link
      href={`/marketplace/${tokenId}`}
      className="group block overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm shadow-stone-950/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-950/10"
    >
      <div className={`relative h-44 overflow-hidden bg-linear-to-br ${gradient}`}>
        <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/75 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-stone-700 shadow-sm">
          {categoryLabel}
        </div>
        <div className="absolute bottom-4 right-4 rounded-2xl bg-white/80 px-3 py-1.5 text-right shadow-sm backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500">Available</p>
          <p className="text-base font-black text-stone-950">{available.toString()}</p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl opacity-90 drop-shadow select-none">{icon}</span>
        </div>

        {image && (
          <img
            src={image}
            alt={displayName}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
        {available === 0n && (
          <div className="absolute inset-0 grid place-items-center bg-stone-950/55">
            <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-stone-950">
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-black leading-snug text-stone-950 transition-colors group-hover:text-emerald-800">
          {displayName}
        </h3>
        <p className="mt-1 text-xs font-mono text-stone-400">Vendor {shortVendor}</p>

        <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-3 border-t border-stone-100 pt-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Price</p>
            <p className="mt-0.5 text-xl font-black tracking-tight text-stone-950">{priceFormatted} MNT</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-2.5 py-1.5 text-right text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
            {co2SavedKgPerUnit.toString()} kg CO2
          </div>
        </div>
      </div>
    </Link>
  );
}

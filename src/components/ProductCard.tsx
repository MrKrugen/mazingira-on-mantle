"use client";

import Link from "next/link";
import { formatEther } from "viem";
import { CATEGORY_LABELS } from "@/lib/contracts";
import { parseMetadata } from "@/lib/metadata";

const CATEGORY_ICONS = ["⚡", "♻️", "🌽", "👜", "🏗️", "🌿"];
const CATEGORY_GRADIENTS = [
  "from-yellow-50 to-amber-100",   // Clean Energy
  "from-teal-50 to-cyan-100",      // Waste & Recycling
  "from-lime-50 to-green-100",     // Sustainable Agri
  "from-purple-50 to-violet-100",  // Upcycled Fashion
  "from-orange-50 to-amber-100",   // Green Building
  "from-blue-50 to-sky-100",       // Environmental Services
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
  const icon = CATEGORY_ICONS[category] ?? "🌱";
  const gradient = CATEGORY_GRADIENTS[category] ?? "from-green-50 to-emerald-100";
  const priceFormatted = formatEther(pricePerUnit);
  const shortVendor = `${vendor.slice(0, 6)}...${vendor.slice(-4)}`;
  const displayName = name || `Token #${tokenId}`;

  return (
    <Link
      href={`/marketplace/${tokenId}`}
      className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-green-200 transition-all"
    >
      {/* Image / gradient hero */}
      <div className={`h-44 relative overflow-hidden bg-linear-to-br ${gradient}`}>
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 select-none">
          {icon}
        </div>
        {image && (
          <img
            src={image}
            alt={displayName}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
        {/* Sold-out overlay */}
        {available === 0n && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-widest uppercase">Sold out</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full">
            {icon} {categoryLabel}
          </span>
          <span className="text-xs text-gray-400">{available.toString()} avail.</span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-700 transition-colors line-clamp-2 leading-snug">
          {displayName}
        </h3>
        <p className="text-xs text-gray-400 font-mono mb-3">{shortVendor}</p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="font-bold text-gray-900">{priceFormatted} MNT</span>
          <span className="text-xs text-emerald-600 font-medium">
            🌱 {co2SavedKgPerUnit.toString()} kg CO₂
          </span>
        </div>
      </div>
    </Link>
  );
}

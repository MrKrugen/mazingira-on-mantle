"use client";

import Link from "next/link";
import { formatEther } from "viem";
import { CATEGORY_LABELS } from "@/lib/contracts";

const CATEGORY_ICONS = ["⚡", "♻️", "🌽", "👜", "🏗️", "🌿"];

type ProductCardProps = {
  tokenId: number;
  name?: string;
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

  const categoryLabel = CATEGORY_LABELS[category] ?? "Green Product";
  const icon = CATEGORY_ICONS[category] ?? "🌱";
  const priceFormatted = formatEther(pricePerUnit);
  const shortVendor = `${vendor.slice(0, 6)}...${vendor.slice(-4)}`;

  // Use metadataURI as display name if it's a plain string, else token ID
  const displayName = metadataURI.startsWith("http") || metadataURI.startsWith("ipfs")
    ? `Token #${tokenId}`
    : metadataURI || `Token #${tokenId}`;

  return (
    <Link
      href={`/marketplace/${tokenId}`}
      className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-green-200 transition-all"
    >
      <div className="h-32 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-5xl">
        {icon}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            {categoryLabel}
          </span>
          <span className="text-xs text-gray-400">{available.toString()} avail.</span>
        </div>

        <h3 className="font-semibold text-gray-900 mt-2 mb-1 group-hover:text-green-700 transition-colors line-clamp-1">
          {displayName}
        </h3>
        <p className="text-xs text-gray-400 font-mono mb-3">{shortVendor}</p>

        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">{priceFormatted} MNT</span>
          <span className="text-xs text-emerald-600 font-medium">
            🌱 {co2SavedKgPerUnit.toString()} kg CO₂
          </span>
        </div>
      </div>
    </Link>
  );
}

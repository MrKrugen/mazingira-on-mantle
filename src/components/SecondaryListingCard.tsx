"use client";

import { useState } from "react";
import Link from "next/link";

export type SecondaryListing = {
  id: string;
  tokenId: number;
  seller: string;
  quantity: number;
  askPriceMNT: string;
  listedAt: string;
  status: "active" | "sold" | "cancelled";
  productName?: string;
  category?: number;
  co2SavedKgPerUnit?: number;
  primaryPriceMNT?: string;
  freeStorageDays?: number;
  maxStorageDays?: number;
};

const CATEGORY_ICONS = ["⚡", "♻️", "🌾", "👜", "🪵", "🌿"];
const CATEGORY_GRADIENTS = [
  "from-amber-100 to-yellow-50",
  "from-cyan-100 to-teal-50",
  "from-lime-100 to-green-50",
  "from-violet-100 to-fuchsia-50",
  "from-orange-100 to-stone-50",
  "from-sky-100 to-blue-50",
];
const CATEGORY_LABELS = [
  "Clean Energy",
  "Waste & Recycling",
  "Sustainable Agri",
  "Upcycled Fashion",
  "Green Building",
  "Environmental Services",
];

type Props = {
  listing: SecondaryListing;
  isOwner?: boolean;
  onCancel?: (id: string) => void;
};

export function SecondaryListingCard({ listing, isOwner, onCancel }: Props) {
  const [showContact, setShowContact] = useState(false);
  const [copied, setCopied] = useState(false);

  const cat = listing.category ?? 5;
  const icon = CATEGORY_ICONS[cat] ?? "🌿";
  const gradient = CATEGORY_GRADIENTS[cat] ?? "from-green-100 to-emerald-50";
  const categoryLabel = CATEGORY_LABELS[cat] ?? "Green Product";
  const displayName = listing.productName ?? `Token #${listing.tokenId}`;
  const shortSeller = `${listing.seller.slice(0, 8)}...${listing.seller.slice(-6)}`;

  // Premium / discount vs primary
  const primaryPrice = listing.primaryPriceMNT ? parseFloat(listing.primaryPriceMNT) : null;
  const askPrice = parseFloat(listing.askPriceMNT);
  const premiumPct =
    primaryPrice && !isNaN(askPrice) && primaryPrice > 0
      ? ((askPrice - primaryPrice) / primaryPrice) * 100
      : null;

  // Storage mini-bar
  const daysSinceListed = Math.floor(
    (Date.now() - new Date(listing.listedAt).getTime()) / 86_400_000
  );
  const hasStorageBar =
    listing.freeStorageDays !== undefined && listing.maxStorageDays !== undefined;
  const storagePhase =
    !hasStorageBar ? null
    : daysSinceListed <= listing.freeStorageDays! ? "free"
    : daysSinceListed >= listing.maxStorageDays! - 10 ? "critical"
    : "paying";
  const storagePct = hasStorageBar
    ? Math.min(100, (daysSinceListed / listing.maxStorageDays!) * 100)
    : 0;
  const freeLinePct = hasStorageBar
    ? (listing.freeStorageDays! / listing.maxStorageDays!) * 100
    : 0;

  const timeLabel =
    daysSinceListed === 0 ? "today"
    : daysSinceListed === 1 ? "yesterday"
    : `${daysSinceListed}d ago`;

  function copyAddress() {
    navigator.clipboard.writeText(listing.seller);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image area */}
      <div className={`relative h-28 bg-linear-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-5xl opacity-90 drop-shadow select-none">{icon}</span>

        {/* Top-left: category */}
        <div className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-stone-600 shadow-sm">
          {categoryLabel}
        </div>

        {/* Top-right: token ID */}
        <div className="absolute right-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black text-stone-600 shadow-sm">
          #{listing.tokenId}
        </div>

        {/* Bottom-right: SECONDARY badge */}
        <div className="absolute bottom-3 right-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm">
          Secondary
        </div>

        {isOwner && (
          <div className="absolute bottom-3 left-3 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[9px] font-black text-white shadow-sm">
            Your listing
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-black text-stone-900">{displayName}</h3>

        {/* Seller row with inline copy */}
        <div className="mt-1 flex items-center gap-1.5">
          <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-stone-400">
            {shortSeller}
          </p>
          <button
            onClick={copyAddress}
            className="shrink-0 rounded-md bg-stone-100 px-1.5 py-0.5 text-[9px] font-black text-stone-500 transition-colors hover:bg-lime-100 hover:text-emerald-700"
          >
            {copied ? "✓" : "Copy"}
          </button>
        </div>

        {/* Price / qty stats */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-stone-50 p-2.5 text-center ring-1 ring-stone-100">
            <p className="text-base font-black text-stone-950">{listing.askPriceMNT}</p>
            <p className="text-[10px] font-bold text-stone-400">MNT / unit</p>
          </div>
          <div className="rounded-2xl bg-stone-50 p-2.5 text-center ring-1 ring-stone-100">
            <p className="text-base font-black text-stone-950">{listing.quantity}</p>
            <p className="text-[10px] font-bold text-stone-400">
              unit{listing.quantity !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Premium / discount pill */}
        {premiumPct !== null && !isNaN(premiumPct) && (
          <div
            className={`mt-2 rounded-xl px-3 py-1.5 text-center text-[10px] font-black ${
              premiumPct > 0
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {premiumPct > 0
              ? `+${premiumPct.toFixed(1)}% vs primary`
              : `${Math.abs(premiumPct).toFixed(1)}% discount vs primary`}
          </div>
        )}

        {/* Storage mini-bar */}
        {hasStorageBar && (
          <div className="mt-2">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className="absolute inset-y-0 left-0 bg-emerald-200"
                style={{ width: `${freeLinePct}%` }}
              />
              <div
                className={`absolute inset-y-0 left-0 rounded-full ${
                  storagePhase === "free"
                    ? "bg-emerald-400"
                    : storagePhase === "critical"
                    ? "bg-red-500"
                    : "bg-amber-400"
                }`}
                style={{ width: `${storagePct}%` }}
              />
            </div>
            <p className="mt-0.5 text-center text-[9px] text-stone-400">
              {daysSinceListed}d of {listing.maxStorageDays}d storage used
            </p>
          </div>
        )}

        {listing.co2SavedKgPerUnit !== undefined && (
          <div className="mt-2 flex justify-center">
            <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-[10px] font-black text-emerald-700">
              {listing.co2SavedKgPerUnit} kg CO₂/unit
            </span>
          </div>
        )}

        <p className="mt-1 text-center text-[10px] text-stone-400">Listed {timeLabel}</p>

        {/* Actions */}
        <div className="mt-3 space-y-2">
          {isOwner ? (
            <button
              onClick={() => onCancel?.(listing.id)}
              className="w-full rounded-2xl border border-red-200 py-2 text-xs font-black text-red-600 transition-colors hover:bg-red-50"
            >
              Cancel Listing
            </button>
          ) : !showContact ? (
            <button
              onClick={() => setShowContact(true)}
              className="w-full rounded-2xl bg-[#132317] py-2.5 text-sm font-black text-white transition-colors hover:bg-stone-800"
            >
              Buy Tokens
            </button>
          ) : (
            <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-xs font-black text-emerald-800">Contact Seller</p>
              <p className="text-[11px] leading-5 text-stone-600">
                Send{" "}
                <span className="font-black text-stone-900">
                  {(parseFloat(listing.askPriceMNT) * listing.quantity).toFixed(4)} MNT
                </span>{" "}
                to the seller and they will transfer the token to your wallet.
              </p>
              <div className="flex gap-2">
                <code className="min-w-0 flex-1 truncate rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-[10px] font-mono text-stone-700">
                  {listing.seller}
                </code>
                <button
                  onClick={copyAddress}
                  className="shrink-0 rounded-lg bg-lime-100 px-2.5 py-1.5 text-[10px] font-black text-emerald-800 transition-colors hover:bg-lime-200"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <Link
                href={`/marketplace/${listing.tokenId}`}
                className="block text-center text-[11px] font-bold text-emerald-700 hover:underline"
              >
                View original listing →
              </Link>
              <button
                onClick={() => setShowContact(false)}
                className="w-full text-[10px] text-stone-400 transition-colors hover:text-stone-600"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

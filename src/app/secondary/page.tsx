"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SecondaryListingCard } from "@/components/SecondaryListingCard";
import type { SecondaryListing } from "@/components/SecondaryListingCard";
import { useHeldTokens, useAllProducts } from "@/hooks/useContract";
import { parseMetadata } from "@/lib/metadata";

const CATEGORY_ICONS = ["⚡", "♻️", "🌾", "👜", "🪵", "🌿"];

function SecondaryPageInner() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "sell" ? "sell" : "buy";
  const preselectedId = searchParams.get("tokenId")
    ? parseInt(searchParams.get("tokenId")!, 10)
    : null;

  const { address, isConnected } = useAccount();
  const { heldTokens, isLoading: heldLoading } = useHeldTokens(address);
  const { products, isLoading: productsLoading } = useAllProducts();

  const [listings, setListings] = useState<SecondaryListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(preselectedId);
  const [quantity, setQuantity] = useState(1);
  const [askPrice, setAskPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  useEffect(() => {
    loadListings();
  }, []);

  function loadListings() {
    setListingsLoading(true);
    fetch("/api/secondary")
      .then((r) => r.json())
      .then((data) => setListings(data.listings ?? []))
      .catch(() => {})
      .finally(() => setListingsLoading(false));
  }

  async function cancelListing(id: string) {
    await fetch("/api/secondary", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "cancelled" }),
    });
    loadListings();
  }

  async function submitListing(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTokenId || !askPrice || !address) return;
    setSubmitting(true);

    const product = products.find(
      (p): p is NonNullable<typeof p> => !!p && p.tokenId === selectedTokenId
    );
    const { name: productName } = product
      ? parseMetadata(product.metadataURI)
      : { name: undefined };
    const held = heldTokens.find((h) => h.tokenId === selectedTokenId);

    await fetch("/api/secondary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tokenId: selectedTokenId,
        seller: address,
        quantity: Math.min(quantity, held?.quantity ?? quantity),
        askPriceMNT: askPrice,
        productName: productName ?? `Token #${selectedTokenId}`,
        category: product ? Number(product.category) : undefined,
        co2SavedKgPerUnit: product ? Number(product.co2SavedKgPerUnit) : undefined,
        primaryPriceMNT: product ? formatEther(product.pricePerUnit) : undefined,
        freeStorageDays: product ? Number(product.freeStorageDays) : undefined,
        maxStorageDays: product ? Number(product.maxStorageDays) : undefined,
      }),
    });

    setSubmitDone(true);
    setSubmitting(false);
    loadListings();
  }

  // ── Derived values ──────────────────────────────────────────────────────────

  const selectedProduct = products.find(
    (p): p is NonNullable<typeof p> => !!p && p.tokenId === selectedTokenId
  );
  const selectedHeld = heldTokens.find((h) => h.tokenId === selectedTokenId);
  const { name: selectedProductName } = selectedProduct
    ? parseMetadata(selectedProduct.metadataURI)
    : { name: null };

  // Live margin calculator
  const primaryPriceNum = selectedProduct
    ? parseFloat(formatEther(selectedProduct.pricePerUnit))
    : null;
  const askPriceNum = askPrice !== "" ? parseFloat(askPrice) : null;
  const marginPct =
    primaryPriceNum && askPriceNum !== null && !isNaN(askPriceNum) && primaryPriceNum > 0
      ? ((askPriceNum - primaryPriceNum) / primaryPriceNum) * 100
      : null;

  // Stats bar
  const activeListings = listings.length;
  const totalVolumeMNT = listings
    .reduce((s, l) => s + parseFloat(l.askPriceMNT) * l.quantity, 0)
    .toFixed(2);
  const premiumEntries = listings.filter(
    (l) => l.primaryPriceMNT && parseFloat(l.primaryPriceMNT) > 0
  );
  const avgPremiumPct =
    premiumEntries.length > 0
      ? premiumEntries.reduce((s, l) => {
          const ask = parseFloat(l.askPriceMNT);
          const primary = parseFloat(l.primaryPriceMNT!);
          return s + ((ask - primary) / primary) * 100;
        }, 0) / premiumEntries.length
      : null;
  const avgPremiumDisplay = listingsLoading
    ? "..."
    : avgPremiumPct === null
    ? "--"
    : `${avgPremiumPct > 0 ? "+" : ""}${avgPremiumPct.toFixed(1)}%`;
  const uniqueSellers = new Set(listings.map((l) => l.seller)).size;

  const myListings = listings.filter(
    (l) => l.seller.toLowerCase() === address?.toLowerCase()
  );
  const otherListings = listings.filter(
    (l) => l.seller.toLowerCase() !== address?.toLowerCase()
  );

  const STATS = [
    { value: listingsLoading ? "..." : String(activeListings), label: "Active Listings" },
    { value: listingsLoading ? "..." : `${totalVolumeMNT} MNT`, label: "Listed Volume" },
    { value: avgPremiumDisplay, label: "Avg vs Primary" },
    { value: listingsLoading ? "..." : String(uniqueSellers), label: "Holders Trading" },
  ];

  return (
    <main className="min-h-screen bg-[#f5f7f2]">
      <Navbar />

      {/* ── Dark hero header ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0f2318] pt-28 sm:pt-32">
        <div className="moire-panel pointer-events-none absolute inset-0 opacity-60" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-10 pb-8 sm:pt-14">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-bold text-lime-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300" />
              Peer-to-peer trading · Mantle Sepolia
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Trade{" "}
              <span className="text-lime-300 glow-lime">Green</span>{" "}
              Tokens
            </h1>

            <p className="mt-4 max-w-xl text-base sm:text-lg leading-7 text-stone-300">
              Buy and sell Mazingira RWA tokens peer-to-peer. Listings are matched
              off-chain; token transfers are settled directly between wallets.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-8 sm:pb-10">
            {STATS.map(({ value, label }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                <div className="text-xl font-black text-lime-200 glow-lime">{value}</div>
                <div className="mt-1 text-xs text-stone-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Tab pills */}
        <div className="my-8 flex w-fit items-center gap-1 rounded-2xl border border-stone-200 bg-white p-1 shadow-sm">
          <Link
            href="/secondary?tab=buy"
            className={`rounded-xl px-5 py-2 text-sm font-black transition-all ${
              tab === "buy"
                ? "bg-lime-300 text-stone-950 shadow-sm"
                : "text-stone-400 hover:text-stone-700"
            }`}
          >
            Buy Tokens
          </Link>
          <Link
            href="/secondary?tab=sell"
            className={`rounded-xl px-5 py-2 text-sm font-black transition-all ${
              tab === "sell"
                ? "bg-lime-300 text-stone-950 shadow-sm"
                : "text-stone-400 hover:text-stone-700"
            }`}
          >
            List My Tokens
          </Link>
        </div>

        {/* ── Buy tab ── */}
        {tab === "buy" && (
          <div>
            {listingsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-72 animate-pulse rounded-3xl bg-stone-200" />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="overflow-hidden rounded-4xl border border-stone-200 bg-white shadow-sm">
                {/* Decorative dark top */}
                <div className="moire-panel relative flex items-center justify-center overflow-hidden bg-[#0f2318] py-14">
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-900/20 to-transparent" />
                  <span className="relative z-10 select-none text-7xl opacity-90 drop-shadow-lg">🌿</span>
                </div>
                <div className="px-8 py-10 text-center">
                  <h3 className="text-2xl font-black text-stone-900">
                    Secondary market is open
                  </h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-stone-500">
                    Token holders can list here without vendor registration.
                    Be the first to trade.
                  </p>
                  <Link
                    href="/secondary?tab=sell"
                    className="glow-btn-lime mt-6 inline-block rounded-2xl bg-lime-300 px-7 py-3 text-sm font-black text-stone-950 transition-colors hover:bg-lime-200"
                  >
                    List a Token
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm font-bold text-stone-500">
                  {listings.length} active listing{listings.length !== 1 ? "s" : ""}
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {myListings.map((l) => (
                    <SecondaryListingCard
                      key={l.id}
                      listing={l}
                      isOwner
                      onCancel={cancelListing}
                    />
                  ))}
                  {otherListings.map((l) => (
                    <SecondaryListingCard key={l.id} listing={l} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Sell tab ── */}
        {tab === "sell" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Holdings panel */}
            <div className="rounded-4xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-950/5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
                Your Holdings
              </p>

              {!isConnected ? (
                <p className="mt-4 text-sm text-stone-500">
                  Connect your wallet to see your token holdings.
                </p>
              ) : heldLoading || productsLoading ? (
                <div className="mt-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-2xl bg-stone-100" />
                  ))}
                </div>
              ) : heldTokens.length === 0 ? (
                <div className="mt-6 py-8 text-center">
                  <p className="text-sm text-stone-400">No tokens held yet.</p>
                  <Link
                    href="/marketplace"
                    className="mt-2 block text-sm font-bold text-emerald-700 hover:underline"
                  >
                    Browse primary market →
                  </Link>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {heldTokens.map((h) => {
                    const p = products.find(
                      (prod): prod is NonNullable<typeof prod> =>
                        !!prod && prod.tokenId === h.tokenId
                    );
                    const { name } = p ? parseMetadata(p.metadataURI) : { name: null };
                    const cat = p ? Number(p.category) : 5;
                    const icon = CATEGORY_ICONS[cat] ?? "🌿";
                    const isSelected = selectedTokenId === h.tokenId;

                    return (
                      <button
                        key={h.tokenId}
                        onClick={() => {
                          setSelectedTokenId(h.tokenId);
                          setQuantity(1);
                          setSubmitDone(false);
                          setAskPrice("");
                        }}
                        className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                          isSelected
                            ? "border-lime-400 bg-lime-50 shadow-sm"
                            : "border-stone-100 bg-stone-50 hover:border-lime-200 hover:bg-lime-50/50"
                        }`}
                      >
                        <span className="text-2xl">{icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-stone-900">
                            {name ?? `Token #${h.tokenId}`}
                          </p>
                          <p className="text-xs text-stone-500">
                            #{h.tokenId} &middot; {h.quantity} unit
                            {h.quantity !== 1 ? "s" : ""} held
                          </p>
                        </div>
                        {p && (
                          <span className="shrink-0 text-xs font-black text-emerald-700">
                            {formatEther(p.pricePerUnit)} MNT
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Listing form */}
            <div className="rounded-4xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-950/5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
                Create Listing
              </p>

              {!isConnected ? (
                <p className="mt-4 text-sm text-stone-500">
                  Connect your wallet to list tokens.
                </p>
              ) : !selectedTokenId ? (
                <p className="mt-6 text-sm text-stone-400">
                  ← Select a token from your holdings to list it.
                </p>
              ) : submitDone ? (
                <div className="mt-6 space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-xl">
                    ✓
                  </div>
                  <p className="font-black text-emerald-800">Listing created!</p>
                  <p className="text-sm text-stone-600">
                    Your token is now visible in the Buy tab.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitDone(false);
                      setAskPrice("");
                      setSelectedTokenId(null);
                    }}
                    className="text-xs font-black text-emerald-700 hover:underline"
                  >
                    List another token
                  </button>
                </div>
              ) : (
                <form onSubmit={submitListing} className="mt-4 space-y-4">
                  {/* Selected token preview */}
                  <div className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-3">
                    <span className="text-2xl">
                      {CATEGORY_ICONS[
                        selectedProduct ? Number(selectedProduct.category) : 5
                      ] ?? "🌿"}
                    </span>
                    <div>
                      <p className="text-sm font-black text-stone-900">
                        {selectedProductName ?? `Token #${selectedTokenId}`}
                      </p>
                      <p className="text-xs text-stone-500">
                        #{selectedTokenId} &middot;{" "}
                        {selectedHeld?.quantity ?? 0} unit
                        {(selectedHeld?.quantity ?? 0) !== 1 ? "s" : ""} available
                      </p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                      Quantity to List
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={selectedHeld?.quantity ?? 1}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
                      }
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
                    />
                  </div>

                  {/* Ask price + live margin */}
                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                      Ask Price{" "}
                      <span className="font-normal normal-case text-stone-400">(MNT per unit)</span>
                    </label>
                    {selectedProduct && (
                      <p className="mb-1.5 text-[11px] text-stone-400">
                        Primary price: {formatEther(selectedProduct.pricePerUnit)} MNT
                      </p>
                    )}
                    <input
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      value={askPrice}
                      onChange={(e) => setAskPrice(e.target.value)}
                      placeholder="0.0000"
                      required
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
                    />

                    {/* Live margin indicator */}
                    {marginPct !== null && !isNaN(marginPct) && (
                      <div
                        className={`mt-2 flex items-center justify-between rounded-xl border px-3 py-2 ${
                          marginPct > 5
                            ? "border-amber-200 bg-amber-50"
                            : marginPct < -5
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-stone-200 bg-stone-50"
                        }`}
                      >
                        <span className="text-[11px] font-bold text-stone-500">
                          vs primary price
                        </span>
                        <span
                          className={`text-xs font-black ${
                            marginPct > 5
                              ? "text-amber-700"
                              : marginPct < -5
                              ? "text-emerald-700"
                              : "text-stone-600"
                          }`}
                        >
                          {marginPct > 0
                            ? `+${marginPct.toFixed(1)}%`
                            : `${marginPct.toFixed(1)}%`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Disclaimer */}
                  <div className="flex items-start gap-2 rounded-2xl border border-stone-100 bg-stone-50 p-3">
                    <span className="mt-px shrink-0 text-stone-300">ⓘ</span>
                    <p className="text-[11px] leading-5 text-stone-500">
                      Listings are off-chain only. Buyers contact you with your wallet
                      address; you transfer the token after receiving payment.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !askPrice}
                    className="w-full rounded-2xl bg-[#0f2318] py-3.5 text-sm font-black text-white transition-colors hover:bg-stone-800 disabled:bg-stone-300"
                  >
                    {submitting ? "Creating listing..." : "Create Listing"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function SecondaryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f5f7f2]">
          <Navbar />
          <section className="relative overflow-hidden bg-[#0f2318] pt-28 sm:pt-32">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <div className="mb-4 h-5 w-44 animate-pulse rounded-full bg-white/10" />
              <div className="h-14 w-80 animate-pulse rounded-2xl bg-white/10" />
              <div className="mt-4 h-5 w-96 animate-pulse rounded-xl bg-white/8" />
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/8" />
                ))}
              </div>
            </div>
          </section>
          <Footer />
        </main>
      }
    >
      <SecondaryPageInner />
    </Suspense>
  );
}

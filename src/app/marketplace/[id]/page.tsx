"use client";

import { use } from "react";
import Link from "next/link";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProduct, usePurchaseProduct } from "@/hooks/useContract";
import { CATEGORY_LABELS } from "@/lib/contracts";
import { parseMetadata } from "@/lib/metadata";

const CATEGORY_ICONS = ["⚡", "♻️", "🌽", "👜", "🏗️", "🌿"];
const CATEGORY_GRADIENTS = [
  "from-yellow-50 to-amber-100",
  "from-teal-50 to-cyan-100",
  "from-lime-50 to-green-100",
  "from-purple-50 to-violet-100",
  "from-orange-50 to-amber-100",
  "from-blue-50 to-sky-100",
];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tokenId = parseInt(id, 10);

  const { data: product, isLoading } = useProduct(tokenId);
  const { address, isConnected } = useAccount();
  const { purchase, isPending, isConfirming, isSuccess, error } = usePurchaseProduct();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-24">
          <div className="bg-white rounded-2xl h-96 animate-pulse" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!product || !product.active) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-24 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Product not found</h2>
          <Link href="/marketplace" className="text-green-600 hover:underline">← Back to marketplace</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const category = Number(product.category);
  const icon = CATEGORY_ICONS[category] ?? "🌱";
  const gradient = CATEGORY_GRADIENTS[category] ?? "from-green-50 to-emerald-100";
  const categoryLabel = CATEGORY_LABELS[category] ?? "Green Product";
  const price = formatEther(product.pricePerUnit);
  const shortVendor = `${product.vendor.slice(0, 10)}...${product.vendor.slice(-6)}`;
  const isOwnProduct = address?.toLowerCase() === product.vendor.toLowerCase();
  const { name: productName, image: productImage } = parseMetadata(product.metadataURI);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        <Link href="/marketplace" className="text-sm text-gray-500 hover:text-green-700 mb-6 inline-block">
          ← Back to marketplace
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Hero */}
          <div className={`h-56 relative overflow-hidden bg-linear-to-br ${gradient}`}>
            <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-15 select-none">
              {icon}
            </div>
            {productImage && (
              <img
                src={productImage}
                alt={productName}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>

          <div className="p-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">{categoryLabel}</span>
              <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Token #{tokenId}</span>
              <span className="text-xs font-medium bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                🌱 {product.co2SavedKgPerUnit.toString()} kg CO₂ per unit
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {productName || `Green Asset #${tokenId}`}
            </h1>
            <p className="text-sm text-gray-400 font-mono mb-6">Vendor: {shortVendor}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{price} MNT</div>
                <div className="text-xs text-gray-500 mt-0.5">Price per unit</div>
              </div>
              <div className="text-center border-x border-gray-200">
                <div className="text-xl font-bold text-gray-900">{product.available.toString()}</div>
                <div className="text-xs text-gray-500 mt-0.5">Available</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{product.totalSupply.toString()}</div>
                <div className="text-xs text-gray-500 mt-0.5">Total supply</div>
              </div>
            </div>

            {/* Buy section */}
            {isSuccess ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <div className="text-2xl mb-1">✅</div>
                <p className="font-semibold text-green-800">Purchase confirmed on Mantle!</p>
                <p className="text-sm text-green-600 mt-1">Token transferred to your wallet.</p>
              </div>
            ) : isOwnProduct ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-sm text-amber-700">
                This is your listing. Switch wallets to purchase.
              </div>
            ) : !isConnected ? (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-sm text-gray-500">
                Connect your wallet to purchase this asset.
              </div>
            ) : product.available === 0n ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center text-sm text-red-600">
                Sold out — no units remaining.
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => purchase(tokenId, 1, product.pricePerUnit)}
                  disabled={isPending || isConfirming}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold rounded-xl transition-colors text-lg"
                >
                  {isPending ? "Confirm in wallet…" : isConfirming ? "Confirming on-chain…" : `Buy 1 unit — ${price} MNT`}
                </button>
                {error && (
                  <p className="text-xs text-red-500 text-center">{error.message.slice(0, 120)}</p>
                )}
                <p className="text-xs text-center text-gray-400">
                  Transaction on Mantle Sepolia · 2.5% platform fee
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

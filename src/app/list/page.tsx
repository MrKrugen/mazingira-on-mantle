"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useListProduct, useIsApprovedVendor } from "@/hooks/useContract";
import { CATEGORY_LABELS } from "@/lib/contracts";

export default function ListProductPage() {
  const { address, isConnected } = useAccount();
  const { data: isApproved } = useIsApprovedVendor(address);
  const { listProduct, isPending, isConfirming, isSuccess, hash, error } = useListProduct();

  const [form, setForm] = useState({
    name: "",
    pricePerUnit: "",
    supply: "",
    category: "0",
    co2SavedKgPerUnit: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    listProduct({
      metadataURI: form.name,
      pricePerUnit: form.pricePerUnit,
      supply: parseInt(form.supply),
      category: parseInt(form.category),
      co2SavedKgPerUnit: parseInt(form.co2SavedKgPerUnit) || 0,
    });
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">List your inventory</h1>
          <p className="text-gray-500">Tokenize your green product batch as an on-chain asset on Mantle.</p>
        </div>

        {/* Not connected */}
        {!isConnected && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🔌</div>
            <h3 className="font-semibold text-gray-700 mb-1">Connect your wallet</h3>
            <p className="text-sm text-gray-400">You need a connected wallet to list products.</p>
          </div>
        )}

        {/* Not approved */}
        {isConnected && isApproved === false && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
            <div className="flex gap-3">
              <span className="text-xl">⏳</span>
              <div>
                <h3 className="font-semibold text-amber-800">Vendor approval required</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Your wallet needs to be approved as a vendor before you can list products.
                  Contact the platform admin with your wallet address:
                </p>
                <code className="block mt-2 text-xs bg-amber-100 px-3 py-1.5 rounded font-mono text-amber-900 break-all">
                  {address}
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Success */}
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <h3 className="font-semibold text-green-800 mb-1">Product listed on Mantle!</h3>
            <p className="text-sm text-green-600 mb-3">Your inventory tokens have been minted on-chain.</p>
            {hash && (
              <a
                href={`https://sepolia.mantlescan.xyz/tx/${hash}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-green-700 underline"
              >
                View transaction on MantleScan →
              </a>
            )}
          </div>
        )}

        {/* Form */}
        {isConnected && isApproved && !isSuccess && (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product name / description</label>
              <input
                type="text"
                required
                placeholder="e.g. Biomass Briquettes — 500kg Batch"
                value={form.name}
                onChange={set("name")}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={set("category")}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                {CATEGORY_LABELS.map((label, i) => (
                  <option key={i} value={i}>{label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price per unit (MNT)</label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  required
                  placeholder="0.15"
                  value={form.pricePerUnit}
                  onChange={set("pricePerUnit")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Supply (units)</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="500"
                  value={form.supply}
                  onChange={set("supply")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                CO₂ saved per unit (kg) <span className="text-gray-400 font-normal">— optional</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="120"
                value={form.co2SavedKgPerUnit}
                onChange={set("co2SavedKgPerUnit")}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-400 mt-1">Used to calculate total impact displayed on your listing.</p>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">
                {error.message.slice(0, 150)}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || isConfirming}
              className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold rounded-xl transition-colors"
            >
              {isPending ? "Confirm in wallet…" : isConfirming ? "Minting tokens on-chain…" : "List product & mint tokens"}
            </button>

            <p className="text-xs text-center text-gray-400">
              Minting tokens costs a small gas fee in MNT · 2.5% platform fee on sales
            </p>
          </form>
        )}
      </div>

      <Footer />
    </main>
  );
}

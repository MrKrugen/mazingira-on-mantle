"use client";

import { use, useState } from "react";
import Link from "next/link";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StorageStatus } from "@/components/StorageStatus";
import { useProduct, usePurchaseProduct, useUpdateMetadata } from "@/hooks/useContract";
import { CATEGORY_LABELS } from "@/lib/contracts";
import { parseMetadata, buildMetadata } from "@/lib/metadata";

const CATEGORY_ICONS = ["⚡", "♻️", "🌾", "👜", "🪵", "🌿"];
const CATEGORY_GRADIENTS = [
  "from-amber-100 via-yellow-50 to-white",
  "from-cyan-100 via-teal-50 to-white",
  "from-lime-100 via-green-50 to-white",
  "from-violet-100 via-fuchsia-50 to-white",
  "from-orange-100 via-stone-50 to-white",
  "from-sky-100 via-blue-50 to-white",
];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tokenId = parseInt(id, 10);

  const { data: product, isLoading } = useProduct(tokenId);
  const { address, isConnected } = useAccount();
  const { purchase, isPending, isConfirming, isSuccess, error } = usePurchaseProduct();
  const { updateMetadata, isPending: isUpdatePending, isConfirming: isUpdateConfirming, isSuccess: isUpdateSuccess, error: updateError } = useUpdateMetadata();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f5f7f2]">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
          <div className="h-130 animate-pulse rounded-4xl border border-stone-200 bg-white" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!product || !product.active) {
    return (
      <main className="min-h-screen bg-[#f5f7f2]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 pt-32 pb-20 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-3xl bg-lime-100 text-sm font-black text-emerald-950">M</div>
          <h2 className="text-xl font-black text-stone-900 mb-2">Product not found</h2>
          <Link href="/marketplace" className="text-emerald-700 hover:underline">Back to marketplace</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const category = Number(product.category);
  const icon = CATEGORY_ICONS[category] ?? "🌿";
  const gradient = CATEGORY_GRADIENTS[category] ?? "from-green-100 via-emerald-50 to-white";
  const categoryLabel = CATEGORY_LABELS[category] ?? "Green Product";
  const price = formatEther(product.pricePerUnit);
  const shortVendor = `${product.vendor.slice(0, 10)}...${product.vendor.slice(-6)}`;
  const isOwnProduct = address?.toLowerCase() === product.vendor.toLowerCase();
  const { name: productName, image: productImage } = parseMetadata(product.metadataURI);

  // Storage terms from product (or platform defaults)
  const freeStorageDays = Number(product.freeStorageDays);
  const maxStorageDays  = Number(product.maxStorageDays);
  const dailyFeeMNT     = formatEther(product.storageFeePerKgDaily);

  // Buffer deposit is 10% of unit price
  const bufferMNT = (parseFloat(price) * 0.1).toFixed(4);
  const totalMNT  = (parseFloat(price) * 1.1).toFixed(4);

  function openEdit() {
    setEditName(productName);
    setEditImage(productImage ?? "");
    setEditOpen(true);
  }

  function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editName.trim()) return;
    updateMetadata(tokenId, buildMetadata(editName.trim(), editImage.trim() || undefined));
  }

  return (
    <main className="min-h-screen bg-[#f5f7f2]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-28 pb-20">
        <Link href="/marketplace" className="mb-5 inline-flex text-sm font-bold text-stone-500 hover:text-emerald-800">
          Back to marketplace
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Product info */}
          <section className="overflow-hidden rounded-4xl border border-stone-200 bg-white shadow-xl shadow-stone-950/5">
            <div className={`relative min-h-90 bg-linear-to-br ${gradient}`}>
              <div className="absolute left-6 top-6 rounded-full bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-stone-700 shadow-sm">
                {categoryLabel}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl opacity-90 drop-shadow select-none">{icon}</span>
              </div>
              {productImage && (
                <img
                  src={productImage}
                  alt={productName}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-black text-emerald-900">Token #{tokenId}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  {product.co2SavedKgPerUnit.toString()} kg CO₂ per unit
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-950">
                {productName || `Green Asset #${tokenId}`}
              </h1>
              <p className="mt-3 text-sm font-mono text-stone-500">Vendor: {shortVendor}</p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  ["Price", `${price} MNT`],
                  ["Available", product.available.toString()],
                  ["Supply", product.totalSupply.toString()],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-3xl bg-stone-50 p-4 text-center ring-1 ring-stone-100">
                    <div className="text-lg sm:text-xl font-black text-stone-950">{value}</div>
                    <div className="mt-1 text-xs font-bold text-stone-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-28 self-start">
            {/* Checkout card */}
            <div className="rounded-4xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-950/5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">Checkout</p>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-stone-500">Unit price</p>
                  <p className="mt-1 text-4xl font-black tracking-tight text-stone-950">{price}</p>
                  <p className="text-sm font-black text-emerald-700">MNT</p>
                </div>
                <div className="rounded-2xl bg-lime-100 px-3 py-2 text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-500">Unit</p>
                  <p className="text-xs font-black text-stone-950">1 token</p>
                </div>
              </div>

              {/* Storage terms — shown before purchase */}
              {!isOwnProduct && !isSuccess && isConnected && product.available > 0n && (
                <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-4 space-y-2">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-500">Storage Terms</p>
                  <ul className="space-y-1 text-xs text-stone-600">
                    <li>• <span className="font-bold text-emerald-700">{freeStorageDays} days</span> free storage at vendor warehouse</li>
                    <li>• Then <span className="font-bold text-amber-700">{dailyFeeMNT} MNT/kg/day</span> storage fee</li>
                    <li>• Forced liquidation after <span className="font-bold text-red-700">{maxStorageDays} days</span></li>
                    <li>• <span className="font-bold">10% buffer deposit</span> ({bufferMNT} MNT) locked at purchase</li>
                  </ul>
                  <p className="text-[10px] text-stone-400">Total to send: {price} MNT + {bufferMNT} MNT buffer = <span className="font-black text-stone-700">{totalMNT} MNT</span></p>

                  <label className="flex items-start gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded accent-emerald-600"
                    />
                    <span className="text-xs text-stone-600">
                      I understand the storage terms and fee schedule above.
                    </span>
                  </label>
                </div>
              )}

              <div className="mt-6">
                {isSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                    <p className="font-black text-emerald-800">Purchase confirmed on Mantle.</p>
                    <p className="text-sm text-emerald-600 mt-1">Token transferred to your wallet.</p>
                  </div>
                ) : isOwnProduct ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center text-sm text-amber-700">
                    This is your listing. Switch wallets to purchase.
                  </div>
                ) : !isConnected ? (
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-center text-sm text-stone-500">
                    Connect your wallet to purchase this asset.
                  </div>
                ) : product.available === 0n ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center text-sm text-red-600">
                    Sold out. No units remaining.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => purchase(tokenId, 1, product.pricePerUnit)}
                      disabled={isPending || isConfirming || !termsAccepted}
                      className="w-full py-4 bg-[#132317] hover:bg-stone-800 disabled:bg-stone-300 text-white font-black rounded-2xl transition-colors text-base"
                    >
                      {isPending ? "Confirm in wallet..." : isConfirming ? "Confirming on-chain..." : `Buy 1 unit — ${totalMNT} MNT total`}
                    </button>
                    {!termsAccepted && (
                      <p className="text-xs text-center text-amber-600">Accept storage terms above to enable purchase.</p>
                    )}
                    {error && (
                      <p className="text-xs text-red-500 text-center">{error.message.slice(0, 120)}</p>
                    )}
                    <p className="text-xs text-center text-stone-400">
                      {price} MNT price + {bufferMNT} MNT buffer deposit. Platform fee 2.5%.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Storage status — shown to buyers who hold this token */}
            {isConnected && address && !isOwnProduct && (
              <StorageStatus tokenId={tokenId} holderAddress={address} />
            )}

            {/* Edit listing — vendor only */}
            {isOwnProduct && (
              <div className="rounded-4xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-950/5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">Edit Listing</p>
                  <button
                    onClick={() => editOpen ? setEditOpen(false) : openEdit()}
                    className="text-xs font-black text-emerald-700 hover:text-emerald-900 transition-colors"
                  >
                    {editOpen ? "Cancel" : "Edit"}
                  </button>
                </div>

                {!editOpen && (
                  <p className="mt-3 text-xs text-stone-400 leading-5">
                    Update this listing's name or image. On-chain transaction required.
                  </p>
                )}

                {editOpen && (
                  <form onSubmit={submitEdit} className="mt-4 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">Product Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Product name"
                        required
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">
                        Image URL <span className="text-stone-300">(optional)</span>
                      </label>
                      <input
                        type="url"
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {isUpdateSuccess ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-black text-emerald-800">
                        Metadata updated on-chain.
                      </div>
                    ) : (
                      <button
                        type="submit"
                        disabled={isUpdatePending || isUpdateConfirming || !editName.trim()}
                        className="w-full py-3 bg-[#132317] hover:bg-stone-800 disabled:bg-stone-300 text-white font-black rounded-xl transition-colors text-sm"
                      >
                        {isUpdatePending ? "Confirm in wallet..." : isUpdateConfirming ? "Confirming..." : "Save Changes"}
                      </button>
                    )}

                    {updateError && (
                      <p className="text-xs text-red-500 text-center">{updateError.message.slice(0, 100)}</p>
                    )}
                  </form>
                )}
              </div>
            )}

            <div className="rounded-3xl bg-lime-300 p-5 text-stone-950 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-900">Asset notes</p>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                This listing shows live supply, vendor wallet, category, and CO₂ signal. Storage fees apply after the free period.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}

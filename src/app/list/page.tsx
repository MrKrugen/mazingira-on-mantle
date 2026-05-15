"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useListProduct } from "@/hooks/useContract";
import { CATEGORY_LABELS } from "@/lib/contracts";
import { buildMetadata } from "@/lib/metadata";

const MNT_USD_RATE = 0.65;

export default function ListProductPage() {
  const { address, isConnected } = useAccount();
  const { listProduct, isPending, isConfirming, isSuccess, hash, error } = useListProduct();

  const [vendorStatus, setVendorStatus] = useState<{
    status: "loading" | "none" | "pending" | "approved";
    applicationId?: string;
    vendorName?: string;
  }>({ status: "loading" });

  useEffect(() => {
    if (!address) { setVendorStatus({ status: "none" }); return; }
    fetch(`/api/vendors?wallet=${address}`)
      .then((r) => r.json())
      .then((data) => setVendorStatus(data))
      .catch(() => setVendorStatus({ status: "none" }));
  }, [address]);

  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
    pricePerUnit: "",
    supply: "",
    category: "0",
    co2SavedKgPerUnit: "",
  });
  const [co2Loading, setCo2Loading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    listProduct({
      metadataURI: buildMetadata(form.name, form.imageUrl),
      pricePerUnit: form.pricePerUnit,
      supply: parseInt(form.supply),
      category: parseInt(form.category),
      co2SavedKgPerUnit: parseInt(form.co2SavedKgPerUnit) || 0,
    });
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const suggestCo2 = async () => {
    if (!form.name) return;
    setCo2Loading(true);
    try {
      const res = await fetch("/api/co2-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, category: CATEGORY_LABELS[parseInt(form.category)] }),
      });
      const { co2 } = await res.json();
      if (co2) setForm((f) => ({ ...f, co2SavedKgPerUnit: String(co2) }));
    } finally {
      setCo2Loading(false);
    }
  };

  const usdEquivalent = form.pricePerUnit
    ? `About $${(parseFloat(form.pricePerUnit) * MNT_USD_RATE).toFixed(2)} USD`
    : null;

  return (
    <main className="min-h-screen bg-[#f5f7f2]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-28 pb-20">
        <div className="mb-8 rounded-[2rem] bg-[#132317] p-6 sm:p-8 text-white shadow-2xl shadow-emerald-950/15">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-lime-300">Vendor studio</p>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight">List your inventory</h1>
          <p className="mt-4 max-w-2xl text-stone-300">Tokenize a real green product batch as an on-chain asset on Mantle.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <section>
            {!isConnected && (
              <div className="bg-white border border-stone-200 rounded-[1.5rem] p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-3xl bg-lime-100 text-sm font-black text-emerald-950">M</div>
                <h3 className="font-black text-stone-900 mb-1">Connect your wallet</h3>
                <p className="text-sm text-stone-500">You need a connected wallet to list products.</p>
              </div>
            )}

            {isConnected && vendorStatus.status === "loading" && (
              <div className="h-32 animate-pulse rounded-[1.5rem] bg-stone-200" />
            )}

            {isConnected && vendorStatus.status === "none" && (
              <div className="overflow-hidden rounded-[1.5rem] shadow-sm">
                <div className="relative bg-[#0f2318] p-8 text-center">
                  <div className="moire-panel pointer-events-none absolute inset-0 opacity-40" />
                  <div className="relative">
                    <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-3xl bg-white/10 text-2xl">
                      🔒
                    </div>
                    <h3 className="text-lg font-black text-white">Vendor registration required</h3>
                    <p className="mt-2 text-sm text-stone-300">
                      Only verified vendors can mint tokens on Mazingira.
                    </p>
                    <Link
                      href="/vendors/register"
                      className="mt-5 inline-block rounded-2xl bg-lime-300 px-6 py-3 text-sm font-black text-stone-950 transition-colors hover:bg-lime-200 glow-btn-lime"
                    >
                      Apply to become a vendor →
                    </Link>
                  </div>
                </div>
                <div className="border border-t-0 border-stone-200 bg-white rounded-b-[1.5rem] p-5">
                  <p className="text-xs font-bold text-stone-700 mb-2">Requirements</p>
                  <ul className="space-y-1 text-xs text-stone-500">
                    <li>• Physical green inventory in Kenya</li>
                    <li>• Accessible storage for agent verification</li>
                    <li>• 10% MNT collateral at first listing</li>
                  </ul>
                </div>
              </div>
            )}

            {isConnected && vendorStatus.status === "pending" && (
              <div className="overflow-hidden rounded-[1.5rem] border border-amber-200 bg-amber-50 shadow-sm">
                <div className="border-b border-amber-200 bg-amber-100 p-6 text-center">
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-3xl bg-amber-200 text-2xl">
                    ⏳
                  </div>
                  <h3 className="font-black text-amber-900">
                    Application {vendorStatus.applicationId} under review
                  </h3>
                  <p className="mt-1.5 text-sm text-amber-700">
                    Field verification in progress. We&apos;ll notify you when approved.
                  </p>
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-amber-800">Application ID</span>
                    <span className="font-mono text-amber-700">{vendorStatus.applicationId}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-amber-800">Wallet</span>
                    <span className="font-mono text-amber-700">
                      {address ? `${address.slice(0, 8)}...${address.slice(-4)}` : ""}
                    </span>
                  </div>
                  <div className="mt-2 rounded-xl bg-amber-100 p-3 text-xs text-amber-700">
                    A field agent will visit your storage location — typically within 48 hours. Keep your phone accessible.
                  </div>
                  <Link
                    href="/vendors"
                    className="block w-full rounded-2xl border border-amber-300 py-2.5 text-center text-xs font-black text-amber-800 transition-colors hover:bg-amber-100"
                  >
                    View vendor directory →
                  </Link>
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-[1.5rem] p-6 mb-6 text-center">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-xs font-black text-white">OK</div>
                <h3 className="font-semibold text-green-800 mb-1">Product listed on Mantle!</h3>
                <p className="text-sm text-green-600 mb-3">Your inventory tokens have been minted on-chain.</p>
                {hash && (
                  <a
                    href={`https://sepolia.mantlescan.xyz/tx/${hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-green-700 underline"
                  >
                    View transaction on MantleScan
                  </a>
                )}
              </div>
            )}

            {isConnected && vendorStatus.status === "approved" && !isSuccess && (
              <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-[1.5rem] p-5 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <label className="block text-sm font-black text-stone-800 mb-1.5">Product name or description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Biomass Briquettes, 500kg Batch"
                    value={form.name}
                    onChange={set("name")}
                    className="w-full px-4 py-3 border border-stone-200 rounded-2xl text-sm text-stone-900 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-stone-800 mb-1.5">
                    Product image URL <span className="text-stone-400 font-normal">optional</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={form.imageUrl}
                    onChange={set("imageUrl")}
                    className="w-full px-4 py-3 border border-stone-200 rounded-2xl text-sm text-stone-900 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-transparent"
                  />
                  <p className="text-xs text-stone-400 mt-1">Paste a direct image link. Leave blank to use a category visual.</p>
                </div>

                <div>
                  <label className="block text-sm font-black text-stone-800 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={set("category")}
                    className="w-full px-4 py-3 border border-stone-200 rounded-2xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-lime-300 bg-stone-50"
                  >
                    {CATEGORY_LABELS.map((label, i) => (
                      <option key={i} value={i}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-stone-800 mb-1.5">Price per unit (MNT)</label>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      required
                      placeholder="1.5"
                      value={form.pricePerUnit}
                      onChange={set("pricePerUnit")}
                      className="w-full px-4 py-3 border border-stone-200 rounded-2xl text-sm text-stone-900 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-lime-300"
                    />
                    {usdEquivalent && (
                      <p className="text-xs text-emerald-700 mt-1">{usdEquivalent}, 1 MNT about $0.65</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-black text-stone-800 mb-1.5">Supply (units)</label>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="500"
                      value={form.supply}
                      onChange={set("supply")}
                      className="w-full px-4 py-3 border border-stone-200 rounded-2xl text-sm text-stone-900 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-lime-300"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <label className="block text-sm font-black text-stone-800">
                      CO2 saved per unit (kg) <span className="text-stone-400 font-normal">optional</span>
                    </label>
                    <button
                      type="button"
                      onClick={suggestCo2}
                      disabled={!form.name || co2Loading}
                      className="text-xs text-emerald-800 bg-lime-100 hover:bg-lime-200 border border-lime-200 px-2.5 py-1 rounded-xl font-black transition-colors disabled:opacity-40"
                    >
                      {co2Loading ? "Estimating..." : "AI Suggest"}
                    </button>
                  </div>
                  <input
                    type="number"
                    min="0"
                    placeholder="120"
                    value={form.co2SavedKgPerUnit}
                    onChange={set("co2SavedKgPerUnit")}
                    className="w-full px-4 py-3 border border-stone-200 rounded-2xl text-sm text-stone-900 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-lime-300"
                  />
                  <p className="text-xs text-stone-400 mt-1">Used to calculate total impact displayed on your listing.</p>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-2xl">
                    {error.message.slice(0, 150)}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="w-full py-4 bg-[#132317] hover:bg-stone-800 disabled:bg-stone-300 text-white font-black rounded-2xl transition-colors"
                >
                  {isPending ? "Confirm in wallet..." : isConfirming ? "Minting tokens on-chain..." : "List product and mint tokens"}
                </button>

                <p className="text-xs text-center text-stone-400">
                  Minting tokens costs a small gas fee in MNT. Platform fee is 2.5% on sales.
                </p>
              </form>
            )}
          </section>

          <aside className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Listing quality</p>
            <div className="mt-5 space-y-4">
              {[
                ["Name", "Use the batch, product type, and size."],
                ["Image", "A direct image URL makes the card feel investable."],
                ["CO2", "The AI estimate is optional, but it improves buyer context."],
                ["Price", "Keep the unit price clear before wallet confirmation."],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-100">
                  <p className="font-black text-stone-950">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-500">{copy}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}

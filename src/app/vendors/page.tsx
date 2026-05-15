"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VendorBadge } from "@/components/VendorBadge";
import type { VendorRecord } from "@/app/api/vendors/route";

const ROLE_ICONS: Record<string, string> = {
  "Clean Energy Producer": "⚡",
  "Waste Processor": "♻️",
  "Sustainable Farmer": "🌾",
  "Upcycled Goods Maker": "👜",
  "Green Builder": "🪵",
  "Environmental Services": "🌿",
};

export default function VendorsPage() {
  const { address, isConnected } = useAccount();
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [myStatus, setMyStatus] = useState<{
    status: string;
    applicationId?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/vendors")
      .then((r) => r.json())
      .then((data) => setVendors(data.vendors ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!address) return;
    fetch(`/api/vendors?wallet=${address}`)
      .then((r) => r.json())
      .then(setMyStatus)
      .catch(() => {});
  }, [address]);

  return (
    <main className="min-h-screen bg-[#f5f7f2]">
      <Navbar />

      {/* Dark hero header */}
      <section className="relative overflow-hidden bg-[#0f2318] pt-28 sm:pt-32">
        <div className="moire-panel pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-10 sm:py-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-bold text-lime-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300" />
              Verified vendor network
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Green{" "}
              <span className="text-lime-300 glow-lime">Vendor</span>{" "}
              Directory
            </h1>
            <p className="mt-3 max-w-xl text-stone-300">
              All vendors on Mazingira are field-verified by our agent network
              before they can mint tokens. Physical stock is confirmed, not just claimed.
            </p>
          </div>

          {/* Stats + CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pb-8 pt-6">
            <div className="flex gap-8">
              {[
                [loading ? "..." : String(vendors.length), "Verified vendors"],
                ["100%", "Field verified"],
                ["KE", "Kenya network"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="text-xl font-black text-lime-200 glow-lime">{value}</p>
                  <p className="text-xs text-stone-400">{label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/vendors/register"
              className="glow-btn-lime rounded-2xl bg-lime-300 px-5 py-2.5 text-sm font-black text-stone-950 transition-colors hover:bg-lime-200"
            >
              Apply to Sell
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">

        {/* My status banner */}
        {isConnected && myStatus && myStatus.status !== "none" && (
          <div
            className={`mb-8 flex items-center justify-between gap-4 rounded-2xl border p-4 ${
              myStatus.status === "approved"
                ? "border-emerald-200 bg-emerald-50"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            <div>
              <p
                className={`text-sm font-black ${
                  myStatus.status === "approved" ? "text-emerald-800" : "text-amber-800"
                }`}
              >
                {myStatus.status === "approved"
                  ? "Your vendor account is verified"
                  : `Application ${myStatus.applicationId} under review`}
              </p>
              <p
                className={`mt-0.5 text-xs ${
                  myStatus.status === "approved" ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {myStatus.status === "approved"
                  ? "You can list products on Mazingira."
                  : "Field verification in progress — typically 48 hours."}
              </p>
            </div>
            {myStatus.status === "approved" ? (
              <Link
                href="/list"
                className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white transition-colors hover:bg-emerald-700"
              >
                List Product →
              </Link>
            ) : (
              <span className="shrink-0 rounded-full bg-amber-200 px-3 py-1 text-[10px] font-black text-amber-800">
                Pending
              </span>
            )}
          </div>
        )}

        {/* Vendor grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl bg-stone-200" />
            ))}
          </div>
        ) : vendors.length === 0 ? (
          <div className="rounded-4xl border border-stone-200 bg-white p-14 text-center shadow-sm">
            <p className="text-stone-500">No approved vendors yet.</p>
            <Link
              href="/vendors/register"
              className="mt-3 inline-block text-sm font-bold text-emerald-700 hover:underline"
            >
              Be the first →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}

        {/* CTA for unregistered connected users */}
        {isConnected && (!myStatus || myStatus.status === "none") && (
          <div className="mt-10 overflow-hidden rounded-4xl border border-stone-200 bg-white shadow-sm">
            <div className="bg-[#dffb69] p-6">
              <h3 className="text-xl font-black text-stone-950">
                Ready to list your green inventory?
              </h3>
              <p className="mt-2 text-sm text-stone-700">
                Join the verified vendor network and tokenize your stock on Mantle.
              </p>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-6 p-6">
              <div className="text-sm text-stone-600">
                <p className="font-bold text-stone-800">Requirements</p>
                <ul className="mt-2 space-y-1 text-stone-500">
                  <li>• Physical green inventory in Kenya</li>
                  <li>• Accessible storage for agent verification</li>
                  <li>• 10% MNT collateral at first listing</li>
                </ul>
              </div>
              <Link
                href="/vendors/register"
                className="shrink-0 rounded-2xl bg-[#0f2318] px-5 py-3 text-sm font-black text-white transition-colors hover:bg-stone-800"
              >
                Apply Now →
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

function VendorCard({ vendor }: { vendor: VendorRecord }) {
  const icon = ROLE_ICONS[vendor.role] ?? "🌿";
  const shortWallet =
    vendor.wallet.startsWith("0x") && vendor.wallet.length === 42
      ? `${vendor.wallet.slice(0, 8)}...${vendor.wallet.slice(-4)}`
      : "On-chain verified";

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Dark header */}
      <div className="flex items-start justify-between gap-3 bg-[#132317] p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lime-300 text-2xl">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-black leading-tight text-white">
              {vendor.businessName}
            </h3>
            <p className="mt-0.5 text-xs text-stone-400">{vendor.role}</p>
          </div>
        </div>
        <VendorBadge size="xs" />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <span>📍</span>
          <span>{vendor.county}, Kenya</span>
        </div>

        {vendor.description && (
          <p className="line-clamp-2 text-xs leading-5 text-stone-600">
            {vendor.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            ["6", "Listings"],
            ["12", "Sales"],
            ["5.0 ★", "Rating"],
          ].map(([val, label]) => (
            <div
              key={label}
              className="rounded-xl bg-stone-50 p-2 text-center ring-1 ring-stone-100"
            >
              <p className="text-sm font-black text-stone-900">{val}</p>
              <p className="text-[9px] font-bold text-stone-400">{label}</p>
            </div>
          ))}
        </div>

        <p className="font-mono text-[10px] text-stone-400">{shortWallet}</p>

        <Link
          href="/marketplace"
          className="block w-full rounded-2xl bg-[#132317] py-2.5 text-center text-sm font-black text-white transition-colors hover:bg-stone-800"
        >
          View Products
        </Link>
      </div>
    </div>
  );
}

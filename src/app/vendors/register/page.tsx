"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const ROLES = [
  "Clean Energy Producer",
  "Waste Processor",
  "Sustainable Farmer",
  "Upcycled Goods Maker",
  "Green Builder",
  "Environmental Services",
];

const COUNTIES = ["Nairobi", "Kisumu", "Mombasa", "Nakuru", "Eldoret", "Other"];
const STEPS = ["Business Details", "Inventory Declaration", "Review & Submit"];

type Form = {
  businessName: string;
  role: string;
  county: string;
  phone: string;
  description: string;
  primaryMaterial: string;
  monthlyVolume: string;
  volumeUnit: string;
  currentStock: string;
  stockUnit: string;
  storageLocation: string;
};

const DEFAULT_FORM: Form = {
  businessName: "",
  role: ROLES[0],
  county: COUNTIES[0],
  phone: "+254",
  description: "",
  primaryMaterial: "",
  monthlyVolume: "",
  volumeUnit: "kg",
  currentStock: "",
  stockUnit: "kg",
  storageLocation: "",
};

const INPUT =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-lime-300";

export default function VendorRegisterPage() {
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set =
    (field: keyof Form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const step1Valid = form.businessName.trim().length > 0 && form.phone.trim().length >= 10;
  const step2Valid = form.primaryMaterial.trim().length > 0 && form.monthlyVolume.trim().length > 0;

  async function handleSubmit() {
    if (!address) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, wallet: address }),
      });
      const data = await res.json();
      if (data.applicationId) {
        setApplicationId(data.applicationId);
      } else {
        setSubmitError(data.error ?? "Submission failed. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (applicationId) {
    return (
      <main className="min-h-screen bg-[#f5f7f2]">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-4 pt-16 pb-20">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-[2rem] bg-lime-300 text-3xl shadow-lg glow-btn-lime">
              ✓
            </div>
            <h2 className="text-3xl font-black tracking-tight text-stone-950">
              Application submitted!
            </h2>
            <p className="mt-1 text-2xl font-black text-emerald-700">{applicationId}</p>

            <div className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 text-left space-y-3 shadow-sm">
              <p className="text-sm leading-6 text-stone-600">
                Our field team will contact you within{" "}
                <span className="font-black text-stone-900">48 hours</span> to arrange a
                verification visit to your storage location.
              </p>
              <div className="rounded-xl bg-stone-50 px-3 py-2 text-[11px] font-mono text-stone-500 break-all">
                Wallet: {address}
              </div>
              <p className="text-sm leading-6 text-stone-600">
                Once approved, you can mint your first listing with a{" "}
                <span className="font-black">10% MNT collateral</span> stake.
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/marketplace"
                className="rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-black text-stone-700 transition-colors hover:border-emerald-300"
              >
                Browse Market
              </Link>
              <Link
                href="/vendors"
                className="rounded-2xl bg-[#0f2318] px-5 py-3 text-sm font-black text-white transition-colors hover:bg-stone-800"
              >
                Vendor Directory
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7f2]">
      <Navbar />

      {/* Dark header */}
      <section className="relative overflow-hidden bg-[#0f2318] pt-28 sm:pt-32">
        <div className="moire-panel pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-bold text-lime-200">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
            Vendor Registration
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Become a Mazingira Vendor
          </h1>
          <p className="mt-3 text-stone-300">
            List your green inventory as on-chain assets.
            Field verification required.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-20">

        {/* Stepper */}
        <div className="relative mb-10 flex items-start justify-between">
          {/* Base line */}
          <div className="absolute left-[18px] right-[18px] top-[18px] h-0.5 bg-stone-200" />
          {/* Progress line */}
          <div
            className="absolute left-[18px] top-[18px] h-0.5 bg-lime-400 transition-all duration-500"
            style={{
              width:
                step === 1
                  ? "0%"
                  : step === 2
                  ? "calc(50% - 18px)"
                  : "calc(100% - 36px)",
            }}
          />
          {STEPS.map((label, i) => {
            const stepNum = i + 1;
            const isDone = step > stepNum;
            const isActive = step === stepNum;
            return (
              <div key={stepNum} className="relative z-10 flex flex-col items-center">
                <div
                  className={`grid h-9 w-9 place-items-center rounded-full text-sm font-black transition-all ${
                    isDone
                      ? "bg-lime-300 text-stone-950"
                      : isActive
                      ? "bg-[#0f2318] text-white ring-4 ring-lime-100"
                      : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {isDone ? "✓" : stepNum}
                </div>
                <p
                  className={`mt-2 hidden text-center text-[10px] font-bold sm:block ${
                    isActive ? "text-stone-800" : "text-stone-400"
                  }`}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Wallet notice */}
        {!isConnected && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Connect your wallet before submitting — your address will be registered with this application.
          </div>
        )}

        {/* ── Step 1: Business Details ── */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-stone-950">Business Details</h2>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                Business / Farm Name
              </label>
              <input
                type="text"
                value={form.businessName}
                onChange={set("businessName")}
                placeholder="e.g. Rift Valley Green Energy Co."
                className={INPUT}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                Your Role
              </label>
              <select value={form.role} onChange={set("role")} className={INPUT}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                  County
                </label>
                <select value={form.county} onChange={set("county")} className={INPUT}>
                  {COUNTIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                  Phone (+254)
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+254712345678"
                  className={INPUT}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center justify-between text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                <span>Business Description</span>
                <span className="font-normal normal-case text-stone-300">
                  {form.description.length}/200
                </span>
              </label>
              <textarea
                value={form.description}
                onChange={set("description")}
                maxLength={200}
                rows={3}
                placeholder="Describe your green business and what you produce..."
                className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
              />
            </div>

            <button
              onClick={() => step1Valid && setStep(2)}
              disabled={!step1Valid}
              className="w-full rounded-2xl bg-[#0f2318] py-3.5 text-sm font-black text-white transition-colors hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400"
            >
              Next: Inventory Declaration →
            </button>
          </div>
        )}

        {/* ── Step 2: Inventory Declaration ── */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-stone-950">Inventory Declaration</h2>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                Primary Material / Product
              </label>
              <input
                type="text"
                value={form.primaryMaterial}
                onChange={set("primaryMaterial")}
                placeholder="e.g. Biomass briquettes, recycled PET pellets"
                className={INPUT}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                  Monthly Volume
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={form.monthlyVolume}
                    onChange={set("monthlyVolume")}
                    placeholder="500"
                    min="0"
                    className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
                  />
                  <select
                    value={form.volumeUnit}
                    onChange={set("volumeUnit")}
                    className="w-20 shrink-0 rounded-xl border border-stone-200 bg-white px-2 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    {["kg", "tonnes", "units"].map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                  Current Stock
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={form.currentStock}
                    onChange={set("currentStock")}
                    placeholder="200"
                    min="0"
                    className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
                  />
                  <select
                    value={form.stockUnit}
                    onChange={set("stockUnit")}
                    className="w-20 shrink-0 rounded-xl border border-stone-200 bg-white px-2 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    {["kg", "tonnes", "units"].map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                Storage Location
              </label>
              <input
                type="text"
                value={form.storageLocation}
                onChange={set("storageLocation")}
                placeholder="e.g. Nakuru Industrial Area, Warehouse 3B"
                className={INPUT}
              />
            </div>

            {/* Photo placeholder */}
            <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 p-6 text-center">
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-stone-100 text-lg">
                📷
              </div>
              <p className="text-sm font-bold text-stone-600">Photo Proof</p>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-stone-400">
                Field agent will verify stock in person — photo helpful but not required
                for application.
              </p>
              <button
                type="button"
                disabled
                className="mt-3 cursor-not-allowed rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-400"
              >
                Upload photos (coming soon)
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-2xl border border-stone-200 bg-white py-3.5 text-sm font-black text-stone-600 transition-colors hover:border-stone-300"
              >
                ← Back
              </button>
              <button
                onClick={() => step2Valid && setStep(3)}
                disabled={!step2Valid}
                className="flex-[2] rounded-2xl bg-[#0f2318] py-3.5 text-sm font-black text-white transition-colors hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400"
              >
                Review Application →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Review & Submit ── */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-stone-950">Review & Submit</h2>

            {/* Summary card */}
            <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-100 bg-stone-50 px-5 py-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                  Application Summary
                </p>
              </div>
              <div className="divide-y divide-stone-50 p-5">
                {[
                  ["Business Name", form.businessName],
                  ["Role", form.role],
                  ["Location", `${form.county}, Kenya`],
                  ["Phone", form.phone],
                  ["Description", form.description || "—"],
                  ["Primary Material", form.primaryMaterial],
                  ["Monthly Volume", `${form.monthlyVolume} ${form.volumeUnit}`],
                  ["Current Stock", form.currentStock ? `${form.currentStock} ${form.stockUnit}` : "—"],
                  ["Storage Location", form.storageLocation || "—"],
                  ["Wallet", address ?? "Not connected"],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4 py-2 first:pt-0 last:pb-0">
                    <span className="w-32 shrink-0 text-xs font-bold text-stone-400">
                      {label}
                    </span>
                    <span className="break-all text-xs font-medium text-stone-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Collateral notice */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-1.5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
                Collateral Requirement
              </p>
              <p className="text-sm leading-6 text-stone-700">
                You will need to stake{" "}
                <span className="font-black text-stone-900">10% collateral in MNT</span>{" "}
                when your first listing goes live. This protects buyers and builds your
                reputation score on Mazingira.
              </p>
            </div>

            {submitError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 rounded-2xl border border-stone-200 bg-white py-3.5 text-sm font-black text-stone-600 transition-colors hover:border-stone-300"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !isConnected}
                className="flex-[2] rounded-2xl bg-[#0f2318] py-3.5 text-sm font-black text-white transition-colors hover:bg-stone-800 disabled:bg-stone-300 disabled:text-stone-400"
              >
                {submitting
                  ? "Submitting..."
                  : !isConnected
                  ? "Connect wallet to submit"
                  : "Apply for Vendor Status"}
              </button>
            </div>

            {!isConnected && (
              <p className="text-center text-xs text-stone-400">
                Connect your wallet above — it will be registered with this application.
              </p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

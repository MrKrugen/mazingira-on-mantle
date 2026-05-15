"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f5f7f2] pt-28 sm:pt-32">
      <div className="absolute inset-0 fine-grid opacity-70 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid lg:grid-cols-[1.04fr_0.96fr] gap-8 items-stretch">
          <div className="rounded-[2rem] bg-[#132317] text-white overflow-hidden shadow-2xl shadow-emerald-950/20">
            <div className="moire-panel h-full p-7 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[580px]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-bold text-lime-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-pulse" />
                  Live marketplace on Mantle
                </div>

                <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.02] tracking-tight">
                  Tokenized African{" "}
                  <span className="text-lime-300 glow-lime">green inventory</span>{" "}
                  for serious capital.
                </h1>

                <p className="mt-6 max-w-2xl text-base sm:text-lg leading-8 text-stone-300">
                  Mazingira turns real clean energy, agri, recycling, building, and circular economy stock into traceable on-chain assets with AI-assisted buyer intelligence.
                </p>
              </div>

              <div className="mt-10">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/marketplace"
                    className="rounded-2xl bg-lime-300 px-5 py-3.5 text-sm font-black text-stone-950 glow-btn-lime transition-all hover:bg-lime-200"
                  >
                    Browse Marketplace
                  </Link>
                  <Link
                    href="/list"
                    className="rounded-2xl border border-white/15 bg-white/8 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/12"
                  >
                    List Inventory
                  </Link>
                  <Link
                    href="/agent"
                    className="rounded-2xl border border-white/15 px-5 py-3.5 text-sm font-bold text-stone-200 transition-colors hover:bg-white/8"
                  >
                    Ask AI Agent
                  </Link>
                </div>

                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10 pt-6">
                  {[
                    { value: "ERC-1155", sub: "Token format" },
                    { value: "2.5%", sub: "Platform fee" },
                    { value: "AI", sub: "Price support" },
                    { value: "L2", sub: "Low-fee settlement" },
                  ].map((item) => (
                    <div key={item.sub} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-lg font-black text-lime-200 glow-lime">{item.value}</div>
                      <div className="mt-1 text-xs text-stone-400">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-stone-200 bg-white p-5 sm:p-6 shadow-xl shadow-stone-900/5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Deal room</p>
                  <h2 className="mt-2 text-2xl font-black text-stone-950">Impact assets, ready for diligence</h2>
                </div>
                <div className="grid h-16 w-16 place-items-center rounded-3xl bg-lime-100 text-2xl font-black text-emerald-950">
                  M
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ["Carbon signal", "CO2 per unit"],
                  ["Vendor trail", "Wallet verified"],
                  ["Asset class", "Green inventory"],
                  ["Settlement", "Mantle Sepolia"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200/70">
                    <p className="text-xs font-bold text-stone-500">{label}</p>
                    <p className="mt-2 text-sm font-black text-stone-950">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#dffb69] p-6 text-stone-950 shadow-xl shadow-lime-950/10">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-900">Founder grade UX</p>
              <div className="mt-5 grid sm:grid-cols-[1fr_auto] gap-6 items-end">
                <div>
                  <h3 className="text-3xl font-black leading-tight">Search, compare, buy, and list without ceremony.</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-700">
                    A tighter marketplace view puts the buyer path, inventory signal, and on-chain action in one confident frame.
                  </p>
                </div>
                <Link
                  href="/marketplace"
                  className="inline-flex justify-center rounded-2xl bg-stone-950 px-5 py-3 text-sm font-black text-white hover:bg-stone-800"
                >
                  Open Market
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {["Energy", "Agri", "Circular"].map((label) => (
                <div key={label} className="rounded-3xl border border-stone-200 bg-white p-4 text-center shadow-sm">
                  <div className="mx-auto mb-3 h-10 w-10 rounded-2xl bg-[#132317] text-lime-200 grid place-items-center text-xs font-black">
                    {label.slice(0, 2).toUpperCase()}
                  </div>
                  <p className="text-xs font-black text-stone-700">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

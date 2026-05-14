"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 min-h-[90vh] flex items-center pt-16">
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/3 w-150 h-100 bg-green-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-4xl">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Live on Mantle Network · Turing Test Hackathon 2026
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
            Africa&apos;s green economy,{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-green-400 via-emerald-300 to-teal-300">
              on-chain
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl">
            Tokenize real African green inventory — clean energy, sustainable agri, upcycled goods —
            and connect with global buyers through AI-powered price discovery on Mantle Network.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3 mb-16">
            <Link
              href="/marketplace"
              className="px-6 py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/20 text-sm"
            >
              Browse Marketplace →
            </Link>
            <Link
              href="/list"
              className="px-6 py-3.5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-all text-sm"
            >
              List Your Inventory
            </Link>
            <Link
              href="/agent"
              className="flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm"
            >
              🤖 Ask AI Agent
            </Link>
          </div>

          {/* Inline stats */}
          <div className="flex flex-wrap gap-x-10 gap-y-4 pt-8 border-t border-white/5">
            {[
              { value: "ERC-1155", sub: "Token standard" },
              { value: "2.5%", sub: "Platform fee" },
              { value: "Claude AI", sub: "Price intelligence" },
              { value: "Mantle L2", sub: "Low-cost settlement" },
            ].map(({ value, sub }) => (
              <div key={sub}>
                <div className="text-white font-bold text-base">{value}</div>
                <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

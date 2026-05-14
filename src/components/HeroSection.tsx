"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-green-50 via-emerald-50 to-teal-50" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live on Mantle Network
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Africa's green economy,{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-500">
              on-chain
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Tokenize real African green inventory — clean energy, sustainable agri, upcycled goods — and connect with global buyers and investors through AI-powered price discovery.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href="/marketplace"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-green-200"
            >
              Browse Marketplace
            </Link>
            <Link
              href="/list"
              className="px-6 py-3 border-2 border-green-600 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors"
            >
              List Your Inventory
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-gray-500">
            Evolved from <span className="font-semibold text-gray-700">FuelFlow</span> — VibeJam 2026 Grand Champion &bull; 200M+ African green entrepreneurs &bull; Live on Mantle
          </p>
        </div>
      </div>
    </section>
  );
}

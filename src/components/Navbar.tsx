"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-bold text-gray-900">Mazingira</span>
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">on Mantle</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors">Marketplace</Link>
            <Link href="/vendors" className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors">Vendors</Link>
            <Link href="/list" className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors">List Product</Link>
            <Link href="/agent" className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors">AI Agent</Link>
          </div>

          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}

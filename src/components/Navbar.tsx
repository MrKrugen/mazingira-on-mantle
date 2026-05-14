"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NAV_LINKS = [
  { href: "/marketplace", label: "Marketplace", icon: "🏪" },
  { href: "/vendors",     label: "Vendors",     icon: "🧑‍🌾" },
  { href: "/list",        label: "List Product", icon: "➕" },
  { href: "/agent",       label: "AI Agent",    icon: "🤖" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-sm shadow-sm shadow-green-200">
              🌿
            </div>
            <span className="font-bold text-gray-900 text-base tracking-tight">Mazingira</span>
            <span className="hidden sm:inline-flex text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
              on Mantle
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label, icon }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-green-50 text-green-700 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span className="text-base leading-none">{icon}</span>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Wallet */}
          <div className="shrink-0">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

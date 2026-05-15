"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NAV_LINKS = [
  { href: "/marketplace", label: "Marketplace", icon: "M" },
  { href: "/secondary", label: "Secondary", icon: "S" },
  { href: "/vendors", label: "Vendors", icon: "V" },
  { href: "/list", label: "List Product", icon: "+" },
  { href: "/agent", label: "AI Agent", icon: "AI" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-stone-200/80 bg-[#f7f8f2]/88 backdrop-blur-2xl shadow-[0_18px_60px_rgba(19,35,23,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-10 h-10 rounded-2xl bg-[#132317] text-lime-200 flex items-center justify-center font-black tracking-tight shadow-lg shadow-emerald-950/15">
              M
              <span className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-lime-300 border-2 border-[#f7f8f2]" />
            </div>
            <div className="leading-tight">
              <span className="block font-black text-stone-950 tracking-tight">Mazingira</span>
              <span className="block text-[11px] uppercase tracking-[0.24em] text-stone-500">on Mantle</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 rounded-2xl border border-stone-200 bg-white/70 p-1 shadow-sm">
            {NAV_LINKS.map(({ href, label, icon }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#132317] text-white shadow-md shadow-emerald-950/15"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                  }`}
                >
                  <span className={`grid place-items-center text-[11px] font-black ${
                    icon.length > 1 ? "min-w-5" : "w-5 h-5 rounded-full"
                  } ${active ? "bg-white/15 text-lime-200" : "bg-stone-200 text-stone-700"}`}>
                    {icon}
                  </span>
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="shrink-0">
            <ConnectButton />
          </div>
        </div>

        <div className="no-scrollbar lg:hidden flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  active
                    ? "bg-[#132317] text-white border-[#132317]"
                    : "bg-white/75 text-stone-600 border-stone-200"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

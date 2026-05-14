import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-sm">🌿</div>
              <span className="font-bold text-white text-base">Mazingira on Mantle</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Africa&apos;s green economy, on-chain. Built for the Turing Test Hackathon 2026 on Mantle Network.
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-green-500 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live on Mantle Sepolia
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Platform</h4>
              <ul className="space-y-2.5">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/list" className="hover:text-white transition-colors">List Product</Link></li>
                <li><Link href="/agent" className="hover:text-white transition-colors">AI Agent</Link></li>
                <li><Link href="/vendors" className="hover:text-white transition-colors">Vendors</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Network</h4>
              <ul className="space-y-2.5">
                <li><a href="https://mantle.xyz" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Mantle</a></li>
                <li><a href="https://mantlescan.xyz" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">MantleScan</a></li>
                <li><a href="https://sepolia.mantlescan.xyz/address/0xF12c4E7296a0f0A6df8ef91712CC0bF6A189155c" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Contract ↗</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Origin</h4>
              <ul className="space-y-2.5">
                <li><a href="https://fuelflow.vibeos.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">FuelFlow</a></li>
                <li className="text-slate-600">VibeJam 2026 Grand Champion</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-600">
          <span>© 2026 Mazingira on Mantle · Built by Krugen</span>
          <span>Powered by Mantle Network · Claude AI · Cloudflare</span>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#132317] text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-lime-300 text-sm font-black text-stone-950">M</div>
              <div>
                <span className="block font-black text-white">Mazingira on Mantle</span>
                <span className="block text-[11px] uppercase tracking-[0.24em] text-stone-500">green inventory exchange</span>
              </div>
            </div>
            <p className="text-sm leading-7 text-stone-500">
              Africa&apos;s green economy, on-chain. Built for a faster path between local climate-positive inventory and global buyer demand.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.22em] text-white mb-3">Platform</h4>
              <ul className="space-y-2.5">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/list" className="hover:text-white transition-colors">List Product</Link></li>
                <li><Link href="/agent" className="hover:text-white transition-colors">AI Agent</Link></li>
                <li><Link href="/vendors" className="hover:text-white transition-colors">Vendors</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.22em] text-white mb-3">Network</h4>
              <ul className="space-y-2.5">
                <li><a href="https://mantle.xyz" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Mantle</a></li>
                <li><a href="https://mantlescan.xyz" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">MantleScan</a></li>
                <li><a href="https://sepolia.mantlescan.xyz/address/0xF12c4E7296a0f0A6df8ef91712CC0bF6A189155c" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Contract</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.22em] text-white mb-3">Origin</h4>
              <ul className="space-y-2.5">
                <li><a href="https://fuelflow.vibeos.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">FuelFlow</a></li>
                <li className="text-stone-600">Hackathon prototype</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-stone-600 sm:flex-row sm:justify-between">
          <span>Mazingira on Mantle. Built by Krugen.</span>
          <span>Powered by Mantle Network, Claude AI, and Cloudflare.</span>
        </div>
      </div>
    </footer>
  );
}

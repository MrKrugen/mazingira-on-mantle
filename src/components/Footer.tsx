import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌿</span>
              <span className="font-bold text-white">Mazingira on Mantle</span>
            </div>
            <p className="text-sm max-w-xs leading-relaxed">
              Africa's green economy, on-chain. Built for the Turing Test Hackathon 2026 on Mantle Network.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/list" className="hover:text-white transition-colors">List Product</Link></li>
                <li><Link href="/agent" className="hover:text-white transition-colors">AI Agent</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Network</h4>
              <ul className="space-y-2">
                <li><a href="https://mantle.xyz" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Mantle</a></li>
                <li><a href="https://mantlescan.xyz" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">MantleScan</a></li>
                <li><a href="https://fuelflow.vibeos.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">FuelFlow (origin)</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-xs flex flex-col sm:flex-row justify-between gap-2">
          <span>© 2026 Mazingira on Mantle. Built by Krugen.</span>
          <span>Powered by Mantle Network · Claude AI · Cloudflare</span>
        </div>
      </div>
    </footer>
  );
}

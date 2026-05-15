import { Navbar } from "@/components/Navbar";
import { AgentChat } from "@/components/AgentChat";

export default function AgentPage() {
  return (
    <div className="h-screen overflow-hidden bg-[#f5f7f2]">
      <Navbar />

      <div className="mx-auto grid h-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8 pt-32 lg:pt-24 pb-0">
        <aside className="hidden lg:block">
          <div className="rounded-[2rem] bg-[#132317] p-6 text-white shadow-2xl shadow-emerald-950/15">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-lime-300">Mazingira AI</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight">Buyer and vendor intelligence</h1>
            <p className="mt-4 text-sm leading-7 text-stone-300">
              Ask about pricing, products, CO2 impact, or the buyer path for live on-chain inventory.
            </p>
            <div className="mt-8 grid gap-3">
              {["Live inventory", "Pricing context", "Impact signal"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-black text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-h-0">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-t-[2rem] border border-stone-200 bg-white shadow-2xl shadow-stone-950/8">
            <div className="shrink-0 border-b border-stone-100 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#132317] text-sm font-black text-lime-200">
                  AI
                </div>
                <div>
                  <h1 className="font-black text-stone-950">Mazingira AI Agent</h1>
                  <p className="text-xs text-stone-500">Reads live on-chain inventory on Mantle Sepolia</p>
                </div>
                <span className="ml-auto hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
            </div>
            <AgentChat />
          </div>
        </main>
      </div>
    </div>
  );
}

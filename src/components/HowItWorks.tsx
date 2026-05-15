const steps = [
  {
    step: "01",
    title: "Vendor approval",
    description: "A green entrepreneur connects a wallet, gets approved, and prepares a real product batch.",
    mark: "ID",
  },
  {
    step: "02",
    title: "Inventory mint",
    description: "The batch becomes an ERC-1155 asset with supply, price, vendor, and impact data.",
    mark: "NFT",
  },
  {
    step: "03",
    title: "AI pricing",
    description: "The assistant helps compare category, carbon value, and buyer fit before a listing goes live.",
    mark: "AI",
  },
  {
    step: "04",
    title: "Buyer settlement",
    description: "Buyers acquire tokenized units in MNT and can inspect the transaction on Mantle.",
    mark: "MNT",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#132317] py-20 text-white">
      <div className="absolute inset-0 moire-panel opacity-35 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-lime-300">Operating model</p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">How the market moves</h2>
            <p className="mt-5 max-w-md text-stone-300 leading-7">
              The flow is intentionally direct. Less ceremony for buyers, stronger signals for sellers, and a cleaner path from stock to settlement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map((s) => (
              <div key={s.step} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/10">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-mono font-black text-lime-300">{s.step}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-lime-300 text-[11px] font-black text-stone-950">
                    {s.mark}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-black text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-400">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

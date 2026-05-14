const steps = [
  {
    step: "01",
    title: "Vendor registers",
    description: "African green entrepreneur connects wallet, gets approved, and lists real-world inventory.",
    icon: "🧑‍🌾",
  },
  {
    step: "02",
    title: "Inventory tokenized",
    description: "Each product batch is minted as an ERC-1155 token on Mantle — verifiable, tradeable, on-chain.",
    icon: "🪙",
  },
  {
    step: "03",
    title: "AI sets fair price",
    description: "Claude analyses comparable assets and recommends optimal pricing for buyers and sellers.",
    icon: "🤖",
  },
  {
    step: "04",
    title: "Buyers invest globally",
    description: "Anyone with a wallet can discover, purchase, or invest in tokenized African green assets using MNT.",
    icon: "🌍",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3">The flow</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How it works</h2>
          <p className="text-slate-400 max-w-xl mx-auto">From real-world green inventory to on-chain investable assets in four steps.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px bg-linear-to-r from-green-500/30 to-transparent z-0" />
              )}
              <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-green-500/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-2xl mb-5">
                  {s.icon}
                </div>
                <div className="text-xs font-mono font-bold text-green-400 mb-2">{s.step}</div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

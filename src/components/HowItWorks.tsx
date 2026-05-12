const steps = [
  {
    step: "01",
    title: "Vendor registers",
    description: "African green entrepreneur connects wallet, gets approved, and lists real-world inventory.",
    icon: "🧑‍🌾",
  },
  {
    step: "02",
    title: "Inventory is tokenized",
    description: "Each product batch is minted as an ERC-1155 token on Mantle — verifiable, tradeable, on-chain.",
    icon: "🪙",
  },
  {
    step: "03",
    title: "AI sets fair price",
    description: "Our Claude-powered agent analyses comparable assets and recommends optimal pricing for buyers and sellers.",
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
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">From real-world green inventory to on-chain investable assets in four steps.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{s.icon}</div>
              <div className="text-xs font-mono font-bold text-green-500 mb-2">{s.step}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

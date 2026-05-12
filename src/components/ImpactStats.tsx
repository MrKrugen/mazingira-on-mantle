"use client";

const stats = [
  { value: "6", label: "Green categories", icon: "🌱" },
  { value: "2.5%", label: "Platform fee only", icon: "💚" },
  { value: "MNT", label: "Native Mantle token", icon: "⛓️" },
  { value: "AI", label: "Powered price discovery", icon: "🤖" },
];

export function ImpactStats() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-3xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

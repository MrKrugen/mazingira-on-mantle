import { Navbar } from "@/components/Navbar";
import { AgentChat } from "@/components/AgentChat";

export default function AgentPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 pt-16 pb-0 overflow-hidden">
        {/* Header */}
        <div className="py-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-lg">
              🌿
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Mazingira AI Agent</h1>
              <p className="text-xs text-gray-400">
                Powered by Claude · reads live on-chain inventory · Mantle Sepolia
              </p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>
        </div>

        {/* Chat — fills remaining height */}
        <div className="flex-1 bg-white rounded-t-2xl border border-gray-200 border-b-0 shadow-sm overflow-hidden flex flex-col">
          <AgentChat />
        </div>
      </div>
    </div>
  );
}

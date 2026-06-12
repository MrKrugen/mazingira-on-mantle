"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
  followups?: string[];
};

const STARTERS = [
  "What's the best-value green inventory token right now?",
  "I have 500kg of biochar in Nakuru — what should I list it for?",
  "What happens if I don't collect my tokens within 30 days?",
  "How do I know the physical inventory actually exists?",
];

function parseFollowups(raw: string): { content: string; followups: string[] } {
  const lines = raw.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim().toUpperCase().startsWith("FOLLOWUPS:")) {
      const followups = lines[i]
        .replace(/^FOLLOWUPS:\s*/i, "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);
      const contentLines = lines.slice(0, i);
      while (contentLines.length > 0 && contentLines[contentLines.length - 1].trim() === "") {
        contentLines.pop();
      }
      return { content: contentLines.join("\n"), followups };
    }
  }
  return { content: raw, followups: [] };
}

export function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;

    const userMsg: Message = { role: "user", content: text };
    const history = messages.slice(-10);
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setStreaming(true);

    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok || !res.body) throw new Error("Agent request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) => {
          const updated = [...m];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { role: "assistant", content: last.content + chunk };
          return updated;
        });
      }

      setMessages((m) => {
        const updated = [...m];
        const last = updated[updated.length - 1];
        if (last.role === "assistant") {
          const { content, followups } = parseFollowups(last.content);
          updated[updated.length - 1] = { ...last, content, followups };
        }
        return updated;
      });
    } catch {
      setMessages((m) => {
        const updated = [...m];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-4 bg-[#0a1410]">
        {messages.length === 0 && (
          <div className="mx-auto max-w-2xl pt-4 sm:pt-10 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-black text-emerald-950 shadow-lg shadow-emerald-500/20">
              AI
            </div>
            <h3 className="font-black text-white">Start with a market question</h3>
            <p className="mx-auto mt-2 mb-8 max-w-md text-sm leading-6 text-emerald-300/50">
              The agent can talk through pricing, products, CO2 impact, and how to list green inventory on Mantle.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-2xl border border-emerald-900/40 bg-[#0d1a13] px-4 py-3 text-left text-sm font-bold text-stone-200 shadow-sm transition-colors hover:border-emerald-500/40 hover:bg-emerald-950/40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}>
              {msg.role === "assistant" && (
                <div className="mr-2 mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-[10px] font-black text-emerald-950 shadow-md shadow-emerald-500/10">
                  AI
                </div>
              )}
              <div
                className={`max-w-[84%] rounded-3xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.role === "user"
                    ? "rounded-tr-md bg-gradient-to-br from-emerald-500 to-teal-600 text-emerald-950 font-medium"
                    : "rounded-tl-md border border-emerald-900/40 bg-[#0d1a13] text-stone-200"
                }`}
              >
                {msg.content}
                {streaming && i === messages.length - 1 && msg.role === "assistant" && (
                  <span className="ml-1 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-emerald-400" />
                )}
              </div>
            </div>

            {msg.role === "assistant" &&
              !streaming &&
              i === messages.length - 1 &&
              msg.followups &&
              msg.followups.length > 0 && (
                <div className="mt-3 ml-10 flex flex-wrap gap-2">
                  {msg.followups.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-2xl border border-emerald-900/40 bg-[#0d1a13] px-3 py-2 text-left text-xs font-bold text-emerald-300 shadow-sm transition-colors hover:border-emerald-500/40 hover:bg-emerald-950/40"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-emerald-900/30 bg-[#0d1a13] p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about pricing, products, or green impact"
            disabled={streaming}
            className="min-w-0 flex-1 rounded-2xl border border-emerald-900/40 bg-[#0a1410] px-4 py-3 text-sm text-white placeholder:text-emerald-300/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 px-5 py-3 text-sm font-black text-emerald-950 shadow-lg shadow-emerald-500/20 transition-opacity hover:opacity-90 disabled:opacity-30 disabled:shadow-none"
          >
            {streaming ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
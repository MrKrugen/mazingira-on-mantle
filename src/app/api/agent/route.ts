import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createPublicClient, http, formatEther, defineChain } from "viem";
import { MAZINGIRA_RWA_ABI, CONTRACT_ADDRESSES, CATEGORY_LABELS } from "@/lib/contracts";

// Defined inline — importing from @/lib/wagmi pulls in RainbowKit which requires a browser context
const mantleSepolia = defineChain({
  id: 5003,
  name: "Mantle Sepolia",
  nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.sepolia.mantle.xyz"] } },
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const viemClient = createPublicClient({
  chain: mantleSepolia,
  transport: http("https://rpc.sepolia.mantle.xyz", { timeout: 8_000 }),
});

async function getOnChainProducts() {
  const deadline = new Promise<[]>((resolve) => setTimeout(() => resolve([]), 8_000));

  const fetch = async () => {
    try {
      const nextTokenId = await viemClient.readContract({
        address: CONTRACT_ADDRESSES.mantleSepolia,
        abi: MAZINGIRA_RWA_ABI,
        functionName: "nextTokenId",
      });

      const count = Number(nextTokenId) - 1;
      if (count <= 0) return [];

      const results = await Promise.all(
        Array.from({ length: count }, (_, i) =>
          viemClient.readContract({
            address: CONTRACT_ADDRESSES.mantleSepolia,
            abi: MAZINGIRA_RWA_ABI,
            functionName: "getProduct",
            args: [BigInt(i + 1)],
          })
        )
      );

      return results
        .map((p, i) => ({ ...p, tokenId: i + 1 }))
        .filter((p) => p.active)
        .map((p) => ({
          tokenId: p.tokenId,
          name: p.metadataURI,
          category: CATEGORY_LABELS[Number(p.category)] ?? "Unknown",
          pricePerUnit: formatEther(p.pricePerUnit) + " MNT",
          available: Number(p.available),
          totalSupply: Number(p.totalSupply),
          co2SavedKgPerUnit: Number(p.co2SavedKgPerUnit),
        }));
    } catch {
      return [];
    }
  };

  return Promise.race([fetch(), deadline]);
}

function buildSystemPrompt(products: ReturnType<typeof getOnChainProducts> extends Promise<infer T> ? T : never) {
  const productList = products.length > 0
    ? products.map((p) =>
        `  • Token #${p.tokenId}: "${p.name}" | ${p.category} | ${p.pricePerUnit} | ${p.available} units available | ${p.co2SavedKgPerUnit} kg CO₂ saved/unit`
      ).join("\n")
    : "  No products listed yet.";

  return `You are the Mazingira AI Agent — a smart market advisor for Mazingira on Mantle, Africa's first on-chain green marketplace on Mantle Network.

You help three types of people:
- **Vendors** (African green entrepreneurs) price their inventory competitively and list products
- **Buyers** (local and global) discover the right tokenized green assets for their needs
- **Anyone** understand RWA tokenization, green impact, and how the platform works

## Live On-Chain Inventory (Mantle Sepolia, read fresh for this conversation)
${productList}

## Platform facts
- Smart contract: 0xF12c4E7296a0f0A6df8ef91712CC0bF6A189155c (Mantle Sepolia)
- Platform fee: 2.5% on every sale
- Payments: MNT (Mantle's native token)
- Categories: Clean Energy, Waste & Recycling, Sustainable Agri, Upcycled Fashion, Green Building, Environmental Services
- Origin: evolved from FuelFlow, VibeJam 2026 Grand Champion biomass marketplace

## Your personality
Warm, sharp, and grounded in African market reality. You understand both Web3 and East African business context. Be concise and actionable. When advising on pricing, reference the live listings above for comparison. When helping buyers, surface the most relevant tokens by name and token ID so they can navigate directly.`;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    const products = await getOnChainProducts();
    const systemPrompt = buildSystemPrompt(products);

    const stream = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        ...history,
        { role: "user" as const, content: message },
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (err) {
          console.error("[agent] stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("[agent] POST error:", err);
    return new Response("Agent error — please try again.", { status: 500 });
  }
}

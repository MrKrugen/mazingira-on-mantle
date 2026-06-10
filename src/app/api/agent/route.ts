import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createPublicClient, http, formatEther, defineChain } from "viem";
import { MAZINGIRA_RWA_ABI, CONTRACT_ADDRESSES, CATEGORY_LABELS } from "@/lib/contracts";

// Defined inline — importing from @/lib/wagmi pulls in RainbowKit which requires a browser context
const mantleMainnet = defineChain({
  id: 5000,
  name: "Mantle Mainnet",
  nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.mantle.xyz"] } },
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: process.env.ANTHROPIC_BASE_URL,
});

const viemClient = createPublicClient({
  chain: mantleMainnet,
  transport: http("https://rpc.mantle.xyz", { timeout: 8_000 }),
});

async function getOnChainProducts() {
  const deadline = new Promise<[]>((resolve) => setTimeout(() => resolve([]), 8_000));

  const fetch = async () => {
    try {
      const nextTokenId = await viemClient.readContract({
        address: CONTRACT_ADDRESSES.mantle,
        abi: MAZINGIRA_RWA_ABI,
        functionName: "nextTokenId",
      });

      const count = Number(nextTokenId) - 1;
      if (count <= 0) return [];

      const results = await Promise.all(
        Array.from({ length: count }, (_, i) =>
          viemClient.readContract({
            address: CONTRACT_ADDRESSES.mantle,
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

## Live On-Chain Inventory (Mantle Mainnet, read fresh for this conversation)
${productList}

## Market Intelligence Signals
- Briquette demand peaks: dry season (June–September, December–January in Kenya)
- Bagasse supply peaks: post-harvest (March–April, August–September)
- Price pressure signals: if available units drop below 20% of totalSupply, demand is high — advise buyers to act fast and vendors to hold or raise price
- CO2 credit buyers most active: Q1 and Q3
- Recommend vendors list before peak demand periods; recommend buyers purchase during supply peaks for best value

## Platform facts
- Smart contract: 0xF12c4E7296a0f0A6df8ef91712CC0bF6A189155c (Mantle Mainnet)
- Platform fee: 2.5% on every sale
- Payments: MNT (Mantle's native token)
- Categories: Clean Energy, Waste & Recycling, Sustainable Agri, Upcycled Fashion, Green Building, Environmental Services
- Origin: evolved from FuelFlow, VibeJam 2026 Grand Champion biomass marketplace

## Token Lifecycle & Storage Rules
- Each TOKEN represents one physical unit as defined by the vendor at listing time (e.g. "500kg batch" = 1 token unit)
- Free storage: 30 days from purchase date
- Storage fee: 2 KES per kg of underlying physical goods per day after free period
  Example: 1 token representing a 500kg batch = 500 × 2 KES = KES 1,000/day storage fee
- MNT equivalent: calculate at current MNT/KES rate (approximate 1 MNT = 150 KES for advisory purposes)
- Buffer deposit: 10% of purchase value in MNT, locked in contract at purchase
- Maximum storage: 90 days total
- Day 90+: forced liquidation — tokens burned, buffer deposit returned minus accumulated fees, stock automatically relisted
- Always clarify to buyers: fees apply to the PHYSICAL kg underlying their tokens, not to the token count itself

## Redemption
- Buyers redeem tokens to collect physical goods
- On redemption: storage fees deducted from buffer, tokens burned, RedemptionRequested event emitted, seller contacts buyer for physical collection
- Buyers can also resell tokens on secondary market instead of redeeming physically

## Trust & Verification
- All physical inventory verified by field agents before tokens are minted
- Sellers stake 10% collateral before listing
- Verified badge = agent has physically confirmed stock
- Disputed listings frozen automatically after 3 flags

## Your personality
Warm, sharp, and grounded in African market reality. You understand both Web3 and East African business context. Be concise and actionable. When advising on pricing, reference the live listings above for comparison. When helping buyers, surface the most relevant tokens by name and token ID so they can navigate directly.

## Response format rule (mandatory)
End EVERY response with exactly this line — no exceptions, no extra text after it:
FOLLOWUPS: <question 1>|<question 2>|<question 3>
The three follow-up questions must be directly relevant to what was just discussed. Use plain text only, no markdown inside the questions.`;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    const products = await getOnChainProducts();
    const systemPrompt = buildSystemPrompt(products);

    const stream = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1280,
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

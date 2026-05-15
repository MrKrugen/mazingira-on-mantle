import { NextRequest } from "next/server";
import { createPublicClient, http, defineChain } from "viem";
import { CONTRACT_ADDRESSES, MAZINGIRA_RWA_ABI } from "@/lib/contracts";

// TODO: post-hackathon — replace direct mapping queries with full event log
// scanning (getLogs on ProductPurchased) once a reliable Mantle Sepolia
// archive node or indexer is available. getLogs with fromBlock: 0n times out
// on the public RPC during the hackathon.

const mantleSepolia = defineChain({
  id: 5003,
  name: "Mantle Sepolia",
  nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.sepolia.mantle.xyz"] } },
});

const viemClient = createPublicClient({
  chain: mantleSepolia,
  transport: http("https://rpc.sepolia.mantle.xyz", { timeout: 8_000 }),
});

const EMPTY_RESPONSE = (extra?: object) =>
  Response.json({
    alerts: [],
    checked_at: new Date().toISOString(),
    network: "mantle-sepolia",
    status: "ok",
    ...extra,
  });

async function checkWalletAlerts(
  wallet: `0x${string}`,
  tokenCount: number
): Promise<object[]> {
  const nowSec = Math.floor(Date.now() / 1000);
  const alerts: object[] = [];

  await Promise.all(
    Array.from({ length: tokenCount }, async (_, i) => {
      const tokenId = BigInt(i + 1);
      try {
        const [ts, product] = await Promise.all([
          viemClient.readContract({
            address: CONTRACT_ADDRESSES.mantleSepolia,
            abi: MAZINGIRA_RWA_ABI,
            functionName: "purchaseTimestamp",
            args: [tokenId, wallet],
          }),
          viemClient.readContract({
            address: CONTRACT_ADDRESSES.mantleSepolia,
            abi: MAZINGIRA_RWA_ABI,
            functionName: "getProduct",
            args: [tokenId],
          }),
        ]);

        if (!ts || ts === 0n) return;

        const daysSincePurchase   = Math.floor((nowSec - Number(ts)) / 86_400);
        const freeStorageDays     = Number(product.freeStorageDays);
        const maxStorageDays      = Number(product.maxStorageDays);
        const daysUntilFees       = freeStorageDays - daysSincePurchase;
        const daysUntilLiquidation = maxStorageDays - daysSincePurchase;

        let urgency: "warning" | "critical" | null = null;
        let message = "";

        if (daysSincePurchase > maxStorageDays) {
          urgency = "critical";
          message = "Eligible for forced liquidation";
        } else if (daysUntilLiquidation <= 10) {
          urgency = "critical";
          message = `${daysUntilLiquidation} day${daysUntilLiquidation !== 1 ? "s" : ""} until forced liquidation`;
        } else if (daysUntilFees >= 0 && daysUntilFees <= 5) {
          urgency = "warning";
          message = `Storage fees start in ${daysUntilFees} day${daysUntilFees !== 1 ? "s" : ""}`;
        }

        if (!urgency) return;

        alerts.push({
          tokenId: (i + 1).toString(),
          buyer: wallet,
          daysSincePurchase,
          freeStorageDays,
          maxStorageDays,
          urgency,
          message,
        });
      } catch {
        // Skip individual token read failures silently
      }
    })
  );

  return alerts;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletParam = searchParams.get("wallet");

    // Without a wallet address we can't know which holders to check —
    // return the empty structure immediately.
    if (!walletParam) {
      return EMPTY_RESPONSE({ note: "Pass ?wallet=0x... to check a specific holder" });
    }

    const wallet = walletParam as `0x${string}`;

    // Read token count so we know how many slots to scan
    const nextTokenId = await viemClient.readContract({
      address: CONTRACT_ADDRESSES.mantleSepolia,
      abi: MAZINGIRA_RWA_ABI,
      functionName: "nextTokenId",
    }).catch(() => 1n);

    const tokenCount = Math.max(0, Number(nextTokenId) - 1);
    if (tokenCount === 0) return EMPTY_RESPONSE();

    const alerts = await checkWalletAlerts(wallet, tokenCount);

    return Response.json({
      alerts,
      checked_at: new Date().toISOString(),
      network: "mantle-sepolia",
      status: "ok",
      wallet,
      tokens_checked: tokenCount,
    });
  } catch (err) {
    // Never return 500 — log and return the safe empty structure
    console.error("[storage-alerts]", err);
    return EMPTY_RESPONSE({ note: "Chain read failed — retrying next poll" });
  }
}

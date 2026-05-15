import { NextRequest } from "next/server";
import { createPublicClient, http, defineChain } from "viem";
import { CONTRACT_ADDRESSES, MAZINGIRA_RWA_ABI } from "@/lib/contracts";

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

export type VendorRecord = {
  id: string;
  wallet: string;
  status: "pending" | "approved";
  businessName: string;
  role: string;
  county: string;
  phone: string;
  description: string;
  primaryMaterial: string;
  monthlyVolume: string;
  currentStock: string;
  storageLocation: string;
  createdAt: string;
  approvedAt?: string;
};

// Pre-seeded demo vendor — mirrors the deployer wallet approved on-chain via seed.ts
const DEMO_VENDOR: VendorRecord = {
  id: "VND-DEMO",
  wallet: "0x8c6E27d8C5a511F784e52a56b14477Ab21e32ef0",
  status: "approved",
  businessName: "Mazingira Demo Farm",
  role: "Clean Energy Producer",
  county: "Nakuru",
  phone: "+254712345678",
  description: "East Africa's first on-chain tokenized green inventory marketplace demo vendor.",
  primaryMaterial: "Biomass briquettes, recycled PET, organic produce, solar arrays",
  monthlyVolume: "5 tonnes",
  currentStock: "6 active token listings",
  storageLocation: "Nakuru Industrial Area, Kenya",
  createdAt: "2026-01-01T00:00:00.000Z",
  approvedAt: "2026-01-01T00:00:00.000Z",
};

// In-memory store, pre-seeded with demo vendor
const vendorApplications: VendorRecord[] = [DEMO_VENDOR];

function generateId(): string {
  return `VND-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");

  // No wallet → return full approved vendor directory
  if (!wallet) {
    return Response.json({
      vendors: vendorApplications.filter((v) => v.status === "approved"),
      pending: vendorApplications.filter((v) => v.status === "pending").length,
    });
  }

  const normalizedWallet = wallet.toLowerCase();

  // Check in-memory first (covers applications submitted this session)
  const existing = vendorApplications.find(
    (v) => v.wallet.toLowerCase() === normalizedWallet
  );
  if (existing) {
    return Response.json({
      status: existing.status,
      applicationId: existing.id,
      vendorName: existing.businessName,
      approvedAt: existing.approvedAt,
    });
  }

  // Check on-chain approval (handles the deployer wallet and any admin-approved wallets)
  try {
    const isApproved = await viemClient.readContract({
      address: CONTRACT_ADDRESSES.mantleSepolia,
      abi: MAZINGIRA_RWA_ABI,
      functionName: "approvedVendors",
      args: [wallet as `0x${string}`],
    });
    if (isApproved) {
      return Response.json({ status: "approved", vendorName: "Verified Vendor" });
    }
  } catch {
    // Chain read failure — fall through to 'none'
  }

  return Response.json({ status: "none" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      wallet, businessName, role, county, phone, description,
      primaryMaterial, monthlyVolume, currentStock, storageLocation,
    } = body;

    if (!wallet || !businessName || !phone) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prevent duplicate applications per wallet
    const existing = vendorApplications.find(
      (v) => v.wallet.toLowerCase() === wallet.toLowerCase()
    );
    if (existing) {
      return Response.json({ applicationId: existing.id, status: existing.status });
    }

    const record: VendorRecord = {
      id: generateId(),
      wallet: wallet as string,
      status: "pending",
      businessName,
      role: role ?? "Environmental Services",
      county: county ?? "Nairobi",
      phone,
      description: description ?? "",
      primaryMaterial: primaryMaterial ?? "",
      monthlyVolume: monthlyVolume ?? "",
      currentStock: currentStock ?? "",
      storageLocation: storageLocation ?? "",
      createdAt: new Date().toISOString(),
    };

    vendorApplications.push(record);
    return Response.json({ applicationId: record.id, status: "pending" }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

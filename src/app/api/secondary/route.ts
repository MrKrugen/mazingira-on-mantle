import { NextRequest } from "next/server";

export type SecondaryListing = {
  id: string;
  tokenId: number;
  seller: string;
  quantity: number;
  askPriceMNT: string;
  listedAt: string;
  status: "active" | "sold" | "cancelled";
  productName?: string;
  category?: number;
  co2SavedKgPerUnit?: number;
  primaryPriceMNT?: string;
  freeStorageDays?: number;
  maxStorageDays?: number;
};

// In-memory store — resets on server restart (MVP only)
const listings: SecondaryListing[] = [];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tokenIdFilter = searchParams.get("tokenId");
  const sellerFilter  = searchParams.get("seller");

  let result = listings.filter((l) => l.status === "active");
  if (tokenIdFilter) result = result.filter((l) => l.tokenId === parseInt(tokenIdFilter, 10));
  if (sellerFilter)  result = result.filter((l) => l.seller.toLowerCase() === sellerFilter.toLowerCase());

  return Response.json({ listings: result, count: result.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tokenId, seller, quantity, askPriceMNT,
      productName, category, co2SavedKgPerUnit,
      primaryPriceMNT, freeStorageDays, maxStorageDays,
    } = body;

    if (!tokenId || !seller || !quantity || !askPriceMNT) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const listing: SecondaryListing = {
      id: crypto.randomUUID(),
      tokenId: Number(tokenId),
      seller: seller as string,
      quantity: Number(quantity),
      askPriceMNT: String(askPriceMNT),
      listedAt: new Date().toISOString(),
      status: "active",
      productName,
      category: category !== undefined ? Number(category) : undefined,
      co2SavedKgPerUnit: co2SavedKgPerUnit !== undefined ? Number(co2SavedKgPerUnit) : undefined,
      primaryPriceMNT: primaryPriceMNT ? String(primaryPriceMNT) : undefined,
      freeStorageDays: freeStorageDays !== undefined ? Number(freeStorageDays) : undefined,
      maxStorageDays: maxStorageDays !== undefined ? Number(maxStorageDays) : undefined,
    };

    listings.push(listing);
    return Response.json({ listing }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return Response.json({ error: "Missing id or status" }, { status: 400 });
    }

    const idx = listings.findIndex((l) => l.id === id);
    if (idx === -1) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    listings[idx] = { ...listings[idx], status };
    return Response.json({ listing: listings[idx] });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

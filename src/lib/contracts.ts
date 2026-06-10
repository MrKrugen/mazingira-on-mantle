// Generated after `npx hardhat compile` — paste the ABI from
// artifacts/contracts/MazingiraRWA.sol/MazingiraRWA.json here.
// Using `as const` lets wagmi infer typed hook results automatically.

export const MAZINGIRA_RWA_ABI = [
  // ─── Events ────────────────────────────────────────────────────────────────
  { type: "event", name: "ProductListed",       inputs: [{ name: "tokenId", type: "uint256", indexed: true }, { name: "vendor", type: "address", indexed: true }, { name: "category", type: "uint8" }, { name: "pricePerUnit", type: "uint256" }, { name: "supply", type: "uint256" }] },
  { type: "event", name: "ProductPurchased",    inputs: [{ name: "tokenId", type: "uint256", indexed: true }, { name: "buyer", type: "address", indexed: true }, { name: "quantity", type: "uint256" }, { name: "totalPaid", type: "uint256" }] },
  { type: "event", name: "MetadataUpdated",     inputs: [{ name: "tokenId", type: "uint256", indexed: true }, { name: "newMetadataURI", type: "string" }] },
  { type: "event", name: "VendorApproved",      inputs: [{ name: "vendor", type: "address", indexed: true }] },
  { type: "event", name: "VendorRevoked",       inputs: [{ name: "vendor", type: "address", indexed: true }] },
  { type: "event", name: "StorageConfigured",   inputs: [{ name: "tokenId", type: "uint256", indexed: true }, { name: "freeStorageDays", type: "uint256" }, { name: "storageFeePerKgDaily", type: "uint256" }, { name: "maxStorageDays", type: "uint256" }] },
  { type: "event", name: "StorageFeePaid",      inputs: [{ name: "tokenId", type: "uint256", indexed: true }, { name: "holder", type: "address", indexed: true }, { name: "amount", type: "uint256" }] },
  { type: "event", name: "ForcedLiquidation",   inputs: [{ name: "tokenId", type: "uint256", indexed: true }, { name: "holder", type: "address", indexed: true }, { name: "refundAmount", type: "uint256" }] },
  { type: "event", name: "RedemptionRequested", inputs: [{ name: "tokenId", type: "uint256", indexed: true }, { name: "buyer", type: "address", indexed: true }, { name: "quantity", type: "uint256" }, { name: "vendor", type: "address" }] },

  // ─── Read ──────────────────────────────────────────────────────────────────
  {
    type: "function", name: "getProduct", stateMutability: "view",
    inputs:  [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "tuple", components: [
      { name: "id",                   type: "uint256" },
      { name: "vendor",               type: "address" },
      { name: "metadataURI",          type: "string"  },
      { name: "pricePerUnit",         type: "uint256" },
      { name: "totalSupply",          type: "uint256" },
      { name: "available",            type: "uint256" },
      { name: "category",             type: "uint8"   },
      { name: "co2SavedKgPerUnit",    type: "uint256" },
      { name: "active",               type: "bool"    },
      { name: "freeStorageDays",      type: "uint256" },
      { name: "storageFeePerKgDaily", type: "uint256" },
      { name: "maxStorageDays",       type: "uint256" },
      { name: "weightKgPerUnit",      type: "uint256" },
    ]}],
  },
  { type: "function", name: "getVendorProducts",   stateMutability: "view", inputs: [{ name: "vendor",   type: "address" }],                       outputs: [{ name: "", type: "uint256[]" }] },
  { type: "function", name: "nextTokenId",          stateMutability: "view", inputs: [],                                                             outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "approvedVendors",      stateMutability: "view", inputs: [{ name: "", type: "address" }],                               outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "balanceOf",            stateMutability: "view", inputs: [{ name: "account", type: "address" }, { name: "id", type: "uint256" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "platformFeeBalance",   stateMutability: "view", inputs: [],                                                             outputs: [{ name: "", type: "uint256" }] },
  // Storage tracking getters (auto-generated from public mappings)
  { type: "function", name: "purchaseTimestamp", stateMutability: "view", inputs: [{ name: "", type: "uint256" }, { name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "bufferDeposit",     stateMutability: "view", inputs: [{ name: "", type: "uint256" }, { name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "purchasedQuantity", stateMutability: "view", inputs: [{ name: "", type: "uint256" }, { name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "calculateStorageFee", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }, { name: "holder", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  // Storage defaults
  { type: "function", name: "defaultFreeStorageDays",    stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "defaultStorageFeePerKgDay", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "defaultMaxStorageDays",     stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },

  // ─── Write ─────────────────────────────────────────────────────────────────
  { type: "function", name: "listProduct",     stateMutability: "nonpayable", inputs: [{ name: "metadataURI", type: "string" }, { name: "pricePerUnit", type: "uint256" }, { name: "supply", type: "uint256" }, { name: "category", type: "uint8" }, { name: "co2SavedKgPerUnit", type: "uint256" }], outputs: [{ name: "tokenId", type: "uint256" }] },
  { type: "function", name: "updateMetadata",  stateMutability: "nonpayable", inputs: [{ name: "tokenId", type: "uint256" }, { name: "newMetadataURI", type: "string" }], outputs: [] },
  { type: "function", name: "purchaseProduct", stateMutability: "payable",    inputs: [{ name: "tokenId", type: "uint256" }, { name: "quantity", type: "uint256" }], outputs: [] },
  { type: "function", name: "approveVendor",   stateMutability: "nonpayable", inputs: [{ name: "vendor",  type: "address" }], outputs: [] },
  { type: "function", name: "configureStorage",          stateMutability: "nonpayable", inputs: [{ name: "tokenId", type: "uint256" }, { name: "freeStorageDays", type: "uint256" }, { name: "storageFeePerKgDaily", type: "uint256" }, { name: "maxStorageDays", type: "uint256" }, { name: "weightKgPerUnit", type: "uint256" }], outputs: [] },
  { type: "function", name: "payStorageFee",             stateMutability: "nonpayable", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [] },
  { type: "function", name: "triggerForcedLiquidation",  stateMutability: "nonpayable", inputs: [{ name: "tokenId", type: "uint256" }, { name: "holder", type: "address" }], outputs: [] },
  { type: "function", name: "redeemTokens",              stateMutability: "nonpayable", inputs: [{ name: "tokenId", type: "uint256" }, { name: "quantity", type: "uint256" }], outputs: [] },
] as const;

export const CONTRACT_ADDRESSES = {
  mantleSepolia: "0x765021A74499a3b00B98675341F30c0451A18933" as `0x${string}`,
  mantle:        "0xF12c4E7296a0f0A6df8ef91712CC0bF6A189155c" as `0x${string}`,
} as const;

export const CATEGORY_LABELS = [
  "Clean Energy",
  "Waste & Recycling",
  "Sustainable Agri",
  "Upcycled Fashion",
  "Green Building",
  "Environmental Services",
] as const;

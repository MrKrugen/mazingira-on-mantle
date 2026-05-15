# Mazingira on Mantle

> **Africa's green economy, on-chain** — turning African green inventory into investable digital assets with AI-powered price discovery.

Built for the [Turing Test Hackathon 2026](https://turingtest.mantle.xyz) by Mantle Network.

**Tracks:** AI x RWA · Consumer & Viral DApps · Best UI/UX · Agentic Economy

---

## Live

| | |
|---|---|
| **App** | https://mazingira-on-mantle.vercel.app |
| **Contract (Mantle Sepolia)** | [`0x765021A74499a3b00B98675341F30c0451A18933`](https://sepolia.mantlescan.xyz/address/0x765021A74499a3b00B98675341F30c0451A18933) |
| **Contract (Mantle Mainnet)** | Coming before submission deadline |

---

## What it is

Mazingira on Mantle is a DApp where African green entrepreneurs — clean energy producers, sustainable farmers, recycling businesses — tokenize their real-world inventory as ERC-1155 assets on the Mantle blockchain. Global buyers and investors can discover, purchase, and invest in these tokenized assets using MNT. An AI agent (powered by Claude) provides live pricing intelligence and buyer-seller matching.

**One-line pitch:** Africa's green economy, on-chain — real vendors, real inventory, real impact.

### Features

- **Marketplace** — browse and buy tokenized green inventory across 6 categories
- **Secondary market** — resell purchased tokens with live premium/discount indicators
- **Vendor registration** — 3-step application flow with field-agent verification model
- **Storage fee system** — on-chain storage deadlines with forced liquidation mechanics
- **AI agent** — Claude-powered pricing intelligence, CO2 impact estimates, buyer matching
- **Vendor directory** — field-verified vendor profiles with role badges

### Origin story

This project evolved from **FuelFlow** (VibeJam 2026 Grand Champion), a biomass marketplace for African producers. MazingiraHub expanded that to all green entrepreneurs across Kenya and East Africa. Mazingira on Mantle brings that live marketplace on-chain — so those real vendors and real products become investable digital assets.

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Web3 | wagmi v2, viem, RainbowKit v2 |
| Blockchain | Mantle Network (EVM-compatible, chainId 5000 / 5003) |
| Smart contracts | Solidity 0.8.24, ERC-1155, OpenZeppelin v5 |
| Contract tooling | Hardhat v2.28.6 |
| AI agent | Anthropic Claude API (`@anthropic-ai/sdk`) |
| Hosting | Vercel |

---

## Smart contract: MazingiraRWA

`contracts/MazingiraRWA.sol` — ERC-1155 where each token ID represents one real-world product batch from a field-verified vendor.

| Function | Description |
|---|---|
| `listProduct(...)` | Vendor mints inventory tokens onto the chain |
| `purchaseProduct(tokenId, qty)` | Buyer pays MNT; tokens transfer to buyer |
| `approveVendor(address)` | Platform approves a vendor (owner only) |
| `configureStorage(...)` | Set free storage window, daily fee, max days per token |
| `payStorageFee(tokenId)` | Holder pays accrued storage fee |
| `triggerForcedLiquidation(...)` | Platform liquidates overdue holder |
| `redeemTokens(tokenId, qty)` | Buyer redeems tokens for physical delivery |
| `getProduct(tokenId)` | View full product details on-chain |

Platform fee: **2.5%** on sales (configurable up to 10%).

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/MrKrugen/mazingira-on-mantle.git
cd mazingira-on-mantle
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in the required values (see table below).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Yes | Free project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com) — needed for RainbowKit wallet connect |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key — powers the AI agent and CO2 suggest feature |
| `ANTHROPIC_BASE_URL` | No | Custom Anthropic base URL (leave blank to use the default `api.anthropic.com`) |
| `DEPLOYER_PRIVATE_KEY` | Hardhat only | Deployer wallet private key — only used by `deploy.ts` and `seed.ts`, never sent to the browser |
| `MANTLESCAN_API_KEY` | Hardhat only | For contract verification on MantleScan |

---

## Contract deployment

### Deploy to Mantle Sepolia (testnet)

```bash
# Requires DEPLOYER_PRIVATE_KEY in .env.local
npm run deploy:testnet
```

After deploying, update `CONTRACT_ADDRESSES.mantleSepolia` in `src/lib/contracts.ts` with the new address, then run the seed script to mint demo products:

```bash
npx hardhat run scripts/seed.ts --network mantleSepolia
```

### Deploy to Mantle Mainnet

```bash
npm run deploy:mainnet
```

Update `CONTRACT_ADDRESSES.mantle` in `src/lib/contracts.ts` with the mainnet address.

---

## Project structure

```
mazingira-on-mantle/
├── contracts/
│   └── MazingiraRWA.sol          # ERC-1155 RWA contract
├── scripts/
│   ├── deploy.ts                  # Hardhat deploy script
│   └── seed.ts                    # Mint 6 demo products + approve deployer as vendor
├── src/
│   ├── app/
│   │   ├── api/                   # Next.js route handlers (agent, vendors, secondary, storage-alerts, co2-suggest)
│   │   ├── marketplace/           # Marketplace + product detail pages
│   │   ├── secondary/             # Secondary market (buy/sell tokens)
│   │   ├── vendors/               # Vendor directory + registration flow
│   │   ├── list/                  # Vendor product listing form
│   │   └── agent/                 # AI agent chat interface
│   ├── components/                # Navbar, Footer, ProductCard, StorageStatus, VendorBadge, etc.
│   ├── hooks/
│   │   └── useContract.ts         # wagmi hooks for all contract reads/writes
│   └── lib/
│       ├── contracts.ts           # ABI + deployed addresses
│       └── wagmi.ts               # Chain config + RainbowKit setup
└── hardhat.config.ts
```

---

Built by **Krugen** (Peter Mwembe) · Nairobi, Kenya  
Powered by Mantle Network · Claude AI · Vercel

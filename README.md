# Mazingira on Mantle 🌿

> **Africa's green economy, on-chain** — turning African green inventory into investable digital assets with AI-powered price discovery.

Built for the [Turing Test Hackathon 2026](https://turingtest.mantle.xyz) by Mantle Network.

**Tracks:** AI x RWA · Consumer & Viral DApps · Best UI/UX · Agentic Economy

---

## What it is

Mazingira on Mantle is a DApp where African green entrepreneurs — clean energy producers, sustainable farmers, recycling businesses — tokenize their real-world inventory as ERC-1155 assets on the Mantle blockchain. Global buyers and investors can discover, purchase, and invest in these tokenized assets using MNT. An AI agent (powered by Claude) provides pricing intelligence and buyer-seller matching.

**One-line pitch:** Africa's green economy, on-chain — real vendors, real inventory, real impact.

## Origin story

This project evolved from **FuelFlow** (VibeJam 2026 Grand Champion), a biomass marketplace for African producers. MazingiraHub expanded that to all green entrepreneurs across Kenya and East Africa. Mazingira on Mantle brings that live marketplace on-chain — so those real vendors and real products become investable digital assets.

---

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Web3 | wagmi v2, viem, RainbowKit |
| Blockchain | Mantle Network (EVM-compatible) |
| Smart contracts | Solidity 0.8.24, ERC-1155, OpenZeppelin v5 |
| Contract tooling | Hardhat v3 |
| AI agent | Anthropic Claude API |
| Hosting | Cloudflare Pages |

---

## Getting started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.local.example .env.local
# Fill in: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, ANTHROPIC_API_KEY
```

### 3. Run the dev server
```bash
npm run dev
```

### 4. Compile contracts
```bash
npm run compile
```

### 5. Deploy to Mantle Sepolia testnet
```bash
# Add DEPLOYER_PRIVATE_KEY to .env.local first
npm run deploy:testnet
```

---

## Smart contract: MazingiraRWA

`contracts/MazingiraRWA.sol` — ERC-1155 where each token ID represents a real-world product batch from a verified vendor.

| Function | Description |
|----------|-------------|
| `listProduct(...)` | Vendor mints inventory tokens onto the chain |
| `purchaseProduct(tokenId, qty)` | Buyer pays MNT, tokens transfer to buyer |
| `approveVendor(address)` | Platform approves a vendor (owner only) |
| `getProduct(tokenId)` | View full product details on-chain |

Platform fee: **2.5%** (configurable up to 10%).

---

## Project structure

```
mazingira-on-mantle/
├── contracts/            # MazingiraRWA.sol (ERC-1155 RWA)
├── scripts/              # Hardhat deploy scripts
├── src/
│   ├── app/              # Next.js App Router pages + providers
│   ├── components/       # Navbar, Hero, Marketplace, AI Agent UI
│   └── lib/              # wagmi config, contract ABI + addresses
└── hardhat.config.ts
```

---

Built by **Krugen** (Peter Mwembe) · Nairobi, Kenya  
Powered by Mantle Network · Claude AI · Cloudflare

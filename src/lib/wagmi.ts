import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";
import { defineChain } from "viem";

export const mantleSepolia = defineChain({
  id: 5003,
  name: "Mantle Sepolia",
  nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia.mantle.xyz"] },
  },
  blockExplorers: {
    default: { name: "MantleScan", url: "https://sepolia.mantlescan.xyz" },
  },
  testnet: true,
});

export const mantle = defineChain({
  id: 5000,
  name: "Mantle",
  nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.mantle.xyz"] },
  },
  blockExplorers: {
    default: { name: "MantleScan", url: "https://mantlescan.xyz" },
  },
});

export const wagmiConfig = createConfig(
  getDefaultConfig({
    chains: [mantle, mantleSepolia],
    transports: {
      [mantle.id]: http("https://rpc.mantle.xyz"),
      [mantleSepolia.id]: http("https://rpc.sepolia.mantle.xyz"),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    appName: "Mazingira on Mantle",
    appDescription: "Africa's green economy, on-chain — turning green inventory into investable digital assets with AI-powered price discovery.",
    appUrl: "https://mazingira-on-mantle.petermwembe.workers.dev",
    appIcon: "/logo.png",
  })
);

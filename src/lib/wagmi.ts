import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
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

export const wagmiConfig = getDefaultConfig({
  appName: "Mazingira on Mantle",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [mantle, mantleSepolia],
  transports: {
    [mantle.id]: http("https://rpc.mantle.xyz"),
    [mantleSepolia.id]: http("https://rpc.sepolia.mantle.xyz"),
  },
  ssr: true,
});

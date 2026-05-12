import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mazingira on Mantle — Africa's Green Economy, On-Chain",
  description: "Turning African green inventory into investable digital assets with AI-powered price discovery.",
  openGraph: {
    title: "Mazingira on Mantle",
    description: "Africa's green economy, on-chain.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

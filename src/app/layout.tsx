import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Mazingira on Mantle — Africa's Green Economy, On-Chain",
  description: "Turning African green inventory into investable digital assets with AI-powered price discovery.",
  metadataBase: new URL("https://mazingira-on-mantle.vercel.app"),
  openGraph: {
    title: "Mazingira on Mantle",
    description: "Africa's green economy, on-chain.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

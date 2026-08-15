import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QuickDine — Pesan Meja & Pre-Order F&B",
  description: "Platform reservasi meja live dan pre-order kuliner tanpa antre.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased font-sans`}>
      <body className="min-h-full flex flex-col bg-[#faf8ff] text-[#131b2e]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

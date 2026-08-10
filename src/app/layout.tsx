import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "HpLabs — Cybersecurity Training Labs by HackerPlus",
  description: "Master cybersecurity through real IP-based labs covering every major vulnerability from 1970 to 2026. Use your own Parrot/Kali Linux. No browser VMs. Just real hacking.",
  keywords: ["cybersecurity labs", "penetration testing", "ethical hacking", "web pentesting", "red team", "HackerPlus", "hplabs"],
  authors: [{ name: "HackerPlus", url: "https://hackerplus.in" }],
  openGraph: {
    title: "HpLabs — Real IP Cybersecurity Labs",
    description: "Hack real IPs. Master every vulnerability from 1970–2026. Powered by HackerPlus.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#06030c] text-gray-100`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

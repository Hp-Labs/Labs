import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AIChatWidget } from "@/components/AIChatWidget";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "HpLabs — Cybersecurity Training Labs by HackerPlus",
  description: "Master cybersecurity through real IP-based labs covering early computer bugs to modern CVEs. Use your own Parrot/Kali Linux. No browser VMs. Just real hacking.",
  keywords: ["cybersecurity labs", "penetration testing", "ethical hacking", "web pentesting", "red team", "HackerPlus", "hplabs"],
  authors: [{ name: "HackerPlus", url: "https://hackerplus.in" }],
  icons: {
    icon: "/hplabs-logo.png",
    shortcut: "/hplabs-logo.png",
    apple: "/hplabs-logo.png",
  },
  openGraph: {
    title: "HpLabs — Real IP Cybersecurity Labs",
    description: "Hack real IPs. From early computer bugs to modern CVEs. Powered by HackerPlus.",
    type: "website",
    images: ["/hplabs-logo.png"],
  },
  other: {
    "color-scheme": "dark",
    "darkreader-lock": "true",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/hplabs-logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/hplabs-logo.png" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[var(--hp-bg)] text-gray-100`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <AIChatWidget />
        </Providers>
      </body>
    </html>
  );
}

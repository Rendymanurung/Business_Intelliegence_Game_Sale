import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intelijen Penjualan Video Game KRISTAL (1980-2016)",
  description: "Dashboard Business Intelligence retro pixel yang menganalisis 16.322 judul video game lintas platform, genre, dan wilayah global.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${pressStart.variable} ${vt323.variable} h-full antialiased bg-[#0c0c1d]`}
      style={{ backgroundColor: '#0c0c1d' }}
    >
      <body
        className="min-h-full flex flex-col bg-[#0c0c1d] text-foreground retro-bg"
        style={{ backgroundColor: '#0c0c1d' }}
      >
        {children}
      </body>
    </html>
  );
}

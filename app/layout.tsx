import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import { connection } from "next/server";
import { formatLongDate } from "@/lib/date";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "AI Night · Carteirinha Oficial — VanguardIA × DO IT Hub",
    description: `Confirme sua presença no AI Night e gere sua carteirinha oficial · ${formatLongDate(new Date())} · 18h · DO IT Hub Belém`,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Força renderização dinâmica em toda a árvore (nada de shell estático
  // "congelado" no build) para que datas fiquem sempre atuais.
  await connection();

  return (
    <html lang="pt-BR" className={`${poppins.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}

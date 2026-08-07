import type { Metadata } from "next";
import { Antonio, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/getLocale";

// Polices auto-hébergées par Next (aucune requête vers Google au runtime).
const antonio = Antonio({
  variable: "--font-antonio",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reeby Auto · Courtage automobile d'exception",
  description:
    "Courtage automobile pour particuliers à Montréal. Véhicules d'exception inspectés, jamais accidentés. Nous vendons aussi votre auto pour 1 % de commission.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body
        className={`${antonio.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
      >
        <Header locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}

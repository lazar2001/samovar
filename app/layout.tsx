import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
// Fontovi se hostuju lokalno (bez zahteva ka Google-u, uključujući latin-ext za č, ć, š, ž, đ).
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-manrope",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samovar.rs";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SamoVar — kućice i boksevi za pse od sendvič panela | Čelarevo",
  description:
    "Kućice i boksevi za pse od sendvič panela, po meri vašeg psa. Izaberite mere, boju panela i dodatke u konfiguratoru i pošaljite upit za ponudu. Dostava na adresu.",
  keywords: ["kućica za psa", "boks za psa", "sendvič panel", "kućica za psa po meri", "Čelarevo", "Novi Sad"],
  openGraph: {
    title: "SamoVar — topla kućica po meri vašeg psa",
    description: "Kućice i boksevi za pse od sendvič panela. Složite svoju u konfiguratoru i pošaljite upit.",
    images: ["/img/hero.jpg"],
    locale: "sr_RS",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef0ef" },
    { media: "(prefers-color-scheme: dark)", color: "#1c2025" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={manrope.variable}>
      <body className={manrope.className}>
        {children}
      </body>
    </html>
  );
}

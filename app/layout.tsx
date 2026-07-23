import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maison Aurelle | Luxury Fashion & Accessories",
    template: "%s | Maison Aurelle",
  },
  description:
    "Discover authentic luxury bags, shoes, and fashion accessories at Maison Aurelle. Curated collections from the world's most coveted designers. Free shipping on orders over $500.",
  keywords: [
    "luxury fashion",
    "designer bags",
    "luxury shoes",
    "high-end accessories",
    "Hermès",
    "Chanel",
    "Louis Vuitton",
    "Gucci",
    "Prada",
  ],
  authors: [{ name: "Maison Aurelle" }],
  creator: "Maison Aurelle",
  publisher: "Maison Aurelle",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://maisonaurelle.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maisonaurelle.com",
    siteName: "Maison Aurelle",
    title: "Maison Aurelle | Luxury Fashion & Accessories",
    description:
      "Discover authentic luxury bags, shoes, and fashion accessories at Maison Aurelle.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maison Aurelle - Luxury Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison Aurelle | Luxury Fashion & Accessories",
    description:
      "Discover authentic luxury bags, shoes, and fashion accessories at Maison Aurelle.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body className="min-h-screen bg-ivory antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

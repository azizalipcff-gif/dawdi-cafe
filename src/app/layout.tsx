import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} — Coffee for the Road`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  keywords: ["coffee", "cafe", "morocco", "crêpes", "dawdi", "coffee shop", "maroc"],
  openGraph: {
    title: `${SITE_NAME} — Coffee for the Road`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/logo/logo.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Coffee for the Road`,
    description: SITE_DESCRIPTION,
    images: ["/logo/logo.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/logo/logo.png", apple: "/logo/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CafeOrCoffeeShop",
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              telephone: "+212656480972",
              address: { "@type": "PostalAddress", addressCountry: "MA" },
              servesCuisine: ["Coffee", "Crêpes", "Snacks"],
              image: `${SITE_URL}/logo/logo.png`,
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <Providers>
          <LoadingScreen />
          <ScrollProgress />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}

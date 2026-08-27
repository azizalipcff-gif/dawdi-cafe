import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SiteChrome } from "@/components/SiteChrome";
import { getSettings } from "@/lib/data";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { getDir } from "@/lib/i18n/config";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, locale] = await Promise.all([getSettings(), getLocale()]);
  const dict = getDictionary(locale);

  const siteName = settings.cafe?.name ?? SITE_NAME;
  const description = settings.seo?.description ?? SITE_DESCRIPTION;
  const phone = settings.contact?.phone ?? "+212656480972";

  // Admin-controlled values (cafe name/description/phone) are rendered into a
  // <script> tag, so escape `<` to prevent a `</script>` break-out (XSS).
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: siteName,
    description,
    url: SITE_URL,
    telephone: phone,
    address: { "@type": "PostalAddress", addressCountry: "MA" },
    servesCuisine: ["Coffee", "Crêpes", "Snacks"],
    image: `${SITE_URL}/logo/logo.png`,
  }).replace(/</g, "\\u003c");

  return (
    <html lang={locale} dir={getDir(locale)} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
        <Providers>
          <LocaleProvider locale={locale} dict={dict}>
            <SiteChrome settings={settings}>{children}</SiteChrome>
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}

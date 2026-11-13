import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SiteChrome } from "@/components/SiteChrome";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { getLocale } from "@/lib/i18n/server";
import { getDir } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: { template: `%s | ${SITE_NAME}`, default: `${SITE_NAME} — Your Digital Partner` },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  keywords: ["social media", "followers", "likes", "gaming top up", "Free Fire", "digital services", "Morocco"],
  openGraph: { title: `${SITE_NAME} — Your Digital Partner`, description: SITE_DESCRIPTION, url: SITE_URL, siteName: SITE_NAME, locale: "en_US", type: "website" },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
  icons: { icon: "/logo/logo.png", apple: "/logo/logo.png" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    areaServed: { "@type": "Country", name: "Morocco" },
  }).replace(/</g, "\\u003c");
  return <html lang={locale} dir={getDir(locale)} suppressHydrationWarning><body className="min-h-screen flex flex-col bg-[#0B1424] text-white antialiased">
    <Script id="organization-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{__html:jsonLd}}/>
    <Providers><SiteChrome>{children}</SiteChrome></Providers>
  </body></html>;
}

"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { BackToTop } from "./BackToTop";
import { ScrollProgress } from "./ScrollProgress";
import { LoadingScreen } from "./LoadingScreen";
import { ADMIN_PATH } from "@/lib/constants";
import type { SiteSettings } from "@/lib/types";

// Renders the full public site chrome around the page content:
//   Navbar → <main>{children}</main> → Footer
export function SiteChrome({
  settings,
  children,
}: {
  settings?: Partial<SiteSettings>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Admin pages are rendered standalone without the public site chrome.
  if (pathname?.startsWith(ADMIN_PATH)) return <>{children}</>;

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <BackToTop />
      <WhatsAppButton settings={settings} />
    </>
  );
}

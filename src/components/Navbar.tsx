"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_NAME, NAV_ITEMS, PHONE } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";


export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/80 dark:bg-dark/80 glass shadow-lg shadow-black/5"
          : "bg-transparent"
      )}
    >
      <div className="container-custom flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0">
            <Image
              src="/logo/logo.png"
              alt={SITE_NAME}
              fill
              className="object-contain"
              sizes="48px"
            />
          </div>
          <div className="flex-col hidden sm:flex">
            <span className="font-display text-lg md:text-xl font-extrabold text-foreground tracking-tight leading-none">
              {SITE_NAME}
            </span>
            <span className="font-mono text-[9px] md:text-[10px] text-brand tracking-[0.2em] uppercase leading-tight">
              Coffee for the Road
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                isActive(item.href)
                  ? "text-brand bg-brand/5"
                  : "text-foreground/70 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800/50"
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute bottom-0 inset-x-4 h-0.5 bg-brand rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="hidden md:flex items-center gap-2 h-10 px-4 rounded-full bg-brand text-white text-sm font-medium hover:bg-brand-dark transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>{PHONE}</span>
          </a>
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-foreground/70 hover:text-foreground rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-background border-l border-border z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 shrink-0">
                    <Image src="/logo/logo.png" alt={SITE_NAME} fill className="object-contain" sizes="40px" />
                  </div>
                  <span className="font-display text-lg font-bold text-foreground">{SITE_NAME}</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-foreground/70 hover:text-foreground rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 flex flex-col gap-1">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-4 py-3 rounded-xl font-medium transition-all",
                        isActive(item.href)
                          ? "bg-brand/10 text-brand"
                          : "text-foreground/70 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="p-6 border-t border-border">
                <a
                  href={`tel:${PHONE.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-brand text-white font-medium hover:bg-brand-dark transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {PHONE}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { locales, localeNames, localizePath } from "@/lib/i18n/config";

export function LanguageSwitcher() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 h-10 rounded-full text-foreground/70 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wide">{locale}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-12 mt-1 w-40 rounded-2xl bg-background border border-border shadow-xl shadow-black/10 overflow-hidden z-50">
          {locales.map((l) => (
            <Link
              key={l}
              href={localizePath(pathname, l)}
              onClick={() => setOpen(false)}
              className={cnList(
                "block px-4 py-2.5 text-sm transition-colors",
                l === locale
                  ? "text-brand bg-brand/5 font-semibold"
                  : "text-foreground/70 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              {localeNames[l]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function cnList(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, MapPin, Instagram, Coffee } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SITE_NAME, GOOGLE_MAPS_URL, INSTAGRAM_URL, DEFAULT_SETTINGS } from "@/lib/constants";
import type { SiteSettings, HeroSlide } from "@/lib/types";
import { useI18n } from "@/lib/i18n/LocaleProvider";

interface HeroProps {
  settings?: Partial<SiteSettings>;
  slides?: HeroSlide[];
}

export function Hero({ settings, slides }: HeroProps) {
  const { dict, link } = useI18n();
  const cafe = { ...DEFAULT_SETTINGS.cafe, ...settings?.cafe };
  const contact = { ...DEFAULT_SETTINGS.contact, ...settings?.contact };
  const siteName = cafe.name || SITE_NAME;
  const logo = cafe.logo_url || "/logo/logo.png";

  const [index, setIndex] = useState(0);
  const hasSlides = (slides ?? []).length > 0;

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % (slides?.length ?? 1));
  }, [slides]);

  useEffect(() => {
    if (!hasSlides) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [hasSlides, next]);

  if (hasSlides) {
    const active = slides![index];
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image src={active.image_url} alt={active.title} fill className="object-cover" priority sizes="100vw" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-dark/60" style={{ opacity: active.overlay_opacity / 100 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/40" />

        <div className="container-custom relative z-10 text-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none mb-5"
              >
                {active.title}
              </motion.h1>
              {active.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="text-lg sm:text-xl text-gray-200 font-light tracking-wide mb-10 max-w-2xl mx-auto"
                >
                  {active.subtitle}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                {active.button_label && active.button_url && (
                  <Link href={active.button_url}>
                    <Button size="lg" className="text-base gap-2">
                      <Coffee className="w-4 h-4" />
                      {active.button_label}
                    </Button>
                  </Link>
                )}
                <Link href={link("/menu")}>
                  <Button variant="outline" size="lg" className="text-base border-white/20 text-white hover:bg-white hover:text-dark gap-2">
                    {dict.hero.viewMenu}
                  </Button>
                </Link>
                <a href={contact.instagram || INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="lg" className="text-base text-gray-300 hover:text-white gap-2">
                    <Instagram className="w-4 h-4" />
                    {dict.hero.instagram}
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {slides!.length > 1 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides!.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-brand" : "w-3 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/40"
          >
            <span className="text-xs tracking-widest uppercase">{dict.hero.scroll}</span>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark to-brand/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4">
            <Image
              src={logo}
              alt={siteName}
              fill
              className="object-contain drop-shadow-2xl"
              priority
              sizes="144px"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white tracking-tight leading-none mb-6"
        >
          {siteName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light tracking-wide mb-10 max-w-2xl mx-auto"
        >
          {cafe.tagline || dict.hero.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href={link("/menu")}>
            <Button size="lg" className="text-base gap-2">
              <Coffee className="w-4 h-4" />
              {dict.hero.viewMenu}
            </Button>
          </Link>
          <a href={contact.maps_url || GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" className="text-base border-white/20 text-white hover:bg-white hover:text-dark gap-2">
              <MapPin className="w-4 h-4" />
              {dict.hero.findUs}
            </Button>
          </a>
          <a href={contact.instagram || INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="lg" className="text-base text-gray-300 hover:text-white gap-2">
              <Instagram className="w-4 h-4" />
              {dict.hero.instagram}
            </Button>
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-xs tracking-widest uppercase">{dict.hero.scroll}</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

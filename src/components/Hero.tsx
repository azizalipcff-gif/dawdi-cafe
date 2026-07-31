"use client";

import { motion } from "framer-motion";
import { ArrowDown, MapPin, Instagram, Coffee } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SITE_NAME, GOOGLE_MAPS_URL, INSTAGRAM_URL } from "@/lib/constants";

export function Hero() {
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
          <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto mb-4">
            <Image
              src="/logo/logo.png"
              alt={SITE_NAME}
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
          {SITE_NAME}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light tracking-wide mb-10 max-w-2xl mx-auto"
        >
          Fresh Coffee <span className="text-brand mx-2">•</span> Crêpes <span className="text-brand mx-2">•</span> Snacks <span className="text-brand mx-2">•</span> Quality
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/menu">
            <Button size="lg" className="text-base gap-2">
              <Coffee className="w-4 h-4" />
              View Menu
            </Button>
          </Link>
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" className="text-base border-white/20 text-white hover:bg-white hover:text-dark gap-2">
              <MapPin className="w-4 h-4" />
              Find Us
            </Button>
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="lg" className="text-base text-gray-300 hover:text-white gap-2">
              <Instagram className="w-4 h-4" />
              Instagram
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
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

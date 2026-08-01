"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { GOOGLE_MAPS_URL, DEFAULT_SETTINGS } from "@/lib/constants";
import type { SiteSettings } from "@/lib/types";
import { useI18n } from "@/lib/i18n/LocaleProvider";

interface GoogleMapProps {
  settings?: Partial<SiteSettings>;
}

export function GoogleMap({ settings }: GoogleMapProps) {
  const { dict } = useI18n();
  const contact = { ...DEFAULT_SETTINGS.contact, ...settings?.contact };
  const mapsUrl = contact.maps_url || GOOGLE_MAPS_URL;
  const cafeName = settings?.cafe?.name ?? "DAWDI CAFE";

  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(cafeName + " " + (contact.address || "Morocco"))}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-brand text-sm font-semibold tracking-widest uppercase">{dict.map.eyebrow}</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            {dict.map.title}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden shadow-xl shadow-brand/5 border border-border"
        >
          <iframe
            src={embedSrc}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${cafeName} Location`}
            className="w-full"
          />
          <div className="absolute bottom-4 left-4 right-4 flex justify-center">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-dark text-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
            >
              <MapPin className="w-4 h-4 text-brand" />
              {dict.map.openInGoogleMaps}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

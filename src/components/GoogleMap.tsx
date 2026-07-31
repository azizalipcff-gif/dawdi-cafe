"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { GOOGLE_MAPS_URL } from "@/lib/constants";

export function GoogleMap() {
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
          <span className="text-brand text-sm font-semibold tracking-widest uppercase">Location</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Find Us Here
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13230.123456789!2d-7.981!3d31.608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDM2JzI4LjgiTiA3wrA1OCc1MS42Ilc!5e0!3m2!1sfr!2sma!4v1"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="DAWDI CAFE Location"
            className="w-full"
          />
          <div className="absolute bottom-4 left-4 right-4 flex justify-center">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-dark text-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
            >
              <MapPin className="w-4 h-4 text-brand" />
              Open in Google Maps
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Coffee, CupSoda, ChefHat, Zap, Sofa, Wifi } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useI18n } from "@/lib/i18n/LocaleProvider";

const ICONS = [Coffee, CupSoda, ChefHat, Zap, Sofa, Wifi];

export function Features() {
  const { dict } = useI18n();
  const features = dict.features.items;

  return (
    <section className="relative py-24 md:py-32 bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand text-sm font-semibold tracking-widest uppercase">{dict.features.eyebrow}</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            {dict.features.title}
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            {dict.features.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => {
            const Icon = ICONS[i] ?? Coffee;
            return (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-brand/20 transition-all duration-500 hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

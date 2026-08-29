"use client";

import { motion } from "framer-motion";
import { Coffee, Heart, Users, Star } from "lucide-react";
import { fadeInUp, slideInLeft, slideInRight, staggerContainer } from "@/lib/animations";
import { AnimatedCounter } from "./AnimatedCounter";
import type { SiteSettings, BusinessStatistic } from "@/lib/types";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { fmt } from "@/lib/i18n/config";

const statIcons = [<Users key="u" className="w-5 h-5" />, <Coffee key="c" className="w-5 h-5" />, <Star key="s" className="w-5 h-5" />, <Heart key="h" className="w-5 h-5" />];

interface AboutSectionProps {
  settings?: Partial<SiteSettings>;
  stats?: BusinessStatistic[];
}

export function AboutSection({ settings, stats: statsProp }: AboutSectionProps) {
  const { dict } = useI18n();
  const cafeName = settings?.cafe?.name ?? "DAWDI CAFE";
  const description = settings?.cafe?.description ?? dict.aboutSection.p1;
  const tagline = settings?.cafe?.tagline ?? "Coffee for the Road";
  const rawStats = statsProp && statsProp.length > 0
    ? statsProp
    : [
        { id: "", key: "daily_customers", label: dict.stats.happyCustomers, value: "200+", description: null, use_real_count: false, sort_order: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: "", key: "products", label: dict.stats.products, value: "50+", description: null, use_real_count: false, sort_order: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: "", key: "years_experience", label: dict.stats.yearsServing, value: "4+", description: null, use_real_count: false, sort_order: 2, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: "", key: "quality_care", label: dict.stats.loveCare, value: "100%", description: null, use_real_count: false, sort_order: 3, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ];

  const stats = rawStats.map((s) => {
    const raw = s.value ?? "";
    const match = raw.match(/^\s*(\d+[\d,]*)\s*([+%]*)/);
    const num = match ? Number(match[1].replace(/,/g, "")) : 0;
    const suffix = match ? match[2] ?? "" : "";
    return { label: s.label, num, suffix };
  });
  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={slideInLeft} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
            <span className="text-brand text-sm font-semibold tracking-widest uppercase">{dict.aboutSection.eyebrow}</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              {dict.aboutSection.title}
            </h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                {fmt(dict.aboutSection.p1, { name: cafeName })}
              </p>
              <p>
                {description}
              </p>
              <p>
                {dict.aboutSection.p3}
              </p>
            </div>
          </motion.div>

          <motion.div variants={slideInRight} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-brand/20 to-dark rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-brand/20 flex items-center justify-center mb-4">
                    <Coffee className="w-10 h-10 text-brand" />
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">&ldquo;{tagline}&rdquo;</p>
                  <p className="text-muted text-sm mt-2">{dict.aboutSection.since}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="text-center p-6 rounded-2xl bg-card border border-border"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-3">
                {statIcons[i]}
              </div>
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground">
                <AnimatedCounter to={stat.num} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

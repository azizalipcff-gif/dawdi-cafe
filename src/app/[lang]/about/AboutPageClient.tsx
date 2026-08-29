"use client";

import { motion } from "framer-motion";
import { Coffee, Heart, Users, Star, Award, Leaf } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { fadeInUp, slideInLeft, slideInRight, staggerContainer } from "@/lib/animations";
import type { SiteSettings, BusinessStatistic } from "@/lib/types";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { fmt } from "@/lib/i18n/config";

const valueIcons = [
  <Coffee key="1" className="w-6 h-6" />,
  <Heart key="2" className="w-6 h-6" />,
  <Users key="3" className="w-6 h-6" />,
  <Award key="4" className="w-6 h-6" />,
  <Leaf key="5" className="w-6 h-6" />,
  <Star key="6" className="w-6 h-6" />,
];

interface AboutPageClientProps {
  settings?: Partial<SiteSettings>;
  stats?: BusinessStatistic[];
}

export function AboutPageClient({ settings, stats: statsProp }: AboutPageClientProps) {
  const { dict } = useI18n();
  const cafeName = settings?.cafe?.name ?? "DAWDI CAFE";
  const tagline = settings?.cafe?.tagline ?? "Coffee for the Road";
  const values = dict.values.map((v, i) => ({ ...v, description: v.desc, icon: valueIcons[i] }));
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
    <div className="pt-24">
      <section className="relative py-20 bg-gradient-to-b from-brand/5 to-background">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              {dict.aboutPage.title}
            </h1>
            <p className="text-muted mt-4 max-w-2xl mx-auto">
              {dict.aboutPage.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <motion.div variants={slideInLeft} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
              <span className="text-brand text-sm font-semibold tracking-widest uppercase">{dict.aboutPage.whoWeAre}</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                {tagline}
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>{fmt(dict.aboutPage.p1, { name: cafeName })}</p>
                <p>{dict.aboutPage.p2}</p>
                <p>{dict.aboutPage.p3}</p>
                <p>{fmt(dict.aboutPage.p4, { name: cafeName })}</p>
              </div>
            </motion.div>

            <motion.div variants={slideInRight} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
              <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand/20 via-dark to-brand/10 flex items-center justify-center border border-border overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-brand/20 flex items-center justify-center mb-4">
                    <Coffee className="w-10 h-10 text-brand" />
                  </div>
                  <p className="font-display text-3xl font-bold text-foreground">&ldquo;{tagline}&rdquo;</p>
                  <p className="text-muted mt-2">{dict.aboutPage.since}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-dark/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-brand text-sm font-semibold tracking-widest uppercase">{dict.aboutPage.valuesEyebrow}</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
              {dict.aboutPage.valuesTitle}
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                className="p-6 rounded-2xl bg-card border border-border hover:border-brand/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="text-center p-8 rounded-2xl bg-card border border-border"
              >
                    <div className="font-display text-4xl md:text-5xl font-bold text-brand">
                      <span className="stat-static tabular-nums">{stat.num.toLocaleString()}{stat.suffix}</span>
                      <AnimatedCounter to={stat.num} suffix={stat.suffix} />
                    </div>
                <p className="text-sm text-muted mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

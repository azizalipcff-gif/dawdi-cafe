import type { BusinessStatistic } from "@/lib/types";
import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";

interface Props {
  stats?: BusinessStatistic[];
}

export default function StatsServer({ stats = [] }: Props) {
  const rawStats = stats && stats.length > 0
    ? stats
    : [
        { id: "", key: "daily_customers", label: "Daily Customers", value: "200+", description: null, use_real_count: false, sort_order: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: "", key: "products", label: "Products", value: "50+", description: null, use_real_count: false, sort_order: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: "", key: "years_experience", label: "Years of Experience", value: "4+", description: null, use_real_count: false, sort_order: 2, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: "", key: "quality_care", label: "Quality & Care", value: "100%", description: null, use_real_count: false, sort_order: 3, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ];

  const parsed = rawStats.map((s) => {
    const raw = s.value ?? "";
    const match = raw.match(/^\s*(\d+[\d,]*)\s*([+%]*)/);
    const num = match ? Number(match[1].replace(/,/g, "")) : 0;
    const suffix = match ? match[2] ?? "" : "";
    return { label: s.label, num, suffix };
  });

  return (
    <section className="py-20 bg-background">
      <div className="container-custom">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {parsed.map((stat) => (
            <div key={stat.label} className="text-center p-8 rounded-2xl bg-card border border-border">
              <div className="font-display text-4xl md:text-5xl font-bold text-brand tabular-nums">
                {stat.num.toLocaleString()}{stat.suffix}
              </div>
              <p className="text-sm text-muted mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

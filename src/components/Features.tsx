"use client";

import { motion } from "framer-motion";
import { Coffee, CupSoda, ChefHat, Zap, ShoppingBag, Sofa, Wifi } from "lucide-react";
import { FEATURES } from "@/lib/constants";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const iconMap: Record<string, React.ReactNode> = {
  Coffee: <Coffee className="w-6 h-6" />,
  CupSoda: <CupSoda className="w-6 h-6" />,
  ChefHat: <ChefHat className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6" />,
  Sofa: <Sofa className="w-6 h-6" />,
  Wifi: <Wifi className="w-6 h-6" />,
};

export function Features() {
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
          <span className="text-brand text-sm font-semibold tracking-widest uppercase">Why Choose Us</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            The DAWDI Experience
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            Every detail crafted for your perfect coffee moment
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-brand/20 transition-all duration-500 hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                {iconMap[feature.icon]}
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

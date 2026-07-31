"use client";

import { motion } from "framer-motion";
import { Coffee, Heart, Users, Star } from "lucide-react";
import { fadeInUp, slideInLeft, slideInRight, staggerContainer } from "@/lib/animations";
import { AnimatedCounter } from "./AnimatedCounter";

const stats = [
  { label: "Happy Customers", value: 5000, suffix: "+", icon: <Users className="w-5 h-5" /> },
  { label: "Products", value: 50, suffix: "+", icon: <Coffee className="w-5 h-5" /> },
  { label: "Years Serving", value: 5, suffix: "+", icon: <Star className="w-5 h-5" /> },
  { label: "Love & Care", value: 100, suffix: "%", icon: <Heart className="w-5 h-5" /> },
];

export function AboutSection() {
  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={slideInLeft} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
            <span className="text-brand text-sm font-semibold tracking-widest uppercase">About Us</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              More Than Just Great Coffee
            </h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                Welcome to <span className="text-foreground font-semibold">DAWDI CAFE</span> — where every cup tells a story of passion, quality, and dedication. Nestled in the heart of Morocco, we bring you premium coffee, handcrafted crêpes, and a welcoming atmosphere that feels like home.
              </p>
              <p>
                Our team is committed to using the finest ingredients, from expertly sourced coffee beans to the freshest local produce. Whether you&apos;re stopping by for a quick espresso, a leisurely brunch, or a sweet treat, every moment at DAWDI CAFE is designed to delight.
              </p>
              <p>
                We believe that great coffee brings people together. That&apos;s why we&apos;ve created a space where friends meet, ideas flow, and memories are made — all accompanied by the perfect brew.
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
                  <p className="font-display text-2xl font-bold text-foreground">&ldquo;Coffee for the Road&rdquo;</p>
                  <p className="text-muted text-sm mt-2">Since 2019</p>
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
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="text-center p-6 rounded-2xl bg-card border border-border"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-3">
                {stat.icon}
              </div>
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground">
                <AnimatedCounter to={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

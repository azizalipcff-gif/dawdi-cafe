"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MENU_CATEGORIES } from "@/lib/constants";


export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0].name);
  const category = MENU_CATEGORIES.find((c) => c.name === activeCategory);

  return (
    <section className="relative py-24 md:py-32 bg-gray-50 dark:bg-dark/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-brand text-sm font-semibold tracking-widest uppercase">Our Menu</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Crafted with Passion
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            From classic espresso to indulgent crêpes
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {MENU_CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.name
                  ? "bg-brand text-white shadow-lg shadow-brand/25"
                  : "bg-card text-foreground/70 hover:text-foreground border border-border hover:border-brand/30"
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category?.items.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-5 rounded-xl bg-card border border-border hover:border-brand/20 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-display text-base font-semibold text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted mt-1 leading-relaxed">{item.description}</p>
                    </div>
                    <span className="text-brand font-semibold text-sm whitespace-nowrap font-mono">{item.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/menu">
            <Button variant="outline" size="lg" className="gap-2">
              View Full Menu
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

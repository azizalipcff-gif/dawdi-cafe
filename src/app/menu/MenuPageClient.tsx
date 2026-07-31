"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Search } from "lucide-react";
import { MENU_CATEGORIES } from "@/lib/constants";

import { Input } from "@/components/ui/input";

export function MenuPageClient() {
  const [search, setSearch] = useState("");

  const filteredCategories = MENU_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="pt-24 pb-20">
      <section className="relative py-20 bg-gradient-to-b from-brand/5 to-background">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-brand/10 flex items-center justify-center mb-4">
              <Coffee className="w-8 h-8 text-brand" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Our Menu
            </h1>
            <p className="text-muted mt-4 max-w-xl mx-auto">
              Discover our handcrafted selection of premium beverages and delicious treats
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto mt-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                placeholder="Search menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-custom mt-16 space-y-20">
        <AnimatePresence mode="wait">
          {filteredCategories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted text-lg">No items found. Try a different search.</p>
            </motion.div>
          ) : (
            filteredCategories.map((category) => (
              <motion.section
                key={category.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-10">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{category.name}</h2>
                  <div className="w-12 h-0.5 bg-brand mx-auto mt-3 rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                  {category.items.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="group p-5 rounded-xl bg-card border border-border hover:border-brand/20 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5 hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-display text-base font-semibold text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted mt-1 leading-relaxed">{item.description}</p>
                        </div>
                        <span className="text-brand font-semibold text-sm whitespace-nowrap font-mono">{item.price}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

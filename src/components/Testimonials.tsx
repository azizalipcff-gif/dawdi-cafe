"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useI18n } from "@/lib/i18n/LocaleProvider";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const { dict } = useI18n();
  const active = testimonials.filter((t) => t.is_active);

  return (
    <section className="relative py-24 md:py-32 bg-gray-50 dark:bg-dark/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand text-sm font-semibold tracking-widest uppercase">{dict.testimonials.eyebrow}</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            {dict.testimonials.title}
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            {dict.testimonials.subtitle}
          </p>
        </motion.div>

        {active.length === 0 ? (
          <p className="text-center text-muted">{dict.testimonials.empty}</p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {active.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={fadeInUp}
                className="p-6 rounded-2xl bg-card border border-border hover:border-brand/20 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground block">{testimonial.name}</span>
                    {testimonial.role && <span className="text-xs text-muted">{testimonial.role}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

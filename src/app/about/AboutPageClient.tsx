"use client";

import { motion } from "framer-motion";
import { Coffee, Heart, Users, Star, Award, Leaf } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { fadeInUp, slideInLeft, slideInRight, staggerContainer } from "@/lib/animations";

const values = [
  {
    icon: <Coffee className="w-6 h-6" />,
    title: "Premium Quality",
    description: "We source the finest coffee beans and ingredients to deliver an exceptional experience.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Made with Love",
    description: "Every drink and dish is crafted with care and passion by our dedicated team.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community First",
    description: "We create a welcoming space where everyone feels at home.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Excellence",
    description: "We never compromise on quality, service, or customer satisfaction.",
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "Sustainability",
    description: "We are committed to eco-friendly practices and supporting local producers.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Innovation",
    description: "We constantly evolve our menu to bring you exciting new flavors.",
  },
];

const stats = [
  { label: "Happy Customers", value: 5000, suffix: "+" },
  { label: "Products", value: 50, suffix: "+" },
  { label: "Years Serving", value: 5, suffix: "+" },
  { label: "Love & Care", value: 100, suffix: "%" },
];

export function AboutPageClient() {
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
              Our Story
            </h1>
            <p className="text-muted mt-4 max-w-2xl mx-auto">
              From a simple passion for coffee to a beloved gathering place
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <motion.div variants={slideInLeft} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
              <span className="text-brand text-sm font-semibold tracking-widest uppercase">Who We Are</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                Coffee for the Road, Since Day One
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  <span className="text-foreground font-semibold">DAWDI CAFE</span> was born from a simple belief: great coffee has the power to bring people together. What started as a small dream has grown into a beloved destination for coffee lovers, food enthusiasts, and everyone in between.
                </p>
                <p>
                  Located in Morocco, we pride ourselves on serving premium coffee sourced from the best growers around the world. Our beans are carefully selected, expertly roasted, and brewed to perfection by our skilled baristas.
                </p>
                <p>
                  Beyond coffee, our menu features a delightful selection of crêpes, fresh juices, milkshakes, smoothies, and desserts — all made with the finest ingredients and a touch of creativity.
                </p>
                <p>
                  At DAWDI CAFE, every visit is more than just a coffee run. It&apos;s an experience. Whether you&apos;re here for a quick espresso, a leisurely brunch, or a sweet treat with friends, we invite you to sit back, relax, and enjoy the moment.
                </p>
              </div>
            </motion.div>

            <motion.div variants={slideInRight} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
              <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand/20 via-dark to-brand/10 flex items-center justify-center border border-border overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-brand/20 flex items-center justify-center mb-4">
                    <Coffee className="w-10 h-10 text-brand" />
                  </div>
                  <p className="font-display text-3xl font-bold text-foreground">&ldquo;Coffee for the Road&rdquo;</p>
                  <p className="text-muted mt-2">Since 2019</p>
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
            <span className="text-brand text-sm font-semibold tracking-widest uppercase">Our Values</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
              What Drives Us
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
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
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

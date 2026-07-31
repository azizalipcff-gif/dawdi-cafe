"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, Instagram, Clock, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PHONE, INSTAGRAM_URL, GOOGLE_MAPS_URL, ADDRESS, WORKING_HOURS } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { toast } from "sonner";
import { useState } from "react";

const contactInfo = [
  { icon: <Phone className="w-5 h-5" />, label: "Phone", value: PHONE, href: `tel:${PHONE.replace(/\s/g, "")}` },
  { icon: <Mail className="w-5 h-5" />, label: "Email", value: "contact@dawdicafe.com", href: "mailto:contact@dawdicafe.com" },
  { icon: <MapPin className="w-5 h-5" />, label: "Location", value: ADDRESS, href: GOOGLE_MAPS_URL },
  { icon: <Instagram className="w-5 h-5" />, label: "Instagram", value: "@cafe_dawdi", href: INSTAGRAM_URL },
  { icon: <Clock className="w-5 h-5" />, label: "Weekdays", value: WORKING_HOURS.weekdays },
  { icon: <Clock className="w-5 h-5" />, label: "Weekends", value: WORKING_HOURS.weekends },
];

export function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

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
          <span className="text-brand text-sm font-semibold tracking-widest uppercase">Contact</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Get In Touch
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            We&apos;d love to hear from you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <motion.div
                  key={info.label}
                  variants={fadeInUp}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:text-brand transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-foreground">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Send a Message</h3>
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
              <Button type="submit" className="w-full gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

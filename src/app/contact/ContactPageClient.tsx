"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Instagram, Clock, MessageCircle, Send, Mail, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PHONE, INSTAGRAM_URL, GOOGLE_MAPS_URL, ADDRESS, WORKING_HOURS } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { toast } from "sonner";

const contactInfo = [
  { icon: <Phone className="w-5 h-5" />, label: "Phone", value: PHONE, href: `tel:${PHONE.replace(/\s/g, "")}` },
  { icon: <Mail className="w-5 h-5" />, label: "Email", value: "contact@dawdicafe.com", href: "mailto:contact@dawdicafe.com" },
  { icon: <MapPin className="w-5 h-5" />, label: "Location", value: ADDRESS, href: GOOGLE_MAPS_URL },
  { icon: <Instagram className="w-5 h-5" />, label: "Instagram", value: "@cafe_dawdi", href: INSTAGRAM_URL },
  { icon: <Clock className="w-5 h-5" />, label: "Weekdays", value: WORKING_HOURS.weekdays },
  { icon: <Clock className="w-5 h-5" />, label: "Weekends", value: WORKING_HOURS.weekends },
];

export function ContactPageClient() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="pt-24">
      <section className="relative py-20 bg-gradient-to-b from-brand/5 to-background">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 mx-auto rounded-full bg-brand/10 flex items-center justify-center mb-4">
              <Coffee className="w-8 h-8 text-brand" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">Contact Us</h1>
            <p className="text-muted mt-4 max-w-xl mx-auto">
              We&apos;d love to hear from you. Get in touch with us.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Contact Information</h2>
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

              <div className="flex flex-wrap gap-3 mt-8">
                <a href={`https://wa.me/${PHONE.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" className="gap-2 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/25">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </a>
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <MapPin className="w-4 h-4" />
                    Google Maps
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl bg-card border border-border">
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

      <section className="py-16 bg-gray-50 dark:bg-dark/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-border shadow-xl shadow-brand/5"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13230.123456789!2d-7.981!3d31.608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDM2JzI4LjgiTiA3wrA1OCc1MS42Ilc!5e0!3m2!1sfr!2sma!4v1"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="DAWDI CAFE Location"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

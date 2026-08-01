"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, Instagram, Clock, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PHONE, INSTAGRAM_URL, GOOGLE_MAPS_URL, ADDRESS, DEFAULT_SETTINGS } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { toast } from "sonner";
import { useState } from "react";
import { createMessage } from "@/lib/actions/messages";
import type { SiteSettings } from "@/lib/types";
import { useI18n } from "@/lib/i18n/LocaleProvider";

interface ContactSectionProps {
  settings?: Partial<SiteSettings>;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const { dict } = useI18n();
  const contact = { ...DEFAULT_SETTINGS.contact, ...settings?.contact };
  const hours = { ...DEFAULT_SETTINGS.hours, ...settings?.hours };
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const phone = contact.phone || PHONE;
  const email = contact.email || "contact@dawdicafe.com";
  const instagram = contact.instagram || INSTAGRAM_URL;
  const maps = contact.maps_url || GOOGLE_MAPS_URL;
  const address = contact.address || ADDRESS;

  const contactInfo = [
    { icon: <Phone className="w-5 h-5" />, label: dict.contact.phone, value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    { icon: <Mail className="w-5 h-5" />, label: dict.contact.email, value: email, href: `mailto:${email}` },
    { icon: <MapPin className="w-5 h-5" />, label: dict.contact.location, value: address, href: maps },
    { icon: <Instagram className="w-5 h-5" />, label: dict.contact.instagram, value: "@cafe_dawdi", href: instagram },
    { icon: <Clock className="w-5 h-5" />, label: dict.contact.weekdays, value: hours.weekdays },
    { icon: <Clock className="w-5 h-5" />, label: dict.contact.weekends, value: hours.weekends },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const form = new FormData();
      form.set("name", formData.name);
      form.set("email", formData.email);
      form.set("phone", formData.phone);
      form.set("subject", formData.subject);
      form.set("message", formData.message);
      const result = await createMessage(form);
      if (result?.error) toast.error(result.error);
      else {
        toast.success(dict.contact.success);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } finally {
      setSending(false);
    }
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
          <span className="text-brand text-sm font-semibold tracking-widest uppercase">{dict.contact.eyebrow}</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            {dict.contact.title}
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            {dict.contact.subtitle}
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
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{dict.contact.formTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder={dict.contact.name}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder={dict.contact.emailLabel}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder={dict.contact.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  placeholder={dict.contact.subjectPlaceholder}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <Textarea
                placeholder={dict.contact.messagePlaceholder}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
              <Button type="submit" className="w-full gap-2" disabled={sending}>
                <Send className="w-4 h-4" />
                {sending ? dict.contact.sending : dict.contact.sendMessage}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Instagram, Clock, MessageCircle, Send, Mail, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PHONE, INSTAGRAM_URL, GOOGLE_MAPS_URL, ADDRESS, DEFAULT_SETTINGS } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { toast } from "sonner";
import { createMessage } from "@/lib/actions/messages";
import type { SiteSettings } from "@/lib/types";
import { useI18n } from "@/lib/i18n/LocaleProvider";

interface ContactPageClientProps {
  settings?: Partial<SiteSettings>;
}

export function ContactPageClient({ settings }: ContactPageClientProps) {
  const { dict } = useI18n();
  const contact = { ...DEFAULT_SETTINGS.contact, ...settings?.contact };
  const hours = { ...DEFAULT_SETTINGS.hours, ...settings?.hours };
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const phone = contact.phone || PHONE;
  const email = contact.email || "contact@dawdicafe.com";
  const whatsapp = contact.whatsapp || contact.phone?.replace(/\s/g, "") || PHONE.replace(/\s/g, "");
  const instagram = contact.instagram || INSTAGRAM_URL;
  const maps = contact.maps_url || GOOGLE_MAPS_URL;
  const address = contact.address || ADDRESS;
  const cafeName = settings?.cafe?.name ?? "DAWDI CAFE";

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

  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(cafeName + " " + address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="pt-24">
      <section className="relative py-20 bg-gradient-to-b from-brand/5 to-background">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 mx-auto rounded-full bg-brand/10 flex items-center justify-center mb-4">
              <Coffee className="w-8 h-8 text-brand" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">{dict.contact.pageTitle}</h1>
            <p className="text-muted mt-4 max-w-xl mx-auto">
              {dict.contact.pageSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">{dict.contact.infoTitle}</h2>
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
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" className="gap-2 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/25">
                    <MessageCircle className="w-4 h-4" />
                    {dict.contact.whatsapp}
                  </Button>
                </a>
                <a href={maps} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <MapPin className="w-4 h-4" />
                    {dict.contact.googleMaps}
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
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">{dict.contact.formTitle}</h2>
              <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl bg-card border border-border">
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

      <section className="py-16 bg-gray-50 dark:bg-dark/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-border shadow-xl shadow-brand/5"
          >
            <iframe
              src={embedSrc}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${cafeName} Location`}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

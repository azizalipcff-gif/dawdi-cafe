"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createReservation } from "@/lib/actions/reservations";
import { useI18n } from "@/lib/i18n/LocaleProvider";

export function ReservationSection() {
  const { dict } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "2",
    date: "",
    time: "",
    notes: "",
  });
  const [sending, setSending] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const form = new FormData();
      form.set("name", formData.name);
      form.set("phone", formData.phone);
      form.set("guests", formData.guests);
      form.set("date", formData.date);
      form.set("time", formData.time);
      form.set("notes", formData.notes);
      const result = await createReservation(form);
      if (result?.error) toast.error(result.error);
      else {
        toast.success(dict.reservation.success);
        setFormData({ name: "", phone: "", guests: "2", date: "", time: "", notes: "" });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="relative py-24 md:py-32 bg-dark overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-brand text-sm font-semibold tracking-widest uppercase">{dict.reservation.eyebrow}</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
              {dict.reservation.title}
            </h2>
            <p className="text-gray-400 leading-relaxed max-w-md">
              {dict.reservation.subtitle}
            </p>
            <div className="mt-8 space-y-3 text-gray-300 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <span>{dict.reservation.bullet1}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <span>{dict.reservation.bullet2}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-4">
              <h3 className="font-display text-xl font-semibold text-white mb-2">{dict.reservation.formTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder={dict.reservation.name}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
                <Input
                  placeholder={dict.reservation.phone}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  type="number"
                  min="1"
                  max="30"
                  placeholder={dict.reservation.guests}
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
                <Input
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-white [color-scheme:dark]"
                />
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-white [color-scheme:dark]"
                />
              </div>
              <Textarea
                placeholder={dict.reservation.notes}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
              <Button type="submit" className="w-full gap-2" disabled={sending}>
                <Send className="w-4 h-4" />
                {sending ? dict.reservation.submitting : dict.reservation.submit}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

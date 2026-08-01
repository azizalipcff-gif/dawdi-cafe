"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import type { SiteSettings } from "@/lib/types";
import { useI18n } from "@/lib/i18n/LocaleProvider";

interface WhatsAppButtonProps {
  settings?: Partial<SiteSettings>;
}

export function WhatsAppButton({ settings }: WhatsAppButtonProps) {
  const { dict } = useI18n();
  const contact = { ...DEFAULT_SETTINGS.contact, ...settings?.contact };
  const number = contact.whatsapp || contact.phone?.replace(/\s/g, "") || "212656480972";
  const message = encodeURIComponent(dict.whatsapp.message + " " + (settings?.cafe?.name ?? "DAWDI CAFE") + ".");

  return (
    <motion.a
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 left-8 z-40 w-14 h-14 rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 flex items-center justify-center transition-shadow"
      aria-label={dict.whatsapp.label}
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  );
}

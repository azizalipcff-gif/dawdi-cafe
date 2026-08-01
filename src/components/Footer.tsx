"use client";

import { Phone, MapPin, Clock, Instagram, ArrowUpRight, Heart, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  PHONE, INSTAGRAM_URL, GOOGLE_MAPS_URL,
  ADDRESS, DEFAULT_SETTINGS,
} from "@/lib/constants";
import type { SiteSettings } from "@/lib/types";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { getNavItems } from "@/lib/i18n/dictionaries";

interface FooterProps {
  settings?: Partial<SiteSettings>;
}

export function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear();
  const { dict, link } = useI18n();
  const navItems = getNavItems(dict);

  const contact = { ...DEFAULT_SETTINGS.contact, ...settings?.contact };
  const hours = { ...DEFAULT_SETTINGS.hours, ...settings?.hours };
  const footer = { ...DEFAULT_SETTINGS.footer, ...settings?.footer };
  const cafe = { ...DEFAULT_SETTINGS.cafe, ...settings?.cafe };
  const logo = cafe.logo_url || "/logo/logo.png";

  const phone = contact.phone || PHONE;
  const instagram = contact.instagram || INSTAGRAM_URL;
  const maps = contact.maps_url || GOOGLE_MAPS_URL;
  const address = contact.address || ADDRESS;
  const instagramHandle = instagram.split("/").filter(Boolean).pop() ?? "@cafe_dawdi";

  return (
    <footer className="relative bg-dark text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      <div className="container-custom relative z-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 shrink-0">
                <Image src={logo} alt={cafe.name} fill className="object-contain" sizes="40px" />
              </div>
              <div>
                <span className="font-display text-xl font-bold text-white">{cafe.name}</span>
                <span className="block font-mono text-[9px] text-brand tracking-[0.2em] uppercase">{cafe.tagline}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {footer.about}
            </p>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold text-white mb-5 tracking-wide">{dict.footer.quickLinks}</h3>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={link(item.href)}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-brand transition-colors group"
                  >
                    {item.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold text-white mb-5 tracking-wide">{dict.footer.hours}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-gray-400">
                <Clock className="w-4 h-4 text-brand shrink-0" />
                <div>
                  <p className="text-white font-medium">{dict.footer.weekdays}</p>
                  <p>{hours.weekdays}</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Clock className="w-4 h-4 text-brand shrink-0" />
                <div>
                  <p className="text-white font-medium">{dict.footer.weekends}</p>
                  <p>{hours.weekends}</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold text-white mb-5 tracking-wide">{dict.footer.contact}</h3>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-brand transition-colors">
                  <Phone className="w-4 h-4 text-brand shrink-0" />
                  {phone}
                </a>
              </li>
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-brand transition-colors">
                    <Mail className="w-4 h-4 text-brand shrink-0" />
                    {contact.email}
                  </a>
                </li>
              )}
              <li>
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-400 hover:text-brand transition-colors">
                  <Instagram className="w-4 h-4 text-brand shrink-0" />
                  @{instagramHandle}
                </a>
              </li>
              <li>
                <a href={maps} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-400 hover:text-brand transition-colors">
                  <MapPin className="w-4 h-4 text-brand shrink-0" />
                  {address}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm text-gray-500">
            {footer.copyright.replace("{year}", String(year)) || `© ${year} ${cafe.name}. ${dict.footer.rights}`}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            {dict.footer.designedWith} <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> {cafe.name}
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { Phone, MapPin, Clock, Instagram, ArrowUpRight, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SITE_NAME, NAV_ITEMS, PHONE, INSTAGRAM_URL, GOOGLE_MAPS_URL, ADDRESS, WORKING_HOURS } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-dark text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      <div className="container-custom relative z-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 shrink-0">
                <Image src="/logo/logo.png" alt={SITE_NAME} fill className="object-contain" sizes="40px" />
              </div>
              <div>
                <span className="font-display text-xl font-bold text-white">{SITE_NAME}</span>
                <span className="block font-mono text-[9px] text-brand tracking-[0.2em] uppercase">Coffee for the Road</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium coffee, crêpes, snacks and quality drinks. Fresh, fast, and friendly service in Morocco.
            </p>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold text-white mb-5 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
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
            <h3 className="font-display text-base font-semibold text-white mb-5 tracking-wide">Hours</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-gray-400">
                <Clock className="w-4 h-4 text-brand shrink-0" />
                <div>
                  <p className="text-white font-medium">Weekdays</p>
                  <p>{WORKING_HOURS.weekdays}</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Clock className="w-4 h-4 text-brand shrink-0" />
                <div>
                  <p className="text-white font-medium">Weekends</p>
                  <p>{WORKING_HOURS.weekends}</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold text-white mb-5 tracking-wide">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-brand transition-colors">
                  <Phone className="w-4 h-4 text-brand shrink-0" />
                  {PHONE}
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-400 hover:text-brand transition-colors">
                  <Instagram className="w-4 h-4 text-brand shrink-0" />
                  @cafe_dawdi
                </a>
              </li>
              <li>
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-400 hover:text-brand transition-colors">
                  <MapPin className="w-4 h-4 text-brand shrink-0" />
                  {ADDRESS}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm text-gray-500">
            &copy; {year} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Designed with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by DAWDI CAFE
          </p>
        </div>
      </div>
    </footer>
  );
}

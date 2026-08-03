"use client";

import { useState } from "react";
import { Save, Check, Building2, Phone as PhoneIcon, Clock, Info } from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import type { SiteSettings } from "@/lib/types";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  type?: string;
  span2?: boolean;
}

function Field({ label, name, value, onChange, placeholder, type = "text", span2 }: FieldProps) {
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder ?? label}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
      />
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof Building2;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-white">{title}</h2>
          <p className="text-xs text-zinc-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings } = useAdminStore();
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<SiteSettings>(settings);

  const update = <S extends keyof SiteSettings>(
    section: S,
    field: keyof SiteSettings[S],
    value: string
  ) => {
    setDraft((d) => ({ ...d, [section]: { ...d[section], [field]: value } }));
  };

  const save = () => {
    updateSettings(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    save();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Store information shown on the public website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-400">
              <Check className="h-4 w-4" />
              Saved
            </span>
          )}
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>

      <form id="settings-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Cafe identity */}
        <Section icon={Building2} title="Cafe Identity" subtitle="Name, branding and hero image">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Cafe Name" name="name" value={draft.cafe.name} onChange={(_, v) => update("cafe", "name", v)} span2 />
            <Field label="Tagline" name="tagline" value={draft.cafe.tagline} onChange={(_, v) => update("cafe", "tagline", v)} />
            <Field label="Favicon path" name="favicon" value={draft.cafe.favicon} onChange={(_, v) => update("cafe", "favicon", v)} />
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                About description (homepage About section)
              </label>
              <textarea
                value={draft.cafe.description}
                onChange={(e) => update("cafe", "description", e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
              />
            </div>
            <div className="sm:col-span-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ImageUpload
                label="Logo"
                value={draft.cafe.logo_url}
                onChange={(url) => update("cafe", "logo_url", url ?? "")}
              />
              <ImageUpload
                label="Hero image"
                value={draft.cafe.hero_image}
                onChange={(url) => update("cafe", "hero_image", url ?? "")}
              />
            </div>
          </div>
        </Section>

        {/* Contact */}
        <Section icon={PhoneIcon} title="Contact Information" subtitle="Phone, WhatsApp and social links">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Phone" name="phone" value={draft.contact.phone} onChange={(_, v) => update("contact", "phone", v)} />
            <Field label="WhatsApp" name="whatsapp" value={draft.contact.whatsapp} onChange={(_, v) => update("contact", "whatsapp", v)} />
            <Field label="Email" name="email" value={draft.contact.email} onChange={(_, v) => update("contact", "email", v)} />
            <Field label="Address" name="address" value={draft.contact.address} onChange={(_, v) => update("contact", "address", v)} span2 />
            <Field label="Google Maps URL" name="maps_url" value={draft.contact.maps_url} onChange={(_, v) => update("contact", "maps_url", v)} span2 />
            <Field label="Instagram" name="instagram" value={draft.contact.instagram} onChange={(_, v) => update("contact", "instagram", v)} />
            <Field label="Facebook" name="facebook" value={draft.contact.facebook} onChange={(_, v) => update("contact", "facebook", v)} />
            <Field label="TikTok" name="tiktok" value={draft.contact.tiktok} onChange={(_, v) => update("contact", "tiktok", v)} />
          </div>
        </Section>

        {/* Hours */}
        <Section icon={Clock} title="Opening Hours" subtitle="Shown on the contact page">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Weekdays" name="weekdays" value={draft.hours.weekdays} onChange={(_, v) => update("hours", "weekdays", v)} />
            <Field label="Weekends" name="weekends" value={draft.hours.weekends} onChange={(_, v) => update("hours", "weekends", v)} />
          </div>
        </Section>

        {/* Footer */}
        <Section icon={Info} title="Footer" subtitle="Footer about text and copyright">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">About</label>
              <textarea
                value={draft.footer.about}
                onChange={(e) => update("footer", "about", e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
              />
            </div>
            <Field label="Copyright" name="copyright" value={draft.footer.copyright} onChange={(_, v) => update("footer", "copyright", v)} span2 />
          </div>
        </Section>
      </form>
    </div>
  );
}

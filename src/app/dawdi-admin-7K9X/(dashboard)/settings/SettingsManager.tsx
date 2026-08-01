"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { SiteSettings } from "@/lib/types";
import { updateSettings, uploadHeroImage } from "@/lib/actions/settings";
import { DEFAULT_SETTINGS } from "@/lib/constants";

export function SettingsManager({ settings }: { settings: Partial<SiteSettings> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [heroImage, setHeroImage] = useState<string>(
    settings.cafe?.hero_image ?? DEFAULT_SETTINGS.cafe.hero_image
  );

  const values = {
    cafe: { ...DEFAULT_SETTINGS.cafe, ...settings.cafe },
    contact: { ...DEFAULT_SETTINGS.contact, ...settings.contact },
    hours: { ...DEFAULT_SETTINGS.hours, ...settings.hours },
    seo: { ...DEFAULT_SETTINGS.seo, ...settings.seo },
    design: { ...DEFAULT_SETTINGS.design, ...settings.design },
    footer: { ...DEFAULT_SETTINGS.footer, ...settings.footer },
  } as SiteSettings;

  const handleHeroUpload = async (file: File | null) => {
    if (!file) return;
    const formData = new FormData();
    formData.set("hero_image", file);
    const res = await uploadHeroImage(formData);
    if (res?.error) toast.error(res.error);
    else if (res?.url) {
      setHeroImage(res.url);
      toast.success("Hero image uploaded");
      router.refresh();
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <fieldset className="rounded-xl border border-border bg-card p-6 space-y-4">
      <legend className="px-2 font-display text-base font-semibold text-foreground">{title}</legend>
      {children}
    </fieldset>
  );

  const Field = ({ name, label, defaultValue, type = "text", hint }: {
    name: string; label: string; defaultValue: string; type?: string; hint?: string;
  }) => (
    <div>
      <label className="text-sm font-medium text-foreground block mb-1.5">{label}</label>
      <Input name={name} type={type} defaultValue={defaultValue} />
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  );

  return (
    <form
      action={async (formData) => {
        const res = await updateSettings(formData);
        if (res?.error) toast.error(res.error);
        else {
          toast.success("Settings saved");
          router.refresh();
        }
      }}
      className="space-y-6"
    >
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>

      <Section title="Brand">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field name="cafe.name" label="Cafe Name" defaultValue={values.cafe.name} />
          <Field name="cafe.tagline" label="Tagline" defaultValue={values.cafe.tagline} />
          <Field name="cafe.logo_url" label="Logo URL" defaultValue={values.cafe.logo_url} />
          <Field name="cafe.favicon" label="Favicon URL" defaultValue={values.cafe.favicon} />
        </div>
        <Field name="cafe.description" label="Description" defaultValue={values.cafe.description} />
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Hero Image</label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              {heroImage && <Image src={heroImage} alt="Hero" fill className="object-cover" sizes="96px" />}
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border text-sm text-muted cursor-pointer hover:border-brand/40 transition-colors">
                <Upload className="w-4 h-4" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => startTransition(() => handleHeroUpload(e.target.files?.[0] ?? null))}
                />
              </label>
              <p className="text-xs text-muted max-w-[220px]">
                JPEG, PNG, WebP or GIF · max 8MB
              </p>
            </div>
          </div>
          <input type="hidden" name="cafe.hero_image" value={heroImage} />
        </div>
      </Section>

      <Section title="Contact">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field name="contact.phone" label="Phone" defaultValue={values.contact.phone} />
          <Field name="contact.whatsapp" label="WhatsApp Number" defaultValue={values.contact.whatsapp} />
          <Field name="contact.email" label="Email" type="email" defaultValue={values.contact.email} />
          <Field name="contact.instagram" label="Instagram URL" defaultValue={values.contact.instagram} />
          <Field name="contact.facebook" label="Facebook URL" defaultValue={values.contact.facebook} />
          <Field name="contact.tiktok" label="TikTok URL" defaultValue={values.contact.tiktok} />
          <Field name="contact.maps_url" label="Google Maps URL" defaultValue={values.contact.maps_url} />
          <Field name="contact.address" label="Address" defaultValue={values.contact.address} />
        </div>
      </Section>

      <Section title="Opening Hours">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field name="hours.weekdays" label="Weekdays" defaultValue={values.hours.weekdays} />
          <Field name="hours.weekends" label="Weekends" defaultValue={values.hours.weekends} />
        </div>
      </Section>

      <Section title="SEO">
        <Field name="seo.title" label="Meta Title" defaultValue={values.seo.title} />
        <Field name="seo.description" label="Meta Description" defaultValue={values.seo.description} />
        <Field name="seo.keywords" label="Keywords (comma separated)" defaultValue={values.seo.keywords} />
        <Field name="seo.og_image" label="Open Graph Image URL" defaultValue={values.seo.og_image} />
      </Section>

      <Section title="Design">
        <Field name="design.primary_color" label="Primary Color (hex)" defaultValue={values.design.primary_color} />
      </Section>

      <Section title="Footer">
        <Field name="footer.about" label="About Text" defaultValue={values.footer.about} />
        <Field name="footer.copyright" label="Copyright" defaultValue={values.footer.copyright} />
      </Section>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="gap-2">
          <ImageIcon className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </form>
  );
}

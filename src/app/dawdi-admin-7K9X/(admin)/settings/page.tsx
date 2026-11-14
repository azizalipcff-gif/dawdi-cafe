"use client";
import { useState } from "react";
import { Check, Save, MessageCircle, Store } from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";

export default function SettingsPage() {
  const { settings, updateSettings } = useAdminStore();
  const [name,setName] = useState(settings.cafe.name || "MOMIA STOR");
  const [tagline,setTagline] = useState(settings.cafe.tagline || "Your Digital Partner");
  const [whatsapp,setWhatsapp] = useState(settings.contact.whatsapp || "0659785764");
  const [saved,setSaved] = useState(false);
  const save = () => {
    updateSettings({
      ...settings,
      cafe: { ...settings.cafe, name, tagline, description: "Social media growth, gaming top-ups and digital services." },
      contact: { ...settings.contact, phone: whatsapp, whatsapp },
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };
  return <div className="mx-auto max-w-3xl space-y-6">
    <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#00D6C9]">MOMIA STOR</p><h1 className="mt-2 text-3xl font-black text-white">Store settings</h1><p className="mt-1 text-sm text-zinc-400">The essentials needed to run your online store.</p></div>
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7"><div className="flex items-center gap-3"><span className="rounded-xl bg-[#168BFF]/15 p-3 text-[#00D6C9]"><Store className="h-5 w-5"/></span><div><h2 className="font-bold text-white">Store identity</h2><p className="text-xs text-zinc-500">Your brand name and slogan</p></div></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm text-zinc-300">Store name<input value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-[#168BFF]"/></label><label className="text-sm text-zinc-300">Tagline<input value={tagline} onChange={e=>setTagline(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-[#168BFF]"/></label></div>
    </section>
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7"><div className="flex items-center gap-3"><span className="rounded-xl bg-green-500/10 p-3 text-green-400"><MessageCircle className="h-5 w-5"/></span><div><h2 className="font-bold text-white">WhatsApp orders</h2><p className="text-xs text-zinc-500">Customers are redirected here to complete their purchase</p></div></div>
      <label className="mt-6 block text-sm text-zinc-300">WhatsApp number<input inputMode="tel" value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="0659785764" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-[#168BFF]"/></label><p className="mt-2 text-xs text-zinc-500">Use your Moroccan number, e.g. 0659785764. It will be converted to the international format for WhatsApp links.</p>
    </section>
    <div className="flex flex-wrap items-center justify-end gap-3">{saved && <span className="inline-flex items-center gap-2 text-sm text-green-400"><Check className="h-4 w-4"/> Saved</span>}<button onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-[#168BFF] px-5 py-3 text-sm font-bold text-white hover:bg-blue-500"><Save className="h-4 w-4"/> Save settings</button></div>
  </div>;
}

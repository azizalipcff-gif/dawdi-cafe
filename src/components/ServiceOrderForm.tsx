"use client";

import { useState, useTransition } from "react";
import { ShoppingCart, X, LoaderCircle, CheckCircle2 } from "lucide-react";
import { submitServiceOrder } from "@/lib/actions/service-orders";
import type { Product } from "@/lib/types";

export function ServiceOrderForm({ product, locale }: { product: Product; locale: string }) {
  const ar = locale === "ar";
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [target, setTarget] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await submitServiceOrder({
        productId: product.id,
        customerName: name,
        customerPhone: phone,
        targetUsername: target,
        targetLink: link,
        quantity,
        notes,
      });
      if (!result.ok) { setError(result.error); return; }
      setOrderId(result.orderId);
    });
  };

  const close = () => { setOpen(false); setError(""); setOrderId(""); };
  return <>
    <button type="button" onClick={() => setOpen(true)} disabled={!product.is_available} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#168BFF] px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
      <ShoppingCart size={17}/>{ar ? "اطلب دابا" : "Order now"}
    </button>
    {open && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm" onClick={close}>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1424] p-5 shadow-2xl sm:p-6" dir={ar?"rtl":"ltr"} onClick={e=>e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between gap-3"><div><h3 className="text-lg font-black text-white">{ar?"طلب الخدمة":"Order service"}</h3><p className="mt-1 text-sm text-slate-400">{product.name}</p></div><button type="button" onClick={close} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close"><X size={19}/></button></div>
        {orderId ? <div className="py-8 text-center"><CheckCircle2 className="mx-auto mb-3 text-[#00D6C9]" size={42}/><h4 className="text-xl font-bold text-white">{ar?"توصلنا بالطلب ديالك":"Order received"}</h4><p className="mt-2 text-sm text-slate-400">{ar?"رقم الطلب:":"Order ID:"} <span className="font-mono text-[#00D6C9]">{orderId.slice(0,8).toUpperCase()}</span></p><p className="mt-2 text-xs text-slate-500">{ar?"غادي يتراجع الطلب من طرف الإدارة قبل التأكيد.":"Your order will be reviewed by the store team before confirmation."}</p><button type="button" onClick={close} className="mt-6 rounded-xl bg-[#168BFF] px-5 py-2.5 text-sm font-bold text-white">{ar?"إغلاق":"Close"}</button></div> : <form onSubmit={submit} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">{ar?"الاسم الكامل":"Full name"}<input required minLength={2} value={name} onChange={e=>setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-[#168BFF]" placeholder={ar?"الاسم ديالك":"Your name"}/></label>
          <label className="block text-xs font-semibold text-slate-300">{ar?"رقم الهاتف":"Phone number"}<input required minLength={7} value={phone} onChange={e=>setPhone(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-[#168BFF]" placeholder="+212..."/></label>
          <label className="block text-xs font-semibold text-slate-300">{ar?"اسم الحساب أو Player ID":"Username or Player ID"}<input value={target} onChange={e=>setTarget(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-[#168BFF]" placeholder={ar?"اسم المستخدم أو UID":"Username / UID"}/></label>
          <label className="block text-xs font-semibold text-slate-300">{ar?"رابط الحساب (اختياري)":"Profile link (optional)"}<input value={link} onChange={e=>setLink(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-[#168BFF]" placeholder="https://..."/></label>
          <div className="grid grid-cols-2 gap-3"><label className="block text-xs font-semibold text-slate-300">{ar?"عدد الباقات":"Packages"}<input type="number" min={1} max={50} value={quantity} onChange={e=>setQuantity(Math.max(1,Math.min(50,Number(e.target.value)||1)))} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-[#168BFF]"/></label><div className="flex flex-col justify-end pb-3"><span className="text-xs text-slate-400">{ar?"المجموع":"Total"}</span><strong className="mt-1 text-lg text-[#00D6C9]">{(Number(product.price)*quantity).toFixed(2)} DH</strong></div></div>
          <label className="block text-xs font-semibold text-slate-300">{ar?"ملاحظات إضافية":"Notes"}<textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-[#168BFF]"/></label>
          {error && <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}
          <p className="text-[11px] leading-5 text-slate-500">{ar?"الطلب ما كيتحسبش مؤكد حتى تراجعو الإدارة وتتواصل معاك.":"Submitting does not mean payment is completed; the team will review and contact you."}</p>
          <button disabled={pending} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#168BFF] px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-60">{pending&&<LoaderCircle className="animate-spin" size={16}/>} {pending?(ar?"كنسجلو الطلب...":"Submitting..."):(ar?"أكد الطلب":"Submit order")}</button>
        </form>}
      </div>
    </div>}
  </>;
}

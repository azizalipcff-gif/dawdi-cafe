"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Coffee, MessageCircle } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { useCart } from "@/components/CartProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { cn, formatCurrency, buildWhatsAppHref } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

type OrderType = "pickup" | "delivery";

export function CartPageClient({ whatsappNumber }: { whatsappNumber: string }) {
  const { dict, link } = useI18n();
  const { items, updateQuantity, removeItem, total, count } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (trimmedName.length < 2 || trimmedPhone.length < 7) {
      toast.error(dict.errors.invalidInput);
      return;
    }

    setSubmitting(true);
    try {
      const orderTypeLabel = orderType === "delivery" ? dict.cart.delivery : dict.cart.pickup;

      const lines = items
        .map((item, i) => {
          const lineTotal = item.price * item.quantity;
          return `${i + 1}. ${item.name}\n   ${item.quantity} × ${formatCurrency(item.price)} = ${formatCurrency(lineTotal)}`;
        })
        .join("\n\n");

      const trimmedNotes = notes.trim();
      const noteSection = trimmedNotes ? `\n\n📝 Note:\n${trimmedNotes}` : "";

      const message =
        `☕ New Order — ${SITE_NAME}\n\n` +
        `👤 Customer: ${trimmedName}\n` +
        `📞 Phone: ${trimmedPhone}\n\n` +
        `📦 Order type: ${orderTypeLabel}\n\n` +
        `🛒 Order:\n\n${lines}\n\n` +
        `💰 Total: ${formatCurrency(total)}` +
        noteSection;

      const href = buildWhatsAppHref(whatsappNumber, message);
      const opened = window.open(href, "_blank");
      if (!opened) toast.error(dict.errors.generic);
    } finally {
      setSubmitting(false);
    }
  };

  if (count === 0) {
    return (
      <div className="pt-32 pb-20 min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-brand/10 flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-brand" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">{dict.cart.emptyTitle}</h1>
          <p className="text-muted mb-6">{dict.cart.emptySubtitle}</p>
          <Link href={link("/menu")}>
            <Button size="lg" className="gap-2">
              <Coffee className="w-4 h-4" />
              {dict.cart.viewMenu}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">
      <div className="container-custom max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">{dict.cart.title}</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.product_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <ProductImage
                    src={item.image_url}
                    alt={item.name}
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-sm text-muted font-mono">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="w-20 text-right font-semibold text-foreground font-mono">
                  {formatCurrency(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleCheckout}
            className="space-y-4 p-6 rounded-2xl bg-card border border-border h-fit lg:sticky lg:top-24"
          >
            <h2 className="font-display text-xl font-bold text-foreground">{dict.cart.checkout}</h2>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{dict.cart.fullName}</label>
              <Input placeholder={dict.cart.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{dict.cart.phone}</label>
              <Input placeholder={dict.cart.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{dict.cart.notes}</label>
              <Textarea placeholder={dict.cart.notesPlaceholder} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground block mb-1.5">{dict.cart.orderType}</legend>
              <div className="grid grid-cols-2 gap-2">
                {(["pickup", "delivery"] as const).map((type) => (
                  <label
                    key={type}
                    className={cn(
                      "cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors",
                      orderType === type
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-border text-muted hover:border-brand/40"
                    )}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value={type}
                      checked={orderType === type}
                      onChange={() => setOrderType(type)}
                      className="sr-only"
                    />
                    {type === "delivery" ? dict.cart.delivery : dict.cart.pickup}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted">
                <span>{dict.cart.items} ({count})</span>
                <span className="font-mono">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground text-lg">
                <span>{dict.cart.total}</span>
                <span className="font-mono">{formatCurrency(total)}</span>
              </div>
            </div>
            <Button type="submit" disabled={submitting} className="w-full gap-2">
              {submitting ? (
                dict.cart.openingWhatsApp
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  {dict.cart.orderViaWhatsApp}
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

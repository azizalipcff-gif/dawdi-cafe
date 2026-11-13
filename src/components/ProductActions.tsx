"use client";

import { toast } from "sonner";
import { MessageCircle, Plus, Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/CartProvider";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { fmt } from "@/lib/i18n/config";
import { formatCurrency, buildWhatsAppHref } from "@/lib/utils";

export function ProductActions({
  product,
  whatsappNumber,
}: {
  product: Product;
  whatsappNumber: string;
}) {
  const { addItem } = useCart();
  const { dict } = useI18n();
  const available = product.is_available;

  const whatsappHref = buildWhatsAppHref(
    whatsappNumber,
    fmt(dict.whatsapp.order, {
      name: product.name,
      price: formatCurrency(Number(product.price ?? 0)),
      status: available ? dict.menuPage.available : dict.menuPage.notAvailable,
    })
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={!available}
        onClick={() => {
          addItem(product);
          toast.success(fmt(dict.cart.added, { name: product.name }));
        }}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
          available
            ? "bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-dark"
            : "cursor-not-allowed bg-muted text-muted-foreground opacity-60"
        }`}
      >
        <Plus className="h-4 w-4" />
        {dict.common.addToCart}
      </button>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
          available
            ? "bg-green-600/10 text-green-600 hover:bg-green-600 hover:text-white"
            : "pointer-events-none bg-muted/30 text-muted opacity-50"
        }`}
        aria-disabled={!available}
      >
        <MessageCircle className="h-4 w-4" />
        {dict.productPage.orderOnWhatsApp}
      </a>

      {available && (
        <span className="ml-1 inline-flex items-center gap-1 text-xs font-medium text-green-600">
          <Check className="h-3.5 w-3.5" />
          {dict.productPage.available}
        </span>
      )}
    </div>
  );
}

export function ProductImageFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden bg-[#0B1424] text-[#00D6C9]"><ShoppingBag className="h-10 w-10"/><span className="text-[10px] font-black tracking-[.2em] text-white">MOMIA STOR</span></div>
  );
}

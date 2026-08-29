import Link from "next/link";
import { ArrowLeft, Tag, ListChecks, Store } from "lucide-react";
import type { Product } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/config";
import { formatCurrency } from "@/lib/utils";
import { ProductActions } from "@/components/ProductActions";
import { ProductImage } from "@/components/ProductImage";

export function ProductDetail({
  product,
  related,
  dict,
  locale,
  businessName,
  whatsappNumber,
}: {
  product: Product;
  related: Product[];
  dict: Dictionary;
  locale: Locale;
  businessName: string;
  whatsappNumber: string;
}) {
  const price = Number(product.price ?? 0);
  const oldPrice = product.discount ? Number(product.discount) : null;
  const hasDiscount = !!oldPrice && oldPrice > price && oldPrice > 0;
  const discountPct = hasDiscount ? Math.round((1 - price / oldPrice) * 100) : 0;

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom">
        <Link
          href={localizePath("/menu", locale)}
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {dict.productPage.backToMenu}
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-card">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
            {hasDiscount && (
              <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                -{discountPct}%
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.category?.name && (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                <Tag className="h-3.5 w-3.5" />
                {product.category.name}
              </span>
            )}

            <h1 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-2xl font-bold text-brand">
                {formatCurrency(price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="font-mono text-lg text-muted line-through">
                    {formatCurrency(oldPrice!)}
                  </span>
                  <span className="rounded-full bg-red-600/10 px-2.5 py-1 text-xs font-semibold text-red-600">
                    {fmtDiscount(dict, discountPct)}
                  </span>
                </>
              )}
            </div>

            <div className="mt-4">
              {product.is_available ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600/10 px-3 py-1 text-xs font-semibold text-green-600">
                  {dict.productPage.available}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
                  {dict.productPage.notAvailable}
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-6 leading-relaxed text-muted">{product.description}</p>
            )}

            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mt-6">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ListChecks className="h-4 w-4 text-brand" />
                  {dict.productPage.ingredients}
                </h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <li
                      key={ing}
                      className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted"
                    >
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 text-sm text-muted">
              <Store className="h-4 w-4 text-brand" />
              <span>
                {dict.productPage.business}: <span className="text-foreground">{businessName}</span>
              </span>
            </div>

            <div className="mt-8">
              <ProductActions product={product} whatsappNumber={whatsappNumber} />
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {dict.productPage.related}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((item) => {
                const rPrice = Number(item.price ?? 0);
                const rOld = item.discount ? Number(item.discount) : null;
                const rHas = !!rOld && rOld > rPrice && rOld > 0;
                return (
                  <Link
                    key={item.id}
                    href={localizePath(`/product/${item.id}`, locale)}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-brand/30 hover:shadow-lg"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
                      <ProductImage
                        src={item.image_url}
                        alt={item.name}
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-mono text-sm font-semibold text-brand">
                          {formatCurrency(rPrice)}
                        </span>
                        {rHas && (
                          <span className="font-mono text-xs text-muted line-through">
                            {formatCurrency(rOld!)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function fmtDiscount(dict: Dictionary, pct: number): string {
  return dict.productPage.discountBadge.replace("{percent}", String(pct));
}

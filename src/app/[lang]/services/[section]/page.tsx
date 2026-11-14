import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Gamepad2, Instagram, Zap, Package } from "lucide-react";
import { getProducts } from "@/lib/data";
import { ServiceOrderForm } from "@/components/ServiceOrderForm";
import type { Locale } from "@/lib/i18n/config";

const config = {
  gaming: { en: ["Gaming Top Up", "Game credits and top-up packages."], fr: ["Recharge de jeux", "Crédits et forfaits de recharge pour vos jeux."], ar: ["شحن الألعاب", "باقات شحن الألعاب والأرصدة المتاحة."] },
  "digital-services": { en: ["Digital Services", "Useful digital services in one place."], fr: ["Services numériques", "Des services numériques utiles au même endroit."], ar: ["الخدمات الرقمية", "خدمات رقمية متنوعة فبلاصة وحدة."] },
  "social-media": { en: ["Social Media", "Packages for followers, likes and engagement."], fr: ["Réseaux sociaux", "Des offres pour les abonnés, les likes et l’engagement."], ar: ["السوشل ميديا", "باقات المتابعين والإعجابات والتفاعل."] },
} as const;

type Section = keyof typeof config;
const keywords: Record<Section, RegExp> = {
  gaming: /gaming|game|free.?fire|pubg|top.?up|لعب|ألعاب|العاب|شحن|recharge|jeu/i,
  "digital-services": /digital|service|خدمات|رقمي|رقمية|numérique|numerique/i,
  "social-media": /social|instagram|tiktok|facebook|youtube|followers|likes|engagement|متابع|إعجاب|اعجاب|تفاعل|سوشل|تواصل/i,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string; section: string }> }): Promise<Metadata> {
  const { lang, section } = await params;
  const key = (section in config ? section : "digital-services") as Section;
  const locale = (["ar", "fr", "en"].includes(lang) ? lang : "en") as Locale;
  return { title: `${config[key][locale][0]} | MOMIA STOR`, description: config[key][locale][1] };
}

export default async function ServiceCategoryPage({ params }: { params: Promise<{ lang: string; section: string }> }) {
  const { lang, section } = await params;
  const locale = (["ar", "fr", "en"].includes(lang) ? lang : "en") as Locale;
  const key = (section in config ? section : "digital-services") as Section;
  const [title, description] = config[key][locale];
  const products = await getProducts(true, locale);
  const filtered = products.filter((p) => {
    const category = p.category;
    const haystack = [category?.name, category?.slug, p.name, p.platform].filter(Boolean).join(" ");
    if (key === "digital-services") return !keywords.gaming.test(haystack) && !keywords["social-media"].test(haystack);
    return keywords[key].test(haystack);
  });
  const Icon = key === "gaming" ? Gamepad2 : key === "social-media" ? Instagram : Zap;
  const ar = locale === "ar";
  return <main dir={ar ? "rtl" : "ltr"} className="momia-store min-h-screen bg-[#0B1424] px-5 pb-20 pt-12 text-white sm:px-8">
    <div className="mx-auto max-w-7xl">
      <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-[#00D6C9]"><ArrowLeft size={16}/>{ar ? "الصفحة الرئيسية" : locale === "fr" ? "Accueil" : "Home"}</Link>
      <header className="mt-12 border-b border-white/10 pb-9">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#168BFF]/10 text-[#00D6C9]"><Icon size={25}/></span>
        <p className="mt-6 text-[10px] font-bold tracking-[.25em] text-[#00D6C9]">MOMIA STOR / {key.replace("-", " ").toUpperCase()}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">{description}</p>
      </header>
      <div className="mt-9 flex flex-wrap gap-2">
        {(["gaming", "digital-services", "social-media"] as Section[]).map((item) => <Link key={item} href={`/${locale}/services/${item}`} className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${item === key ? "border-[#168BFF] bg-[#168BFF] text-white" : "border-white/10 bg-white/[.03] text-slate-300 hover:border-[#00D6C9]/50"}`}>{config[item][locale][0]}</Link>)}
      </div>
      {filtered.length ? <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {filtered.map((product) => <article key={product.id} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#101f35]">
          <div className="aspect-[4/3] overflow-hidden bg-[#09111e]">{product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center text-[#00D6C9]"><Package size={34}/></div>}</div>
          <div className="flex flex-1 flex-col p-3 sm:p-5"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#00D6C9]">{product.category?.name || title}</p><h2 className="mt-2 line-clamp-2 text-sm font-bold sm:text-base">{product.name}</h2>{product.platform && <p className="mt-1 text-xs text-slate-400">{product.platform}</p>}<p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-400">{product.description}</p><p className="mt-auto pt-4 text-lg font-extrabold">{Number(product.price).toFixed(2)} <span className="text-xs font-semibold text-slate-400">DH</span></p><div className="mt-3"><ServiceOrderForm product={product} locale={locale}/></div></div>
        </article>)}
      </div> : <div className="mt-10 rounded-xl border border-dashed border-white/15 px-6 py-14 text-center"><Package className="mx-auto mb-4 text-[#00D6C9]" size={32}/><h2 className="font-bold">{ar ? "ما كايناش باقات منشورة فهاد القسم دابا" : locale === "fr" ? "Aucune offre publiée dans cette catégorie pour le moment" : "No published packages in this category yet"}</h2><p className="mt-2 text-sm text-slate-400">{ar ? "زيد المنتجات وربطها بالتصنيف المناسب من لوحة الإدارة." : locale === "fr" ? "Ajoutez des offres et associez-les à la bonne catégorie depuis l’administration." : "Add products and assign them to the matching category in the admin panel."}</p></div>}
      <div className="mt-12 border-t border-white/10 pt-7"><Link href={`/${locale}/menu`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#00D6C9] hover:text-white">{ar ? "عرض جميع الخدمات" : locale === "fr" ? "Voir tous les services" : "Browse all services"}<ArrowUpRight size={16}/></Link></div>
    </div>
  </main>;
}

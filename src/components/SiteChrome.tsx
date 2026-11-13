"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { ADMIN_PATH } from "@/lib/constants";
import type { SiteSettings } from "@/lib/types";

export function SiteChrome({ settings: _settings, children }: { settings?: Partial<SiteSettings>; children: React.ReactNode }) {
 const pathname=usePathname();
 if(pathname?.startsWith(ADMIN_PATH) || pathname?.startsWith("/momia-admin")) return <>{children}</>;
 const locale=pathname?.split("/")[1]||"ar";
 const ar=locale==="ar";
 return <>
  <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1424]/95 text-white backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
   <Link href={`/${locale}`} className="flex min-w-0 items-center gap-2.5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#168BFF] to-[#00D6C9] text-[#071321]"><ShoppingBag size={21}/></span><span className="min-w-0"><span className="block whitespace-nowrap text-base font-black tracking-wider">MOMIA <b className="text-[#168BFF]">STOR</b></span><small className="block text-[9px] font-semibold tracking-[.17em] text-slate-400">YOUR DIGITAL PARTNER</small></span></Link>
   <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-300 md:flex"><Link href={`/${locale}#services`} className="hover:text-[#00D6C9]">{ar?"الخدمات":"Services"}</Link><Link href={`/${locale}#how`} className="hover:text-[#00D6C9]">{ar?"كيفاش كنخدمو":"How it works"}</Link></nav>
   <div className="flex shrink-0 items-center gap-2"><div className="flex rounded-lg border border-white/10 bg-white/5 p-1 text-[10px] sm:text-xs">{["ar","en","fr"].map(code=><Link key={code} href={`/${code}`} className={`rounded-md px-2 py-1.5 ${locale===code?"bg-[#168BFF] text-white":"text-slate-400"}`}>{code.toUpperCase()}</Link>)}</div><Link href={`/${locale}#services`} className="hidden rounded-lg bg-[#168BFF] px-3 py-2.5 text-xs font-bold text-white sm:block">{ar?"تسوق الآن":"Explore"}</Link></div>
  </div></header>
  <main className="flex-1">{children}</main>
  <footer className="border-t border-white/10 bg-[#070e19]"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8"><p className="font-black tracking-widest text-white">MOMIA <span className="text-[#168BFF]">STOR</span></p><p>© {new Date().getFullYear()} MOMIA STOR. {ar?"جميع الحقوق محفوظة.":"All rights reserved."}</p></div></footer>
 </>;
}

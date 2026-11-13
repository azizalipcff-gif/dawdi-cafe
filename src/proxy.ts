import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { ADMIN_PATH } from "@/lib/constants";
const LOCALE_PREFIXES: Locale[] = ["en", "fr", "ar"];
function getCookieLocale(request: NextRequest): Locale {
  const value=request.cookies.get(LOCALE_COOKIE)?.value;
  return isLocale(value)?value:defaultLocale;
}
export async function proxy(request: NextRequest) {
  const {pathname}=request.nextUrl;
  if(pathname.startsWith("/momia-admin")) {
    const target=request.nextUrl.clone();
    target.pathname=pathname.replace(/^\/momia-admin/,"/dawdi-admin-7K9X");
    return NextResponse.rewrite(target);
  }
  if(pathname.startsWith(ADMIN_PATH)||pathname.startsWith("/api")) return NextResponse.next({request});
  const hasLocale=LOCALE_PREFIXES.some(p=>pathname===`/${p}`||pathname.startsWith(`/${p}/`));
  if(hasLocale) {
    const parts=pathname.split("/").filter(Boolean);
    const locale=parts[0] as Locale;
    if(parts.length>1) {
      const target=request.nextUrl.clone();
      target.pathname=`/${locale}`;
      return NextResponse.redirect(target,307);
    }
    const cookieLocale=getCookieLocale(request);
    if(locale!==cookieLocale) {
      const response=NextResponse.next({request});
      response.cookies.set(LOCALE_COOKIE,locale,{path:"/",sameSite:"lax",maxAge:60*60*24*365});
      return response;
    }
    return NextResponse.next({request});
  }
  const locale=getCookieLocale(request);
  const target=request.nextUrl.clone();
  target.pathname=`/${locale}`;
  return NextResponse.redirect(target,307);
}
export const config={matcher:["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json|webmanifest|woff2?)$).*)"]};

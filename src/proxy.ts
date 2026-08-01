import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { ADMIN_PATH, ADMIN_LOGIN_PATH } from "@/lib/constants";
import { verifySession, SESSION_COOKIE } from "@/lib/session";

// The login page is the only admin route that does not require a session.
const PUBLIC_ADMIN_PATHS = [ADMIN_LOGIN_PATH];

const LOCALE_PREFIXES: Locale[] = ["en", "fr", "ar"];

function getCookieLocale(request: NextRequest): Locale {
  const value = request.cookies.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public site — locale routing. The URL locale is the source of truth; it
  // is kept in sync with the locale cookie so server components (root layout)
  // and server actions resolve the same language. Paths without a locale
  // prefix are redirected to the cookie-preferred (or default) locale.
  if (!pathname.startsWith(ADMIN_PATH) && !pathname.startsWith("/api")) {
    const hasLocalePrefix = LOCALE_PREFIXES.some(
      (p) => pathname === `/${p}` || pathname.startsWith(`/${p}/`)
    );

    if (hasLocalePrefix) {
      const urlLocale = pathname.split("/")[1] as Locale;
      const cookieLocale = getCookieLocale(request);
      if (urlLocale !== cookieLocale) {
        const response = NextResponse.next({ request });
        response.cookies.set(LOCALE_COOKIE, urlLocale, {
          path: "/",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365,
        });
        return response;
      }
      return NextResponse.next({ request });
    }

    const cookieLocale = getCookieLocale(request);
    const target = new URL(
      `/${cookieLocale}${pathname === "/" ? "" : pathname}${request.nextUrl.search}`,
      request.url
    );
    return NextResponse.redirect(target, 307);
  }

  // Routes under the admin path require a valid signed session cookie.
  const isPublicPath = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (isPublicPath) {
    return NextResponse.next({ request });
  }

  const sessionEmail = verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!sessionEmail) {
    const redirectUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next({ request });
}

export const config = {
  // Every route is visited so the public site gets locale redirects and the
  // locale cookie stays in sync. Static assets, API routes and metadata files
  // are excluded.
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json|webmanifest|woff2?)$).*)",
  ],
};

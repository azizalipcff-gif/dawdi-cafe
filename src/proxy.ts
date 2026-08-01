import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { ADMIN_PATH, ADMIN_LOGIN_PATH, ADMIN_RESET_PATH } from "@/lib/constants";

// Routes under the admin path that do NOT require a session. The login and
// reset-password pages must never be wrapped by the protected admin layout,
// otherwise an unauthenticated visitor gets an infinite redirect loop.
const PUBLIC_ADMIN_PATHS = [ADMIN_LOGIN_PATH, ADMIN_RESET_PATH];

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

  // Routes under the admin path require a session — the public website stays open.
  const isPublicPath = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without a configured Supabase project the middleware cannot verify a
  // session. Fail open here so the rest of the site still renders; the admin
  // layout performs its own verification and will reject unauthenticated
  // admins before any data is served.
  if (!url || !anonKey) {
    return NextResponse.next({ request });
  }

  const remember =
    request.cookies.get("dawdi_admin_remember")?.value !== "0";

  const supabase = createServerClient(url, anonKey, {
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        const response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          const opts = remember || !value ? options : (() => {
            const rest = options ? { ...options } : {};
            delete rest.maxAge;
            return rest;
          })();
          response.cookies.set(name, value, opts);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = Boolean(user);

  // Public auth pages are always reachable — including for logged-in users.
  // Bouncing a logged-in non-admin from the login page to the dashboard (and
  // back) is exactly what caused the previous redirect loop. The login page
  // itself redirects authenticated admins to the dashboard.
  if (isPublicPath) {
    return NextResponse.next({ request });
  }

  if (!isLoggedIn) {
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

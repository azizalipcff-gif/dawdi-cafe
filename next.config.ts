import type { NextConfig } from "next";

// React's development runtime (Turbopack dev overlay / Fast Refresh) relies on
// eval(); without it the browser console repeatedly logs
// "eval() is not supported in this environment". This is a dev-only concern —
// production React is compiled and never needs eval(), so the production CSP
// stays strict and must never include 'unsafe-eval'.
const isDevelopment = process.env.NODE_ENV !== "production";

const scriptSrc = isDevelopment
  ? "'self' 'unsafe-inline' 'unsafe-eval'"
  : "'self' 'unsafe-inline'";

const ContentSecurityPolicy = [
  "default-src 'self'",
  // Next.js app-router uses module scripts; allow inline (Next dev overlay /
  // third-party embeds) but never allow eval in production.
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Supabase Storage images plus data/blob URIs used by the image optimizer.
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self' data: https://fonts.gstatic.com",
  // Supabase Auth + Realtime (https + wss), same-origin for everything else.
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  // Google Maps embed only.
  "frame-src https://maps.google.com https://www.google.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 375, 425, 640, 768, 1024, 1440],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
    // In some local/dev environments (container or VPN DNS) Supabase's host
    // resolves to a NAT64 address (64:ff9b::/96) which Next's image optimizer
    // classifies as a private IP and refuses to fetch, breaking every Storage
    // image. That is a dev-network artifact only — in production Supabase
    // resolves to a normal public IP, so this stays off there to avoid any
    // SSRF-to-local-IP surface. Hence it is enabled strictly in development.
    dangerouslyAllowLocalIP: isDevelopment,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: ContentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;

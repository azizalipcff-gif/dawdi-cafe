import type { NextConfig } from "next";

const ContentSecurityPolicy = [
  "default-src 'self'",
  // Next.js app-router uses module scripts; allow inline (Next dev overlay /
  // third-party embeds) but never allow eval.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // Supabase Storage images plus data/blob URIs used by the image optimizer.
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self' data:",
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

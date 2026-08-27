// Distributed, serverless-safe rate limiting for DAWDI CAFE.
//
// Backend: Upstash Redis via @upstash/ratelimit (works across serverless
// instances — no in-memory Map). It must be configured with:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
//
// Failure strategy (fail-open, never crash, never bypass auth/RLS):
//   - If the env vars are missing, the limiter is a no-op (allows). This keeps
//     local/dev and unconfigured deployments working without crashing.
//   - If a limiter call throws (Redis unreachable/timeout), we also allow and
//     log a generic warning WITHOUT any Redis details or customer data.
// Authorization (requireAdmin / RLS) is independent and always enforced by the
// calling action — rate limiting never replaces it.

import "server-only";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";

// ---------------------------------------------------------------------------
// Redis client (lazy, cached)
// ---------------------------------------------------------------------------
let redis: Redis | null | undefined;
let unconfiguredWarned = false;

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (!unconfiguredWarned) {
      unconfiguredWarned = true;
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set — rate limiting is disabled (fail-open)."
      );
    }
    redis = null;
    return null;
  }
  redis = new Redis({ url, token });
  return redis;
}

// Cache one Ratelimit instance per (name, tokens, window) so we don't rebuild.
const limiterCache = new Map<string, Ratelimit>();

function getLimiter(name: string, tokens: number, windowSeconds: number): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  const cacheKey = `${name}:${tokens}:${windowSeconds}`;
  let limiter = limiterCache.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: r,
      // Sliding window gives smoother enforcement than a raw fixed window.
      limiter: Ratelimit.slidingWindow(tokens, `${windowSeconds} s`),
      prefix: `dawdi_rl:${name}`,
      analytics: false,
      // Don't hang the request if Redis is slow; fail fast and open.
      timeout: 1000,
    });
    limiterCache.set(cacheKey, limiter);
  }
  return limiter;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  // Epoch ms when the current window resets (0 when not enforced).
  reset: number;
}

let backendErrorWarned = false;

// Core check. `identifier` isolates the bucket (IP for public, admin id for
// admin mutations). Always resolves to RateLimitResult; on any problem it
// allows the request (fail-open).
export async function checkRateLimit(
  name: string,
  identifier: string,
  tokens: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const limiter = getLimiter(name, tokens, windowSeconds);
  if (!limiter) {
    return { success: true, remaining: tokens, reset: 0 };
  }
  try {
    const res = await limiter.limit(identifier);
    return { success: res.success, remaining: res.remaining, reset: res.reset };
  } catch {
    if (!backendErrorWarned) {
      backendErrorWarned = true;
      console.warn("[rate-limit] upstream error — allowing request (fail-open).");
    }
    return { success: true, remaining: tokens, reset: 0 };
  }
}

// ---------------------------------------------------------------------------
// Client IP extraction
// ---------------------------------------------------------------------------
// We trust ONLY headers that the trusted reverse proxy (Vercel / Cloudflare /
// Nginx real_ip) overwrites from the real TCP peer. A client-supplied
// X-Forwarded-For is therefore discarded, preventing IP spoofing:
//   - x-real-ip: set by Nginx/Vercel from $remote_addr (single, authoritative).
//   - cf-connecting-ip: set by Cloudflare (single, authoritative).
//   - x-forwarded-for: Vercel overwrites it with the client IP as the first
//     entry. For an appending proxy the trusted value is rightmost, but in that
//     setup x-real-ip/cf-connecting-ip are also present and already used above,
//     so the first entry is safe here.
function normalizeIp(raw: string): string {
  let ip = raw.trim();
  // Strip IPv4-mapped IPv6 prefix.
  if (ip.startsWith("::ffff:")) ip = ip.slice(7);
  // Basic sanity cap to avoid absurd header values poisoning the key.
  if (ip.length > 64 || ip.length === 0) return "unknown";
  return ip;
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const realIp = h.get("x-real-ip");
  if (realIp) return normalizeIp(realIp.split(",")[0]);
  const cf = h.get("cf-connecting-ip");
  if (cf) return normalizeIp(cf);
  const xff = h.get("x-forwarded-for");
  if (xff) return normalizeIp(xff.split(",")[0]);
  return "unknown";
}

// ---------------------------------------------------------------------------
// Operation-specific helpers (limits per the security spec)
// ---------------------------------------------------------------------------

// Public reservation submission: 5 / 10 min / IP.
export async function rateLimitPublic(
  ip: string,
  bucket: "reservation" | "message" | "order"
): Promise<RateLimitResult> {
  const cfg =
    bucket === "reservation"
      ? { tokens: 5, window: 600 }
      : bucket === "message"
        ? { tokens: 5, window: 600 }
        : { tokens: 10, window: 600 };
  return checkRateLimit(`public:${bucket}`, `ip:${ip}`, cfg.tokens, cfg.window);
}

// Admin login attempts: 10 / 15 min / IP.
export async function rateLimitLogin(ip: string): Promise<RateLimitResult> {
  return checkRateLimit("login", `ip:${ip}`, 10, 900);
}

// Authenticated admin mutations: 60 / min / admin (default). Stricter buckets
// for high-impact operations (uploads, deletes, bulk/reorder).
export async function rateLimitAdmin(
  adminId: string,
  bucket: "mutation" | "upload" | "delete" | "bulk" = "mutation"
): Promise<RateLimitResult> {
  const cfg =
    bucket === "upload"
      ? { tokens: 20, window: 600 } // 20 uploads / 10 min
      : bucket === "delete"
        ? { tokens: 30, window: 60 } // 30 deletes / min
        : bucket === "bulk"
          ? { tokens: 30, window: 60 } // 30 bulk/reorder ops / min
          : { tokens: 60, window: 60 }; // 60 generic mutations / min
  return checkRateLimit(`admin:${bucket}`, `admin:${adminId}`, cfg.tokens, cfg.window);
}

export const RATE_LIMIT_MESSAGE = "Too many requests. Please try again later.";

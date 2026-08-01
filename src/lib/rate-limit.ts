// Simple in-memory rate limiter (per-IP). Used to protect auth endpoints.
// Note: for multi-instance deployments, replace with a DB/Redis-backed limiter.

const attempts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 8;

function getClientIp(): string {
  const headers = globalThis as unknown as { __ip?: string };
  return headers.__ip ?? "unknown";
}

export function rateLimit(key: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const bucket = attempts.get(key);

  if (!bucket || now > bucket.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  bucket.count += 1;
  if (bucket.count > MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((bucket.resetAt - now) / 1000);
    return { ok: false, retryAfterSec };
  }
  return { ok: true };
}

export function clearRateLimit(key: string) {
  attempts.delete(key);
}

// Overridable so proxy.ts can pass the real client IP through a header.
export function setClientIp(ip: string | null | undefined) {
  (globalThis as unknown as { __ip?: string }).__ip = ip ?? "unknown";
}

export { getClientIp };

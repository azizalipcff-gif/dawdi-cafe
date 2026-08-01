// Minimal signed-cookie admin session.
// The token is `base64url(email).expiresAt.signature` where the signature is
// an HMAC-SHA256 of the payload keyed with ADMIN_SESSION_SECRET. No database,
// no JWT library — just a stateless, tamper-proof cookie.
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "dawdi_admin_session";

// "Remember me" = 30 days, otherwise 1 day.
export const SESSION_AGE = 60 * 60 * 24; // 1 day (seconds)
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days (seconds)

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "";
}

function signToken(payload: string): string {
  const key = secret();
  if (!key) return "";
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function createSession(email: string, remember: boolean): string {
  const expiresAt = Date.now() + (remember ? SESSION_MAX_AGE : SESSION_AGE) * 1000;
  const payload = `${Buffer.from(email).toString("base64url")}.${expiresAt}`;
  return `${payload}.${signToken(payload)}`;
}

export function verifySession(token: string | null | undefined): string | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedEmail, expiresAtStr, signature] = parts;
  const payload = `${encodedEmail}.${expiresAtStr}`;
  const expected = signToken(payload);
  if (!expected) return null;

  const received = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (received.length !== wanted.length || !timingSafeEqual(received, wanted)) {
    return null;
  }

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  return Buffer.from(encodedEmail, "base64url").toString("utf8");
}

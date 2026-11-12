import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "wreckon_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function sign(expiresAt: string, secret: string): string {
  return createHmac("sha256", secret).update(expiresAt).digest("hex");
}

export function isAdminConfigured(): boolean {
  return Boolean(import.meta.env.ADMIN_PASSWORD && import.meta.env.SESSION_SECRET);
}

export function checkAdminPassword(password: string): boolean {
  const expected = import.meta.env.ADMIN_PASSWORD ?? "";
  const secret = import.meta.env.SESSION_SECRET ?? "";
  // Compare fixed-length HMAC digests rather than the raw strings, so a
  // length mismatch never short-circuits the comparison and leaks the real
  // password's length via timing.
  const a = createHmac("sha256", secret).update(password).digest();
  const b = createHmac("sha256", secret).update(expected).digest();
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const secret = import.meta.env.SESSION_SECRET ?? "";
  const expiresAt = String(Date.now() + SESSION_TTL_MS);
  return `${expiresAt}.${sign(expiresAt, secret)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = import.meta.env.SESSION_SECRET;
  if (!secret) return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  if (Date.now() > Number(expiresAt)) return false;

  const expectedSig = sign(expiresAt, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

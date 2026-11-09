const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// No Turnstile secret configured yet → skip verification entirely rather than
// rejecting every submission because a spam-protection service was never set up.
export async function verifyTurnstile(token: string | null, remoteIp: string | null): Promise<boolean> {
  const secretKey = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret: secretKey, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch(VERIFY_URL, { method: "POST", body });
  if (!res.ok) return false;

  const data = (await res.json()) as { success: boolean };
  return data.success;
}

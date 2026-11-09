import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = import.meta.env.UPSTASH_REDIS_REST_URL;
const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit =
  url && token
    ? new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(5, "10 m"),
        prefix: "wreckon:enquiry",
      })
    : null;

// No Upstash account configured yet → always allow, rather than blocking real
// customers because a rate limiter was never set up.
export async function checkRateLimit(identifier: string): Promise<boolean> {
  if (!ratelimit) return true;
  const { success } = await ratelimit.limit(identifier);
  return success;
}

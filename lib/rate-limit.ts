/**
 * Minimal in-memory fixed-window rate limiter. Adequate for a low-CCU,
 * single-instance deployment. For multi-instance / serverless scale, swap the
 * Map for Upstash Redis or Vercel KV (same interface).
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Returns true if the action is allowed, false if the limit is exceeded.
 * @param key    unique identifier (e.g. `login:1.2.3.4`)
 * @param limit  max actions allowed within the window
 * @param windowMs window size in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (existing.count >= limit) return false;
  existing.count += 1;
  return true;
}

/**
 * Best-effort, per-instance fixed-window limiter. Suitable for protecting the
 * cached rate endpoint; use a shared store (e.g. Upstash Redis) for strict limits.
 */
const buckets = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string, { limit, windowMs }: { limit: number; windowMs: number }) {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k)
    }
    return { allowed: true, retryAfterSeconds: 0 }
  }

  bucket.count += 1
  return {
    allowed: bucket.count <= limit,
    retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
  }
}

import { NextResponse, type NextRequest } from 'next/server'
import { getGoldRates } from '@/lib/rates/service'
import { checkRateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous'
  const limit = checkRateLimit(`gold-rates:${ip}`, { limit: 30, windowMs: 60_000 })

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  const result = await getGoldRates()
  const cacheControl =
    result.status === 'unavailable'
      ? 'no-store'
      : 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'

  return NextResponse.json(result, {
    status: result.status === 'unavailable' ? 503 : 200,
    headers: { 'Cache-Control': cacheControl },
  })
}

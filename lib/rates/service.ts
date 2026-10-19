import 'server-only'
import { getDevelopmentFixture } from './providers/fixture'
import { goldApiProvider } from './providers/goldapi'
import type { GoldRateResponse, GoldRateSnapshot, RateProvider } from './types'

const providers: Record<string, RateProvider> = {
  [goldApiProvider.id]: goldApiProvider,
}

function numberEnv(name: string, fallback: number): number {
  const value = Number(process.env[name])
  return Number.isFinite(value) && value > 0 ? value : fallback
}

export function getRateSettings() {
  return {
    /** How long the upstream response is cached. GoldAPI free plan allows ~100 requests/month. */
    cacheSeconds: numberEnv('GOLD_RATE_CACHE_SECONDS', 8 * 60 * 60),
    /** Source prices older than this are labelled stale. */
    staleAfterMinutes: numberEnv('GOLD_RATE_STALE_AFTER_MINUTES', 12 * 60),
    /** Calculations are disabled once the source price is older than this. Covers weekend market closures. */
    maxAgeMinutes: numberEnv('GOLD_RATE_MAX_AGE_MINUTES', 72 * 60),
    timeoutMs: numberEnv('GOLD_RATE_TIMEOUT_MS', 8000),
  }
}

let lastGoodSnapshot: GoldRateSnapshot | null = null

export function evaluateFreshness(
  snapshot: GoldRateSnapshot,
  now: Date,
  settings: { staleAfterMinutes: number; maxAgeMinutes: number },
) {
  const ageMinutes = Math.max(0, Math.floor((now.getTime() - new Date(snapshot.sourceTimestamp).getTime()) / 60000))
  return {
    ageMinutes,
    isStale: ageMinutes > settings.staleAfterMinutes,
    calculationsAllowed: ageMinutes <= settings.maxAgeMinutes,
  }
}

function build(
  snapshot: GoldRateSnapshot,
  now: Date,
  settings: ReturnType<typeof getRateSettings>,
  servedFromFallback: boolean,
): GoldRateResponse {
  const freshness = evaluateFreshness(snapshot, now, settings)
  const status = servedFromFallback || freshness.isStale ? 'stale' : 'ok'
  let message: string | null = null
  if (servedFromFallback) message = 'Showing the last successfully retrieved rate because the rate source is currently unreachable.'
  else if (freshness.isStale) message = 'The rate source has not published a newer price recently. Markets may be closed.'
  if (!freshness.calculationsAllowed) message = 'The latest available rate is too old to calculate a reliable estimate.'

  return {
    status,
    data: snapshot,
    ageMinutes: freshness.ageMinutes,
    calculationsAllowed: freshness.calculationsAllowed,
    servedFromFallback,
    message,
    checkedAt: now.toISOString(),
  }
}

function unavailable(message: string): GoldRateResponse {
  return {
    status: 'unavailable',
    data: null,
    ageMinutes: null,
    calculationsAllowed: false,
    servedFromFallback: false,
    message,
    checkedAt: new Date().toISOString(),
  }
}

export async function getGoldRates(): Promise<GoldRateResponse> {
  const settings = getRateSettings()
  const apiKey = process.env.GOLD_RATE_API_KEY?.trim()
  const providerId = process.env.GOLD_RATE_PROVIDER?.trim() || 'goldapi'
  const provider = providers[providerId]

  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      return build(getDevelopmentFixture(), new Date(), settings, false)
    }
    return unavailable('Gold rates are not configured yet. Please contact us for the current rate.')
  }

  if (!provider) {
    console.error(`[gold-rates] Unknown GOLD_RATE_PROVIDER "${providerId}"`)
    return unavailable('Gold rates are temporarily unavailable.')
  }

  try {
    const snapshot = await provider.fetchRates({
      apiKey,
      revalidateSeconds: settings.cacheSeconds,
      timeoutMs: settings.timeoutMs,
    })
    lastGoodSnapshot = snapshot
    return build(snapshot, new Date(), settings, false)
  } catch (error) {
    console.error('[gold-rates] Provider request failed:', error instanceof Error ? error.message : 'unknown error')
    if (lastGoodSnapshot) return build(lastGoodSnapshot, new Date(), settings, true)
    return unavailable('Gold rates are temporarily unavailable. Please try again shortly.')
  }
}

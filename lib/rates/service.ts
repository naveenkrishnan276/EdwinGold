import 'server-only'
import { getDevelopmentFixture } from './providers/fixture'
import { goldApiProvider } from './providers/goldapi'
import { getChennaiRateSnapshot } from './store'
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
    /** How long upstream/cached responses are kept. */
    cacheSeconds: numberEnv('GOLD_RATE_CACHE_SECONDS', 60),
    /** Source prices older than this are labelled stale (36 hours accommodates once-a-day morning updates). */
    staleAfterMinutes: numberEnv('GOLD_RATE_STALE_AFTER_MINUTES', 36 * 60),
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
  else if (freshness.isStale) message = 'Today’s updated rate has not been entered yet. Markets may still be opening.'
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
  const providerId = process.env.GOLD_RATE_PROVIDER?.trim() || 'chennai'

  // Default: Use Chennai Daily Rate store (updated once a day by owner/admin)
  if (providerId === 'chennai' || !process.env.GOLD_RATE_API_KEY) {
    const chennaiSnapshot = await getChennaiRateSnapshot()
    return build(chennaiSnapshot, new Date(), settings, false)
  }

  const provider = providers[providerId]
  const apiKey = process.env.GOLD_RATE_API_KEY?.trim()

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

import { z } from 'zod'
import type { GoldRateSnapshot, Purity, RateProvider } from '../types'

/**
 * GoldAPI.io — https://www.goldapi.io
 * GET https://www.goldapi.io/api/XAU/INR with header `x-access-token`.
 *
 * Returns the international XAU spot price converted to INR. It does NOT include
 * Indian import duty, GST or local Chennai retail premiums, so it is labelled as an
 * international spot benchmark, never as a Chennai retail or EDWIN GOLD buying rate.
 */
const positive = z.coerce.number().finite().positive()

const goldApiSchema = z
  .object({
    timestamp: z.coerce.number().int().positive(),
    metal: z.literal('XAU'),
    currency: z.literal('INR'),
    price: positive,
    price_gram_24k: positive.optional(),
    price_gram_22k: positive.optional(),
    price_gram_18k: positive.optional(),
    price_gram_14k: positive.optional(),
    melt_price_per_gram: z
      .object({
        '24k': positive.optional(),
        '22k': positive.optional(),
        '18k': positive.optional(),
        '14k': positive.optional(),
      })
      .partial()
      .optional(),
  })
  .passthrough()

export function normalizeGoldApiResponse(raw: unknown): GoldRateSnapshot {
  const parsed = goldApiSchema.parse(raw)
  const melt = parsed.melt_price_per_gram ?? {}

  const candidates: Record<Purity, number | undefined> = {
    '24K': parsed.price_gram_24k ?? melt['24k'],
    '22K': parsed.price_gram_22k ?? melt['22k'],
    '18K': parsed.price_gram_18k ?? melt['18k'],
    '14K': parsed.price_gram_14k ?? melt['14k'],
  }

  const ratesPerGram: Partial<Record<Purity, number>> = {}
  for (const [purity, value] of Object.entries(candidates) as [Purity, number | undefined][]) {
    if (value !== undefined) ratesPerGram[purity] = Math.round(value * 100) / 100
  }

  if (!ratesPerGram['24K'] || !ratesPerGram['22K']) {
    throw new Error('Provider response is missing required 24K/22K per-gram rates')
  }

  return {
    currency: 'INR',
    ratesPerGram,
    provider: 'goldapi',
    providerLabel: 'GoldAPI.io',
    kind: 'international-spot',
    rateDescription:
      'International gold spot price converted to INR. Excludes import duty, GST and local retail premiums. Not a Chennai retail rate or a buying offer.',
    sourceTimestamp: new Date(parsed.timestamp * 1000).toISOString(),
  }
}

export const goldApiProvider: RateProvider = {
  id: 'goldapi',
  label: 'GoldAPI.io',
  async fetchRates({ apiKey, revalidateSeconds, timeoutMs }) {
    const response = await fetch('https://www.goldapi.io/api/XAU/INR', {
      headers: { 'x-access-token': apiKey, Accept: 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
      next: { revalidate: revalidateSeconds, tags: ['gold-rates'] },
    })
    if (!response.ok) {
      throw new Error(`Upstream responded with HTTP ${response.status}`)
    }
    return normalizeGoldApiResponse(await response.json())
  },
}

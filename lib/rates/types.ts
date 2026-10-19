export const PURITIES = ['24K', '22K', '18K', '14K'] as const
export type Purity = (typeof PURITIES)[number]

export const PURITY_FINENESS: Record<Purity, string> = {
  '24K': '99.9% (999)',
  '22K': '91.6% (916)',
  '18K': '75.0% (750)',
  '14K': '58.5% (585)',
}

export type RateKind = 'international-spot' | 'development-fixture'

/** Provider-independent, normalized gold rate snapshot. */
export interface GoldRateSnapshot {
  currency: 'INR'
  /** INR per gram. Only purities the provider actually returns are present. */
  ratesPerGram: Partial<Record<Purity, number>>
  provider: string
  providerLabel: string
  kind: RateKind
  /** Human-readable description of what the rate represents. */
  rateDescription: string
  /** ISO timestamp published by the source for this price. */
  sourceTimestamp: string
}

export type RateStatus = 'ok' | 'stale' | 'unavailable'

export interface GoldRateResponse {
  status: RateStatus
  data: GoldRateSnapshot | null
  /** Age of the source price in minutes, when known. */
  ageMinutes: number | null
  /** False when data is missing or older than the configured freshness limit. */
  calculationsAllowed: boolean
  /** True when the upstream request failed and the last good snapshot is served. */
  servedFromFallback: boolean
  message: string | null
  checkedAt: string
}

export interface RateProvider {
  id: string
  label: string
  fetchRates(options: { apiKey: string; revalidateSeconds: number; timeoutMs: number }): Promise<GoldRateSnapshot>
}

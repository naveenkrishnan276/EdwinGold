import type { GoldRateSnapshot } from '../types'

/**
 * DEVELOPMENT FIXTURE — NOT MARKET DATA.
 * Used only when NODE_ENV !== 'production' and no GOLD_RATE_API_KEY is configured,
 * so the calculator can be exercised locally. The UI labels it prominently as sample data.
 */
export function getDevelopmentFixture(): GoldRateSnapshot {
  return {
    currency: 'INR',
    ratesPerGram: { '24K': 10000, '22K': 9160, '18K': 7500 },
    provider: 'fixture',
    providerLabel: 'Development sample data',
    kind: 'development-fixture',
    rateDescription:
      'Sample numbers for testing only. These are not real gold rates. Configure GOLD_RATE_API_KEY to load market data.',
    sourceTimestamp: new Date().toISOString(),
  }
}

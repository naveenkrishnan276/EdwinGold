'use client'

import { RefreshCw } from 'lucide-react'
import type { GoldRateResponse, Purity } from '@/lib/rates/types'
import { PURITIES, PURITY_FINENESS } from '@/lib/rates/types'
import { formatINR } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useGoldRates } from './use-gold-rates'
import { RateMeta, RateNotice } from './rate-status'

export function RateCards({
  initial,
  tone = 'light',
  showMeta = true,
}: {
  initial: GoldRateResponse
  tone?: 'light' | 'dark'
  showMeta?: boolean
}) {
  const { data: response = initial, isValidating, mutate } = useGoldRates(initial)
  const rates = response.data?.ratesPerGram ?? {}
  const available = PURITIES.filter((p): p is Purity => typeof rates[p] === 'number')
  const dark = tone === 'dark'

  return (
    <div className="flex flex-col gap-4">
      <RateNotice response={response} />

      {available.length > 0 && (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Gold rates per gram">
          {available.map((purity, i) => (
            <li
              key={purity}
              className={cn(
                'relative overflow-hidden rounded-xl border p-4 sm:p-5',
                dark ? 'border-gold/25 bg-forest-deep/60' : 'border-border bg-card shadow-sm',
              )}
            >
              {i === 1 && (
                <span
                  className={cn(
                    'absolute right-3 top-3 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider',
                    dark ? 'bg-gold/15 text-gold' : 'bg-accent text-gold-ink',
                  )}
                >
                  JEWELLERY
                </span>
              )}
              <p className={cn('text-xs font-semibold tracking-[0.18em]', dark ? 'text-gold' : 'text-gold-ink')}>
                {purity} GOLD
              </p>
              <p
                className={cn(
                  'mt-2 text-2xl font-bold tabular-nums tracking-tight sm:text-[1.75rem]',
                  dark ? 'text-ivory' : 'text-forest',
                )}
              >
                {formatINR(rates[purity] as number)}
                <span className={cn('ml-1 text-sm font-medium', dark ? 'text-ivory/65' : 'text-muted-foreground')}>
                  / g
                </span>
              </p>
              <p className={cn('mt-1 text-xs', dark ? 'text-ivory/65' : 'text-muted-foreground')}>
                Fineness {PURITY_FINENESS[purity]}
              </p>
            </li>
          ))}
        </ul>
      )}

      {showMeta && response.data && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <RateMeta response={response} tone={tone} />
          <button
            type="button"
            onClick={() => mutate()}
            disabled={isValidating}
            className={cn(
              'inline-flex min-h-10 items-center gap-2 self-start rounded-full px-3 text-xs font-semibold transition-colors disabled:opacity-60',
              dark ? 'text-gold hover:bg-ivory/5' : 'text-forest hover:bg-forest/5',
            )}
          >
            <RefreshCw className={cn('size-3.5', isValidating && 'animate-spin')} aria-hidden="true" />
            {isValidating ? 'Refreshing…' : 'Refresh rate'}
          </button>
        </div>
      )}
    </div>
  )
}

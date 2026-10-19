'use client'

import useSWR from 'swr'
import type { GoldRateResponse } from '@/lib/rates/types'

async function fetchRates(url: string): Promise<GoldRateResponse> {
  const res = await fetch(url)
  // 503 still carries a well-formed "unavailable" payload.
  if (res.ok || res.status === 503) return res.json()
  throw new Error(`Rate request failed (${res.status})`)
}

export function useGoldRates(initial: GoldRateResponse) {
  return useSWR<GoldRateResponse>('/api/gold-rates', fetchRates, {
    fallbackData: initial,
    revalidateOnMount: false,
    refreshInterval: 5 * 60_000,
    revalidateOnFocus: true,
    dedupingInterval: 60_000,
  })
}

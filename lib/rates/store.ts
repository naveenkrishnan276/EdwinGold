import 'server-only'
import { kvGet, kvGetSync, kvSet } from '@/lib/storage/serverless-kv'
import type { GoldRateSnapshot, Purity } from './types'

export interface ChennaiRatesData {
  rates: Partial<Record<Purity, number>>
  updatedAt: string
  note?: string
}

const DEFAULT_RATES: ChennaiRatesData = {
  rates: {
    '24K': 13888,
    '22K': 12731,
    '18K': 10416,
  },
  updatedAt: new Date().toISOString(),
  note: 'Chennai Daily Gold Rate (MJDMA / Market Benchmark)',
}

export function getChennaiRates(): ChennaiRatesData {
  return kvGetSync<ChennaiRatesData>('rates', DEFAULT_RATES)
}

export async function getChennaiRatesAsync(): Promise<ChennaiRatesData> {
  return await kvGet<ChennaiRatesData>('rates', DEFAULT_RATES)
}

export async function saveChennaiRates(newRates: {
  '24K': number
  '22K': number
  '18K'?: number
  note?: string
}): Promise<ChennaiRatesData> {
  const updatedData: ChennaiRatesData = {
    rates: {
      '24K': Math.round(newRates['24K'] * 100) / 100,
      '22K': Math.round(newRates['22K'] * 100) / 100,
      '18K': newRates['18K'] ? Math.round(newRates['18K'] * 100) / 100 : Math.round(newRates['24K'] * 0.75 * 100) / 100,
    },
    updatedAt: new Date().toISOString(),
    note: newRates.note?.trim() || 'Chennai Daily Gold Rate (MJDMA / Market Benchmark)',
  }

  await kvSet<ChennaiRatesData>('rates', updatedData)
  return updatedData
}

export function getChennaiRateSnapshot(): GoldRateSnapshot {
  const data = getChennaiRates()

  return {
    currency: 'INR',
    ratesPerGram: data.rates,
    provider: 'chennai-manual',
    providerLabel: 'Chennai Daily Market Rate',
    kind: 'chennai-daily',
    rateDescription: data.note || 'Official Chennai daily rate benchmark. Final offer confirmed upon in-store testing.',
    sourceTimestamp: data.updatedAt,
  }
}

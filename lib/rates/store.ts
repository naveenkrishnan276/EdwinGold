import 'server-only'
import { createAdminClient, createClient } from '@/lib/supabase/server'
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
  return DEFAULT_RATES
}

export async function getChennaiRatesAsync(): Promise<ChennaiRatesData> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'rates').maybeSingle()
  if (error) throw new Error(`Unable to read rates: ${error.message}`)
  return (data?.value as ChennaiRatesData | null) ?? DEFAULT_RATES
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

  const supabase = createAdminClient()
  const { error } = await supabase.from('site_settings').upsert({ key: 'rates', value: updatedData, updated_at: updatedData.updatedAt })
  if (error) throw new Error(`Unable to save rates: ${error.message}`)
  return updatedData
}

export async function getChennaiRateSnapshot(): Promise<GoldRateSnapshot> {
  const data = await getChennaiRatesAsync()

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

import fs from 'node:fs'
import path from 'node:path'
import type { GoldRateSnapshot, Purity } from './types'

export interface ChennaiRatesData {
  rates: Partial<Record<Purity, number>>
  updatedAt: string
  note?: string
}

const DEFAULT_RATES: ChennaiRatesData = {
  rates: {
    '24K': 8950,
    '22K': 8204,
    '18K': 6712,
  },
  updatedAt: new Date().toISOString(),
  note: 'Chennai Daily Gold Rate (MJDMA / Market Benchmark)',
}

let memoryCache: ChennaiRatesData | null = null

function getFilePath(): string {
  return path.join(process.cwd(), 'data', 'rates.json')
}

export function getChennaiRates(): ChennaiRatesData {
  if (memoryCache) {
    return memoryCache
  }

  const filePath = getFilePath()
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(content) as ChennaiRatesData
      if (parsed.rates && typeof parsed.rates['24K'] === 'number') {
        memoryCache = parsed
        return parsed
      }
    }
  } catch (error) {
    console.warn('[rates-store] Failed to read rates.json, using defaults:', error)
  }

  memoryCache = DEFAULT_RATES
  return DEFAULT_RATES
}

export function saveChennaiRates(newRates: {
  '24K': number
  '22K': number
  '18K'?: number
  note?: string
}): ChennaiRatesData {
  const updatedData: ChennaiRatesData = {
    rates: {
      '24K': Math.round(newRates['24K'] * 100) / 100,
      '22K': Math.round(newRates['22K'] * 100) / 100,
      '18K': newRates['18K'] ? Math.round(newRates['18K'] * 100) / 100 : Math.round(newRates['24K'] * 0.75 * 100) / 100,
    },
    updatedAt: new Date().toISOString(),
    note: newRates.note?.trim() || 'Chennai Daily Gold Rate (MJDMA / Market Benchmark)',
  }

  memoryCache = updatedData

  const filePath = getFilePath()
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf-8')
  } catch (error) {
    console.error('[rates-store] Could not persist rates to disk (read-only environment?):', error)
  }

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


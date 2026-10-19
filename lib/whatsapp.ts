import { formatDateTime, formatGrams, formatINR } from './format'
import type { Purity } from './rates/types'

export function normalizeWhatsAppNumber(number: string | null | undefined): string | null {
  if (!number) return null
  const digits = number.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15 ? digits : null
}

export function buildWhatsAppUrl(number: string | null | undefined, message: string): string | null {
  const digits = normalizeWhatsAppNumber(number)
  if (!digits) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export type WhatsAppTemplate = 'general' | 'rate' | 'directions'

export const whatsappTemplates: Record<WhatsAppTemplate, string> = {
  general: 'Hello EDWIN GOLD, I would like to enquire about selling my gold.',
  rate: 'Hello EDWIN GOLD, could you please share today’s gold buying rate?',
  directions: 'Hello EDWIN GOLD, I would like to visit your store in Ambattur. Could you share directions and timings?',
}

export interface CalculatorMessageInput {
  purity: Purity
  grossWeightGrams: number
  netWeightGrams: number
  indicativeValue: number
  ratePerGram: number
  rateTimestamp: string
  rateSource: string
}

export function buildCalculatorMessage(input: CalculatorMessageInput): string {
  return [
    'Hello EDWIN GOLD, I used the gold value estimator on your website.',
    '',
    `Purity: ${input.purity}`,
    `Gross weight: ${formatGrams(input.grossWeightGrams)}`,
    `Estimated net gold weight: ${formatGrams(input.netWeightGrams)}`,
    `Displayed rate: ${formatINR(input.ratePerGram)} per gram (${input.rateSource})`,
    `Rate timestamp: ${formatDateTime(input.rateTimestamp)}`,
    `Indicative value: ${formatINR(input.indicativeValue)}`,
    '',
    'I understand this is a provisional online estimate and the final offer depends on physical purity testing and verified net weight.',
  ].join('\n')
}

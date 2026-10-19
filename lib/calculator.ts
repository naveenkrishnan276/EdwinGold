import { z } from 'zod'
import { valuationConfig } from './site-config'
import { PURITIES } from './rates/types'

const MAX = valuationConfig.maxWeightGrams
const DECIMALS = valuationConfig.weightDecimals

const decimalPattern = new RegExp(`^\\d+(\\.\\d{1,${DECIMALS}})?$`)

const weightField = (label: string, { optional }: { optional: boolean }) =>
  z
    .string()
    .trim()
    .refine((v) => (optional ? true : v.length > 0), `Enter the ${label}.`)
    .refine((v) => v.length === 0 || decimalPattern.test(v), `Enter the ${label} as a number with up to ${DECIMALS} decimals.`)
    .refine((v) => v.length === 0 || Number(v) <= MAX, `The ${label} cannot exceed ${MAX} g.`)

export const calculatorSchema = z
  .object({
    purity: z.enum(PURITIES, { message: 'Select a gold purity.' }),
    grossWeight: weightField('gross weight', { optional: false }).refine(
      (v) => v.length === 0 || Number(v) > 0,
      'The gross weight must be greater than 0 g.',
    ),
    nonGoldWeight: weightField('non-gold weight', { optional: true }),
  })
  .superRefine((values, ctx) => {
    const gross = Number(values.grossWeight)
    const nonGold = values.nonGoldWeight ? Number(values.nonGoldWeight) : 0
    if (Number.isFinite(gross) && gross > 0 && nonGold >= gross) {
      ctx.addIssue({
        code: 'custom',
        path: ['nonGoldWeight'],
        message: 'Non-gold weight must be less than the gross weight.',
      })
    }
  })

export type CalculatorValues = z.input<typeof calculatorSchema>

export interface EstimateInput {
  grossWeightGrams: number
  nonGoldWeightGrams?: number
  ratePerGram: number
  adjustmentPercent?: number | null
}

export interface EstimateResult {
  grossWeightGrams: number
  nonGoldWeightGrams: number
  netWeightGrams: number
  ratePerGram: number
  grossValue: number
  adjustmentPercent: number | null
  adjustmentAmount: number
  indicativeValue: number
}

/** Integer arithmetic: weights in milligrams, money in paise, percentages in basis points. */
const toMilligrams = (grams: number) => Math.round(grams * 1000)
const toPaise = (rupees: number) => Math.round(rupees * 100)
const fromPaise = (paise: number) => paise / 100

export function calculateEstimate({
  grossWeightGrams,
  nonGoldWeightGrams = 0,
  ratePerGram,
  adjustmentPercent = null,
}: EstimateInput): EstimateResult {
  if (!Number.isFinite(grossWeightGrams) || grossWeightGrams <= 0) throw new Error('Gross weight must be positive')
  if (!Number.isFinite(nonGoldWeightGrams) || nonGoldWeightGrams < 0) throw new Error('Non-gold weight cannot be negative')
  if (!Number.isFinite(ratePerGram) || ratePerGram <= 0) throw new Error('Rate per gram must be positive')
  if (adjustmentPercent !== null && (adjustmentPercent < 0 || adjustmentPercent >= 100)) {
    throw new Error('Adjustment must be between 0 and 100')
  }

  const grossMg = toMilligrams(grossWeightGrams)
  const nonGoldMg = toMilligrams(nonGoldWeightGrams)
  if (nonGoldMg >= grossMg) throw new Error('Non-gold weight must be less than gross weight')

  const netMg = grossMg - nonGoldMg
  const ratePaise = toPaise(ratePerGram)
  const grossValuePaise = Math.round((netMg * ratePaise) / 1000)

  const adjustmentBps = adjustmentPercent === null ? 0 : Math.round(adjustmentPercent * 100)
  const adjustmentPaise = Math.round((grossValuePaise * adjustmentBps) / 10000)

  return {
    grossWeightGrams: grossMg / 1000,
    nonGoldWeightGrams: nonGoldMg / 1000,
    netWeightGrams: netMg / 1000,
    ratePerGram: fromPaise(ratePaise),
    grossValue: fromPaise(grossValuePaise),
    adjustmentPercent,
    adjustmentAmount: fromPaise(adjustmentPaise),
    indicativeValue: fromPaise(grossValuePaise - adjustmentPaise),
  }
}

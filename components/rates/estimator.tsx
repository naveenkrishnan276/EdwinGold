'use client'

import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calculator, MessageCircle, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calculateEstimate, calculatorSchema, type CalculatorValues } from '@/lib/calculator'
import { formatGrams, formatINR } from '@/lib/format'
import { PURITIES, type GoldRateResponse, type Purity } from '@/lib/rates/types'
import { siteConfig, valuationConfig } from '@/lib/site-config'
import { buildCalculatorMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'
import { brandButton } from '@/components/site/button-link'
import { useGoldRates } from './use-gold-rates'
import { RateNotice } from './rate-status'

export function Estimator({ initial }: { initial: GoldRateResponse }) {
  const { data: response = initial } = useGoldRates(initial)
  const rates = response.data?.ratesPerGram ?? {}
  const available = PURITIES.filter((p): p is Purity => typeof rates[p] === 'number')
  const disabled = !response.calculationsAllowed || available.length === 0

  const form = useForm<CalculatorValues>({
    resolver: zodResolver(calculatorSchema),
    mode: 'onTouched',
    defaultValues: { purity: available.includes('22K') ? '22K' : available[0], grossWeight: '', nonGoldWeight: '' },
  })
  const { register, handleSubmit, reset, control, formState } = form
  const { errors, isSubmitted } = formState
  const values = useWatch({ control })

  const result = useMemo(() => {
    if (disabled || !isSubmitted) return null
    const parsed = calculatorSchema.safeParse(values)
    if (!parsed.success) return null
    const rate = rates[parsed.data.purity]
    if (typeof rate !== 'number') return null
    return {
      purity: parsed.data.purity,
      ...calculateEstimate({
        grossWeightGrams: Number(parsed.data.grossWeight),
        nonGoldWeightGrams: parsed.data.nonGoldWeight ? Number(parsed.data.nonGoldWeight) : 0,
        ratePerGram: rate,
        adjustmentPercent: valuationConfig.approvedBuyingAdjustmentPercent,
      }),
    }
  }, [values, disabled, isSubmitted, rates])

  const whatsappHref =
    result && response.data
      ? buildWhatsAppUrl(
          siteConfig.contact.whatsapp,
          buildCalculatorMessage({
            purity: result.purity,
            grossWeightGrams: result.grossWeightGrams,
            netWeightGrams: result.netWeightGrams,
            indicativeValue: result.indicativeValue,
            ratePerGram: result.ratePerGram,
            rateTimestamp: response.data.sourceTimestamp,
            rateSource: response.data.providerLabel,
          }),
        )
      : null

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <form
        noValidate
        onSubmit={handleSubmit(() => undefined)}
        className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"
        aria-describedby="estimator-note"
      >
        <RateNotice response={response} />

        <fieldset disabled={disabled} className="flex flex-col gap-5 disabled:opacity-60">
          <div>
            <p id="purity-label" className="text-sm font-semibold text-forest">
              Gold purity
            </p>
            <div role="radiogroup" aria-labelledby="purity-label" className="mt-2 grid grid-cols-3 gap-2">
              {(available.length ? available : (['24K', '22K', '18K'] as Purity[])).map((p) => (
                <label
                  key={p}
                  className="relative flex min-h-12 cursor-pointer items-center justify-center rounded-lg border border-input bg-background text-sm font-semibold text-charcoal transition-colors has-[:checked]:border-forest has-[:checked]:bg-forest has-[:checked]:text-ivory has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-forest"
                >
                  <input type="radio" value={p} className="sr-only" {...register('purity')} />
                  {p}
                </label>
              ))}
            </div>
            {errors.purity && <FieldError id="purity-error">{errors.purity.message}</FieldError>}
          </div>

          <WeightField
            id="grossWeight"
            label="Gross weight"
            hint="Total weight of the item, in grams."
            error={errors.grossWeight?.message}
            {...register('grossWeight')}
          />
          <WeightField
            id="nonGoldWeight"
            label="Non-gold weight (optional)"
            hint="Approximate weight of stones, beads, wax or other parts."
            error={errors.nonGoldWeight?.message}
            {...register('nonGoldWeight')}
          />

          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="submit" className={cn(brandButton({ variant: 'forest', size: 'lg' }), 'flex-1')}>
              <Calculator aria-hidden="true" />
              Estimate value
            </button>
            <button
              type="button"
              onClick={() => reset({ purity: values.purity, grossWeight: '', nonGoldWeight: '' })}
              className={brandButton({ variant: 'outline', size: 'lg' })}
            >
              <RotateCcw aria-hidden="true" />
              Clear
            </button>
          </div>
        </fieldset>
      </form>

      <section
        aria-labelledby="estimate-heading"
        aria-live="polite"
        className="surface-dark flex flex-col rounded-2xl bg-forest p-5 text-ivory sm:p-7"
      >
        <h3 id="estimate-heading" className="text-xs font-semibold tracking-[0.2em] text-gold">
          YOUR INDICATIVE ESTIMATE
        </h3>

        {result ? (
          <>
            <p className="mt-3 text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">
              {formatINR(result.indicativeValue)}
            </p>
            <p className="mt-1 text-sm text-ivory/70">
              {valuationConfig.approvedBuyingAdjustmentPercent === null
                ? 'Market-rate-based value, not a purchase offer'
                : 'Indicative buying value, subject to testing'}
            </p>
            <dl className="mt-6 flex flex-col divide-y divide-gold/15 border-y border-gold/15 text-sm">
              <Row label="Purity" value={result.purity} />
              <Row label="Gross weight" value={formatGrams(result.grossWeightGrams)} />
              <Row label="Non-gold weight" value={formatGrams(result.nonGoldWeightGrams)} />
              <Row label="Estimated net gold weight" value={formatGrams(result.netWeightGrams)} />
              <Row label="Rate used" value={`${formatINR(result.ratePerGram)} / g`} />
              {result.adjustmentPercent !== null && (
                <Row label={`Buying adjustment (${result.adjustmentPercent}%)`} value={`− ${formatINR(result.adjustmentAmount)}`} />
              )}
            </dl>
            <div className="mt-6">
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(brandButton({ variant: 'gold', size: 'lg' }), 'w-full')}
                >
                  <MessageCircle aria-hidden="true" />
                  Share estimate on WhatsApp
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <p className="text-xs text-ivory/65">WhatsApp sharing will be available once the business number is configured.</p>
              )}
            </div>
          </>
        ) : (
          <div className="mt-4 flex flex-1 flex-col justify-center gap-2 py-6">
            <p className="text-4xl font-bold tabular-nums text-ivory/30">₹ —</p>
            <p className="text-sm leading-relaxed text-ivory/70">
              {disabled
                ? 'The estimator is paused until a fresh rate is available.'
                : 'Select a purity, enter the weight and tap “Estimate value”.'}
            </p>
          </div>
        )}

        <p id="estimator-note" className="mt-6 text-xs leading-relaxed text-ivory/65">
          This is a provisional online estimate. The final offer depends on physical purity testing, verified net gold
          weight and the rate at the time of sale.
        </p>
      </section>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-ivory/70">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  )
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-destructive">
      {children}
    </p>
  )
}

function WeightField({
  id,
  label,
  hint,
  error,
  ...props
}: { id: string; label: string; hint: string; error?: string } & React.ComponentProps<'input'>) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-semibold text-forest">
        {label}
      </Label>
      <div className="relative mt-2">
        <Input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.000"
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`}
          className="h-12 bg-background pr-10 text-base tabular-nums"
          {...props}
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
          g
        </span>
      </div>
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
        {hint}
      </p>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  )
}

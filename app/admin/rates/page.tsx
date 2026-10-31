'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, KeyRound, Sparkles, AlertCircle, RefreshCw, Eye } from 'lucide-react'
import { PageHeader } from '@/components/site/page-header'
import { formatINR, formatDateTime } from '@/lib/format'

interface RateData {
  rates: {
    '24K'?: number
    '22K'?: number
    '18K'?: number
  }
  updatedAt: string
  note?: string
}

export default function AdminRatesPage() {
  const [currentData, setCurrentData] = useState<RateData | null>(null)
  const [isDefaultPin, setIsDefaultPin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form states
  const [rate24K, setRate24K] = useState('')
  const [rate22K, setRate22K] = useState('')
  const [rate18K, setRate18K] = useState('')
  const [note, setNote] = useState('Chennai Daily Gold Rate (MJDMA / Market Benchmark)')
  const [pin, setPin] = useState('')

  // Submission feedback
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Fetch current data on mount
  const fetchCurrent = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/rates')
      if (res.ok) {
        const json = await res.json()
        setCurrentData(json.data)
        setIsDefaultPin(json.isDefaultPin)
        if (json.data?.rates) {
          setRate24K(String(json.data.rates['24K'] || ''))
          setRate22K(String(json.data.rates['22K'] || ''))
          setRate18K(String(json.data.rates['18K'] || ''))
          if (json.data.note) setNote(json.data.note)
        }
      }
    } catch (err) {
      console.error('Failed to load current rates:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrent()
  }, [])

  // Auto-calculation helper: given 24K, auto-calc 22K and 18K
  const handleCalculateFrom24K = () => {
    const num24 = parseFloat(rate24K)
    if (!isNaN(num24) && num24 > 0) {
      // 22K is approx 91.6% of 24K (often standard ratio or market retail)
      const calc22 = Math.round(num24 * 0.9167)
      const calc18 = Math.round(num24 * 0.75)
      setRate22K(String(calc22))
      setRate18K(String(calc18))
    }
  }

  // Auto-calculation helper: given 22K, auto-calc 24K and 18K
  const handleCalculateFrom22K = () => {
    const num22 = parseFloat(rate22K)
    if (!isNaN(num22) && num22 > 0) {
      const calc24 = Math.round(num22 / 0.9167)
      const calc18 = Math.round(calc24 * 0.75)
      setRate24K(String(calc24))
      setRate18K(String(calc18))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMessage(null)

    if (!pin.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter the Admin PIN to authorize the rate change.' })
      return
    }

    const n24 = parseFloat(rate24K)
    const n22 = parseFloat(rate22K)
    const n18 = rate18K ? parseFloat(rate18K) : undefined

    if (isNaN(n24) || n24 <= 0 || isNaN(n22) || n22 <= 0) {
      setStatusMessage({ type: 'error', text: 'Please enter valid positive numbers for 24K and 22K rates.' })
      return
    }

    try {
      setSaving(true)
      const res = await fetch('/api/admin/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: pin.trim(),
          rates: {
            '24K': n24,
            '22K': n22,
            '18K': n18,
          },
          note: note.trim(),
        }),
      })

      const result = await res.json()
      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: 'Chennai daily gold rates updated successfully! The live website is now showing today’s rate.',
        })
        setCurrentData(result.data)
        setPin('')
      } else {
        setStatusMessage({ type: 'error', text: result.error || 'Failed to update rates.' })
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'A network error occurred while updating rates.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        breadcrumb={{ label: 'Admin Rates', href: '/admin/rates' }}
        eyebrow="ADMIN PORTAL"
        title="Chennai Daily Gold Rates"
        description="Update today's official Chennai gold rate per gram for EDWIN GOLD."
      />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/gold-rate"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Public Gold Rate Page
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-forest shadow-xs hover:bg-muted transition-colors"
          >
            <Eye className="size-3.5" />
            View Live Website
          </Link>
        </div>

        {/* Current Active Rates Overview */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-ink">Active On Website</p>
              <h2 className="text-lg font-bold text-forest">Current Published Rates</h2>
            </div>
            {currentData?.updatedAt && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/80 px-3 py-1.5 rounded-full">
                <Clock className="size-3.5 text-gold-ink" />
                <span>Last updated: {formatDateTime(currentData.updatedAt)}</span>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">22K Gold (Jewellery)</span>
              <p className="mt-1 text-2xl font-bold tabular-nums text-forest">
                {currentData?.rates['22K'] ? `${formatINR(currentData.rates['22K'])} / g` : '—'}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">24K Pure Gold (999)</span>
              <p className="mt-1 text-2xl font-bold tabular-nums text-forest">
                {currentData?.rates['24K'] ? `${formatINR(currentData.rates['24K'])} / g` : '—'}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">18K Gold (Hallmark)</span>
              <p className="mt-1 text-2xl font-bold tabular-nums text-forest">
                {currentData?.rates['18K'] ? `${formatINR(currentData.rates['18K'])} / g` : '—'}
              </p>
            </div>
          </div>

          {currentData?.note && (
            <p className="mt-4 text-xs text-muted-foreground italic">
              Note: {currentData.note}
            </p>
          )}
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div
            role="alert"
            className={`mb-8 flex items-start gap-3 rounded-xl border p-4 text-sm ${
              statusMessage.type === 'success'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'border-destructive/30 bg-destructive/5 text-destructive'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
            )}
            <div>
              <p className="font-semibold">
                {statusMessage.type === 'success' ? 'Update Successful' : 'Action Required'}
              </p>
              <p className="mt-0.5">{statusMessage.text}</p>
            </div>
          </div>
        )}

        {/* Update Form */}
        <div className="rounded-2xl border border-gold/30 bg-card shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold-ink">
              <Sparkles className="size-3.5" />
              Daily Entry
            </span>
            <h3 className="mt-2 text-xl font-bold text-forest">Set Today's Chennai Gold Rates</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter Chennai's daily per-gram rates (e.g. from MJDMA or your approved buying rates).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* 22K Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="rate22k" className="text-sm font-semibold text-charcoal">
                    22K Gold Rate (₹ / gram) <span className="text-destructive">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleCalculateFrom22K}
                    className="text-xs text-gold-ink hover:underline font-medium"
                    title="Calculate 24K and 18K from this 22K value"
                  >
                    Auto-fill 24K &amp; 18K
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-muted-foreground">₹</span>
                  <input
                    id="rate22k"
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 8200"
                    value={rate22K}
                    onChange={(e) => setRate22K(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-background pl-8 pr-4 text-base font-medium tabular-nums focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Standard 916 jewellery gold benchmark in Chennai.</p>
              </div>

              {/* 24K Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="rate24k" className="text-sm font-semibold text-charcoal">
                    24K Pure Gold Rate (₹ / gram) <span className="text-destructive">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleCalculateFrom24K}
                    className="text-xs text-gold-ink hover:underline font-medium"
                    title="Calculate 22K and 18K from this 24K value"
                  >
                    Auto-fill 22K &amp; 18K
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-muted-foreground">₹</span>
                  <input
                    id="rate24k"
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 8950"
                    value={rate24K}
                    onChange={(e) => setRate24K(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-background pl-8 pr-4 text-base font-medium tabular-nums focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                  />
                </div>
                <p className="text-xs text-muted-foreground">999 pure gold rate benchmark in Chennai.</p>
              </div>
            </div>

            {/* 18K Input */}
            <div className="space-y-2">
              <label htmlFor="rate18k" className="text-sm font-semibold text-charcoal">
                18K Gold Rate (₹ / gram) <span className="text-xs text-muted-foreground">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-muted-foreground">₹</span>
                <input
                  id="rate18k"
                  type="number"
                  step="0.01"
                  placeholder="Auto-calculated if blank (approx 75% of 24K)"
                  value={rate18K}
                  onChange={(e) => setRate18K(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background pl-8 pr-4 text-base font-medium tabular-nums focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            </div>

            {/* Note Input */}
            <div className="space-y-2">
              <label htmlFor="rateNote" className="text-sm font-semibold text-charcoal">
                Market Label / Note
              </label>
              <input
                id="rateNote"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                placeholder="e.g. Chennai Daily Gold Rate (MJDMA / Market Benchmark)"
              />
            </div>

            {/* PIN Authorization */}
            <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <KeyRound className="size-4 text-gold-ink" />
                <label htmlFor="adminPin" className="text-sm font-bold text-forest">
                  Admin Passcode (PIN) <span className="text-destructive">*</span>
                </label>
              </div>
              <input
                id="adminPin"
                type="password"
                required
                placeholder="Enter PIN to save changes"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="h-11 w-full max-w-xs rounded-xl border border-border bg-background px-4 text-base tracking-widest focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
              {isDefaultPin && (
                <p className="text-xs text-amber-700">
                  Tip: Default PIN is <code className="font-bold bg-amber-100 px-1.5 py-0.5 rounded">1234</code>. You can set a custom PIN by adding <code className="font-mono">ADMIN_RATE_PIN=your_pin</code> in your <code className="font-mono">.env.local</code> file.
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving || loading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-forest px-8 text-sm font-bold text-ivory shadow-md transition-transform hover:bg-forest-deep active:scale-[0.98] disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    Publishing Today's Rate…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 text-gold" />
                    Publish Chennai Rate
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Daily Routine Guidance */}
        <div className="mt-8 rounded-xl border border-border bg-muted/40 p-5 text-xs text-muted-foreground space-y-2">
          <p className="font-bold text-charcoal text-sm">💡 Quick Morning Routine:</p>
          <p>
            1. Every morning between 10:00 AM – 11:30 AM, Chennai jeweller associations (MJDMA) publish Chennai's daily 22K and 24K retail rates.
          </p>
          <p>
            2. Visit <code className="font-mono text-charcoal">/admin/rates</code> on your phone or computer, type today's 22K rate, click "Auto-fill", enter your PIN, and hit Publish.
          </p>
          <p>
            3. The entire site (the live banner, the gold rate page, and the cash calculator) updates immediately!
          </p>
        </div>
      </div>
    </>
  )
}


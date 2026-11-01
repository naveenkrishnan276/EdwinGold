'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  KeyRound,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Eye,
  MapPin,
  Phone,
  Store,
  Compass,
} from 'lucide-react'
import { PageHeader } from '@/components/site/page-header'
import { formatINR, formatDateTime } from '@/lib/format'
import type { BranchConfig } from '@/lib/branch/types'

interface RateData {
  rates: {
    '24K'?: number
    '22K'?: number
    '18K'?: number
  }
  updatedAt: string
  note?: string
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'rates' | 'branch'>('rates')

  // Gold Rates state
  const [currentRateData, setCurrentRateData] = useState<RateData | null>(null)
  const [isDefaultPin, setIsDefaultPin] = useState(false)
  const [ratesLoading, setRatesLoading] = useState(true)
  const [rate24K, setRate24K] = useState('')
  const [rate22K, setRate22K] = useState('')
  const [rate18K, setRate18K] = useState('')
  const [rateNote, setRateNote] = useState('Chennai Daily Gold Rate (MJDMA / Market Benchmark)')
  const [ratePin, setRatePin] = useState('')
  const [savingRates, setSavingRates] = useState(false)
  const [rateStatus, setRateStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Branch Info state
  const [branchLoading, setBranchLoading] = useState(true)
  const [currentBranch, setCurrentBranch] = useState<BranchConfig | null>(null)
  const [branchPin, setBranchPin] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [landmark, setLandmark] = useState('')
  const [locality, setLocality] = useState('Ambattur')
  const [city, setCity] = useState('Chennai')
  const [postalCode, setPostalCode] = useState('600053')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [hoursLine1, setHoursLine1] = useState('Mon–Sat: 10:00 AM – 8:00 PM')
  const [hoursLine2, setHoursLine2] = useState('Sunday: 10:00 AM – 2:00 PM')
  const [directionsUrl, setDirectionsUrl] = useState('')
  const [embedUrl, setEmbedUrl] = useState('')
  const [savingBranch, setSavingBranch] = useState(false)
  const [branchStatus, setBranchStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Fetch current rate data
  const fetchRates = async () => {
    try {
      setRatesLoading(true)
      const res = await fetch('/api/admin/rates')
      if (res.ok) {
        const json = await res.json()
        setCurrentRateData(json.data)
        setIsDefaultPin(json.isDefaultPin)
        if (json.data?.rates) {
          setRate24K(String(json.data.rates['24K'] || ''))
          setRate22K(String(json.data.rates['22K'] || ''))
          setRate18K(String(json.data.rates['18K'] || ''))
          if (json.data.note) setRateNote(json.data.note)
        }
      }
    } catch (err) {
      console.error('Failed to load rates:', err)
    } finally {
      setRatesLoading(false)
    }
  }

  // Fetch current branch data
  const fetchBranch = async () => {
    try {
      setBranchLoading(true)
      const res = await fetch('/api/admin/branch')
      if (res.ok) {
        const json = await res.json()
        const b = json.data as BranchConfig
        setCurrentBranch(b)
        setStreetAddress(b.address.streetAddress || '')
        setLandmark(b.address.landmark || '')
        setLocality(b.address.locality || 'Ambattur')
        setCity(b.address.city || 'Chennai')
        setPostalCode(b.address.postalCode || '600053')
        setPhone(b.contact.phone || '')
        setWhatsapp(b.contact.whatsapp || '')
        setEmail(b.contact.email || '')
        if (b.hours && b.hours.length > 0) {
          setHoursLine1(b.hours[0] || '')
          setHoursLine2(b.hours[1] || '')
        }
        setDirectionsUrl(b.maps.directionsUrl || '')
        setEmbedUrl(b.maps.embedUrl || '')
      }
    } catch (err) {
      console.error('Failed to load branch data:', err)
    } finally {
      setBranchLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
    fetchBranch()
  }, [])

  // Auto-calculation helper: given 24K, auto-calc 22K and 18K
  const handleCalculateFrom24K = () => {
    const num24 = parseFloat(rate24K)
    if (!isNaN(num24) && num24 > 0) {
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

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRateStatus(null)

    if (!ratePin.trim()) {
      setRateStatus({ type: 'error', text: 'Please enter the Admin PIN to authorize the rate change.' })
      return
    }

    const n24 = parseFloat(rate24K)
    const n22 = parseFloat(rate22K)
    const n18 = rate18K ? parseFloat(rate18K) : undefined

    if (isNaN(n24) || n24 <= 0 || isNaN(n22) || n22 <= 0) {
      setRateStatus({ type: 'error', text: 'Please enter valid positive numbers for 24K and 22K rates.' })
      return
    }

    try {
      setSavingRates(true)
      const res = await fetch('/api/admin/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: ratePin.trim(),
          rates: {
            '24K': n24,
            '22K': n22,
            '18K': n18,
          },
          note: rateNote.trim(),
        }),
      })

      const result = await res.json()
      if (res.ok) {
        setRateStatus({
          type: 'success',
          text: 'Chennai daily gold rates updated successfully! The live website is now showing today’s rate.',
        })
        setCurrentRateData(result.data)
        setRatePin('')
      } else {
        setRateStatus({ type: 'error', text: result.error || 'Failed to update rates.' })
      }
    } catch {
      setRateStatus({ type: 'error', text: 'A network error occurred while updating rates.' })
    } finally {
      setSavingRates(false)
    }
  }

  const handleBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBranchStatus(null)

    if (!branchPin.trim()) {
      setBranchStatus({ type: 'error', text: 'Please enter the Admin PIN to save branch details.' })
      return
    }

    try {
      setSavingBranch(true)
      const hours = [hoursLine1, hoursLine2].filter((h) => h.trim().length > 0)

      const res = await fetch('/api/admin/branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: branchPin.trim(),
          address: {
            streetAddress: streetAddress.trim(),
            landmark: landmark.trim(),
            locality: locality.trim(),
            city: city.trim(),
            postalCode: postalCode.trim(),
          },
          contact: {
            phone: phone.trim(),
            whatsapp: whatsapp.trim(),
            email: email.trim(),
          },
          hours,
          maps: {
            directionsUrl: directionsUrl.trim(),
            embedUrl: embedUrl.trim(),
          },
        }),
      })

      const result = await res.json()
      if (res.ok) {
        setBranchStatus({
          type: 'success',
          text: 'Branch address, contact details and Google Maps location updated successfully!',
        })
        setCurrentBranch(result.data)
        setBranchPin('')
      } else {
        setBranchStatus({ type: 'error', text: result.error || 'Failed to update branch info.' })
      }
    } catch {
      setBranchStatus({ type: 'error', text: 'A network error occurred while updating branch info.' })
    } finally {
      setSavingBranch(false)
    }
  }

  return (
    <>
      <PageHeader
        breadcrumb={{ label: 'Admin Portal', href: '/admin/rates' }}
        eyebrow="SECRET STORE CONTROL ROOM"
        title="Admin Management"
        description="Update today's official Chennai buying rates and Ambattur branch location details. Changes take effect on the live website immediately."
      />

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Links & Safety Note */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to main website
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/gold-rate"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <Eye className="size-3.5" />
              Preview Live Gold Rates
            </Link>
            <Link
              href="/contact"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <MapPin className="size-3.5" />
              Preview Store Page
            </Link>
          </div>
        </div>

        {/* Security Alert if default PIN */}
        {isDefaultPin && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Default PIN Notice</p>
                <p className="mt-1 text-xs">
                  Your store is currently using the default PIN <code className="font-mono font-bold bg-amber-200/60 dark:bg-amber-900/60 px-1 py-0.5 rounded">1234</code>.
                  To set a secret PIN in production, set <code className="font-mono bg-amber-200/60 dark:bg-amber-900/60 px-1 py-0.5 rounded">ADMIN_RATE_PIN</code> in your Vercel Environment Variables.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs navigation */}
        <div className="mb-8 flex rounded-2xl bg-muted/60 p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('rates')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
              activeTab === 'rates'
                ? 'bg-forest text-gold-soft shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="size-4" />
            1. Gold Rates Manager
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('branch')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
              activeTab === 'branch'
                ? 'bg-forest text-gold-soft shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Store className="size-4" />
            2. Branch Location & Contact
          </button>
        </div>

        {/* TAB 1: GOLD RATES */}
        {activeTab === 'rates' && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left 2 Cols: Form */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-forest">Update Today&apos;s Chennai Rates</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Enter the rates in ₹ per gram. These power the live ticker and the customer calculator.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={fetchRates}
                    disabled={ratesLoading}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border hover:bg-muted"
                    title="Reload current rates"
                  >
                    <RefreshCw className={`size-4 ${ratesLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {rateStatus && (
                  <div
                    className={`mt-4 rounded-xl p-4 text-sm flex items-start gap-3 ${
                      rateStatus.type === 'success'
                        ? 'border border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200'
                        : 'border border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200'
                    }`}
                  >
                    {rateStatus.type === 'success' ? (
                      <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="size-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                    )}
                    <div>{rateStatus.text}</div>
                  </div>
                )}

                <form onSubmit={handleRateSubmit} className="mt-6 flex flex-col gap-6">
                  {/* Rate 24K */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="rate-24k" className="block text-sm font-semibold text-foreground">
                        24K Pure Gold Rate (₹ / gram) <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleCalculateFrom24K}
                        className="text-xs font-semibold text-gold-ink hover:underline inline-flex items-center gap-1"
                      >
                        <Sparkles className="size-3" /> Auto-calculate 22K & 18K
                      </button>
                    </div>
                    <div className="relative mt-2">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground font-semibold">
                        ₹
                      </span>
                      <input
                        id="rate-24k"
                        type="number"
                        step="0.01"
                        min="1"
                        value={rate24K}
                        onChange={(e) => setRate24K(e.target.value)}
                        placeholder="e.g. 13888"
                        required
                        className="w-full rounded-xl border border-input bg-background py-2.5 pl-8 pr-4 text-base font-semibold focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                      />
                    </div>
                  </div>

                  {/* Rate 22K */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="rate-22k" className="block text-sm font-semibold text-foreground">
                        22K Standard Jewellery Rate (916) (₹ / gram) <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleCalculateFrom22K}
                        className="text-xs font-semibold text-gold-ink hover:underline inline-flex items-center gap-1"
                      >
                        <Sparkles className="size-3" /> Auto-calculate from 22K
                      </button>
                    </div>
                    <div className="relative mt-2">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground font-semibold">
                        ₹
                      </span>
                      <input
                        id="rate-22k"
                        type="number"
                        step="0.01"
                        min="1"
                        value={rate22K}
                        onChange={(e) => setRate22K(e.target.value)}
                        placeholder="e.g. 12731"
                        required
                        className="w-full rounded-xl border border-input bg-background py-2.5 pl-8 pr-4 text-base font-semibold focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                      />
                    </div>
                  </div>

                  {/* Rate 18K */}
                  <div>
                    <label htmlFor="rate-18k" className="block text-sm font-semibold text-foreground">
                      18K Hallmarked Gold Rate (₹ / gram) <span className="text-xs text-muted-foreground font-normal">(optional, auto-calculated if left blank)</span>
                    </label>
                    <div className="relative mt-2">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground font-semibold">
                        ₹
                      </span>
                      <input
                        id="rate-18k"
                        type="number"
                        step="0.01"
                        min="1"
                        value={rate18K}
                        onChange={(e) => setRate18K(e.target.value)}
                        placeholder="e.g. 10416"
                        className="w-full rounded-xl border border-input bg-background py-2.5 pl-8 pr-4 text-base font-semibold focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                      />
                    </div>
                  </div>

                  {/* Note / Source banner */}
                  <div>
                    <label htmlFor="rate-note" className="block text-sm font-semibold text-foreground">
                      Notice / Subtitle Note
                    </label>
                    <input
                      id="rate-note"
                      type="text"
                      value={rateNote}
                      onChange={(e) => setRateNote(e.target.value)}
                      placeholder="e.g. Chennai Daily Gold Rate (MJDMA / Market Benchmark)"
                      className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                    />
                  </div>

                  {/* Security PIN */}
                  <div className="rounded-2xl border border-forest/20 bg-forest/5 p-4">
                    <label htmlFor="rate-pin" className="block text-sm font-bold text-forest">
                      Admin Passcode PIN <span className="text-rose-500">*</span>
                    </label>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Required to verify you are authorized to publish live pricing.
                    </p>
                    <div className="relative mt-2">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        <KeyRound className="size-4" />
                      </span>
                      <input
                        id="rate-pin"
                        type="password"
                        value={ratePin}
                        onChange={(e) => setRatePin(e.target.value)}
                        placeholder="Enter secret PIN (default 1234)"
                        required
                        className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-4 text-sm font-mono focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={savingRates}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3.5 font-bold text-gold-soft shadow-md hover:bg-forest/90 focus:outline-none focus:ring-2 focus:ring-forest/40 disabled:opacity-50"
                  >
                    {savingRates ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        Saving &amp; Updating Live Site...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-4" />
                        Publish Today&apos;s Rates
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Col: Live Rate Preview Card */}
            <div>
              <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-bold text-forest flex items-center gap-2">
                  <Clock className="size-4 text-gold-ink" />
                  Currently Live on Site
                </h3>

                {currentRateData ? (
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="rounded-2xl border border-border bg-muted/40 p-4">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">24K Pure (999)</p>
                      <p className="mt-1 text-2xl font-extrabold text-forest">
                        {currentRateData.rates['24K'] ? formatINR(currentRateData.rates['24K']) : '—'}
                        <span className="text-xs font-normal text-muted-foreground"> / gram</span>
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/40 p-4">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">22K Standard (916)</p>
                      <p className="mt-1 text-2xl font-extrabold text-gold-ink">
                        {currentRateData.rates['22K'] ? formatINR(currentRateData.rates['22K']) : '—'}
                        <span className="text-xs font-normal text-muted-foreground"> / gram</span>
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/40 p-4">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">18K Hallmarked (750)</p>
                      <p className="mt-1 text-2xl font-extrabold text-forest">
                        {currentRateData.rates['18K'] ? formatINR(currentRateData.rates['18K']) : '—'}
                        <span className="text-xs font-normal text-muted-foreground"> / gram</span>
                      </p>
                    </div>

                    <div className="rounded-xl border border-border p-3 text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground">Last updated:</p>
                      <p className="mt-0.5">{formatDateTime(currentRateData.updatedAt)}</p>
                      {currentRateData.note && (
                        <p className="mt-2 italic border-t border-border pt-2 text-[11px]">
                          &ldquo;{currentRateData.note}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 py-8 text-center text-sm text-muted-foreground">
                    <RefreshCw className="mx-auto size-6 animate-spin text-muted-foreground/60" />
                    <p className="mt-2">Loading current rates...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BRANCH LOCATION & CONTACT */}
        {activeTab === 'branch' && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-forest">Ambattur Branch Location &amp; Contact</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Update your shop address, Google Maps directions, phone and opening hours.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={fetchBranch}
                    disabled={branchLoading}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border hover:bg-muted"
                    title="Reload current branch data"
                  >
                    <RefreshCw className={`size-4 ${branchLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {branchStatus && (
                  <div
                    className={`mt-4 rounded-xl p-4 text-sm flex items-start gap-3 ${
                      branchStatus.type === 'success'
                        ? 'border border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200'
                        : 'border border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200'
                    }`}
                  >
                    {branchStatus.type === 'success' ? (
                      <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="size-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                    )}
                    <div>{branchStatus.text}</div>
                  </div>
                )}

                <form onSubmit={handleBranchSubmit} className="mt-6 flex flex-col gap-6">
                  {/* Address Group */}
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-forest text-sm flex items-center gap-2">
                      <MapPin className="size-4 text-gold-ink" />
                      Physical Address &amp; Landmarks
                    </h3>

                    <div>
                      <label htmlFor="landmark" className="block text-sm font-semibold text-foreground">
                        Prominent Landmark <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="landmark"
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Oragadam Bus Stop, opposite Naidu Mall"
                        required
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                      />
                    </div>

                    <div>
                      <label htmlFor="street" className="block text-sm font-semibold text-foreground">
                        Street Address / Door Number
                      </label>
                      <input
                        id="street"
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="e.g. No. 12, MTH Road"
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="locality" className="block text-sm font-semibold text-foreground">
                          Locality
                        </label>
                        <input
                          id="locality"
                          type="text"
                          value={locality}
                          onChange={(e) => setLocality(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-semibold text-foreground">
                          City
                        </label>
                        <input
                          id="city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="pincode" className="block text-sm font-semibold text-foreground">
                          PIN Code
                        </label>
                        <input
                          id="pincode"
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Numbers Group */}
                  <div className="flex flex-col gap-4 border-t border-border pt-4">
                    <h3 className="font-bold text-forest text-sm flex items-center gap-2">
                      <Phone className="size-4 text-gold-ink" />
                      Contact Numbers
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-foreground">
                          Store Calling Phone Number
                        </label>
                        <input
                          id="phone"
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 98400 12345"
                          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="whatsapp" className="block text-sm font-semibold text-foreground">
                          WhatsApp Number (with country code, digits only)
                        </label>
                        <input
                          id="whatsapp"
                          type="text"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="e.g. 919840012345"
                          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                        Business Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. info@edwingold.com"
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
                      />
                    </div>
                  </div>

                  {/* Hours Group */}
                  <div className="flex flex-col gap-4 border-t border-border pt-4">
                    <h3 className="font-bold text-forest text-sm flex items-center gap-2">
                      <Clock className="size-4 text-gold-ink" />
                      Shop Opening Hours
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="hours1" className="block text-sm font-semibold text-foreground">
                          Weekday / Regular Hours
                        </label>
                        <input
                          id="hours1"
                          type="text"
                          value={hoursLine1}
                          onChange={(e) => setHoursLine1(e.target.value)}
                          placeholder="e.g. Mon–Sat: 10:00 AM – 8:00 PM"
                          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="hours2" className="block text-sm font-semibold text-foreground">
                          Sunday Hours
                        </label>
                        <input
                          id="hours2"
                          type="text"
                          value={hoursLine2}
                          onChange={(e) => setHoursLine2(e.target.value)}
                          placeholder="e.g. Sunday: 10:00 AM – 2:00 PM"
                          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Google Maps Group */}
                  <div className="flex flex-col gap-4 border-t border-border pt-4">
                    <h3 className="font-bold text-forest text-sm flex items-center gap-2">
                      <Compass className="size-4 text-gold-ink" />
                      Google Maps Links
                    </h3>

                    <div>
                      <label htmlFor="directions-url" className="block text-sm font-semibold text-foreground">
                        Google Maps Share / Directions URL
                      </label>
                      <input
                        id="directions-url"
                        type="url"
                        value={directionsUrl}
                        onChange={(e) => setDirectionsUrl(e.target.value)}
                        placeholder="https://maps.app.goo.gl/..."
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label htmlFor="embed-url" className="block text-sm font-semibold text-foreground">
                        Google Maps Embed URL (for interactive map on store page)
                      </label>
                      <input
                        id="embed-url"
                        type="url"
                        value={embedUrl}
                        onChange={(e) => setEmbedUrl(e.target.value)}
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* PIN */}
                  <div className="rounded-2xl border border-forest/20 bg-forest/5 p-4">
                    <label htmlFor="branch-pin" className="block text-sm font-bold text-forest">
                      Admin Passcode PIN <span className="text-rose-500">*</span>
                    </label>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Required to save branch location and contact updates.
                    </p>
                    <div className="relative mt-2">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        <KeyRound className="size-4" />
                      </span>
                      <input
                        id="branch-pin"
                        type="password"
                        value={branchPin}
                        onChange={(e) => setBranchPin(e.target.value)}
                        placeholder="Enter secret PIN (default 1234)"
                        required
                        className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-4 text-sm font-mono focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={savingBranch}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3.5 font-bold text-gold-soft shadow-md hover:bg-forest/90 focus:outline-none focus:ring-2 focus:ring-forest/40 disabled:opacity-50"
                  >
                    {savingBranch ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        Saving Branch Details...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-4" />
                        Save Branch Location &amp; Contact
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Col: Current Location Preview Card */}
            <div>
              <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-bold text-forest flex items-center gap-2">
                  <Store className="size-4 text-gold-ink" />
                  Current Branch Details
                </h3>

                {currentBranch ? (
                  <div className="mt-4 flex flex-col gap-4 text-sm">
                    <div className="rounded-2xl border border-border bg-muted/40 p-4">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Address</p>
                      <p className="mt-1 font-bold text-forest">{currentBranch.address.landmark}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[
                          currentBranch.address.streetAddress,
                          currentBranch.address.locality,
                          currentBranch.address.city,
                          currentBranch.address.postalCode,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/40 p-4">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Contact Info</p>
                      <p className="mt-1 font-semibold text-forest">📞 {currentBranch.contact.phone || 'Not set'}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">💬 WhatsApp: {currentBranch.contact.whatsapp || 'Not set'}</p>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/40 p-4">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Hours</p>
                      {currentBranch.hours.map((h, i) => (
                        <p key={i} className="mt-1 text-xs text-foreground font-medium">
                          • {h}
                        </p>
                      ))}
                    </div>

                    {currentBranch.maps.directionsUrl && (
                      <a
                        href={currentBranch.maps.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-forest hover:bg-gold/20"
                      >
                        <Compass className="size-3.5 text-gold-ink" />
                        Test Directions Link
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 py-8 text-center text-sm text-muted-foreground">
                    <RefreshCw className="mx-auto size-6 animate-spin text-muted-foreground/60" />
                    <p className="mt-2">Loading branch info...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

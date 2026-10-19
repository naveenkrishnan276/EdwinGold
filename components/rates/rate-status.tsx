import { AlertTriangle, Clock, FlaskConical, Info } from 'lucide-react'
import type { GoldRateResponse } from '@/lib/rates/types'
import { formatAge, formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'

export function RateMeta({ response, tone = 'light' }: { response: GoldRateResponse; tone?: 'light' | 'dark' }) {
  const { data, ageMinutes } = response
  if (!data) return null
  const dark = tone === 'dark'
  return (
    <div className={cn('flex flex-col gap-1.5 text-xs leading-relaxed', dark ? 'text-ivory/75' : 'text-muted-foreground')}>
      <p className="flex items-center gap-1.5">
        <Clock className={cn('size-3.5 shrink-0', dark ? 'text-gold' : 'text-gold-ink')} aria-hidden="true" />
        <span>
          Updated <time dateTime={data.sourceTimestamp}>{formatDateTime(data.sourceTimestamp)}</time>
          {ageMinutes !== null && <> &middot; {formatAge(ageMinutes)}</>}
        </span>
      </p>
      <p>
        Source: {data.providerLabel} &middot; {data.rateDescription}
      </p>
    </div>
  )
}

export function RateNotice({ response }: { response: GoldRateResponse }) {
  const { status, data, servedFromFallback, message } = response

  if (status === 'unavailable' || !data) {
    return (
      <Notice tone="error" icon={AlertTriangle} title="Live rate currently unavailable">
        {message ?? 'We could not load the latest gold rate. Please contact EDWIN GOLD for the current buying rate.'}
      </Notice>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {data.kind === 'development-fixture' && (
        <Notice tone="warning" icon={FlaskConical} title="Sample rates for preview only">
          No live rate source is configured. These figures are placeholders and must not be used for any decision.
        </Notice>
      )}
      {status === 'stale' && (
        <Notice tone="warning" icon={Clock} title="Rate may be outdated">
          {response.calculationsAllowed
            ? 'This is the latest available rate, but it is older than usual (markets may be closed). Confirm the current rate with us.'
            : 'This rate is too old to calculate a reliable estimate. Please contact EDWIN GOLD for today’s rate.'}
        </Notice>
      )}
      {servedFromFallback && status !== 'stale' && (
        <Notice tone="info" icon={Info} title="Showing last available rate">
          The rate source did not respond, so the most recent successful rate is shown.
        </Notice>
      )}
    </div>
  )
}

function Notice({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: 'warning' | 'error' | 'info'
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex gap-3 rounded-lg border p-3 text-sm',
        tone === 'error' && 'border-destructive/30 bg-destructive/5 text-destructive',
        tone === 'warning' && 'border-[#e8d49a] bg-warning text-warning-foreground',
        tone === 'info' && 'border-border bg-muted text-charcoal',
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 leading-relaxed opacity-90">{children}</p>
      </div>
    </div>
  )
}

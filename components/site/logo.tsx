import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  tone?: 'light' | 'dark'
  showTagline?: boolean
  className?: string
}

export function Wordmark({ tone = 'light', showTagline = false, className }: LogoProps) {
  const isLight = tone === 'light'
  return (
    <span className={cn('flex flex-col leading-none', className)}>
      <span
        className={cn(
          'text-lg font-extrabold tracking-[0.22em] sm:text-xl',
          isLight ? 'text-ivory' : 'text-forest',
        )}
      >
        EDWIN <span className={isLight ? 'text-gold' : 'text-gold-ink'}>GOLD</span>
      </span>
      <span className="mt-1.5 flex items-center gap-2">
        <span aria-hidden="true" className={cn('h-px w-4', isLight ? 'bg-gold/70' : 'bg-gold-ink/60')} />
        <span
          className={cn(
            'text-[0.625rem] font-semibold tracking-[0.32em]',
            isLight ? 'text-ivory/80' : 'text-charcoal/75',
          )}
        >
          CASH FOR GOLD
        </span>
      </span>
      {showTagline && (
        <span className={cn('mt-3 text-sm font-medium', isLight ? 'text-gold' : 'text-gold-ink')}>
          Your Gold. Your Value.
        </span>
      )}
    </span>
  )
}

export function LogoLink(props: LogoProps) {
  return (
    <Link href="/" aria-label="EDWIN GOLD — Cash for Gold, home" className="inline-flex rounded-md">
      <Wordmark {...props} />
    </Link>
  )
}

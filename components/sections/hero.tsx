import Image from 'next/image'
import { Calculator, MapPin } from 'lucide-react'
import type { GoldRateResponse } from '@/lib/rates/types'
import { ButtonLink } from '@/components/site/button-link'
import { WhatsAppButton } from '@/components/site/whatsapp-button'
import { RateCards } from '@/components/rates/rate-cards'

export function Hero({ rates }: { rates: GoldRateResponse }) {
  return (
    <section aria-labelledby="hero-heading" className="surface-dark relative overflow-hidden bg-forest text-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_60%_at_85%_10%,rgb(212_175_55/0.16),transparent_60%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:px-8 lg:pb-20 lg:pt-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-medium text-ivory/85">
            <MapPin className="size-3.5 text-gold" aria-hidden="true" />
            Ambattur, Chennai
          </p>
          <h1
            id="hero-heading"
            className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Your Gold. <span className="text-gold">Your Value.</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ivory/80 sm:text-lg">
            Planning to sell your gold? Check the latest available rates and estimate your gold&apos;s value before you
            visit our store near Oragadam Bus Stop.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/gold-rate#estimator" size="lg">
              <Calculator aria-hidden="true" />
              Estimate Gold Value
            </ButtonLink>
            <WhatsAppButton size="lg" variant="outlineLight" />
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-gold/25 shadow-2xl sm:aspect-[16/10] lg:aspect-[4/3]">
            <Image
              src="/images/gold-jewellery.png"
              alt="Gold necklace, bangles and rings arranged on dark green velvet"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="rounded-2xl border border-gold/20 bg-forest-deep/50 p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold tracking-[0.18em] text-gold">LATEST AVAILABLE GOLD RATE</h2>
            <ButtonLink href="/gold-rate" variant="outlineLight" size="sm" className="hidden sm:inline-flex">
              View details
            </ButtonLink>
          </div>
          <RateCards initial={rates} tone="dark" />
        </div>
      </div>
    </section>
  )
}

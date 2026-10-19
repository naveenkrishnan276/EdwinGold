import type { Metadata } from 'next'
import { getGoldRates } from '@/lib/rates/service'
import { PageHeader, SectionHeading } from '@/components/site/page-header'
import { RateCards } from '@/components/rates/rate-cards'
import { Estimator } from '@/components/rates/estimator'
import { FaqSection } from '@/components/sections/faq-section'

export const metadata: Metadata = {
  title: 'Gold Rate Today & Gold Value Estimator',
  description:
    'See the latest available 24K, 22K and 18K gold rate per gram and estimate the indicative value of your gold before visiting EDWIN GOLD in Ambattur, Chennai.',
  alternates: { canonical: '/gold-rate' },
}

const notes = [
  'Rates shown are reference market rates from the configured source, with their timestamp.',
  'They are not EDWIN GOLD’s buying offer. Contact us for the current buying rate.',
  'Your final offer depends on purity testing, verified net gold weight and the rate at the time of sale.',
]

export default async function GoldRatePage() {
  const rates = await getGoldRates()

  return (
    <>
      <PageHeader
        breadcrumb={{ label: 'Gold Rate', href: '/gold-rate' }}
        eyebrow="GOLD RATE"
        title="Latest available gold rate"
        description="Reference rates per gram, with the source and time clearly shown."
      />

      <section aria-label="Gold rates" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <RateCards initial={rates} />
        <ul className="mt-6 grid gap-2 rounded-xl border border-border bg-muted/60 p-4 text-sm text-muted-foreground sm:grid-cols-3 sm:gap-4">
          {notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
              {n}
            </li>
          ))}
        </ul>
      </section>

      <section
        id="estimator"
        aria-labelledby="estimator-heading"
        className="scroll-mt-20 mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:scroll-mt-24 lg:px-8"
      >
        <SectionHeading
          id="estimator-heading"
          eyebrow="ESTIMATOR"
          title="Estimate your gold value"
          description="Enter your gold details to see an indicative value based on the rate above."
        />
        <div className="mt-8">
          <Estimator initial={rates} />
        </div>
      </section>

      <div className="bg-secondary/60">
        <FaqSection />
      </div>
    </>
  )
}

import type { Metadata } from 'next'
import { IdCard, Gem, Receipt } from 'lucide-react'
import { PageHeader, SectionHeading } from '@/components/site/page-header'
import { StepsList } from '@/components/sections/steps'
import { CtaBand } from '@/components/sections/cta-band'

export const metadata: Metadata = {
  title: 'How It Works — Selling Gold at EDWIN GOLD',
  description:
    'Understand how selling gold works at EDWIN GOLD in Ambattur: estimate online, visit the store, transparent testing and weighing, and a clear final offer.',
  alternates: { canonical: '/how-it-works' },
}

const bring = [
  { icon: IdCard, title: 'Valid photo ID', body: 'A government-issued photo ID such as Aadhaar, PAN, passport or driving licence.' },
  { icon: Gem, title: 'Your gold items', body: 'Jewellery, coins or other eligible gold items you wish to sell.' },
  { icon: Receipt, title: 'Purchase bills (if available)', body: 'Original bills help with verification, but are not always required.' },
]

const terms = [
  { term: 'Gross weight', def: 'The total weight of the item, including stones, beads or other attached parts.' },
  { term: 'Net gold weight', def: 'The weight of gold alone, after non-gold parts are accounted for.' },
  { term: 'Purity (karat)', def: 'How much of the metal is pure gold — for example 22K is about 91.6% gold.' },
]

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        breadcrumb={{ label: 'How It Works', href: '/how-it-works' }}
        eyebrow="HOW IT WORKS"
        title="Selling gold, step by step"
        description="A simple, transparent process — so you know what to expect before you walk in."
      />

      <section aria-label="Process steps" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <StepsList />
      </section>

      <section aria-labelledby="bring-heading" className="bg-secondary/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading id="bring-heading" eyebrow="BEFORE YOU VISIT" title="What to bring" />
            <ul className="mt-8 flex flex-col gap-5">
              {bring.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <span aria-hidden="true" className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-forest text-gold">
                    <b.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-forest">{b.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="GOOD TO KNOW" title="Key terms" />
            <dl className="mt-8 flex flex-col gap-3">
              {terms.map((t) => (
                <div key={t.term} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <dt className="font-bold text-forest">{t.term}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.def}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <div className="pt-16 sm:pt-20">
        <CtaBand />
      </div>
    </>
  )
}

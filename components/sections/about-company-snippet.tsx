import Link from 'next/link'
import { ShieldCheck, Scale, Banknote, ArrowRight, Store } from 'lucide-react'
import { brandButton } from '@/components/site/button-link'
import { SectionHeading } from '@/components/site/page-header'

const highlights = [
  {
    icon: Store,
    title: 'Dedicated Single Branch',
    description:
      'We run exclusively from our Ambattur store. No middlemen or third-party franchisees — dealing directly with the owners means better rates and personal attention.',
  },
  {
    icon: Scale,
    title: 'German XRF Purity Testing',
    description:
      'Non-destructive computer spectrometer test conducted right in front of you. Exact purity and carat weight without melting or scratching your ornaments.',
  },
  {
    icon: Banknote,
    title: 'Spot Cash or Instant UPI / IMPS',
    description:
      'Immediate payment settled in minutes to your preferred bank account or cash, backed by an official tax invoice and purchase voucher.',
  },
  {
    icon: ShieldCheck,
    title: '100% Legal & Govt ID Compliant',
    description:
      'Strictly transparent business practices in compliance with Tamil Nadu gold trading guidelines with Aadhaar / PAN verification.',
  },
]

export function AboutCompanySnippet() {
  return (
    <section aria-labelledby="about-snippet-heading" className="bg-card/50 border-y border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="about-snippet-heading"
            eyebrow="ABOUT EDWIN GOLD"
            title="Ambattur's Trusted Cash For Gold Store"
            description="Built on clear valuation, honest scales, and transparent live market rates."
          />
          <Link
            href="/about"
            className={brandButton({ variant: 'outline', size: 'default' }) + ' self-start sm:self-auto gap-2'}
          >
            Explore Company Story
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-gold/50 transition-colors"
            >
              <div className="mb-4 inline-flex size-13 items-center justify-center rounded-2xl bg-[#0F3D32] ring-1 ring-[#D4AF37]/50 shadow-md">
                <h.icon className="size-7 text-[#F5CF66] stroke-[2.2]" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-forest text-base">{h.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed flex-1">
                {h.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

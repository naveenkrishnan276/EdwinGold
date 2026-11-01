import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, ShieldCheck, Sparkles, MapPin, ArrowRight } from 'lucide-react'
import { PageHeader, SectionHeading } from '@/components/site/page-header'
import { WhySection } from '@/components/sections/why-section'
import { CtaBand } from '@/components/sections/cta-band'
import { brandButton } from '@/components/site/button-link'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'EDWIN GOLD is Ambattur’s trusted single-branch cash for gold store, offering computerized XRF gold purity testing, honest scales, and instant payment.',
  alternates: { canonical: '/about' },
}

const trustPoints = [
  'Zero melting or scraping: Non-destructive German XRF testing retains your jewellery intact until you agree.',
  'Accurate certified digital scales calibrated up to 3 decimal places.',
  'Spot valuation against today’s live Chennai gold rates (24K, 22K, 18K).',
  'Instant payout settled through IMPS, RTGS, UPI, or Cash on the spot.',
  'Full tax invoice and purchase documentation for your records.',
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        breadcrumb={{ label: 'About Us', href: '/about' }}
        eyebrow="ABOUT EDWIN GOLD"
        title="Ambattur's Dedicated Single-Branch Gold Buyer"
        description="EDWIN GOLD was founded with a straightforward philosophy: transparent valuation, honest weight, and respectful customer service without unnecessary deductions."
      />

      <section aria-labelledby="story-heading" className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-lg">
          <Image
            src="/images/gold-jewellery.png"
            alt="Gold jewellery displayed on green velvet"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <SectionHeading id="story-heading" eyebrow="WHO WE ARE" title="Clarity first, always" />
          <div className="mt-6 flex flex-col gap-4 leading-relaxed text-muted-foreground">
            <p>
              Selling gold is an important financial decision. We believe you should understand exactly how your gold
              is valued — its exact purity percentage, net gram weight, and the transparent Chennai market rate — before
              you make any commitment.
            </p>
            <p>
              Unlike franchise chains that deduct hefty overhead commissions, our single-branch model in Ambattur
              allows us to pass higher value directly back to you with instant, secure settlement.
            </p>
            <p>
              You will find us conveniently located near <strong className="text-forest">Oragadam Bus Stop, opposite Naidu Mall, in Ambattur, Chennai</strong>.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/gold-rate" className={brandButton({ variant: 'gold', size: 'default' }) + ' gap-2'}>
              <Sparkles className="size-4" />
              Check Today&apos;s Rates
            </Link>
            <Link href="/contact" className={brandButton({ variant: 'outline', size: 'default' }) + ' gap-2'}>
              <MapPin className="size-4" />
              Get Store Directions
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Featurettes */}
      <section className="bg-muted/40 border-y border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold tracking-widest text-gold-ink uppercase">OUR PLEDGE</span>
            <h2 className="mt-2 text-3xl font-extrabold text-forest sm:text-4xl">What sets Edwin Gold apart</h2>
            <p className="mt-3 text-muted-foreground">
              Every appraisal is conducted right in front of you. You maintain full control over your jewellery at all times.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {trustPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <CheckCircle2 className="size-5 shrink-0 text-gold-ink mt-0.5" />
                <p className="text-sm font-medium text-foreground leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhySection />

      <div className="pt-16 sm:pt-20">
        <CtaBand />
      </div>
    </>
  )
}

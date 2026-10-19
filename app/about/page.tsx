import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHeader, SectionHeading } from '@/components/site/page-header'
import { WhySection } from '@/components/sections/why-section'
import { CtaBand } from '@/components/sections/cta-band'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'EDWIN GOLD is a cash-for-gold business in Ambattur, Chennai, focused on clear and transparent gold valuation.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        breadcrumb={{ label: 'About Us', href: '/about' }}
        eyebrow="ABOUT US"
        title="A local gold buyer in Ambattur"
        description="EDWIN GOLD helps people in and around Ambattur understand the value of their gold and sell it with confidence."
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
              Selling gold is often a big decision. We believe you should understand exactly how your gold is valued —
              its purity, its net weight and the rate used — before you decide anything.
            </p>
            <p>
              That is why our website shows reference gold rates with their source and time, and offers a simple
              estimator you can use from home. When you visit, we walk you through each step in person.
            </p>
            <p>
              You will find us near Oragadam Bus Stop, opposite Naidu Mall, in Ambattur, Chennai.
            </p>
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

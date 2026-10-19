import { getGoldRates } from '@/lib/rates/service'
import { Hero } from '@/components/sections/hero'
import { StepsList } from '@/components/sections/steps'
import { WhySection } from '@/components/sections/why-section'
import { VisitSection } from '@/components/sections/visit-section'
import { FaqSection } from '@/components/sections/faq-section'
import { CtaBand } from '@/components/sections/cta-band'
import { SectionHeading } from '@/components/site/page-header'
import { ButtonLink } from '@/components/site/button-link'

export default async function HomePage() {
  const rates = await getGoldRates()

  return (
    <>
      <Hero rates={rates} />

      <section aria-labelledby="steps-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="steps-heading"
            eyebrow="HOW IT WORKS"
            title="Four simple steps"
            description="From an online estimate to a final offer at our store."
          />
          <ButtonLink href="/how-it-works" variant="outline" className="self-start sm:self-auto">
            Learn more
          </ButtonLink>
        </div>
        <div className="mt-10">
          <StepsList />
        </div>
      </section>

      <WhySection />
      <VisitSection />
      <FaqSection limit={4} />
      <CtaBand />
    </>
  )
}

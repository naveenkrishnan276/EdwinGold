import { Calculator } from 'lucide-react'
import { ButtonLink } from '@/components/site/button-link'
import { WhatsAppButton } from '@/components/site/whatsapp-button'

export function CtaBand() {
  return (
    <section aria-labelledby="cta-heading" className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
      <div className="surface-dark relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-forest px-6 py-12 text-center text-ivory sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background:radial-gradient(50%_70%_at_50%_0%,rgb(212_175_55/0.18),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-xl">
          <p className="text-xs font-semibold tracking-[0.25em] text-gold">YOUR GOLD. YOUR VALUE.</p>
          <h2 id="cta-heading" className="mt-3 text-balance text-2xl font-bold sm:text-4xl">
            Know your gold&apos;s value before you visit
          </h2>
          <p className="mt-4 text-pretty text-ivory/75">
            Get an indicative estimate in seconds, then talk to us on WhatsApp for the current buying rate.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/gold-rate#estimator" size="lg">
              <Calculator aria-hidden="true" />
              Estimate Gold Value
            </ButtonLink>
            <WhatsAppButton size="lg" variant="outlineLight" />
          </div>
        </div>
      </div>
    </section>
  )
}

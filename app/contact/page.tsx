import type { Metadata } from 'next'
import { MessageCircle } from 'lucide-react'
import { PageHeader } from '@/components/site/page-header'
import { VisitSection } from '@/components/sections/visit-section'
import { WhatsAppButton } from '@/components/site/whatsapp-button'

export const metadata: Metadata = {
  title: 'Contact & Directions',
  description: 'Contact EDWIN GOLD on WhatsApp or visit us near Oragadam Bus Stop, opposite Naidu Mall, Ambattur, Chennai.',
  alternates: { canonical: '/contact' },
}

const quick = [
  { template: 'rate', label: 'Ask today’s buying rate', body: 'Get the current rate before you visit.' },
  { template: 'general', label: 'Ask about selling gold', body: 'Questions about items, documents or the process.' },
  { template: 'directions', label: 'Ask for directions & timings', body: 'Confirm we are open before you travel.' },
] as const

export default function ContactPage() {
  return (
    <>
      <PageHeader
        breadcrumb={{ label: 'Contact', href: '/contact' }}
        eyebrow="CONTACT"
        title="We're here to help"
        description="The quickest way to reach us is WhatsApp. Pick a topic below and we'll pre-fill your message."
      />

      <section aria-label="WhatsApp quick messages" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <ul className="grid gap-4 md:grid-cols-3">
          {quick.map((q) => (
            <li key={q.template} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span aria-hidden="true" className="inline-flex size-10 items-center justify-center rounded-full bg-accent text-gold-ink">
                <MessageCircle className="size-5" />
              </span>
              <h2 className="mt-4 font-bold text-forest">{q.label}</h2>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{q.body}</p>
              <WhatsAppButton template={q.template} label="Message on WhatsApp" size="sm" className="mt-5 self-start" />
            </li>
          ))}
        </ul>
      </section>

      <VisitSection />
    </>
  )
}

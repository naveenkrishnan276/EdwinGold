import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SectionHeading } from '@/components/site/page-header'
import { JsonLd } from '@/components/site/json-ld'
import { faqs } from '@/lib/faq'

export function FaqSection({ limit }: { limit?: number }) {
  const items = limit ? faqs.slice(0, limit) : faqs
  return (
    <section aria-labelledby="faq-heading" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading id="faq-heading" eyebrow="FAQ" title="Questions, answered" align="center" />
      <Accordion className="mt-10 rounded-2xl border border-border bg-card px-5 shadow-sm">
        {items.map((faq, i) => (
          <AccordionItem key={faq.question} value={`faq-${i}`}>
            <AccordionTrigger className="py-5 text-left text-base font-semibold text-forest hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
    </section>
  )
}

import { Eye, FileCheck2, Scale, ShieldCheck } from 'lucide-react'
import { SectionHeading } from '@/components/site/page-header'

const points = [
  {
    icon: Eye,
    title: 'Done in front of you',
    body: 'Weighing and purity checks happen where you can see them. Ask any question at any step.',
  },
  {
    icon: Scale,
    title: 'Net weight explained',
    body: 'We show how stones and non-gold parts are separated from the gold weight used for valuation.',
  },
  {
    icon: FileCheck2,
    title: 'Clear rate reference',
    body: 'Our online rates show their source and timestamp, so you know exactly what the estimate is based on.',
  },
  {
    icon: ShieldCheck,
    title: 'No obligation',
    body: 'An estimate or offer never commits you to sell. You decide only after you understand the value.',
  },
] as const

export function WhySection() {
  return (
    <section aria-labelledby="why-heading" className="bg-secondary/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          id="why-heading"
          eyebrow="OUR APPROACH"
          title="A clear, transparent way to sell gold"
          description="Selling gold should never feel confusing. Here is what you can expect when you choose EDWIN GOLD."
        />
        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {points.map((p) => (
            <li key={p.title} className="flex gap-4">
              <span aria-hidden="true" className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-forest text-gold">
                <p.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-bold text-forest">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

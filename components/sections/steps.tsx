import { BadgeIndianRupee, Calculator, FlaskConical, Store } from 'lucide-react'

export const steps = [
  {
    icon: Calculator,
    title: 'Estimate online',
    body: 'Check the latest available rate and use the estimator to get an indicative value for your gold.',
  },
  {
    icon: Store,
    title: 'Visit our store',
    body: 'Bring your gold and a valid government photo ID to our store near Oragadam Bus Stop, Ambattur.',
  },
  {
    icon: FlaskConical,
    title: 'Testing & weighing',
    body: 'Your gold is weighed and its purity is checked in front of you, so the net gold weight is clear.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Receive your offer',
    body: 'You receive a final offer based on verified purity, net weight and the rate at the time. The choice is yours.',
  },
] as const

export function StepsList() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-forest text-gold">
              <step.icon className="size-5" aria-hidden="true" />
            </span>
            <span aria-hidden="true" className="text-3xl font-bold tabular-nums text-gold/50">
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
          <h3 className="mt-5 text-lg font-bold text-forest">
            <span className="sr-only">Step {i + 1}: </span>
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        </li>
      ))}
    </ol>
  )
}

import { ArrowUpRight, Star } from 'lucide-react'

export function FeedbackSection() {
  return (
    <section aria-labelledby="feedback-heading" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-forest px-6 py-10 text-ivory sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full border border-gold/20" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-4 -top-8 size-40 rounded-full border border-gold/20" aria-hidden="true" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 flex items-center gap-1 text-gold" aria-label="Five stars">
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} className="size-4 fill-current" aria-hidden="true" />
              ))}
            </p>
            <h2 id="feedback-heading" className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Your feedback means a lot
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ivory/75 sm:text-base">
              Had a good experience with Edwin Gold? Share it on Google Maps and help others find a trusted place to sell their gold.
            </p>
          </div>
          <a
            href="https://g.page/r/CVUasV6tkojhEBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-forest transition-colors hover:bg-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
          >
            Leave a Google review
            <ArrowUpRight className="size-4" aria-hidden="true" />
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  )
}

import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { getBranchConfigSync } from '@/lib/branch/store'
import { SectionHeading } from '@/components/site/page-header'
import { WhatsAppButton } from '@/components/site/whatsapp-button'
import { brandButton } from '@/components/site/button-link'

export function VisitSection() {
  const branch = getBranchConfigSync()
  const { address, contact, hours, maps } = branch

  return (
    <section aria-labelledby="visit-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              Ambattur Store &middot; Open For Valuation
            </span>
          </div>

          <SectionHeading
            id="visit-heading"
            eyebrow="SINGLE STORE LOCATION"
            title="Visit Edwin Gold in Ambattur"
            description="Conveniently situated right near Oragadam Bus Stop, opposite Naidu Mall. Sell your gold with immediate settlement."
          />

          <ul className="mt-8 flex flex-col gap-5">
            <li className="flex gap-4">
              <Icon icon={MapPin} />
              <div>
                <p className="font-semibold text-forest">{address.landmark}</p>
                <p className="text-sm text-muted-foreground">
                  {[address.streetAddress, address.locality, address.city, address.region, address.postalCode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <Icon icon={Clock} />
              <div>
                <p className="font-semibold text-forest">Store Timings</p>
                {hours && hours.length > 0 ? (
                  hours.map((h, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {h}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Mon–Sat: 10:00 AM – 8:00 PM</p>
                )}
              </div>
            </li>
            {contact.phone && (
              <li className="flex gap-4">
                <Icon icon={Phone} />
                <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="self-center font-semibold text-forest hover:underline">
                  {contact.phone}
                </a>
              </li>
            )}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={maps.directionsUrl} target="_blank" rel="noopener noreferrer" className={brandButton({ variant: 'forest', size: 'lg' })}>
              <Navigation aria-hidden="true" />
              Get directions on Google Maps
              <span className="sr-only">(opens Google Maps)</span>
            </a>
            <WhatsAppButton template="directions" label="Ask for directions" size="lg" variant="outline" />
          </div>
        </div>

        <div className="min-h-72 overflow-hidden rounded-2xl border border-border bg-muted">
          {maps.embedUrl ? (
            <iframe
              src={maps.embedUrl}
              title="Map showing EDWIN GOLD location in Ambattur"
              className="size-full min-h-80 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="surface-dark flex size-full min-h-72 flex-col items-center justify-center gap-4 bg-forest p-8 text-center text-ivory [background-image:radial-gradient(rgb(212_175_55/0.12)_1px,transparent_1px)] [background-size:18px_18px]">
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-gold text-forest shadow-lg">
                <MapPin className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold">{address.landmark}</p>
                <p className="text-sm text-ivory/70">{address.locality}, {address.city}</p>
              </div>
              <a
                href={maps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={brandButton({ variant: 'gold', size: 'sm' })}
              >
                Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Icon({ icon: I }: { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <span aria-hidden="true" className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-gold-ink">
      <I className="size-5" />
    </span>
  )
}

import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { SectionHeading } from '@/components/site/page-header'
import { WhatsAppButton } from '@/components/site/whatsapp-button'
import { brandButton } from '@/components/site/button-link'

export function VisitSection() {
  const { address, contact, hours, maps } = siteConfig
  return (
    <section aria-labelledby="visit-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col">
          <SectionHeading
            id="visit-heading"
            eyebrow="VISIT US"
            title="Find us in Ambattur"
            description="Easy to reach, right next to a familiar landmark."
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
                <p className="font-semibold text-forest">Opening hours</p>
                {hours ? (
                  hours.map((h) => (
                    <p key={h} className="text-sm text-muted-foreground">
                      {h}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Please message us on WhatsApp to confirm timings before visiting.</p>
                )}
              </div>
            </li>
            {contact.phone && (
              <li className="flex gap-4">
                <Icon icon={Phone} />
                <a href={`tel:${contact.phone}`} className="self-center font-semibold text-forest hover:underline">
                  {contact.phone}
                </a>
              </li>
            )}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={maps.directionsUrl} target="_blank" rel="noopener noreferrer" className={brandButton({ variant: 'forest', size: 'lg' })}>
              <Navigation aria-hidden="true" />
              Get directions
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
              className="size-full min-h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="surface-dark flex size-full min-h-72 flex-col items-center justify-center gap-4 bg-forest p-8 text-center text-ivory [background-image:radial-gradient(rgb(212_175_55/0.12)_1px,transparent_1px)] [background-size:18px_18px]">
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-gold text-forest shadow-lg">
                <MapPin className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold">Near Oragadam Bus Stop</p>
                <p className="text-sm text-ivory/70">Opposite Naidu Mall &middot; Ambattur, Chennai</p>
              </div>
              <a
                href={maps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-gold underline-offset-4 hover:underline"
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

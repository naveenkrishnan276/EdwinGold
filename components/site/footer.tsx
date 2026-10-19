import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { navLinks, siteConfig } from '@/lib/site-config'
import { Wordmark } from './logo'
import { WhatsAppButton } from './whatsapp-button'
import { CurrentYear } from './current-year'

export function Footer() {
  const { contact, social } = siteConfig
  const socials = [
    { label: 'Instagram', href: social.instagram },
    { label: 'Facebook', href: social.facebook },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href))

  return (
    <footer className="surface-dark bg-forest text-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-5">
          <Wordmark tone="light" showTagline />
          <p className="max-w-xs text-sm leading-relaxed text-ivory/70">
            A local cash-for-gold business in Ambattur, Chennai, helping you understand an estimated value before you
            visit.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold">EXPLORE</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ivory/80 transition-colors hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold">VISIT</h2>
          <address className="mt-4 flex gap-2.5 text-sm not-italic leading-relaxed text-ivory/80">
            <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
            <span>{siteConfig.fullAddress}</span>
          </address>
          <a
            href={siteConfig.maps.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-gold underline-offset-4 hover:underline"
          >
            Get directions<span className="sr-only"> (opens Google Maps)</span>
          </a>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold">CONTACT</h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-ivory/80">
            {contact.phone && (
              <li>
                <a href={`tel:${contact.phone}`} className="flex items-center gap-2.5 hover:text-gold">
                  <Phone className="size-4 text-gold" aria-hidden="true" />
                  {contact.phone}
                </a>
              </li>
            )}
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 hover:text-gold">
                  <Mail className="size-4 text-gold" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
            )}
            <li>
              <WhatsAppButton size="sm" />
            </li>
            {socials.length > 0 && (
              <li className="flex gap-4">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                    {s.label}
                  </a>
                ))}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-gold/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 pb-24 text-xs text-ivory/65 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 lg:pb-6">
          <p>
            &copy; <CurrentYear /> EDWIN GOLD. All rights reserved.
          </p>
          <ul className="flex gap-5">
            <li>
              <Link href="/privacy-policy" className="hover:text-gold">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-gold">
                Terms &amp; Disclaimer
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

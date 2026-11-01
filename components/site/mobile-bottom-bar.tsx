'use client'

import { Phone, MessageCircle, MapPin, Calculator } from 'lucide-react'
import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'
import { buildWhatsAppUrl, whatsappTemplates } from '@/lib/whatsapp'

export function MobileBottomBar() {
  const { contact, maps } = siteConfig
  const whatsappUrl = buildWhatsAppUrl(contact.whatsapp, whatsappTemplates.rate)
  const phoneUrl = contact.phone ? `tel:${contact.phone.replace(/\s+/g, '')}` : null

  return (
    <nav
      aria-label="Mobile quick actions"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 pb-safe backdrop-blur-md lg:hidden"
    >
      <div className="grid grid-cols-4 items-center gap-1 px-2 py-2 text-center">
        {phoneUrl ? (
          <a
            href={phoneUrl}
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-semibold text-forest hover:bg-muted active:scale-95 transition-all"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-forest/10 text-forest">
              <Phone className="size-4" />
            </span>
            <span>Call Shop</span>
          </a>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 py-1 text-[11px] opacity-40">
            <span className="flex size-8 items-center justify-center rounded-full bg-muted">
              <Phone className="size-4" />
            </span>
            <span>Call</span>
          </div>
        )}

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-semibold text-[#1f7a4d] hover:bg-muted active:scale-95 transition-all"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-[#1f7a4d]/10 text-[#1f7a4d]">
              <MessageCircle className="size-4" />
            </span>
            <span>WhatsApp</span>
          </a>
        ) : null}

        <a
          href={maps.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-semibold text-gold-ink hover:bg-muted active:scale-95 transition-all"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-gold/15 text-gold-ink">
            <MapPin className="size-4" />
          </span>
          <span>Directions</span>
        </a>

        <Link
          href="/gold-rate#estimator"
          className="flex flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-semibold text-forest hover:bg-muted active:scale-95 transition-all"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-forest text-gold-soft">
            <Calculator className="size-4" />
          </span>
          <span>Calculator</span>
        </Link>
      </div>
    </nav>
  )
}


'use client'

import { useState } from 'react'
import { Calculator, Menu, MapPin } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { siteConfig } from '@/lib/site-config'
import { NavLinks } from './nav-links'
import { Wordmark } from './logo'
import { ButtonLink } from './button-link'
import { WhatsAppButton } from './whatsapp-button'

export function MobileMenu({ links }: { links: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-11 items-center justify-center rounded-full border border-gold/40 text-ivory transition-colors hover:bg-ivory/10 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="surface-dark w-[86%] max-w-sm gap-0 border-l border-gold/30 bg-forest p-0 text-ivory [&>button]:text-ivory"
      >
        <div className="border-b border-gold/20 px-5 py-5">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation and quick actions</SheetDescription>
          <Wordmark tone="light" showTagline />
        </div>
        <nav aria-label="Mobile" className="px-3 py-4">
          <NavLinks links={links} orientation="vertical" onNavigate={close} />
        </nav>
        <div className="mt-auto flex flex-col gap-3 border-t border-gold/20 px-5 py-5">
          <ButtonLink href="/gold-rate#estimator" variant="gold" size="lg" onClick={close}>
            <Calculator aria-hidden="true" />
            Estimate Gold Value
          </ButtonLink>
          <WhatsAppButton size="lg" />
          <p className="mt-2 flex gap-2 text-xs leading-relaxed text-ivory/70">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden="true" />
            {siteConfig.address.landmark}, {siteConfig.address.locality}, {siteConfig.address.city}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

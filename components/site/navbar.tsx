import { Calculator } from 'lucide-react'
import { navLinks } from '@/lib/site-config'
import { LogoLink } from './logo'
import { ButtonLink } from './button-link'
import { WhatsAppButton } from './whatsapp-button'
import { NavLinks } from './nav-links'
import { MobileMenu } from './mobile-menu'

export function Navbar() {
  return (
    <header className="surface-dark sticky top-0 z-40 border-b border-gold/20 bg-forest/95 backdrop-blur supports-[backdrop-filter]:bg-forest/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <LogoLink tone="light" />

        <nav aria-label="Primary" className="hidden lg:block">
          <NavLinks links={navLinks} />
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/gold-rate#estimator" variant="gold" size="sm" className="hidden sm:inline-flex">
            <Calculator aria-hidden="true" />
            Estimate Gold Value
          </ButtonLink>
          <WhatsAppButton
            label="WhatsApp"
            variant="outlineLight"
            size="sm"
            className="hidden xl:inline-flex"
          />
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  )
}

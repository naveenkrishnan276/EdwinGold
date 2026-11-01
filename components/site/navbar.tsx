'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Calculator,
  Menu,
  X,
  MapPin,
  Home,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  PhoneCall,
  ChevronRight,
} from 'lucide-react'
import { navLinks, siteConfig } from '@/lib/site-config'
import { LogoLink, Wordmark } from './logo'
import { ButtonLink } from './button-link'
import { WhatsAppButton } from './whatsapp-button'
import { NavLinks } from './nav-links'

const linkIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  '/': Home,
  '/gold-rate': Sparkles,
  '/how-it-works': HelpCircle,
  '/about': ShieldCheck,
  '/contact': PhoneCall,
}

export function Navbar() {
  const pathname = usePathname()
  const checkboxRef = useRef<HTMLInputElement>(null)

  // Auto-close menu when route changes
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = false
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [pathname])

  const closeMenu = () => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = false
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }

  return (
    <>
      {/* Native checkbox controlling the mobile drawer with hardware-accelerated CSS transition */}
      <input
        ref={checkboxRef}
        type="checkbox"
        id="mobile-nav-toggle"
        onChange={handleCheckboxChange}
        className="peer hidden"
        aria-hidden="true"
      />

      <header className="surface-dark sticky top-0 z-40 border-b border-gold/20 bg-forest pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
          <LogoLink tone="light" />

          {/* Desktop Navigation */}
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

            {/* Mobile Hamburger Trigger */}
            <label
              htmlFor="mobile-nav-toggle"
              style={{ touchAction: 'manipulation' }}
              className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border-2 border-gold/60 bg-[#0A2C24] text-gold shadow-md hover:bg-forest focus:outline-none focus:ring-2 focus:ring-gold active:scale-95 transition-transform lg:hidden cursor-pointer select-none"
              aria-label="Toggle navigation menu"
            >
              <Menu className="pointer-events-none size-6 text-[#F5CF66] stroke-[2.4]" aria-hidden="true" />
            </label>
          </div>
        </div>
      </header>

      {/* Backdrop with smooth fade transition */}
      <label
        htmlFor="mobile-nav-toggle"
        onClick={closeMenu}
        aria-hidden="true"
        className="fixed inset-0 z-[99] bg-black/70 backdrop-blur-xs transition-opacity duration-300 ease-in-out pointer-events-none opacity-0 peer-checked:opacity-100 peer-checked:pointer-events-auto lg:hidden"
      />

      {/* Full-Height Drawer with smooth slide-in transition from right — strictly fixed & non-scrollable */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className="fixed inset-y-0 right-0 z-[100] flex h-[100dvh] max-h-[100dvh] w-full sm:max-w-md flex-col justify-between overflow-hidden overscroll-none bg-[#0F3D32] border-l border-gold/30 text-ivory shadow-2xl transition-transform duration-300 ease-out translate-x-full peer-checked:translate-x-0 lg:hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      >
        {/* Header row: perfectly centered Logo and circular Close button */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gold/20 px-5 sm:px-6 bg-[#0A2C24]">
          <Wordmark tone="light" showTagline={false} />
          <label
            htmlFor="mobile-nav-toggle"
            onClick={closeMenu}
            style={{ touchAction: 'manipulation' }}
            className="inline-flex size-10 items-center justify-center rounded-full border-2 border-gold/60 bg-forest text-gold hover:bg-white/10 active:scale-95 focus:outline-none cursor-pointer select-none"
            aria-label="Close menu"
          >
            <X className="pointer-events-none size-5 text-[#F5CF66] stroke-[2.4]" aria-hidden="true" />
          </label>
        </div>

        {/* Navigation Links list — compact and strictly non-scrollable (overflow-hidden) */}
        <nav aria-label="Mobile Navigation Links" className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-2 overflow-hidden">
          <ul className="flex flex-col gap-1.5 sm:gap-2">
            {navLinks.map((link) => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              const IconComponent = linkIcons[link.href] || Sparkles

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 sm:py-3 transition-all active:scale-[0.98] ${
                      active
                        ? 'bg-gold/20 text-[#F5CF66] border border-gold/50 shadow-sm font-extrabold'
                        : 'border border-transparent text-ivory/95 hover:bg-white/10 hover:text-gold active:bg-white/15 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex size-8 sm:size-9 items-center justify-center rounded-lg ${
                          active ? 'bg-gold/30 text-[#F5CF66]' : 'bg-white/5 text-ivory/80'
                        }`}
                      >
                        <IconComponent className="size-4.5 stroke-[2.2]" />
                      </span>
                      <span className="text-base tracking-wide">{link.label}</span>
                    </div>
                    <ChevronRight
                      className={`size-4 ${active ? 'text-[#F5CF66]' : 'text-ivory/40'}`}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom actions container — compact and fixed at bottom */}
        <div className="shrink-0 flex flex-col gap-2.5 border-t border-gold/20 bg-[#0A2C24] p-4 sm:p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <ButtonLink
            href="/gold-rate#estimator"
            variant="gold"
            size="default"
            onClick={closeMenu}
            className="w-full justify-center font-bold text-forest shadow-md min-h-11 text-sm sm:text-base"
          >
            <Calculator className="size-4.5" aria-hidden="true" />
            Estimate Gold Value
          </ButtonLink>
          <WhatsAppButton size="default" className="w-full justify-center min-h-11 text-sm sm:text-base" />
          <div className="mt-1 flex items-start gap-2 text-ivory/70">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#F5CF66]" aria-hidden="true" />
            <span className="text-[11px] sm:text-xs leading-tight">
              {siteConfig.address.landmark}, {siteConfig.address.locality}, {siteConfig.address.city}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

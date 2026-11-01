'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Calculator, Menu, MapPin, X } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { Wordmark } from './logo'
import { ButtonLink } from './button-link'
import { WhatsAppButton } from './whatsapp-button'

export function MobileMenu({ links }: { links: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Wait until mounted so document.body is available for createPortal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [open])

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggle = () => setOpen((prev) => !prev)
  const close = () => setOpen(false)

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggle}
        className="relative z-30 inline-flex size-11 items-center justify-center rounded-full border border-gold/50 bg-[#0A2C24] text-gold shadow-sm hover:bg-forest focus:outline-none focus:ring-2 focus:ring-gold lg:hidden cursor-pointer active:scale-95 transition-all"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
      >
        {open ? (
          <X className="size-6 text-[#F5CF66] stroke-[2.3]" aria-hidden="true" />
        ) : (
          <Menu className="size-6 text-[#F5CF66] stroke-[2.3]" aria-hidden="true" />
        )}
      </button>

      {/* Render directly onto document.body via Portal to escape header containing block */}
      {mounted && open && createPortal(
        <div
          className="fixed inset-0 z-[100] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Full-screen Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={close}
            aria-hidden="true"
          />

          {/* Full-height Slide Drawer */}
          <div className="fixed inset-y-0 right-0 z-[101] flex w-[85%] max-w-sm flex-col border-l border-gold/30 bg-[#0F3D32] text-ivory shadow-2xl transition-transform animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-gold/20 px-5">
              <Wordmark tone="light" showTagline />
              <button
                type="button"
                onClick={close}
                className="inline-flex size-10 items-center justify-center rounded-full border border-gold/40 bg-[#0A2C24] text-gold hover:bg-white/10 active:scale-95 focus:outline-none cursor-pointer"
                aria-label="Close menu"
              >
                <X className="size-5 text-[#F5CF66] stroke-[2.3]" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation links */}
            <nav aria-label="Mobile Navigation" className="flex-1 overflow-y-auto px-4 py-6">
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className="block rounded-xl px-4 py-3.5 text-base font-bold text-ivory/90 hover:bg-white/10 hover:text-gold active:bg-white/15 transition-colors border border-transparent hover:border-gold/20"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Drawer Footer Actions */}
            <div className="flex flex-col gap-3 border-t border-gold/20 bg-[#0A2C24] p-5 pb-8">
              <ButtonLink
                href="/gold-rate#estimator"
                variant="gold"
                size="lg"
                onClick={close}
                className="w-full justify-center font-bold"
              >
                <Calculator className="size-5" aria-hidden="true" />
                Estimate Gold Value
              </ButtonLink>
              <WhatsAppButton size="lg" className="w-full justify-center" />
              <div className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-ivory/70">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#F5CF66]" aria-hidden="true" />
                <span>{siteConfig.address.landmark}, {siteConfig.address.locality}, {siteConfig.address.city}</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

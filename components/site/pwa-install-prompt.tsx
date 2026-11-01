'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Sparkles } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already in standalone / installed mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if dismissed recently
    const dismissedAt = localStorage.getItem('edwin_pwa_dismissed')
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10)
      if (elapsed < 3 * 24 * 60 * 60 * 1000) {
        // Dismissed within last 3 days
        return
      }
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsVisible(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false)
      }
    } catch (err) {
      console.error('PWA install error:', err)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('edwin_pwa_dismissed', Date.now().toString())
  }

  if (!isVisible || isInstalled) return null

  return (
    <aside
      aria-label="Install mobile app prompt"
      className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-gold/40 bg-forest p-4 text-ivory shadow-2xl backdrop-blur-md transition-all sm:bottom-6 sm:left-auto sm:right-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold-soft ring-1 ring-gold/40">
          <Smartphone className="size-6" />
        </div>
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-soft">
            <Sparkles className="size-3" />
            Android &amp; Mobile Web App
          </div>
          <h4 className="mt-0.5 text-sm font-bold text-white">Add Edwin Gold to Home Screen</h4>
          <p className="mt-0.5 text-xs text-ivory/80 leading-relaxed">
            Check live Chennai rates daily and estimate gold value in 1 tap without opening the browser.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gold px-3.5 py-1.5 text-xs font-bold text-forest shadow-md hover:bg-gold-soft focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <Download className="size-3.5" />
              Add to Home Screen
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-xl px-2.5 py-1.5 text-xs font-medium text-ivory/70 hover:text-white"
            >
              Maybe later
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close install prompt"
          className="rounded-lg p-1 text-ivory/60 hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>
    </aside>
  )
}


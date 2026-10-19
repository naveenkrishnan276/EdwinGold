import { MessageCircle } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { buildWhatsAppUrl, whatsappTemplates } from '@/lib/whatsapp'

export function FloatingWhatsApp() {
  const href = buildWhatsAppUrl(siteConfig.contact.whatsapp, whatsappTemplates.general)
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with EDWIN GOLD on WhatsApp (opens in a new tab)"
      className="fixed bottom-4 right-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-[#1f7a4d] text-white shadow-lg ring-2 ring-ivory transition-transform hover:scale-105 lg:hidden"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  )
}

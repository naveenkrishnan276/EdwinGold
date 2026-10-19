import { MessageCircle } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'
import { siteConfig } from '@/lib/site-config'
import { buildWhatsAppUrl, whatsappTemplates, type WhatsAppTemplate } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'
import { brandButton } from './button-link'

interface WhatsAppButtonProps extends VariantProps<typeof brandButton> {
  template?: WhatsAppTemplate
  message?: string
  label?: string
  className?: string
}

export function isWhatsAppConfigured() {
  return buildWhatsAppUrl(siteConfig.contact.whatsapp, 'x') !== null
}

export function WhatsAppButton({
  template = 'general',
  message,
  label = 'Contact Us on WhatsApp',
  variant = 'whatsapp',
  size,
  className,
}: WhatsAppButtonProps) {
  const href = buildWhatsAppUrl(siteConfig.contact.whatsapp, message ?? whatsappTemplates[template])

  if (!href) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title="WhatsApp number not configured yet"
        className={cn(brandButton({ variant, size }), 'cursor-not-allowed', className)}
      >
        <MessageCircle aria-hidden="true" />
        {label}
        <span className="sr-only">(unavailable — WhatsApp number not configured yet)</span>
      </span>
    )
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn(brandButton({ variant, size }), className)}>
      <MessageCircle aria-hidden="true" />
      {label}
      <span className="sr-only">(opens WhatsApp in a new tab)</span>
    </a>
  )
}

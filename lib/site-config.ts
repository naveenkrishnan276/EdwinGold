/**
 * Central business configuration for EDWIN GOLD.
 *
 * IMPORTANT: Every value set to `null` is a placeholder that MUST be replaced with
 * verified business details before launch. The UI hides or safely degrades any
 * feature whose value is still `null` — never fill these with guessed values.
 *
 * Public contact values can be supplied through NEXT_PUBLIC_* environment
 * variables (see .env.example) or edited directly here.
 */

function env(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function resolveSiteUrl(): string {
  const explicit = env(process.env.NEXT_PUBLIC_SITE_URL)
  if (explicit) return explicit.replace(/\/$/, '')
  const vercel = env(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  if (vercel) return `https://${vercel}`
  return 'http://localhost:3000'
}

const address = {
  landmark: 'Near Oragadam Bus Stop, opposite Naidu Mall',
  locality: 'Ambattur',
  city: 'Chennai',
  region: 'Tamil Nadu',
  country: 'India',
  countryCode: 'IN',
  /** PLACEHOLDER: verified street address (door number, street). */
  streetAddress: null as string | null,
  /** PLACEHOLDER: verified PIN code. */
  postalCode: null as string | null,
}

const fullAddress = [
  address.streetAddress,
  address.landmark,
  address.locality,
  address.city,
  address.region,
  address.postalCode,
  address.country,
]
  .filter(Boolean)
  .join(', ')

export const siteConfig = {
  name: 'EDWIN GOLD',
  descriptor: 'CASH FOR GOLD',
  tagline: 'Your Gold. Your Value.',
  url: resolveSiteUrl(),
  address,
  fullAddress,
  contact: {
    /** PLACEHOLDER: verified phone in international format, e.g. +91XXXXXXXXXX */
    phone: env(process.env.NEXT_PUBLIC_BUSINESS_PHONE),
    /** PLACEHOLDER: verified WhatsApp number in international format, digits only, e.g. 91XXXXXXXXXX */
    whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
    /** PLACEHOLDER: verified business email. */
    email: env(process.env.NEXT_PUBLIC_BUSINESS_EMAIL),
  },
  /** PLACEHOLDER: verified opening hours, e.g. ['Mon–Sat: 10:00 AM – 8:00 PM']. */
  hours: null as string[] | null,
  social: {
    instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    facebook: env(process.env.NEXT_PUBLIC_FACEBOOK_URL),
  },
  maps: {
    directionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      'Oragadam Bus Stop, opposite Naidu Mall, Ambattur, Chennai, Tamil Nadu',
    )}`,
    /** PLACEHOLDER: set only after verifying the exact shop pin on Google Maps. */
    embedUrl: env(process.env.NEXT_PUBLIC_MAP_EMBED_URL),
  },
} as const

export const valuationConfig = {
  /**
   * Buying-rate adjustment (%) approved by EDWIN GOLD. Leave `null` until the
   * business explicitly approves a policy — the calculator then shows a
   * market-rate-based indicative value only, never a purchase offer.
   */
  approvedBuyingAdjustmentPercent: null as number | null,
  maxWeightGrams: 1000,
  weightDecimals: 3,
} as const

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/gold-rate', label: 'Gold Rate' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
] as const

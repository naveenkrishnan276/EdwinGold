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
  streetAddress: 'Near Oragadam Bus Stop',
  postalCode: '600053',
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
    phone: env(process.env.NEXT_PUBLIC_BUSINESS_PHONE) || '+91 9940120170',
    whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) || '919940120170',
    email: env(process.env.NEXT_PUBLIC_BUSINESS_EMAIL) || 'contact@edwingold.com',
  },
  hours: ['Mon–Sat: 10:00 AM – 8:00 PM', 'Sunday: 10:00 AM – 2:00 PM'],
  social: {
    instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    facebook: env(process.env.NEXT_PUBLIC_FACEBOOK_URL),
  },
  maps: {
    directionsUrl: 'https://maps.app.goo.gl/iCzQXCbe9vHUt9B3A?g_st=ic',
    desktopPlaceUrl:
      'https://www.google.com/maps/place/Edwin+Gold/@13.1265142,80.1529368,19z/data=!3m1!4b1!4m6!3m5!1s0x3a5263b65a3b0193:0xe18892ad5eb11a55!8m2!3d13.1265129!4d80.1535805!16s%2Fg%2F11p2fh6f8x?entry=ttu&g_ep=EgoyMDI2MTAyOC4wIKXMDSoASAFQAw%3D%3D',
    embedUrl:
      env(process.env.NEXT_PUBLIC_MAP_EMBED_URL) ||
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1942.7988!2d80.1529368!3d13.1265142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5263b65a3b0193%3A0xe18892ad5eb11a55!2sEdwin%20Gold!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  },
} as const

export const valuationConfig = {
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

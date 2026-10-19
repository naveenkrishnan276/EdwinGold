import { siteConfig } from '@/lib/site-config'

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/** Includes only verified details; unconfigured placeholders are omitted. */
export function LocalBusinessJsonLd() {
  const { address, contact, social } = siteConfig
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.name,
    description: 'Cash for gold — buying gold jewellery and eligible gold items in Ambattur, Chennai.',
    slogan: siteConfig.tagline,
    url: siteConfig.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: [address.streetAddress, address.landmark].filter(Boolean).join(', '),
      addressLocality: `${address.locality}, ${address.city}`,
      addressRegion: address.region,
      addressCountry: address.countryCode,
      ...(address.postalCode ? { postalCode: address.postalCode } : {}),
    },
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(contact.email ? { email: contact.email } : {}),
  }
  const sameAs = [social.instagram, social.facebook].filter(Boolean)
  if (sameAs.length) data.sameAs = sameAs

  return <JsonLd data={data} />
}

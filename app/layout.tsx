import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'
import { FloatingWhatsApp } from '@/components/site/floating-whatsapp'
import { LocalBusinessJsonLd } from '@/components/site/json-ld'
import { siteConfig } from '@/lib/site-config'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'EDWIN GOLD — Cash for Gold in Ambattur, Chennai',
    template: '%s | EDWIN GOLD',
  },
  description:
    'EDWIN GOLD buys gold in Ambattur, Chennai. Check the latest available 24K, 22K and 18K gold rates and estimate your gold value before you visit.',
  applicationName: 'EDWIN GOLD',
  generator: 'v0.app',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'EDWIN GOLD',
    locale: 'en_IN',
    title: 'EDWIN GOLD — Your Gold. Your Value.',
    description: 'Cash for gold in Ambattur, Chennai. Estimate your gold value using the latest available market rates.',
    images: [{ url: '/images/gold-jewellery.png', width: 1024, height: 1024, alt: 'Gold jewellery on green velvet' }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/icon.svg' },
}

export const viewport: Viewport = {
  themeColor: '#0F3D32',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={manrope.variable}>
      <body>
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-gold px-4 py-2 font-semibold text-forest focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <LocalBusinessJsonLd />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

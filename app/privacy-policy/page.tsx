import type { Metadata } from 'next'
import { LegalPage } from '@/components/site/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How the EDWIN GOLD website handles information.',
  alternates: { canonical: '/privacy-policy' },
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      href="/privacy-policy"
      intro="How this website handles your information."
      sections={[
        {
          heading: 'Information you enter',
          body: [
            'The gold value estimator runs entirely in your browser. The weights and purity you enter are not stored or sent to our servers.',
            'If you choose to share an estimate on WhatsApp, the pre-filled message is sent only when you send it from WhatsApp yourself.',
          ],
        },
        {
          heading: 'Analytics',
          body: [
            'We may use privacy-friendly analytics to understand overall site usage, such as page views. This does not identify you personally.',
          ],
        },
        {
          heading: 'Third-party services',
          body: [
            'Links to WhatsApp and Google Maps open those services, which are governed by their own privacy policies.',
          ],
        },
        {
          heading: 'Contact',
          body: ['For any privacy questions, please contact EDWIN GOLD using the details on our Contact page.'],
        },
      ]}
    />
  )
}

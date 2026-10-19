import type { Metadata } from 'next'
import { LegalPage } from '@/components/site/legal-page'

export const metadata: Metadata = {
  title: 'Terms & Disclaimer',
  description: 'Terms of use and gold rate disclaimer for the EDWIN GOLD website.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Disclaimer"
      href="/terms"
      intro="Please read this before relying on any rate or estimate shown on this website."
      sections={[
        {
          heading: 'Gold rates',
          body: [
            'Gold rates shown on this website are reference market rates obtained from a third-party source, labelled with that source and its timestamp. They may be delayed, may differ from local retail or buying rates, and are not EDWIN GOLD’s buying offer.',
          ],
        },
        {
          heading: 'Estimates are not offers',
          body: [
            'The estimator provides an indicative value for information only. It is not a quotation, offer or guarantee.',
            'Any final offer is made only at our store, after physical purity testing, verification of net gold weight and confirmation of the rate at the time of sale.',
          ],
        },
        {
          heading: 'Eligibility and verification',
          body: [
            'Selling gold requires valid identification and is subject to applicable laws and our verification of ownership. We may decline any transaction at our discretion.',
          ],
        },
        {
          heading: 'Changes',
          body: ['We may update these terms from time to time. The version on this page applies.'],
        },
      ]}
    />
  )
}

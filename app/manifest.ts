import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EDWIN GOLD — Cash for Gold Ambattur',
    short_name: 'Edwin Gold',
    description:
      'Live daily gold rates in Ambattur, instant gold value estimator, and transparent non-destructive cash for gold.',
    start_url: '/?source=pwa',
    display: 'standalone',
    background_color: '#FAF8F5',
    theme_color: '#0F3D32',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}


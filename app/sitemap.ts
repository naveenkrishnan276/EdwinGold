import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

const routes = ['', '/gold-rate', '/how-it-works', '/about', '/contact', '/privacy-policy', '/terms']

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: path === '/gold-rate' ? 'daily' : 'monthly',
    priority: path === '' ? 1 : path === '/gold-rate' ? 0.9 : 0.6,
  }))
}

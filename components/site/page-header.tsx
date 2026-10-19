import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { JsonLd } from './json-ld'

interface PageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  breadcrumb: { label: string; href: string }
}

export function PageHeader({ title, description, eyebrow, breadcrumb }: PageHeaderProps) {
  return (
    <section className="surface-dark relative overflow-hidden bg-forest text-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(60%_80%_at_100%_0%,rgb(212_175_55/0.14),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs text-ivory/70">
            <li>
              <Link href="/" className="hover:text-gold">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="text-gold">
              {breadcrumb.label}
            </li>
          </ol>
        </nav>
        {eyebrow && <p className="mt-6 text-xs font-semibold tracking-[0.25em] text-gold">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ivory/80 sm:text-lg">{description}</p>
        )}
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
            { '@type': 'ListItem', position: 2, name: breadcrumb.label, item: `${siteConfig.url}${breadcrumb.href}` },
          ],
        }}
      />
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  id,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  id?: string
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-ink">
          {align === 'left' && <span aria-hidden="true" className="h-px w-8 bg-gold" />}
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="mt-3 text-balance text-2xl font-bold tracking-tight text-forest sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  )
}

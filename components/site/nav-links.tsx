'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavLinksProps {
  links: readonly { href: string; label: string }[]
  orientation?: 'horizontal' | 'vertical'
  onNavigate?: () => void
}

export function NavLinks({ links, orientation = 'horizontal', onNavigate }: NavLinksProps) {
  const pathname = usePathname()
  const vertical = orientation === 'vertical'

  return (
    <ul className={cn(vertical ? 'flex flex-col gap-1' : 'flex items-center gap-1')}>
      {links.map((link) => {
        const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative block rounded-md font-medium transition-colors',
                vertical
                  ? 'px-3 py-3 text-base text-ivory hover:bg-ivory/5'
                  : 'px-3 py-2 text-sm text-ivory/80 hover:text-ivory',
                active && (vertical ? 'bg-ivory/10 text-gold' : 'text-gold hover:text-gold'),
              )}
            >
              {link.label}
              {active && !vertical && (
                <span aria-hidden="true" className="absolute inset-x-3 -bottom-0.5 h-px bg-gold" />
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

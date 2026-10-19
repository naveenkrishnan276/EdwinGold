import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const brandButton = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        gold: 'bg-gold text-forest shadow-sm hover:bg-[#e0bf4f]',
        forest: 'bg-forest text-ivory shadow-sm hover:bg-forest-deep',
        outlineLight: 'border border-gold/60 text-ivory hover:bg-ivory/10',
        outline: 'border border-forest/30 bg-transparent text-forest hover:bg-forest/5',
        whatsapp: 'bg-[#1f7a4d] text-white shadow-sm hover:bg-[#186640]',
      },
      size: {
        default: '',
        lg: 'min-h-12 px-6 text-base',
        sm: 'min-h-10 px-4 text-sm',
      },
    },
    defaultVariants: { variant: 'gold', size: 'default' },
  },
)

type ButtonLinkProps = React.ComponentProps<typeof Link> & VariantProps<typeof brandButton>

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(brandButton({ variant, size }), className)} {...props} />
}

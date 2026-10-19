import { ButtonLink } from '@/components/site/button-link'

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs font-semibold tracking-[0.25em] text-gold-ink">404</p>
      <h1 className="mt-3 text-3xl font-bold text-forest">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The page you are looking for does not exist or has moved.</p>
      <ButtonLink href="/" variant="forest" className="mt-8">
        Back to home
      </ButtonLink>
    </section>
  )
}

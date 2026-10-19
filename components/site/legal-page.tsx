import { PageHeader } from './page-header'

export function LegalPage({
  title,
  href,
  intro,
  sections,
}: {
  title: string
  href: string
  intro: string
  sections: { heading: string; body: string[] }[]
}) {
  return (
    <>
      <PageHeader breadcrumb={{ label: title, href }} title={title} description={intro} />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="rounded-lg border border-[#e8d49a] bg-warning p-3 text-sm text-warning-foreground">
          This page is a general template and should be reviewed by EDWIN GOLD and a qualified professional before
          launch.
        </p>
        {sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-xl font-bold text-forest">{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p} className="mt-3 leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </section>
        ))}
      </article>
    </>
  )
}

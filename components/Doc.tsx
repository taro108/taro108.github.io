/** 고지 페이지 공용 틀. */
export default function Doc({
  title,
  updated,
  children,
}: {
  title: string
  updated?: string
  children: React.ReactNode
}) {
  return (
    <article className="space-y-5 pt-2">
      <header>
        <h1 className="text-xl font-bold text-cream">{title}</h1>
        {updated && <p className="mt-1 text-xs text-muted">시행일 {updated}</p>}
      </header>
      <div className="space-y-5 text-sm leading-relaxed text-cream/85 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-cream [&_li]:ml-4 [&_li]:list-disc [&_ul]:mt-1.5 [&_ul]:space-y-1">
        {children}
      </div>
    </article>
  )
}

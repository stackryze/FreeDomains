export function ConsoleHeader({
  eyebrow,
  title,
  description,
  badge,
  actions,
  monoTitle = false,
}) {
  return (
    <section className="relative bg-grid border-b border-border overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 w-[440px] h-56 bg-[radial-gradient(ellipse_at_top_right,rgba(124,92,255,0.12),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(167,139,255,0.10),transparent_70%)]"
      />

      <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2 min-w-0">
          {eyebrow && (
            <div className="font-sans text-xs font-medium text-muted-foreground tracking-wide">
              {eyebrow}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <h1
              className={`${monoTitle
                ? "font-mono tracking-tight break-all"
                : "font-sans tracking-[-0.03em]"
                } text-2xl sm:text-3xl lg:text-4xl font-semibold leading-[1.1] text-foreground`}
            >
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}

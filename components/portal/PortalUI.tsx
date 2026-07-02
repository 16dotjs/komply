export function NotReady({
  title,
  body,
  footer,
}: {
  title: string;
  body: string;
  footer?: React.ReactNode;
}) {
  return (
    <div className="border border-rule p-8 max-w-lg relative">
      <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-clay pointer-events-none" />
      <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-4">
        Pending
      </p>
      <h2 className="font-display text-2xl font-semibold tracking-tight-display text-ink mb-3">
        {title}
      </h2>
      <p className="font-body text-sm font-light text-ash leading-relaxed">
        {body}
      </p>
      {footer && (
        <div className="mt-6 pt-6 border-t border-rule">{footer}</div>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="border-b border-rule px-8 py-5 flex items-center justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight-display">
          {title}
        </h1>
        <p className="text-[11px] font-light tracking-loose-body text-ash mt-0.5">
          {subtitle}
        </p>
      </div>
      {right}
    </div>
  );
}

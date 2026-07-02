interface TocItem {
  href: string;
  label: string;
}

export function LegalLayout({
  eyebrow,
  title,
  lastUpdated,
  toc,
  children,
}: {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  toc: TocItem[];
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="pt-36 pb-16 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule">
        <div className="max-w-2xl">
          <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-6">
            {eyebrow}
          </p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.92] tracking-tight-display mb-6">
            {title}
          </h1>
          <p className="font-body text-sm font-light tracking-loose-body text-ash">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-8">
          <aside className="hidden md:block md:col-span-3">
            <div className="sticky top-24 space-y-0">
              <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
                Contents
              </p>
              {toc.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block py-2 text-sm font-light text-ash hover:text-ink transition-colors border-l border-rule pl-4 hover:border-clay"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </aside>

          <div className="md:col-span-8 md:col-start-5 space-y-14">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}

export function LegalSection({
  id,
  number,
  category,
  heading,
  first,
  children,
}: {
  id: string;
  number: string;
  category: string;
  heading: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className={first ? undefined : "border-t border-rule pt-14"}>
      <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-4">
        {number} — {category}
      </p>
      <h2 className="font-display text-2xl font-semibold tracking-tight-display text-ink mb-4">
        {heading}
      </h2>
      {children}
    </div>
  );
}

export function LegalParagraph({
  children,
  noMargin,
}: {
  children: React.ReactNode;
  noMargin?: boolean;
}) {
  return (
    <p
      className={`font-body text-sm font-light tracking-loose-body text-ash leading-relaxed ${noMargin ? "" : "mb-4"}`}
    >
      {children}
    </p>
  );
}

export function LegalBulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="w-1 h-1 bg-clay rounded-full mt-2 shrink-0" />
          <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed">
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

export function LegalDefinitionList({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <div
          key={item.title}
          className={`py-4 border-t border-rule ${i === items.length - 1 ? "border-b" : ""}`}
        >
          <p className="font-body text-sm font-light text-ink mb-1">
            {item.title}
          </p>
          <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export function LegalContactBox({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  return (
    <div className="border border-rule p-6">
      <p className="font-body text-sm font-light text-ink mb-1">{name}</p>
      <p className="font-body text-sm font-light tracking-loose-body text-ash">
        {email}
      </p>
    </div>
  );
}

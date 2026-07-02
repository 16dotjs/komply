export function FaqItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group px-5">
      <summary className="flex items-center justify-between py-4 cursor-pointer list-none">
        <span className="font-body text-sm font-light text-ink">
          {question}
        </span>
        <svg
          className="shrink-0 text-ash transition-transform group-open:rotate-45"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="0.75" />
        </svg>
      </summary>
      <p className="font-body text-[12px] font-light text-ash leading-relaxed pb-4">
        {children}
      </p>
    </details>
  );
}

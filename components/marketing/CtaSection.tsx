import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";

export function CtaSection({
  heading,
  body,
  ctaLabel = "Request early access",
}: {
  heading: React.ReactNode;
  body: string;
  ctaLabel?: string;
}) {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 items-center">
        <FadeUp className="md:col-span-7">
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[0.92] tracking-tight-display">
            {heading}
          </h2>
        </FadeUp>
        <FadeUp delay={150} className="md:col-span-4 md:col-start-9">
          <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed mb-8">
            {body}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-ink text-paper text-sm font-light px-8 py-4 hover:bg-clay transition-colors duration-300"
          >
            {ctaLabel}
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { FadeUp } from "@/components/FadeUp";
import { FaqItem } from "@/components/marketing/FaqItem";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Request Access",
};

const NEXT_STEPS = [
  {
    numeral: "I.",
    title: "We review your request",
    body: "Within 48 hours, a team member reads your submission and confirms access.",
  },
  {
    numeral: "II.",
    title: "Onboarding call",
    body: "A 20-minute intake call to walk through your product and map applicable frameworks.",
  },
  {
    numeral: "III.",
    title: "Gap report in 5 days",
    body: "Your first compliance gap report, scored and prioritised, delivered as a structured workbook.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* PAGE HERO */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-20 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 items-end">
          <FadeUp className="md:col-span-7">
            <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-8">
              04 — Access
            </p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.9] tracking-tight-display">
              Request early
              <br />
              access.
            </h1>
          </FadeUp>
          <FadeUp delay={150} className="md:col-span-4">
            <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed mb-6">
              We&apos;re onboarding a limited first cohort of Nigerian fintech
              teams. No demos, no sales calls — just access. We respond
              within 48 hours.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "First cohort — limited spots available",
                "No long-term contract required at intake",
                "Gap report delivered within 5 business days",
              ].map((line) => (
                <div key={line} className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-clay shrink-0" />
                  <span className="font-body text-[12px] font-light text-ash">
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-16">
          <FadeUp className="md:col-span-7">
            <ContactForm />
          </FadeUp>

          {/* SIDEBAR */}
          <FadeUp delay={200} className="md:col-span-4 md:col-start-9 space-y-8">
            <div className="border border-rule p-7 relative">
              <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-clay pointer-events-none" />
              <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-6">
                What happens next
              </p>
              <div className="space-y-6">
                {NEXT_STEPS.map((s, i) => (
                  <div
                    key={s.numeral}
                    className={`flex gap-4 ${i > 0 ? "border-t border-rule pt-6" : ""}`}
                  >
                    <span className="font-display text-clay text-lg font-medium shrink-0 w-6">
                      {s.numeral}
                    </span>
                    <div>
                      <p className="font-body text-sm font-light text-ink mb-1">
                        {s.title}
                      </p>
                      <p className="font-body text-[12px] font-light text-ash leading-relaxed">
                        {s.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-rule divide-y divide-rule">
              <div className="p-5">
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash">
                  Common questions
                </p>
              </div>
              <FaqItem question="Is there a cost to apply?">
                No. Submitting an access request is free. Pricing is
                discussed once we&apos;ve confirmed your onboarding and
                understood your compliance needs.
              </FaqItem>
              <FaqItem question="How selective is the first cohort?">
                We&apos;re onboarding a small initial cohort — around 20
                companies — to ensure the quality of our gap reports and
                monitoring stays high. We prioritise teams with an active
                compliance need.
              </FaqItem>
              <FaqItem question="Do we need an in-house lawyer?">
                No. Most early-stage clients come to us specifically because
                they don&apos;t have one yet. We flag when external legal
                counsel is genuinely necessary.
              </FaqItem>
              <FaqItem question="What if we're already licensed?">
                Regulated entities often have the most to gain from ongoing
                monitoring — license conditions change, new circulars
                introduce obligations, and regulatory examinations require
                fresh documentation. Select &quot;Regulated entity
                already&quot; in the stage field.
              </FaqItem>
            </div>

            <div className="border-t border-rule pt-7">
              <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
                Prefer to reach out directly?
              </p>
              <a
                href="mailto:hello@komply.africa"
                className="font-body text-sm font-light text-ink border-b border-rule pb-0.5 hover:text-clay hover:border-clay transition-colors duration-200"
              >
                hello@komply.africa
              </a>
              <p className="font-body text-[11px] font-light text-ash mt-3">
                For partnership enquiries, investor relations, or press — use
                the same address with the relevant subject line.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { FadeUp } from "@/components/FadeUp";
import { CtaSection } from "@/components/marketing/CtaSection";

export const metadata: Metadata = {
  title: "Process",
};

const TIMELINE = [
  {
    range: "Day 1–2",
    title: "Access granted",
    body: "Onboarding call, intake form, and access to your compliance workspace.",
    flagged: false,
  },
  {
    range: "Day 3–7",
    title: "Framework mapping",
    body: "We map your operations against applicable regulatory frameworks.",
    flagged: false,
  },
  {
    range: "Day 8–10",
    title: "Gap report delivered",
    body: "Scored, prioritised findings with remediation paths and owner assignments.",
    flagged: false,
  },
  {
    range: "Day 11+",
    title: "Ongoing watch",
    body: "Real-time alerts and monthly digests activate. Your compliance posture is live.",
    flagged: true,
  },
];

const SEVERITY_TIERS = [
  {
    tag: "Critical",
    flagged: true,
    title: "Regulatory breach risk",
    body: "Gaps that could attract enforcement action, license suspension, or material fines. Addressed within 30 days with step-by-step remediation paths and ready-to-use policy templates.",
  },
  {
    tag: "Moderate",
    flagged: false,
    title: "Operational exposure",
    body: "Gaps that could cause friction during license applications, investor due diligence, or regulatory examinations. Addressed within 60–90 days with prioritised implementation sequencing.",
  },
  {
    tag: "Informational",
    flagged: false,
    title: "Future-proofing",
    body: "Best-practice gaps and upcoming regulatory changes to plan for. Addressed on a rolling basis as part of ongoing monitoring.",
  },
];

const DELIVERABLES = [
  {
    title: "Remediation workbook",
    body: "Structured spreadsheet with gap ID, severity, owner field, deadline, and status tracker",
  },
  {
    title: "Policy templates",
    body: "Ready-to-customise AML policy, privacy notice, data retention policy, and KYC procedure docs",
  },
  {
    title: "Walkthrough session",
    body: "60-minute call with your team to walk through findings and assign remediation ownership",
  },
];

const WATCH_CARDS = [
  {
    title: "Real-time alerts",
    tag: "Live",
    flagged: true,
    body: "Within 2 hours of any publication from the 8 monitored agencies, you receive a plain-English alert with impact assessment and any required action.",
    footer:
      "Delivered via Slack and email · Relevance filtered to your product category",
  },
  {
    title: "Monthly digest",
    tag: "Monthly",
    flagged: false,
    body: "A consolidated view of everything that moved in the regulatory landscape that month — new circulars, enforcement actions, upcoming consultation deadlines, and what it means for your posture.",
    footer:
      "Delivered first week of each month · Archived in your compliance workspace",
  },
  {
    title: "Posture reviews",
    tag: "Quarterly",
    flagged: false,
    body: "Every quarter, we review your remediation progress, update your framework application matrix for any regulatory changes, and surface new gaps introduced by product changes.",
    footer: "60-min call + updated gap workbook delivery",
  },
  {
    title: "Ad-hoc support",
    tag: "On-demand",
    flagged: true,
    body: "New license application? Investor due diligence? CBN examination? Respond to ad-hoc compliance questions within one business day — without escalating to an external law firm every time.",
    footer: "Included in ongoing retainer · Escalation to legal counsel available",
  },
];

const FAQS = [
  {
    q: "Do we need a lawyer before engaging Komply?",
    a: "No. Komply operates as a compliance intelligence and advisory function, not a law firm. For most startups at seed or Series A, we can handle the day-to-day regulatory workload without external legal counsel. We flag when legal escalation is genuinely necessary.",
  },
  {
    q: "What if we already have an internal compliance officer?",
    a: "Komply works well alongside internal compliance leads — we provide the regulatory intelligence and framework depth that's difficult to maintain in-house without a dedicated team. Many clients use us to augment their compliance officer rather than replace them.",
  },
  {
    q: "How do alerts get filtered to our specific business?",
    a: "During intake, we build a product and business model profile. Every regulatory publication is assessed against this profile before alerting — you won't receive a notification about a banking circular that doesn't apply to your payment product category.",
  },
  {
    q: "How quickly can we get started?",
    a: "We respond to access requests within 48 hours. Once confirmed, onboarding takes a single call and an intake form. Your first gap report is delivered within five business days of that call.",
  },
];

export default function ProcessPage() {
  return (
    <>
      {/* PAGE HERO */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-24 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 items-end">
          <FadeUp className="md:col-span-7">
            <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-8">
              Process
            </p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.9] tracking-tight-display">
              A process built
              <br />
              for speed.
            </h1>
          </FadeUp>
          <FadeUp delay={150} className="md:col-span-4">
            <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed mb-5">
              From first contact to active compliance monitoring — onboarding
              takes less than two weeks. No bureaucracy, no long discovery
              phases.
            </p>
            <div className="flex gap-10">
              <div>
                <p className="font-display text-3xl font-semibold">5</p>
                <p className="text-[11px] font-light tracking-loose-body text-ash mt-1">
                  Business days
                  <br />
                  for gap report
                </p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold">48h</p>
                <p className="text-[11px] font-light tracking-loose-body text-ash mt-1">
                  Response to
                  <br />
                  access requests
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* OVERVIEW TIMELINE (dark) */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule bg-ink text-paper">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8">
          <FadeUp className="md:col-span-3">
            <p
              className="text-[10px] font-light tracking-[0.25em] uppercase mb-4"
              style={{ color: "#bf4a2b" }}
            >
              Overview
            </p>
            <p
              className="font-body text-sm font-light leading-relaxed"
              style={{ color: "rgba(247, 244, 240, 0.55)" }}
            >
              A typical engagement from access request to ongoing monitoring
              looks like this.
            </p>
          </FadeUp>

          <FadeUp delay={100} className="md:col-span-9">
            <div
              className="grid grid-cols-1 sm:grid-cols-4 gap-px"
              style={{ background: "rgba(226, 221, 216, 0.15)" }}
            >
              {TIMELINE.map((t) => (
                <div
                  key={t.range}
                  className="p-6 relative"
                  style={{ background: "#111110" }}
                >
                  {t.flagged && (
                    <div
                      className="absolute top-0 right-0 w-8 h-8 border-t border-r"
                      style={{ borderColor: "#bf4a2b" }}
                    />
                  )}
                  <p
                    className="text-[10px] font-light tracking-[0.2em] uppercase mb-4"
                    style={{ color: "rgba(247, 244, 240, 0.35)" }}
                  >
                    {t.range}
                  </p>
                  <p className="font-display text-xl font-semibold mb-2">
                    {t.title}
                  </p>
                  <p
                    className="font-body text-xs font-light leading-relaxed"
                    style={{ color: "rgba(247, 244, 240, 0.55)" }}
                  >
                    {t.body}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* STEP I — Intake & mapping */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8 items-start">
          <FadeUp className="md:col-span-3">
            <div className="flex items-center gap-4">
              <span className="font-display text-clay text-3xl font-medium">
                I.
              </span>
              <div className="flex-1 h-px bg-rule" />
            </div>
            <p className="font-body text-[11px] font-light tracking-loose-body text-ash mt-3">
              Days 1–7
            </p>
          </FadeUp>

          <FadeUp delay={100} className="md:col-span-9">
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[0.95] tracking-tight-display mb-8">
              Intake & mapping
            </h2>
            <p className="font-body text-[15px] font-light tracking-loose-body text-ash leading-relaxed mb-10 max-w-2xl">
              Everything starts with understanding your business precisely.
              We run a structured intake process — not a generic
              questionnaire — designed to pull out exactly what regulators
              would look for.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-5">
                  What we collect from you
                </p>
                <ul className="space-y-3.5">
                  {[
                    "Business model description and product flows",
                    "Customer types (retail, SME, institutional)",
                    "Transaction types and average volumes",
                    "Existing licenses and regulatory history",
                    "Current data handling and third-party integrations",
                    "Existing internal policies and documentation",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-clay mt-2 shrink-0" />
                      <span className="font-body text-sm font-light text-ink">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-5">
                  What we map it against
                </p>
                <ul className="space-y-3.5">
                  {[
                    "CBN licensing categories and conditions",
                    "NDPC Data Protection Act obligations",
                    "SCUML AML/CFT registration requirements",
                    "SEC digital assets framework (where applicable)",
                    "FIRS digital service VAT obligations",
                    "CAC corporate structure requirements",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-ink mt-2 shrink-0" />
                      <span className="font-body text-sm font-light text-ink">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border border-rule p-6 md:p-8">
              <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
                Deliverable
              </p>
              <p className="font-body text-sm font-light text-ash leading-relaxed">
                A{" "}
                <strong className="text-ink font-normal">
                  Framework Application Matrix
                </strong>{" "}
                — a structured document showing every applicable regulation
                mapped to your product, with the coverage status (compliant /
                gap / not applicable) for each requirement.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* STEP II — Remediation plan */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8 items-start">
          <FadeUp className="md:col-span-3">
            <div className="flex items-center gap-4">
              <span className="font-display text-clay text-3xl font-medium">
                II.
              </span>
              <div className="flex-1 h-px bg-rule" />
            </div>
            <p className="font-body text-[11px] font-light tracking-loose-body text-ash mt-3">
              Days 8–10
            </p>
          </FadeUp>

          <FadeUp delay={100} className="md:col-span-9">
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[0.95] tracking-tight-display mb-8">
              Remediation plan
            </h2>
            <p className="font-body text-[15px] font-light tracking-loose-body text-ash leading-relaxed mb-10 max-w-2xl">
              A gap report is useless without a clear path to close the
              gaps. The remediation plan translates findings into an
              actionable, prioritised workbook your team can execute against
              immediately — with timelines, owners, and template
              documentation where it exists.
            </p>

            <div className="space-y-0 mb-10">
              {SEVERITY_TIERS.map((tier, i) => (
                <div
                  key={tier.tag}
                  className={`grid grid-cols-12 py-5 border-t border-rule items-start gap-4 ${
                    i === SEVERITY_TIERS.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="col-span-12 md:col-span-2">
                    <span
                      className={`text-[10px] font-light tracking-[0.15em] uppercase px-2.5 py-1 border ${
                        tier.flagged
                          ? "text-clay border-clay/40"
                          : "text-ash border-rule"
                      }`}
                    >
                      {tier.tag}
                    </span>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <p className="font-display text-lg font-semibold tracking-tight-display">
                      {tier.title}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <p className="font-body text-sm font-light text-ash leading-relaxed">
                      {tier.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule">
              {DELIVERABLES.map((d) => (
                <div key={d.title} className="bg-paper p-6">
                  <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
                    {d.title}
                  </p>
                  <p className="font-body text-sm font-light text-ash leading-relaxed">
                    {d.body}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* STEP III — Ongoing watch */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8 items-start">
          <FadeUp className="md:col-span-3">
            <div className="flex items-center gap-4">
              <span className="font-display text-clay text-3xl font-medium">
                III.
              </span>
              <div className="flex-1 h-px bg-rule" />
            </div>
            <p className="font-body text-[11px] font-light tracking-loose-body text-ash mt-3">
              Day 11 onwards
            </p>
          </FadeUp>

          <FadeUp delay={100} className="md:col-span-9">
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[0.95] tracking-tight-display mb-8">
              Ongoing watch
            </h2>
            <p className="font-body text-[15px] font-light tracking-loose-body text-ash leading-relaxed mb-10 max-w-2xl">
              Compliance isn&apos;t a one-time audit. The regulatory
              environment shifts constantly — new CBN directives, NDPC
              enforcement actions, SEC rulemaking — and your posture needs to
              shift with it. Ongoing watch is the perpetual engine that
              keeps you ahead.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {WATCH_CARDS.map((card) => (
                <div
                  key={card.title}
                  className={`p-7 relative ${
                    card.flagged
                      ? "border border-clay/25"
                      : "border border-rule"
                  }`}
                >
                  {card.flagged && (
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-clay pointer-events-none" />
                  )}
                  <div className="flex items-start justify-between mb-5">
                    <h3 className="font-display text-xl font-semibold tracking-tight-display">
                      {card.title}
                    </h3>
                    <span
                      className={`text-[10px] font-light tracking-[0.15em] uppercase px-2 py-1 shrink-0 ml-3 border ${
                        card.flagged
                          ? "text-clay border-clay/30"
                          : "text-ash border-rule"
                      }`}
                    >
                      {card.tag}
                    </span>
                  </div>
                  <p className="font-body text-sm font-light text-ash leading-relaxed mb-5">
                    {card.body}
                  </p>
                  <div className="border-t border-rule pt-5">
                    <p className="text-[11px] font-light tracking-loose-body text-ash">
                      {card.footer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-8">
          <FadeUp className="md:col-span-3">
            <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-4">
              Common questions
            </p>
            <div className="w-6 h-px bg-rule" />
          </FadeUp>
          <FadeUp delay={100} className="md:col-span-9">
            <div>
              {FAQS.map((faq, i) => (
                <div
                  key={faq.q}
                  className={`py-7 border-t border-rule ${
                    i === FAQS.length - 1 ? "border-b" : ""
                  }`}
                >
                  <h3 className="font-display text-xl font-semibold tracking-tight-display mb-3">
                    {faq.q}
                  </h3>
                  <p className="font-body text-sm font-light text-ash leading-relaxed max-w-2xl">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <CtaSection
        heading={
          <>
            Start the process
            <br />
            today.
          </>
        }
        body="Fill in a short access request. We'll match you to the right starting point — gap analysis, monitoring, or licensing roadmap — based on your situation."
        ctaLabel="Request early access"
      />
    </>
  );
}

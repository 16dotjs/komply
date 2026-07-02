import type { Metadata } from "next";
import { FadeUp } from "@/components/FadeUp";
import { CtaSection } from "@/components/marketing/CtaSection";

export const metadata: Metadata = {
  title: "Services",
};

const LICENSE_TYPES = [
  {
    name: "PSB License",
    description:
      "Payment Service Bank — for deposit-taking and value-added financial services",
    stage: "Pre-revenue → Seed",
    highlight: false,
  },
  {
    name: "MFB Approval",
    description:
      "Microfinance Bank — required for credit-led or savings product models",
    stage: "Seed → Series A",
    highlight: false,
  },
  {
    name: "PSSP / PTC",
    description:
      "Payment Solution Service Provider — for gateway, switching, and processing services",
    stage: "Any stage",
    highlight: false,
  },
  {
    name: "EMI / AISP",
    description:
      "E-money institution or account information service for open banking builds",
    stage: "Series A+",
    highlight: false,
  },
  {
    name: "SEC VASPs",
    description:
      "Virtual Asset Service Provider registration for crypto and digital asset platforms",
    stage: "Evolving",
    highlight: true,
  },
];

const KYC_CARDS = [
  {
    title: "FATF Compliance",
    body: "Map your transaction flows against the 40 FATF recommendations and Nigeria's NFIU requirements. Risk-based approach documentation and correspondent banking due diligence support.",
  },
  {
    title: "Multi-jurisdiction KYC",
    body: "Customer identification programme design that satisfies Nigerian SCUML requirements alongside Ghana GRA, Kenya CBK, and UK FCA KYC standards simultaneously.",
  },
  {
    title: "Transaction Monitoring",
    body: "Threshold and rule-set design for cross-border transaction monitoring, STR/CTR reporting templates, and vendor evaluation support for screening tools.",
  },
  {
    title: "AML Programme Design",
    body: "End-to-end AML/CFT policy, customer risk rating matrix, PEP and sanctions screening workflow, and annual AML risk assessment documentation.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* PAGE HERO */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-24 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 items-end">
          <FadeUp className="md:col-span-8">
            <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-8">
              Services
            </p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.9] tracking-tight-display">
              Everything you need
              <br />
              to stay compliant.
            </h1>
          </FadeUp>
          <FadeUp delay={150} className="md:col-span-4">
            <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed">
              Four core disciplines covering the full compliance lifecycle —
              from real-time monitoring to cross-border expansion readiness.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* SERVICE 01 — Regulatory Monitoring */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8">
          <FadeUp className="md:col-span-3">
            <p className="font-display text-[4rem] font-semibold text-rule leading-none">
              01
            </p>
          </FadeUp>
          <FadeUp delay={100} className="md:col-span-9">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
              <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[0.95] tracking-tight-display">
                Regulatory
                <br />
                Monitoring
              </h2>
              <span className="self-start md:mt-2 text-[10px] font-light tracking-[0.2em] uppercase text-clay border border-clay/30 px-3 py-1.5">
                Always-on
              </span>
            </div>

            <p className="font-body text-[15px] font-light tracking-loose-body text-ash leading-relaxed mb-12 max-w-2xl">
              The Nigerian regulatory landscape moves faster than any
              compliance team can manually track. Komply ingests every
              circular, directive, consultation paper, and policy update from
              the eight agencies that matter most to fintech — and surfaces
              only what&apos;s relevant to your specific business model.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule mb-12">
              <div className="bg-paper py-6 pr-8">
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
                  What&apos;s covered
                </p>
                <ul className="space-y-3">
                  {[
                    "CBN circulars, policy letters & exposure drafts",
                    "NDPC data protection directives & enforcement actions",
                    "SEC digital assets and investment platform rules",
                    "FIRS digital economy tax updates",
                    "NCC & EFCC enforcement news relevant to fintech",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-clay mt-2 shrink-0" />
                      <span className="font-body text-sm font-light text-ink leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-paper py-6 pl-8">
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
                  How it&apos;s delivered
                </p>
                <ul className="space-y-3">
                  {[
                    "Slack & email alerts within 2 hours of publication",
                    "Plain-English impact summary — no legal jargon",
                    "Monthly digest covering all updates in the period",
                    "Relevance scoring filtered to your product category",
                    "Action-required flags with recommended response timeline",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-ink mt-2 shrink-0" />
                      <span className="font-body text-sm font-light text-ink leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border border-rule p-6 md:p-8 bg-paper relative">
              <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-clay pointer-events-none" />
              <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
                Ideal for
              </p>
              <p className="font-body text-sm font-light text-ash leading-relaxed">
                Startups without in-house legal counsel, Series A+ teams that
                need to brief their board on regulatory risk, and ops leads
                who need to stay ahead of enforcement trends without reading
                40-page circulars.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SERVICE 02 — Gap Analysis (dark section) */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule bg-ink text-paper">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8">
          <FadeUp className="md:col-span-3">
            <p
              className="font-display text-[4rem] font-semibold leading-none"
              style={{ color: "rgba(247, 244, 240, 0.15)" }}
            >
              02
            </p>
          </FadeUp>
          <FadeUp delay={100} className="md:col-span-9">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
              <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[0.95] tracking-tight-display">
                Gap
                <br />
                Analysis
              </h2>
              <span
                className="self-start md:mt-2 text-[10px] font-light tracking-[0.2em] uppercase border px-3 py-1.5"
                style={{ color: "#bf4a2b", borderColor: "rgba(191, 74, 43, 0.35)" }}
              >
                One-time + ongoing
              </span>
            </div>

            <p
              className="font-body text-[15px] font-light tracking-loose-body leading-relaxed mb-12 max-w-2xl"
              style={{ color: "rgba(247, 244, 240, 0.65)" }}
            >
              Most Nigerian fintechs discover compliance gaps during a
              regulatory examination — or worse, an enforcement action.
              Komply&apos;s gap analysis puts you on the front foot: a
              structured audit of your current operations against every
              applicable framework, delivered as an actionable report your
              team can work from immediately.
            </p>

            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-px"
              style={{ background: "rgba(226, 221, 216, 0.15)" }}
            >
              {[
                {
                  phase: "Phase 1",
                  title: "Document review",
                  body: "We review your existing policies, T&Cs, privacy notices, AML/CFT documentation, and any prior regulatory correspondence.",
                },
                {
                  phase: "Phase 2",
                  title: "Operations mapping",
                  body: "A structured interview with your product, legal, and ops leads maps actual workflows against regulatory requirements line by line.",
                },
                {
                  phase: "Phase 3",
                  title: "Gap report",
                  body: "A scored, prioritised report with severity ratings (critical / moderate / informational), owner assignments, and estimated remediation effort.",
                },
              ].map((p) => (
                <div key={p.phase} className="p-7" style={{ background: "#111110" }}>
                  <p
                    className="text-[10px] font-light tracking-[0.2em] uppercase mb-5"
                    style={{ color: "rgba(247, 244, 240, 0.4)" }}
                  >
                    {p.phase}
                  </p>
                  <p className="font-display text-xl font-semibold mb-3">
                    {p.title}
                  </p>
                  <p
                    className="font-body text-sm font-light leading-relaxed"
                    style={{ color: "rgba(247, 244, 240, 0.6)" }}
                  >
                    {p.body}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="mt-8 border-t pt-8"
              style={{ borderColor: "rgba(226, 221, 216, 0.2)" }}
            >
              <div className="flex flex-col sm:flex-row gap-10">
                {[
                  { stat: "5 days", label: "Turnaround from intake call" },
                  { stat: "8+", label: "Frameworks cross-referenced" },
                  { stat: "100%", label: "Findings have action paths" },
                ].map((s, i) => (
                  <div key={s.stat} className="flex gap-10">
                    {i > 0 && (
                      <div
                        className="w-px self-stretch hidden sm:block"
                        style={{ background: "rgba(226, 221, 216, 0.2)" }}
                      />
                    )}
                    <div>
                      <p className="font-display text-4xl font-semibold">
                        {s.stat}
                      </p>
                      <p
                        className="text-[11px] font-light tracking-loose-body mt-1"
                        style={{ color: "rgba(247, 244, 240, 0.5)" }}
                      >
                        {s.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SERVICE 03 — Licensing Roadmap */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8">
          <FadeUp className="md:col-span-3">
            <p className="font-display text-[4rem] font-semibold text-rule leading-none">
              03
            </p>
          </FadeUp>
          <FadeUp delay={100} className="md:col-span-9">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
              <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[0.95] tracking-tight-display">
                Licensing
                <br />
                Roadmap
              </h2>
              <span className="self-start md:mt-2 text-[10px] font-light tracking-[0.2em] uppercase text-clay border border-clay/30 px-3 py-1.5">
                Stage-dependent
              </span>
            </div>

            <p className="font-body text-[15px] font-light tracking-loose-body text-ash leading-relaxed mb-12 max-w-2xl">
              Nigerian fintech licensing is neither linear nor obvious.
              Whether you need a PSB license, MFB approval, or payment
              solution service provider certification depends on your exact
              product, transaction types, and customer segments. We sequence
              the path that fits your current stage and runway — not a
              generic checklist.
            </p>

            <div className="space-y-0 mb-12">
              {LICENSE_TYPES.map((lic, i) => (
                <div
                  key={lic.name}
                  className={`grid grid-cols-12 items-center py-5 border-t border-rule gap-4 ${
                    i === LICENSE_TYPES.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="col-span-12 md:col-span-3">
                    <p className="font-display text-lg font-semibold tracking-tight-display">
                      {lic.name}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-5">
                    <p className="font-body text-sm font-light text-ash">
                      {lic.description}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-4 md:text-right">
                    <span
                      className={`text-[10px] font-light tracking-[0.15em] uppercase border px-2.5 py-1 ${
                        lic.highlight
                          ? "text-clay border-clay/30"
                          : "text-ash border-rule"
                      }`}
                    >
                      {lic.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-rule p-6 md:p-8 relative">
              <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-clay pointer-events-none" />
              <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
                What we deliver
              </p>
              <p className="font-body text-sm font-light text-ash leading-relaxed">
                A sequenced licensing plan with CBN application templates,
                documentation checklists, capital requirement calculations,
                and a realistic timeline for each milestone. We also flag the
                conditions your product or corporate structure needs to meet
                before you apply.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SERVICE 04 — Cross-border KYC / AML */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8">
          <FadeUp className="md:col-span-3">
            <p className="font-display text-[4rem] font-semibold text-rule leading-none">
              04
            </p>
          </FadeUp>
          <FadeUp delay={100} className="md:col-span-9">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
              <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[0.95] tracking-tight-display">
                Cross-border
                <br />
                KYC / AML
              </h2>
              <span className="self-start md:mt-2 text-[10px] font-light tracking-[0.2em] uppercase text-clay border border-clay/30 px-3 py-1.5">
                Expansion-ready
              </span>
            </div>

            <p className="font-body text-[15px] font-light tracking-loose-body text-ash leading-relaxed mb-12 max-w-2xl">
              Expanding beyond Nigeria means inheriting the compliance
              requirements of every market you touch. FATF grey-listing,
              correspondent banking relationships, and dual-jurisdiction AML
              obligations create complexity most early-stage compliance
              teams aren&apos;t built to handle. We are.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {KYC_CARDS.map((card, i) => (
                <div
                  key={card.title}
                  className={`p-7 ${i === KYC_CARDS.length - 1 ? "border border-clay/25" : "border border-rule"}`}
                >
                  <div className="w-8 h-8 border border-clay/40 flex items-center justify-center mb-6">
                    <div className="w-2 h-2 bg-clay rounded-full" />
                  </div>
                  <h3 className="font-display text-xl font-semibold tracking-tight-display mb-3">
                    {card.title}
                  </h3>
                  <p className="font-body text-sm font-light text-ash leading-relaxed">
                    {card.body}
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
            Ready to close
            <br />
            your compliance gaps?
          </>
        }
        body="We're onboarding a limited first cohort. Tell us about your compliance situation and we'll be in touch within 48 hours."
        ctaLabel="Request early access"
      />
    </>
  );
}

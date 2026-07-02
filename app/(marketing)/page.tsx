import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";

const SNAPSHOT = [
  { label: "CBN Licensing", status: "Monitored", color: "text-clay" },
  { label: "NDPC Data Rules", status: "Active", color: "text-green-700" },
  { label: "SEC Digital Assets", status: "Pending", color: "text-clay" },
  { label: "Cross-border KYC", status: "Active", color: "text-green-700" },
  { label: "FIRS Digital VAT", status: "Review", color: "text-ash" },
];

const TICKER_ITEMS = ["CBN", "NDPC", "SEC Nigeria", "FIRS", "NCC", "EFCC", "CAC", "FATF"];

interface ServiceCard {
  n: string;
  title: string;
  body: string;
  span: string;
  dark: boolean;
  highlight?: boolean;
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    n: "01",
    title: "Regulatory Monitoring",
    body: "Real-time alerts when CBN, NDPC, or SEC publishes new directives, circulars, or policy updates relevant to your product and business model.",
    span: "md:col-span-7 md:translate-x-5",
    dark: false,
  },
  {
    n: "02",
    title: "Gap Analysis",
    body: "We audit your operations against applicable frameworks and surface the exact gaps — before regulators do.",
    span: "md:col-span-5",
    dark: true,
  },
  {
    n: "03",
    title: "Licensing Roadmap",
    body: "PSB, MFB, payment solution licenses — sequenced by your current stage and funding runway.",
    span: "md:col-span-5 md:-translate-x-5",
    dark: false,
  },
  {
    n: "04",
    title: "Cross-border KYC / AML",
    body: "Navigate FATF recommendations, cross-border transaction monitoring, and multi-jurisdiction AML reporting for fintechs expanding beyond Nigeria.",
    span: "md:col-span-7",
    dark: false,
    highlight: true,
  },
];

const PROCESS_STEPS = [
  {
    numeral: "I.",
    title: "Intake & mapping",
    body: "You share your business model, product stack, and existing licenses. We map every applicable framework and produce a gap report within five business days.",
  },
  {
    numeral: "II.",
    title: "Remediation plan",
    body: "A prioritised, sequenced action plan with ownership assignments, deadlines, and template documentation where applicable — delivered as a structured workbook.",
  },
  {
    numeral: "III.",
    title: "Ongoing watch",
    body: "Monthly regulatory digests and real-time Slack alerts whenever a new directive affects your compliance posture. No guessing, no surprises.",
  },
];

const COVERAGE_CARDS = [
  { code: "CBN", body: "Payment licensing, PSB, MFB, EMI frameworks and circulars" },
  { code: "NDPC", body: "Data processing obligations, user consent, breach notification" },
  { code: "SEC", body: "Digital assets, investment platforms, token classification rules" },
  { code: "FIRS", body: "VAT on digital services, transfer pricing, BEPS compliance" },
  { code: "NCC", body: "USSD regulations, telco-fintech partnerships, SIM-based KYC" },
];

function ArrowIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
      <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}

function ServiceCardBlock({ card, delay }: { card: ServiceCard; delay: number }) {
  const wrapperClass = card.dark
    ? `${card.span} border border-rule p-8 md:p-10 bg-ink text-paper`
    : card.highlight
      ? `${card.span} border border-clay/25 p-8 md:p-10`
      : `${card.span} border border-rule p-8 md:p-10`;

  return (
    <FadeUp delay={delay} className={wrapperClass}>
      <p
        className={
          card.dark
            ? "font-display text-6xl font-semibold mb-8 leading-none"
            : "font-display text-6xl font-semibold text-rule mb-8 leading-none"
        }
        style={card.dark ? { color: "rgba(247, 244, 240, 0.15)" } : undefined}
      >
        {card.n}
      </p>
      <h3 className="font-display text-[1.6rem] font-semibold tracking-tight-display mb-4">
        {card.title}
      </h3>
      <p
        className={
          card.dark
            ? "font-body text-sm font-light tracking-loose-body leading-relaxed"
            : "font-body text-sm font-light tracking-loose-body text-ash leading-relaxed"
        }
        style={card.dark ? { color: "rgba(247, 244, 240, 0.65)" } : undefined}
      >
        {card.body}
      </p>
    </FadeUp>
  );
}

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="pt-36 pb-20 md:pt-44 md:pb-36 px-6 md:px-12 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-14 md:gap-x-8 items-start">
          <FadeUp className="md:col-span-7 bleed-left">
            <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-8">
              Regulatory Intelligence for African Fintech
            </p>
            <h1 className="font-display text-[clamp(3rem,8.5vw,6.75rem)] font-semibold leading-[0.9] tracking-tight-display text-ink">
              Stay ahead
              <br />
              of Nigerian
              <br />
              regulation.
            </h1>
            <div className="w-10 h-px bg-clay mt-10 mb-8" />
            <p className="font-body text-sm md:text-[15px] font-light tracking-loose-body text-ash leading-relaxed max-w-xs md:max-w-sm">
              Komply helps African fintech startups navigate CBN, NDPC, SEC,
              and cross-border compliance — before it becomes a crisis.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="bg-ink text-paper text-sm font-light px-8 py-4 hover:bg-clay transition-colors duration-300 text-center"
              >
                Request early access
              </Link>
              <Link
                href="/process"
                className="border border-rule text-ink text-sm font-light px-8 py-4 hover:border-ash transition-colors duration-300 text-center"
              >
                See how it works
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={200} className="md:col-span-4 md:col-start-9">
            <div className="border border-rule p-7 md:p-8 bg-paper relative">
              <div className="absolute top-0 right-0 w-14 h-14 border-t border-r border-clay pointer-events-none" />
              <p className="text-[10px] font-light tracking-[0.25em] uppercase text-ash mb-7">
                Compliance snapshot
              </p>
              <div className="space-y-0">
                {SNAPSHOT.map((s, i) => (
                  <div
                    key={s.label}
                    className={`flex items-center justify-between py-3.5 ${i < SNAPSHOT.length - 1 ? "border-b border-rule" : ""}`}
                  >
                    <span className="font-body text-sm font-light">{s.label}</span>
                    <span className={`text-[10px] font-light tracking-[0.15em] uppercase ${s.color}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-7 pt-6 border-t border-rule flex items-end justify-between">
                <div>
                  <p className="font-display text-5xl font-semibold text-ink leading-none">
                    4/6
                  </p>
                  <p className="text-[10px] font-light tracking-loose-body text-ash mt-2">
                    Frameworks tracked
                  </p>
                </div>
                <div className="w-10 h-px bg-clay mb-1" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* TICKER */}
      <div className="border-y border-rule overflow-hidden py-[14px] bg-ink">
        <div className="ticker-inner select-none">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="text-paper font-display text-[11px] font-light tracking-[0.2em] uppercase whitespace-nowrap px-8">
                {item}
              </span>
              <span className="text-clay text-base px-2">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES OVERVIEW */}
      <section className="py-24 md:py-36 px-6 md:px-12 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-8 items-start">
          <FadeUp className="md:col-span-3">
            <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-4">
              01 — Services
            </p>
            <div className="w-6 h-px bg-rule" />
          </FadeUp>

          <div className="md:col-span-9">
            <FadeUp>
              <h2 className="font-display text-[clamp(2rem,5vw,4.25rem)] font-semibold leading-[0.92] tracking-tight-display mb-16">
                Compliance without
                <br />
                the complexity.
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 md:gap-6">
              {SERVICE_CARDS.map((card, i) => (
                <ServiceCardBlock key={card.n} card={card} delay={i * 150} />
              ))}
            </div>

            <FadeUp className="mt-10">
              <Link
                href="/services"
                className="inline-flex items-center gap-3 text-sm font-light tracking-loose-body text-ink border-b border-ink pb-0.5 hover:text-clay hover:border-clay transition-colors duration-300"
              >
                View all services
                <ArrowIcon />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* PROCESS OVERVIEW */}
      <section className="py-24 md:py-36 px-6 md:px-12 max-w-screen-xl mx-auto border-t border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-8">
          <FadeUp className="md:col-span-3">
            <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-4">
              02 — Process
            </p>
            <div className="w-6 h-px bg-rule" />
          </FadeUp>

          <div className="md:col-span-9">
            <FadeUp>
              <h2 className="font-display text-[clamp(2rem,5vw,4.25rem)] font-semibold leading-[0.92] tracking-tight-display mb-16">
                Three steps.
                <br />
                No ambiguity.
              </h2>
            </FadeUp>

            <div>
              {PROCESS_STEPS.map((step, i) => (
                <FadeUp
                  key={step.numeral}
                  delay={i * 100}
                  className="grid grid-cols-1 md:grid-cols-12 py-10 border-t border-rule gap-y-4 md:gap-x-8"
                >
                  <div className="md:col-span-1">
                    <span className="font-display text-clay text-xl font-medium">
                      {step.numeral}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="font-display text-[1.4rem] font-semibold tracking-tight-display">
                      {step.title}
                    </h3>
                  </div>
                  <div className="md:col-span-7">
                    <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </FadeUp>
              ))}

              <FadeUp className="border-t border-rule pt-8">
                <Link
                  href="/process"
                  className="inline-flex items-center gap-3 text-sm font-light tracking-loose-body text-ink border-b border-ink pb-0.5 hover:text-clay hover:border-clay transition-colors duration-300"
                >
                  See full process detail
                  <ArrowIcon />
                </Link>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* COVERAGE OVERVIEW */}
      <section className="py-24 md:py-36 px-6 md:px-12 max-w-screen-xl mx-auto border-t border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-8">
          <FadeUp className="md:col-span-3">
            <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-4">
              03 — Coverage
            </p>
            <div className="w-6 h-px bg-rule" />
          </FadeUp>

          <div className="md:col-span-9">
            <FadeUp>
              <h2 className="font-display text-[clamp(2rem,5vw,4.25rem)] font-semibold leading-[0.92] tracking-tight-display mb-16">
                Every framework
                <br />
                that matters.
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-rule">
              {COVERAGE_CARDS.map((c, i) => (
                <FadeUp key={c.code} delay={i * 100} className="bg-paper p-7 md:p-8">
                  <p className="font-display text-2xl font-semibold tracking-tight-display mb-3">
                    {c.code}
                  </p>
                  <p className="text-[12px] font-light tracking-loose-body text-ash leading-relaxed">
                    {c.body}
                  </p>
                </FadeUp>
              ))}
              <FadeUp delay={500} className="bg-ink p-7 md:p-8">
                <p className="font-display text-2xl font-semibold tracking-tight-display mb-3 text-paper">
                  +3 more
                </p>
                <p
                  className="text-[12px] font-light tracking-loose-body leading-relaxed"
                  style={{ color: "rgba(247, 244, 240, 0.65)" }}
                >
                  EFCC, CAC, FATF cross-border — coverage expanding quarterly
                </p>
              </FadeUp>
            </div>

            <FadeUp className="mt-10">
              <Link
                href="/coverage"
                className="inline-flex items-center gap-3 text-sm font-light tracking-loose-body text-ink border-b border-ink pb-0.5 hover:text-clay hover:border-clay transition-colors duration-300"
              >
                See full coverage map
                <ArrowIcon />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}

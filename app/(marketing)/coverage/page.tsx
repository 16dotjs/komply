import type { Metadata } from "next";
import { FadeUp } from "@/components/FadeUp";
import { CtaSection } from "@/components/marketing/CtaSection";

export const metadata: Metadata = {
  title: "Coverage",
};

interface Regulator {
  code: string;
  badge: string;
  badgeStyle: "full" | "monitored" | "crossborder";
  fullName: string;
  description: string;
  detail: string;
  covers: string[];
}

const REGULATORS: Regulator[] = [
  {
    code: "CBN",
    badge: "Full coverage",
    badgeStyle: "full",
    fullName: "Central Bank of Nigeria",
    description:
      "The primary licensing and supervisory authority for payment institutions, MFBs, PSBs, and all deposit-taking entities.",
    detail:
      "We track every circular, policy letter, consultation paper, and enforcement action. CBN regulation is the single highest-impact framework for most Nigerian fintechs.",
    covers: [
      "Payment System Vision 2026",
      "PSB Licensing Framework",
      "MFB Regulatory Guidelines",
      "Open Banking Framework",
      "eNaira and CBDC guidance",
      "Consumer protection regulations",
    ],
  },
  {
    code: "NDPC",
    badge: "Full coverage",
    badgeStyle: "full",
    fullName: "Nigeria Data Protection Commission",
    description:
      "Nigeria's data protection regulator, overseeing the Nigeria Data Protection Act 2023 and its implementing guidelines.",
    detail:
      "Every fintech that collects, processes, or stores Nigerian citizen data is a data controller under NDPA — which means NDPC compliance isn't optional.",
    covers: [
      "NDPA 2023 obligations",
      "Data Protection Compliance Audit",
      "Breach notification requirements",
      "Cross-border data transfer rules",
      "User consent framework",
      "DPCO licensing obligations",
    ],
  },
  {
    code: "SEC",
    badge: "Full coverage",
    badgeStyle: "full",
    fullName: "Securities & Exchange Commission",
    description:
      "Regulates capital markets, investment products, and digital assets including virtual assets and crypto platforms.",
    detail:
      "SEC's digital assets framework is among the most actively evolving in Nigeria's regulatory landscape — and one of the most consequential for crypto, DeFi, and tokenised asset platforms.",
    covers: [
      "Digital Assets Rules 2022",
      "VASP registration framework",
      "Token classification guidance",
      "Investment platform licensing",
      "Crowdfunding regulation",
      "Capital market amendments",
    ],
  },
  {
    code: "FIRS",
    badge: "Monitored",
    badgeStyle: "monitored",
    fullName: "Federal Inland Revenue Service",
    description:
      "Nigeria's tax authority, increasingly active on digital economy taxation including VAT on digital services and BEPS implementation.",
    detail:
      "Finance Acts have introduced material VAT obligations on digital service providers that many fintechs underestimate — particularly those with B2C SaaS components or cross-border remittance volumes.",
    covers: [
      "Finance Act amendments (annual)",
      "VAT on digital services",
      "Transfer pricing rules",
      "BEPS Pillar Two obligations",
      "WHT on fintech transactions",
      "Foreign currency income tax",
    ],
  },
  {
    code: "NCC",
    badge: "Monitored",
    badgeStyle: "monitored",
    fullName: "Nigerian Communications Commission",
    description:
      "Telecoms regulator with significant fintech implications through USSD pricing, SIM-based KYC, and telco-fintech partnership rules.",
    detail:
      "USSD-based payment services and mobile wallet providers have direct NCC obligations. The NCC-CBN interface is particularly complex for fintechs with telco partnerships.",
    covers: [
      "USSD service pricing regulations",
      "SIM-registration & KYC linkage",
      "Telco-fintech MoU requirements",
      "Mobile financial service guidelines",
    ],
  },
  {
    code: "EFCC",
    badge: "Monitored",
    badgeStyle: "monitored",
    fullName: "Economic & Financial Crimes Commission",
    description:
      "Primary AML enforcement agency with prosecutorial powers over financial crime. Enforcement actions increasingly target digital platforms.",
    detail:
      "We monitor EFCC enforcement actions, prosecution trends, and guidance that signals what patterns are drawing investigative scrutiny — so you can address them before they become an issue.",
    covers: [
      "AML enforcement actions",
      "SCUML registration requirements",
      "Fintech prosecution trends",
      "STR/CTR reporting guidance",
    ],
  },
  {
    code: "CAC",
    badge: "Monitored",
    badgeStyle: "monitored",
    fullName: "Corporate Affairs Commission",
    description:
      "Governs company incorporation, beneficial ownership registration, and corporate structure requirements relevant to licensing applications.",
    detail:
      "CAC compliance is often the overlooked foundation of CBN and SEC licensing applications — incorrect corporate structure or missing beneficial ownership declarations cause application delays.",
    covers: [
      "CAMA 2020 updates",
      "Beneficial ownership registration",
      "Annual returns obligations",
      "Directorship & shareholding rules",
    ],
  },
  {
    code: "FATF",
    badge: "Cross-border",
    badgeStyle: "crossborder",
    fullName: "Financial Action Task Force",
    description:
      "International AML/CFT standard-setter. FATF recommendations form the basis of Nigeria's NFIU framework and are prerequisite for correspondent banking relationships.",
    detail:
      "Nigeria's periodic FATF grey-list status makes FATF alignment critical — correspondent banks and international partners scrutinise your FATF posture during due diligence.",
    covers: [
      "40 Recommendations alignment",
      "Travel Rule compliance",
      "Nigeria MER follow-up actions",
      "Grey-list remediation guidance",
      "Risk-based approach standards",
      "VASP FATF guidance",
    ],
  },
];

const ROADMAP = [
  {
    name: "Ghana BoG",
    body: "Bank of Ghana PSP licensing and e-money issuer frameworks for West Africa expansion",
    eta: "Q3 2026",
  },
  {
    name: "Kenya CBK",
    body: "Central Bank of Kenya payment service provider licensing, including M-Pesa API compliance",
    eta: "Q3 2026",
  },
  {
    name: "UK FCA",
    body: "FCA EMI and PI authorisation for Nigerian fintechs with UK operations or fundraising",
    eta: "Q4 2026",
  },
];

function badgeClasses(style: Regulator["badgeStyle"]) {
  if (style === "monitored") return "text-ash border-rule";
  return "text-clay border-clay/40"; // full + crossborder share the clay treatment
}

export default function CoveragePage() {
  return (
    <>
      {/* PAGE HERO */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-24 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 items-end">
          <FadeUp className="md:col-span-7">
            <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-8">
              Coverage
            </p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.9] tracking-tight-display">
              Every framework
              <br />
              that matters.
            </h1>
          </FadeUp>
          <FadeUp delay={150} className="md:col-span-4">
            <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed mb-6">
              Eight regulatory bodies. Hundreds of circulars and directives.
              One consolidated view of what applies to your product.
            </p>
            <div className="flex gap-10">
              <div>
                <p className="font-display text-3xl font-semibold">8</p>
                <p className="text-[11px] font-light tracking-loose-body text-ash mt-1">
                  Agencies monitored
                </p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold">
                  Quarterly
                </p>
                <p className="text-[11px] font-light tracking-loose-body text-ash mt-1">
                  Coverage expansion
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SUMMARY BAR */}
      <section className="py-10 px-6 md:px-12 max-w-screen-xl mx-auto border-b border-rule">
        <FadeUp className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-rule">
          <div className="md:pr-10">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-2">
              Regulatory bodies
            </p>
            <p className="font-display text-4xl font-semibold">8</p>
          </div>
          <div className="md:px-10">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-2">
              Frameworks tracked
            </p>
            <p className="font-display text-4xl font-semibold">24+</p>
          </div>
          <div className="md:px-10">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-2">
              Alert latency
            </p>
            <p className="font-display text-4xl font-semibold">&lt;2h</p>
          </div>
          <div className="md:pl-10">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-2">
              Coverage status
            </p>
            <p className="font-display text-4xl font-semibold text-clay">
              Live
            </p>
          </div>
        </FadeUp>
      </section>

      {/* FRAMEWORK DETAIL ROWS */}
      <section className="py-16 px-6 md:px-12 max-w-screen-xl mx-auto">
        <FadeUp>
          <p className="text-[10px] font-light tracking-[0.25em] uppercase text-ash mb-10">
            Primary Nigerian regulators
          </p>
        </FadeUp>

        {REGULATORS.map((reg, i) => (
          <FadeUp
            key={reg.code}
            className={`grid grid-cols-1 md:grid-cols-12 py-10 border-t border-rule gap-y-6 md:gap-x-8 ${
              i === REGULATORS.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-3">
                <span className="font-display text-2xl font-semibold tracking-tight-display">
                  {reg.code}
                </span>
                <span
                  className={`text-[9px] font-light tracking-[0.15em] uppercase border px-2 py-1 ${badgeClasses(reg.badgeStyle)}`}
                >
                  {reg.badge}
                </span>
              </div>
              <p className="text-[11px] font-light text-ash mt-2 leading-tight">
                {reg.fullName}
              </p>
            </div>
            <div className="md:col-span-4">
              <p className="font-body text-sm font-light text-ink leading-relaxed mb-4">
                {reg.description}
              </p>
              <p className="font-body text-[12px] font-light text-ash leading-relaxed">
                {reg.detail}
              </p>
            </div>
            <div className="md:col-span-6">
              <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
                What we cover
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {reg.covers.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 py-2 border-b border-rule"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-clay shrink-0" />
                    <span className="font-body text-[12px] font-light">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        ))}
      </section>

      {/* UPCOMING COVERAGE (dark) */}
      <section className="py-16 px-6 md:px-12 max-w-screen-xl mx-auto border-t border-rule bg-ink text-paper">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8">
          <FadeUp className="md:col-span-3">
            <p
              className="text-[10px] font-light tracking-[0.25em] uppercase mb-4"
              style={{ color: "#bf4a2b" }}
            >
              On the roadmap
            </p>
            <p
              className="font-body text-sm font-light leading-relaxed"
              style={{ color: "rgba(247, 244, 240, 0.55)" }}
            >
              Coverage expanding quarterly. These frameworks are next in
              line.
            </p>
          </FadeUp>
          <FadeUp delay={100} className="md:col-span-9">
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-px"
              style={{ background: "rgba(226, 221, 216, 0.15)" }}
            >
              {ROADMAP.map((r) => (
                <div key={r.name} className="p-7" style={{ background: "#111110" }}>
                  <p className="font-display text-xl font-semibold mb-3">
                    {r.name}
                  </p>
                  <p
                    className="text-[12px] font-light leading-relaxed"
                    style={{ color: "rgba(247, 244, 240, 0.55)" }}
                  >
                    {r.body}
                  </p>
                  <p
                    className="text-[10px] font-light tracking-[0.15em] uppercase mt-4"
                    style={{ color: "rgba(191, 74, 43, 0.8)" }}
                  >
                    {r.eta}
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
            See which frameworks
            <br />
            apply to you.
          </>
        }
        body="Not every framework applies to every business. Request access and we'll map your specific obligations in the intake process."
        ctaLabel="Request early access"
      />
    </>
  );
}

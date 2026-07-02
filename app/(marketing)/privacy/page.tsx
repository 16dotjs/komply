import type { Metadata } from "next";
import {
  LegalLayout,
  LegalSection,
  LegalParagraph,
  LegalBulletList,
  LegalDefinitionList,
  LegalContactBox,
} from "@/components/marketing/Legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const TOC = [
  { href: "#overview", label: "Overview" },
  { href: "#collect", label: "What we collect" },
  { href: "#use", label: "How we use it" },
  { href: "#share", label: "Who we share with" },
  { href: "#retention", label: "Data retention" },
  { href: "#rights", label: "Your rights" },
  { href: "#security", label: "Security" },
  { href: "#contact-us", label: "Contact us" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated="May 2026"
      toc={TOC}
    >
      <LegalSection id="overview" number="01" category="Overview" heading="Who we are" first>
        <LegalParagraph>
          Komply is a compliance intelligence service for African fintech
          startups. We help early-stage financial technology companies
          understand and navigate Nigerian regulatory frameworks including
          CBN, NDPC, SEC Nigeria, FIRS, NCC, and FATF cross-border
          requirements.
        </LegalParagraph>
        <LegalParagraph noMargin>
          This privacy policy explains how we collect, use, store, and
          protect the personal and business data you share with us when you
          use our website, submit a request for access, or use our client
          portal. We are committed to protecting your data in accordance
          with the Nigeria Data Protection Act 2023 (NDPA) and the
          regulations of the Nigeria Data Protection Commission (NDPC).
        </LegalParagraph>
      </LegalSection>

      <LegalSection id="collect" number="02" category="Data collection" heading="What we collect">
        <LegalParagraph>
          We collect only what we need to provide our compliance services.
          This includes:
        </LegalParagraph>
        <LegalDefinitionList
          items={[
            {
              title: "Contact information",
              body: "Your name, work email address, and company name when you submit a request for access or create a portal account.",
            },
            {
              title: "Business information",
              body: "Your company's stage, business model, product description, existing licenses, applicable regulatory frameworks, and compliance concerns — shared during onboarding and maintained in your client profile.",
            },
            {
              title: "Compliance data",
              body: "Gap analysis results, licensing roadmap progress, remediation task status, and audit readiness information generated as part of our service delivery.",
            },
            {
              title: "Usage data",
              body: "Standard web server logs including IP address, browser type, pages visited, and timestamps. We do not use third-party analytics or advertising trackers.",
            },
            {
              title: "Communications",
              body: "Records of emails and messages exchanged between you and the Komply team in connection with service delivery.",
            },
          ]}
        />
      </LegalSection>

      <LegalSection id="use" number="03" category="Data use" heading="How we use your data">
        <LegalParagraph>
          Our lawful basis for processing your data is contractual necessity
          — we process your data because you have entered into or are
          seeking to enter into a service agreement with Komply. We use your
          data to:
        </LegalParagraph>
        <LegalBulletList
          items={[
            "Review and respond to your access request",
            "Set up and maintain your compliance portal account",
            "Generate and deliver gap analysis reports, licensing roadmaps, and audit readiness assessments",
            "Send regulatory alerts relevant to your business profile",
            "Communicate with you about your compliance status and service updates",
            "Improve our service and regulatory intelligence coverage",
          ]}
        />
        <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed mt-6">
          We do not use your data for advertising, sell it to third parties,
          or share it with any party not directly involved in delivering
          your Komply service.
        </p>
      </LegalSection>

      <LegalSection id="share" number="04" category="Data sharing" heading="Who we share your data with">
        <LegalParagraph>
          We share your data only with the following third-party processors
          who help us deliver our service. Each processor operates under a
          Data Processing Agreement and handles your data only as instructed
          by Komply.
        </LegalParagraph>
        <LegalDefinitionList
          items={[
            {
              title: "Supabase",
              body: "Our database, authentication, and storage provider. Your data is stored on Supabase's servers in the EU (Stockholm region) and encrypted at rest.",
            },
            {
              title: "Resend",
              body: "Our email delivery provider. Used to send access confirmations, regulatory alerts, and service notifications.",
            },
            {
              title: "Anthropic (Claude API)",
              body: "Used to power our automated gap analysis engine. Your business profile data is sent to Claude's API to generate compliance analysis. Anthropic does not train on API data by default.",
            },
          ]}
        />
      </LegalSection>

      <LegalSection id="retention" number="05" category="Retention" heading="How long we keep your data">
        <LegalParagraph>
          We retain your data for as long as your Komply account is active
          and for 90 days after account closure. After 90 days, we
          permanently delete all personal and business data associated with
          your account from our systems and those of our processors.
        </LegalParagraph>
        <LegalParagraph noMargin>
          Access request data from visitors who did not become clients is
          retained for 12 months and then deleted.
        </LegalParagraph>
      </LegalSection>

      <LegalSection id="rights" number="06" category="Your rights" heading="Your data rights">
        <LegalParagraph>
          Under the Nigeria Data Protection Act 2023, you have the following
          rights regarding your personal data:
        </LegalParagraph>
        <LegalBulletList
          items={[
            <>
              <span className="text-ink">Right of access</span> — request a
              copy of all data we hold about you
            </>,
            <>
              <span className="text-ink">Right to rectification</span> —
              request correction of inaccurate data
            </>,
            <>
              <span className="text-ink">Right to erasure</span> — request
              deletion of your data at any time
            </>,
            <>
              <span className="text-ink">Right to portability</span> —
              request your data in a structured, machine-readable format
            </>,
            <>
              <span className="text-ink">Right to object</span> — object to
              processing of your data for specific purposes
            </>,
          ]}
        />
        <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed mt-6">
          To exercise any of these rights, email us at{" "}
          <span className="text-ink">privacy@komply.co</span>. We will
          respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection id="security" number="07" category="Security" heading="How we protect your data">
        <LegalParagraph>
          We implement the following technical and organisational measures
          to protect your data:
        </LegalParagraph>
        <LegalBulletList
          items={[
            "All data encrypted at rest using AES-256 encryption",
            "All data in transit encrypted via TLS 1.2+",
            "Row Level Security enforced on all database tables — clients can only access their own data",
            "Authentication required to access all client and admin portal pages",
            "Access to production systems limited to authorised Komply personnel only",
          ]}
        />
        <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed mt-6">
          In the event of a data breach, we will notify affected individuals
          and the NDPC within 72 hours of discovery, in accordance with
          NDPA 2023 requirements.
        </p>
      </LegalSection>

      <LegalSection id="contact-us" number="08" category="Contact" heading="Questions about this policy">
        <LegalParagraph>
          If you have any questions about this privacy policy or how we
          handle your data, contact us at:
        </LegalParagraph>
        <LegalContactBox name="Komply" email="privacy@komply.co" />
        <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed mt-6">
          We may update this policy periodically. Material changes will be
          communicated to active clients via email. The date at the top of
          this page reflects the most recent update.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

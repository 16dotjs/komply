import type { Metadata } from "next";
import {
  LegalLayout,
  LegalSection,
  LegalParagraph,
  LegalBulletList,
  LegalContactBox,
} from "@/components/marketing/Legal";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const TOC = [
  { href: "#agreement", label: "Agreement" },
  { href: "#services", label: "Services" },
  { href: "#accounts", label: "Accounts" },
  { href: "#payment", label: "Payment" },
  { href: "#ip", label: "Intellectual property" },
  { href: "#disclaimer", label: "Disclaimer" },
  { href: "#liability", label: "Liability" },
  { href: "#termination", label: "Termination" },
  { href: "#governing", label: "Governing law" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms of Service"
      lastUpdated="May 2026"
      toc={TOC}
    >
      <LegalSection id="agreement" number="01" category="Agreement" heading="Your agreement with Komply" first>
        <LegalParagraph>
          By accessing Komply&apos;s website, submitting a request for
          access, or using our client portal, you agree to be bound by
          these Terms of Service. If you are using Komply on behalf of a
          company, you represent that you have authority to bind that
          company to these terms.
        </LegalParagraph>
        <LegalParagraph noMargin>
          These terms constitute the entire agreement between you and
          Komply regarding your use of our services and supersede any prior
          agreements. We may update these terms periodically and will
          notify active clients of material changes via email.
        </LegalParagraph>
      </LegalSection>

      <LegalSection id="services" number="02" category="Services" heading="What Komply provides">
        <LegalParagraph>
          Komply provides compliance intelligence services for African
          fintech startups, including but not limited to:
        </LegalParagraph>
        <LegalBulletList
          items={[
            "Regulatory monitoring and alert services",
            "Compliance gap analysis and reporting",
            "Licensing roadmap and checklist services",
            "Remediation planning and task management",
            "Document sharing and compliance portal access",
          ]}
        />
        <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed mt-6">
          Komply reserves the right to modify, suspend, or discontinue any
          aspect of its services at any time with reasonable notice to
          active clients.
        </p>
      </LegalSection>

      <LegalSection id="accounts" number="03" category="Accounts" heading="Your account responsibilities">
        <LegalParagraph>
          You are responsible for maintaining the confidentiality of your
          portal login credentials and for all activity that occurs under
          your account. You must notify Komply immediately at
          hello@komply.co if you suspect unauthorised access to your
          account.
        </LegalParagraph>
        <LegalParagraph>
          You agree to provide accurate and complete information when
          submitting a request for access and when using our services.
          Providing false or misleading information may result in
          immediate termination of your account.
        </LegalParagraph>
        <LegalParagraph noMargin>
          Portal access is granted to the company that submits a request
          and may not be transferred, shared, or resold to any third party
          without Komply&apos;s prior written consent.
        </LegalParagraph>
      </LegalSection>

      <LegalSection id="payment" number="04" category="Payment" heading="Fees and billing">
        <LegalParagraph>
          Fees for Komply&apos;s services are agreed upon at the time of
          onboarding and set out in your service agreement. Subscription
          fees are billed monthly in advance. One-time project fees are
          billed upon agreement and payable before work commences unless
          otherwise agreed in writing.
        </LegalParagraph>
        <LegalParagraph>
          All fees are quoted and payable in Nigerian Naira (₦) unless
          otherwise agreed. Komply reserves the right to adjust pricing
          with 30 days written notice to active subscribers.
        </LegalParagraph>
        <LegalParagraph noMargin>
          Late payment of more than 14 days may result in suspension of
          portal access until outstanding amounts are settled. Komply is
          not liable for any consequences arising from service suspension
          due to non-payment.
        </LegalParagraph>
      </LegalSection>

      <LegalSection id="ip" number="05" category="Intellectual property" heading="Ownership of content">
        <LegalParagraph>
          All content, software, systems, regulatory intelligence, prompts,
          analysis methodologies, and documentation produced by or on
          behalf of Komply remain the intellectual property of Komply. This
          includes but is not limited to gap analysis reports, audit
          readiness assessments, and licensing roadmaps delivered to
          clients.
        </LegalParagraph>
        <LegalParagraph>
          Clients are granted a non-exclusive, non-transferable licence to
          use gap reports, roadmaps, and other deliverables for their own
          internal compliance purposes during the term of their service
          agreement. These materials may not be reproduced, distributed, or
          shared with third parties without Komply&apos;s prior written
          consent.
        </LegalParagraph>
        <LegalParagraph noMargin>
          You retain ownership of all business information and data you
          provide to Komply. By providing this information, you grant
          Komply a limited licence to use it solely for the purpose of
          delivering your compliance services.
        </LegalParagraph>
      </LegalSection>

      <LegalSection id="disclaimer" number="06" category="Disclaimer" heading="Not legal advice">
        <LegalParagraph>
          Komply provides compliance intelligence, not legal advice. Our
          gap analyses, regulatory alerts, licensing roadmaps, and audit
          readiness assessments are informational tools to help you
          understand your regulatory environment. They do not constitute
          legal advice and should not be relied upon as such.
        </LegalParagraph>
        <LegalParagraph>
          Komply is not a law firm and does not have a solicitor-client
          relationship with its clients. For formal legal advice on
          regulatory matters, you should consult a qualified Nigerian legal
          practitioner licensed by the Nigerian Bar Association.
        </LegalParagraph>
        <LegalParagraph noMargin>
          While Komply makes every effort to ensure the accuracy of its
          regulatory intelligence, regulations change frequently and we
          cannot guarantee that all information is current or complete at
          the time of delivery. Clients should verify critical regulatory
          requirements independently before taking action.
        </LegalParagraph>
      </LegalSection>

      <LegalSection id="liability" number="07" category="Liability" heading="Limitation of liability">
        <LegalParagraph>
          To the maximum extent permitted by applicable law, Komply shall
          not be liable for any indirect, incidental, special,
          consequential, or punitive damages arising from your use of our
          services, including but not limited to regulatory sanctions,
          fines, licensing rejections, or business losses.
        </LegalParagraph>
        <LegalParagraph noMargin>
          Komply&apos;s total liability to you for any claim arising from
          these terms or your use of our services shall not exceed the
          total fees paid by you to Komply in the three months preceding
          the claim.
        </LegalParagraph>
      </LegalSection>

      <LegalSection id="termination" number="08" category="Termination" heading="Ending the service">
        <LegalParagraph>
          Either party may terminate a monthly subscription with 30 days
          written notice. Project-based engagements are terminated upon
          completion of the agreed deliverables or by mutual written
          agreement.
        </LegalParagraph>
        <LegalParagraph>
          Komply may terminate your account immediately and without notice
          if you breach these terms, provide false information, or engage
          in conduct that is harmful to Komply or other clients.
        </LegalParagraph>
        <LegalParagraph noMargin>
          Upon termination, your portal access will be deactivated and your
          data will be retained for 90 days before permanent deletion, in
          accordance with our Privacy Policy.
        </LegalParagraph>
      </LegalSection>

      <LegalSection id="governing" number="09" category="Governing law" heading="Jurisdiction">
        <LegalParagraph>
          These terms are governed by the laws of the Federal Republic of
          Nigeria. Any disputes arising from these terms or your use of
          Komply&apos;s services shall be subject to the exclusive
          jurisdiction of the courts of Lagos State, Nigeria.
        </LegalParagraph>
        <LegalParagraph>
          For any questions about these terms, contact us at:
        </LegalParagraph>
        <LegalContactBox name="Komply" email="legal@komply.co" />
      </LegalSection>
    </LegalLayout>
  );
}

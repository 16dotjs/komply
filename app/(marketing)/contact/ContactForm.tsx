"use client";

import { useState } from "react";
import Link from "next/link";
import { submitAccessRequest, type ContactFormData } from "./actions";

const SERVICE_OPTIONS = [
  {
    label: "Regulatory monitoring & alerts",
    description: "Stay updated on CBN, NDPC, SEC and more in real time",
  },
  {
    label: "Gap analysis",
    description:
      "Full audit of your compliance posture against applicable frameworks",
  },
  {
    label: "Licensing roadmap",
    description: "PSB, MFB, PSSP, or VASP — sequenced to your stage",
  },
  {
    label: "Cross-border KYC / AML",
    description:
      "FATF alignment, multi-jurisdiction KYC, transaction monitoring design",
  },
];

const STEP_LABELS: Record<number, string> = {
  1: "Step 1 of 3 — About your company",
  2: "Step 2 of 3 — Your compliance situation",
  3: "Step 3 of 3 — Review & submit",
};

const initialForm: ContactFormData = {
  company: "",
  email: "",
  name: "",
  role: "",
  stage: "",
  product: "",
  what: "",
  concern: "",
  docs: "",
  review: "",
  urgency: "",
  services: [],
  heardAbout: "",
  consent: false,
};

export function ContactForm() {
  const [step, setStep] = useState<1 | 2 | 3 | "success">(1);
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleService(label: string) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(label)
        ? f.services.filter((s) => s !== label)
        : [...f.services, label],
    }));
  }

  async function handleSubmit() {
    setError(null);

    if (!form.company || !form.email || !form.name) {
      setError("Please fill in company name, email and your name.");
      return;
    }
    if (!form.consent) {
      setError("Please confirm you agree to be contacted.");
      return;
    }

    setSubmitting(true);
    const result = await submitAccessRequest(form);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setStep("success");
  }

  if (step === "success") {
    return (
      <div className="border border-rule p-10 md:p-14 relative">
        <div className="absolute top-0 right-0 w-14 h-14 border-t border-r border-clay pointer-events-none" />
        <div className="w-10 h-px bg-clay mb-10" />
        <p className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[0.92] tracking-tight-display mb-6">
          Received.
        </p>
        <p className="font-body text-sm font-light tracking-loose-body text-ash leading-relaxed max-w-sm mb-10">
          Your request is in. We&apos;ll review your details and be in touch
          within 48 hours with next steps for onboarding.
        </p>
        <div className="space-y-4">
          {[
            "Expect an email from a Komply team member",
            "A 20-minute onboarding call will be scheduled",
            "Your gap report lands within 5 business days of the call",
          ].map((line) => (
            <div key={line} className="flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-clay shrink-0" />
              <span className="font-body text-[12px] font-light text-ash">
                {line}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-rule">
          <Link
            href="/"
            className="font-body text-sm font-light text-ash hover:text-ink transition-colors"
          >
            ← Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        <div className={`step-dot ${step >= 1 ? "active" : ""}`} />
        <div className="w-8 h-px bg-rule" />
        <div className={`step-dot ${step >= 2 ? "active" : ""}`} />
        <div className="w-8 h-px bg-rule" />
        <div className={`step-dot ${step >= 3 ? "active" : ""}`} />
        <p className="font-body text-[11px] font-light tracking-loose-body text-ash ml-4">
          {STEP_LABELS[step]}
        </p>
      </div>

      {error && (
        <div className="mb-6 border border-clay/30 px-4 py-3">
          <p className="font-body text-sm font-light text-clay">{error}</p>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <h2 className="font-display text-[1.75rem] font-semibold tracking-tight-display mb-8">
            About your company
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="Company name" required>
                <input
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  placeholder="Acme Fintech Ltd"
                  className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors"
                />
              </Field>
              <Field label="Work email" required>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="Your name" required>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Amara Osei"
                  className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors"
                />
              </Field>
              <Field label="Role / title">
                <input
                  value={form.role}
                  onChange={(e) => update("role", e.target.value)}
                  placeholder="Head of Compliance"
                  className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors"
                />
              </Field>
            </div>

            <Field label="Company stage" required>
              <select
                value={form.stage}
                onChange={(e) => update("stage", e.target.value)}
                className="w-full bg-paper border border-rule px-4 py-3 text-sm font-light font-body text-ash transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select stage
                </option>
                <option>Pre-revenue / MVP</option>
                <option>Revenue-stage (Seed – Series A)</option>
                <option>Growth (Series B+)</option>
                <option>Regulated entity already</option>
              </select>
            </Field>

            <Field label="Product category">
              <select
                value={form.product}
                onChange={(e) => update("product", e.target.value)}
                className="w-full bg-paper border border-rule px-4 py-3 text-sm font-light font-body text-ash transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  What best describes your product?
                </option>
                <option>Payments / transfers</option>
                <option>Lending / credit</option>
                <option>Savings / investments</option>
                <option>Crypto / digital assets</option>
                <option>Insurance (insurtech)</option>
                <option>Business banking / neobank</option>
                <option>Infrastructure / BaaS</option>
                <option>Other</option>
              </select>
            </Field>

            <Field label="Describe your product" required>
              <input
                value={form.what}
                onChange={(e) => update("what", e.target.value)}
                placeholder="e.g. We process cross-border payments for Nigerian SMEs"
                className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors"
              />
            </Field>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <p className="text-[11px] font-light tracking-loose-body text-ash">
              All fields marked <span className="text-clay">*</span> are
              required
            </p>
            <button
              onClick={() => setStep(2)}
              className="bg-ink text-paper text-sm font-light px-8 py-4 hover:bg-clay transition-colors duration-300"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <h2 className="font-display text-[1.75rem] font-semibold tracking-tight-display mb-8">
            Your compliance situation
          </h2>
          <div className="space-y-6">
            <Field label="Primary compliance concern" required>
              <textarea
                value={form.concern}
                onChange={(e) => update("concern", e.target.value)}
                rows={4}
                placeholder="What keeps you up at night regulation-wise? Any specific CBN, NDPC, or licensing issue you're trying to solve?"
                className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors resize-none"
              />
            </Field>

            <div className="space-y-3">
              <label className="text-[10px] font-light tracking-[0.2em] uppercase text-ash block">
                Which services interest you?
              </label>
              <div className="space-y-3">
                {SERVICE_OPTIONS.map((opt) => (
                  <label
                    key={opt.label}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={form.services.includes(opt.label)}
                      onChange={() => toggleService(opt.label)}
                    />
                    <div>
                      <p className="font-body text-sm font-light text-ink">
                        {opt.label}
                      </p>
                      <p className="font-body text-[11px] font-light text-ash mt-0.5">
                        {opt.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Field label="Do you have existing compliance documentation?">
              <select
                value={form.docs}
                onChange={(e) => update("docs", e.target.value)}
                className="w-full bg-paper border border-rule px-4 py-3 text-sm font-light font-body text-ash transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select one
                </option>
                <option>No documentation in place yet</option>
                <option>Some basic policies (AML, privacy notice)</option>
                <option>Moderate documentation, known gaps</option>
                <option>
                  Comprehensive documentation, want a second opinion
                </option>
              </select>
            </Field>

            <Field label="How soon do you need help">
              <select
                value={form.urgency}
                onChange={(e) => update("urgency", e.target.value)}
                className="w-full bg-paper border border-rule px-4 py-3 text-sm font-light font-body text-ash transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select urgency
                </option>
                <option>Just exploring</option>
                <option>Within 3 months</option>
                <option>Urgent — under regulatory pressure</option>
              </select>
            </Field>

            <Field label="Are you currently under any regulatory review or examination?">
              <select
                value={form.review}
                onChange={(e) => update("review", e.target.value)}
                className="w-full bg-paper border border-rule px-4 py-3 text-sm font-light font-body text-ash transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select one
                </option>
                <option>No</option>
                <option>Under routine examination</option>
                <option>Received a query or directive</option>
                <option>Prefer not to say</option>
              </select>
            </Field>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="font-body text-sm font-light text-ash hover:text-ink transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-ink text-paper text-sm font-light px-8 py-4 hover:bg-clay transition-colors duration-300"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <h2 className="font-display text-[1.75rem] font-semibold tracking-tight-display mb-8">
            Review & submit
          </h2>

          <div className="border border-rule p-7 mb-8 relative">
            <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-clay pointer-events-none" />
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-6">
              Your request summary
            </p>
            <div className="space-y-0">
              <SummaryRow label="Company" value={form.company || "—"} />
              <SummaryRow
                label="Contact"
                value={`${form.name || "—"} · ${form.email || "—"}`}
              />
              <SummaryRow label="Stage" value={form.stage || "—"} />
              <SummaryRow label="Product" value={form.product || "—"} />
              <SummaryRow
                label="Primary concern"
                value={
                  form.concern.length > 100
                    ? form.concern.slice(0, 100) + "…"
                    : form.concern || "—"
                }
                noBorder
              />
            </div>
          </div>

          <div className="space-y-5 mb-8">
            <Field label="How did you hear about Komply?">
              <select
                value={form.heardAbout}
                onChange={(e) => update("heardAbout", e.target.value)}
                className="w-full bg-paper border border-rule px-4 py-3 text-sm font-light font-body text-ash transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select one
                </option>
                <option>Twitter / X</option>
                <option>LinkedIn</option>
                <option>Word of mouth / referral</option>
                <option>Newsletter</option>
                <option>Google search</option>
                <option>Other</option>
              </select>
            </Field>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={form.consent}
                onChange={(e) => update("consent", e.target.checked)}
              />
              <p className="font-body text-[12px] font-light text-ash leading-relaxed">
                I agree to Komply contacting me about this request and
                relevant product updates. I can unsubscribe at any time.
              </p>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep(2)}
                className="font-body text-sm font-light text-ash hover:text-ink transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-ink text-paper text-sm font-light px-8 py-4 hover:bg-clay transition-colors duration-300 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit request"}
              </button>
            </div>
            <p className="text-[11px] font-light tracking-loose-body text-ash">
              We respond within 48 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-light tracking-[0.2em] uppercase text-ash block">
        {label} {required && <span className="text-clay">*</span>}
      </label>
      {children}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  noBorder,
}: {
  label: string;
  value: string;
  noBorder?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between py-3 gap-4 ${noBorder ? "" : "border-b border-rule"}`}
    >
      <span className="font-body text-[12px] font-light text-ash shrink-0 w-28">
        {label}
      </span>
      <span className="font-body text-sm font-light text-ink text-right max-w-xs">
        {value}
      </span>
    </div>
  );
}

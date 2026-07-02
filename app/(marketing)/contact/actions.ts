"use server";

import { createClient } from "@/lib/supabase/server";

export interface ContactFormData {
  company: string;
  email: string;
  name: string;
  role: string;
  stage: string;
  product: string;
  what: string;
  concern: string;
  docs: string;
  review: string;
  urgency: string;
  services: string[];
  heardAbout: string;
  consent: boolean;
}

export interface SubmitResult {
  success: boolean;
  error?: string;
}

export async function submitAccessRequest(
  data: ContactFormData,
): Promise<SubmitResult> {
  if (!data.company || !data.email || !data.name) {
    return {
      success: false,
      error: "Please fill in company name, email and your name.",
    };
  }

  if (!data.consent) {
    return {
      success: false,
      error: "Please confirm you agree to be contacted.",
    };
  }

  const supabase = await createClient();

  const notes = [
    `Name: ${data.name}`,
    `Role: ${data.role}`,
    `Services: ${data.services.join(", ")}`,
    `Docs: ${data.docs}`,
    `Under review: ${data.review}`,
    `Heard about us: ${data.heardAbout}`,
  ].join(" | ");

  const { error } = await supabase.from("requests").insert([
    {
      company: data.company,
      email: data.email,
      what_you_do: data.what || data.product,
      stage: data.stage,
      concern: data.concern,
      urgency: data.urgency,
      notes,
    },
  ]);

  if (error) {
    console.error(error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  // Best-effort notification — a failure here shouldn't block the request,
  // mirroring the original's "Email notification failed silently" behavior.
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: "new_request",
          data: {
            company: data.company,
            email: data.email,
            stage: data.stage,
            what_you_do: data.what,
            concern: data.concern,
            urgency: data.urgency,
          },
        }),
      },
    );
  } catch (emailErr) {
    console.log("Email notification failed silently:", emailErr);
  }

  return { success: true };
}

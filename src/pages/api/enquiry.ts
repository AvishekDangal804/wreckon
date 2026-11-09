import type { APIRoute } from "astro";

export const prerender = false;

interface EnquiryPayload {
  subject: string;
  name: string;
  phone: string;
  email: string;
  vehicleMake?: string;
  vehicleModelYear?: string;
  message?: string;
}

function parsePayload(form: FormData): EnquiryPayload | null {
  const subject = form.get("subject")?.toString().trim();
  const name = form.get("name")?.toString().trim();
  const phone = form.get("phone")?.toString().trim();
  const email = form.get("email")?.toString().trim();

  if (!subject || !name || !phone || !email) return null;

  return {
    subject,
    name,
    phone,
    email,
    vehicleMake: form.get("vehicleMake")?.toString().trim() || undefined,
    vehicleModelYear: form.get("vehicleModelYear")?.toString().trim() || undefined,
    message: form.get("message")?.toString().trim() || undefined,
  };
}

async function sendViaResend(payload: EnquiryPayload, apiKey: string, toEmail: string) {
  const lines = [
    `Subject: ${payload.subject}`,
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    payload.vehicleMake ? `Vehicle Make: ${payload.vehicleMake}` : null,
    payload.vehicleModelYear ? `Model/Year: ${payload.vehicleModelYear}` : null,
    payload.message ? `Message: ${payload.message}` : null,
  ].filter(Boolean);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "WRECKON Website <no-reply@wreckon.com.au>",
      to: [toEmail],
      reply_to: payload.email,
      subject: `[Website] ${payload.subject} — ${payload.name}`,
      text: lines.join("\n"),
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend API responded with ${res.status}`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response(JSON.stringify({ message: "Invalid form submission." }), { status: 400 });
  }

  const payload = parsePayload(form);
  if (!payload) {
    return new Response(
      JSON.stringify({ message: "Please fill in your name, phone and email." }),
      { status: 400 }
    );
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.ENQUIRY_TO_EMAIL;

  if (apiKey && toEmail) {
    try {
      await sendViaResend(payload, apiKey, toEmail);
      return new Response(
        JSON.stringify({ message: "Thanks — we've received your enquiry and will be in touch." }),
        { status: 200 }
      );
    } catch (err) {
      console.error("[enquiry] Resend send failed:", err);
      return new Response(
        JSON.stringify({ message: "We couldn't send your enquiry right now — please call us instead." }),
        { status: 502 }
      );
    }
  }

  // No email provider configured yet. Log instead of silently discarding,
  // and tell the user plainly that delivery isn't wired up in this preview build.
  console.log("[enquiry:dev-mode] No RESEND_API_KEY/ENQUIRY_TO_EMAIL set. Submission:", payload);
  return new Response(
    JSON.stringify({
      message:
        "Thanks — received. (Preview build: email delivery isn't configured yet, so this hasn't been sent anywhere. See README.)",
    }),
    { status: 200 }
  );
};

import type { APIRoute } from "astro";
import { db } from "../../lib/db/client";
import { enquiries, enquiryPhotos } from "../../lib/db/schema";
import { checkRateLimit } from "../../lib/rateLimit";
import { verifyTurnstile } from "../../lib/turnstile";
import { uploadEnquiryPhotos } from "../../lib/blob";
import {
  generalContactSchema,
  partsEnquirySchema,
  vehicleValuationSchema,
} from "../../lib/validation/enquiry";

export const prerender = false;

type EnquiryType = "general_contact" | "parts_request" | "vehicle_valuation";

interface EnquiryPayload {
  subject: string;
  name: string;
  phone: string;
  email: string;
  vehicleMake?: string;
  vehicleModelYear?: string;
  message?: string;
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function fields(form: FormData, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of keys) {
    out[key] = form.get(key)?.toString().trim() ?? "";
  }
  return out;
}

async function sendViaResend(payload: EnquiryPayload, photoUrls: string[], apiKey: string, toEmail: string) {
  const lines = [
    `Subject: ${payload.subject}`,
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    payload.vehicleMake ? `Vehicle Make: ${payload.vehicleMake}` : null,
    payload.vehicleModelYear ? `Model/Year: ${payload.vehicleModelYear}` : null,
    payload.message ? `Message: ${payload.message}` : null,
    photoUrls.length ? `Photos:\n${photoUrls.join("\n")}` : null,
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

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ message: "Invalid form submission." }, 400);
  }

  // Honeypot: a real visitor never fills this hidden field. Pretend success
  // so bots don't learn their submission was dropped.
  if (form.get("company")?.toString().trim()) {
    return json({ message: "Thanks — we've received your enquiry and will be in touch." }, 200);
  }

  let clientIp: string | null = null;
  try {
    clientIp = clientAddress ?? null;
  } catch {
    clientIp = null;
  }

  const allowed = await checkRateLimit(clientIp ?? "unknown");
  if (!allowed) {
    return json({ message: "Too many submissions — please try again in a few minutes." }, 429);
  }

  const turnstileOk = await verifyTurnstile(form.get("cf-turnstile-response")?.toString() ?? null, clientIp);
  if (!turnstileOk) {
    return json({ message: "We couldn't verify your submission — please try again." }, 400);
  }

  const type = (form.get("type")?.toString() as EnquiryType) || "general_contact";

  let customerName: string;
  let customerPhone: string;
  let customerEmail: string;
  let details: Record<string, string>;
  let emailPayload: EnquiryPayload;

  if (type === "parts_request") {
    const raw = fields(form, [
      "name",
      "phone",
      "email",
      "vehicleMake",
      "vehicleModel",
      "vehicleYear",
      "transmission",
      "vehicleInfo",
      "partName",
      "partDescription",
      "comments",
    ]);
    const parsed = partsEnquirySchema.safeParse(raw);
    if (!parsed.success) {
      return json({ message: parsed.error.issues[0]?.message ?? "Please check the form and try again." }, 400);
    }
    const data = parsed.data;
    customerName = data.name;
    customerPhone = data.phone;
    customerEmail = data.email;
    details = { ...data };
    emailPayload = {
      subject: "Part Request",
      name: data.name,
      phone: data.phone,
      email: data.email,
      vehicleMake: data.vehicleMake,
      vehicleModelYear: `${data.vehicleModel} (${data.vehicleYear})`,
      message: [data.partName, data.partDescription, data.comments].filter(Boolean).join(" — "),
    };
  } else if (type === "vehicle_valuation") {
    const raw = fields(form, [
      "name",
      "phone",
      "email",
      "vehicleMake",
      "vehicleModel",
      "vehicleYear",
      "location",
      "condition",
      "drivable",
      "transmission",
      "additionalInfo",
    ]);
    const parsed = vehicleValuationSchema.safeParse(raw);
    if (!parsed.success) {
      return json({ message: parsed.error.issues[0]?.message ?? "Please check the form and try again." }, 400);
    }
    const data = parsed.data;
    customerName = data.name;
    customerPhone = data.phone;
    customerEmail = data.email;
    details = { ...data };
    emailPayload = {
      subject: "Sell My Car",
      name: data.name,
      phone: data.phone,
      email: data.email,
      vehicleMake: data.vehicleMake,
      vehicleModelYear: `${data.vehicleModel} (${data.vehicleYear})`,
      message: `Location: ${data.location}; Condition: ${data.condition}; Drivable: ${data.drivable}${data.additionalInfo ? `; ${data.additionalInfo}` : ""}`,
    };
  } else {
    const raw = fields(form, ["name", "phone", "email", "vehicleMake", "vehicleModelYear", "message"]);
    const parsed = generalContactSchema.safeParse(raw);
    if (!parsed.success) {
      return json({ message: parsed.error.issues[0]?.message ?? "Please check the form and try again." }, 400);
    }
    const data = parsed.data;
    customerName = data.name;
    customerPhone = data.phone;
    customerEmail = data.email;
    details = { ...data };
    emailPayload = {
      subject: form.get("subject")?.toString().trim() || "General Enquiry",
      ...data,
    };
  }

  const photoFiles = form.getAll("photos").filter((f): f is File => f instanceof File);
  const photoUrls = await uploadEnquiryPhotos(photoFiles);

  if (db) {
    try {
      const [inserted] = await db
        .insert(enquiries)
        .values({ type, customerName, customerPhone, customerEmail, details })
        .returning({ id: enquiries.id });
      if (inserted && photoUrls.length) {
        await db.insert(enquiryPhotos).values(photoUrls.map((blobUrl) => ({ enquiryId: inserted.id, blobUrl })));
      }
    } catch (err) {
      console.error("[enquiry] DB insert failed:", err);
    }
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.ENQUIRY_TO_EMAIL;

  if (apiKey && toEmail) {
    try {
      await sendViaResend(emailPayload, photoUrls, apiKey, toEmail);
      return json({ message: "Thanks — we've received your enquiry and will be in touch." }, 200);
    } catch (err) {
      console.error("[enquiry] Resend send failed:", err);
      return json({ message: "We couldn't send your enquiry right now — please call us instead." }, 502);
    }
  }

  // No email provider configured yet. Log instead of silently discarding,
  // and tell the user plainly that delivery isn't wired up in this preview build.
  console.log("[enquiry:dev-mode] No RESEND_API_KEY/ENQUIRY_TO_EMAIL set. Submission:", {
    type,
    customerName,
    customerPhone,
    customerEmail,
    details,
    photoUrls,
  });
  return json(
    {
      message:
        "Thanks — received. (Preview build: email delivery isn't configured yet, so this hasn't been sent anywhere. See README.)",
    },
    200
  );
};

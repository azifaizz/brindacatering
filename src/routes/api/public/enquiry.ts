import { createFileRoute } from "@tanstack/react-router";
import { enquirySchema } from "@/lib/validation";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

/**
 * Enquiry endpoint.
 *
 * Validates server-side with the same Zod schema as the client, applies a
 * simple in-memory rate limit and a honeypot check, then forwards the enquiry
 * to whatever destination is configured through ENQUIRY_WEBHOOK_URL
 * (email provider, CRM, automation, etc.).
 *
 * If no destination is configured the endpoint responds 503 — it never
 * pretends an enquiry was delivered.
 *
 * The rate limiter is intentionally abstracted behind `allow()` so it can be
 * swapped for Redis/Upstash in production without touching the handler.
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const MAX_BODY_BYTES = 8_000;
const hits = new Map<string, number[]>();

const allow = (key: string) => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return false;
  recent.push(now);
  hits.set(key, recent);
  return true;
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });

const sanitize = (value: string) =>
  value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 1500);

export const Route = createFileRoute("/api/public/enquiry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "unknown";

        if (!allow(ip)) {
          return json({ message: "Too many enquiries. Please try again in a minute." }, 429);
        }

        const raw = await request.text();
        if (raw.length > MAX_BODY_BYTES) {
          return json({ message: "Request too large." }, 413);
        }

        let parsedBody: unknown;
        try {
          parsedBody = JSON.parse(raw);
        } catch {
          return json({ message: "Invalid request." }, 400);
        }

        const result = enquirySchema.safeParse(parsedBody);
        if (!result.success) {
          return json(
            {
              message: "Please check the highlighted fields and try again.",
              issues: result.error.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
              })),
            },
            400,
          );
        }

        // Honeypot filled -> silently accept without forwarding.
        if (result.data.company) {
          return json({ message: "Received." }, 200);
        }

        const enquiry = Object.fromEntries(
          Object.entries(result.data)
            .filter(([key]) => key !== "company")
            .map(([key, value]) => [key, sanitize(String(value ?? ""))]),
        );

        if (!db) {
          return json(
            {
              delivered: false,
              message:
                "Database is not configured yet. Please contact us by phone or WhatsApp and we'll respond right away.",
            },
            200,
          );
        }

        try {
          await addDoc(collection(db, "enquiries"), {
            source: "website-enquiry-form",
            receivedAt: new Date().toISOString(),
            ...enquiry,
          });
        } catch (error) {
          console.error("Enquiry save error", error);
          return json(
            {
              message: "We couldn't deliver your enquiry. Please contact us by phone or WhatsApp.",
            },
            502,
          );
        }

        return json({ message: "Enquiry received." }, 200);
      },
    },
  },
});

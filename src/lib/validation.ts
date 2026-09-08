import { z } from "zod";

/** Shared by the client form and the server route handler. */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20)
    .regex(/^[+]?[\d\s()-]{7,20}$/, "Please enter a valid phone number"),
  email: z
    .string()
    .trim()
    .max(120)
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  eventType: z.string().trim().min(1, "Please select an event type").max(60),
  eventDate: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => {
        if (!value) return true;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: "Please choose today or a future date" },
    ),
  guests: z
    .string()
    .trim()
    .max(6)
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || Number(value) > 0, {
      message: "Guest count must be greater than zero",
    }),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.string().trim().max(60).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  contactPreference: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().max(1500).optional().or(z.literal("")),
  /** Honeypot — must stay empty. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const eventTypeOptions = [
  "Wedding",
  "Reception",
  "Birthday Celebration",
  "Corporate Event",
  "Family Function",
  "Other Occasion",
];

export const budgetOptions = ["Not decided yet", "Prefer to discuss"];

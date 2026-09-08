import { business } from "@/data/business";

export const defaultWhatsAppMessage = `Hello ${business.name}, I would like to enquire about catering for my event.`;

export type WhatsAppContext = {
  service?: string | undefined;
  eventType?: string | undefined;
  eventDate?: string | undefined;
  message?: string | undefined;
};

export const buildWhatsAppMessage = (context: Record<string, any> = {}) => {
  const parts = [`Hello ${business.name}, I would like to enquire about catering for my event.`];
  
  if (context.name) parts.push(`Name: ${context.name}`);
  if (context.phone) parts.push(`Phone: ${context.phone}`);
  if (context.email) parts.push(`Email: ${context.email}`);
  if (context.eventType) parts.push(`Event Type: ${context.eventType}`);
  if (context.eventDate) parts.push(`Date: ${context.eventDate}`);
  if (context.guests) parts.push(`Guests: ${context.guests}`);
  if (context.location) parts.push(`Location: ${context.location}`);
  if (context.service) parts.push(`Service: ${context.service}`);
  if (context.budget) parts.push(`Budget: ${context.budget}`);
  if (context.message) parts.push(`\nMessage:\n${context.message}`);
  
  return parts.join("\n");
};

/**
 * Returns a wa.me link, or null when the business WhatsApp number has not
 * been configured yet (see src/data/business.ts). Never guesses a number.
 */
export const whatsAppLink = (context: WhatsAppContext = {}): string | null => {
  const number = business.whatsapp.replace(/[^\d]/g, "");
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsAppMessage(context))}`;
};

export const telLink = () => (business.phone ? `tel:${business.phone.replace(/\s+/g, "")}` : null);

export const mailLink = () => (business.email ? `mailto:${business.email}` : null);

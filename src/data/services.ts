import weddingImage from "@/assets/wedding-south-indian.jpg";
import eventImage from "@/assets/function-south-indian.jpg";
import corporateImage from "@/assets/feast-south-indian.jpg";
import packagesImage from "@/assets/tiffin-south-indian.jpg";
import setupImage from "@/assets/kitchen-south-indian.jpg";

export type Service = {
  id: string;
  slug: string;
  title: string;
  short: string;
  description: string;
  image: string;
  alt: string;
  suitableFor: string[];
  highlights: string[];
  featured: boolean;
};

export const services: Service[] = [
  {
    id: "wedding",
    slug: "wedding-catering",
    title: "Wedding Catering",
    short: "Traditional South Indian hospitality for weddings and receptions.",
    description:
      "Complete catering for wedding ceremonies and receptions, planned around your rituals, timings and guest count. We handle menu planning, service staff, counters and clearing so the family can stay with the celebration.",
    image: weddingImage,
    alt: "Catering staff serving a South Indian wedding meal on banana leaves",
    suitableFor: ["Weddings", "Receptions", "Engagements", "Pre-wedding events"],
    highlights: [
      "Multi-session catering across event days",
      "Banana-leaf, buffet and counter service",
      "Menu tastings on request",
      "Coordinated setup with your venue team",
    ],
    featured: true,
  },
  {
    id: "event",
    slug: "event-catering",
    title: "Family & Social Events",
    short: "South Indian food for celebrations and family functions.",
    description:
      "Catering for birthdays, anniversaries, housewarmings, festivals and family functions. Menus scale from small gatherings to large celebrations without losing consistency.",
    image: eventImage,
    alt: "South Indian function meal being served to guests on banana leaves",
    suitableFor: ["Birthday celebrations", "Anniversaries", "Family functions", "Festivals"],
    highlights: [
      "Flexible guest counts",
      "Snack, lunch and dinner formats",
      "Live counters and service staff",
      "On-site setup and clearing",
    ],
    featured: true,
  },
  {
    id: "corporate",
    slug: "corporate-catering",
    title: "Corporate Catering",
    short: "Professional catering for meetings, conferences and corporate functions.",
    description:
      "Punctual, professionally presented catering for offices and corporate venues — from working lunches and training sessions to conferences and company celebrations.",
    image: corporateImage,
    alt: "South Indian rice and curry feast presented on a banana leaf",
    suitableFor: ["Meetings", "Conferences", "Team events", "Office celebrations"],
    highlights: [
      "Reliable delivery windows",
      "Individual and buffet formats",
      "South Indian vegetarian and non-vegetarian options",
      "Repeat and scheduled catering",
    ],
    featured: true,
  },
  {
    id: "packages",
    slug: "catering-packages",
    title: "Catering Packages",
    short: "Flexible packages designed for different event requirements.",
    description:
      "Structured catering packages that make planning simpler, covering menu selection, quantities and service. Packages are adjusted to your event rather than fixed rigidly. [Editable placeholder — add the actual package structure once supplied.]",
    image: packagesImage,
    alt: "South Indian tiffin spread with idli, dosa, vada, appam and idiyappam",
    suitableFor: ["Weddings", "Corporate events", "Family functions"],
    highlights: [
      "Clear, discussed inclusions",
      "Adjustable menu selections",
      "Scalable to guest count",
      "Quotation on enquiry",
    ],
    featured: true,
  },
  {
    id: "special",
    slug: "custom-catering",
    title: "Custom Catering",
    short: "Custom catering solutions based on event requirements.",
    description:
      "Have something different in mind? Tell us the occasion, venue and guest count and we will put together a catering plan that fits it.",
    image: setupImage,
    alt: "Large-scale South Indian catering preparation in an organised kitchen",
    suitableFor: ["Custom events", "Outdoor functions", "Private gatherings"],
    highlights: [
      "Custom menu planning",
      "Outdoor and venue catering",
      "Service staff on request",
      "Equipment and setup support",
    ],
    featured: true,
  },
];

export const getService = (slug: string) => services.find((service) => service.slug === slug);

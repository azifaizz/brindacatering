import weddingImage from "@/assets/wedding-south-indian.jpg";
import eventImage from "@/assets/function-south-indian.jpg";
import feastImage from "@/assets/premium-feast.jpg";
import tiffinImage from "@/assets/premium-tiffin.jpg";
import payasamImage from "@/assets/payasam-south-indian.jpg";
import kitchenImage from "@/assets/kitchen-south-indian.jpg";
import heroPoster from "@/assets/hero-south-indian.jpg";

export type GalleryCategory = "Food" | "Weddings" | "Events" | "Corporate" | "Catering Setup";

export type GalleryImage = {
  id: string;
  image: string;
  alt: string;
  title: string;
  category: GalleryCategory;
  order: number;
};

export const galleryFilters: Array<"All" | GalleryCategory> = [
  "All",
  "Food",
  "Weddings",
  "Events",
  "Corporate",
  "Catering Setup",
];

/** Placeholder imagery — replace with the business's own photographs. */
export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    image: heroPoster,
    alt: "South Indian banana-leaf wedding feast with brass serving vessels",
    title: "A feast ready to serve",
    category: "Weddings",
    order: 1,
  },
  {
    id: "g2",
    image: feastImage,
    alt: "Traditional South Indian vegetarian feast served on a banana leaf",
    title: "Traditional feast",
    category: "Food",
    order: 2,
  },
  {
    id: "g3",
    image: weddingImage,
    alt: "Catering staff serving guests a South Indian wedding meal on banana leaves",
    title: "Wedding hospitality",
    category: "Weddings",
    order: 3,
  },
  {
    id: "g4",
    image: kitchenImage,
    alt: "Cooks preparing South Indian curries in large catering vessels",
    title: "Preparing at scale",
    category: "Catering Setup",
    order: 4,
  },
  {
    id: "g5",
    image: eventImage,
    alt: "Traditional South Indian function catering in a busy hall",
    title: "Made for celebrations",
    category: "Events",
    order: 5,
  },
  {
    id: "g6",
    image: payasamImage,
    alt: "Payasam being poured from a brass ladle",
    title: "Payasam service",
    category: "Food",
    order: 6,
  },
  {
    id: "g7",
    image: tiffinImage,
    alt: "South Indian tiffin spread with idli, dosa, vada and appam",
    title: "Breakfast and tiffin",
    category: "Corporate",
    order: 7,
  },
  {
    id: "g8",
    image: eventImage,
    alt: "Catering team serving guests at a South Indian function",
    title: "Function service",
    category: "Food",
    order: 8,
  },
];

export const sortedGallery = [...galleryImages].sort((a, b) => a.order - b.order);

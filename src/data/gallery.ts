import weddingImage from "@/assets/wedding-south-indian.jpg";
import eventImage from "@/assets/function-south-indian.jpg";
import feastImage from "@/assets/premium-feast.jpg";
import tiffinImage from "@/assets/premium-tiffin.jpg";
import payasamImage from "@/assets/payasam-south-indian.jpg";
import kitchenImage from "@/assets/kitchen-south-indian.jpg";
import heroPoster from "@/assets/hero-south-indian.jpg";

export type GalleryCategoryItem = {
  id: string;
  name: string;
  order: number;
};

export type GalleryImage = {
  id: string;
  image: string;
  alt: string;
  title: string;
  category: string;
  order: number;
};

export const defaultGalleryCategories: GalleryCategoryItem[] = [
  { id: "food", name: "Food", order: 0 },
  { id: "weddings", name: "Weddings", order: 1 },
  { id: "events", name: "Events", order: 2 },
  { id: "corporate", name: "Corporate", order: 3 },
  { id: "catering-setup", name: "Catering Setup", order: 4 },
];

/** Placeholder imagery — replace with the business's own photographs. */
export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    image: heroPoster,
    alt: "South Indian banana-leaf wedding feast with brass serving vessels",
    title: "A feast ready to serve",
    category: "weddings",
    order: 1,
  },
  {
    id: "g2",
    image: feastImage,
    alt: "Traditional South Indian vegetarian feast served on a banana leaf",
    title: "Traditional feast",
    category: "food",
    order: 2,
  },
  {
    id: "g3",
    image: weddingImage,
    alt: "Catering staff serving guests a South Indian wedding meal on banana leaves",
    title: "Wedding hospitality",
    category: "weddings",
    order: 3,
  },
  {
    id: "g4",
    image: kitchenImage,
    alt: "Cooks preparing South Indian curries in large catering vessels",
    title: "Preparing at scale",
    category: "catering-setup",
    order: 4,
  },
  {
    id: "g5",
    image: eventImage,
    alt: "Traditional South Indian function catering in a busy hall",
    title: "Made for celebrations",
    category: "events",
    order: 5,
  },
  {
    id: "g6",
    image: payasamImage,
    alt: "Payasam being poured from a brass ladle",
    title: "Payasam service",
    category: "food",
    order: 6,
  },
  {
    id: "g7",
    image: tiffinImage,
    alt: "South Indian tiffin spread with idli, dosa, vada and appam",
    title: "Breakfast and tiffin",
    category: "corporate",
    order: 7,
  },
  {
    id: "g8",
    image: eventImage,
    alt: "Catering team serving guests at a South Indian function",
    title: "Function service",
    category: "food",
    order: 8,
  },
];

export const sortedGallery = [...galleryImages].sort((a, b) => a.order - b.order);

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/site/PageHero";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import { 
  GalleryCategoryItem, 
  GalleryImage, 
  defaultGalleryCategories, 
  galleryImages as defaultImages 
} from "@/data/gallery";
import kitchenImage from "@/assets/kitchen-south-indian.jpg";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Brinda Caterers" },
      {
        name: "description",
        content:
          "South Indian food, wedding service, function catering and large-scale preparation from Brinda Caterers.",
      },
      { property: "og:title", content: "Gallery — Brinda Caterers" },
      {
        property: "og:description",
        content: "Food, wedding catering, event setups and corporate catering photography.",
      },
      { property: "og:url", content: "/gallery" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
});

function GalleryPage() {
  const [filterId, setFilterId] = useState<string>("all");
  const [categories, setCategories] = useState<GalleryCategoryItem[]>(defaultGalleryCategories);
  const [images, setImages] = useState<GalleryImage[]>([...defaultImages].sort((a, b) => (a.order || 0) - (b.order || 0)));

  useEffect(() => {
    if (!db) return;

    const qCategories = query(collection(db, 'galleryCategories'), orderBy('order'));
    const unsubscribeCategories = onSnapshot(qCategories, (snapshot) => {
      if (!snapshot.empty) {
        const dbCategories = snapshot.docs.map(doc => doc.data() as GalleryCategoryItem);
        const existingIds = new Set(dbCategories.map(c => c.id));
        const missingDefaults = defaultGalleryCategories.filter(c => !existingIds.has(c.id));
        const combined = [...dbCategories, ...missingDefaults].sort((a, b) => (a.order || 0) - (b.order || 0));
        setCategories(combined);
      }
    });

    const qImages = query(collection(db, 'galleryImages'), orderBy('order'));
    const unsubscribeImages = onSnapshot(qImages, (snapshot) => {
      if (!snapshot.empty) {
        const dbImages = snapshot.docs.map(doc => doc.data() as GalleryImage);
        const existingIds = new Set(dbImages.map(i => i.id));
        const missingDefaults = defaultImages.filter(i => !existingIds.has(i.id));
        const combined = [...dbImages, ...missingDefaults].sort((a, b) => (a.order || 0) - (b.order || 0));
        setImages(combined);
      }
    });

    return () => {
      unsubscribeCategories();
      unsubscribeImages();
    };
  }, []);

  const filters = [{ id: 'all', name: 'All' }, ...categories];
  
  const categoriesToRender = filterId === "all"
    ? categories
    : categories.filter(c => c.id === filterId);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments We Cater"
        image={kitchenImage}
        alt="South Indian catering team preparing curries in large vessels"
      />

      <section className="bg-background">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div
            role="group"
            aria-label="Filter gallery by category"
            className="flex flex-wrap gap-2"
          >
            {filters.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilterId(option.id)}
                aria-pressed={filterId === option.id}
                className={cn(
                  "rounded-sm border px-4 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors",
                  filterId === option.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                )}
              >
                {option.name}
              </button>
            ))}
          </div>

          <div className="mt-16 space-y-24">
            {categoriesToRender.map((category) => {
              const categoryImages = images.filter(img => img.category === category.id);
              if (categoryImages.length === 0 && filterId === "all") return null;

              return (
                <div key={category.id} className="scroll-mt-24" id={category.id}>
                  {filterId === "all" && (
                    <Reveal className="mb-8">
                      <h2 className="font-display text-3xl sm:text-4xl">{category.name}</h2>
                    </Reveal>
                  )}
                  <GalleryGrid images={categoryImages} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}

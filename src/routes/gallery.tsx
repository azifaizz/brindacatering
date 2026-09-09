import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import { type GalleryCategory, galleryFilters, sortedGallery } from "@/data/gallery";
import kitchenImage from "@/assets/kitchen-south-indian.jpg";

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
  const [filter, setFilter] = useState<(typeof galleryFilters)[number]>("All");
  
  const categoriesToRender = filter === "All"
    ? (galleryFilters.filter(f => f !== "All") as GalleryCategory[])
    : [filter as GalleryCategory];

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
            {galleryFilters.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={cn(
                  "rounded-sm border px-4 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors",
                  filter === option
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                )}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-16 space-y-24">
            {categoriesToRender.map((category) => {
              const categoryImages = sortedGallery.filter(img => img.category === category);
              if (categoryImages.length === 0 && filter === "All") return null;

              return (
                <div key={category} className="scroll-mt-24" id={category.toLowerCase().replace(/\s+/g, '-')}>
                  {filter === "All" && (
                    <Reveal className="mb-8">
                      <h2 className="font-display text-3xl sm:text-4xl">{category}</h2>
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

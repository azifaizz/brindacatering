import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/data/gallery";
import { Reveal } from "./Reveal";

type Props = {
  images: GalleryImage[];
  className?: string;
};

export function GalleryGrid({ images, className }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, next, prev]);

  if (!images.length) {
    return (
      <p className="py-16 text-center text-muted-foreground">No images in this category yet.</p>
    );
  }

  const active = activeIndex === null ? null : images[activeIndex];

  return (
    <>
      <div className={cn("columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4", className)}>
        {images.map((image, index) => (
          <Reveal
            key={image.id}
            as="figure"
            delay={(index % 3) * 80}
            className="break-inside-avoid"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative block w-full overflow-hidden rounded-sm bg-muted"
              aria-label={`Open image: ${image.title}`}
            >
              {image.image ? (
                <img
                  src={image.image}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-48 w-full items-center justify-center bg-muted/30 border-b border-border/50">
                  <span className="text-sm font-medium text-muted-foreground/60">No Image Available</span>
                </div>
              )}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/45"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-5 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="eyebrow block text-accent">{image.category}</span>
                <span className="mt-1 block font-display text-xl text-primary-foreground">
                  {image.title}
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-[60] flex flex-col bg-ink/97 p-4 backdrop-blur-sm sm:p-8"
          onTouchStart={(event) => {
            touchStart.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            const end = event.changedTouches[0]?.clientX ?? null;
            if (start === null || end === null) return;
            if (Math.abs(end - start) < 45) return;
            if (end < start) next();
            else prev();
          }}
        >
          <div className="flex items-center justify-between text-primary-foreground">
            <p className="font-display text-xl">{active.title}</p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-ink-foreground/25 transition-colors hover:border-gold hover:text-accent"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center gap-3 py-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-ink-foreground/25 text-primary-foreground transition-colors hover:border-gold hover:text-accent sm:inline-flex"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <img
              src={active.image}
              alt={active.alt}
              className="max-h-[75svh] w-auto max-w-full rounded-sm object-contain"
            />
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-ink-foreground/25 text-primary-foreground transition-colors hover:border-gold hover:text-accent sm:inline-flex"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 text-primary-foreground sm:hidden">
            <button type="button" onClick={prev} aria-label="Previous image" className="h-11 px-4">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="text-xs tracking-[0.16em]">
              {(activeIndex ?? 0) + 1} / {images.length}
            </span>
            <button type="button" onClick={next} aria-label="Next image" className="h-11 px-4">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

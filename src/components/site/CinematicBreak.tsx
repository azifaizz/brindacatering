import { useEffect, useRef, useState } from "react";

type Props = {
  image: string;
  alt: string;
  statement: string;
};

/** Full-width parallax statement band. Motion is disabled for reduced-motion. */
export function CinematicBreak({ image, alt, statement }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        setOffset((Math.min(Math.max(progress, 0), 1) - 0.5) * 60);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ink">
      <img
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={1920}
        height={1080}
        className="absolute inset-0 h-[120%] w-full object-cover"
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[color-mix(in_oklab,var(--ink)_62%,transparent)]"
      />
      <div className="relative mx-auto flex min-h-[60svh] max-w-[1600px] items-center px-5 py-24 sm:px-8 lg:px-12">
        <p className="max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] leading-[1.08] text-ink-foreground">
          {statement}
        </p>
      </div>
    </section>
  );
}

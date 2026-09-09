import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
  alt: string;
};

export function PageHero({ eyebrow, title, intro, image, alt }: Props) {
  return (
    <section className="relative isolate flex min-h-[62svh] items-end overflow-hidden bg-ink pt-28">
      <img
        src={image}
        alt={alt}
        width={1920}
        height={1080}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--ink)_92%,transparent),color-mix(in_oklab,var(--ink)_55%,transparent))]"
      />
      <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-20 sm:px-8 lg:px-12 lg:pb-24">
        <p className="eyebrow text-gold">{eyebrow}</p>
        <h1 className="mt-6 max-w-4xl font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-ink-foreground">
          {title}
        </h1>
        {intro ? (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-foreground/80 sm:text-lg lg:text-xl">
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}

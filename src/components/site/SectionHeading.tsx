import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "default" | "inverse";
  className?: string;
  as?: "h2" | "h3";
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "default",
  className,
  as = "h2",
}: Props) {
  const Heading = as;
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className={cn("eyebrow mb-5", tone === "inverse" ? "text-gold" : "text-primary")}>
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(
          "text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-6xl",
          tone === "inverse" ? "text-ink-foreground" : "text-foreground",
        )}
      >
        {title}
      </Heading>
      {intro ? (
        <p
          className={cn(
            "mt-6 max-w-2xl text-base leading-relaxed sm:text-lg",
            align === "center" && "mx-auto",
            tone === "inverse" ? "text-ink-foreground/70" : "text-muted-foreground",
          )}
        >
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}

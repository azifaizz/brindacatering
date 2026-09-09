import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "gold";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm ring-1 ring-transparent hover:bg-ink hover:ring-gold/40 hover:shadow-[0_15px_40px_-15px_color-mix(in_oklab,var(--primary)_80%,transparent)] hover:-translate-y-1",
  outline: "rounded-full border border-current/30 text-current hover:bg-current/10 hover:-translate-y-0.5",
  ghost: "rounded-full text-current hover:opacity-80",
  gold: "bg-gold text-primary font-semibold shadow-[0_0_20px_color-mix(in_oklab,var(--gold)_30%,transparent)] ring-1 ring-gold/50 hover:bg-gold/90 hover:-translate-y-1 hover:shadow-[0_10px_30px_color-mix(in_oklab,var(--gold)_50%,transparent)] hover:ring-gold",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  withArrow?: boolean;
};

export function CTALink({
  children,
  variant = "primary",
  className,
  withArrow = true,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, variants[variant], className)} {...rest}>
      {children}
      {withArrow ? <Arrow /> : null}
    </Link>
  );
}

export function CTAAnchor({
  children,
  variant = "primary",
  className,
  withArrow = true,
  ...rest
}: CommonProps & ComponentProps<"a">) {
  return (
    <a className={cn(base, variants[variant], className)} rel="noopener noreferrer" {...rest}>
      {children}
      {withArrow ? <Arrow /> : null}
    </a>
  );
}

export function CTAButton({
  children,
  variant = "primary",
  className,
  withArrow = true,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
      {withArrow ? <Arrow /> : null}
    </button>
  );
}

function Arrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
    />
  );
}

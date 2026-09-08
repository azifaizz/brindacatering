import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { telLink } from "@/lib/whatsapp";
import { business } from "@/data/business";

export function CallButton() {
  const [mounted, setMounted] = useState(false);
  const href = telLink();

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  if (!href) return null;

  return (
    <a
      href={href}
      aria-label="Call us"
      className={cn(
        "group fixed left-4 bottom-4 z-50 inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-gold px-6 text-accent-foreground shadow-[0_12px_36px_-12px_color-mix(in_oklab,var(--gold)_70%,transparent)] transition-all duration-500 hover:scale-105 sm:left-6 sm:bottom-6",
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
    >
      {/* Shine Animation Layer */}
      <span className="absolute inset-0 z-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-2 font-medium tracking-wide">
        <Phone className="h-5 w-5 animate-pulse" />
        <span className="text-sm font-bold uppercase tracking-wider">{business.phone}</span>
      </div>
    </a>
  );
}

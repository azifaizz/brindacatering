import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { business } from "@/data/business";
import { mailLink, telLink, whatsAppLink } from "@/lib/whatsapp";
import { CTALink } from "./CTAButton";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/menu", label: "Menu" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  const wa = whatsAppLink();
  const tel = telLink();
  const mail = mailLink();

  return (
    <footer className="bg-ink text-primary-foreground border-t border-ink-foreground/10">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          <div>
            <p className="font-display text-3xl leading-tight">Brinda</p>
            <p className="eyebrow mt-2 text-accent">Catering Services</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-primary-foreground/50">
              Professional catering for weddings, celebrations, corporate events and special
              occasions.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow text-primary-foreground/50">Navigate</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-primary-foreground/50 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-primary-foreground/50">Contact</h2>
            <ul className="mt-6 space-y-4 text-sm text-primary-foreground/50">
              <li className="flex items-start gap-3">
                <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 text-accent" />
                {tel ? (
                  <a href={tel} className="hover:text-accent">
                    {business.phone}
                  </a>
                ) : (
                  <span className="text-primary-foreground/50">Phone number to be added</span>
                )}
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle aria-hidden="true" className="mt-0.5 h-4 w-4 text-accent" />
                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent"
                  >
                    {business.phone}
                  </a>
                ) : (
                  <span className="text-primary-foreground/50">WhatsApp number to be added</span>
                )}
              </li>
              <li className="flex items-start gap-3">
                <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 text-accent" />
                {mail ? (
                  <a href={mail} className="hover:text-accent">
                    {business.email}
                  </a>
                ) : (
                  <span className="text-primary-foreground/50">Email to be added</span>
                )}
              </li>
              <li className="flex items-start gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 text-accent" />
                {business.addressLines.length ? (
                  <span>
                    {business.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="text-primary-foreground/50">Address to be added</span>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-primary-foreground/50">Plan your event</h2>
            <CTALink to="/contact" variant="gold" className="mt-6 w-max">
              Get a Quote
            </CTALink>
            {(business.instagram || business.facebook) && (
              <div className="mt-8 flex gap-4">
                {business.instagram ? (
                  <a
                    href={business.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-ink-foreground/20 transition-colors hover:border-gold hover:text-accent"
                  >
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
                {business.facebook ? (
                  <a
                    href={business.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-ink-foreground/20 transition-colors hover:border-gold hover:text-accent"
                  >
                    <Facebook className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ink-foreground/10 pt-8 text-xs text-primary-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <p>Website content and contact details are configurable.</p>
        </div>
      </div>
    </footer>
  );
}

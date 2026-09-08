import { MapPin } from "lucide-react";
import { business } from "@/data/business";
import { CTAAnchor } from "./CTAButton";

export function MapSection() {
  return (
    <section aria-labelledby="map-heading" className="bg-secondary/50">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12">
        <h2 id="map-heading" className="font-display text-3xl sm:text-4xl">
          Find us
        </h2>
        <div className="mt-8 overflow-hidden rounded-sm border border-border bg-card">
          {business.googleMapsEmbedUrl ? (
            <iframe
              title={`Map showing the location of ${business.name}`}
              src={business.googleMapsEmbedUrl}
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-[280px] flex-col items-center justify-center gap-3 px-6 text-center">
              <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
              <p className="font-display text-2xl">Location to be added</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Add the Google Maps embed URL in the business configuration and the map will appear
                here.
              </p>
            </div>
          )}
        </div>
        {business.googleMapsUrl ? (
          <CTAAnchor
            href={business.googleMapsUrl}
            target="_blank"
            variant="outline"
            className="mt-8 text-foreground"
          >
            Get Directions
          </CTAAnchor>
        ) : null}
      </div>
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, onSnapshot } from "firebase/firestore";
import { HeroVideo } from "@/components/site/HeroVideo";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CTALink } from "@/components/site/CTAButton";
import { CinematicBreak } from "@/components/site/CinematicBreak";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { FinalCTA } from "@/components/site/FinalCTA";
import { sortedGallery } from "@/data/gallery";
import { 
  aboutPageData, 
  cateringHighlights as initialHighlights, 
  foodHighlights, 
  cateringExperience, 
  celebrationMoments 
} from "@/data/business";
import feastImage from "@/assets/hero-south-indian.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      {
        title: "Brinda Caterers | Authentic South Indian Catering in Cheyyar & Beyond",
      },
      {
        name: "description",
        content:
          "Authentic South Indian vegetarian and non-vegetarian catering for weddings, family functions, celebrations and corporate events.",
      },
      {
        property: "og:title",
        content: "Brinda Caterers — Wedding & Event Catering",
      },
      {
        property: "og:description",
        content:
          "South Indian vegetarian and non-vegetarian food with traditional hospitality for weddings and functions.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Home() {
  const [highlights, setHighlights] = useState(initialHighlights);
  const [ourStoryImage, setOurStoryImage] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    const fetchHighlights = async () => {
      try {
        const q = query(collection(db, 'cateringHighlights'), orderBy('order'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const dbHighlights = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // We cast and map to ensure we match the shape expected by the UI
          setHighlights(dbHighlights as any);
        }
      } catch (err) {
        console.error("Failed to load highlights", err);
      }
    };
    fetchHighlights();

    const unsubscribeStory = onSnapshot(doc(db, 'siteSettings', 'ourStoryImage'), (docSnap) => {
      if (docSnap.exists()) {
        setOurStoryImage(docSnap.data().image);
      } else {
        setOurStoryImage(null);
      }
    });

    return () => unsubscribeStory();
  }, []);

  return (
    <>
      {/* 01 — Hero */}
      <HeroVideo />

      {/* 02 — Brand Introduction */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <Reveal>
              <div className="overflow-hidden rounded-2xl shadow-lg">
                {ourStoryImage ? (
                  <img
                    src={ourStoryImage}
                    alt="Our Story"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full flex-col items-center justify-center bg-muted/50 transition-transform duration-[1200ms] hover:scale-105 border-2 border-dashed border-border/50">
                    <span className="font-display text-2xl text-muted-foreground">Master Photo / Logo Placeholder</span>
                    <span className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">Upload Image Here</span>
                  </div>
                )}
              </div>
            </Reveal>
            <Reveal delay={100} className="flex flex-col justify-center">
              <p className="eyebrow text-primary">Our Story</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-7xl leading-[1.1] text-foreground">
                Tradition in every detail.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {aboutPageData.ourStory.intro}
              </p>
              <div className="mt-10">
                <CTALink to="/about">Discover Our Story</CTALink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 — Catering Highlights */}
      <section className="bg-secondary/20">
        <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <SectionHeading
            align="center"
            eyebrow="What we do"
            title="Catering Highlights"
            intro="Professional service shaped around the scale and traditions of your occasion."
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((highlight: any, index: number) => (
              <Reveal
                as="article"
                key={highlight.title || highlight.id}
                delay={index * 100}
                className="group relative overflow-hidden rounded-2xl shadow-sm"
              >
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={highlight.image}
                    alt={highlight.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent opacity-100 transition-opacity duration-500 group-hover:opacity-80" />
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="font-display text-2xl leading-tight text-primary-foreground">
                    {highlight.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-primary-foreground/50">
                    {highlight.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Food Highlights */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <SectionHeading
            align="center"
            eyebrow="The food"
            title="Signature Dishes"
            intro="A glimpse into the authentic South Indian flavours we bring to your celebration."
          />
          <ul className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {foodHighlights.map((item, index) => (
              <Reveal as="li" key={item.name} delay={index * 80}>
                <div className="group overflow-hidden rounded-xl shadow-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]"
                  />
                </div>
                <h3 className="mt-6 text-center font-display text-xl text-foreground">{item.name}</h3>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-16 text-center">
            <CTALink to="/menu">Explore Our Menu</CTALink>
          </Reveal>
        </div>
      </section>

      {/* 05 — Catering Experience */}
      <section className="bg-ink text-primary-foreground">
        <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <SectionHeading
            align="center"
            tone="inverse"
            eyebrow="The experience"
            title="How it comes together"
            intro="From our kitchen to your celebration, we ensure every detail is handled with care."
          />
          <div className="mt-24 mx-auto max-w-4xl flex flex-col">
            {cateringExperience.map((exp, index) => (
              <Reveal 
                key={exp.step}
                delay={index * 100}
                className="group flex flex-col sm:flex-row items-start gap-6 sm:gap-8 border-t border-border/20 py-12 transition-colors hover:border-gold/40"
              >
                <span className="font-sans font-light text-5xl sm:text-7xl text-primary-foreground/50 transition-colors group-hover:text-accent shrink-0">
                  {exp.step}
                </span>
                <div className="pt-2">
                  <h3 className="font-display text-3xl sm:text-4xl tracking-tight text-primary-foreground">{exp.title}</h3>
                  <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-primary-foreground/50">
                    {exp.description}
                  </p>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-border/20" />
          </div>
        </div>
      </section>

      {/* 06 — Cinematic Feast */}
      <CinematicBreak
        image={feastImage}
        alt="Traditional South Indian feast served on a banana leaf with brass vessels"
        statement="Tradition Served With Care."
      />


      {/* 09 — Final CTA */}
      <FinalCTA />
    </>
  );
}

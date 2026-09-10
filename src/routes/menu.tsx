import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { FinalCTA } from "@/components/site/FinalCTA";
import { itemsByCategory, menuCategories as defaultCategories, MenuItem, MenuCategory } from "@/data/menu";
import feastImage from "@/assets/premium-feast.jpg";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export const Route = createFileRoute("/menu")({
  component: MenuPage,
  head: () => ({
    meta: [
      { title: "Brinda Caterers" },
      {
        name: "description",
        content:
          "Explore South Indian vegetarian, non-vegetarian, tiffin, sweets and celebration menu directions, customised to your occasion.",
      },
      { property: "og:title", content: "Catering Menu — Brinda Caterers" },
      {
        property: "og:description",
        content:
          "South Indian menu directions customised for weddings, family functions and events.",
      },
      { property: "og:url", content: "/menu" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
  }),
});

function MenuPage() {
  const [firebaseItems, setFirebaseItems] = useState<MenuItem[] | null>(null);
  const [firebaseCategories, setFirebaseCategories] = useState<MenuCategory[]>(defaultCategories);

  useEffect(() => {
    if (!db) return;
    const qItems = query(collection(db, 'menuItems'), orderBy('order'));
    const unsubscribeItems = onSnapshot(qItems, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as MenuItem);
      setFirebaseItems(data);
    }, (error) => {
      console.error("Error fetching menu items:", error);
    });

    const qCategories = query(collection(db, 'menuCategories'), orderBy('order'));
    const unsubscribeCategories = onSnapshot(qCategories, (snapshot) => {
      if (!snapshot.empty) {
        const dbCategories = snapshot.docs.map(doc => doc.data() as MenuCategory);
        
        // Gracefully merge any missing default categories so the UI never breaks
        const existingIds = new Set(dbCategories.map(c => c.id));
        const missingDefaults = defaultCategories.filter(c => !existingIds.has(c.id));
        const combined = [...dbCategories, ...missingDefaults].sort((a, b) => (a.order || 0) - (b.order || 0));
        
        setFirebaseCategories(combined);
      }
    }, (error) => {
      console.error("Error fetching menu categories:", error);
    });

    return () => {
      unsubscribeItems();
      unsubscribeCategories();
    };
  }, []);

  const getItemsForCategory = (categoryId: string) => {
    if (firebaseItems !== null) {
      return firebaseItems.filter(item => item.category === categoryId);
    }
    return itemsByCategory(categoryId);
  };

  return (
    <>
      <PageHero
        eyebrow="Menu"
        title="A Taste of South Indian Tradition"
        intro="These categories show the direction of our menus — every dish and service detail is confirmed with you."
        image={feastImage}
        alt="Traditional South Indian vegetarian feast served on a banana leaf"
      />

      <section className="bg-background">
        <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="space-y-32">
            {firebaseCategories.map((category) => {
              const items = getItemsForCategory(category.id);
              return (
                <section
                  key={category.id}
                  id={category.id}
                  aria-labelledby={`${category.id}-title`}
                  className="scroll-mt-24"
                >
                  <Reveal className="mb-12">
                    <h2
                      id={`${category.id}-title`}
                      className="font-display text-4xl sm:text-5xl"
                    >
                      {category.name}
                    </h2>
                    <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                      {category.description}
                    </p>
                  </Reveal>

                  {items.length ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {items.map((item, itemIndex) => {
                        const displayImage = item.image?.startsWith('/src/assets/')
                          ? item.image.replace('/src/assets/', '/assets/')
                          : item.image;
                          
                        return (
                        <Reveal
                          key={item.id}
                          delay={(itemIndex % 4) * 80}
                          className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all hover:shadow-md"
                        >
                          {displayImage ? (
                            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                              <img
                                src={displayImage}
                                alt={item.name}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            </div>
                          ) : null}
                          <div className="flex flex-1 flex-col p-6">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="font-display text-xl leading-tight text-foreground">{item.name}</h3>
                              {item.price ? (
                                <span className="shrink-0 text-sm font-medium text-primary">{item.price}</span>
                              ) : null}
                            </div>
                            
                            {item.tags?.length ? (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {item.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-sm bg-secondary/80 px-2.5 py-1 text-xs uppercase tracking-wider text-secondary-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                            
                            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </Reveal>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
                      Dishes for this category will be listed once supplied.
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA 
        title="Need a Menu for Your Event?"
        description="Whether you're planning an intimate gathering or a grand wedding, we can shape a custom catering package around your unique requirements."
        primaryCtaLabel="Get a Catering Quote"
      />
    </>
  );
}

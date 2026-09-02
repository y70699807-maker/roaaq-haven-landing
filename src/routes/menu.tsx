import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell, SectionHeading } from "@/components/page-shell";
import { menuQuery } from "@/lib/site-data";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "المنيو | رواق" },
      {
        name: "description",
        content: "منيو رواق: قهوة ساخنة وباردة، مختصة، وحلويات طازجة يومياً.",
      },
      { property: "og:title", content: "المنيو | رواق" },
      { property: "og:description", content: "قهوة ساخنة وباردة ومختصة وحلويات طازجة." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { data, isLoading } = useQuery(menuQuery);
  const items = (data ?? []).filter((item) => item.available);
  const categories = Array.from(new Set(items.map((item) => item.category)));

  return (
    <PageShell>
      <section className="section-pad">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHeading eyebrow="MENU" title="المنيو" subtitle="محمّص يومياً ومُحضّر بعناية." />

          {isLoading ? <p className="mt-10 text-muted-foreground">جاري التحميل…</p> : null}

          <div className="mt-12 grid gap-12">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-xl font-extrabold">{category}</h3>
                <div className="mt-6 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                  {items
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <article key={item.id} className="bg-background p-6">
                        <div className="flex items-baseline justify-between gap-4">
                          <h4 className="truncate text-lg font-bold">{item.name}</h4>
                          <span className="shrink-0 text-sm font-bold">
                            {Number(item.price)} ج.م
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </article>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

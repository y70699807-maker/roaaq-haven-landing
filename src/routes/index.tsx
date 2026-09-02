import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Coffee, Leaf, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { PageShell, SectionHeading } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { contentQuery, menuQuery, pickSection } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "رواق | قهوة مختصة بروح المكان" },
      {
        name: "description",
        content:
          "رواق كافيه: قهوة مختصة محمّصة يومياً، منيو متنوع من الساخن والبارد والحلويات، ومساحة هادئة تليق بلحظتك.",
      },
      { property: "og:title", content: "رواق | قهوة مختصة بروح المكان" },
      {
        property: "og:description",
        content: "قهوة مختصة محمّصة يومياً ومساحة هادئة تليق بلحظتك.",
      },
    ],
  }),
  component: HomePage,
});

const pillars = [
  { icon: Coffee, title: "تحميص يومي", body: "دفعات صغيرة كل صباح لضمان أقصى نضارة في الفنجان." },
  { icon: Leaf, title: "حبوب مختارة", body: "مصادر موثوقة ومزارع نعرفها بالاسم، لا بالصدفة." },
  { icon: Sparkles, title: "تجربة هادئة", body: "مساحة مصمّمة للسكون، للعمل، وللحديث الطويل." },
];

function HomePage() {
  const { data: content } = useQuery(contentQuery);
  const { data: menu } = useQuery(menuQuery);

  const hero = pickSection(content, "hero");
  const about = pickSection(content, "about");
  const vision = pickSection(content, "vision");
  const mission = pickSection(content, "mission");
  const featured = (menu ?? []).filter((item) => item.available).slice(0, 6);

  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rise-in">
            <p className="eyebrow">SPECIALTY COFFEE</p>
            <h1 className="mt-4 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              {hero.title}
            </h1>
            <p className="mt-4 text-xl font-semibold text-muted-foreground sm:text-2xl">
              {hero.subtitle}
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              {hero.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/menu">
                  تصفّح المنيو
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">تعرّف علينا</Link>
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative grid aspect-square w-full max-w-md place-items-center rounded-full border border-border bg-card p-10">
              <BrandLogo className="h-full w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="hairline-y">
        <div className="mx-auto grid max-w-6xl gap-px bg-border px-0 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="bg-background px-6 py-10">
              <pillar.icon className="h-6 w-6" />
              <h3 className="mt-4 text-lg font-bold">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:px-6 lg:grid-cols-2">
          <SectionHeading eyebrow="ABOUT" title={about.title} subtitle={about.subtitle} />
          <p className="text-base leading-loose text-muted-foreground">{about.body}</p>
        </div>
      </section>

      <section className="hairline-y bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          {[vision, mission].map((item, index) => (
            <article key={item.section} className="rounded-lg border border-border bg-card p-8">
              <p className="eyebrow">{index === 0 ? "VISION" : "MISSION"}</p>
              <h3 className="mt-3 text-2xl font-extrabold">{item.title}</h3>
              <p className="mt-2 font-semibold text-muted-foreground">{item.subtitle}</p>
              <p className="mt-4 leading-loose text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHeading eyebrow="MENU" title="مختارات من المنيو" />
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <div key={item.id} className="bg-background p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="truncate text-lg font-bold">{item.name}</h3>
                  <span className="shrink-0 text-sm font-bold">{Number(item.price)} ج.م</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">{item.category}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="outline">
              <Link to="/menu">المنيو الكامل</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

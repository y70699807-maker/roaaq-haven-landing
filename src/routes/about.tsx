import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell, SectionHeading } from "@/components/page-shell";
import { BrandLogo } from "@/components/brand-logo";
import { contentQuery, pickSection } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن | رواق" },
      {
        name: "description",
        content: "قصة رواق: شغف بالقهوة المختصة، حبوب مختارة، وتحميص على دفعات صغيرة.",
      },
      { property: "og:title", content: "من نحن | رواق" },
      { property: "og:description", content: "قصة رواق وشغفنا بالقهوة المختصة." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useQuery(contentQuery);
  const about = pickSection(data, "about");

  return (
    <PageShell>
      <section className="section-pad">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:px-6 lg:grid-cols-[1fr_0.7fr]">
          <div>
            <SectionHeading eyebrow="ABOUT" title={about.title} subtitle={about.subtitle} />
            <p className="mt-8 text-lg leading-loose text-muted-foreground">{about.body}</p>
          </div>
          <div className="grid place-items-center rounded-lg border border-border bg-card p-10">
            <BrandLogo className="h-56 w-56" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

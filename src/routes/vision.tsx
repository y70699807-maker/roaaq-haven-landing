import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell, SectionHeading } from "@/components/page-shell";
import { contentQuery, pickSection } from "@/lib/site-data";

export const Route = createFileRoute("/vision")({
  head: () => ({
    meta: [
      { title: "رؤيتنا | رواق" },
      {
        name: "description",
        content: "رؤية رواق: أن نكون العنوان الأول للقهوة المختصة وتجربة إنسانية دافئة.",
      },
      { property: "og:title", content: "رؤيتنا | رواق" },
      { property: "og:description", content: "أن نكون العنوان الأول للقهوة المختصة." },
    ],
  }),
  component: VisionPage,
});

function VisionPage() {
  const { data } = useQuery(contentQuery);
  const vision = pickSection(data, "vision");

  return (
    <PageShell>
      <section className="section-pad">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeading eyebrow="VISION" title={vision.title} subtitle={vision.subtitle} />
          <p className="mt-8 text-lg leading-loose text-muted-foreground">{vision.body}</p>
        </div>
      </section>
    </PageShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell, SectionHeading } from "@/components/page-shell";
import { contentQuery, pickSection } from "@/lib/site-data";

export const Route = createFileRoute("/mission")({
  head: () => ({
    meta: [
      { title: "رسالتنا | رواق" },
      {
        name: "description",
        content: "رسالة رواق: قهوة طازجة محمّصة بإتقان، وضيافة تحترم وقت ضيفنا وذوقه.",
      },
      { property: "og:title", content: "رسالتنا | رواق" },
      { property: "og:description", content: "جودة بلا تنازل، وضيافة بلا تكلّف." },
    ],
  }),
  component: MissionPage,
});

function MissionPage() {
  const { data } = useQuery(contentQuery);
  const mission = pickSection(data, "mission");

  return (
    <PageShell>
      <section className="section-pad">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeading eyebrow="MISSION" title={mission.title} subtitle={mission.subtitle} />
          <p className="mt-8 text-lg leading-loose text-muted-foreground">{mission.body}</p>
        </div>
      </section>
    </PageShell>
  );
}

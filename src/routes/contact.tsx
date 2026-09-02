import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell, SectionHeading } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { contentQuery, pickSection } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | رواق" },
      { name: "description", content: "ابعت رسالتك لفريق رواق وهنرد عليك في أقرب وقت." },
      { property: "og:title", content: "تواصل معنا | رواق" },
      { property: "og:description", content: "ابعت رسالتك لفريق رواق." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data } = useQuery(contentQuery);
  const contact = pickSection(data, "contact");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSaving(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? "") || null,
      message: String(formData.get("message") ?? ""),
    });
    setSaving(false);
    if (error) {
      toast.error("حصلت مشكلة في إرسال الرسالة، جرّب تاني.");
      return;
    }
    toast.success("وصلتنا رسالتك، شكراً لك!");
    form.reset();
  }

  return (
    <PageShell>
      <section className="section-pad">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:px-6 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="CONTACT" title={contact.title} subtitle={contact.subtitle} />
            <p className="mt-6 leading-loose text-muted-foreground">{contact.body}</p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-border bg-card p-6">
            <div className="grid gap-2">
              <Label htmlFor="name">الاسم</Label>
              <Input id="name" name="name" required maxLength={80} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" name="email" type="email" required maxLength={120} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">رقم الموبايل (اختياري)</Label>
                <Input id="phone" name="phone" maxLength={30} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">رسالتك</Label>
              <Textarea id="message" name="message" required rows={5} maxLength={1500} />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "جاري الإرسال…" : "إرسال"}
            </Button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

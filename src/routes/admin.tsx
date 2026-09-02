import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Coffee, FileText, LogOut, Mail, Moon, Sun, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/use-auth";
import {
  contentQuery,
  menuQuery,
  messagesQuery,
  type MenuItem,
  type SiteContent,
} from "@/lib/site-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم | رواق" },
      { name: "description", content: "لوحة تحكم رواق لإدارة المحتوى والمنيو ورسائل العملاء." },
      { property: "og:title", content: "لوحة التحكم | رواق" },
      { property: "og:description", content: "إدارة محتوى موقع رواق." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const sectionLabels: Record<string, string> = {
  hero: "الرئيسية (الهيرو)",
  about: "من نحن",
  vision: "الرؤية",
  mission: "الرسالة",
  contact: "تواصل معنا",
};

function AdminPage() {
  const { session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        جاري التحميل…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 md:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <BrandLogo className="h-9 w-9 shrink-0 rounded-full" />
            <span className="truncate font-extrabold">لوحة تحكم رواق</span>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="تبديل الوضع">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth" });
              }}
            >
              <LogOut className="h-4 w-4" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {!isAdmin ? (
          <div className="rounded-lg border border-border bg-card p-8">
            <h1 className="text-xl font-extrabold">حسابك مش أدمن لسه</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              دخلت بحساب: {session.user.email}. لازم يتضاف لحسابك دور «admin» عشان تقدر تعدّل
              المحتوى والمنيو وتشوف الرسائل. اطلب من مالك الموقع إضافة الصلاحية.
            </p>
          </div>
        ) : (
          <AdminTabs />
        )}
      </main>
    </div>
  );
}

function AdminTabs() {
  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">
          <FileText className="ms-1 h-4 w-4" />
          المحتوى
        </TabsTrigger>
        <TabsTrigger value="menu">
          <Coffee className="ms-1 h-4 w-4" />
          المنيو
        </TabsTrigger>
        <TabsTrigger value="messages">
          <Mail className="ms-1 h-4 w-4" />
          الرسائل
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="mt-6">
        <ContentManager />
      </TabsContent>
      <TabsContent value="menu" className="mt-6">
        <MenuManager />
      </TabsContent>
      <TabsContent value="messages" className="mt-6">
        <MessagesManager />
      </TabsContent>
    </Tabs>
  );
}

function ContentManager() {
  const queryClient = useQueryClient();
  const { data } = useQuery(contentQuery);

  const save = useMutation({
    mutationFn: async (item: SiteContent) => {
      const { error } = await supabase
        .from("site_content")
        .update({ title: item.title, subtitle: item.subtitle, body: item.body })
        .eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم حفظ المحتوى");
      queryClient.invalidateQueries({ queryKey: contentQuery.queryKey });
    },
    onError: () => toast.error("تعذّر الحفظ"),
  });

  return (
    <div className="grid gap-6">
      {(data ?? []).map((section) => (
        <ContentCard key={section.id} section={section} onSave={(item) => save.mutate(item)} />
      ))}
    </div>
  );
}

function ContentCard({
  section,
  onSave,
}: {
  section: SiteContent;
  onSave: (item: SiteContent) => void;
}) {
  const [draft, setDraft] = useState(section);
  useEffect(() => setDraft(section), [section]);

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-extrabold">{sectionLabels[section.section] ?? section.section}</h2>
      <div className="mt-4 grid gap-4">
        <div className="grid gap-2">
          <Label>العنوان</Label>
          <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label>العنوان الفرعي</Label>
          <Input
            value={draft.subtitle}
            onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label>النص</Label>
          <Textarea
            rows={4}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          />
        </div>
        <div>
          <Button onClick={() => onSave(draft)}>حفظ</Button>
        </div>
      </div>
    </div>
  );
}

const emptyItem = {
  name: "",
  description: "",
  price: 0,
  category: "قهوة ساخنة",
  available: true,
  sort_order: 99,
};

function MenuManager() {
  const queryClient = useQueryClient();
  const { data } = useQuery(menuQuery);
  const [newItem, setNewItem] = useState({ ...emptyItem });

  const refresh = () => queryClient.invalidateQueries({ queryKey: menuQuery.queryKey });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("menu_items").insert(newItem);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تمت إضافة الصنف");
      setNewItem({ ...emptyItem });
      refresh();
    },
    onError: () => toast.error("تعذّرت الإضافة"),
  });

  const update = useMutation({
    mutationFn: async (item: MenuItem) => {
      const { error } = await supabase
        .from("menu_items")
        .update({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          available: item.available,
          sort_order: item.sort_order,
        })
        .eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم التحديث");
      refresh();
    },
    onError: () => toast.error("تعذّر التحديث"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم الحذف");
      refresh();
    },
    onError: () => toast.error("تعذّر الحذف"),
  });

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-extrabold">إضافة صنف جديد</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>الاسم</Label>
            <Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>التصنيف</Label>
            <Input
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>السعر</Label>
            <Input
              type="number"
              step="0.5"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label>الترتيب</Label>
            <Input
              type="number"
              value={newItem.sort_order}
              onChange={(e) => setNewItem({ ...newItem, sort_order: Number(e.target.value) })}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label>الوصف</Label>
            <Textarea
              rows={2}
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </div>
        </div>
        <Button className="mt-4" disabled={!newItem.name} onClick={() => create.mutate()}>
          إضافة
        </Button>
      </div>

      <div className="grid gap-4">
        {(data ?? []).map((item) => (
          <MenuRow
            key={item.id}
            item={item}
            onSave={(next) => update.mutate(next)}
            onDelete={() => remove.mutate(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MenuRow({
  item,
  onSave,
  onDelete,
}: {
  item: MenuItem;
  onSave: (item: MenuItem) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState(item);
  useEffect(() => setDraft(item), [item]);

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>الاسم</Label>
          <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label>التصنيف</Label>
          <Input
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label>السعر</Label>
          <Input
            type="number"
            step="0.5"
            value={draft.price}
            onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
          />
        </div>
        <div className="grid gap-2">
          <Label>الترتيب</Label>
          <Input
            type="number"
            value={draft.sort_order}
            onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
          />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label>الوصف</Label>
          <Textarea
            rows={2}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={draft.available}
            onCheckedChange={(checked) => setDraft({ ...draft, available: checked })}
          />
          <span className="text-sm text-muted-foreground">متاح</span>
        </div>
        <Button size="sm" onClick={() => onSave(draft)}>
          حفظ
        </Button>
        <Button size="sm" variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          حذف
        </Button>
      </div>
    </div>
  );
}

function MessagesManager() {
  const queryClient = useQueryClient();
  const { data } = useQuery(messagesQuery);
  const refresh = () => queryClient.invalidateQueries({ queryKey: messagesQuery.queryKey });

  const markRead = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase.from("contact_messages").update({ is_read }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم حذف الرسالة");
      refresh();
    },
  });

  const messages = data ?? [];

  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-muted-foreground">
        مفيش رسائل لسه.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {messages.map((message) => (
        <div key={message.id} className="rounded-lg border border-border bg-card p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <p className="truncate font-bold">{message.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {message.email}
                {message.phone ? ` — ${message.phone}` : ""}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {new Date(message.created_at).toLocaleDateString("ar-EG")}
            </span>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{message.message}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={message.is_read}
                onCheckedChange={(checked) =>
                  markRead.mutate({ id: message.id, is_read: checked })
                }
              />
              <span className="text-sm text-muted-foreground">مقروءة</span>
            </div>
            <Button size="sm" variant="destructive" onClick={() => remove.mutate(message.id)}>
              <Trash2 className="h-4 w-4" />
              حذف
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

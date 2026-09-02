import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | رواق" },
      { name: "description", content: "تسجيل دخول فريق رواق للوصول للوحة التحكم." },
      { property: "og:title", content: "تسجيل الدخول | رواق" },
      { property: "og:description", content: "دخول فريق رواق." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/admin" });
  }, [session, navigate]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    setBusy(true);
    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(mode === "signin" ? "أهلاً بك من جديد" : "تم إنشاء الحساب");
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("تعذّر تسجيل الدخول بجوجل");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8">
        <div className="flex flex-col items-center text-center">
          <BrandLogo className="h-16 w-16 rounded-full" />
          <h1 className="mt-4 text-2xl font-extrabold">لوحة تحكم رواق</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "سجّل دخولك للمتابعة" : "أنشئ حساب فريق جديد"}
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? "لحظة…" : mode === "signin" ? "دخول" : "إنشاء حساب"}
          </Button>
        </form>

        <Button variant="outline" className="mt-3 w-full" onClick={onGoogle}>
          المتابعة بحساب جوجل
        </Button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {mode === "signin" ? "مالكش حساب؟ سجّل الآن" : "عندك حساب؟ سجّل دخولك"}
        </button>
      </div>
    </div>
  );
}

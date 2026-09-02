import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <BrandLogo className="h-12 w-12 shrink-0 rounded-full" />
          <div className="min-w-0">
            <p className="text-base font-extrabold">رواق</p>
            <p className="text-sm text-muted-foreground">قهوة بروح المكان</p>
          </div>
        </div>

        <nav className="grid gap-2 text-sm text-muted-foreground">
          <Link to="/about" className="transition-colors hover:text-foreground">
            من نحن
          </Link>
          <Link to="/vision" className="transition-colors hover:text-foreground">
            رؤيتنا
          </Link>
          <Link to="/mission" className="transition-colors hover:text-foreground">
            رسالتنا
          </Link>
          <Link to="/menu" className="transition-colors hover:text-foreground">
            المنيو
          </Link>
        </nav>

        <div className="text-sm text-muted-foreground">
          <p>مواعيد العمل: يومياً ٨ص — ١٢م</p>
          <Link to="/contact" className="mt-2 inline-block transition-colors hover:text-foreground">
            تواصل معنا
          </Link>
          <p className="mt-4 text-xs">
            © {new Date().getFullYear()} رواق. جميع الحقوق محفوظة.{" "}
            <Link to="/admin" className="underline-offset-4 hover:underline">
              لوحة التحكم
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

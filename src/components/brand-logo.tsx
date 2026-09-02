import logoDark from "@/assets/logo-dark.asset.json";
import logoLight from "@/assets/logo-light.asset.json";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <>
      <img
        src={logoLight.url}
        alt="شعار رواق"
        className={cn("block object-contain dark:hidden", className)}
        loading="eager"
      />
      <img
        src={logoDark.url}
        alt="شعار رواق"
        className={cn("hidden object-contain dark:block", className)}
        loading="eager"
      />
    </>
  );
}

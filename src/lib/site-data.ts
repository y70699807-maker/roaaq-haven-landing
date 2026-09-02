import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteContent = {
  id: string;
  section: string;
  title: string;
  subtitle: string;
  body: string;
  sort_order: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
  sort_order: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export const contentQuery = queryOptions({
  queryKey: ["site_content"],
  queryFn: async (): Promise<SiteContent[]> => {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as SiteContent[];
  },
});

export const menuQuery = queryOptions({
  queryKey: ["menu_items"],
  queryFn: async (): Promise<MenuItem[]> => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as MenuItem[];
  },
});

export const messagesQuery = queryOptions({
  queryKey: ["contact_messages"],
  queryFn: async (): Promise<ContactMessage[]> => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ContactMessage[];
  },
});

export const fallbackContent: Record<string, { title: string; subtitle: string; body: string }> = {
  hero: {
    title: "رواق",
    subtitle: "قهوة بروح المكان",
    body: "كل فنجان في رواق حكاية… حبوب مختارة بعناية، تحميص يومي، وسكون يليق بلحظتك.",
  },
  about: { title: "من نحن", subtitle: "", body: "" },
  vision: { title: "رؤيتنا", subtitle: "", body: "" },
  mission: { title: "رسالتنا", subtitle: "", body: "" },
  contact: { title: "تواصل معنا", subtitle: "", body: "" },
};

export function pickSection(list: SiteContent[] | undefined, section: string) {
  return (
    list?.find((item) => item.section === section) ?? {
      id: section,
      section,
      sort_order: 0,
      ...(fallbackContent[section] ?? { title: "", subtitle: "", body: "" }),
    }
  );
}

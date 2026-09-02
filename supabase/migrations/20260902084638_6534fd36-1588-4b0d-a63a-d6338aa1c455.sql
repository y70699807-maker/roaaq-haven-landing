CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content public read" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "content admin write" ON public.site_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_content_updated BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'قهوة',
  image_url text,
  available boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menu public read" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "menu admin write" ON public.menu_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER menu_items_updated BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "admin reads messages" ON public.contact_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin updates messages" ON public.contact_messages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin deletes messages" ON public.contact_messages FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_content (section, title, subtitle, body, sort_order) VALUES
('hero', 'رواق', 'قهوة بروح المكان', 'كل فنجان في رواق حكاية… حبوب مختارة بعناية، تحميص يومي، وسكون يليق بلحظتك.', 1),
('about', 'من نحن', 'رواق… مساحة للقهوة والهدوء', 'بدأنا رواق من شغف بسيط بالقهوة المختصة، وحوّلناه إلى مكان يجمع الناس حول فنجان صادق. نختار حبوبنا من مزارع موثوقة، ونحمّصها على دفعات صغيرة للحفاظ على نكهتها الكاملة.', 2),
('vision', 'رؤيتنا', 'أن نكون العنوان الأول للقهوة المختصة', 'نطمح أن يصبح رواق المكان الذي يتذكره كل محب للقهوة، حيث تلتقي الجودة العالية بالتجربة الإنسانية الدافئة في كل فرع نفتحه.', 3),
('mission', 'رسالتنا', 'جودة بلا تنازل، وضيافة بلا تكلّف', 'نلتزم بتقديم قهوة طازجة محمّصة بإتقان، وخدمة تحترم وقت ضيفنا وذوقه، مع دعم مزارعي البن وبناء مجتمع قهوة واعٍ.', 4),
('contact', 'تواصل معنا', 'يسعدنا سماعك', 'اترك رسالتك وسنعود إليك في أقرب وقت.', 5);

INSERT INTO public.menu_items (name, description, price, category, sort_order) VALUES
('إسبريسو', 'جرعة مركزة من حبوبنا المحمّصة يومياً', 25, 'قهوة ساخنة', 1),
('لاتيه', 'إسبريسو مع حليب مبخّر ورغوة حريرية', 40, 'قهوة ساخنة', 2),
('كابتشينو', 'توازن مثالي بين الإسبريسو والحليب', 38, 'قهوة ساخنة', 3),
('في60', 'تقطير يدوي يبرز نكهات الحبة الأصلية', 45, 'قهوة مختصة', 4),
('آيس لاتيه', 'لاتيه بارد منعش على الثلج', 45, 'قهوة باردة', 5),
('كولد برو', 'نقع بارد لمدة 18 ساعة، طعم ناعم وقوي', 50, 'قهوة باردة', 6),
('تشيز كيك', 'قطعة كلاسيكية تليق مع فنجانك', 55, 'حلويات', 7),
('كرواسون لوز', 'مخبوز طازج يومياً', 35, 'حلويات', 8);
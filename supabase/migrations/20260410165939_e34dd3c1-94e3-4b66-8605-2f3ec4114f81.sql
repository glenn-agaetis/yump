
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Site Settings table
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Complaints table
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit complaints" ON public.complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view complaints" ON public.complaints FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update complaints" ON public.complaints FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete complaints" ON public.complaints FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Gallery Photos table
CREATE TABLE public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Community',
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view gallery photos" ON public.gallery_photos FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery photos" ON public.gallery_photos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_gallery_photos_updated_at BEFORE UPDATE ON public.gallery_photos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Donors table
CREATE TABLE public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  amount TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view donors" ON public.donors FOR SELECT USING (true);
CREATE POLICY "Admins can manage donors" ON public.donors FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Calendar',
  is_upcoming BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Blood Donors table
CREATE TABLE public.blood_donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blood_donors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view blood donors" ON public.blood_donors FOR SELECT USING (true);
CREATE POLICY "Admins can manage blood donors" ON public.blood_donors FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('complaints', 'complaints', true);

-- Storage policies
CREATE POLICY "Gallery images are public" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Admins can upload gallery images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete gallery images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Site assets are public" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "Admins can upload site assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can upload complaint images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'complaints');
CREATE POLICY "Complaint images are public" ON storage.objects FOR SELECT USING (bucket_id = 'complaints');

-- Seed site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', 'YUMP'),
  ('site_full_name', 'Yuva Utkrasta Mandal Persav'),
  ('upi_id', 'yump@upi'),
  ('qr_code_url', ''),
  ('logo_url', '');

-- Seed some initial events
INSERT INTO public.events (title, date, description, icon_name, is_upcoming) VALUES
  ('Blood Donation Camp', 'January 26, 2026', 'Join us in saving lives. Donate blood and be a hero for someone in need.', 'Droplets', true),
  ('Christmas Celebration', 'December 25, 2025', 'Community Christmas celebration with carols, gifts, and festive food for all villagers.', 'PartyPopper', false),
  ('Parents Day', 'July 23, 2025', 'Honoring and celebrating all the wonderful parents of Persav village.', 'Users', false),
  ('Children''s Day Celebration', 'November 14, 2025', 'Fun activities, games, and prizes for the children of our village.', 'Baby', false);

-- Seed blood donors
INSERT INTO public.blood_donors (name, blood_group) VALUES
  ('Ramesh Patil', 'O+'),
  ('Sunita Jadhav', 'A+'),
  ('Vikram Singh', 'B+'),
  ('Priya Sharma', 'AB+'),
  ('Arun Deshmukh', 'O-'),
  ('Kavita More', 'A-'),
  ('Suresh Kumar', 'B+'),
  ('Neha Gupta', 'O+');

-- Seed donors
INSERT INTO public.donors (name, amount) VALUES
  ('Rajesh Patil', '₹5,000'),
  ('Suman Devi', '₹2,000'),
  ('Anil Kumar', '₹3,500'),
  ('Meena Bai', '₹1,000'),
  ('Anonymous', '₹10,000');

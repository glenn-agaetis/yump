
-- Fix 1: Remove public SELECT on blood_donors and replace with restricted view
DROP POLICY IF EXISTS "Anyone can view blood donors" ON public.blood_donors;

CREATE POLICY "Public can view blood donors limited"
ON public.blood_donors
FOR SELECT
TO public
USING (true);

-- We can't restrict columns via RLS, so we'll remove phone from public view
-- by dropping the open policy and creating a security definer function instead
-- Actually, RLS can't filter columns. The safest fix: remove the public SELECT 
-- and let only admins see the full table. For the frontend blood donors page,
-- we create a view or function.

-- Let's drop the permissive public policy and create a secure function
DROP POLICY IF EXISTS "Public can view blood donors limited" ON public.blood_donors;

CREATE OR REPLACE FUNCTION public.get_public_blood_donors()
RETURNS TABLE(id uuid, name text, blood_group text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, blood_group FROM public.blood_donors ORDER BY created_at DESC;
$$;

-- Fix 2: Add restrictive policies on user_roles to prevent privilege escalation
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix 3: Drop open complaints storage INSERT policy and restrict to authenticated
DROP POLICY IF EXISTS "Anyone can upload complaint images" ON storage.objects;

CREATE POLICY "Authenticated users can upload complaint images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'complaints');


-- The INSERT WITH CHECK (true) on complaints is intentional for public complaint submission.
-- Adding explicit comment to document this is by design.
COMMENT ON POLICY "Anyone can submit complaints" ON public.complaints IS 'Public complaint submission - intentionally permissive for unauthenticated users';

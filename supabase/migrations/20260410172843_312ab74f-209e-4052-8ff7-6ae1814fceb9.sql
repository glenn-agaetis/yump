CREATE POLICY "Anyone can submit donation details"
ON public.donors
FOR INSERT
TO public
WITH CHECK (true);
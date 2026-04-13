
DROP POLICY IF EXISTS "Authenticated users can upload complaint images" ON storage.objects;

CREATE POLICY "Anyone can upload complaint images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'complaints');

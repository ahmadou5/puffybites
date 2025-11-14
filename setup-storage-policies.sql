-- Supabase Storage Policies for desserts-images bucket
-- Run these commands in your Supabase SQL Editor

-- First, ensure RLS is enabled on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public read access for dessert images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload dessert images" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can manage dessert images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload dessert images" ON storage.objects;

-- Policy 1: Allow public read access to dessert images
CREATE POLICY "Public read access for dessert images" ON storage.objects
  FOR SELECT USING (bucket_id = 'desserts-images');

-- Policy 2: Allow anyone to upload dessert images (for testing - you can restrict this later)
CREATE POLICY "Anyone can upload dessert images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'desserts-images');

-- Policy 3: Allow anyone to update/delete dessert images (for testing - you can restrict this later)
CREATE POLICY "Anyone can manage dessert images" ON storage.objects
  FOR ALL USING (bucket_id = 'desserts-images') 
  WITH CHECK (bucket_id = 'desserts-images');

-- Alternative: More restrictive policies (uncomment these and comment the above if you want authentication)
/*
-- Policy 2 (Restrictive): Only authenticated users can upload
CREATE POLICY "Authenticated users can upload dessert images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'desserts-images' 
    AND auth.role() = 'authenticated'
  );

-- Policy 3 (Restrictive): Only authenticated users can manage
CREATE POLICY "Authenticated users can manage dessert images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'desserts-images' 
    AND auth.role() = 'authenticated'
  ) 
  WITH CHECK (
    bucket_id = 'desserts-images' 
    AND auth.role() = 'authenticated'
  );
*/
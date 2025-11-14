-- Setup Admin Access for Desserts Management
-- Run these commands in your Supabase SQL Editor

-- STEP 1: Quick Fix - Allow any authenticated user to manage desserts (for immediate testing)
DROP POLICY IF EXISTS "desserts_admin_all" ON desserts;

CREATE POLICY "desserts_authenticated_all" ON desserts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- STEP 2: Find your user ID (run this to get your current user info)
-- You'll need this for the next steps
SELECT 
  id as user_id,
  email,
  raw_user_meta_data,
  user_metadata
FROM auth.users 
WHERE email = 'YOUR_EMAIL_HERE'; -- Replace with your actual email

-- STEP 3: Set yourself as admin (replace 'YOUR_EMAIL_HERE' and 'YOUR_USER_ID' with actual values)
-- Method A: Update user metadata to include admin role
/*
UPDATE auth.users 
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'YOUR_EMAIL_HERE';
*/

-- Method B: Create a dedicated admin_users table (more secure)
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read admin status
CREATE POLICY "Users can check admin status" ON admin_users
  FOR SELECT TO authenticated USING (true);

-- Only allow superuser/admin to manage admin_users (for security)
CREATE POLICY "Only superuser can manage admins" ON admin_users
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role') 
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Add yourself as admin (replace with your actual user ID and email)
-- INSERT INTO admin_users (user_id, email) VALUES ('YOUR_USER_ID', 'YOUR_EMAIL_HERE');

-- STEP 4: Once you have admin access set up, replace the simple policy with secure ones

-- Option A: Use JWT role-based policy (if using Method A above)
/*
DROP POLICY IF EXISTS "desserts_authenticated_all" ON desserts;

CREATE POLICY "desserts_admin_jwt_all" ON desserts
  FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'role') = 'admin') 
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');
*/

-- Option B: Use admin_users table-based policy (if using Method B above)
/*
DROP POLICY IF EXISTS "desserts_authenticated_all" ON desserts;

CREATE POLICY "desserts_admin_table_all" ON desserts
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
*/

-- STEP 5: Verify your setup
-- Check if you're authenticated and have admin access
SELECT 
  auth.uid() as current_user_id,
  auth.jwt() ->> 'role' as jwt_role,
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()) as is_admin_by_table;
-- Fix desserts table RLS policies
-- Run these commands in your Supabase SQL Editor

-- Option 1: SIMPLE FIX (for testing) - Allow any authenticated user to manage desserts
-- Drop the existing restrictive admin policy
DROP POLICY IF EXISTS "desserts_admin_all" ON desserts;

-- Create a new policy that allows any authenticated user to insert/update/delete desserts
CREATE POLICY "desserts_authenticated_all" ON desserts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Option 2: SECURE FIX (for production) - Set up proper admin role
-- First, you need to add the admin role to your user's JWT token
-- You can do this by updating the user's raw_user_meta_data or app_metadata

-- Example: Update a specific user to be admin (replace 'your-user-email@example.com' with actual email)
/*
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-user-email@example.com';
*/

-- Alternative: Create a separate admin_users table and policy
/*
-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert your user as admin (replace with your actual user ID)
-- INSERT INTO admin_users (user_id) VALUES ('your-user-uuid-here');

-- Drop the JWT role policy
DROP POLICY IF EXISTS "desserts_admin_all" ON desserts;

-- Create new admin policy using the admin_users table
CREATE POLICY "desserts_admin_table_all" ON desserts
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
*/

-- Option 3: QUICK TEST - Temporarily allow public access (NOT RECOMMENDED for production)
/*
DROP POLICY IF EXISTS "desserts_admin_all" ON desserts;
CREATE POLICY "desserts_public_all" ON desserts FOR ALL USING (true) WITH CHECK (true);
*/
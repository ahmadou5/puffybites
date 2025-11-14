# Supabase Storage Setup for Image Uploads

This guide will help you set up Supabase Storage to handle image uploads for your dessert products.

## Prerequisites

- A Supabase project set up and running
- Admin access to your Supabase dashboard

## Step 1: Create Storage Bucket

1. Log in to your Supabase dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"Create a new bucket"**
4. Use the following settings:
   - **Bucket name**: `desserts-images`
   - **Public bucket**: ✅ **Yes** (enable public access)
   - **File size limit**: `5242880` (5MB in bytes)
   - **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp,image/gif`

## Step 2: Set Up Storage Policies

Navigate to **Storage > Policies** and create the following policies:

### Policy 1: Public Read Access
```sql
-- Allow public read access to dessert images
CREATE POLICY "Public read access for dessert images" ON storage.objects
  FOR SELECT USING (bucket_id = 'desserts-images');
```

### Policy 2: Upload Access (Choose ONE option)

**Option A: Simple - Anyone can upload (for testing):**
```sql
-- Allow anyone to upload dessert images
CREATE POLICY "Anyone can upload dessert images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'desserts-images');
```

**Option B: Secure - Only authenticated users:**
```sql
-- Allow authenticated users to upload dessert images
CREATE POLICY "Authenticated users can upload dessert images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'desserts-images' 
    AND auth.role() = 'authenticated'
  );
```

### Policy 3: Management Access

**Option A: Simple - Anyone can manage (for testing):**
```sql
-- Allow anyone to update/delete dessert images
CREATE POLICY "Anyone can manage dessert images" ON storage.objects
  FOR ALL USING (bucket_id = 'desserts-images') 
  WITH CHECK (bucket_id = 'desserts-images');
```

**Option B: Secure - Only authenticated users:**
```sql
-- Allow authenticated users to manage dessert images
CREATE POLICY "Authenticated users can manage dessert images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'desserts-images' 
    AND auth.role() = 'authenticated'
  ) 
  WITH CHECK (
    bucket_id = 'desserts-images' 
    AND auth.role() = 'authenticated'
  );
```

## Step 3: Configure CORS (if needed)

If you're running into CORS issues, add your domain to the CORS configuration:

1. Go to **Settings > API**
2. Scroll down to **CORS configuration**
3. Add your domain (e.g., `https://yourapp.vercel.app`)

## Step 4: Test the Setup

You can test the storage setup by:

1. Going to your admin page
2. Trying to add a new dessert with an image
3. Checking if the image uploads successfully and displays in the preview

## Folder Structure

The images will be automatically organized in the following structure:
```
desserts-images/
├── desserts/
│   ├── 1703875200000-abc123.jpg
│   ├── 1703875300000-def456.png
│   └── ...
```

## File Naming Convention

Files are automatically renamed using the pattern:
- `{timestamp}-{random-string}.{extension}`
- Example: `1703875200000-abc123.jpg`

This prevents filename conflicts and provides unique identifiers.

## Security Notes

1. **File Validation**: The app validates file types and sizes before upload
2. **Storage Policies**: Only authenticated users can upload images
3. **Admin Rights**: Only admin users can delete images
4. **Public Access**: Images are publicly readable for display purposes

## Troubleshooting

### Common Issues:

1. **Upload fails with "Policy violation"**
   - Check that storage policies are correctly set up
   - Ensure the user has the correct authentication role

2. **Images don't display**
   - Verify the bucket is set to public
   - Check that the public read policy is active

3. **CORS errors**
   - Add your domain to the CORS configuration
   - Ensure the Supabase URL and keys are correctly set

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Review the Supabase dashboard logs
3. Verify your environment variables are correct

## Environment Variables

Make sure these are set in your `.env` file:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Next Steps

After setting up storage, you can:
1. Test image uploads in the admin panel
2. Monitor storage usage in the Supabase dashboard
3. Set up additional policies if needed for your use case
4. Consider implementing image optimization for better performance
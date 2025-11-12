# 🚀 Supabase Auth Setup Checklist

## Quick Setup (15 minutes)

### ✅ Step 1: Access Supabase Dashboard
- [ ] Go to [https://app.supabase.com](https://app.supabase.com)
- [ ] Sign in to your account
- [ ] Select your Puffy Delights project

### ✅ Step 2: Get Your Credentials
- [ ] Click on **Settings** (gear icon) in sidebar
- [ ] Click on **API** 
- [ ] Copy your **Project URL** (looks like: `https://abc123.supabase.co`)
- [ ] Copy your **anon public** key (long string starting with `eyJ...`)

### ✅ Step 3: Update Environment Variables
- [ ] Create `.env` file in your project root (if it doesn't exist)
- [ ] Add these lines (replace with your actual values):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJI...
```

### ✅ Step 4: Create Admin User
- [ ] In Supabase dashboard, click **Authentication** in sidebar
- [ ] Click **Users**
- [ ] Click **"Create a new user"** button
- [ ] Fill in:
  - **Email**: `admin@puffydelights.com`
  - **Password**: `admin123`
  - **✅ Check "Auto Confirm User"**
- [ ] Click **"Create user"**
- [ ] Verify user appears in the list with "Confirmed" status

### ✅ Step 5: Configure Auth Settings
- [ ] Go to **Authentication** → **Settings**
- [ ] Under **Site URL**, enter: `http://localhost:3001`
- [ ] Under **Redirect URLs**, add these (one per line):
```
http://localhost:3001
http://localhost:3001/admin
http://localhost:3001/auth/callback
```
- [ ] Click **Save**

### ✅ Step 6: Test Your Setup
- [ ] Restart your development server: `npm run dev`
- [ ] Open browser to: `http://localhost:3001/admin`
- [ ] **Expected**: You should see a login form (not the admin dashboard)
- [ ] Try logging in with:
  - **Email**: `admin@puffydelights.com`
  - **Password**: `admin123`
- [ ] **Expected**: You should be redirected to the admin dashboard
- [ ] **Expected**: You should see your email and a logout button in the header

### ✅ Step 7: Verify Everything Works
- [ ] Test logout button (should return to login form)
- [ ] Visit public pages (should work without login):
  - `http://localhost:3001/` ✅
  - `http://localhost:3001/order` ✅
  - `http://localhost:3001/checkout` ✅
- [ ] Try accessing `/admin` after logout (should require login again)

## 🔧 Troubleshooting

### Problem: "Invalid login credentials" error
**Solution**: 
- Check that you created the user in Supabase dashboard
- Verify the user status is "Confirmed"
- Try the exact credentials: `admin@puffydelights.com` / `admin123`

### Problem: Application not connecting to Supabase
**Solution**:
- Verify your `.env` file has correct credentials
- Restart development server after updating `.env`
- Check browser console for errors

### Problem: CORS errors
**Solution**:
- Add your localhost URL to Supabase Auth settings
- Ensure Site URL is set to `http://localhost:3001`

### Problem: User creation fails
**Solution**:
- Try a different email if "user already exists"
- Ensure password meets minimum requirements (6+ characters)
- Check that email confirmations are disabled for development

## 🎯 Verification Script

Run this command to automatically verify your setup:
```bash
node verify-supabase-setup.js
```

This will check:
- ✅ Environment variables are set
- ✅ Supabase connection works
- ✅ Database tables are accessible
- ✅ Authentication is configured
- ✅ Demo user can log in

## 📱 Expected User Experience

### For Regular Customers:
- ✅ Can visit homepage, order page, checkout
- ✅ No authentication required for shopping
- ✅ Smooth checkout process

### For Admins:
- ✅ Must log in to access `/admin`
- ✅ Professional login form
- ✅ Secure admin dashboard
- ✅ Can manage desserts and orders
- ✅ Easy logout functionality

## ✅ Setup Complete Checklist

Mark these when everything is working:

- [ ] Environment variables configured
- [ ] Supabase connection established
- [ ] Admin user created and confirmed
- [ ] Auth settings configured
- [ ] Login form appears at `/admin`
- [ ] Can log in with demo credentials
- [ ] Admin dashboard loads after login
- [ ] Logout button works
- [ ] Public pages remain accessible
- [ ] Protected route requires authentication

## 🎉 Success!

When all checkboxes are marked, your authentication system is fully configured and ready for production use!

**Next steps:**
- Create additional admin users as needed
- Consider adding role-based permissions
- Set up email templates for production
- Configure HTTPS for production deployment
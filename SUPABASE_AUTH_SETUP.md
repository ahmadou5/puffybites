# Supabase Authentication Setup Guide for Puffy Delights

## Overview

This guide will walk you through setting up authentication in your Supabase dashboard to enable admin access for your Puffy Delights application.

---

## 🚀 Step 1: Access Your Supabase Dashboard

1. **Navigate to Supabase Dashboard**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Sign in to your Supabase account
   - Select your "Puffy Delights" project

2. **Locate Authentication Section**
   - In the left sidebar, click on **"Authentication"**
   - You'll see several sub-sections: Users, Settings, Policies, etc.

---

## 🔧 Step 2: Configure Authentication Settings

### 2.1 General Authentication Settings

1. **Go to Authentication → Settings**
2. **Site URL Configuration**:
   ```
   Site URL: http://localhost:3001
   ```
   (For production, use your actual domain like https://puffydelights.com)

3. **Redirect URLs** (add these):
   ```
   http://localhost:3001
   http://localhost:3001/admin
   http://localhost:3001/auth/callback
   ```

4. **Email Templates** (optional but recommended):
   - Customize the confirmation and reset password email templates
   - Update sender name to "Puffy Delights"

### 2.2 Authentication Providers

1. **Email Authentication** (should be enabled by default):
   - ✅ Enable email authentication
   - ✅ Enable email confirmations (recommended for production)
   - For development, you can disable email confirmations temporarily

2. **Password Requirements**:
   - Minimum length: 8 characters (recommended)
   - Can be configured under Authentication → Settings

---

## 👥 Step 3: Create Admin User

### 3.1 Create Your First Admin User

1. **Navigate to Authentication → Users**
2. **Click "Create a new user"**
3. **Fill in the details**:
   ```
   Email: admin@puffydelights.com
   Password: admin123
   ✅ Auto Confirm User (for immediate access)
   ```
4. **Click "Create user"**

### 3.2 Verify User Creation

- The user should appear in your Users list
- Status should be "Confirmed"
- You can click on the user to see more details

---

## 🛠 Step 4: Environment Variables Setup

### 4.1 Get Your Supabase Credentials

1. **Go to Project Settings → API**
2. **Copy the following values**:
   ```
   Project URL: https://your-project-id.supabase.co
   API Key (anon/public): eyJ0eXAiOiJKV1QiLCJhbGciOiJI...
   ```

### 4.2 Update Your Environment File

Create or update your `.env` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJI...

# Make sure to replace with your actual values!
```

### 4.3 Restart Your Development Server

After updating environment variables:
```bash
npm run dev
```

---

## 🔒 Step 5: Security Configuration (Recommended)

### 5.1 Row Level Security (RLS)

1. **Go to Table Editor**
2. **For each table** (desserts, orders, etc.):
   - Click on the table
   - Go to "RLS" tab
   - Enable Row Level Security
   
3. **Create Policies** for authenticated users:
   ```sql
   -- Policy for desserts table (admin can do everything)
   CREATE POLICY "Admin can manage desserts" ON desserts
   FOR ALL USING (auth.role() = 'authenticated');
   
   -- Policy for orders table (admin can view/update all orders)
   CREATE POLICY "Admin can manage orders" ON orders
   FOR ALL USING (auth.role() = 'authenticated');
   ```

### 5.2 Database Functions (Optional)

You can create a function to check admin status:

```sql
-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- For now, any authenticated user is considered admin
  -- You can enhance this later with role-based access
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## ✅ Step 6: Test Your Setup

### 6.1 Test Authentication Flow

1. **Clear browser cache/cookies**
2. **Navigate to** `http://localhost:3001/admin`
3. **You should see the login form**
4. **Try logging in with**:
   ```
   Email: admin@puffydelights.com
   Password: admin123
   ```
5. **You should be redirected to the admin dashboard**

### 6.2 Test Different Scenarios

| Scenario | Expected Result |
|----------|----------------|
| Visit `/admin` without login | Shows login form |
| Login with correct credentials | Redirects to admin dashboard |
| Login with wrong credentials | Shows error message |
| Access `/`, `/order`, `/checkout` | Works without authentication |
| Click logout in admin panel | Returns to login form |

---

## 🚨 Troubleshooting Common Issues

### Issue 1: "Invalid login credentials" error

**Possible causes:**
- Wrong email/password
- User not created in Supabase
- User not confirmed

**Solutions:**
1. Verify user exists in Authentication → Users
2. Check if user is confirmed
3. Try resetting password

### Issue 2: Environment variables not working

**Possible causes:**
- Incorrect .env file format
- Server not restarted after changes

**Solutions:**
1. Check .env file format (no spaces around =)
2. Restart development server
3. Verify variables in browser dev tools

### Issue 3: CORS errors

**Possible causes:**
- Incorrect site URL in Supabase
- Missing redirect URLs

**Solutions:**
1. Add your local URL to Supabase settings
2. Add redirect URLs for auth flow

### Issue 4: "User already exists" when creating admin

**Solutions:**
1. Use a different email address
2. Delete existing user and recreate
3. Use the existing user if it's yours

---

## 🔧 Advanced Configuration (Optional)

### Email Templates Customization

1. **Go to Authentication → Settings → Email Templates**
2. **Customize each template**:
   - **Confirm signup**: Welcome message
   - **Magic Link**: Login link email  
   - **Change email address**: Email change confirmation
   - **Reset password**: Password reset instructions

### Example Email Template (Confirm signup):
```html
<h2>Welcome to Puffy Delights!</h2>
<p>Thanks for signing up. Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your account</a></p>
<p>If you didn't sign up for this account, you can safely ignore this email.</p>
```

### Social Authentication (Optional)

If you want to add Google/GitHub login later:

1. **Go to Authentication → Settings → Auth Providers**
2. **Enable desired providers**
3. **Configure OAuth apps** in respective platforms
4. **Add client IDs and secrets**

---

## 📋 Security Best Practices

### For Development
- ✅ Use strong passwords
- ✅ Enable email confirmation for production
- ✅ Set up proper redirect URLs

### For Production
- ✅ Use HTTPS only
- ✅ Enable email confirmation
- ✅ Set up custom email templates
- ✅ Configure proper CORS policies
- ✅ Enable Row Level Security
- ✅ Regular backup of user data
- ✅ Monitor authentication logs

---

## 🎯 Next Steps After Setup

1. **Create Additional Admin Users** (if needed):
   - Add more admin emails in Supabase Users
   - Share credentials securely

2. **Role-Based Access Control** (future enhancement):
   - Add user roles (admin, manager, viewer)
   - Implement permission-based features

3. **Production Deployment**:
   - Update site URLs for production domain
   - Enable email confirmations
   - Set up custom email domain

---

## 🆘 Quick Reference Commands

### Restart Development Server
```bash
npm run dev
```

### Check Environment Variables
```bash
# In browser console
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

### Test Authentication in Browser Console
```javascript
// Check if Supabase is connected
console.log('Supabase client:', window.supabase)

// Check current auth state
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)
```

---

## ✅ Setup Completion Checklist

- [ ] Accessed Supabase dashboard
- [ ] Configured authentication settings
- [ ] Created admin user (admin@puffydelights.com)
- [ ] Updated environment variables
- [ ] Restarted development server
- [ ] Tested login flow
- [ ] Verified logout functionality
- [ ] Tested public routes still work
- [ ] Confirmed error handling works

---

**🎉 Congratulations!** Your Supabase authentication is now properly configured for the Puffy Delights application!

If you encounter any issues during setup, refer to the troubleshooting section or check the Supabase documentation at [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth).
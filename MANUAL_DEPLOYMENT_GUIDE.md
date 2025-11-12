# 🚀 Manual Supabase Email Functions Deployment Guide

## Overview

Since the Supabase CLI installation had issues, here's how to deploy the email functions manually through the Supabase Dashboard.

---

## 📋 Prerequisites

Before we start, make sure you have:
- [x] Supabase account and project
- [x] Email function files created (✅ Confirmed - both files ready)
- [x] Resend account for email sending (sign up at https://resend.com)

---

## 🔧 Step 1: Get Your Resend API Key

### 1.1 Create Resend Account
1. Go to [https://resend.com](https://resend.com)
2. Sign up for free (3,000 emails/month included)
3. Verify your email

### 1.2 Get API Key
1. In Resend dashboard, go to **"API Keys"**
2. Click **"Create API Key"**
3. Name it: `puffy-delights-production`
4. Copy the key (starts with `re_`) - save it securely!

---

## 🌐 Step 2: Deploy Functions via Supabase Dashboard

### 2.1 Access Edge Functions
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your Puffy Delights project
3. In the sidebar, click **"Edge Functions"**

### 2.2 Create First Function: send-order-confirmation

1. **Click "Create a new function"**
2. **Function name**: `send-order-confirmation`
3. **Delete the default code** in the editor
4. **Copy the entire content** from your file:

```bash
# Copy this file content:
cat supabase/functions/send-order-confirmation/index.ts
```

5. **Paste it into the Supabase editor**
6. **Click "Deploy function"**
7. **Wait for deployment to complete** (green checkmark)

### 2.3 Create Second Function: send-admin-notification

1. **Click "Create a new function"** again
2. **Function name**: `send-admin-notification`
3. **Delete the default code** in the editor
4. **Copy the entire content** from your file:

```bash
# Copy this file content:
cat supabase/functions/send-admin-notification/index.ts
```

5. **Paste it into the Supabase editor**
6. **Click "Deploy function"**
7. **Wait for deployment to complete**

---

## 🔐 Step 3: Set Environment Variables (Secrets)

### 3.1 Access Secrets
1. In your Supabase project dashboard
2. Go to **"Settings"** (gear icon in sidebar)
3. Click **"Edge Functions"**
4. Scroll down to **"Function secrets"**

### 3.2 Add Required Secrets

Add these three secrets:

| Name | Value | Example |
|------|-------|---------|
| `RESEND_API_KEY` | Your Resend API key | `re_123abc...` |
| `ADMIN_EMAIL` | Your admin email | `admin@puffydelights.com` |
| `FROM_EMAIL` | Sender email | `orders@puffydelights.com` |

**Steps for each secret:**
1. Click **"Add secret"**
2. Enter the **Name** (exactly as shown above)
3. Enter the **Value**
4. Click **"Add secret"**

---

## 🧪 Step 4: Test Your Functions

### 4.1 Get Your Project Details

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJ0eXAiOiJKV1Q...`

### 4.2 Test Order Confirmation Function

**Option A: Using curl (if you have it)**
```bash
curl -X POST 'https://YOUR-PROJECT-ID.supabase.co/functions/v1/send-order-confirmation' \
  -H 'Authorization: Bearer YOUR-ANON-KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "your-email@example.com",
    "customerName": "Test Customer",
    "orderId": "TEST123",
    "transactionRef": "TEST-REF-123",
    "orderItems": [
      {
        "name": "Chocolate Cupcakes",
        "quantity": 2,
        "price": 15.99,
        "pack_of": "6"
      }
    ],
    "subtotal": 31.98,
    "tax": 2.56,
    "shipping": 5.99,
    "total": 40.53,
    "deliveryDate": "2024-12-01",
    "customerAddress": "123 Test Street, Test City",
    "customerPhone": "+234 123 456 7890"
  }'
```

**Option B: Using Browser Console**
1. Go to your Puffy Delights app: `http://localhost:3001`
2. Open browser developer tools (F12)
3. Go to Console tab
4. Paste and run this code (replace YOUR-PROJECT-ID and YOUR-ANON-KEY):

```javascript
// Test email function
fetch('https://YOUR-PROJECT-ID.supabase.co/functions/v1/send-order-confirmation', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR-ANON-KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: 'your-email@example.com',
    customerName: 'Test Customer',
    orderId: 'TEST123',
    transactionRef: 'TEST-REF-123',
    orderItems: [
      {
        name: 'Chocolate Cupcakes',
        quantity: 2,
        price: 15.99,
        pack_of: '6'
      }
    ],
    subtotal: 31.98,
    tax: 2.56,
    shipping: 5.99,
    total: 40.53,
    deliveryDate: '2024-12-01',
    customerAddress: '123 Test Street, Test City',
    customerPhone: '+234 123 456 7890'
  })
})
.then(response => response.json())
.then(data => console.log('Email test result:', data))
.catch(error => console.error('Error:', error));
```

### 4.3 Check Function Logs

1. In Supabase dashboard, go to **Edge Functions**
2. Click on **"send-order-confirmation"**
3. Go to **"Logs"** tab
4. Look for success/error messages
5. Repeat for **"send-admin-notification"**

---

## ✅ Step 5: Verify Email Integration

### 5.1 Test Real Order Flow

1. **Start your app**: `npm run dev`
2. **Add items to cart** at `http://localhost:3001/order`
3. **Go to checkout**: `http://localhost:3001/checkout`
4. **Fill out the form** with a real email address
5. **Submit the order**
6. **Check your email** (including spam folder)

### 5.2 Expected Results

You should receive:
- ✅ **Customer email**: Beautiful order confirmation with all details
- ✅ **Admin email**: Alert about new order (to your admin email)
- ✅ **Browser console**: Success logs for email sending

---

## 🔧 Step 6: Update Environment Variables

### 6.1 Update Your .env File

Add these to your local `.env` file:

```env
# Email Configuration (for development reference)
RESEND_API_KEY=re_your_actual_key_here
ADMIN_EMAIL=admin@puffydelights.com
FROM_EMAIL=orders@puffydelights.com

# Your Supabase settings (should already be there)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 6.2 Restart Development Server

```bash
npm run dev
```

---

## 🎯 Step 7: Verify Everything Works

### 7.1 Complete Test Checklist

- [ ] Both functions deployed successfully in Supabase dashboard
- [ ] All three secrets (RESEND_API_KEY, ADMIN_EMAIL, FROM_EMAIL) are set
- [ ] Test function call returns success response
- [ ] Real order flow sends emails correctly
- [ ] Customer receives beautiful order confirmation email
- [ ] Admin receives order notification alert
- [ ] No errors in function logs
- [ ] No errors in browser console

### 7.2 Check Email Delivery

**Customer Email Should Include:**
- 🧁 Puffy Delights branding
- 📋 Order details with transaction reference
- 🛒 Itemized order table
- 💰 Payment instructions with bank details
- 🚚 Delivery information
- 📞 Support contact details

**Admin Email Should Include:**
- 🚨 New order alert
- 👤 Customer information
- 📊 Order summary
- 🔗 Links to admin panel
- ✅ Processing checklist

---

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. Function deployment fails
- **Check**: Make sure you copied the entire function code
- **Fix**: Delete and recreate the function with correct code

#### 2. "Invalid API key" error
- **Check**: Resend API key is correct and active
- **Fix**: Generate new API key in Resend dashboard

#### 3. Emails not sending
- **Check**: Function logs for specific error messages
- **Check**: Resend dashboard for delivery status
- **Check**: Spam/junk folders

#### 4. "Unauthorized" error
- **Check**: Supabase anon key is correct
- **Check**: Function URL includes your correct project ID

#### 5. CORS errors
- **Check**: Functions include CORS headers (they should)
- **Check**: Calling from correct domain

---

## 📱 Quick Reference

### Function URLs Format
```
https://YOUR-PROJECT-ID.supabase.co/functions/v1/FUNCTION-NAME
```

### Your Function URLs
- **Order confirmation**: `https://YOUR-PROJECT-ID.supabase.co/functions/v1/send-order-confirmation`
- **Admin notification**: `https://YOUR-PROJECT-ID.supabase.co/functions/v1/send-admin-notification`

### Required Headers
```
Authorization: Bearer YOUR-ANON-KEY
Content-Type: application/json
```

---

## 🎉 Success!

Once all tests pass, your email system is fully deployed and operational! 

**What happens now:**
1. Customer places order → Beautiful confirmation email sent
2. Admin gets instant notification → Quick order processing
3. Professional experience → Happy customers return
4. Automated system → Less manual work for you

Your Puffy Delights email system is now **live and delighting customers**! 📧✨

---

## 🔄 Next Steps

1. **Monitor email delivery** in Resend dashboard
2. **Customize email templates** with your branding
3. **Add more email types** (status updates, delivery notifications)
4. **Set up monitoring** alerts for failed emails

Need help? Check the function logs in your Supabase dashboard for detailed error messages.
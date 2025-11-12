# 📧 Email Service Setup Guide for Puffy Delights

## Overview

This guide will help you set up custom email functionality for your Puffy Delights application using Supabase Edge Functions and Resend email service.

---

## 🚀 Quick Setup (30 minutes)

### Step 1: Set Up Resend Email Service

#### 1.1 Create Resend Account
1. **Go to [https://resend.com](https://resend.com)**
2. **Sign up for a free account**
   - Free tier includes: 3,000 emails/month, 100 emails/day
   - Perfect for getting started

#### 1.2 Get API Key
1. **Go to API Keys section**
2. **Create a new API key**
3. **Copy the API key** (starts with `re_`)
4. **Save it securely** - you'll need it for environment variables

#### 1.3 Verify Domain (Optional for Production)
```bash
# For development, you can use the default domain
# For production, add your own domain in Resend dashboard
# Example: orders@puffydelights.com
```

---

### Step 2: Deploy Supabase Edge Functions

#### 2.1 Install Supabase CLI
```bash
npm install -g supabase
```

#### 2.2 Login to Supabase
```bash
supabase login
```

#### 2.3 Link Your Project
```bash
supabase link --project-ref your-project-id
```

#### 2.4 Deploy Functions
```bash
# Deploy order confirmation function
supabase functions deploy send-order-confirmation

# Deploy admin notification function  
supabase functions deploy send-admin-notification
```

---

### Step 3: Configure Environment Variables

#### 3.1 Set Supabase Secrets
```bash
# Set Resend API key
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Set admin email for notifications
supabase secrets set ADMIN_EMAIL=admin@puffydelights.com

# Optional: Set custom from domain
supabase secrets set FROM_EMAIL=orders@puffydelights.com
```

#### 3.2 Update Local Environment
Add to your `.env` file:
```env
# Email Configuration
RESEND_API_KEY=re_your_api_key_here
ADMIN_EMAIL=admin@puffydelights.com
FROM_EMAIL=orders@puffydelights.com
```

---

## 📧 Email Templates Overview

### Customer Order Confirmation Email
- **Trigger**: When order is placed
- **To**: Customer email address
- **Subject**: "Order Confirmation #12345 - Your Puffy Delights are on the way! 🧁"
- **Content**: 
  - Beautiful HTML email with order details
  - Payment instructions with bank details
  - Order summary with itemized list
  - Delivery information
  - Contact details

### Admin Notification Email
- **Trigger**: When order is placed
- **To**: Admin email address
- **Subject**: "🚨 New Order #12345 - ₦2,500.00 from John Doe"
- **Content**:
  - Order alert with customer details
  - Quick order summary
  - Action buttons for admin panel
  - Next steps checklist

---

## 🔧 Testing Your Setup

### Test 1: Check Function Deployment
```bash
# Test if functions are deployed
curl -X POST 'https://your-project-id.supabase.co/functions/v1/send-order-confirmation' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"to":"test@example.com","customerName":"Test User","orderId":"TEST123"}'
```

### Test 2: Place a Test Order
1. **Add items to cart**
2. **Go through checkout process**
3. **Check browser console** for email logs
4. **Verify emails are sent** (check spam folder)

### Test 3: Check Email Logs
```bash
# View function logs
supabase functions logs send-order-confirmation
supabase functions logs send-admin-notification
```

---

## 🎨 Email Customization

### Customize Email Templates

#### Update Order Confirmation Template
Edit `supabase/functions/send-order-confirmation/index.ts`:
```typescript
// Customize colors
const primaryColor = '#667eea';
const accentColor = '#764ba2';

// Customize business info
const businessName = 'Your Business Name';
const businessPhone = '+234 123 456 7890';
const businessEmail = 'support@yourdomain.com';
```

#### Update Admin Notification Template
Edit `supabase/functions/send-admin-notification/index.ts`:
```typescript
// Customize admin email settings
const adminAlertColor = '#dc2626';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
```

### Add Your Branding
- **Logo**: Add your logo URL to email templates
- **Colors**: Match your brand colors
- **Footer**: Update business information
- **Social Links**: Add your social media links

---

## 📱 Email Features

### Customer Emails Include:
- ✅ **Order confirmation** with full details
- ✅ **Beautiful HTML design** with responsive layout
- ✅ **Payment instructions** with bank details
- ✅ **Order summary** with itemized breakdown
- ✅ **Delivery information** and timeline
- ✅ **Contact details** for support
- ✅ **What's next** timeline

### Admin Emails Include:
- ✅ **Instant order alerts** for new orders
- ✅ **Customer information** and contact details
- ✅ **Order summary** and total value
- ✅ **Direct links** to admin panel
- ✅ **Action checklist** for processing
- ✅ **Quick stats** and timing information

---

## 🛡️ Production Considerations

### Security
```bash
# Ensure environment variables are secure
supabase secrets list

# Verify function permissions
# Functions should only be callable by authenticated sources
```

### Performance
- **Async email sending**: Emails don't block order completion
- **Error handling**: Orders succeed even if emails fail
- **Retry logic**: Consider adding retry for failed emails

### Monitoring
```bash
# Monitor email delivery
supabase functions logs send-order-confirmation --follow

# Check for errors
supabase functions logs send-admin-notification --level error
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Function not found error
```bash
# Re-deploy functions
supabase functions deploy send-order-confirmation
supabase functions deploy send-admin-notification
```

#### 2. Resend API key error
```bash
# Check if secret is set correctly
supabase secrets list

# Update if needed
supabase secrets set RESEND_API_KEY=re_your_new_key
```

#### 3. Emails not sending
```bash
# Check function logs for errors
supabase functions logs send-order-confirmation

# Verify Resend account status and limits
# Check spam/junk folders
```

#### 4. CORS errors
- Functions include CORS headers for cross-origin requests
- Verify your domain is allowed in Supabase settings

### Development Mode
When `RESEND_API_KEY` is not set, emails will be logged to console instead of sent. This is perfect for development.

---

## 📊 Email Analytics

### Track Email Performance
1. **Resend Dashboard**: View delivery stats
2. **Open rates**: Track email engagement
3. **Bounce rates**: Monitor email quality
4. **Click rates**: See customer interaction

### Key Metrics to Monitor
- **Delivery rate**: % of emails successfully delivered
- **Open rate**: % of emails opened by customers
- **Response time**: How quickly customers respond
- **Support reduction**: Fewer support requests due to clear emails

---

## 🚀 Advanced Features (Future Enhancements)

### Email Templates You Can Add:
1. **Order Status Updates**: When order status changes
2. **Delivery Notifications**: When order is out for delivery
3. **Welcome Series**: For new customers
4. **Promotional Emails**: Special offers and discounts
5. **Review Requests**: Post-delivery feedback emails
6. **Birthday Offers**: Personalized birthday treats

### Integration Options:
- **SMS notifications**: Add Twilio for SMS alerts
- **WhatsApp Business**: Send order updates via WhatsApp
- **Push notifications**: Browser push notifications
- **Calendar integration**: Add delivery dates to customer calendars

---

## ✅ Setup Completion Checklist

- [ ] Created Resend account and got API key
- [ ] Deployed Supabase Edge Functions
- [ ] Set environment variables/secrets
- [ ] Tested email sending functionality
- [ ] Customized email templates with branding
- [ ] Verified both customer and admin emails work
- [ ] Checked email logs for any errors
- [ ] Tested complete order flow with email sending
- [ ] Set up monitoring for email delivery
- [ ] Documented email processes for team

---

## 📞 Support

### If you need help:
1. **Check Supabase logs**: `supabase functions logs`
2. **Review Resend dashboard**: Check delivery status
3. **Test with simple payload**: Use basic test data first
4. **Check environment variables**: Verify all secrets are set

### Resources:
- **Supabase Functions Docs**: [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)
- **Resend API Docs**: [https://resend.com/docs](https://resend.com/docs)
- **Email Template Examples**: Check the function files for full templates

---

🎉 **Congratulations!** Your email system is now set up and ready to delight your customers with beautiful order confirmations and keep your admin team informed with instant notifications!
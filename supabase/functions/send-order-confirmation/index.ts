import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderEmailRequest {
  to: string;
  customerName: string;
  orderId: string;
  transactionRef: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    pack_of: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  deliveryDate: string;
  customerAddress: string;
  customerPhone: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      to, 
      customerName, 
      orderId, 
      transactionRef, 
      orderItems, 
      subtotal, 
      tax, 
      shipping, 
      total, 
      deliveryDate, 
      customerAddress, 
      customerPhone 
    }: OrderEmailRequest = await req.json()

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Format order items for email
    const itemsList = orderItems.map(item => 
      `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong><br>
          <small style="color: #6b7280;">Pack of ${item.pack_of}</small>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ₦${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
      `
    ).join('')

    // Format delivery date
    const deliveryDateFormatted = new Date(deliveryDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Create beautiful HTML email template
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Puffy Delights</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🧁 Puffy Delights</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Sweet treats delivered to your doorstep</p>
      </div>

      <!-- Main Content -->
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb;">
        
        <!-- Greeting -->
        <h2 style="color: #667eea; margin-top: 0;">Order Confirmation</h2>
        <p style="font-size: 16px; margin-bottom: 25px;">
          Dear <strong>${customerName}</strong>,<br><br>
          Thank you for your order! We're excited to prepare your delicious treats. 
          Your order has been successfully placed and will be delivered fresh to your doorstep.
        </p>

        <!-- Order Details -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #374151; margin-top: 0; margin-bottom: 15px;">📋 Order Details</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <strong>Order ID:</strong> #${orderId}
            </div>
            <div>
              <strong>Transaction Ref:</strong> ${transactionRef}
            </div>
            <div>
              <strong>Delivery Date:</strong> ${deliveryDateFormatted}
            </div>
            <div>
              <strong>Phone:</strong> ${customerPhone}
            </div>
          </div>
          <div>
            <strong>Delivery Address:</strong><br>
            ${customerAddress}
          </div>
        </div>

        <!-- Order Items -->
        <h3 style="color: #374151; margin-bottom: 15px;">🛒 Your Order</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid #e5e7eb;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>

        <!-- Order Summary -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #374151; margin-top: 0; margin-bottom: 15px;">💰 Order Summary</h3>
          <div style="border-bottom: 1px solid #d1d5db; padding-bottom: 15px; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Subtotal:</span>
              <span>₦${subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Tax (8%):</span>
              <span>₦${tax.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Shipping:</span>
              <span>${shipping === 0 ? 'FREE' : `₦${shipping.toFixed(2)}`}</span>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #667eea;">
            <span>Total:</span>
            <span>₦${total.toFixed(2)}</span>
          </div>
        </div>

        <!-- Payment Instructions -->
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
          <h3 style="color: #92400e; margin-top: 0; margin-bottom: 15px;">💳 Payment Instructions</h3>
          <p style="margin-bottom: 10px; color: #92400e;">
            To complete your order, please transfer the exact amount to:
          </p>
          <div style="background: white; padding: 15px; border-radius: 6px; font-family: monospace;">
            <strong>Amount:</strong> ₦${total.toFixed(2)}<br>
            <strong>Reference:</strong> ${transactionRef}<br>
            <strong>Bank:</strong> First Bank of Nigeria<br>
            <strong>Account:</strong> 1234567890<br>
            <strong>Account Name:</strong> Puffy Delights Ltd
          </div>
          <p style="margin-top: 10px; font-size: 14px; color: #92400e;">
            <em>Please use the reference number for faster processing.</em>
          </p>
        </div>

        <!-- What's Next -->
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 25px;">
          <h3 style="color: #065f46; margin-top: 0; margin-bottom: 15px;">🎯 What's Next?</h3>
          <ul style="color: #065f46; padding-left: 20px; margin: 0;">
            <li>We'll confirm your payment within 2-4 hours</li>
            <li>Your treats will be freshly prepared</li>
            <li>We'll deliver on ${deliveryDateFormatted}</li>
            <li>You'll receive updates via email and SMS</li>
          </ul>
        </div>

        <!-- Contact Information -->
        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
          <h3 style="color: #374151; margin-top: 0;">Need Help?</h3>
          <p style="margin-bottom: 15px; color: #6b7280;">
            Our customer support team is here to help!
          </p>
          <div style="margin-bottom: 15px;">
            <strong>📞 Phone:</strong> +234 (0) 123 456 7890<br>
            <strong>📧 Email:</strong> support@puffydelights.com<br>
            <strong>💬 WhatsApp:</strong> +234 (0) 123 456 7890
          </div>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Available Mon-Sat: 8:00 AM - 8:00 PM
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #374151; color: #d1d5db; padding: 25px; border-radius: 0 0 10px 10px; text-align: center;">
        <p style="margin: 0 0 10px 0; font-size: 16px;">
          Thank you for choosing Puffy Delights! 🧁
        </p>
        <p style="margin: 0; font-size: 14px; opacity: 0.8;">
          Follow us on social media for sweet updates and special offers!
        </p>
        <div style="margin-top: 15px;">
          <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px;">Facebook</a>
          <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px;">Instagram</a>
          <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px;">Twitter</a>
        </div>
        <hr style="border: none; height: 1px; background: #4b5563; margin: 20px 0;">
        <p style="margin: 0; font-size: 12px; opacity: 0.7;">
          © 2024 Puffy Delights. All rights reserved.<br>
          This email was sent to ${to}. If you have any questions, please contact us.
        </p>
      </div>
    </body>
    </html>
    `

    // Send email using Supabase Auth
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: 'dummy@example.com', // This is just to use the email service
      options: {
        data: {
          email_type: 'order_confirmation',
          to: to,
          subject: `Order Confirmation #${orderId} - Your Puffy Delights are on the way! 🧁`,
          html: htmlContent
        }
      }
    })

    // Alternative: Use a direct email service like Resend or SendGrid
    // For now, we'll use a webhook to handle the email sending
    
    // You can integrate with services like:
    // - Resend (recommended for modern apps)
    // - SendGrid
    // - Mailgun
    // - Amazon SES

    // For this implementation, we'll use Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (resendApiKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Puffy Delights <onboarding@resend.dev>',
          to: [to],
          subject: `Order Confirmation #${orderId} - Your Puffy Delights are on the way! 🧁`,
          html: htmlContent,
        }),
      })

      const emailResult = await emailResponse.json()

      if (!emailResponse.ok) {
        throw new Error(`Email service error: ${emailResult.message}`)
      }

      console.log('Order confirmation email sent successfully:', emailResult)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Order confirmation email sent successfully',
          emailId: emailResult.id 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      // Fallback: Log email content for development
      console.log('Order confirmation email (dev mode):')
      console.log('To:', to)
      console.log('Subject: Order Confirmation #' + orderId)
      console.log('HTML length:', htmlContent.length, 'characters')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email logged successfully (development mode)',
          dev_mode: true 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send email' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AdminNotificationRequest {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  itemCount: number;
  deliveryDate: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      orderId, 
      customerName, 
      customerEmail, 
      total, 
      itemCount, 
      deliveryDate 
    }: AdminNotificationRequest = await req.json()

    // Format delivery date
    const deliveryDateFormatted = new Date(deliveryDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Admin email template
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Alert - Puffy Delights Admin</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🚨 NEW ORDER ALERT</h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Puffy Delights Admin Dashboard</p>
      </div>

      <!-- Main Content -->
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb;">
        
        <!-- Alert Message -->
        <div style="background: #fee2e2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #dc2626; margin: 0 0 10px 0; font-size: 20px;">📋 New Order Received!</h2>
          <p style="color: #991b1b; margin: 0; font-size: 16px;">
            A new order has been placed and requires your attention.
          </p>
        </div>

        <!-- Order Summary -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #374151; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            📊 Order Summary
          </h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Order ID:</td>
              <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Customer:</td>
              <td style="padding: 8px 0;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Email:</td>
              <td style="padding: 8px 0;">${customerEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Items:</td>
              <td style="padding: 8px 0;">${itemCount} item${itemCount > 1 ? 's' : ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Total:</td>
              <td style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #059669;">₦${total.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Delivery Date:</td>
              <td style="padding: 8px 0;">${deliveryDateFormatted}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Order Time:</td>
              <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <!-- Action Buttons -->
        <div style="text-align: center; margin-bottom: 25px;">
          <a href="http://localhost:3001/admin" 
             style="display: inline-block; background: #dc2626; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 10px;">
            📋 View in Admin Panel
          </a>
          <a href="mailto:${customerEmail}" 
             style="display: inline-block; background: #059669; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 10px;">
            📧 Contact Customer
          </a>
        </div>

        <!-- Next Steps -->
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #065f46; margin-top: 0; margin-bottom: 15px;">✅ Next Steps</h3>
          <ol style="color: #065f46; padding-left: 20px; margin: 0;">
            <li>Confirm payment received</li>
            <li>Update order status to "Confirmed"</li>
            <li>Prepare the order for delivery</li>
            <li>Schedule delivery for ${deliveryDateFormatted}</li>
            <li>Send customer updates as needed</li>
          </ol>
        </div>

        <!-- Quick Stats -->
        <div style="background: #fffbeb; border: 1px solid #fed7aa; padding: 20px; border-radius: 8px;">
          <h3 style="color: #92400e; margin-top: 0; margin-bottom: 10px;">📈 Quick Stats</h3>
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            This order was received at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}.
            <br><strong>Action Required:</strong> Please review and process this order within 2 hours.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #374151; color: #d1d5db; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">
          🧁 Puffy Delights Admin Notification System
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">
          Automatic notification • ${new Date().toLocaleString()}
        </p>
      </div>
    </body>
    </html>
    `

    // Send email to admin using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@puffydelights.com'
    
    if (resendApiKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Puffy Delights System <system@puffydelights.com>',
          to: [adminEmail],
          subject: `🚨 New Order #${orderId} - ₦${total.toFixed(2)} from ${customerName}`,
          html: htmlContent,
        }),
      })

      const emailResult = await emailResponse.json()

      if (!emailResponse.ok) {
        throw new Error(`Email service error: ${emailResult.message}`)
      }

      console.log('Admin notification email sent successfully:', emailResult)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin notification email sent successfully',
          emailId: emailResult.id 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      // Development mode - log to console
      console.log('Admin notification email (dev mode):')
      console.log('To:', adminEmail)
      console.log('Subject: New Order #' + orderId)
      console.log('Order Total: ₦' + total.toFixed(2))
      console.log('Customer:', customerName, customerEmail)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin notification logged successfully (development mode)',
          dev_mode: true 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Error sending admin notification email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send admin notification' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
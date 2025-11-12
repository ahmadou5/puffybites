import { supabase } from "./supabase";

export interface OrderEmailData {
  customerEmail: string;
  customerName: string;
  orderId: string;
  transactionRef: string;
  orderItems: {
    name: string;
    quantity: number;
    price: number;
    pack_of: string;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  deliveryDate: string;
  customerAddress: string;
  customerPhone: string;
}

export interface AdminNotificationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  itemCount: number;
  deliveryDate: string;
}

class EmailService {
  private async sendEmail(functionName: string, payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload,
      });

      if (error) {
        console.error(`Email service error (${functionName}):`, error);
        throw error;
      }

      console.log(`Email sent successfully (${functionName}):`, data);
      return { success: true, data };
    } catch (error) {
      console.error(`Failed to send email (${functionName}):`, error);
      return { success: false, error };
    }
  }

  /**
   * Send order confirmation email to customer
   */
  async sendOrderConfirmation(orderData: OrderEmailData) {
    return await this.sendEmail("hyper-handler", {
      to: orderData.customerEmail,
      customerName: orderData.customerName,
      orderId: orderData.orderId,
      transactionRef: orderData.transactionRef,
      orderItems: orderData.orderItems,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shipping: orderData.shipping,
      total: orderData.total,
      deliveryDate: orderData.deliveryDate,
      customerAddress: orderData.customerAddress,
      customerPhone: orderData.customerPhone,
    });
  }

  /**
   * Send order notification to admin
   */
  async sendAdminNotification(adminData: AdminNotificationData) {
    return await this.sendEmail("smooth-service", {
      orderId: adminData.orderId,
      customerName: adminData.customerName,
      customerEmail: adminData.customerEmail,
      total: adminData.total,
      itemCount: adminData.itemCount,
      deliveryDate: adminData.deliveryDate,
    });
  }

  /**
   * Send order status update email to customer
   */
  async sendStatusUpdate(
    customerEmail: string,
    customerName: string,
    orderId: string,
    newStatus: string,
    statusMessage?: string
  ) {
    return await this.sendEmail("send-status-update", {
      to: customerEmail,
      customerName,
      orderId,
      newStatus,
      statusMessage: statusMessage || this.getStatusMessage(newStatus),
    });
  }

  /**
   * Send welcome email to new customers (optional)
   */
  async sendWelcomeEmail(customerEmail: string, customerName: string) {
    return await this.sendEmail("send-welcome-email", {
      to: customerEmail,
      customerName,
    });
  }

  /**
   * Get user-friendly status messages
   */
  private getStatusMessage(status: string): string {
    const statusMessages = {
      pending: "Your order has been received and is being processed.",
      confirmed: "Your order has been confirmed and is being prepared.",
      preparing: "Your delicious treats are being freshly prepared!",
      out_for_delivery:
        "Your order is on its way! Our delivery team will contact you soon.",
      delivered:
        "Your order has been successfully delivered. Enjoy your treats!",
      cancelled:
        "Your order has been cancelled. If you have any questions, please contact us.",
    };

    return (
      statusMessages[status as keyof typeof statusMessages] ||
      `Your order status has been updated to: ${status}`
    );
  }

  /**
   * Format currency for email display
   */
  formatCurrency(amount: number): string {
    return `₦${amount.toFixed(2)}`;
  }

  /**
   * Format date for email display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Email template helper functions
export const generateOrderSummary = (orderData: OrderEmailData): string => {
  const itemsList = orderData.orderItems
    .map(
      (item) =>
        `• ${item.name} (Pack of ${item.pack_of}) - Qty: ${
          item.quantity
        } - ${emailService.formatCurrency(item.price * item.quantity)}`
    )
    .join("\n");

  return `
Order Summary:
${itemsList}

Subtotal: ${emailService.formatCurrency(orderData.subtotal)}
Tax (8%): ${emailService.formatCurrency(orderData.tax)}
Shipping: ${emailService.formatCurrency(orderData.shipping)}
Total: ${emailService.formatCurrency(orderData.total)}

Delivery Date: ${emailService.formatDate(orderData.deliveryDate)}
Delivery Address: ${orderData.customerAddress}
  `.trim();
};

export default emailService;

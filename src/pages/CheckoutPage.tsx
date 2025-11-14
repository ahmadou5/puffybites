import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  User,
  Truck,
  CreditCard,
  Copy,
  CheckCircle,
  User2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ordersAPI } from "@/lib/supabase";
import {
  emailService,
  OrderEmailData,
  AdminNotificationData,
} from "@/lib/emailService";
import CartSummary from "@/components/Cart/CartSummary";
import CartItem from "@/components/Cart/CartItem";
import type { CustomerInfo } from "@/types";
interface BankDetail {
  bankName: string;
  accNumber: number;
  accName: string;
}
const CheckoutPage: React.FC = () => {
  const { items, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [transactionRef, setTransactionRef] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<string>("");
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [isUserInfoExpanded, setIsUserInfoExpanded] = useState<boolean>(true);
  const [isDeliveryInfoExpanded, setIsDeliveryInfoExpanded] =
    useState<boolean>(true);

  const handleInputChange = (section: string, field: string, value: string) => {
    if (section === "customer") {
      setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    } else if (section === "delivery") {
      setDeliveryDate(value);
    }
  };

  const BankDetails: BankDetail = {
    bankName: "Opay",
    accNumber: 8132806808,
    accName: "Hauwa Muhammad Samin",
  };

  const validateForm = (): boolean => {
    const isValid =
      customerInfo.firstName.trim() !== "" &&
      customerInfo.lastName.trim() !== "" &&
      customerInfo.email.trim() !== "" &&
      customerInfo.phone.trim() !== "" &&
      customerInfo.address.trim() !== "" &&
      customerInfo.city.trim() !== "" &&
      customerInfo.zipCode.trim() !== "" &&
      deliveryDate.trim() !== "";

    // Debug: Log validation status
    console.log("Form validation:", {
      firstName: customerInfo.firstName.trim() !== "",
      lastName: customerInfo.lastName.trim() !== "",
      email: customerInfo.email.trim() !== "",
      phone: customerInfo.phone.trim() !== "",
      address: customerInfo.address.trim() !== "",
      city: customerInfo.city.trim() !== "",
      zipCode: customerInfo.zipCode.trim() !== "",
      deliveryDate: deliveryDate.trim() !== "",
      isValid,
    });

    return isValid;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Calculate and store the total before clearing cart
      const subtotal = getTotal();
      const tax = subtotal * 0.08;
      const shipping = subtotal > 50 ? 0 : 5.99;
      const finalTotal = subtotal + tax + shipping;

      const orderData = {
        customer_info: customerInfo,
        total_cents: Math.round(finalTotal * 100),
        delivery_date: deliveryDate,
        status: "pending" as const,
      };

      console.log("Creating order with data:", orderData);
      const order = await ordersAPI.create(orderData);

      // Store the total before clearing cart
      setOrderTotal(finalTotal);

      // Generate transaction reference if not provided by API
      const transactionRef =
        order.transaction_ref_id ||
        `PB${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 6)
          .toUpperCase()}`;
      setTransactionRef(transactionRef);

      // Prepare email dat
      const orderEmailData: OrderEmailData = {
        customerEmail: customerInfo.email,
        customerName: customerInfo?.firstName,
        orderId: order.id?.toString() || "UNKNOWN",
        transactionRef: transactionRef,
        orderItems: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price_cents / 100,
          pack_of: item.name,
        })),
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        total: finalTotal,
        deliveryDate: deliveryDate,
        customerAddress: customerInfo.address,
        customerPhone: customerInfo.phone,
      };

      const adminNotificationData: AdminNotificationData = {
        orderId: order.id?.toString() || "UNKNOWN",
        customerName: customerInfo.firstName,
        customerEmail: customerInfo.email,
        total: finalTotal,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        deliveryDate: deliveryDate,
      };

      // Send emails (don't wait for completion to avoid blocking UI)
      Promise.all([
        emailService.sendOrderConfirmation(orderEmailData),
        emailService.sendAdminNotification(adminNotificationData),
      ])
        .then(([customerEmailResult, adminEmailResult]) => {
          console.log("Customer email result:", customerEmailResult);
          console.log("Admin email result:", adminEmailResult);

          if (customerEmailResult.success) {
            console.log("✅ Order confirmation email sent successfully");
          } else {
            console.warn(
              "⚠️ Failed to send customer email:",
              customerEmailResult.error
            );
          }

          if (adminEmailResult.success) {
            console.log("✅ Admin notification email sent successfully");
          } else {
            console.warn(
              "⚠️ Failed to send admin email:",
              adminEmailResult.error
            );
          }
        })
        .catch((error) => {
          console.error("Email sending error:", error);
          // Don't fail the order if emails fail
        });

      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success state with bank transfer details
  if (orderPlaced) {
    return (
      <div className="py-20 min-h-screen px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl rounded-xl lg:p-12 p-1  mb-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="lg:text-4xl text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Order Placed Successfully!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 lg:text-lg text-base">
                  Please complete payment using the bank transfer details below.
                </p>
              </div>

              {/* Bank Transfer Details */}
              <div className="backdrop-blur-xl rounded-lg lg:p-8 p-4  mb-8">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-6 h-6 text-primary mr-3" />
                  <h2 className="lg:text-2xl text-base font-semibold text-gray-900 dark:text-white">
                    Bank Transfer Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bank Name
                      </label>
                      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {BankDetails.bankName}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(`${BankDetails.bankName}`, "bank")
                          }
                          className="text-primary hover:text-primary-dark"
                        >
                          {copySuccess === "bank" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Account Number
                      </label>
                      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {BankDetails.accNumber}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `${BankDetails.accNumber}`,
                              "account"
                            )
                          }
                          className="text-primary hover:text-primary-dark"
                        >
                          {copySuccess === "account" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Account Name
                      </label>
                      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {BankDetails.accName}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(`${BankDetails.accName}`, "name")
                          }
                          className="text-primary hover:text-primary-dark"
                        >
                          {copySuccess === "name" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Amount
                      </label>
                      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl">
                        <span className="text-gray-900 dark:text-white font-medium text-xl">
                          ${orderTotal.toLocaleString()}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              orderTotal.toLocaleString(),
                              "amount"
                            )
                          }
                          className="text-primary hover:text-primary-dark"
                        >
                          {copySuccess === "amount" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Transaction Reference
                      </label>
                      <div className="flex items-center justify-between p-3 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30">
                        <span className="text-gray-900 dark:text-white font-bold">
                          {transactionRef}
                        </span>
                        <button
                          onClick={() => copyToClipboard(transactionRef, "ref")}
                          className="text-primary hover:text-primary-dark"
                        >
                          {copySuccess === "ref" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ⚠️ Please include this reference in your transfer
                        description
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Important Instructions:
                  </h3>
                  <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1 text-left">
                    <li>• Transfer the exact amount shown above</li>
                    <li>
                      • Include the transaction reference in your transfer
                      description
                    </li>
                    <li>
                      • Your order will be processed once payment is confirmed
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="bg-primary text-white hover:bg-primary-dark lg:px-6 lg:py-3 px-4 py-2 text-lg font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="py-20  min-h-screen px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <div className="backdrop-blur-xl rounded-2xl lg:p-12 p-4 shadow-lg border border-gray-200 dark:border-gray-600">
              <h1 className="lg:text-4xl text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8 lg:text-lg text-base leading-relaxed">
                Add some creamy puffies to your cart before proceeding to
                checkout.
              </p>
              <button
                onClick={() => navigate("/order")}
                className="bg-primary text-white hover:bg-primary-dark lg:px-8 lg:py-4 px-5 py-3 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Browse Puffies
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="py-12  min-h-screen px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          Checkout
        </h1>

        <div className="max-w-4xl mx-auto">
          {/* Order Summary at Top */}
          <div className="mb-8">
            <div className=" backdrop-blur-md  rounded-2xl lg:p-6 p-3 shadow-lg border border-gray-300 dark:border-gray-600 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Order
              </h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
            <CartSummary showCheckoutButton={false} />
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Customer Information - Expandable */}
            <div className="backdrop-blur-xl py-2 px-2 rounded-2xl border border-gray-300 dark:border-gray-600 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setIsUserInfoExpanded(!isUserInfoExpanded)}
                className="w-full lg:p-6 p-2 flex items-center justify-between transition-colors duration-200"
              >
                <div className="flex items-center">
                  <User2 className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Customer Details
                  </h2>
                  {customerInfo.firstName && customerInfo.lastName && (
                    <span className="ml-3 lg:px-3 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                      ✓ Completed
                    </span>
                  )}
                </div>
                {isUserInfoExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {isUserInfoExpanded && (
                <div className="lg:p-6 p-3 pt-3 py-3 border-gray-200 dark:border-gray-600 animate-slide-down">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name *"
                      value={customerInfo.firstName}
                      onChange={(e) =>
                        handleInputChange(
                          "customer",
                          "firstName",
                          e.target.value
                        )
                      }
                      className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name *"
                      value={customerInfo.lastName}
                      onChange={(e) =>
                        handleInputChange(
                          "customer",
                          "lastName",
                          e.target.value
                        )
                      }
                      className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={customerInfo.email}
                      onChange={(e) =>
                        handleInputChange("customer", "email", e.target.value)
                      }
                      className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        handleInputChange("customer", "phone", e.target.value)
                      }
                      className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Information - Expandable */}
            <div className="backdrop-blur-xl py-2 px-2 rounded-2xl border border-gray-300 dark:border-gray-600 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setIsDeliveryInfoExpanded(!isDeliveryInfoExpanded)
                }
                className="w-full lg:p-6 p-2 flex items-center justify-between transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Truck className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Delivery Details
                  </h2>
                  {customerInfo.address && (
                    <span className="ml-3 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                      ✓ Completed
                    </span>
                  )}
                </div>
                {isDeliveryInfoExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {isDeliveryInfoExpanded && (
                <div className="lg:p-6 p-3 pt-3 py-3  animate-slide-down">
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Street Address *"
                      value={customerInfo.address}
                      onChange={(e) =>
                        handleInputChange("customer", "address", e.target.value)
                      }
                      className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City *"
                        value={customerInfo.city}
                        onChange={(e) =>
                          handleInputChange("customer", "city", e.target.value)
                        }
                        className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        required
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code *"
                        value={customerInfo.zipCode}
                        onChange={(e) =>
                          handleInputChange(
                            "customer",
                            "zipCode",
                            e.target.value
                          )
                        }
                        className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm ml-2 mr-2 font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Delivery Date *
                      </label>
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) =>
                          handleInputChange("delivery", "date", e.target.value)
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Date & Payment */}
            <div className="backdrop-blur-xl rounded-2xl lg:p-6 p-4 shadow-lg border border-gray-300 dark:border-gray-600">
              {/* Payment Information */}
              <div className="mt-2">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-6 h-6 text-primary mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Payment Method
                  </h3>
                </div>
                <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-lg lg:p-6 p-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    🏦 Bank Transfer
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    After placing your order, you will receive bank transfer
                    details and a unique transaction reference. Please complete
                    the transfer within 24 hours to confirm your order.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !validateForm()}
              className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg transform ${
                loading || !validateForm()
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Processing...
                </div>
              ) : !validateForm() ? (
                "Please fill all required fields"
              ) : (
                `Place Order - $${(
                  getTotal() +
                  getTotal() * 0.08 +
                  (getTotal() > 50 ? 0 : 5.99)
                ).toFixed(2)}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

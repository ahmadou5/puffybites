import React from "react";
import { useCart } from "@/context/CartContext";
import type { CartSummaryProps } from "@/types";

const CartSummary: React.FC<CartSummaryProps> = ({
  showCheckoutButton = true,
  onCheckout,
}) => {
  const { getTotal, getItemCount } = useCart();

  const subtotal = getTotal();
  const tax = subtotal * 0.005; // 8% tax
  const delivery = subtotal > 50 ? 0 : 5.99; // Free delivery over $50
  const total = subtotal + tax + delivery;

  return (
    <div className="backdrop-blur-xl rounded-2xl lg:p-6 p-3 shadow-lg border border-gray-300 dark:border-gray-600">
      <h3 className="text-lg font-semibold text-puffy-dark mb-4">
        Order Summary
      </h3>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({getItemCount()} items)</span>
          <span>₦{subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>₦{tax}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Delivery</span>
          <span>{delivery === 0 ? "FREE" : `₦${delivery}`}</span>
        </div>

        {subtotal < 50 && subtotal > 0 && (
          <div className="text-sm text-puffy-secondary bg-puffy-secondary/10 p-2 rounded">
            Add ₦{50 - subtotal} more for free delivery!
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-bold text-puffy-dark">
          <span>Total</span>
          <span>₦{total}</span>
        </div>
      </div>

      {showCheckoutButton && getItemCount() > 0 && (
        <button onClick={onCheckout} className="w-full btn-primary mt-4 py-3">
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default CartSummary;

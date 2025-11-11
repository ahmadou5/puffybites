import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { CartItemProps } from "@/types";

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number): void => {
    if (newQuantity === 0) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-600 p-2.5 lg:p-4 shadow-sm flex items-center lg:space-x-4">
      {/* Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.image || "/api/placeholder/64/64"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 ml-2 mr-2 min-w-0">
        <h4 className="font-medium text-puffy-dark text-sm lg:text-md mb-2 truncate">
          {item.name}
        </h4>
        <p className="text-sm text-gray-500">₦{item.price_cents / 100} each</p>
      </div>

      {/* Quantity Controls */}
      <div className="lg:flex ">
        <div className="flex items-center lg:mb-0 lg:ml-3 lg:mr-3 mr-0 ml-0 mb-2 space-x-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <Minus size={14} />
          </button>

          <span className="w-8 text-center font-medium">{item.quantity}</span>

          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-8 h-8 rounded-full bg-gray-100  dark:bg-gray-700 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Total & Remove */}
        <div className="lg:flex items-center flex-row  space-x-3">
          <span className="font-medium text-puffy-dark min-w-0">
            ₦{(item.price_cents / 100) * item.quantity}
          </span>
          <button
            onClick={() => removeItem(item.id)}
            className="text-red-500 hover:text-red-700 p-1 mt-0.5 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

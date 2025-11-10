import React, { useState } from "react";
import { Package, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { DessertCardProps } from "@/types";

const DessertCard: React.FC<DessertCardProps> = ({
  dessert,
  showAddToCart = true,
}) => {
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300)); // Add subtle loading effect
    addItem(dessert, 1);
    setIsLoading(false);
  };

  return (
    <div className="relative backdrop-blur-md rounded-3xl border border-primary/40 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden group hover:-translate-y-2 hover:scale-[1.02]">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={dessert.image || "/api/placeholder/400/300"}
          alt={dessert.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Price Badge - Top Left */}
        <div className="absolute top-4 left-4  dark:bg-primary/20 bg-primary/40 border border-primary/40 backdrop-blur-sm px-3 py-1 rounded-3xl shadow-lg">
          <span className="text-sm lg:text-lg font-semibold text-white">
            ₦{dessert.price_cents / 100}
          </span>
        </div>

        {/* Featured Badge - Top Right */}
        {dessert.is_featured && (
          <div className="absolute top-4 right-4 dark:bg-primary/20 bg-primary/40 backdrop-blur-md text-white px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg">
            ⭐ Featured
          </div>
        )}

        {/* Stock Status Overlay */}
        {!dessert.in_stock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-white px-6 py-3 rounded-2xl">
              <span className="text-gray-800 font-semibold">Out of Stock</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Rating */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary/80 transition-colors duration-300">
            {dessert.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {dessert.description}
        </p>

        {/* Pack Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Package size={16} className="text-primary" />
            <span>Pack of {dessert.pack_of}</span>
          </div>
        </div>

        {/* Tags */}
        {dessert.tags && dessert.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {dessert.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-primary/20 to-primary/10 dark:from-primary/20 dark:to-primary/20 text-primary dark:text-primary text-xs font-medium rounded-full border border-primary/40 dark:border-primary/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Add to Cart Button - Full Width */}
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            disabled={!dessert.in_stock || isLoading}
            className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] ${
              dessert.in_stock
                ? "bg-primary/60 hover:bg-primary text-white shadow-lg hover:shadow-xl"
                : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>{dessert.in_stock ? "Add to Cart" : "Out of Stock"}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default DessertCard;

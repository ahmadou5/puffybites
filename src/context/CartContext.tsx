import React, { createContext, useContext, useReducer } from "react";
import type { CartState, CartAction, CartContextType, Dessert } from "@/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (dessert: Dessert, quantity: number = 1): void => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: dessert.id,

        name: dessert.name,
        price_cents: dessert.price_cents,
        image: dessert.image,
        quantity,
      },
    });
  };

  const removeItem = (id: number): void => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: id,
    });
  };

  const updateQuantity = (id: number, quantity: number): void => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, quantity },
    });
  };

  const clearCart = (): void => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getTotal = (): number => {
    return state.items.reduce(
      (total, item) => total + (item.price_cents / 100) * item.quantity,
      0
    );
  };

  const getItemCount = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

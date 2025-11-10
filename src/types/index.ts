// Core application types

export interface Dessert {
  id: number;
  name: string;
  description: string;
  pack_of: number;
  price_cents: number;
  image?: string;
  ingredients?: string;
  tags?: string[];
  is_featured: boolean;
  in_stock: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price_cents: number;
  image?: string;
  quantity: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  specialInstructions?: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  dessert_id?: number;
  name: string;
  quantity: number;
  price: number;
  created_at?: string;
}

export interface Order {
  id?: number;
  transaction_ref_id?: string;
  customer_info: CustomerInfo;
  total_cents: number;
  delivery_date?: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  created_at?: string;
  updated_at?: string;
  order_items?: (OrderItem & { desserts?: Dessert })[];
}

export interface Category {
  id: string;
  name: string;
}

export interface DessertFormData {
  name: string;
  description: string;
  pack_of: string;
  price_cents: string;
  image: string;
  ingredients: string;
  tags: string;
  is_featured: boolean;
  in_stock: boolean;
}

export interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalDesserts: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Cart Context types
export interface CartContextType {
  items: CartItem[];
  addItem: (dessert: Dessert, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// Cart action types
export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" };

export interface CartState {
  items: CartItem[];
}

// Component prop types
export interface DessertCardProps {
  dessert: Dessert;
  showAddToCart?: boolean;
}

export interface CartItemProps {
  item: CartItem;
}

export interface CartSummaryProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
}

export interface LayoutProps {
  children: React.ReactNode;
}

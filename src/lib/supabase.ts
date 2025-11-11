// TODO: Replace with actual Supabase when ready
import { createClient } from "@supabase/supabase-js";
import type { Dessert, Order } from "@/types";
import { simulateDelay } from "@/data/fakeData";

// Generate transaction reference ID
const generateTransactionRef = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TXN-${timestamp}-${random}`
}

export { generateTransactionRef }

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "your-supabase-url";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-supabase-anon-key";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Using fake data for development - replace with actual Supabase calls when ready
export const dessertsAPI = {
  // Get all desserts
  async getAll(): Promise<Dessert[]> {
    await simulateDelay(); // Simulate network delay

    const { data, error } = await supabase
      .from("desserts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get dessert by ID
  async getById(id: number): Promise<Dessert> {
    await simulateDelay();

    // TODO: Replace with actual Supabase call when ready
    const { data, error } = await supabase
      .from("desserts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new dessert (admin only)
  async create(
    dessert: Omit<Dessert, "id" | "created_at" | "updated_at">
  ): Promise<Dessert> {
    await simulateDelay();

    // TODO: Replace with actual Supabase call when ready
    const { data, error } = await supabase
      .from("desserts")
      .insert([dessert])
      .select();
    //
    if (error) throw error;
    return data[0];
  },

  // Update dessert (admin only)
  async update(id: number, updates: Partial<Dessert>): Promise<Dessert> {
    await simulateDelay();

    // TODO: Replace with actual Supabase call when ready
    const { data, error } = await supabase
      .from("desserts")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Delete dessert (admin only)
  async delete(id: number): Promise<void> {
    await simulateDelay();

    // TODO: Replace with actual Supabase call when ready
    const { error } = await supabase.from("desserts").delete().eq("id", id);

    if (error) throw error;
  },
};

export const ordersAPI = {
  // Create new order
  async create(
    order: Omit<Order, "id" | "created_at" | "updated_at" | "transaction_ref_id" | "order_items">
  ): Promise<Order> {
    await simulateDelay();

    // Generate transaction reference ID
    const orderWithRef = {
      ...order,
      transaction_ref_id: generateTransactionRef()
    };

    console.log("Sending order data to Supabase:", orderWithRef);

    const { data, error } = await supabase
      .from("orders")
      .insert([orderWithRef])
      .select();

    if (error) {
      console.error("Supabase order creation error:", error);
      throw error;
    }
    return data[0];
  },

  // Get all orders (admin only)
  async getAll(): Promise<Order[]> {
    await simulateDelay();

    // TODO: Replace with actual Supabase call when ready
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
       *,
       order_items (
         *,
         desserts (*)
       )
     `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update order status (admin only)
  async updateStatus(id: number, status: string): Promise<Order> {
    await simulateDelay();

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

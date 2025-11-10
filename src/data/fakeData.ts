// Fake data for development - replace with Supabase when ready
import type { Dessert, Order } from "@/types";

export const fakeDesserts: Dessert[] = [
  {
    id: 1,
    name: "Chocolate Cloud Cake",
    description:
      "Decadent chocolate sponge with fluffy cream clouds and dark chocolate ganache",
    price_cents: 1299,
    pack_of: 1,
    image: "https://assets.infusewallet.xyz/assets/solana.png",
    is_featured: true,
    in_stock: true,
    tags: ["chocolate", "cake", "premium"],
    ingredients: "Belgian chocolate, cream, eggs, flour",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Berry Bliss Tart",
    description:
      "Fresh seasonal berries on vanilla custard base with buttery pastry crust",
    price_cents: 999,
    pack_of: 1,
    image: "https://assets.infusewallet.xyz/assets/red.png",
    is_featured: true,
    in_stock: true,
    tags: ["berries", "tart", "fresh"],
    ingredients: "Mixed berries, vanilla custard, butter pastry",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Caramel Dream Éclair",
    description:
      "Light choux pastry filled with salted caramel cream and topped with caramel glaze",
    price_cents: 799,
    pack_of: 1,
    image: "/api/placeholder/300/200",
    is_featured: true,
    in_stock: true,
    tags: ["caramel", "éclair", "classic"],
    ingredients: "Choux pastry, salted caramel, cream",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Vanilla Bean Cheesecake",
    description:
      "Creamy New York style cheesecake with Madagascar vanilla beans",
    price_cents: 1199,
    pack_of: 1,
    image: "/api/placeholder/300/200",
    is_featured: false,
    in_stock: true,
    tags: ["vanilla", "cheesecake", "creamy"],
    ingredients: "Cream cheese, vanilla beans, graham crackers",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "Lemon Meringue Tart",
    description: "Tangy lemon curd topped with perfectly toasted meringue",
    price_cents: 899,
    pack_of: 1,
    image: "/api/placeholder/300/200",
    is_featured: false,
    in_stock: true,
    tags: ["lemon", "tart", "citrus"],
    ingredients: "Fresh lemons, meringue, pastry crust",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 6,
    name: "Double Chocolate Cookies",
    description:
      "Rich chocolate cookies with chocolate chips - a chocolate lover's dream",
    price_cents: 499,
    pack_of: 6,
    image: "/api/placeholder/300/200",
    is_featured: false,
    in_stock: false,
    tags: ["chocolate", "cookie", "classic"],
    ingredients: "Dark chocolate, chocolate chips, butter",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 7,
    name: "Strawberry Shortcake",
    description: "Fluffy biscuit with fresh strawberries and whipped cream",
    price_cents: 699,
    pack_of: 1,
    image: "/api/placeholder/300/200",
    is_featured: false,
    in_stock: true,
    tags: ["strawberry", "cake", "fresh"],
    ingredients: "Fresh strawberries, biscuit, whipped cream",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 8,
    name: "Tiramisu",
    description:
      "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
    price_cents: 1099,
    pack_of: 1,
    image: "/api/placeholder/300/200",
    is_featured: false,
    in_stock: true,
    tags: ["coffee", "italian", "classic"],
    ingredients: "Mascarpone, coffee, ladyfingers, cocoa",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

export const fakeOrders: Order[] = [
  {
    id: 1,
    customer_info: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      address: "123 Main St",
      city: "New York",
      zipCode: "10001",
    },
    total_cents: 3597,
    delivery_date: "2024-01-15",
    status: "confirmed",
    created_at: "2024-01-10T10:30:00Z",
    updated_at: "2024-01-10T10:30:00Z",
  },
  {
    id: 2,
    customer_info: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "(555) 987-6543",
      address: "456 Oak Ave",
      city: "Los Angeles",
      zipCode: "90210",
    },
    total_cents: 3196,
    delivery_date: "2024-01-16",
    status: "preparing",
    created_at: "2024-01-11T14:15:00Z",
    updated_at: "2024-01-11T14:15:00Z",
  },
  {
    id: 3,
    customer_info: {
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike@example.com",
      phone: "(555) 456-7890",
      address: "789 Pine St",
      city: "Chicago",
      zipCode: "60601",
    },
    total_cents: 2997,
    delivery_date: "2024-01-17",
    status: "delivered",
    created_at: "2024-01-12T09:45:00Z",
    updated_at: "2024-01-12T09:45:00Z",
  },
];

// Simulate API delay for realistic behavior
const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Generate new ID for creating items
export const idGenerator = {
  nextDessertId: Math.max(...fakeDesserts.map((d) => d.id)) + 1,
  nextOrderId: Math.max(...fakeOrders.map((o) => o.id || 0)) + 1,
  getNextDessertId() {
    return this.nextDessertId++;
  },
  getNextOrderId() {
    return this.nextOrderId++;
  },
};

export { simulateDelay };

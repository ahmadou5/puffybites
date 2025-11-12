import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  TrendingUpIcon,
  BarChart2,
  User2,
  LucideBike,
  BookCheckIcon,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { dessertsAPI, ordersAPI } from "@/lib/supabase";
import type { Dessert, Order, DessertFormData, OrderStats } from "@/types";

type AdminTab = "desserts" | "orders" | "analytics";

const AdminPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("desserts");
  const [desserts, setDesserts] = useState<Dessert[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingDessert, setEditingDessert] = useState<Dessert | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>("all");

  const [dessertForm, setDessertForm] = useState<DessertFormData>({
    name: "",
    description: "",
    pack_of: "",
    price_cents: "",
    image: "",
    ingredients: "",
    tags: "",
    is_featured: false,
    in_stock: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dessertsData, ordersData] = await Promise.all([
        dessertsAPI.getAll(),
        ordersAPI.getAll(),
      ]);
      setDesserts(dessertsData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDessertSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const dessertData = {
        ...dessertForm,
        price_cents: parseInt(dessertForm.price_cents),
        pack_of: parseInt(dessertForm.pack_of),
        tags: dessertForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editingDessert) {
        const updated = await dessertsAPI.update(
          editingDessert.id,
          dessertData
        );
        setDesserts((prev) =>
          prev.map((d) => (d.id === editingDessert.id ? updated : d))
        );
        setEditingDessert(null);
      } else {
        const newDessert = await dessertsAPI.create(dessertData);
        setDesserts((prev) => [newDessert, ...prev]);
        setShowAddForm(false);
      }

      setDessertForm({
        name: "",
        description: "",
        pack_of: "",
        price_cents: "",
        image: "",
        ingredients: "",
        tags: "",
        is_featured: false,
        in_stock: true,
      });
    } catch (error) {
      console.error("Error saving dessert:", error);
      alert("Error saving dessert. Please try again.");
    }
  };

  const handleEditDessert = (dessert: Dessert): void => {
    setEditingDessert(dessert);
    setDessertForm({
      name: dessert.name,
      description: dessert.description,
      pack_of: dessert.pack_of.toString(),
      price_cents: dessert.price_cents.toString(),
      image: dessert.image || "",
      ingredients: dessert.ingredients || "",
      tags: Array.isArray(dessert.tags) ? dessert.tags.join(", ") : "",
      is_featured: dessert.is_featured,
      in_stock: dessert.in_stock,
    });
  };

  const handleDeleteDessert = async (id: number): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this dessert?")) {
      try {
        await dessertsAPI.delete(id);
        setDesserts((prev) => prev.filter((d) => d.id !== id));
      } catch (error) {
        console.error("Error deleting dessert:", error);
        alert("Error deleting dessert. Please try again.");
      }
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: number,
    newStatus: Order["status"]
  ): Promise<void> => {
    setUpdatingOrderId(orderId);
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert(`Order status updated to: ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status. Please try again.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter orders based on selected filter
  const filteredOrders =
    orderFilter === "all"
      ? orders
      : orders.filter((order) => order.status === orderFilter);

  // Calculate order status counters
  const orderStats = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    confirmed: orders.filter((order) => order.status === "confirmed").length,
    preparing: orders.filter((order) => order.status === "preparing").length,
    out_for_delivery: orders.filter(
      (order) => order.status === "out_for_delivery"
    ).length,
    delivered: orders.filter((order) => order.status === "delivered").length,
    cancelled: orders.filter((order) => order.status === "cancelled").length,
  };

  const getOrderStats = (): OrderStats => {
    // Only count revenue from confirmed and delivered orders (paid orders)
    const paidOrders = orders.filter(
      (order) =>
        order.status === "confirmed" ||
        order.status === "preparing" ||
        order.status === "out_for_delivery" ||
        order.status === "delivered"
    );

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + (order.total_cents || 0) / 100,
      0
    );
    // Total orders should also only count paid/finished orders
    const totalOrders = paidOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalDesserts: desserts.length,
    };
  };

  const stats = getOrderStats();

  // Prepare chart data
  const getChartData = () => {
    // Revenue by status
    const revenueByStatus = [
      {
        status: "Confirmed",
        value: orders
          .filter((o) => o.status === "confirmed")
          .reduce((sum, o) => sum + o.total_cents / 100, 0),
        count: orderStats.confirmed,
      },
      {
        status: "Preparing",
        value: orders
          .filter((o) => o.status === "preparing")
          .reduce((sum, o) => sum + o.total_cents / 100, 0),
        count: orderStats.preparing,
      },
      {
        status: "Out for Delivery",
        value: orders
          .filter((o) => o.status === "out_for_delivery")
          .reduce((sum, o) => sum + o.total_cents / 100, 0),
        count: orderStats.out_for_delivery,
      },
      {
        status: "Delivered",
        value: orders
          .filter((o) => o.status === "delivered")
          .reduce((sum, o) => sum + o.total_cents / 100, 0),
        count: orderStats.delivered,
      },
    ];

    // Order status distribution for pie chart
    const statusDistribution = [
      { name: "Pending", value: orderStats.pending, color: "#EAB308" },
      { name: "Confirmed", value: orderStats.confirmed, color: "#3B82F6" },
      { name: "Preparing", value: orderStats.preparing, color: "#8B5CF6" },
      {
        name: "Out for Delivery",
        value: orderStats.out_for_delivery,
        color: "#F97316",
      },
      { name: "Delivered", value: orderStats.delivered, color: "#10B981" },
      { name: "Cancelled", value: orderStats.cancelled, color: "#EF4444" },
    ].filter((item) => item.value > 0); // Only show statuses with orders

    // Daily revenue trends (last 7 days)
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.created_at as unknown as Date)
          .toISOString()
          .split("T")[0];
        return (
          orderDate === dateString &&
          ["confirmed", "preparing", "out_for_delivery", "delivered"].includes(
            order.status
          )
        );
      });

      dailyData.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: dayOrders.reduce(
          (sum, order) => sum + order.total_cents / 100,
          0
        ),
        orders: dayOrders.length,
      });
    }

    return { revenueByStatus, statusDistribution, dailyData };
  };

  const chartData = getChartData();

  const resetForm = (): void => {
    setDessertForm({
      name: "",
      description: "",
      pack_of: "",
      price_cents: "",
      image: "",
      ingredients: "",
      tags: "",
      is_featured: false,
      in_stock: true,
    });
  };

  if (loading) {
    return (
      <div className="py-16 bg-puffy-light min-h-screen">
        <div className="container-custom flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-puffy-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="lg:text-xl text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Manage your puffies and view orders
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <User className="w-4 h-4" />
                  <span>Welcome back!</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="backdrop-blur-xl rounded-2xl lg:p-8 p-3 shadow-lg border border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="lg:text-xl text-sm text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-primary">
                  ₦{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <BarChart2 className="w-10 h-10 text-primary/60" />
            </div>
          </div>

          <div className="bbackdrop-blur-xl rounded-2xl lg:p-8 p-3 shadow-lg border border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="lg:text-xl text-sm text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-secondary">
                  {stats.totalOrders}
                </p>
              </div>
              <BookCheckIcon className="w-10 h-10 text-secondary" />
            </div>
          </div>

          <div className="backdrop-blur-xl rounded-2xl lg:p-8 p-3 shadow-lg border border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="lg:text-xl text-sm text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                  Avg Order Value
                </p>
                <p className="text-3xl font-bold text-primary">
                  ₦{stats.avgOrderValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="backdrop-blur-xl rounded-2xl lg:p-8 p-3 shadow-lg border border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="lg:text-xl text-sm text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                  Total Puffies
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalDesserts}
                </p>
              </div>
              <Package className="w-10 h-10 text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="backdrop-blur-xl rounded-2xl lg:shadow-lg lg:border border-gray-300 dark:border-gray-700">
          <div className="py-4">
            <nav className="flex space-x-8 lg:px-6 px-2">
              <button
                onClick={() => setActiveTab("desserts")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "desserts"
                    ? "border-puffy-primary text-puffy-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Manage Puffies
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "orders"
                    ? "border-puffy-primary text-puffy-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                View Orders
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "analytics"
                    ? "border-puffy-primary text-puffy-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          <div className="lg:p-6 p-2">
            {activeTab === "desserts" && (
              <div>
                {/* Add Dessert Button */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-puffy-dark">
                    Puffies Management
                  </h2>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowAddForm(true);
                    }}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus size={18} />
                    <span>Add New</span>
                  </button>
                </div>

                {/* Add/Edit Form */}
                {(showAddForm || editingDessert) && (
                  <div className="backdrop-blur-sm rounded-2xl lg:p-6 p-2 mb-6">
                    <form onSubmit={handleDessertSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Dessert Name *"
                          value={dessertForm.name}
                          onChange={(e) =>
                            setDessertForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Pack of (e.g., 6) *"
                          value={dessertForm.pack_of}
                          onChange={(e) =>
                            setDessertForm((prev) => ({
                              ...prev,
                              pack_of: e.target.value,
                            }))
                          }
                          className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                          required
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price *"
                          value={dessertForm.price_cents}
                          onChange={(e) =>
                            setDessertForm((prev) => ({
                              ...prev,
                              price_cents: e.target.value,
                            }))
                          }
                          className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                          required
                        />
                      </div>

                      <textarea
                        placeholder="Description *"
                        value={dessertForm.description}
                        onChange={(e) =>
                          setDessertForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={dessertForm.image}
                          onChange={(e) =>
                            setDessertForm((prev) => ({
                              ...prev,
                              image: e.target.value,
                            }))
                          }
                          className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        />
                        <input
                          type="text"
                          placeholder="Tags (comma separated)"
                          value={dessertForm.tags}
                          onChange={(e) =>
                            setDessertForm((prev) => ({
                              ...prev,
                              tags: e.target.value,
                            }))
                          }
                          className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Main Ingredients"
                        value={dessertForm.ingredients}
                        onChange={(e) =>
                          setDessertForm((prev) => ({
                            ...prev,
                            ingredients: e.target.value,
                          }))
                        }
                        className="w-full lg:p-4 p-2 border border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      />

                      <div className="flex items-center space-x-6">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={dessertForm.is_featured}
                            onChange={(e) =>
                              setDessertForm((prev) => ({
                                ...prev,
                                is_featured: e.target.checked,
                              }))
                            }
                            className="mr-2"
                          />
                          Featured Dessert
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={dessertForm.in_stock}
                            onChange={(e) =>
                              setDessertForm((prev) => ({
                                ...prev,
                                in_stock: e.target.checked,
                              }))
                            }
                            className="mr-2"
                          />
                          In Stock
                        </label>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="btn-primary flex items-center space-x-2"
                        >
                          <Save size={18} />
                          <span>
                            {editingDessert ? "Update" : "Add"} Dessert
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddForm(false);
                            setEditingDessert(null);
                            setDessertForm({
                              name: "",
                              description: "",
                              pack_of: "",
                              price_cents: "",
                              image: "",
                              ingredients: "",
                              tags: "",
                              is_featured: false,
                              in_stock: true,
                            });
                          }}
                          className="bg-red-600/50 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                          <X size={18} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Desserts List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {desserts.map((dessert) => (
                    <div
                      key={dessert.id}
                      className="backdrop-blur-md border border-primary/70 rounded-lg overflow-hidden"
                    >
                      <img
                        src={dessert.image || "/api/placeholder/300/200"}
                        alt={dessert.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-puffy-dark">
                              {dessert.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              Pack of {dessert.pack_of}
                            </p>
                          </div>
                          <span className="text-puffy-primary font-bold">
                            ₦{(dessert.price_cents / 100).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {dessert.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            {dessert.is_featured && (
                              <span className="px-2 py-1 bg-puffy-accent text-xs rounded">
                                Featured
                              </span>
                            )}
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                dessert.in_stock
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {dessert.in_stock ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditDessert(dessert)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteDessert(dessert.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-puffy-dark">
                    Orders Management
                  </h2>
                </div>

                {/* Order Status Counters */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                  <div className="backdrop-blur-md border border-primary/50 rounded-2xl lg:p-4 p-2 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {orderStats.total}
                    </div>
                    <div className="text-sm text-gray-500">Total Orders</div>
                  </div>
                  <div className="backdrop-blur-md border  border-primary/50  rounded-2xl lg:p-4 p-2 text-center">
                    <div className="text-2xl font-bold text-yellow-800">
                      {orderStats.pending}
                    </div>
                    <div className="text-sm text-yellow-600">Pending</div>
                  </div>
                  <div className="backdrop-blur-md border  border-primary/50  rounded-2xl lg:p-4 p-2 text-center">
                    <div className="text-2xl font-bold text-blue-800">
                      {orderStats.confirmed}
                    </div>
                    <div className="text-sm text-blue-600">Confirmed</div>
                  </div>
                  <div className="backdrop-blur-md border  border-primary/50  rounded-2xl lg:p-4 p-2 text-center">
                    <div className="text-2xl font-bold text-purple-800">
                      {orderStats.preparing}
                    </div>
                    <div className="text-sm text-purple-600">Preparing</div>
                  </div>
                  <div className="backdrop-blur-md border  border-primary/50  rounded-2xl lg:p-4 p-2 text-center">
                    <div className="text-2xl font-bold text-orange-800">
                      {orderStats.out_for_delivery}
                    </div>
                    <div className="text-sm text-orange-600">
                      Out for Delivery
                    </div>
                  </div>
                  <div className="backdrop-blur-md border  border-primary/50  rounded-2xl lg:p-4 p-2 text-center">
                    <div className="text-2xl font-bold text-green-800">
                      {orderStats.delivered}
                    </div>
                    <div className="text-sm text-green-600">Delivered</div>
                  </div>
                  <div className="backdrop-blur-md border border-primary/50 rounded-2xl lg:p-4 p-1 text-center">
                    <div className="text-2xl font-bold text-red-800">
                      {orderStats.cancelled}
                    </div>
                    <div className="text-sm text-red-600">Cancelled</div>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="backdrop-blur-md lg:border border-gray-200 dark:border-gray-700 rounded-lg lg:p-4 p-2 mb-6">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setOrderFilter("all")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        orderFilter === "all"
                          ? "bg-primary text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      All Orders ({orderStats.total})
                    </button>
                    <button
                      onClick={() => setOrderFilter("pending")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        orderFilter === "pending"
                          ? "bg-yellow-500 text-white"
                          : "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                      }`}
                    >
                      Pending ({orderStats.pending})
                    </button>
                    <button
                      onClick={() => setOrderFilter("confirmed")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        orderFilter === "confirmed"
                          ? "bg-blue-500 text-white"
                          : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                      }`}
                    >
                      Confirmed ({orderStats.confirmed})
                    </button>
                    <button
                      onClick={() => setOrderFilter("preparing")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        orderFilter === "preparing"
                          ? "bg-purple-500 text-white"
                          : "bg-purple-100 hover:bg-purple-200 text-purple-700"
                      }`}
                    >
                      Preparing ({orderStats.preparing})
                    </button>
                    <button
                      onClick={() => setOrderFilter("out_for_delivery")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        orderFilter === "out_for_delivery"
                          ? "bg-orange-500 text-white"
                          : "bg-orange-100 hover:bg-orange-200 text-orange-700"
                      }`}
                    >
                      Out for Delivery ({orderStats.out_for_delivery})
                    </button>
                    <button
                      onClick={() => setOrderFilter("delivered")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        orderFilter === "delivered"
                          ? "bg-green-500 text-white"
                          : "bg-green-100 hover:bg-green-200 text-green-700"
                      }`}
                    >
                      Delivered ({orderStats.delivered})
                    </button>
                    <button
                      onClick={() => setOrderFilter("cancelled")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        orderFilter === "cancelled"
                          ? "bg-red-500 text-white"
                          : "bg-red-100 hover:bg-red-200 text-red-700"
                      }`}
                    >
                      Cancelled ({orderStats.cancelled})
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="backdrop-blur-sm border border-primary/40 rounded-2xl lg:p-6 p-3 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold lg:text-lg text-base text-gray-900 dark:text-white">
                            Order #{order.id}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {order.customer_info?.firstName}{" "}
                            {order.customer_info?.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {order.customer_info?.email}
                          </p>
                          {order.transaction_ref_id && (
                            <p className="text-sm font-mono bg-primary/20 px-2 py-1 rounded mt-2 inline-block">
                              Ref: {order.transaction_ref_id}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-primary">
                            ₦{order.total_cents / 100}
                          </span>
                          <p className="text-sm text-gray-500">
                            {new Date(
                              order.created_at as unknown as Date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Items:
                        </p>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {order.order_items?.map((item, index) => (
                            <span key={index}>
                              {item.name} x{item.quantity}
                              {index < (order.order_items?.length || 0) - 1
                                ? ", "
                                : ""}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Status:
                          </span>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(
                                order.id!,
                                e.target.value as Order["status"]
                              )
                            }
                            disabled={updatingOrderId === order.id}
                            className={`px-3 py-1 rounded-lg text-sm py-1 px-1 font-medium border focus:outline-none focus:ring-2 focus:ring-primary ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : order.status === "confirmed"
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : order.status === "preparing"
                                ? "bg-purple-100 text-purple-800 border-purple-300"
                                : order.status === "out_for_delivery"
                                ? "bg-orange-100 text-orange-800 border-orange-300"
                                : order.status === "delivered"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : "bg-red-100 text-red-800 border-red-300"
                            } ${
                              updatingOrderId === order.id
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-opacity-80"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="out_for_delivery">
                              Out for Delivery
                            </option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {updatingOrderId === order.id && (
                            <div className="flex items-center text-sm text-gray-500">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2"></div>
                              Updating...
                            </div>
                          )}
                        </div>

                        <div className="text-sm text-gray-500">
                          Delivery:{" "}
                          {order.delivery_date
                            ? new Date(order.delivery_date).toLocaleDateString()
                            : "Not set"}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {orderFilter === "all"
                        ? "No orders found"
                        : `No ${orderFilter} orders found`}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-puffy-dark mb-2">
                    Analytics
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Visual insights into your business performance
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Daily Revenue Trends */}
                  <div className="backdrop-blur-xl border border-primary/60 rounded-2xl lg:p-6 p-2">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart2 className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Daily Revenue Trends (Last 7 Days)
                      </h3>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData.dailyData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="opacity-30"
                          />
                          <XAxis
                            dataKey="date"
                            className="text-xs"
                            tick={{ fill: "currentColor" }}
                          />
                          <YAxis
                            className="text-xs"
                            tick={{ fill: "currentColor" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--tw-color-white)",
                              border: "1px solid var(--tw-color-gray-200)",
                              borderRadius: "6px",
                              fontSize: "14px",
                            }}
                            formatter={(value: number, name: string) => [
                              name === "revenue"
                                ? `₦${value.toFixed(2)}`
                                : value,
                              name === "revenue" ? "Revenue" : "Orders",
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8B5CF6"
                            fill="#8B5CF6"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Revenue by Order Status */}
                  <div className="backdrop-blur-xl border border-primary/60 rounded-2xl lg:p-6 p-2">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Revenue by Order Status
                      </h3>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.revenueByStatus}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="opacity-30"
                          />
                          <XAxis
                            dataKey="status"
                            className="text-xs"
                            tick={{ fill: "currentColor" }}
                          />
                          <YAxis
                            className="text-xs"
                            tick={{ fill: "currentColor" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--tw-color-white)",
                              border: "1px solid var(--tw-color-gray-200)",
                              borderRadius: "6px",
                              fontSize: "14px",
                            }}
                            formatter={(value: number, name: string) => [
                              name === "value" ? `₦${value.toFixed(2)}` : value,
                              name === "value"
                                ? "Revenue"
                                : name === "count"
                                ? "Orders"
                                : name,
                            ]}
                          />
                          <Bar
                            dataKey="value"
                            fill="#a78bfa"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Status Distribution */}
                    <div className="backdrop-blur-xl border border-primary/60 rounded-2xl lg:p-6 p-2">
                      <div className="flex items-center gap-2 mb-4">
                        <PieChart className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Order Status Distribution
                        </h3>
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "var(--tw-color-white)",
                                border: "1px solid var(--tw-color-gray-200)",
                                borderRadius: "6px",
                                fontSize: "14px",
                              }}
                              formatter={(value: number) => [value, "Orders"]}
                            />
                            <Pie
                              dataKey="value"
                              data={chartData.statusDistribution}
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              label={({ name, value, percent }) =>
                                `${name}: ${value} (${(
                                  (percent || 0) * 100
                                ).toFixed(1)}%)`
                              }
                            >
                              {chartData.statusDistribution.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                )
                              )}
                            </Pie>
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Daily Orders Count */}
                    <div className="backdrop-blur-xl  border border-primary/60 rounded-2xl lg:p-6 p-2">
                      <div className="flex items-center gap-2 mb-4">
                        <Package className="w-5 h-5 text-primary" />
                        <h3 className="lg:text-lg text-base font-semibold text-gray-900 dark:text-white">
                          Daily Orders Count (Last 7 Days)
                        </h3>
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData.dailyData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="opacity-30"
                            />
                            <XAxis
                              dataKey="date"
                              className="text-xs"
                              tick={{ fill: "currentColor" }}
                            />
                            <YAxis
                              className="text-xs"
                              tick={{ fill: "currentColor" }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "var(--tw-color-white)",
                                border: "1px solid var(--tw-color-gray-200)",
                                borderRadius: "6px",
                                fontSize: "14px",
                              }}
                              formatter={(value: number) => [value, "Orders"]}
                            />
                            <Line
                              type="monotone"
                              dataKey="orders"
                              stroke="#10B981"
                              strokeWidth={3}
                              dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                              activeDot={{ r: 8, fill: "#10B981" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Summary Statistics */}
                  <div className="barkdrop-clur-xl border border-primary/60 rounded-2xl lg:p-6 p-2">
                    <h3 className="lg:text-lg text-base font-semibold text-gray-900 dark:text-white mb-4">
                      Quick Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          Most Popular Status
                        </div>
                        <div className="text-lg font-bold text-blue-800 dark:text-blue-300">
                          {chartData.statusDistribution.length > 0
                            ? chartData.statusDistribution.reduce(
                                (prev, current) =>
                                  prev.value > current.value ? prev : current
                              ).name
                            : "N/A"}
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Total Revenue (Paid)
                        </div>
                        <div className="text-lg font-bold text-green-800 dark:text-green-300">
                          ₦
                          {chartData.revenueByStatus
                            .reduce((sum, item) => sum + item.value, 0)
                            .toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                          Avg Daily Orders
                        </div>
                        <div className="text-lg font-bold text-purple-800 dark:text-purple-300">
                          {(
                            chartData.dailyData.reduce(
                              (sum, item) => sum + item.orders,
                              0
                            ) / 7
                          ).toFixed(1)}
                        </div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                        <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                          Avg Daily Revenue
                        </div>
                        <div className="text-lg font-bold text-orange-800 dark:text-orange-300">
                          ₦
                          {(
                            chartData.dailyData.reduce(
                              (sum, item) => sum + item.revenue,
                              0
                            ) / 7
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

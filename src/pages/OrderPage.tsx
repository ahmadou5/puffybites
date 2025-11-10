import React, { useState, useEffect } from "react";
import { Search, Filter, SortAsc } from "lucide-react";
import { dessertsAPI } from "@/lib/supabase";
import DessertCard from "@/components/DessertCard/DessertCard";
import type { Dessert, Category } from "@/types";

type SortOption = "name" | "price-low" | "price-high" | "featured";

const OrderPage: React.FC = () => {
  const [desserts, setDesserts] = useState<Dessert[]>([]);
  const [filteredDesserts, setFilteredDesserts] = useState<Dessert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const categories: Category[] = [
    { id: "all", name: "All Desserts" },
    { id: "cake", name: "Cakes" },
    { id: "tart", name: "Tarts" },
    { id: "éclair", name: "Éclairs" },
    { id: "cookie", name: "Cookies" },
    { id: "ice-cream", name: "Ice Cream" },
  ];

  useEffect(() => {
    const fetchDesserts = async () => {
      try {
        const data = await dessertsAPI.getAll();
        setDesserts(data);
        setFilteredDesserts(data);
      } catch (error) {
        console.error("Error fetching desserts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesserts();
  }, []);

  useEffect(() => {
    let filtered = desserts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (dessert) =>
          dessert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dessert.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          dessert.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((dessert) =>
        dessert.tags?.includes(selectedCategory)
      );
    }

    // Sort desserts
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price_cents - b.price_cents;
        case "price-high":
          return b.price_cents - a.price_cents;
        case "featured":
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredDesserts(filtered);
  }, [desserts, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="py-12  min-h-screen px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our Dessert Menu
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Discover our complete collection of handcrafted desserts
          </p>
        </div>

        {/* Modern Search & Filter Bar */}
        <div className="mb-12">
          <div className="backdrop-blur-md rounded-2xl shadow-lg border border-gray-300/30 dark:border-gray-600/30 p-6 ">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  placeholder="Search desserts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-primary/10 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-primary/5 transition-all duration-300 ease-in-out"
                />
              </div>

              {/* Category Filter */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-12 pr-10 py-3.5 bg-primary/10 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-primary/5 focus:border-primary transition-all duration-300 ease-in-out cursor-pointer min-w-[160px]"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Sort */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SortAsc className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-12 pr-10 py-3.5 bg-primary/10 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-primary/5 transition-all duration-300 ease-in-out cursor-pointer min-w-[180px]"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="featured">Featured First</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || selectedCategory !== "" || sortBy !== "name") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setSortBy("name");
                  }}
                  className="px-4 py-3.5 bg-primary/50 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md whitespace-nowrap"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredDesserts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {desserts.length}
            </span>{" "}
            desserts
          </p>
        </div>

        {/* Desserts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-primary animate-ping opacity-20"></div>
            </div>
          </div>
        ) : filteredDesserts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDesserts.map((dessert, index) => (
              <div
                key={dessert.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <DessertCard dessert={dessert} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-gray-400 dark:text-gray-600 mb-6 animate-bounce">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              No desserts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;

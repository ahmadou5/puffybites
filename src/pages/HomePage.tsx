import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  ChefHat,
  Heart,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { dessertsAPI } from "@/lib/supabase";
import DessertCard from "@/components/DessertCard/DessertCard";
import type { Dessert } from "@/types";

interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

const HomePage: React.FC = () => {
  const [featuredDesserts, setFeaturedDesserts] = useState<Dessert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchFeaturedDesserts = async () => {
      try {
        const desserts = await dessertsAPI.getAll();
        // Show featured desserts or first 3 if no featured items
        const featured = desserts.filter((d) => d.is_featured).slice(0, 3);
        setFeaturedDesserts(
          featured.length > 0 ? featured : desserts.slice(0, 3)
        );
      } catch (error) {
        console.error("Error fetching desserts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDesserts();
  }, []);

  // Desktop: show 3 cards per view, Mobile: show 1 card per view
  const getItemsPerView = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024 ? 3 : 1; // lg breakpoint
    }
    return 3;
  };

  const itemsPerView = getItemsPerView();
  const maxIndex = Math.max(0, featuredDesserts.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="">
      {/* Hero Section */}
      <section className=" py-24 px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl lg:py-[110px] py-4 mx-auto">
          <div className="max-w-4xl">
            <h1 className="lg:text-5xl text-4xl md:text-7xl font-bold mb-8 leading-tight text-gray-900 dark:text-white">
              Welcome to <span className="text-primary">Puffy Bites</span>
            </h1>
            <p className="text-lg md:text-2xl mb-10 leading-relaxed max-w-3xl text-gray-700 dark:text-gray-300">
              Indulge in our handcrafted premium desserts, made fresh daily with
              love and the finest ingredients.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                to="/order"
                className="bg-primary text-white hover:bg-primary-dark hover:shadow-lg px-8 lg:py-3 py-2 text-lg font-semibold rounded-2xl transition-all duration-200 text-center shadow-md"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: ChefHat,
                title: "Handcrafted Daily",
                description:
                  "Every dessert is made fresh daily by our expert pastry chefs using traditional techniques.",
                color: "primary",
              },
              {
                icon: Heart,
                title: "Premium Ingredients",
                description:
                  "We source only the finest ingredients from trusted suppliers to ensure exceptional quality.",
                color: "secondary",
              },
              {
                icon: Award,
                title: "Award Winning",
                description:
                  "Our desserts have won multiple awards and are loved by customers across the city.",
                color: "primary",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="text-center animate-fade-in-up group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div
                  className={`w-20 h-20 bg-${feature.color}/10 dark:bg-${feature.color}/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 ease-out group-hover:shadow-lg`}
                >
                  <feature.icon
                    className={`w-10 h-10 text-${feature.color} group-hover:scale-110 transition-transform duration-300`}
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Desserts */}
      <section id="featured" className="py-20 px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Featured Desserts
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Try our most popular and chef-recommended treats
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="relative mb-16">
              {/* Desktop Controls */}
              <div className="hidden lg:block px-5">
                <div className="relative">
                  {/* Previous Button */}

                  {/* Desktop Carousel - 3 items per view */}
                  <div className="">
                    <div
                      className="flex gap-8 px-2 w-auto  py-4 transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                      }}
                    >
                      {featuredDesserts.map((dessert, index) => (
                        <div key={dessert.id} className="flex-none w-1/3">
                          <DessertCard dessert={dessert} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Carousel - 1 item per view, centered */}
              <div className="lg:hidden">
                <div className="relative max-w-sm mx-auto">
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                      }}
                    >
                      {featuredDesserts.map((dessert, index) => (
                        <div key={dessert.id} className="flex-none w-full">
                          <DessertCard dessert={dessert} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Navigation Dots */}
                  <div className="flex justify-center mt-6 gap-2">
                    {featuredDesserts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentIndex === index
                            ? "bg-primary w-8"
                            : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop Navigation Dots */}
              <div className="hidden lg:flex justify-center mt-8 gap-2">
                {Array.from({
                  length: Math.ceil(featuredDesserts.length / 3),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? "bg-primary w-8"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/order"
              className="bg-primary text-white hover:bg-primary-dark lg:px-7 px-4 lg:py-3 py-2 text-lg font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl inline-block"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(
              [
                {
                  name: "Sarah Johnson",
                  text: "The best desserts in the city! The chocolate cloud cake is absolutely divine.",
                  rating: 5,
                },
                {
                  name: "Mike Chen",
                  text: "Fresh ingredients, amazing flavors, and beautiful presentation. Highly recommended!",
                  rating: 5,
                },
                {
                  name: "Emma Davis",
                  text: "Perfect for special occasions. The staff is friendly and the delivery is always on time.",
                  rating: 5,
                },
              ] as Testimonial[]
            ).map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/5 p-8 rounded-xl border border-gray-300 dark:border-gray-600 shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  - {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

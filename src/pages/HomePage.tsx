import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  ChefHat,
  Heart,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
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
  const [allDesserts, setAllDesserts] = useState<Dessert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [allDessertsIndex, setAllDessertsIndex] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const fetchDesserts = async () => {
      try {
        const desserts = await dessertsAPI.getAll();
        // Show ALL featured desserts, or first 3 if no featured items
        const featured = desserts.filter((d) => d.is_featured);
        setFeaturedDesserts(
          featured.length > 0 ? featured : desserts.slice(0, 3)
        );
        setAllDesserts(desserts);
      } catch (error) {
        console.error("Error fetching desserts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesserts();
  }, []);

  // Desktop: show 3 cards per view, Mobile: show 1 card per view
  const getItemsPerView = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024 ? 3 : 1; // lg breakpoint
    }
    return 3;
  };

  const itemsPerView = getItemsPerView();
  const maxIndex = Math.max(
    0,
    Math.ceil(featuredDesserts.length / itemsPerView) - 1
  );

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // All desserts carousel functions
  const nextAllDessertsSlide = () => {
    const maxIdx = Math.max(0, allDesserts.length - itemsPerView);
    setAllDessertsIndex((prev) => (prev >= maxIdx ? 0 : prev + 1));
  };

  const prevAllDessertsSlide = () => {
    const maxIdx = Math.max(0, allDesserts.length - itemsPerView);
    setAllDessertsIndex((prev) => (prev <= 0 ? maxIdx : prev - 1));
  };

  const goToAllDessertsSlide = (index: number) => {
    setAllDessertsIndex(index);
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

      {/* Featured Desserts */}
      <section id="featured" className="py-10 px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center bg-white/0 flex w-[100%] ml-auto mr-auto h-12 mb-10">
            <div className="py-2 px-5 lg:px-9">
              <h2 className="text-xl lg:text-3xl text-start font-bold text-gray-900 dark:text-white">
                Top picks
              </h2>
            </div>
            <Link
              to="/order"
              className="py-2 ml-auto flex px-5 hover:border border-primary/30 rounded-xl hover:bg-primary/30 backdrop-blur-md"
            >
              <p className="ml-3 mr-2 py-0 font-bold text-base  lg:text-xl">
                View all
              </p>
              <div className="w-8 h-8 py-0 px-2 flex items-center bg-primary/20 border backdrop-blur-md border-primary/30 rounded-xl">
                <ArrowRight />
              </div>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="relative mb-16">
              {/* Desktop Controls */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Previous Button */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-2xl transition-all duration-300 hover:scale-110"
                    disabled={featuredDesserts.length <= 3}
                  >
                    <ChevronLeft
                      size={20}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-2xl transition-all duration-300 hover:scale-110"
                    disabled={featuredDesserts.length <= 3}
                  >
                    <ChevronRight
                      size={20}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  </button>

                  {/* Desktop Carousel - 3 items per view */}
                  <div className="overflow-visible py-6 px-8">
                    <div
                      className="flex gap-8 transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                      }}
                    >
                      {featuredDesserts.map((dessert) => (
                        <div
                          key={`featured-${dessert.id}`}
                          className="flex-none w-1/3 min-w-0"
                        >
                          <DessertCard dessert={dessert} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Carousel - 1 item per view, centered */}
              <div className="lg:hidden">
                <div className="relative w-full max-w-sm mx-auto px-2">
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out touch-pan-y"
                      style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        minHeight: "550px",
                      }}
                      onTouchStart={(e) => {
                        const touch = e.touches[0];
                        setTouchStart(touch.clientX);
                      }}
                      onTouchMove={(e) => {
                        if (!touchStart) return;
                        const touch = e.touches[0];
                        setTouchEnd(touch.clientX);
                      }}
                      onTouchEnd={() => {
                        if (!touchStart || !touchEnd) return;
                        const distance = touchStart - touchEnd;
                        const isLeftSwipe = distance > 50;
                        const isRightSwipe = distance < -50;

                        if (
                          isLeftSwipe &&
                          currentIndex < featuredDesserts.length - 1
                        ) {
                          nextSlide();
                        } else if (isRightSwipe && currentIndex > 0) {
                          prevSlide();
                        }

                        setTouchStart(null);
                        setTouchEnd(null);
                      }}
                    >
                      {featuredDesserts.map((dessert) => (
                        <div
                          key={`all-mobile-${dessert.id}`}
                          className="flex-none w-full flex justify-center items-start py-4"
                        >
                          <div className="w-full max-w-xs">
                            <DessertCard dessert={dessert} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Navigation Dots */}
                  <div className="flex justify-center mt-6 gap-2">
                    {featuredDesserts.map((_, index) => (
                      <button
                        key={`featured-dot-${index}`}
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
                    key={`all-desktop-dot-${index}`}
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
        </div>
      </section>

      {/* All Desserts Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center bg-white/0 flex w-[100%] ml-auto mr-auto h-12 mb-10">
            <div className="py-2 px-5 lg:px-9">
              <h2 className="text-xl lg:text-3xl text-start font-bold text-gray-900 dark:text-white">
                All Puffs
              </h2>
            </div>
            <Link
              to="/order"
              className="py-2 ml-auto flex px-5 hover:border border-primary/30 rounded-xl hover:bg-primary/30 backdrop-blur-md"
            >
              <p className="ml-3 mr-2 py-0 font-bold text-base  lg:text-xl">
                View all
              </p>
              <div className="w-8 h-8 py-0 px-2 flex items-center bg-primary/20 border backdrop-blur-md border-primary/30 rounded-xl">
                <ArrowRight />
              </div>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="relative mb-16">
              {/* Desktop Controls */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Previous Button */}
                  <button
                    onClick={prevAllDessertsSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-2xl transition-all duration-300 hover:scale-110"
                    disabled={allDesserts.length <= 3}
                  >
                    <ChevronLeft
                      size={20}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={nextAllDessertsSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-2xl transition-all duration-300 hover:scale-110"
                    disabled={allDesserts.length <= 3}
                  >
                    <ChevronRight
                      size={20}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  </button>

                  {/* Desktop Carousel - 3 items per view */}
                  <div className="overflow-visible py-6 px-8">
                    <div
                      className="flex gap-8 transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${
                          allDessertsIndex * (100 / 3)
                        }%)`,
                      }}
                    >
                      {allDesserts.map((dessert) => (
                        <div
                          key={`all-${dessert.id}`}
                          className="flex-none w-1/3 min-w-0"
                        >
                          <DessertCard dessert={dessert} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Carousel - 1 item per view, centered */}
              <div className="lg:hidden">
                <div className="relative w-full max-w-sm mx-auto px-2">
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out touch-pan-y"
                      style={{
                        transform: `translateX(-${allDessertsIndex * 100}%)`,
                        minHeight: "550px",
                      }}
                      onTouchStart={(e) => {
                        const touch = e.touches[0];
                        setTouchStart(touch.clientX);
                      }}
                      onTouchMove={(e) => {
                        if (!touchStart) return;
                        const touch = e.touches[0];
                        setTouchEnd(touch.clientX);
                      }}
                      onTouchEnd={() => {
                        if (!touchStart || !touchEnd) return;
                        const distance = touchStart - touchEnd;
                        const isLeftSwipe = distance > 50;
                        const isRightSwipe = distance < -50;

                        if (
                          isLeftSwipe &&
                          allDessertsIndex < allDesserts.length - 1
                        ) {
                          nextAllDessertsSlide();
                        } else if (isRightSwipe && allDessertsIndex > 0) {
                          prevAllDessertsSlide();
                        }

                        setTouchStart(null);
                        setTouchEnd(null);
                      }}
                    >
                      {allDesserts.map((dessert) => (
                        <div
                          key={`all-mobile-${dessert.id}`}
                          className="flex-none w-full flex justify-center items-start py-4"
                        >
                          <div className="w-full max-w-xs">
                            <DessertCard dessert={dessert} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Navigation Dots */}
                  <div className="flex justify-center mt-6 gap-2">
                    {allDesserts.map((_, index) => (
                      <button
                        key={`all-dot-${index}`}
                        onClick={() => goToAllDessertsSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          allDessertsIndex === index
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
                {Array.from({ length: Math.ceil(allDesserts.length / 3) }).map(
                  (_, index) => (
                    <button
                      key={`all-desktop-dot-${index}`}
                      onClick={() => goToAllDessertsSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        allDessertsIndex === index
                          ? "bg-primary w-8"
                          : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                      }`}
                    />
                  )
                )}
              </div>
            </div>
          )}
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

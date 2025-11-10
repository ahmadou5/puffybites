import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Moon, Sun } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";

interface NavigationItem {
  name: string;
  href: string;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { getItemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navigation: NavigationItem[] = [
    { name: "Home", href: "/" },
    { name: "Order", href: "/order" },
    { name: "Admin", href: "/admin" },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <header className=" backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 dark:bg-black/70 light:bg-white/60 rounded-lg flex items-center border dark:border-white/70 light:border-black justify-center shadow-sm">
              <span className="dark:text-white/70 light:text-black/50 font-bold text-lg">
                pb
              </span>
            </div>
            <span className="text-xl font-semibold text-primary">
              Puffy Bites
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-primary dark:text-primary-light"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Cart */}
            <Link
              to="/checkout"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ShoppingCart size={20} />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm">
                  {getItemCount()}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg z-50 md:hidden">
              <nav className="flex flex-col py-4 px-6">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-medium transition-all duration-200 py-3 px-4 rounded-lg animate-fade-in-up ${
                      isActive(item.href)
                        ? "text-primary dark:text-primary-light bg-blue-50/80 dark:bg-blue-950/80"
                        : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light hover:bg-gray-50/80 dark:hover:bg-gray-900/80"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

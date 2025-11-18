import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Lock, Mail, User, AlertCircle } from "lucide-react";
import FluidBackground from "./FluidBackground";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center backdrop-blur-md">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-puffy-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show the protected content
  if (user) {
    return <>{children}</>;
  }

  // Show login form if not authenticated
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message || "Invalid email or password");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center bg-black justify-center backdrop-blur-xl px-4">
      <FluidBackground />
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-puffy-primary rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-puffy-dark dark:text-white mb-2">
            Admin Access Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 borde border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                placeholder="admin@puffydelights.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 borde border-primary/30 rounded-2xl bg-primary/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center  bg-primary/60 hover:bg-primary/30 items-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-puffy-primary hover:bg-puffy-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-puffy-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </>
            ) : (
              <>
                <User className="w-4 h-4 mr-2" />
                Sign In to Admin Panel
              </>
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            For admin access, please contact your system administrator
          </p>
        </div>

        {/* Demo Credentials (remove in production) */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
            Demo Credentials:
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Email: admin@puffydelights.com
            <br />
            Password: admin123
          </p>
          <p className="text-xs text-blue-500 dark:text-blue-300 mt-2">
            Note: Create these credentials in your Supabase Auth dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

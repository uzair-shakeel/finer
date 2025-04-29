"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // We'll check if we're on the login page to avoid redirecting in a loop
        if (pathname === "/admin/login") {
          setLoading(false);
          return;
        }

        const response = await fetch("/api/auth/check", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Not authenticated");
        }

        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setLoading(false);

        // Redirect to login page if not authenticated
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Redirect to login page
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // If we're on the login page or still loading, render without the admin layout
  if (pathname === "/admin/login" || loading) {
    return children;
  }

  // If not authenticated and not on login page, we don't render anything
  // The useEffect will redirect to login
  if (!isAuthenticated && pathname !== "/admin/login") {
    return null;
  }

  return (
    <div className="flex h-screen bg-blue-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-1">
            <Link
              href="/admin"
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                pathname === "/admin"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                pathname.includes("/admin/products")
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              Products
            </Link>
          </div>

          <div className="px-4 mt-8">
            <button
              onClick={handleLogout}
              className="block w-full py-2.5 px-4 rounded text-left text-gray-700 hover:bg-red-100 transition duration-200"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

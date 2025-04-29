"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    liveProducts: 0,
    archivedProducts: 0,
    draftProducts: 0,
    soldOutProducts: 0,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all products for charts
        const productsResponse = await fetch("/api/products", {
          headers: {
            "x-is-admin": "true",
          },
        });

        // Fetch live products
        const liveResponse = await fetch("/api/products?status=live", {
          headers: {
            "x-is-admin": "true",
          },
        });

        // Fetch archived products
        const archivedResponse = await fetch("/api/products?status=archive", {
          headers: {
            "x-is-admin": "true",
          },
        });

        // Fetch draft products
        const draftResponse = await fetch("/api/products?status=draft", {
          headers: {
            "x-is-admin": "true",
          },
        });

        // Fetch sold out products
        const soldOutResponse = await fetch("/api/products?status=sold_out", {
          headers: {
            "x-is-admin": "true",
          },
        });

        if (
          !productsResponse.ok ||
          !liveResponse.ok ||
          !archivedResponse.ok ||
          !draftResponse.ok ||
          !soldOutResponse.ok
        ) {
          throw new Error("Failed to fetch product statistics");
        }

        const productsData = await productsResponse.json();
        const liveData = await liveResponse.json();
        const archivedData = await archivedResponse.json();
        const draftData = await draftResponse.json();
        const soldOutData = await soldOutResponse.json();

        setStats({
          totalProducts: productsData.count || 0,
          liveProducts: liveData.count || 0,
          archivedProducts: archivedData.count || 0,
          draftProducts: draftData.count || 0,
          soldOutProducts: soldOutData.count || 0,
        });

        setProducts(productsData.products || []);
      } catch (error) {
        console.error("Fetch stats error:", error);
        setError("Failed to fetch product statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data
  const statusChartData = {
    labels: ["Live", "Archived", "Draft", "Sold Out"],
    datasets: [
      {
        label: "Products by Status",
        data: [
          stats.liveProducts,
          stats.archivedProducts,
          stats.draftProducts,
          stats.soldOutProducts,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(201, 203, 207, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgb(75, 192, 192)",
          "rgb(201, 203, 207)",
          "rgb(255, 205, 86)",
          "rgb(255, 99, 132)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Price range chart data
  const preparePriceRangeData = () => {
    const ranges = [
      { label: "£0-500", min: 0, max: 500, count: 0 },
      { label: "£501-1000", min: 501, max: 1000, count: 0 },
      { label: "£1001-5000", min: 1001, max: 5000, count: 0 },
      { label: "£5001-10000", min: 5001, max: 10000, count: 0 },
      { label: "£10000+", min: 10001, max: Infinity, count: 0 },
    ];

    products.forEach((product) => {
      const price = parseFloat(product.price);
      if (!isNaN(price)) {
        const range = ranges.find((r) => price >= r.min && price <= r.max);
        if (range) range.count++;
      }
    });

    return {
      labels: ranges.map((r) => r.label),
      datasets: [
        {
          label: "Products by Price Range",
          data: ranges.map((r) => r.count),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgb(54, 162, 235)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Recent products chart data
  const prepareProductsOverTimeData = () => {
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        count: 0,
        fullDate: new Date(date.getFullYear(), date.getMonth(), 1),
      };
    }).reverse();

    products.forEach((product) => {
      const createdAt = new Date(product.createdAt);
      const monthEntry = lastSixMonths.find((m) => {
        return (
          createdAt.getMonth() === m.fullDate.getMonth() &&
          createdAt.getFullYear() === m.fullDate.getFullYear()
        );
      });
      if (monthEntry) monthEntry.count++;
    });

    return {
      labels: lastSixMonths.map((m) => `${m.month} ${m.year}`),
      datasets: [
        {
          label: "Products Added",
          data: lastSixMonths.map((m) => m.count),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your products and content</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading statistics...</p>
        </div>
      ) : (
        <>
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-500 text-lg font-semibold mb-2">
                Total Products
              </div>
              <div className="text-3xl font-bold">{stats.totalProducts}</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-500 text-lg font-semibold mb-2">
                Live Products
              </div>
              <div className="text-3xl font-bold">{stats.liveProducts}</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-gray-500 text-lg font-semibold mb-2">
                Archived Products
              </div>
              <div className="text-3xl font-bold">{stats.archivedProducts}</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-orange-500 text-lg font-semibold mb-2">
                Draft Products
              </div>
              <div className="text-3xl font-bold">{stats.draftProducts}</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-red-500 text-lg font-semibold mb-2">
                Sold Out Products
              </div>
              <div className="text-3xl font-bold">{stats.soldOutProducts}</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Products by Status</h2>
              <div className="h-64">
                <Pie
                  data={statusChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                Products by Price Range
              </h2>
              <div className="h-64">
                <Bar
                  data={preparePriceRangeData()}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">Products Added Over Time</h2>
            <div className="h-64">
              <Line
                data={prepareProductsOverTimeData()}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link
                  href="/admin/products"
                  className="block text-blue-500 hover:text-blue-700"
                >
                  View All Products
                </Link>
                <Link
                  href="/admin/products/new"
                  className="block text-blue-500 hover:text-blue-700"
                >
                  Add New Product
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Getting Started</h2>
              <p className="text-gray-600 mb-2">
                Use the admin panel to manage your products and content.
              </p>
              <p className="text-gray-600">
                You can add new products, edit existing ones, and set their
                status to live or archive.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

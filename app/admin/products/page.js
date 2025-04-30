"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "updatedAt",
    direction: "desc",
  });
  const [filters, setFilters] = useState({
    status: "",
    featured: "",
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url = "/api/products?";
        const params = new URLSearchParams();

        if (filters.status) {
          params.append("status", filters.status);
        }

        if (filters.featured) {
          params.append("featured", filters.featured === "true");
        }

        url += params.toString();

        const response = await fetch(url, {
          headers: {
            "x-is-admin": "true",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Fetch products error:", error);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    // Sort the products
    const sortedProducts = [...products].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setProducts(sortedProducts);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: searchInput,
    }));
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Remove the deleted product from the state
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Delete product error:", error);
      alert("Failed to delete product");
    }
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product status");
      }

      // Update the product status in the state
      setProducts((prev) =>
        prev.map((product) =>
          product._id === id ? { ...product, status: newStatus } : product
        )
      );
    } catch (error) {
      console.error("Update product status error:", error);
      alert("Failed to update product status");
    }
  };

  // Handle featured toggle
  const handleFeaturedToggle = async (id, featured) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured: !featured }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product featured status");
      }

      // Update the product featured status in the state
      setProducts((prev) =>
        prev.map((product) =>
          product._id === id ? { ...product, featured: !featured } : product
        )
      );
    } catch (error) {
      console.error("Update product featured status error:", error);
      alert("Failed to update product featured status");
    }
  };

  // Handle product duplication
  const handleDuplicate = async (product) => {
    try {
      // Create a new product object without the _id and with updated timestamps
      const newProduct = {
        ...product,
        _id: undefined, // Will be generated on the server
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to duplicate product");
      }

      // Refresh the products list
      const fetchProductsResponse = await fetch("/api/products", {
        headers: {
          "x-is-admin": "true",
        },
      });

      if (!fetchProductsResponse.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await fetchProductsResponse.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Duplicate product error:", error);
      alert("Failed to duplicate product");
    }
  };

  // Filter products by search term
  const filteredProducts = products.filter((product) => {
    if (!filters.search) return true;

    const searchTerm = filters.search.toLowerCase();
    return (
      product.brand.toLowerCase().includes(searchTerm) ||
      product.model.toLowerCase().includes(searchTerm) ||
      (product.reference &&
        product.reference.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <span className="mr-1">+</span> Add New Product
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-4 border-b">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by brand, model..."
                className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
              >
                <option value="">All Statuses</option>
                {/* <option value="live">Live</option> */}
                <option value="in_stock">In Stock</option>
                <option value="reserved">Reserved</option>
                <option value="archive">Archived</option>
                {/* <option value="draft">Draft</option> */}
                <option value="sold_out">Sold Out</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="featured"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Featured
              </label>
              <select
                id="featured"
                name="featured"
                value={filters.featured}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="true">Featured</option>
                <option value="false">Not Featured</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-lg flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("itemCode")}
                  >
                    Item Code
                    {sortConfig.key === "itemCode" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("imageUrl")}
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("brand")}
                  >
                    Brand
                    {sortConfig.key === "brand" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("model")}
                  >
                    Model
                    {sortConfig.key === "model" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("reference")}
                  >
                    Reference
                    {sortConfig.key === "reference" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    Price
                    {sortConfig.key === "price" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    {sortConfig.key === "status" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("featured")}
                  >
                    Featured
                    {sortConfig.key === "featured" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.itemCode || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative h-16 w-16">
                          <Image
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={`${product.brand} ${product.model}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.brand}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.model}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.reference || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          £{product.price}
                        </div>
                        {product.discount > 0 && (
                          <div className="text-xs text-gray-500">
                            <span className="line-through">
                              £{product.originalPrice}
                            </span>{" "}
                            ({product.discount}% off)
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={product.status}
                          onChange={(e) =>
                            handleStatusChange(product._id, e.target.value)
                          }
                          className={`text-sm font-medium rounded-full px-3 py-1 ${
                            product.status === "live"
                              ? "bg-green-100 text-green-800"
                              : product.status === "archive"
                              ? "bg-gray-100 text-gray-800"
                              : product.status === "sold_out"
                              ? "bg-red-100 text-red-800"
                              : product.status === "reserved"
                              ? "bg-orange-100 text-orange-800"
                              : product.status === "in_stock"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          <option value="live">Live</option>
                          <option value="in_stock">In Stock</option>
                          <option value="reserved">Reserved</option>
                          <option value="archive">Archive</option>
                          <option value="draft">Draft</option>
                          <option value="sold_out">Sold Out</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              handleFeaturedToggle(
                                product._id,
                                product.featured
                              )
                            }
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ease-in-out duration-200 focus:outline-none ${
                              product.featured ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block w-4 h-4 transform bg-white rounded-full transition ease-in-out duration-200 ${
                                product.featured
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDuplicate(product)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center">
                      <div className="text-gray-500">No products found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function BrandsPage() {
  const [brandsWithModels, setBrandsWithModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to safely convert ObjectId to string
  const safeToString = (id) => {
    if (!id) return "";
    if (typeof id === "string") return id;
    if (typeof id === "object" && id.toString) return id.toString();
    return "";
  };

  useEffect(() => {
    fetchBrandsWithModels();
  }, []);

  const fetchBrandsWithModels = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/brands?includeModels=true");
      const data = await response.json();

      if (data.success) {
        // Transform the data to ensure IDs are strings
        const transformedBrands = data.data.map((brand) => ({
          ...brand,
          _id: safeToString(brand._id),
          models: brand.models.map((model) => ({
            ...model,
            _id: safeToString(model._id),
          })),
        }));
        setBrandsWithModels(transformedBrands);
      } else {
        setError(data.message || "Failed to fetch brands");
        toast.error(data.message || "Failed to fetch brands");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError("An error occurred while fetching brands");
      toast.error("An error occurred while fetching brands");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        const response = await fetch(`/api/brands/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (data.success) {
          toast.success("Brand deleted successfully");
          fetchBrandsWithModels(); // Refresh the list
        } else {
          toast.error(data.message || "Failed to delete brand");
        }
      } catch (error) {
        console.error("Error deleting brand:", error);
        toast.error("An error occurred while deleting the brand");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-gray-600 mt-1">
            Manage watch brands and their models
          </p>
        </div>
        <Link
          href="/admin/brands/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Add New Brand
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Brand Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Models
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brandsWithModels.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No brands found. Add your first brand to get started.
                  </td>
                </tr>
              ) : (
                brandsWithModels.map((brand) => (
                  <tr key={brand._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {brand.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 mr-2">
                            {brand.models.length} models
                          </span>
                          <Link
                            href={`/admin/brands/${brand._id}/models`}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs"
                          >
                            Manage Models
                          </Link>
                          <Link
                            href={`/admin/models/new?brandId=${brand._id}`}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-xs ml-2"
                          >
                            Add Model
                          </Link>
                        </div>
                        {brand.models.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {brand.models.slice(0, 5).map((model) => (
                              <span
                                key={model._id}
                                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                              >
                                {model.name}
                              </span>
                            ))}
                            {brand.models.length > 5 && (
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                +{brand.models.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/brands/${brand._id}/edit`}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

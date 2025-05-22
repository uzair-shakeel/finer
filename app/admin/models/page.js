"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function ModelsPage() {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchModelsAndBrands();
  }, []);

  const fetchModelsAndBrands = async () => {
    try {
      setLoading(true);

      // Fetch all brands first
      const brandsResponse = await fetch("/api/brands");
      const brandsData = await brandsResponse.json();

      if (!brandsData.success) {
        throw new Error(brandsData.message || "Failed to fetch brands");
      }

      // Create a map of brand IDs to brand names for easier lookup
      const brandsMap = {};
      brandsData.data.forEach((brand) => {
        brandsMap[brand._id] = brand;
      });
      setBrands(brandsMap);

      // Fetch all models
      const modelsResponse = await fetch("/api/models");
      const modelsData = await modelsResponse.json();

      if (modelsData.success) {
        setModels(modelsData.data);
      } else {
        throw new Error(modelsData.message || "Failed to fetch models");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "An error occurred while fetching data");
      toast.error(error.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModel = async (modelId) => {
    if (window.confirm("Are you sure you want to delete this model?")) {
      try {
        const response = await fetch(`/api/models/${modelId}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (data.success) {
          toast.success("Model deleted successfully");
          // Remove the deleted model from the state
          setModels((prevModels) =>
            prevModels.filter((model) => model._id !== modelId)
          );
        } else {
          toast.error(data.message || "Failed to delete model");
        }
      } catch (error) {
        console.error("Error deleting model:", error);
        toast.error("An error occurred while deleting the model");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Watch Models</h1>
          <p className="text-gray-600 mt-1">
            Manage all watch models across different brands
          </p>
        </div>
        <Link
          href="/admin/models/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Add New Model
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
                  Brand
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Model Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
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
              {models.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No models found. Add your first model to get started.
                  </td>
                </tr>
              ) : (
                models.map((model) => (
                  <tr key={model._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {brands[model.brandId]?.name || "Unknown Brand"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {model.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          model.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {model.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/brands/${model.brandId}/models`}
                          className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded text-xs"
                        >
                          View Brand
                        </Link>
                        <Link
                          href={`/admin/models/${model._id}/edit`}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteModel(model._id)}
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

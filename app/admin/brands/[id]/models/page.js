"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function BrandModelsPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [brand, setBrand] = useState(null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBrandAndModels();
  }, []);

  const fetchBrandAndModels = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/brands/${id}`);
      const data = await response.json();

      if (data.success) {
        setBrand(data.data.brand);
        setModels(data.data.models);
      } else {
        setError(data.message || "Failed to fetch brand and models");
        toast.error(data.message || "Failed to fetch brand and models");
      }
    } catch (error) {
      console.error("Error fetching brand and models:", error);
      setError("An error occurred while fetching the brand and models");
      toast.error("An error occurred while fetching the brand and models");
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
          <h1 className="text-3xl font-bold">
            {brand ? `${brand.name} Models` : "Models"}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage watch models for this brand
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/brands"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
          >
            Back to Brands
          </Link>
          <Link
            href={`/admin/models/new?brandId=${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Add New Model
          </Link>
        </div>
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
                  Model Name
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
                    colSpan="2"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No models found for this brand. Add your first model to get
                    started.
                  </td>
                </tr>
              ) : (
                models.map((model) => (
                  <tr key={model._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {model.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
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

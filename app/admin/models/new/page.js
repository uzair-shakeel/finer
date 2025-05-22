"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function NewModelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBrandId = searchParams.get("brandId");

  const [formData, setFormData] = useState({
    name: "",
    brandId: preselectedBrandId || "",
    description: "",
    active: true,
  });

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/brands");
      const data = await response.json();

      if (data.success) {
        setBrands(data.data);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name) {
      toast.error("Model name is required");
      return;
    }

    if (!formData.brandId) {
      toast.error("Please select a brand");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch("/api/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Model created successfully");

        // Redirect to brand's models page if we came from there
        if (preselectedBrandId) {
          router.push(`/admin/brands/${preselectedBrandId}/models`);
        } else {
          // Otherwise go to models list
          router.push("/admin/models");
        }
      } else {
        setError(data.message || "Failed to create model");
        toast.error(data.message || "Failed to create model");
      }
    } catch (error) {
      console.error("Error creating model:", error);
      setError("An error occurred while creating the model");
      toast.error("An error occurred while creating the model");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Model</h1>
          <p className="text-gray-600 mt-1">
            Create a new watch model for a specific brand
          </p>
        </div>
        <Link
          href={
            preselectedBrandId
              ? `/admin/brands/${preselectedBrandId}/models`
              : "/admin/models"
          }
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="brandId"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Brand <span className="text-red-500">*</span>
            </label>
            <select
              id="brandId"
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={loading || !!preselectedBrandId}
              required
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Model Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g. Submariner, Daytona, Nautilus"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              placeholder="Enter a description of this model (optional)"
            ></textarea>
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="active"
                className="ml-2 block text-sm text-gray-900"
              >
                Active
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Inactive models won't be shown in product dropdowns
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Model"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function EditBrandPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBrand();
  }, []);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/brands/${id}`);
      const data = await response.json();

      if (data.success) {
        setFormData({
          name: data.data.brand.name,
        });
        setModels(data.data.models || []);
      } else {
        setError(data.message || "Failed to fetch brand");
        toast.error(data.message || "Failed to fetch brand");
      }
    } catch (error) {
      console.error("Error fetching brand:", error);
      setError("An error occurred while fetching the brand");
      toast.error("An error occurred while fetching the brand");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.name) {
        setError("Brand name is required");
        setSubmitting(false);
        return;
      }

      const response = await fetch(`/api/brands/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Brand updated successfully");
        router.push("/admin/brands");
      } else {
        setError(data.message || "Failed to update brand");
        toast.error(data.message || "Failed to update brand");
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      setError("An error occurred while updating the brand");
      toast.error("An error occurred while updating the brand");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Brand</h1>
          <p className="text-gray-600 mt-1">Update brand information</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/brands/${id}/models`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Manage Models
          </Link>
          <Link
            href="/admin/brands"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
          >
            Cancel
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Brand Information</h2>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Rolex"
                  required
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                    submitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none`}
                >
                  {submitting ? "Updating..." : "Update Brand"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Models</h2>
            <Link
              href={`/admin/models/new?brandId=${id}`}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1 px-3 rounded"
            >
              Add Model
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : models.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No models found for this brand.</p>
              <Link
                href={`/admin/models/new?brandId=${id}`}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Add your first model
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {models.map((model) => (
                    <tr key={model._id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {model.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            model.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {model.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                        <Link
                          href={`/admin/models/${model._id}/edit`}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

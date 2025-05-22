"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function NewBrandPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

      const response = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Brand created successfully");
        router.push("/admin/brands");
      } else {
        setError(data.message || "Failed to create brand");
        toast.error(data.message || "Failed to create brand");
      }
    } catch (error) {
      console.error("Error creating brand:", error);
      setError("An error occurred while creating the brand");
      toast.error("An error occurred while creating the brand");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Brand</h1>
          <p className="text-gray-600 mt-1">Create a new watch brand</p>
        </div>
        <Link
          href="/admin/brands"
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
              {submitting ? "Creating..." : "Create Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

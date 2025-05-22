"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function EditModelPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: "",
    brandId: "",
    description: "",
    image: "",
    featured: false,
    displayOrder: 0,
    active: true,
    referencePrefix: "",
    commonCaseSizes: [],
    commonMaterials: [],
  });

  const [brands, setBrands] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [caseSizeInput, setCaseSizeInput] = useState("");
  const [materialInput, setMaterialInput] = useState("");

  // Fetch brands and model data when component mounts
  useEffect(() => {
    fetchBrands();
    fetchModel();
  }, [id]);

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brands");
      const data = await response.json();

      if (data.success) {
        // Only show active brands
        const activeBrands = data.data.filter((brand) => brand.active);
        setBrands(activeBrands);
      } else {
        console.error("Failed to fetch brands:", data.message);
        toast.error("Failed to fetch brands");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Error fetching brands");
    }
  };

  const fetchModel = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/models/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch model data");
      }

      const data = await response.json();

      if (data.success) {
        const model = data.data;
        setFormData({
          name: model.name || "",
          brandId: model.brandId?._id || model.brandId || "",
          description: model.description || "",
          image: model.image || "",
          featured: model.featured || false,
          displayOrder: model.displayOrder || 0,
          active: model.active !== undefined ? model.active : true,
          referencePrefix: model.referencePrefix || "",
          commonCaseSizes: model.commonCaseSizes || [],
          commonMaterials: model.commonMaterials || [],
        });
      } else {
        setError("Failed to load model data");
        toast.error("Failed to load model data");
      }
    } catch (error) {
      console.error("Error fetching model:", error);
      setError("Error loading model data");
      toast.error("Error loading model data");
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, WEBP, SVG)");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, image: data.url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Add a case size to the array
  const addCaseSize = () => {
    if (!caseSizeInput.trim()) return;

    setFormData((prev) => ({
      ...prev,
      commonCaseSizes: [...prev.commonCaseSizes, caseSizeInput.trim()],
    }));
    setCaseSizeInput("");
  };

  // Remove a case size from the array
  const removeCaseSize = (index) => {
    setFormData((prev) => ({
      ...prev,
      commonCaseSizes: prev.commonCaseSizes.filter((_, i) => i !== index),
    }));
  };

  // Add a material to the array
  const addMaterial = () => {
    if (!materialInput.trim()) return;

    setFormData((prev) => ({
      ...prev,
      commonMaterials: [...prev.commonMaterials, materialInput.trim()],
    }));
    setMaterialInput("");
  };

  // Remove a material from the array
  const removeMaterial = (index) => {
    setFormData((prev) => ({
      ...prev,
      commonMaterials: prev.commonMaterials.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.name) {
        setError("Model name is required");
        setSubmitting(false);
        return;
      }

      if (!formData.brandId) {
        setError("Brand selection is required");
        setSubmitting(false);
        return;
      }

      const response = await fetch(`/api/models/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Watch model updated successfully");
        router.push("/admin/models");
      } else {
        setError(data.message || "Failed to update watch model");
        toast.error(data.message || "Failed to update watch model");
      }
    } catch (error) {
      console.error("Error updating watch model:", error);
      setError("An error occurred while updating the watch model");
      toast.error("An error occurred while updating the watch model");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Watch Model</h1>
          <p className="text-gray-600 mt-1">{formData.name}</p>
        </div>
        <Link
          href="/admin/models"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Submariner"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                name="brandId"
                value={formData.brandId}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Prefix
              </label>
              <input
                type="text"
                name="referencePrefix"
                value={formData.referencePrefix}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 126610"
              />
              <p className="mt-1 text-xs text-gray-500">
                Common reference number prefix for this model
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                Models with lower numbers will appear first
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the model"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Common Case Sizes
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={caseSizeInput}
                  onChange={(e) => setCaseSizeInput(e.target.value)}
                  className="flex-grow rounded-l-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 41mm"
                />
                <button
                  type="button"
                  onClick={addCaseSize}
                  className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              {formData.commonCaseSizes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.commonCaseSizes.map((size, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center"
                    >
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => removeCaseSize(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Common case sizes for this model
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Common Materials
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={materialInput}
                  onChange={(e) => setMaterialInput(e.target.value)}
                  className="flex-grow rounded-l-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Stainless Steel"
                />
                <button
                  type="button"
                  onClick={addMaterial}
                  className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              {formData.commonMaterials.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.commonMaterials.map((material, index) => (
                    <div
                      key={index}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-md flex items-center"
                    >
                      <span>{material}</span>
                      <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Common case materials for this model
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model Image
              </label>
              <div className="flex items-center">
                <div className="mr-4">
                  {formData.image ? (
                    <div className="relative h-20 w-20 border rounded-md overflow-hidden">
                      <Image
                        src={formData.image}
                        alt="Model Image"
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, image: "" }))
                        }
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-md p-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="h-20 w-20 bg-gray-100 border rounded-md flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 ${
                      uploading
                        ? "bg-gray-200 cursor-wait"
                        : "bg-white hover:bg-gray-50"
                    } focus:outline-none`}
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                    disabled={uploading}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    JPEG, PNG, WEBP or SVG. Max 2MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="featured"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Featured Model
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="active"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                submitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none`}
            >
              {submitting ? "Saving..." : "Update Model"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

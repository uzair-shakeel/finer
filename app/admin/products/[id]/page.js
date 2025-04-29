"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Price History Modal Component
const PriceHistoryModal = ({ isOpen, onClose, priceHistory }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Price History</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
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
        <div className="p-4 max-h-96 overflow-y-auto">
          {priceHistory && priceHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {priceHistory
                    .slice()
                    .reverse()
                    .map((entry, index) => (
                      <tr
                        key={index}
                        className={index === 0 ? "bg-blue-50" : ""}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(entry.date).toLocaleDateString()}{" "}
                            {new Date(entry.date).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            £{entry.price}
                            {index === 0 && (
                              <span className="ml-2 text-xs text-blue-600 font-medium">
                                (Current)
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No price history available</p>
          )}
        </div>
        <div className="p-4 border-t text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EditProduct({ params }) {
  const router = useRouter();
  const { id } = params;

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    reference: "",
    year: "",
    condition: {
      hasBox: false,
      hasPapers: false,
    },
    price: "",
    originalPrice: "",
    discount: 0,
    description: "",
    pageTitle: "",
    imageUrl: "",
    backsideImageUrl: "",
    additionalImages: [],
    status: "draft",
    featured: false,
    priceHistory: [],
    // Specification fields
    itemCode: "",
    caseSize: [],
    caseMaterial: [],
    dialColour: [],
    bracelet: [],
    movement: [],
    waterResistance: false,
    depth: "",
    depthCustom: "",
    braceletLength: "",
    extra: "",
    purchasePrice: "",
    serialNumber: "",
    notes: "",
  });

  const [allImages, setAllImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPriceHistoryModalOpen, setIsPriceHistoryModalOpen] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`, {
          headers: {
            "x-is-admin": "true",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        if (data.success && data.product) {
          const product = data.product;

          // Initialize form data with product data
          setFormData({
            brand: product.brand || "",
            model: product.model || "",
            reference: product.reference || "",
            year: product.year || "",
            condition: product.condition || {
              hasBox: false,
              hasPapers: false,
              status: "Good",
              details: "",
            },
            price: product.price || "",
            discountedPrice: product.discountedPrice || "",
            originalPrice: product.originalPrice || "",
            discount: product.discount || 0,
            rrpStatus: product.rrpStatus || "Regular",
            description: product.description || "",
            subdescription: product.subdescription || "",
            pageTitle: product.pageTitle || "",
            imageUrl: product.imageUrl || "",
            backsideImageUrl: product.backsideImageUrl || "",
            additionalImages: product.additionalImages || [],
            status: product.status || "draft",
            featured: product.featured || false,
            itemCode: product.itemCode || "",
            caseSize: product.caseSize
              ? typeof product.caseSize === "string"
                ? [product.caseSize]
                : product.caseSize
              : [],
            caseMaterial: product.caseMaterial
              ? typeof product.caseMaterial === "string"
                ? [product.caseMaterial]
                : product.caseMaterial
              : [],
            dialColour: product.dialColour
              ? typeof product.dialColour === "string"
                ? [product.dialColour]
                : product.dialColour
              : [],
            bracelet: product.bracelet
              ? typeof product.bracelet === "string"
                ? [product.bracelet]
                : product.bracelet
              : [],
            braceletLength: product.braceletLength || "",
            movement: product.movement
              ? typeof product.movement === "string"
                ? [product.movement]
                : product.movement
              : [],
            waterResistance: product.waterResistance || false,
            depth: product.depth || "100m",
            depthCustom: product.depthCustom || "",
            extra: product.extra || "",
            purchasePrice: product.purchasePrice || "",
            serialNumber: product.serialNumber || "",
            priceHistory: product.priceHistory || [],
            notes: product.notes || "",
          });

          // Build the initial allImages array from all image URLs in the product
          const imagesList = [
            product.imageUrl,
            ...(product.backsideImageUrl ? [product.backsideImageUrl] : []),
            ...(product.additionalImages?.map((img) => img.url) || []),
          ].filter(Boolean); // Remove any undefined or null values

          console.log("all list here", imagesList);
          setAllImages(imagesList);
        }
      } catch (error) {
        console.error("Fetch product error:", error);
        setError("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // We only need id in the dependency array since this effect only fetches data

  // Handle multi-select change
  const handleMultiSelectChange = (e, field) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({
      ...prev,
      [field]: options,
    }));
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "hasBox" || name === "hasPapers") {
      setFormData((prev) => ({
        ...prev,
        condition: {
          ...prev.condition,
          [name]: checked,
        },
      }));
      return;
    }

    // Handle the depth field
    if (name === "depth") {
      if (value === "Other") {
        setFormData((prev) => ({
          ...prev,
          depth: value,
          // Keep depthCustom as is
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          depth: value, // Store the selected depth value as a string
          depthCustom: "", // Clear custom depth when a predefined option is selected
        }));
      }
      return;
    }

    // Handle the depthCustom field
    if (name === "depthCustom") {
      setFormData((prev) => ({
        ...prev,
        depthCustom: value,
      }));
      return;
    }

    // Handle specification fields (caseSize, caseMaterial, dialColour, bracelet, movement)
    const specFields = [
      "caseSize",
      "caseMaterial",
      "dialColour",
      "bracelet",
      "movement",
    ];
    if (specFields.includes(name)) {
      if (value === "") {
        // If empty value, set as empty array
        setFormData((prev) => ({
          ...prev,
          [name]: [],
        }));
      } else {
        // Otherwise, set as array with single value
        setFormData((prev) => ({
          ...prev,
          [name]: [value],
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-calculate discount if price and originalPrice are provided
    if (
      (name === "price" || name === "originalPrice") &&
      formData.price &&
      formData.originalPrice
    ) {
      const price =
        name === "price" ? parseFloat(value) : parseFloat(formData.price);
      const originalPrice =
        name === "originalPrice"
          ? parseFloat(value)
          : parseFloat(formData.originalPrice);

      if (price && originalPrice && originalPrice > price) {
        const discount = Math.round(
          ((originalPrice - price) / originalPrice) * 100
        );
        setFormData((prev) => ({ ...prev, discount }));
      }
    }

    // If user entered a discount percentage, calculate discounted price
    if (name === "discount" && formData.price) {
      const priceNum = parseFloat(formData.price);
      const discount = parseFloat(value);

      if (
        !isNaN(discount) &&
        discount > 0 &&
        !isNaN(priceNum) &&
        priceNum > 0
      ) {
        // Calculate discounted price based on price and discount
        const newDiscountedPrice = Math.round(priceNum * (1 - discount / 100));
        if (newDiscountedPrice >= 0) {
          setFormData((prev) => ({
            ...prev,
            discountedPrice: newDiscountedPrice.toString(),
          }));
        }
      }
    }
  };

  // Set image as main (front) or backside image
  const setAsMainImage = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: imageUrl,
    }));
  };

  const setAsBacksideImage = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      backsideImageUrl: imageUrl,
    }));
  };

  // Move image up or down in order
  const moveImageUp = (index) => {
    if (index === 0) return; // Can't move the first image up

    setAllImages((prevImages) => {
      const newImages = [...prevImages];
      // Swap current image with the one above it
      [newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ];

      // Call updateAdditionalImagesOrder with the new image order
      setTimeout(() => updateAdditionalImagesOrder(newImages), 0);

      return newImages;
    });
  };

  const moveImageDown = (index) => {
    setAllImages((prevImages) => {
      if (index === prevImages.length - 1) return prevImages; // Can't move the last image down

      const newImages = [...prevImages];
      // Swap current image with the one below it
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];

      // Call updateAdditionalImagesOrder with the new image order
      setTimeout(() => updateAdditionalImagesOrder(newImages), 0);

      return newImages;
    });
  };

  // Update additionalImages with the new order
  const updateAdditionalImagesOrder = (images) => {
    const mainImage = formData.imageUrl;
    const backsideImage = formData.backsideImageUrl;

    // Filter out main and backside images, preserve the exact order from allImages
    const additionalImagesWithOrder = images
      .filter((img) => img !== mainImage && img !== backsideImage)
      .map((img, index) => ({
        url: img,
        order: index,
      }));

    console.log("Updating additional images order:", additionalImagesWithOrder);

    setFormData((prev) => ({
      ...prev,
      additionalImages: additionalImagesWithOrder,
    }));
  };

  // Remove image from collection
  const removeImage = (imageUrlToRemove) => {
    // Remove from allImages
    setAllImages((prev) => prev.filter((url) => url !== imageUrlToRemove));

    // Check if it was the main or backside image and reset those if needed
    if (formData.imageUrl === imageUrlToRemove) {
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    }

    if (formData.backsideImageUrl === imageUrlToRemove) {
      setFormData((prev) => ({ ...prev, backsideImageUrl: "" }));
    }

    // Also remove from additionalImages if present
    const updatedAdditionalImages = formData.additionalImages.filter(
      (url) => url !== imageUrlToRemove
    );
    setFormData((prev) => ({
      ...prev,
      additionalImages: updatedAdditionalImages,
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    if (allImages.length + files.length > 5) {
      setError("You can upload a maximum of 5 images per product");
      return;
    }

    setUploadingImage(true);

    try {
      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload image ${i + 1}`);
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      // Update all images
      const newAllImages = [...allImages, ...uploadedUrls];
      setAllImages(newAllImages);

      // Set the first image as main image if we don't have one yet
      if (!formData.imageUrl && uploadedUrls.length > 0) {
        setFormData((prev) => ({ ...prev, imageUrl: uploadedUrls[0] }));
      }

      // Set the second image as backside image if we don't have one yet
      if (!formData.backsideImageUrl && uploadedUrls.length > 1) {
        setFormData((prev) => ({ ...prev, backsideImageUrl: uploadedUrls[1] }));
      }

      // Add the rest to additionalImages
      const remainingImages = uploadedUrls.filter(
        (url) => url !== formData.imageUrl && url !== formData.backsideImageUrl
      );

      if (remainingImages.length > 0) {
        setFormData((prev) => ({
          ...prev,
          additionalImages: [...prev.additionalImages, ...remainingImages],
        }));
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setError("Failed to upload image(s). Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Update form data before submission to ensure correct structure
  const prepareFormDataForSubmission = () => {
    // Create a copy of the current formData
    const submissionData = { ...formData };

    // Make sure additionalImages doesn't include main or backside images
    submissionData.additionalImages = allImages.filter(
      (url) =>
        url !== submissionData.imageUrl &&
        url !== submissionData.backsideImageUrl
    );

    // Process depth field - if "Other" is selected, use the custom depth value
    if (submissionData.depth === "Other" && submissionData.depthCustom) {
      submissionData.depth = submissionData.depthCustom;
    }

    // Ensure waterResistance is a boolean
    submissionData.waterResistance = !!submissionData.waterResistance;

    // Convert specification fields to strings for MongoDB
    const specFields = [
      "caseSize",
      "caseMaterial",
      "dialColour",
      "bracelet",
      "movement",
    ];

    specFields.forEach((field) => {
      // Convert arrays to strings (joined with comma)
      if (Array.isArray(submissionData[field])) {
        submissionData[field] = submissionData[field]
          .filter(Boolean)
          .join(", ");
      } else if (!submissionData[field]) {
        submissionData[field] = "";
      } else {
        // Ensure any non-arrays are converted to strings
        submissionData[field] = submissionData[field].toString();
      }
    });

    return submissionData;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that we have at least one image
    if (!formData.imageUrl) {
      setError("Please select a main image for the product");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const submissionData = prepareFormDataForSubmission();

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update product");
      }

      // Redirect to products list
      router.push("/admin/products");
    } catch (error) {
      console.error("Update product error:", error);
      setError(error.message);
      setSubmitting(false);
    }
  };

  // Open the price history modal
  const openPriceHistoryModal = () => {
    setIsPriceHistoryModalOpen(true);
  };

  // Close the price history modal
  const closePriceHistoryModal = () => {
    setIsPriceHistoryModalOpen(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-4 text-lg text-gray-600">Loading product data...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Price History Modal */}
      <PriceHistoryModal
        isOpen={isPriceHistoryModalOpen}
        onClose={closePriceHistoryModal}
        priceHistory={formData.priceHistory}
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-gray-600 mt-1">
            {formData.brand} {formData.model}
          </p>
        </div>

        <Link
          href="/admin/products"
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

      <div className="bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Private CRM Fields */}
            <div className="space-y-4 md:col-span-2">
              <h2 className="text-xl font-bold border-b-2 border-blue-500 pb-2 mb-4 text-blue-700">
                Private CRM Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Price
                  </label>
                  <input
                    type="text"
                    name="purchasePrice"
                    value={formData.purchasePrice || ""}
                    onChange={handleChange}
                    placeholder="Purchase price"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Internal information - not shown to customers
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber || ""}
                    onChange={handleChange}
                    placeholder="Serial number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Internal information - not shown to customers
                  </p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-4 md:col-span-2">
              <h2 className="text-xl font-bold border-b-2 border-blue-500 pb-2 mb-4 text-blue-700">
                Content
              </h2>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="pageTitle"
                >
                  Page Title
                </label>
                <input
                  type="text"
                  id="pageTitle"
                  name="pageTitle"
                  value={formData.pageTitle || ""}
                  onChange={handleChange}
                  placeholder="e.g. Rolex Submariner 126610LN | Luxury Dive Watch"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Used for SEO and browser tab title
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                  placeholder="Detailed product description shown on the product page"
                ></textarea>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="subdescription"
                >
                  Subdescription
                </label>
                <textarea
                  id="subdescription"
                  name="subdescription"
                  value={formData.subdescription || ""}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Optional shorter description for cards and previews"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                ></textarea>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="notes"
                >
                  Notes (Private)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                  placeholder="Enter private notes (not visible to customers)"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  Internal notes for staff only - not shown to customers
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold border-b-2 border-blue-500 pb-2 mb-4 text-blue-700">
                Basic Information
              </h2>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="itemCode"
                >
                  Item Code
                </label>
                <input
                  type="text"
                  id="itemCode"
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Unique identifier for this product
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="serialNumber"
                >
                  Serial Number
                </label>
                <input
                  type="text"
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Watch serial number"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                />
                <p className="mt-1 text-xs text-gray-500">
                  For internal use only - not shown to customers
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="brand"
                >
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="model"
                >
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="reference"
                >
                  Reference
                </label>
                <input
                  type="text"
                  id="reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="year"
                >
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <div className="flex space-x-4 items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasBox"
                      name="hasBox"
                      checked={formData.condition?.hasBox || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="hasBox"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Box
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasPapers"
                      name="hasPapers"
                      checked={formData.condition?.hasPapers || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="hasPapers"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Papers
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold border-b-2 border-blue-500 pb-2 mb-4 text-blue-700">
                Pricing
              </h2>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="purchasePrice"
                >
                  Cost (Purchase Price)
                </label>
                <input
                  type="text"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice || ""}
                  onChange={handleChange}
                  placeholder="e.g. 10000"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Internal price - not shown to customers
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="price"
                >
                  Price (Selling Price) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 12500"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="originalPrice"
                >
                  RRP (Recommended Retail Price)
                </label>
                <input
                  type="text"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="e.g. 13000"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="discountedPrice"
                >
                  Discounted Price
                </label>
                <input
                  type="text"
                  id="discountedPrice"
                  name="discountedPrice"
                  value={formData.discountedPrice || ""}
                  onChange={handleChange}
                  placeholder="Auto-calculated from discount"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="discount"
                >
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                />
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4 md:col-span-2">
              <h2 className="text-xl font-bold border-b-2 border-blue-500 pb-2 mb-4 text-blue-700">
                Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Case Size
                  </label>
                  <select
                    name="caseSize"
                    value={
                      formData.caseSize?.length > 0 ? formData.caseSize[0] : ""
                    }
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select case size</option>
                    <option value="20mm">20mm</option>
                    <option value="22mm">22mm</option>
                    <option value="24mm">24mm</option>
                    <option value="26mm">26mm</option>
                    <option value="28mm">28mm</option>
                    <option value="30mm">30mm</option>
                    <option value="32mm">32mm</option>
                    <option value="34mm">34mm</option>
                    <option value="36mm">36mm</option>
                    <option value="38mm">38mm</option>
                    <option value="40mm">40mm</option>
                    <option value="41mm">41mm</option>
                    <option value="42mm">42mm</option>
                    <option value="43mm">43mm</option>
                    <option value="44mm">44mm</option>
                    <option value="45mm">45mm</option>
                    <option value="46mm">46mm</option>
                    <option value="47mm">47mm</option>
                    <option value="48mm">48mm</option>
                    <option value="49mm">49mm</option>
                    <option value="50mm">50mm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Case Material
                  </label>
                  <select
                    name="caseMaterial"
                    value={
                      formData.caseMaterial?.length > 0
                        ? formData.caseMaterial[0]
                        : ""
                    }
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select case material</option>
                    <option value="Stainless Steel">Stainless Steel</option>
                    <option value="Yellow Gold">Yellow Gold</option>
                    <option value="White Gold">White Gold</option>
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Titanium">Titanium</option>
                    <option value="Ceramic">Ceramic</option>
                    <option value="Carbon Fiber">Carbon Fiber</option>
                    <option value="Bronze">Bronze</option>
                    <option value="PVD">PVD</option>
                    <option value="Two-Tone">Two-Tone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dial Colour
                  </label>
                  <select
                    name="dialColour"
                    value={
                      formData.dialColour?.length > 0
                        ? formData.dialColour[0]
                        : ""
                    }
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select dial colour</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Silver">Silver</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Red">Red</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Orange">Orange</option>
                    <option value="Brown">Brown</option>
                    <option value="Purple">Purple</option>
                    <option value="Pink">Pink</option>
                    <option value="Grey">Grey</option>
                    <option value="Champagne">Champagne</option>
                    <option value="Mother of Pearl">Mother of Pearl</option>
                    <option value="Meteorite">Meteorite</option>
                    <option value="Skeleton">Skeleton</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bracelet
                  </label>
                  <select
                    name="bracelet"
                    value={
                      formData.bracelet?.length > 0 ? formData.bracelet[0] : ""
                    }
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select bracelet</option>
                    <option value="Stainless Steel">Stainless Steel</option>
                    <option value="Leather">Leather</option>
                    <option value="Rubber">Rubber</option>
                    <option value="NATO">NATO</option>
                    <option value="Oyster (Rolex)">Oyster (Rolex)</option>
                    <option value="Jubilee (Rolex)">Jubilee (Rolex)</option>
                    <option value="President (Rolex)">President (Rolex)</option>
                    <option value="Pearlmaster (Rolex)">
                      Pearlmaster (Rolex)
                    </option>
                    <option value="Santos (Cartier)">Santos (Cartier)</option>
                    <option value="Ballon Bleu (Cartier)">
                      Ballon Bleu (Cartier)
                    </option>
                    <option value="Speedmaster (Omega)">
                      Speedmaster (Omega)
                    </option>
                    <option value="Seamaster (Omega)">Seamaster (Omega)</option>
                    <option value="Flat Link (Omega)">Flat Link (Omega)</option>
                    <option value="Professional (Breitling)">
                      Professional (Breitling)
                    </option>
                    <option value="Pilot (Breitling)">Pilot (Breitling)</option>
                    <option value="Navitimer (Breitling)">
                      Navitimer (Breitling)
                    </option>
                    <option value="Big Bang Integrated (Hublot)">
                      Big Bang Integrated (Hublot)
                    </option>
                    <option value="Royal Oak (Audemars Piguet)">
                      Royal Oak (Audemars Piguet)
                    </option>
                    <option value="Royal Oak Offshore (Audemars Piguet)">
                      Royal Oak Offshore (Audemars Piguet)
                    </option>
                    <option value="Nautilus (Patek Philippe)">
                      Nautilus (Patek Philippe)
                    </option>
                    <option value="Aquanaut (Patek Philippe)">
                      Aquanaut (Patek Philippe)
                    </option>
                    <option value="Overseas (Vacheron Constantin)">
                      Overseas (Vacheron Constantin)
                    </option>
                    <option value="Polaris (Jaeger-LeCoultre)">
                      Polaris (Jaeger-LeCoultre)
                    </option>
                    <option value="Reverso (Jaeger-LeCoultre)">
                      Reverso (Jaeger-LeCoultre)
                    </option>
                    <option value="Milanese">Milanese</option>
                    <option value="Fabric">Fabric</option>
                    <option value="Gold">Gold</option>
                    <option value="Titanium">Titanium</option>
                    <option value="Ceramic">Ceramic</option>
                    <option value="Two-Tone">Two-Tone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Movement
                  </label>
                  <select
                    name="movement"
                    value={
                      formData.movement?.length > 0 ? formData.movement[0] : ""
                    }
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select movement</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="Quartz">Quartz</option>
                    <option value="Solar">Solar</option>
                    <option value="Kinetic">Kinetic</option>
                    <option value="Spring Drive">Spring Drive</option>
                    <option value="Co-Axial">Co-Axial</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="In-House">In-House</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Water Resistance
                  </label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="waterResistance"
                        checked={formData.waterResistance === true}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            waterResistance: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">
                        Water Resistant
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Depth Rating
                  </label>
                  <div className="mt-2">
                    <select
                      name="depth"
                      value={formData.depth || ""}
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Not specified</option>
                      <option value="30m">30m</option>
                      <option value="50m">50m</option>
                      <option value="100m">100m</option>
                      <option value="200m">200m</option>
                      <option value="300m">300m</option>
                      <option value="Other">Other (custom)</option>
                    </select>

                    {formData.depth === "Other" && (
                      <input
                        type="text"
                        name="depthCustom"
                        value={formData.depthCustom || ""}
                        onChange={handleChange}
                        placeholder="Enter custom depth (e.g., 150m)"
                        className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bracelet Length
                  </label>
                  <input
                    type="text"
                    name="braceletLength"
                    value={formData.braceletLength || ""}
                    onChange={handleChange}
                    placeholder="e.g. 20cm"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4 md:col-span-2">
              <h2 className="text-xl font-bold border-b-2 border-blue-500 pb-2 mb-4 text-blue-700">
                Images{" "}
                <span className="text-sm font-normal">(Max 5 images)</span>
              </h2>

              <div className="mb-5">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                      multiple
                    />
                    <label
                      htmlFor="imageUpload"
                      className="cursor-pointer py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      {uploadingImage ? "Uploading..." : "Upload Images"}
                    </label>
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    JPG, PNG, or WEBP. Max 5 images. You must select front and
                    back images.
                  </p>
                </div>

                {/* Image Gallery */}
                {allImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    {allImages.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative border rounded-md p-2 bg-gray-50"
                      >
                        <Image
                          src={imageUrl}
                          alt={`Product image ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-32 object-contain mb-2"
                        />

                        <div className="flex flex-col space-y-1 mt-2">
                          <button
                            type="button"
                            onClick={() => setAsMainImage(imageUrl)}
                            className={`text-xs py-1 px-2 rounded-md ${
                              formData.imageUrl === imageUrl
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 hover:bg-blue-100"
                            }`}
                          >
                            {formData.imageUrl === imageUrl
                              ? "Front Image ✓"
                              : "Set as Front"}
                          </button>

                          {/* <button
                            type="button"
                            onClick={() => setAsBacksideImage(imageUrl)}
                            className={`text-xs py-1 px-2 rounded-md ${
                              formData.backsideImageUrl === imageUrl
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 hover:bg-green-100"
                            }`}
                          >
                            {formData.backsideImageUrl === imageUrl
                              ? "Back Image ✓"
                              : "Set as Back"}
                          </button> */}

                          <div className="flex space-x-1 mt-1">
                            <button
                              type="button"
                              onClick={() => moveImageUp(index)}
                              disabled={index === 0}
                              className={`flex-1 text-xs py-1 px-2 rounded-md ${
                                index === 0
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                              }`}
                            >
                              ↑ Up
                            </button>

                            <button
                              type="button"
                              onClick={() => moveImageDown(index)}
                              disabled={index === allImages.length - 1}
                              className={`flex-1 text-xs py-1 px-2 rounded-md ${
                                index === allImages.length - 1
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                              }`}
                            >
                              ↓ Down
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeImage(imageUrl)}
                            className="text-xs py-1 px-2 rounded-md bg-red-100 hover:bg-red-200 text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {allImages.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      No images uploaded yet
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Click Upload Images to add product photos
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4 md:col-span-2">
              <h2 className="text-xl font-bold border-b-2 border-blue-500 pb-2 mb-4 text-blue-700">
                Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="live">Live</option>
                    <option value="archive">Archive</option>
                    <option value="sold_out">Sold Out</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Only &apos;Live&apos; products will be displayed on the
                    front-end
                  </p>
                </div>

                <div>
                  <div className="flex items-center h-full">
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
                      Featured Product
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Price History Button */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-blue-700">
                  Price History
                </h2>
                <button
                  type="button"
                  onClick={openPriceHistoryModal}
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Price History
                  {formData.priceHistory &&
                    formData.priceHistory.length > 0 && (
                      <span className="ml-2 bg-blue-500 text-xs rounded-full px-2 py-1">
                        {formData.priceHistory.length}
                      </span>
                    )}
                </button>
              </div>
              <div className="border-b-2 border-blue-500 pb-2 mb-4"></div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this product?"
                  )
                ) {
                  fetch(`/api/products/${id}`, { method: "DELETE" })
                    .then((response) => {
                      if (response.ok) {
                        router.push("/admin/products");
                      } else {
                        throw new Error("Failed to delete product");
                      }
                    })
                    .catch((error) => {
                      console.error("Delete product error:", error);
                      setError("Failed to delete product");
                    });
                }
              }}
              className="py-2 px-4 border border-red-300 text-red-600 rounded-md shadow-sm text-sm font-medium hover:bg-red-50 focus:outline-none"
            >
              Delete Product
            </button>

            <div className="flex space-x-3">
              <Link
                href="/admin/products"
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={submitting || uploadingImage}
              >
                {submitting ? "Saving..." : "Update Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

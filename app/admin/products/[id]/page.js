"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";

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
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log("Fetching product data...");
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
          console.log("Fetched product:", product);

          // Initialize form data with product data
          const formDataWithProduct = {
            brand: product.brand || "",
            brandId: product.brandId ? product.brandId.toString() : "",
            model: product.model || "",
            modelId: product.modelId ? product.modelId.toString() : "",
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
          };

          console.log("Setting form data:", formDataWithProduct);
          setFormData(formDataWithProduct);

          // If we have a brandId, fetch the models for that brand
          if (product.brandId) {
            console.log("Fetching models for brand:", product.brandId);
            fetchModelsByBrand(product.brandId.toString());
          }

          // Build the initial allImages array from all image URLs in the product
          const imagesList = [
            product.imageUrl,
            ...(product.backsideImageUrl ? [product.backsideImageUrl] : []),
            ...(product.additionalImages?.map((img) => img.url) || []),
          ].filter(Boolean);

          setAllImages(imagesList);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product data");
        toast.error("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Add useEffect to fetch brands when component mounts
  useEffect(() => {
    fetchBrands();
  }, []);

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

    // Handle brand selection
    if (name === "brandId" && value) {
      console.log("Brand selected:", value);
      console.log("Available brands:", brands);
      fetchModelsByBrand(value);

      const selectedBrand = brands.find((brand) => brand._id === value);
      console.log("Selected brand:", selectedBrand);

      // Reset model when brand changes
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        modelId: "",
        // Keep the brand name for backward compatibility
        brand: selectedBrand?.name || "",
      }));
      return;
    }

    // Handle model selection
    if (name === "modelId" && value) {
      const selectedModel = models.find((model) => model._id === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        // Keep the model name for backward compatibility
        model: selectedModel?.name || "",
        // If the model has common case sizes, use the first one
        ...(selectedModel?.commonCaseSizes?.length > 0 && {
          caseSize: [selectedModel.commonCaseSizes[0]],
        }),
        // If the model has common materials, use the first one
        ...(selectedModel?.commonMaterials?.length > 0 && {
          caseMaterial: [selectedModel.commonMaterials[0]],
        }),
        // If the model has a reference prefix, use it
        ...(selectedModel?.referencePrefix && {
          reference: selectedModel.referencePrefix,
        }),
      }));
      return;
    }

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

    // Handle conditionStatus field
    if (name === "conditionStatus") {
      setFormData((prev) => ({
        ...prev,
        condition: {
          ...prev.condition,
          status: value,
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

    // Price relationship logic
    if (name === "price" || name === "discountedPrice" || name === "discount") {
      const updatedForm = {
        ...formData,
        [name]: value,
      };

      // Get numeric values
      const price = parseFloat(name === "price" ? value : formData.price) || 0;
      const discountedPrice =
        parseFloat(
          name === "discountedPrice" ? value : formData.discountedPrice
        ) || 0;
      const discountPercentage =
        parseFloat(name === "discount" ? value : formData.discount) || 0;

      // Case 1: User entered price and discount percentage - calculate discounted price
      if (name === "price" || name === "discount") {
        if (price > 0 && discountPercentage > 0) {
          const calculatedDiscountedPrice = Math.round(
            price * (1 - discountPercentage / 100)
          );
          setFormData((prev) => ({
            ...prev,
            [name]: value,
            discountedPrice: calculatedDiscountedPrice.toString(),
            // Don't change originalPrice
          }));
          return;
        }
      }

      // Case 2: User entered price and discounted price - calculate discount percentage
      if (
        (name === "price" || name === "discountedPrice") &&
        price > 0 &&
        discountedPrice > 0 &&
        price > discountedPrice
      ) {
        const calculatedDiscount = Math.round(
          ((price - discountedPrice) / price) * 100
        );
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          discount: calculatedDiscount.toString(),
          // Don't change originalPrice
        }));
        return;
      }

      // If just changing the price and no discount applied yet
      if (name === "price" && (!discountedPrice || discountedPrice <= 0)) {
        setFormData((prev) => ({
          ...prev,
          price: value,
          // Don't automatically update originalPrice when price changes
        }));
        return;
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

    // Ensure the condition object is properly structured
    if (!submissionData.condition) {
      submissionData.condition = {
        hasBox: false,
        hasPapers: false,
        status: "Good",
        details: "",
      };
    } else {
      // Make sure all condition fields are present
      submissionData.condition = {
        hasBox: !!submissionData.condition.hasBox,
        hasPapers: !!submissionData.condition.hasPapers,
        status: submissionData.condition.status || "Good",
        details: "",
      };
    }

    // Process price fields to ensure consistency
    const price = parseFloat(submissionData.price) || 0;
    const discountedPrice = parseFloat(submissionData.discountedPrice) || 0;
    const discount = parseFloat(submissionData.discount) || 0;

    // Make sure price is always set
    submissionData.price = price.toString();

    // Handle discounted price logic
    if (discountedPrice > 0 && discountedPrice < price) {
      // If discounted price is set and valid, use it
      submissionData.discountedPrice = discountedPrice.toString();

      // Calculate the discount percentage if it's not already set
      if (!discount) {
        submissionData.discount = Math.round(
          ((price - discountedPrice) / price) * 100
        ).toString();
      } else {
        submissionData.discount = discount.toString();
      }
    } else if (discount > 0 && discount <= 100) {
      // If discount percentage is set, calculate the discounted price
      submissionData.discountedPrice = Math.round(
        price * (1 - discount / 100)
      ).toString();
      submissionData.discount = discount.toString();
    } else {
      // If no valid discount or discounted price, clear these fields
      submissionData.discountedPrice = "0";
      submissionData.discount = "0";
    }

    // Ensure originalPrice is always set (used for RRP display)
    if (
      !submissionData.originalPrice ||
      parseFloat(submissionData.originalPrice) <= 0
    ) {
      submissionData.originalPrice = price.toString();
    } else {
      // Make sure originalPrice is also a string
      submissionData.originalPrice = parseFloat(
        submissionData.originalPrice
      ).toString();
    }

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

  // Add this function to fetch brands
  const fetchBrands = async () => {
    try {
      setLoadingBrands(true);
      console.log("Fetching brands...");
      const response = await fetch("/api/brands");
      const data = await response.json();

      if (data.success) {
        console.log("Fetched brands:", data.data);
        setBrands(data.data);
      } else {
        console.error("Failed to fetch brands:", data.message);
        toast.error("Failed to fetch brands");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Error fetching brands");
    } finally {
      setLoadingBrands(false);
    }
  };

  // Add this function to fetch models based on selected brand
  const fetchModelsByBrand = async (brandId) => {
    if (!brandId) {
      setModels([]);
      return;
    }

    try {
      setLoadingModels(true);
      const response = await fetch(`/api/models?brandId=${brandId}`);
      const data = await response.json();

      if (data.success) {
        // Only show active models
        const activeModels = data.data.filter((model) => model.active);
        setModels(activeModels);
      } else {
        console.error("Failed to fetch models:", data.message);
        toast.error("Failed to fetch models");
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      toast.error("Error fetching models");
    } finally {
      setLoadingModels(false);
    }
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

                <div className="md:col-span-2">
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
                  htmlFor="brand"
                >
                  Brand <span className="text-red-500">*</span>
                </label>
                <select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                >
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="model"
                >
                  Model <span className="text-red-500">*</span>
                </label>
                <select
                  name="modelId"
                  value={formData.modelId}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                >
                  <option value="">Select model</option>
                  {models.map((model) => (
                    <option key={model._id} value={model._id}>
                      {model.name}
                    </option>
                  ))}
                </select>
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
                  Condition Information
                </label>
                <div className="border border-gray-300 rounded-md p-3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Condition Status
                    </label>
                    <div className="relative">
                      <select
                        name="conditionStatus"
                        value={formData.condition?.status || "Good"}
                        onChange={handleChange}
                        className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2 appearance-none pr-10"
                      >
                        <option value="New">New</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Very Good">Very Good</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Select the overall condition of the watch
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Accessories
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
                  htmlFor="price"
                >
                  Price (£)
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
                <p className="text-sm text-gray-500 mt-1">Main selling price</p>
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
                <p className="text-sm text-gray-500 mt-1">
                  Manufacturer recommended price (shown as RRP)
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="discountedPrice"
                >
                  Discounted Price (£)
                </label>
                <input
                  type="text"
                  id="discountedPrice"
                  name="discountedPrice"
                  value={formData.discountedPrice || ""}
                  onChange={handleChange}
                  placeholder="e.g. 11500"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.discountedPrice && formData.price
                    ? `Savings: £${Math.max(
                        0,
                        parseFloat(formData.price) -
                          parseFloat(formData.discountedPrice)
                      ).toFixed(0)}`
                    : "Enter a value or it will be auto-calculated from discount %"}
                </p>
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
                  placeholder="e.g. 15"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.discount > 0
                    ? `Will show strikethrough price with ${formData.discount}% off`
                    : "Enter a percentage discount to automatically calculate discounted price"}
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showRRP"
                  name="rrpStatus"
                  checked={formData.rrpStatus !== "Hidden"}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      rrpStatus: e.target.checked ? "Regular" : "Hidden",
                    }));
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="showRRP"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Display RRP on product page
                </label>
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
                  <div className="relative">
                    <select
                      name="caseSize"
                      value={
                        formData.caseSize?.length > 0
                          ? formData.caseSize[0]
                          : ""
                      }
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-8"
                    >
                      <option value="">Select case size</option>
                      <optgroup label="Small Sizes (20-30mm)">
                        <option value="20mm">20mm - Extra Small</option>
                        <option value="22mm">22mm - Very Small</option>
                        <option value="24mm">24mm - Very Small</option>
                        <option value="26mm">26mm - Small</option>
                        <option value="28mm">28mm - Small</option>
                        <option value="30mm">30mm - Small</option>
                      </optgroup>
                      <optgroup label="Medium Sizes (32-38mm)">
                        <option value="32mm">32mm - Medium Small</option>
                        <option value="34mm">34mm - Medium Small</option>
                        <option value="36mm">36mm - Medium</option>
                        <option value="38mm">38mm - Medium</option>
                      </optgroup>
                      <optgroup label="Standard Sizes (40-42mm)">
                        <option value="40mm">40mm - Standard</option>
                        <option value="41mm">41mm - Standard</option>
                        <option value="42mm">42mm - Standard</option>
                      </optgroup>
                      <optgroup label="Large Sizes (43-46mm)">
                        <option value="43mm">43mm - Large</option>
                        <option value="44mm">44mm - Large</option>
                        <option value="45mm">45mm - Large</option>
                        <option value="46mm">46mm - Large</option>
                      </optgroup>
                      <optgroup label="Extra Large Sizes (47-50mm+)">
                        <option value="47mm">47mm - Extra Large</option>
                        <option value="48mm">48mm - Extra Large</option>
                        <option value="49mm">49mm - Extra Large</option>
                        <option value="50mm">50mm - Extra Large</option>
                      </optgroup>
                      <optgroup label="Custom Size">
                        <option value="custom">
                          Custom Size (Specify in notes)
                        </option>
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Select the watch case diameter
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Case Material
                  </label>
                  <div className="relative">
                    <select
                      name="caseMaterial"
                      value={
                        formData.caseMaterial?.length > 0
                          ? formData.caseMaterial[0]
                          : ""
                      }
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-8"
                    >
                      <option value="">Select case material</option>
                      <optgroup label="Standard Materials">
                        <option value="Stainless Steel">Stainless Steel</option>
                        <option value="Titanium">Titanium</option>
                        <option value="Ceramic">Ceramic</option>
                        <option value="Tantalum">Tantalum</option>
                      </optgroup>
                      <optgroup label="Precious Metals">
                        <option value="Yellow Gold">Yellow Gold</option>
                        <option value="Rose Gold">Rose Gold</option>
                        <option value="Pink Gold">Pink Gold</option>
                        <option value="White Gold">White Gold</option>
                        <option value="Platinum">Platinum</option>
                      </optgroup>
                      <optgroup label="Advanced Materials">
                        <option value="Carbon Fiber">Carbon Fiber</option>
                        <option value="Sapphire Crystal">
                          Sapphire Crystal
                        </option>
                        <option value="Cermet">Cermet</option>
                        <option value="ADLC">
                          ADLC (Amorphous Diamond-Like Carbon)
                        </option>
                        <option value="DLC">DLC (Diamond-Like Carbon)</option>
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Select the primary material used for the watch case
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dial Colour
                  </label>
                  <div className="relative">
                    <select
                      name="dialColour"
                      value={
                        formData.dialColour?.length > 0
                          ? formData.dialColour[0]
                          : ""
                      }
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-8"
                    >
                      <option value="">Select dial colour</option>
                      <optgroup label="Neutral Tones">
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Silver">Silver</option>
                        <option value="Grey">Grey</option>
                        <option value="Champagne">Champagne</option>
                      </optgroup>
                      <optgroup label="Primary Colors">
                        <option value="Blue">Blue</option>
                        <option value="Green">Green</option>
                        <option value="Red">Red</option>
                        <option value="Yellow">Yellow</option>
                      </optgroup>
                      <optgroup label="Other Colors">
                        <option value="Orange">Orange</option>
                        <option value="Brown">Brown</option>
                        <option value="Purple">Purple</option>
                        <option value="Pink">Pink</option>
                      </optgroup>
                      <optgroup label="Special Dials">
                        <option value="Mother of Pearl">Mother of Pearl</option>
                        <option value="Meteorite">Meteorite</option>
                        <option value="Skeleton">Skeleton</option>
                        <option value="Textured">Textured</option>
                        <option value="Sunburst">Sunburst</option>
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Select the primary color of the watch face
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bracelet
                  </label>
                  <div className="relative">
                    <select
                      name="bracelet"
                      value={
                        formData.bracelet?.length > 0
                          ? formData.bracelet[0]
                          : ""
                      }
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-8"
                    >
                      <option value="">Select bracelet type</option>
                      <optgroup label="Standard Materials">
                        <option value="Leather">Leather</option>
                        <option value="Rubber">Rubber</option>
                        <option value="Fabric">Fabric</option>
                      </optgroup>
                      <optgroup label="Rolex Bracelet Types">
                        <option value="Flat Jubilee (Rolex)">
                          Flat Jubilee
                        </option>
                        <option value="Jubilee (Rolex)">Jubilee</option>
                        <option value="President (Rolex)">President</option>
                        <option value="Pearlmaster (Rolex)">Pearlmaster</option>
                        <option value="Oysterflex (Rolex)">Oysterflex</option>
                        <option value="Oyster (Rolex)">Oyster</option>
                      </optgroup>
                      <optgroup label="Omega Bracelet Types">
                        <option value="Speedmaster (Omega)">Speedmaster</option>
                        <option value="Seamaster (Omega)">Seamaster</option>
                        <option value="Flat Link (Omega)">Flat Link</option>
                      </optgroup>
                      <optgroup label="Other Brand Bracelet Types">
                        <option value="Santos (Cartier)">
                          Santos (Cartier)
                        </option>
                        <option value="Ballon Bleu (Cartier)">
                          Ballon Bleu (Cartier)
                        </option>
                        <option value="Professional (Breitling)">
                          Professional (Breitling)
                        </option>
                        <option value="Pilot (Breitling)">
                          Pilot (Breitling)
                        </option>
                        <option value="Navitimer (Breitling)">
                          Navitimer (Breitling)
                        </option>
                        <option value="Big Bang Integrated (Hublot)">
                          Big Bang Integrated (Hublot)
                        </option>
                        <option value="Royal Oak (Audemars Piguet)">
                          Royal Oak (AP)
                        </option>
                        <option value="Royal Oak Offshore (Audemars Piguet)">
                          Royal Oak Offshore (AP)
                        </option>
                        <option value="Nautilus (Patek Philippe)">
                          Nautilus (Patek)
                        </option>
                        <option value="Aquanaut (Patek Philippe)">
                          Aquanaut (Patek)
                        </option>
                        <option value="Overseas (Vacheron Constantin)">
                          Overseas (VC)
                        </option>
                        <option value="Polaris (Jaeger-LeCoultre)">
                          Polaris (JLC)
                        </option>
                        <option value="Reverso (Jaeger-LeCoultre)">
                          Reverso (JLC)
                        </option>
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Select the bracelet or strap type
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Movement
                  </label>
                  <div className="relative">
                    <select
                      name="movement"
                      value={
                        formData.movement?.length > 0
                          ? formData.movement[0]
                          : ""
                      }
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-8"
                    >
                      <option value="">Select movement type</option>
                      <optgroup label="Mechanical Movements">
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual (Hand-wound)</option>
                        <option value="Mechanical">Mechanical (General)</option>
                        <option value="In-House">In-House Movement</option>
                      </optgroup>
                      <optgroup label="Quartz Movements">
                        <option value="Quartz">Quartz (Battery)</option>
                        <option value="Solar">Solar Powered</option>
                        <option value="Kinetic">Kinetic (Self-charging)</option>
                      </optgroup>
                      <optgroup label="Specialty Movements">
                        <option value="Spring Drive">
                          Spring Drive (Seiko/Grand Seiko)
                        </option>
                        <option value="Co-Axial">Co-Axial (Omega)</option>
                        <option value="Chronometer">
                          COSC Certified Chronometer
                        </option>
                        <option value="Tourbillon">Tourbillon</option>
                        <option value="Perpetual Calendar">
                          Perpetual Calendar
                        </option>
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Select the watches movement mechanism
                  </p>
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
                    <option value="in_stock">In Stock</option>
                    <option value="reserved">Reserved</option>
                    <option value="archive">Archive</option>
                    <option value="sold_out">Sold Out</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Only &apos;Live&apos; and &apos;In Stock&apos; products will
                    be displayed on the front-end
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

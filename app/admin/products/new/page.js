"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    reference: "",
    year: "",
    condition: {
      hasBox: false,
      hasPapers: false,
      status: "Good",
      details: "",
    },
    price: "",
    discountedPrice: "",
    originalPrice: "", // RRP
    discount: 0,
    rrpStatus: "Regular",
    description: "",
    subdescription: "",
    pageTitle: "",
    imageUrl: "",
    backsideImageUrl: "",
    additionalImages: [],
    status: "draft",
    featured: false,
    // Specification fields
    itemCode: "",
    caseSize: [],
    caseMaterial: [],
    dialColour: [],
    bracelet: [],
    braceletLength: "",
    movement: [],
    waterResistance: false,
    depth: "100m",
    depthCustom: "",
    // New fields
    extra: "",
    // Private CRM fields
    purchasePrice: "",
    serialNumber: "",
    notes: "",
  });

  const [allImages, setAllImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Autofill function for testing
  const autoFillTestData = () => {
    // Sample image URLs for testing
    const mainImageUrl =
      "https://res.cloudinary.com/dfudkmrpe/image/upload/v1713982613/finerlux-products/tkrfpqwdanvcxgjnpww2.jpg";
    const backsideImageUrl =
      "https://res.cloudinary.com/dfudkmrpe/image/upload/v1713982614/finerlux-products/vcrg41afnhmjqzqd6ozz.jpg";
    const additionalImageUrl1 =
      "https://res.cloudinary.com/dfudkmrpe/image/upload/v1713982614/finerlux-products/vwwuvkdw1k7dw2lrwgls.jpg";
    const additionalImageUrl2 =
      "https://res.cloudinary.com/dfudkmrpe/image/upload/v1713982614/finerlux-products/p7hzsv8qv5x6qoqn0pyk.jpg";
    const additionalImageUrl3 =
      "https://res.cloudinary.com/dfudkmrpe/image/upload/v1714084051/finerlux-products/ro4i7zrvtqunbq7vdxl0.jpg";

    // First update allImages state to include all sample images
    setAllImages((prev) => {
      const imagesToAdd = [
        mainImageUrl,
        backsideImageUrl,
        additionalImageUrl1,
        additionalImageUrl2,
        additionalImageUrl3,
      ];
      const newImages = [...prev];
      let imagesAdded = false;

      // Add any images that don't already exist in the array
      imagesToAdd.forEach((img) => {
        if (!newImages.includes(img)) {
          newImages.push(img);
          imagesAdded = true;
          console.log("Added image to allImages:", img);
        }
      });

      if (imagesAdded) {
        console.log("Updated allImages with sample images");
        return newImages;
      }
      return prev;
    });

    // Then update form data with all test values
    setTimeout(() => {
      // Prepare additional images with order information
      const additionalImages = [
        { url: additionalImageUrl1, order: 0 },
        { url: additionalImageUrl2, order: 1 },
        { url: additionalImageUrl3, order: 2 },
      ];

      setFormData({
        brand: "Rolex",
        model: "Submariner",
        reference: "126610LN",
        year: "2023",
        condition: {
          hasBox: true,
          hasPapers: true,
          status: "Excellent",
          details: "Minor scratches on clasp",
        },
        price: "12500",
        discountedPrice: "11500",
        originalPrice: "13000", // RRP
        discount: 8,
        rrpStatus: "Discounted",
        description:
          "The Rolex Submariner Date in Oystersteel with a unidirectional rotatable bezel and black dial with large luminescent hour markers.",
        subdescription: "Waterproof and robust diving watch",
        pageTitle: "Rolex Submariner Date 126610LN | Luxury Dive Watch",
        imageUrl: mainImageUrl,
        backsideImageUrl: backsideImageUrl,
        additionalImages: additionalImages,
        status: "draft",
        featured: false,
        itemCode: "",
        caseSize: ["41mm"],
        caseMaterial: ["Stainless Steel"],
        dialColour: ["Black"],
        bracelet: ["Steel"],
        braceletLength: "20cm",
        movement: ["Automatic"],
        waterResistance: true,
        depth: "300m",
        depthCustom: "",
        extra: "No-Date",
        purchasePrice: "10000",
        serialNumber: "RX123456789",
        notes: "",
      });

      console.log("Auto-fill complete with:", {
        mainImage: mainImageUrl,
        backsideImage: backsideImageUrl,
        additionalImages: additionalImages,
        totalImages: additionalImages.length + 2, // Adding main and backside images
        waterResistance: true,
        depth: "300m",
        extra: "No-Date",
      });
    }, 300); // Increased timeout to ensure allImages are updated first
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

    if (name === "conditionStatus" || name === "conditionDetails") {
      setFormData((prev) => ({
        ...prev,
        condition: {
          ...prev.condition,
          [name === "conditionStatus" ? "status" : "details"]: value,
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

    // Set the value in form data first
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Handle price calculations - discount is only related to price and discountedPrice
    if (name === "price" || name === "discount" || name === "discountedPrice") {
      setTimeout(() => {
        // Get the updated values after state update
        let price = name === "price" ? value : formData.price;
        let discount = name === "discount" ? value : formData.discount;
        let discountedPrice =
          name === "discountedPrice" ? value : formData.discountedPrice;

        // Remove commas for calculation
        price = price ? price.toString().replace(/,/g, "") : "";
        discountedPrice = discountedPrice
          ? discountedPrice.toString().replace(/,/g, "")
          : "";
        discount = discount ? parseFloat(discount) : 0;

        // Parse as numbers
        const priceNum = parseFloat(price);
        const discountedPriceNum = parseFloat(discountedPrice);

        // If user entered a discounted price directly
        if (
          name === "discountedPrice" &&
          !isNaN(discountedPriceNum) &&
          !isNaN(priceNum) &&
          priceNum > 0
        ) {
          // Calculate discount percentage based on price and discounted price
          const newDiscount = Math.round(
            ((priceNum - discountedPriceNum) / priceNum) * 100
          );
          if (newDiscount >= 0) {
            setFormData((prev) => ({ ...prev, discount: newDiscount }));
          }
          return;
        }

        // If user entered a discount percentage
        if (
          name === "discount" &&
          !isNaN(discount) &&
          discount > 0 &&
          !isNaN(priceNum) &&
          priceNum > 0
        ) {
          // Calculate discounted price based on price and discount
          const newDiscountedPrice = Math.round(
            priceNum * (1 - discount / 100)
          );
          if (newDiscountedPrice >= 0) {
            setFormData((prev) => ({
              ...prev,
              discountedPrice: newDiscountedPrice.toString(),
            }));
          }
          return;
        }

        // If user changed the price and there's a discount
        if (
          name === "price" &&
          !isNaN(priceNum) &&
          !isNaN(discount) &&
          discount > 0
        ) {
          // Recalculate discounted price based on new price and existing discount
          const newDiscountedPrice = Math.round(
            priceNum * (1 - discount / 100)
          );
          if (newDiscountedPrice >= 0) {
            setFormData((prev) => ({
              ...prev,
              discountedPrice: newDiscountedPrice.toString(),
            }));
          }
        }
      }, 0);
    }
  };

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

  // Set image as main (front) or backside image
  const setAsMainImage = (imageUrl) => {
    // Update formData with the selected main image
    setFormData((prev) => {
      console.log("Setting main image to:", imageUrl);
      return {
      ...prev,
      imageUrl: imageUrl,
      };
    });

    // Verify the update was successful (debug only)
    setTimeout(() => {
      console.log("Current main image after set:", formData.imageUrl);
    }, 100);
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
  const removeImage = (imageUrl) => {
    // Remove image from allImages state
    setAllImages((prevImages) => prevImages.filter((url) => url !== imageUrl));

    // If the removed image was the main or backside image, reset those fields
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      if (updatedData.imageUrl === imageUrl) {
        updatedData.imageUrl = "";
      }
      if (updatedData.backsideImageUrl === imageUrl) {
        updatedData.backsideImageUrl = "";
      }
      return updatedData;
    });

    toast.success("Image removed successfully");
  };

  // Handle file uploads
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      // Process each file in sequence
      for (const file of files) {
        // Create form data for upload
        const formData = new FormData();
        formData.append("image", file);

        // Upload to Cloudinary via our API route
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to upload image");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to upload image");
        }

        // Add the image URL to our collection
        const imageUrl = data.url;
        setAllImages((prev) => {
          // Check if this is the first image being added
          const isFirstImage = prev.length === 0;

          // If it's the first image and no main image is set, set it as the main image
          if (isFirstImage && !formData.imageUrl) {
            // We're using a timeout to ensure state updates don't conflict
            setTimeout(() => {
              setFormData((prevFormData) => ({
                ...prevFormData,
                imageUrl: imageUrl,
              }));
            }, 100);
          }

          return [...prev, imageUrl];
        });
      }

      toast.success(
        `Successfully uploaded ${files.length} image${
          files.length > 1 ? "s" : ""
        }`
      );
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error(error.message || "Error uploading images");
    } finally {
      setIsUploading(false);

      // Reset the file input to allow selecting the same files again
      const fileInput = document.getElementById("image-upload");
      if (fileInput) fileInput.value = "";
    }
  };

  // Handle additional images upload
  const handleAdditionalImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        // Create form data for upload
        const formData = new FormData();
        formData.append("image", file);

        // Upload to Cloudinary via our API route
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to upload image");
        }

        // Add new image to additional images array
        setFormData((prev) => ({
          ...prev,
          additionalImages: [...prev.additionalImages, data.url],
        }));

        toast.success("Additional image uploaded successfully");
    } catch (error) {
        console.error("Error uploading additional image:", error);
        toast.error("Error uploading additional image");
    } finally {
        setIsUploading(false);
      }
    }
  };

  // Remove additional image
  const removeAdditionalImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  // Prepare form data for submission
  const prepareFormDataForSubmission = () => {
    // We'll create a copy of the form data
    const submissionData = { ...formData };

    // For images, we need to filter out any that haven't been set
    if (!submissionData.imageUrl) {
      setError("Please select a main image for the product");
      return null;
    }

    // For condition, we have to ensure we're sending the right format
    submissionData.condition = {
      hasBox: formData.condition.hasBox,
      hasPapers: formData.condition.hasPapers,
      status: formData.condition.status || "Good",
      details: formData.condition.details || "",
    };

    // Process depth field - if "Other" is selected, use the custom depth value
    if (submissionData.depth === "Other" && submissionData.depthCustom) {
      submissionData.depth = submissionData.depthCustom;
    }

    // Ensure waterResistance is a boolean
    submissionData.waterResistance = !!submissionData.waterResistance;

    // Convert specification fields to arrays if they're not already
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

    // Process additionalImages based on allImages order, filtering out the main and backside images
    const mainImage = submissionData.imageUrl;
    const backsideImage = submissionData.backsideImageUrl;

    // Get all images except main and backside, preserving the order from allImages
    const additionalImagesInOrder = allImages
      .filter((url) => url !== mainImage && url !== backsideImage)
      .map((url, idx) => ({
        url,
        order: idx,
      }));

    // Update the submission data with properly ordered additional images
    submissionData.additionalImages = additionalImagesInOrder;

    console.log(
      "Submitting with additionalImages:",
      submissionData.additionalImages
    );

    // Ensure all required fields are present and valid
    if (!submissionData.brand || submissionData.brand.trim() === "") {
      setError("Brand is required");
      return null;
    }

    if (!submissionData.model || submissionData.model.trim() === "") {
      setError("Model is required");
      return null;
    }

    if (
      !submissionData.price ||
      isNaN(parseFloat(submissionData.price.replace(/,/g, "")))
    ) {
      setError("A valid price is required");
      return null;
    }

    // Return the cleaned data
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
      console.log("Submission data prepared:", submissionData);

      if (!submissionData) {
        setSubmitting(false);
        return;
      }

      // Sanitize the data to prevent API errors
      // Clean any undefined values that might cause JSON serialization issues
      Object.keys(submissionData).forEach((key) => {
        if (submissionData[key] === undefined) {
          submissionData[key] = null;
        }
      });

      // Additional cleanup for objects that might cause serialization issues
      if (submissionData.additionalImages) {
        submissionData.additionalImages = submissionData.additionalImages.map(
          (img) => {
            // Ensure each image object has only url and order properties
            if (typeof img === "object" && img !== null) {
              return {
                url: img.url || "",
                order: typeof img.order === "number" ? img.order : 0,
              };
            }
            return img;
          }
        );
      }

      // Convert to string and back to catch any JSON serialization issues
      try {
        const jsonString = JSON.stringify(submissionData);
        const reparsed = JSON.parse(jsonString);
        console.log("Data successfully serializes to JSON");
      } catch (jsonError) {
        console.error("JSON serialization error:", jsonError);
        setError(
          "Error preparing data for submission. Please check console for details."
        );
        setSubmitting(false);
        return;
      }

      console.log(
        "Sending data to API:",
        JSON.stringify(submissionData, null, 2)
      );

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      console.log("API response status:", response.status);
      let responseData;

      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse response JSON:", jsonError);
        throw new Error("Server returned an invalid response format");
      }

      console.log("API response data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create product");
      }

      // Show success message
      toast.success("Product created successfully!");

      // Redirect to products list
      router.push("/admin/products");
    } catch (error) {
      console.error("Create product error:", error);
      setError(error.message || "An error occurred while creating the product");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-600 mt-1">
            Create a new product for your catalog
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
          {/* Action buttons at the top */}
          <div className="flex justify-end mb-6 gap-3">
            <button
              type="button"
              onClick={autoFillTestData}
              className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded"
            >
              Auto-Fill for Testing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="Auto-generated if empty"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Starting with AA001, auto-generated if left blank
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
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                  placeholder="Enter watch serial number"
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
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          condition: {
                            ...prev.condition,
                            hasBox: e.target.checked,
                          },
                        }));
                      }}
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
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          condition: {
                            ...prev.condition,
                            hasPapers: e.target.checked,
                          },
                        }));
                      }}
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

            {/* Content Section */}
            <div className="space-y-4">
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
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    Bracelet Length
                  </label>
                  <input
                    type="text"
                    name="braceletLength"
                    value={formData.braceletLength}
                    onChange={handleChange}
                    placeholder="e.g. 20cm or 7.9 inches"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
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
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select movement</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="Quartz">Quartz</option>
                    <option value="Solar">Solar</option>
                    <option value="Kinetic">Kinetic</option>
                    <option value="Spring Drive">Spring Drive</option>
                    <option value="Co-Axial">Co-Axial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Water Resistance
                  </label>
                  <div className="relative mt-1 border border-gray-300 rounded-md py-2 px-3 h-10 flex items-center">
                      <input
                        type="checkbox"
                      id="waterResistance"
                        name="waterResistance"
                        checked={formData.waterResistance}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            waterResistance: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    <label
                      htmlFor="waterResistance"
                      className="ml-2 text-gray-700"
                    >
                        Water Resistant
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
                      value={formData.depth}
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
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white shadow rounded-lg mb-6 md:col-span-2">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Product Images
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload high-quality images of your product. You can select
                  multiple images at once.
                </p>
              </div>
              <div className="p-4">
                <div className="mb-4 flex items-center">
                    <label
                    htmlFor="image-upload"
                    className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 ${
                      isUploading
                        ? "bg-gray-200 cursor-wait"
                        : "bg-white hover:bg-gray-50"
                    } focus:outline-none`}
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600"
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
                        Uploading...
                      </span>
                    ) : (
                      <>
                        <svg
                          className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                          fill="none"
                        viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                        Upload Images
                      </>
                    )}
                    </label>
                  <input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                    multiple
                    disabled={isUploading}
                  />
                  <p className="ml-4 text-sm text-gray-500">
                    Select multiple images by holding Ctrl (or Cmd) while
                    clicking.
                  </p>
                </div>

                {/* Image Gallery */}
                {allImages.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Product Images ({allImages.length})
                      </h4>
                      {!formData.imageUrl && (
                        <p className="text-sm text-yellow-600">
                          Please select a main (front) image
                        </p>
                      )}
                    </div>
                    <div
                      className="max-h-[480px] overflow-y-auto pr-2"
                      style={{ scrollbarWidth: "thin" }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {allImages.map((img, index) => (
                      <div
                        key={index}
                            className="relative border border-gray-300 rounded-lg overflow-hidden bg-white"
                      >
                            <div className="relative h-40 bg-gray-100">
                        <Image
                                src={img}
                                alt={`Product ${index + 1}`}
                                className="h-full w-full object-contain"
                                width={500}
                                height={320}
                                unoptimized={true}
                              />
                              {/* Indicator icons for main/backside images */}
                              {img === formData.imageUrl && (
                                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-br">
                                  Main
                                </div>
                              )}
                              {img === formData.backsideImageUrl && (
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-bl">
                                  Back
                                </div>
                              )}
                            </div>

                            <div className="p-2 bg-gray-50 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                {/* Set as main/backside */}
                                <div className="flex space-x-1">
                          <button
                            type="button"
                                    onClick={(e) => {
                                      e.preventDefault(); // Prevent scrolling
                                      setAsMainImage(img);
                                    }}
                                    className={`px-2 py-1 text-xs font-medium rounded ${
                                      img === formData.imageUrl
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                                    }`}
                                    title="Set as main image"
                                  >
                                    Front
                          </button>
                          <button
                            type="button"
                                    onClick={(e) => {
                                      e.preventDefault(); // Prevent scrolling
                                      setAsBacksideImage(img);
                                    }}
                                    className={`px-2 py-1 text-xs font-medium rounded ${
                                      img === formData.backsideImageUrl
                                        ? "bg-green-100 text-green-600"
                                        : "bg-gray-200 text-gray-700 hover:bg-green-100 hover:text-green-600"
                                    }`}
                                    title="Set as backside image"
                                  >
                                    Back
                          </button>
                                </div>

                                {/* Delete button */}
                          <button
                            type="button"
                                  onClick={(e) => {
                                    e.preventDefault(); // Prevent scrolling
                                    removeImage(img);
                                  }}
                                  className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                  title="Remove image"
                                >
                                  <svg
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

                              {/* Reorder buttons */}
                              <div className="flex flex-col space-y-1 mt-1">
                                <button
                                  type="button"
                                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    moveImageUp(index);
                                  }}
                                  disabled={index === 0}
                                >
                                  ↑ Up
                                </button>

                                <button
                                  type="button"
                                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    moveImageDown(index);
                                  }}
                                  disabled={index === allImages.length - 1}
                                >
                                  ↓ Down
                                </button>

                                <button
                                  type="button"
                                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeImage(img);
                                  }}
                          >
                            Remove
                          </button>
                              </div>
                        </div>
                      </div>
                    ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* No images message */}
                {allImages.length === 0 && (
                  <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-1 text-sm text-gray-500">
                      No product images yet. Click the "Upload Images" button
                      above to add images.
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
                  <div className="flex flex-col space-y-2">
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
                      Featured Product
                    </label>
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
                </div>
              </div>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="mt-8 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || isUploading}
              className={`px-6 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                submitting || isUploading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none`}
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
                  Saving...
                </span>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

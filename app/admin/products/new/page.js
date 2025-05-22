"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    brand: "",
    brandId: "",
    model: "",
    modelId: "",
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
  });

  const [allImages, setAllImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoadingBrands(true);
      const response = await fetch("/api/brands");
      const data = await response.json();

      if (data.success) {
        const activeBrands = data.data.filter((brand) => brand.active);
        setBrands(activeBrands);
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
        originalPrice: "13000",
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

    if (name === "brandId") {
      // When brand changes, reset model and fetch new models
      setFormData((prev) => ({
        ...prev,
        brandId: value,
        modelId: "",
        model: "",
        // Set the brand name from the selected brand
        brand: value ? brands.find((b) => b._id === value)?.name || "" : "",
      }));
      fetchModelsByBrand(value);
    } else if (name === "modelId") {
      setFormData((prev) => ({
        ...prev,
        modelId: value,
        // Set the model name from the selected model
        model: value ? models.find((m) => m._id === value)?.name || "" : "",
      }));
    } else if (name === "condition.hasBox" || name === "condition.hasPapers") {
      setFormData((prev) => ({
        ...prev,
        condition: {
          ...prev.condition,
          [name]: checked,
        },
      }));
    } else if (name === "condition.status") {
      setFormData((prev) => ({
        ...prev,
        condition: {
          ...prev.condition,
          status: value,
        },
      }));
    } else if (name === "condition.details") {
      setFormData((prev) => ({
        ...prev,
        condition: {
          ...prev.condition,
          details: value,
        },
      }));
    } else if (name === "depth") {
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
    } else if (name === "depthCustom") {
      setFormData((prev) => ({
        ...prev,
        depthCustom: value,
      }));
    } else if (name === "itemCode") {
      setFormData((prev) => ({
        ...prev,
        itemCode: value,
      }));
    } else if (
      name === "caseSize" ||
      name === "caseMaterial" ||
      name === "dialColour" ||
      name === "bracelet" ||
      name === "movement"
    ) {
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
    } else {
      // Set the value in form data first
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

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
    // Create a copy of the form data
    const formDataCopy = { ...formData };

    // Handle empty values
    if (!formDataCopy.discountedPrice) {
      formDataCopy.discountedPrice = formDataCopy.price;
    }

    // Make sure brandId and modelId are included
    if (!formDataCopy.brandId && formDataCopy.brand) {
      const foundBrand = brands.find(
        (b) => b.name.toLowerCase() === formDataCopy.brand.toLowerCase()
      );
      if (foundBrand) {
        formDataCopy.brandId = foundBrand._id;
      }
    }

    if (!formDataCopy.modelId && formDataCopy.model) {
      const foundModel = models.find(
        (m) => m.name.toLowerCase() === formDataCopy.model.toLowerCase()
      );
      if (foundModel) {
        formDataCopy.modelId = foundModel._id;
      }
    }

    // Ensure additionalImages is properly formatted
    if (allImages.length > 0) {
      // Main image is already set in formData.imageUrl
      // Backside image is already set in formData.backsideImageUrl

      // For additional images, filter out the main and backside images
      const additionalImagesArray = allImages
        .filter(
          (img) =>
            img !== formDataCopy.imageUrl &&
            img !== formDataCopy.backsideImageUrl
        )
        .map((url, index) => ({
          url,
          order: index,
        }));

      formDataCopy.additionalImages = additionalImagesArray;
    }

    // For images, we need to filter out any that haven't been set
    if (!formDataCopy.imageUrl) {
      setError("Please select a main image for the product");
      return null;
    }

    // For condition, we have to ensure we're sending the right format
    formDataCopy.condition = {
      hasBox: formDataCopy.condition?.hasBox || false,
      hasPapers: formDataCopy.condition?.hasPapers || false,
      status: formDataCopy.condition?.status || "Good",
      details: "",
    };

    // Process depth field - if "Other" is selected, use the custom depth value
    if (formDataCopy.depth === "Other" && formDataCopy.depthCustom) {
      formDataCopy.depth = formDataCopy.depthCustom;
    }

    // Ensure waterResistance is a boolean
    formDataCopy.waterResistance = !!formDataCopy.waterResistance;

    // Process price fields to ensure consistency
    const price = parseFloat(formDataCopy.price?.replace(/,/g, "") || 0) || 0;
    const discountedPrice =
      parseFloat(formDataCopy.discountedPrice?.replace(/,/g, "") || 0) || 0;
    const discount = parseFloat(formDataCopy.discount || 0) || 0;

    // Make sure price is always set as a string
    formDataCopy.price = price.toString();

    // Handle discounted price logic
    if (discountedPrice > 0 && discountedPrice < price) {
      // If discounted price is set and valid, use it
      formDataCopy.discountedPrice = discountedPrice.toString();

      // Calculate the discount percentage if it's not already set
      if (!discount) {
        formDataCopy.discount = Math.round(
          ((price - discountedPrice) / price) * 100
        ).toString();
      } else {
        formDataCopy.discount = discount.toString();
      }
    } else if (discount > 0 && discount <= 100) {
      // If discount percentage is set, calculate the discounted price
      formDataCopy.discountedPrice = Math.round(
        price * (1 - discount / 100)
      ).toString();
      formDataCopy.discount = discount.toString();
    } else {
      // If no valid discount or discounted price, clear these fields
      formDataCopy.discountedPrice = "0";
      formDataCopy.discount = "0";
    }

    // Handle originalPrice (RRP) - keep as string, don't convert to number
    if (
      !formDataCopy.originalPrice ||
      formDataCopy.originalPrice.trim() === ""
    ) {
      formDataCopy.originalPrice = price.toString();
    }

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
      if (Array.isArray(formDataCopy[field])) {
        formDataCopy[field] = formDataCopy[field].filter(Boolean).join(", ");
      } else if (!formDataCopy[field]) {
        formDataCopy[field] = "";
      } else {
        // Ensure any non-arrays are converted to strings
        formDataCopy[field] = formDataCopy[field].toString();
      }
    });

    // Process additionalImages based on allImages order, filtering out the main and backside images
    const mainImage = formDataCopy.imageUrl;
    const backsideImage = formDataCopy.backsideImageUrl;

    // Get all images except main and backside, preserving the order from allImages
    const additionalImagesInOrder = allImages
      .filter((url) => url !== mainImage && url !== backsideImage)
      .map((url, idx) => ({
        url,
        order: idx,
      }));

    // Update the submission data with properly ordered additional images
    formDataCopy.additionalImages = additionalImagesInOrder;

    console.log(
      "Submitting with additionalImages:",
      formDataCopy.additionalImages
    );

    // Ensure all required fields are present and valid
    if (!formDataCopy.brand || formDataCopy.brand.trim() === "") {
      setError("Brand is required");
      return null;
    }

    if (!formDataCopy.model || formDataCopy.model.trim() === "") {
      setError("Model is required");
      return null;
    }

    if (
      !formDataCopy.price ||
      isNaN(parseFloat(formDataCopy.price.replace(/,/g, "")))
    ) {
      setError("A valid price is required");
      return null;
    }

    // Return the cleaned data
    return formDataCopy;
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

          {/* Private CRM Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b-2 border-blue-500 pb-2 mb-4 text-blue-700">
              Private CRM Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="purchasePrice"
                >
                  Purchase Price
                </label>
                <input
                  type="text"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                  placeholder="Enter purchase price"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Internal information - not shown to customers
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
                  value={formData.serialNumber || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                  placeholder="Enter watch serial number"
                />
                <p className="mt-1 text-xs text-gray-500">
                  For internal use only - not shown to customers
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loadingBrands}
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {loadingBrands && (
                  <div className="mt-2 text-sm text-gray-500">
                    Loading brands...
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model <span className="text-red-500">*</span>
                </label>
                <select
                  name="modelId"
                  value={formData.modelId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!formData.brandId || loadingModels}
                >
                  <option value="">Select Model</option>
                  {models.map((model) => (
                    <option key={model._id} value={model._id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                {loadingModels && (
                  <div className="mt-2 text-sm text-gray-500">
                    Loading models...
                  </div>
                )}
                {formData.brandId && models.length === 0 && !loadingModels && (
                  <div className="mt-2 text-sm text-amber-600">
                    No models found for this brand.{" "}
                    <Link
                      href={`/admin/models/new?brandId=${formData.brandId}`}
                      className="text-blue-600 hover:underline"
                    >
                      Add a new model
                    </Link>
                  </div>
                )}
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
                <div className="border border-gray-300 rounded-md p-3">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Condition Status
                    </label>
                    <div className="relative">
                      <select
                        name="conditionStatus"
                        value={formData.condition?.status || "Good"}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            condition: {
                              ...prev.condition,
                              status: e.target.value,
                            },
                          }));
                        }}
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

                  <div className="mb-3">
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
                  placeholder="e.g. 13000 or Discontinued"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter a price value or &quot;Discontinued&quot; if not
                  available
                </p>
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
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-8"
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
                      <optgroup label="Large Sizes (44mm+)">
                        <option value="43mm">43mm - Large</option>
                        <option value="44mm">44mm - Large</option>
                        <option value="45mm">45mm - Large</option>
                        <option value="46mm">46mm - Extra Large</option>
                        <option value="47mm">47mm - Extra Large</option>
                        <option value="48mm">48mm - Extra Large</option>
                        <option value="49mm">49mm - Extra Large</option>
                        <option value="50mm">50mm - Extra Large</option>
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
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
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10"
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
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
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
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10"
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
                        <option value="Mother of Pearl">Mother of Pearl</option>
                        <option value="Meteorite">Meteorite</option>
                        <option value="Skeleton">Skeleton</option>
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
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
                      <optgroup label="Specialized Movements">
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
                          unoptimized={true}
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

              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
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
                    {/* <option value="draft">Draft</option>
                    <option value="live">Live</option> */}
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

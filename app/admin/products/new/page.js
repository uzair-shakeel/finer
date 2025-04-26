"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
    },
    price: "",
    originalPrice: "",
    discount: 0,
    description: "",
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
    movement: [],
    waterResistance: false,
  });

  const [allImages, setAllImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create product");
      }

      // Redirect to products list
      router.push("/admin/products");
    } catch (error) {
      console.error("Create product error:", error);
      setError(error.message);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold border-b-2 border-blue-500 pb-2 mb-4 text-blue-700">
                Basic Information
              </h2>

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
                      checked={formData.condition.hasBox}
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
                      checked={formData.condition.hasPapers}
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
                Pricing & Description
              </h2>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="price"
                >
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 1,500"
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="originalPrice"
                >
                  Original Price (before discount)
                </label>
                <input
                  type="text"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="e.g. 1,800"
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
                  rows="3"
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
                    Item Code
                  </label>
                  <input
                    type="text"
                    name="itemCode"
                    value={formData.itemCode}
                    onChange={handleChange}
                    placeholder="Enter item code"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Case Size
                  </label>
                  <select
                    name="caseSize"
                    multiple
                    value={formData.caseSize}
                    onChange={(e) => handleMultiSelectChange(e, "caseSize")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    size="3"
                  >
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
                  <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Case Material
                  </label>
                  <select
                    name="caseMaterial"
                    multiple
                    value={formData.caseMaterial}
                    onChange={(e) => handleMultiSelectChange(e, "caseMaterial")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    size="3"
                  >
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
                  <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dial Colour
                  </label>
                  <select
                    name="dialColour"
                    multiple
                    value={formData.dialColour}
                    onChange={(e) => handleMultiSelectChange(e, "dialColour")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    size="3"
                  >
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
                  <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bracelet
                  </label>
                  <select
                    name="bracelet"
                    multiple
                    value={formData.bracelet}
                    onChange={(e) => handleMultiSelectChange(e, "bracelet")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    size="3"
                  >
                    <option value="Stainless Steel">Stainless Steel</option>
                    <option value="Leather">Leather</option>
                    <option value="Rubber">Rubber</option>
                    <option value="NATO">NATO</option>
                    <option value="Oyster">Oyster</option>
                    <option value="Jubilee">Jubilee</option>
                    <option value="President">President</option>
                    <option value="Milanese">Milanese</option>
                    <option value="Fabric">Fabric</option>
                    <option value="Gold">Gold</option>
                    <option value="Titanium">Titanium</option>
                    <option value="Ceramic">Ceramic</option>
                    <option value="Two-Tone">Two-Tone</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Movement
                  </label>
                  <select
                    name="movement"
                    multiple
                    value={formData.movement}
                    onChange={(e) => handleMultiSelectChange(e, "movement")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    size="3"
                  >
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
                  <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple
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
                        checked={formData.waterResistance}
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

                        <div className="flex flex-col space-y-1">
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

                          <button
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
                          </button>

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
                      Click  Upload Images to add product photos
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
          </div>

          <div className="mt-8 flex justify-end space-x-3">
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
              {submitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

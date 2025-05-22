import connectToDatabase from "./mongodb";
import Product from "../models/Product";
import { v4 as uuidv4 } from "uuid";

// Helper function to generate next item code
const generateNextItemCode = async () => {
  try {
    await connectToDatabase();

    // Get the latest product with an itemCode
    const latestProduct = await Product.findOne(
      { itemCode: { $regex: /^[A-Z]{2}\d{3}$/ } },
      { itemCode: 1 }
    ).sort({ itemCode: -1 });

    if (!latestProduct || !latestProduct.itemCode) {
      return "AA001"; // First item code
    }

    const currentCode = latestProduct.itemCode;
    const prefix = currentCode.substring(0, 2);
    const numericPart = parseInt(currentCode.substring(2), 10);

    if (numericPart < 999) {
      // Increment numeric part
      return `${prefix}${(numericPart + 1).toString().padStart(3, "0")}`;
    } else {
      // Move to next prefix
      const firstChar = prefix.charCodeAt(0);
      const secondChar = prefix.charCodeAt(1);

      if (secondChar < 90) {
        // 'Z' is 90
        // Increment second character
        return `${String.fromCharCode(firstChar)}${String.fromCharCode(
          secondChar + 1
        )}001`;
      } else if (firstChar < 90) {
        // Increment first character, reset second to 'A'
        return `${String.fromCharCode(firstChar + 1)}A001`;
      } else {
        // We've reached ZZ999, could implement further logic if needed
        throw new Error("Item code sequence exhausted");
      }
    }
  } catch (error) {
    console.error("Error generating item code:", error);
    throw error;
  }
};

// Helper function to strip brand information from bracelet names for display
const stripBrandFromBracelet = (braceletValue) => {
  if (!braceletValue) return "";

  // If the bracelet value contains a brand in parentheses, remove it
  const parenthesisIndex = braceletValue.indexOf(" (");
  if (parenthesisIndex > 0) {
    return braceletValue.substring(0, parenthesisIndex);
  }

  return braceletValue;
};

// Get all products
export const getProducts = async () => {
  try {
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    await connectToDatabase();
    const product = await Product.findById(id);
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// Get filtered products
export const getFilteredProducts = async ({ status, featured }) => {
  try {
    await connectToDatabase();

    const query = {};

    if (status) {
      query.status = status;
    }

    if (featured === "true") {
      query.featured = true;
    } else if (featured === "false") {
      query.featured = false;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    await connectToDatabase();

    // Ensure productData is an object
    if (!productData || typeof productData !== "object") {
      throw new Error("Invalid product data provided");
    }

    const currentDate = new Date();

    // Format price and originalPrice
    const formattedPrice =
      typeof productData.price === "string"
        ? productData.price.replace(/,/g, "")
        : productData.price?.toString() || "0";

    const formattedOriginalPrice =
      typeof productData.originalPrice === "string"
        ? productData.originalPrice.replace(/,/g, "")
        : productData.originalPrice?.toString() || formattedPrice;

    // Format discountedPrice and discount values
    const formattedDiscountedPrice =
      typeof productData.discountedPrice === "string"
        ? productData.discountedPrice.replace(/,/g, "")
        : productData.discountedPrice?.toString() || "";

    const formattedDiscount =
      typeof productData.discount === "string"
        ? productData.discount.replace(/,/g, "")
        : productData.discount?.toString() || "0";

    // Generate item code if not provided
    let itemCode = productData.itemCode;
    if (!itemCode || itemCode.trim() === "") {
      itemCode = await generateNextItemCode();
      console.log("Generated item code:", itemCode);
    }

    // Process specification fields
    const specFields = [
      "caseSize",
      "caseMaterial",
      "dialColour",
      "bracelet",
      "movement",
    ];

    // Ensure all spec fields are arrays
    specFields.forEach((field) => {
      // Handle undefined/null values
      if (!productData[field]) {
        productData[field] = "";
      }
      // Convert non-array values to arrays
      else if (!Array.isArray(productData[field])) {
        productData[field] = productData[field].toString();
      }
      // Convert arrays to strings (join with comma)
      else {
        productData[field] = productData[field]
          .map((item) => (item ? item.toString() : ""))
          .filter(Boolean)
          .join(", ");
      }
    });

    // Create initial price history entry
    const priceHistory = [
      {
        price: formattedPrice,
        date: currentDate,
      },
    ];

    // Process additional images to include order information
    const processedAdditionalImages = Array.isArray(
      productData.additionalImages
    )
      ? productData.additionalImages
          .map((img, index) => {
            if (typeof img === "string") {
              return { url: img, order: index };
            } else if (img && img.url) {
              return { ...img, order: img.order || index };
            }
            return null;
          })
          .filter(Boolean)
      : [];

    // Create the new product with all the processed data
    const newProduct = new Product({
      brand: productData.brand,
      brandId: productData.brandId || null,
      model: productData.model,
      modelId: productData.modelId || null,
      reference: productData.reference || "",
      year: productData.year || "",
      condition: {
        hasBox: productData.condition?.hasBox || false,
        hasPapers: productData.condition?.hasPapers || false,
        status: productData.condition?.status || "Good",
        details: productData.condition?.details || "",
      },
      price: formattedPrice,
      discountedPrice: formattedDiscountedPrice || formattedPrice,
      originalPrice: formattedOriginalPrice,
      discount: formattedDiscount,
      rrpStatus: productData.rrpStatus || "Regular",
      description: productData.description || "",
      subdescription: productData.subdescription || "",
      pageTitle: productData.pageTitle || "",
      imageUrl: productData.imageUrl || "",
      backsideImageUrl: productData.backsideImageUrl || "",
      additionalImages: processedAdditionalImages,
      status: productData.status || "draft",
      featured: productData.featured || false,
      itemCode,
      caseSize: productData.caseSize || "",
      caseMaterial: productData.caseMaterial || "",
      dialColour: productData.dialColour || "",
      bracelet: productData.bracelet || "",
      braceletLength: productData.braceletLength || "",
      movement: productData.movement || "",
      waterResistance: productData.waterResistance || false,
      depth: productData.depth || "100m",
      depthCustom: productData.depthCustom || "",
      extra: productData.extra || "",
      purchasePrice: productData.purchasePrice || "",
      serialNumber: productData.serialNumber || "",
      notes: productData.notes || "",
      priceHistory,
    });

    const savedProduct = await newProduct.save();
    return JSON.parse(JSON.stringify(savedProduct));
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (id, productData) => {
  try {
    await connectToDatabase();

    // Find the existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }

    // Format price values
    const formattedPrice =
      typeof productData.price === "string"
        ? productData.price.replace(/,/g, "")
        : productData.price?.toString() || existingProduct.price;

    const formattedOriginalPrice =
      typeof productData.originalPrice === "string"
        ? productData.originalPrice.replace(/,/g, "")
        : productData.originalPrice?.toString() ||
          existingProduct.originalPrice;

    const formattedDiscountedPrice =
      typeof productData.discountedPrice === "string"
        ? productData.discountedPrice.replace(/,/g, "")
        : productData.discountedPrice?.toString() ||
          existingProduct.discountedPrice;

    const formattedDiscount =
      typeof productData.discount === "string"
        ? productData.discount.replace(/,/g, "")
        : productData.discount?.toString() || existingProduct.discount;

    // Check if price has changed
    const priceHasChanged = formattedPrice !== existingProduct.price;

    // Update price history if price has changed
    let updatedPriceHistory = [...(existingProduct.priceHistory || [])];
    if (priceHasChanged) {
      updatedPriceHistory.push({
        price: formattedPrice,
        date: new Date(),
      });
    }

    // Process specification fields
    const specFields = [
      "caseSize",
      "caseMaterial",
      "dialColour",
      "bracelet",
      "movement",
    ];

    // Process each spec field
    specFields.forEach((field) => {
      if (productData[field] === undefined) {
        productData[field] = existingProduct[field] || "";
      } else if (Array.isArray(productData[field])) {
        productData[field] = productData[field]
          .map((item) => (item ? item.toString() : ""))
          .filter(Boolean)
          .join(", ");
      } else {
        productData[field] = productData[field].toString();
      }
    });

    // Process additional images to include order information
    const processedAdditionalImages = Array.isArray(
      productData.additionalImages
    )
      ? productData.additionalImages
          .map((img, index) => {
            if (typeof img === "string") {
              return { url: img, order: index };
            } else if (img && img.url) {
              return { ...img, order: img.order || index };
            }
            return null;
          })
          .filter(Boolean)
      : existingProduct.additionalImages || [];

    // Prepare update data
    const updateData = {
      brand: productData.brand || existingProduct.brand,
      brandId: productData.brandId || existingProduct.brandId || null,
      model: productData.model || existingProduct.model,
      modelId: productData.modelId || existingProduct.modelId || null,
      reference: productData.reference || existingProduct.reference || "",
      year: productData.year || existingProduct.year || "",
      condition: {
        hasBox:
          productData.condition?.hasBox ??
          existingProduct.condition?.hasBox ??
          false,
        hasPapers:
          productData.condition?.hasPapers ??
          existingProduct.condition?.hasPapers ??
          false,
        status:
          productData.condition?.status ||
          existingProduct.condition?.status ||
          "Good",
        details:
          productData.condition?.details ||
          existingProduct.condition?.details ||
          "",
      },
      price: formattedPrice,
      discountedPrice: formattedDiscountedPrice,
      originalPrice: formattedOriginalPrice,
      discount: formattedDiscount,
      rrpStatus:
        productData.rrpStatus || existingProduct.rrpStatus || "Regular",
      description: productData.description || existingProduct.description || "",
      subdescription:
        productData.subdescription || existingProduct.subdescription || "",
      pageTitle: productData.pageTitle || existingProduct.pageTitle || "",
      imageUrl: productData.imageUrl || existingProduct.imageUrl || "",
      backsideImageUrl:
        productData.backsideImageUrl || existingProduct.backsideImageUrl || "",
      additionalImages: processedAdditionalImages,
      status: productData.status || existingProduct.status || "draft",
      featured: productData.featured ?? existingProduct.featured ?? false,
      itemCode: productData.itemCode || existingProduct.itemCode || "",
      caseSize: productData.caseSize || existingProduct.caseSize || "",
      caseMaterial:
        productData.caseMaterial || existingProduct.caseMaterial || "",
      dialColour: productData.dialColour || existingProduct.dialColour || "",
      bracelet: productData.bracelet || existingProduct.bracelet || "",
      braceletLength:
        productData.braceletLength || existingProduct.braceletLength || "",
      movement: productData.movement || existingProduct.movement || "",
      waterResistance:
        productData.waterResistance ?? existingProduct.waterResistance ?? false,
      depth: productData.depth || existingProduct.depth || "100m",
      depthCustom: productData.depthCustom || existingProduct.depthCustom || "",
      extra: productData.extra || existingProduct.extra || "",
      purchasePrice:
        productData.purchasePrice || existingProduct.purchasePrice || "",
      serialNumber:
        productData.serialNumber || existingProduct.serialNumber || "",
      notes: productData.notes || existingProduct.notes || "",
      priceHistory: updatedPriceHistory,
    };

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return JSON.parse(JSON.stringify(updatedProduct));
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    await connectToDatabase();

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return false;
    }

    return JSON.parse(JSON.stringify(deletedProduct));
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};

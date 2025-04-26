import connectToDatabase from "./mongodb";
import Product from "../models/Product";
import { v4 as uuidv4 } from "uuid";

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

    // Process specification fields
    const specFields = [
      "caseSize",
      "caseMaterial",
      "dialColour",
      "bracelet",
      "movement",
    ];

    specFields.forEach((field) => {
      if (productData[field] && !Array.isArray(productData[field])) {
        productData[field] = productData[field]
          ? [productData[field].toString()]
          : [];
      }
    });

    // Create initial price history entry
    const priceHistory = [
      {
        price: formattedPrice,
        date: currentDate,
      },
    ];

    // Create a new product document
    const newProduct = new Product({
      ...productData,
      price: formattedPrice,
      originalPrice: formattedOriginalPrice || formattedPrice,
      priceHistory,
      // Add default empty arrays for spec fields if they don't exist
      caseSize: productData.caseSize || [],
      caseMaterial: productData.caseMaterial || [],
      dialColour: productData.dialColour || [],
      bracelet: productData.bracelet || [],
      movement: productData.movement || [],
      waterResistance: productData.waterResistance === true,
      additionalImages: Array.isArray(productData.additionalImages)
        ? productData.additionalImages
        : [],
      itemCode: productData.itemCode || "",
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

    // Find the current product
    const currentProduct = await Product.findById(id);

    if (!currentProduct) {
      return null;
    }

    const currentDate = new Date();

    // Format price and originalPrice if provided
    if (productData.price) {
      productData.price =
        typeof productData.price === "string"
          ? productData.price.replace(/,/g, "")
          : productData.price.toString();
    }

    if (productData.originalPrice) {
      productData.originalPrice =
        typeof productData.originalPrice === "string"
          ? productData.originalPrice.replace(/,/g, "")
          : productData.originalPrice.toString();
    }

    // Process specification fields
    const specFields = [
      "caseSize",
      "caseMaterial",
      "dialColour",
      "bracelet",
      "movement",
    ];

    specFields.forEach((field) => {
      if (productData[field] && !Array.isArray(productData[field])) {
        productData[field] = productData[field]
          ? [productData[field].toString()]
          : [];
      }
    });

    // Check if price has changed
    if (productData.price && productData.price !== currentProduct.price) {
      // Get current price history or initialize if it doesn't exist
      const priceHistory = currentProduct.priceHistory || [];

      // Add the new price to history
      priceHistory.push({
        price: productData.price,
        date: currentDate,
      });

      productData.priceHistory = priceHistory;
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...productData, updatedAt: currentDate },
      { new: true, runValidators: true }
    );

    return updatedProduct ? JSON.parse(JSON.stringify(updatedProduct)) : null;
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

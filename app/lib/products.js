import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Path to the JSON file that stores products
const dataFilePath = path.join(process.cwd(), "data", "products.json");

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize empty products file if it doesn't exist
const initProductsFile = () => {
  ensureDataDir();
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ products: [] }), "utf8");
  }
};

// Get all products
export const getProducts = () => {
  initProductsFile();
  try {
    const fileData = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileData).products;
  } catch (error) {
    console.error("Error reading products file:", error);
    return [];
  }
};

// Get product by ID
export const getProductById = (id) => {
  const products = getProducts();
  return products.find((product) => product._id === id);
};

// Get products with filters
export const getFilteredProducts = ({ status, featured }) => {
  let products = getProducts();

  if (status) {
    products = products.filter((product) => product.status === status);
  }

  if (featured === "true") {
    products = products.filter((product) => product.featured);
  } else if (featured === "false") {
    products = products.filter((product) => !product.featured);
  }

  return products;
};

// Create a new product
export const createProduct = (productData) => {
  try {
    const products = getProducts();
    const currentDate = new Date().toISOString();

    // Format price and originalPrice
    const formattedPrice =
      typeof productData.price === "string"
        ? productData.price.replace(/,/g, "")
        : productData.price?.toString();

    const formattedOriginalPrice =
      typeof productData.originalPrice === "string"
        ? productData.originalPrice.replace(/,/g, "")
        : productData.originalPrice?.toString();

    // Ensure specification fields are arrays if not already
    const caseSize = Array.isArray(productData.caseSize)
      ? productData.caseSize
      : [];
    const caseMaterial = Array.isArray(productData.caseMaterial)
      ? productData.caseMaterial
      : [];
    const dialColour = Array.isArray(productData.dialColour)
      ? productData.dialColour
      : [];
    const bracelet = Array.isArray(productData.bracelet)
      ? productData.bracelet
      : [];
    const movement = Array.isArray(productData.movement)
      ? productData.movement
      : [];

    const newProduct = {
      ...productData,
      price: formattedPrice,
      originalPrice: formattedOriginalPrice,
      _id: uuidv4(),
      createdAt: currentDate,
      updatedAt: currentDate,
      priceHistory: [
        {
          price: formattedPrice,
          date: currentDate,
        },
      ],
      // Set default values for spec fields if not provided
      itemCode: productData.itemCode || "",
      caseSize: caseSize,
      caseMaterial: caseMaterial,
      dialColour: dialColour,
      bracelet: bracelet,
      movement: movement,
      waterResistance: productData.waterResistance === true,
    };

    products.push(newProduct);

    fs.writeFileSync(
      dataFilePath,
      JSON.stringify({ products }, null, 2),
      "utf8"
    );

    return newProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update a product
export const updateProduct = (id, productData) => {
  try {
    const products = getProducts();
    const index = products.findIndex((product) => product._id === id);

    if (index === -1) {
      return null;
    }

    const currentDate = new Date().toISOString();
    const currentProduct = products[index];

    // Format new price if provided
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

    // Ensure specification fields remain arrays if provided
    if (productData.caseSize && !Array.isArray(productData.caseSize)) {
      productData.caseSize = [];
    }
    if (productData.caseMaterial && !Array.isArray(productData.caseMaterial)) {
      productData.caseMaterial = [];
    }
    if (productData.dialColour && !Array.isArray(productData.dialColour)) {
      productData.dialColour = [];
    }
    if (productData.bracelet && !Array.isArray(productData.bracelet)) {
      productData.bracelet = [];
    }
    if (productData.movement && !Array.isArray(productData.movement)) {
      productData.movement = [];
    }

    // Check if price has changed
    if (productData.price && productData.price !== currentProduct.price) {
      // Initialize priceHistory array if it doesn't exist
      if (!currentProduct.priceHistory) {
        currentProduct.priceHistory = [
          {
            price: currentProduct.price,
            date: currentProduct.createdAt || currentDate,
          },
        ];
      }

      // Add the new price to history
      currentProduct.priceHistory.push({
        price: productData.price,
        date: currentDate,
      });
    }

    const updatedProduct = {
      ...currentProduct,
      ...productData,
      updatedAt: currentDate,
      priceHistory: currentProduct.priceHistory, // Ensure priceHistory is preserved
    };

    products[index] = updatedProduct;

    fs.writeFileSync(
      dataFilePath,
      JSON.stringify({ products }, null, 2),
      "utf8"
    );

    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = (id) => {
  try {
    const products = getProducts();
    const index = products.findIndex((product) => product._id === id);

    if (index === -1) {
      return false;
    }

    const deletedProduct = products[index];
    products.splice(index, 1);

    fs.writeFileSync(
      dataFilePath,
      JSON.stringify({ products }, null, 2),
      "utf8"
    );

    return deletedProduct;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

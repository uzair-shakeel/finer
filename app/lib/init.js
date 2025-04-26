import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Path to the data directory and products file
const dataDir = path.join(process.cwd(), "data");
const productsFilePath = path.join(dataDir, "products.json");

// Function to ensure the data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log("Created data directory");
  }
};

// Function to initialize the products file if it doesn't exist
const initProductsFile = () => {
  if (!fs.existsSync(productsFilePath)) {
    // Create an empty products array structure
    const initialData = {
      products: [
        {
          _id: uuidv4(),
          brand: "Sample Brand",
          model: "Sample Model",
          price: "199.99",
          status: "live",
          featured: true,
          description: "This is a sample product to get you started.",
          imageUrl: "https://via.placeholder.com/500",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          priceHistory: [
            {
              price: "199.99",
              date: new Date().toISOString(),
            },
          ],
          // Specification fields
          itemCode: "SAMPLE-001",
          caseSize: ["40mm", "42mm"],
          caseMaterial: ["Stainless Steel"],
          dialColour: ["Black", "Blue"],
          bracelet: ["Leather"],
          movement: ["Automatic"],
          waterResistance: true,
        },
      ],
    };

    // Write the initial data to the file
    fs.writeFileSync(productsFilePath, JSON.stringify(initialData, null, 2));
    console.log("Initialized products file with sample data");
  }
};

// Main initialization function to be called at app startup
export const initializeDataStorage = () => {
  ensureDataDir();
  initProductsFile();
  console.log("Data storage initialized successfully");
  return true;
};

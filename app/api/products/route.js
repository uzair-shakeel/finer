import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getProducts,
  getFilteredProducts,
  createProduct,
} from "@/app/lib/mongodb-products";

// Helper to check authentication
const isAuthenticated = (request) => {
  const token = request.cookies.get("adminToken")?.value;
  return token === "authenticated";
};

// Get all products (publicly accessible)
export async function GET(request) {
  try {
    const url = new URL(request.url);

    // Extract query parameters
    const status = url.searchParams.get("status");
    const featured = url.searchParams.get("featured");

    // Get filtered products
    let products;
    if (status || featured) {
      products = await getFilteredProducts({ status, featured });
    } else {
      // For public access, only show live products unless admin
      const isAdmin = request.headers.get("x-is-admin") === "true";
      if (!isAdmin) {
        products = await getFilteredProducts({ status: "live" });
      } else {
        products = await getProducts();
      }
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Create a new product (admin only)
export async function POST(request) {
  try {
    // Check authentication
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse JSON with error handling
    let productData;
    try {
      productData = await request.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body - failed to parse JSON",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ["brand", "model", "price", "imageUrl"];
    const missingFields = [];

    for (const field of requiredFields) {
      if (!productData[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Please provide the following required fields: ${missingFields.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Create product with more detailed error handling
    let product;
    try {
      product = await createProduct(productData);
    } catch (createError) {
      console.error("Error in createProduct function:", createError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create product",
          error: createError.message || "Unknown error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

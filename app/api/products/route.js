import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getProducts,
  getFilteredProducts,
  createProduct,
} from "@/app/lib/products";

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
      products = getFilteredProducts({ status, featured });
    } else {
      // For public access, only show live products unless admin
      const isAdmin = request.headers.get("x-is-admin") === "true";
      if (!isAdmin) {
        products = getFilteredProducts({ status: "live" });
      } else {
        products = getProducts();
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
      { success: false, message: "Internal server error" },
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

    const productData = await request.json();

    // Validate required fields
    const requiredFields = ["brand", "model", "price", "imageUrl"];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json(
          { success: false, message: `Please provide ${field}` },
          { status: 400 }
        );
      }
    }

    // Create product
    const product = createProduct(productData);

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
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

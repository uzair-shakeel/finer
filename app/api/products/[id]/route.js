import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/app/lib/mongodb-products";

// Helper to check authentication
const isAuthenticated = (request) => {
  const token = request.cookies.get("adminToken")?.value;
  return token === "authenticated";
};

// Get a specific product
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Find product
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // For public access, only return live products
    const isAdmin = request.headers.get("x-is-admin") === "true";
    if (!isAdmin && product.status !== "live") {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Fetch product error:", error);
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

// Update a product (admin only)
export async function PUT(request, { params }) {
  try {
    // Check authentication
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Parse JSON with error handling
    let updateData;
    try {
      updateData = await request.json();
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

    // Find and update product
    const product = await updateProduct(id, updateData);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
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

// Delete a product (admin only)
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Find and delete product
    const product = await deleteProduct(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
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

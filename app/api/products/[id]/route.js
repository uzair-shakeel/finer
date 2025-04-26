import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/app/lib/products";

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
    const product = getProductById(id);

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
      { success: false, message: "Internal server error" },
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
    const updateData = await request.json();

    // Find and update product
    const product = updateProduct(id, updateData);

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
      { success: false, message: "Internal server error" },
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
    const product = deleteProduct(id);

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
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

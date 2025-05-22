import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Brand from "@/app/models/Brand";
import WatchModel from "@/app/models/WatchModel";
import mongoose from "mongoose";

// GET a single brand by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid brand ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    // Also fetch models associated with this brand
    const models = await WatchModel.find({ brandId: id }).sort({ name: 1 });

    return NextResponse.json({
      success: true,
      data: {
        brand,
        models,
      },
    });
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch brand" },
      { status: 500 }
    );
  }
}

// PUT update a brand
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid brand ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if brand exists
    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    // Generate slug if name changed
    let slug = existingBrand.slug;
    if (name && name !== existingBrand.name) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if new slug already exists for another brand
      const slugExists = await Brand.findOne({
        slug,
        _id: { $ne: id },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, message: "Brand with this name already exists" },
          { status: 400 }
        );
      }
    }

    // Update brand
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      {
        name: name || existingBrand.name,
        slug,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Brand updated successfully",
      data: updatedBrand,
    });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update brand" },
      { status: 500 }
    );
  }
}

// DELETE a brand
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid brand ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if brand exists
    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    // Check if there are any models associated with this brand
    const modelCount = await WatchModel.countDocuments({ brandId: id });
    if (modelCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot delete brand with associated models. Please delete all models first or reassign them to another brand.",
        },
        { status: 400 }
      );
    }

    // Delete the brand
    await Brand.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete brand" },
      { status: 500 }
    );
  }
}

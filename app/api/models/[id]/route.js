import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import WatchModel from "@/app/models/WatchModel";
import Brand from "@/app/models/Brand";
import mongoose from "mongoose";

// GET a single watch model by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid model ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const model = await WatchModel.findById(id).populate("brandId", "name");

    if (!model) {
      return NextResponse.json(
        { success: false, message: "Watch model not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: model });
  } catch (error) {
    console.error("Error fetching watch model:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch watch model" },
      { status: 500 }
    );
  }
}

// PUT update a watch model
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, brandId, description, active } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid model ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if model exists
    const existingModel = await WatchModel.findById(id);
    if (!existingModel) {
      return NextResponse.json(
        { success: false, message: "Watch model not found" },
        { status: 404 }
      );
    }

    // If brandId is being updated, check if it's valid
    if (brandId && brandId !== existingModel.brandId.toString()) {
      if (!mongoose.Types.ObjectId.isValid(brandId)) {
        return NextResponse.json(
          { success: false, message: "Invalid brand ID" },
          { status: 400 }
        );
      }

      // Check if brand exists
      const brand = await Brand.findById(brandId);
      if (!brand) {
        return NextResponse.json(
          { success: false, message: "Brand not found" },
          { status: 404 }
        );
      }
    }

    // If name is being updated, check for duplicates
    if (name && name !== existingModel.name) {
      const duplicateModel = await WatchModel.findOne({
        name,
        brandId: brandId || existingModel.brandId,
        _id: { $ne: id },
      });

      if (duplicateModel) {
        return NextResponse.json(
          {
            success: false,
            message: "Model with this name already exists for this brand",
          },
          { status: 400 }
        );
      }
    }

    // Update model
    const updatedModel = await WatchModel.findByIdAndUpdate(
      id,
      {
        name: name || existingModel.name,
        brandId: brandId || existingModel.brandId,
        description:
          description !== undefined ? description : existingModel.description,
        active: active !== undefined ? active : existingModel.active,
      },
      { new: true }
    ).populate("brandId", "name");

    return NextResponse.json({
      success: true,
      message: "Watch model updated successfully",
      data: updatedModel,
    });
  } catch (error) {
    console.error("Error updating watch model:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update watch model" },
      { status: 500 }
    );
  }
}

// DELETE a watch model
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid model ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if model exists
    const model = await WatchModel.findById(id);
    if (!model) {
      return NextResponse.json(
        { success: false, message: "Watch model not found" },
        { status: 404 }
      );
    }

    // Delete the model
    await WatchModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Watch model deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting watch model:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete watch model" },
      { status: 500 }
    );
  }
}

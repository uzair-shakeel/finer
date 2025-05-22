import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import WatchModel from "@/app/models/WatchModel";
import Brand from "@/app/models/Brand";
import mongoose from "mongoose";

// GET all watch models
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");

    await connectDB();

    let query = {};

    // If brandId is provided, filter by brandId
    if (brandId) {
      // Validate brandId
      if (!mongoose.Types.ObjectId.isValid(brandId)) {
        return NextResponse.json(
          { success: false, message: "Invalid brand ID" },
          { status: 400 }
        );
      }

      query.brandId = brandId;
    }

    // Fetch models with populated brand information
    const models = await WatchModel.find(query)
      .populate("brandId", "name")
      .sort({ name: 1 });

    return NextResponse.json({ success: true, data: models });
  } catch (error) {
    console.error("Error fetching watch models:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch watch models" },
      { status: 500 }
    );
  }
}

// POST create a new watch model
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, brandId, description, active } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Model name is required" },
        { status: 400 }
      );
    }

    if (!brandId) {
      return NextResponse.json(
        { success: false, message: "Brand ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      return NextResponse.json(
        { success: false, message: "Invalid brand ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if brand exists
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    // Check if model with this name already exists for this brand
    const existingModel = await WatchModel.findOne({
      name,
      brandId,
    });

    if (existingModel) {
      return NextResponse.json(
        {
          success: false,
          message: "Model with this name already exists for this brand",
        },
        { status: 400 }
      );
    }

    // Create new watch model
    const watchModel = await WatchModel.create({
      name,
      brandId,
      description: description || "",
      active: active !== undefined ? active : true,
    });

    // Populate brand information in the response
    const populatedModel = await WatchModel.findById(watchModel._id).populate(
      "brandId",
      "name"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Watch model created successfully",
        data: populatedModel,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating watch model:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create watch model" },
      { status: 500 }
    );
  }
}

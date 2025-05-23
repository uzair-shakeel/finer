import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Brand from "@/app/models/Brand";
import WatchModel from "@/app/models/WatchModel";

// GET all brands
export async function GET(request) {
  console.log("GET /api/brands - Starting request");

  try {
    const { searchParams } = new URL(request.url);
    const includeModels = searchParams.get("includeModels") === "true";

    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully");

    // Get all brands, sorted by displayOrder and name
    console.log("Fetching brands from database...");
    const brands = await Brand.find({})
      .sort({ displayOrder: 1, name: 1 })
      .lean()
      .exec();

    console.log(`Found ${brands?.length || 0} brands`);

    // Transform the brands to ensure IDs are strings
    const transformedBrands = brands.map(brand => ({
      ...brand,
      _id: brand._id.toString()
    }));

    if (!transformedBrands || transformedBrands.length === 0) {
      console.log("No brands found in database");
      return NextResponse.json({
        success: true,
        data: [],
        message: "No brands found",
      });
    }

    // If includeModels is true, fetch models for each brand
    if (includeModels) {
      console.log("Fetching models for brands...");
      const brandsWithModels = await Promise.all(
        transformedBrands.map(async (brand) => {
          const models = await WatchModel.find({ brandId: brand._id })
            .sort({ name: 1 })
            .lean()
            .exec();
          
          // Transform model IDs to strings as well
          const transformedModels = models.map(model => ({
            ...model,
            _id: model._id.toString(),
            brandId: model.brandId.toString()
          }));

          return {
            ...brand,
            models: transformedModels || [],
          };
        })
      );

      console.log("Successfully fetched brands with models");
      return NextResponse.json({
        success: true,
        data: brandsWithModels,
        message: "Brands with models fetched successfully",
      });
    }

    console.log("Successfully fetched brands");
    return NextResponse.json({
      success: true,
      data: transformedBrands,
      message: "Brands fetched successfully",
    });
  } catch (error) {
    console.error("Error in GET /api/brands:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch brands",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST create a new brand
export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Brand name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await connectDB();

    // Check if brand with this name or slug already exists
    const existingBrand = await Brand.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingBrand) {
      return NextResponse.json(
        { success: false, message: "Brand with this name already exists" },
        { status: 400 }
      );
    }

    // Create new brand with both name and slug
    const brand = await Brand.create({ name, slug });

    return NextResponse.json(
      { success: true, message: "Brand created successfully", data: brand },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create brand" },
      { status: 500 }
    );
  }
}

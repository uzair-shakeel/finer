import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Brand from "@/app/models/Brand";
import WatchModel from "@/app/models/WatchModel";

// GET all brands
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeModels = searchParams.get("includeModels") === "true";

    await connectDB();

    const brands = await Brand.find({}).sort({ name: 1 });

    // If includeModels is true, fetch models for each brand
    if (includeModels) {
      const brandsWithModels = await Promise.all(
        brands.map(async (brand) => {
          const models = await WatchModel.find({ brandId: brand._id }).sort({
            name: 1,
          });
          return {
            ...brand.toObject(),
            models: models,
          };
        })
      );

      return NextResponse.json({ success: true, data: brandsWithModels });
    }

    return NextResponse.json({ success: true, data: brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch brands" },
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

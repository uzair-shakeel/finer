import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose";
import User from "@/app/models/User";

export async function POST(request) {
  try {
    await dbConnect();

    // Check if admin exists already to prevent multiple admins
    const existingAdmin = await User.findOne({ role: "admin" });

    // If we want to restrict to only one admin, uncomment this block
    /*
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin user already exists' },
        { status: 400 }
      );
    }
    */

    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: "admin", // Set role as admin for initial setup
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

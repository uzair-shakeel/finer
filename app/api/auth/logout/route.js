import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Logout endpoint to remove auth cookie
export async function POST() {
  try {
    // Delete the admin token cookie
    cookies().delete("adminToken");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

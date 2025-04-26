import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Authentication check endpoint
export async function GET() {
  try {
    // Check for auth cookie
    const adminToken = cookies().get("adminToken");

    if (!adminToken || adminToken.value !== "authenticated") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // If authentication is successful, just return success
    return NextResponse.json({
      success: true,
      message: "Authenticated",
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

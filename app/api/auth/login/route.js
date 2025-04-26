import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyCredentials, getUserByUsername } from "@/app/lib/users";

// Authentication using file-based user storage
export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide username and password" },
        { status: 400 }
      );
    }

    // Verify credentials
    const isValid = verifyCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Get user details (without password)
    const user = getUserByUsername(username);

    // Set auth cookie
    cookies().set({
      name: "adminToken",
      value: "authenticated",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
    });

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

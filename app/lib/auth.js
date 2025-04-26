import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Generate JWT token
export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

// Set JWT token in cookie
export function setAuthCookie(token) {
  cookies().set({
    name: "adminToken",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "strict",
  });
}

// Remove JWT token from cookie
export function removeAuthCookie() {
  cookies().delete("adminToken");
}

// Verify JWT token from cookie
export function verifyAuth() {
  try {
    const token = cookies().get("adminToken")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

// Auth middleware for API routes
export async function authMiddleware(request) {
  try {
    const token = request.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// Check auth middleware for client components
export function useAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get("adminToken")?.value;

  if (!token) {
    return { isAuthenticated: false, userId: null };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { isAuthenticated: true, userId: decoded.userId };
  } catch (error) {
    return { isAuthenticated: false, userId: null };
  }
}

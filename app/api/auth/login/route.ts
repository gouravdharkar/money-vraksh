import { NextRequest, NextResponse } from "next/server";
import { db } from "@/backend/db/client";
import { verifyPassword, createSessionToken } from "@/backend/auth/password";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Please enter your username/email and password" },
        { status: 400 }
      );
    }

    const cleanIdentifier = String(identifier).trim().toLowerCase();

    // Find user by either username or email
    const user = await db.user.findFirst({
      where: {
        OR: [
          { username: cleanIdentifier },
          { email: cleanIdentifier },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No account found matching this username or email" },
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    // Create session token
    const token = createSessionToken(user.id);

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    };

    const res = NextResponse.json({
      success: true,
      message: "Logged in successfully",
      user: safeUser,
    });

    // Set HTTP-only auth cookie
    res.cookies.set("mv_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return res;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to log in" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/backend/db/client";
import { hashPassword, createSessionToken } from "@/backend/auth/password";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, phone, password, confirmPassword } = body;

    // Validate presence
    if (!username || !email || !phone || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).trim().replace(/\D/g, "");

    // Username format check
    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { success: false, error: "Username must be at least 3 characters long" },
        { status: 400 }
      );
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Phone format check
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    // Password length check
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Confirm password match check
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Password and Confirm Password do not match" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await db.user.findFirst({
      where: { username: cleanUsername },
    });
    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: "This username is already taken. Please choose another." },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingEmail = await db.user.findFirst({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Create user in SQLite database
    const newUser = await db.user.create({
      data: {
        username: cleanUsername,
        email: cleanEmail,
        phone: cleanPhone,
        password: hashedPassword,
      },
    });

    // Create session token
    const token = createSessionToken(newUser.id);

    const safeUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
    };

    const res = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: safeUser,
    });

    // Set cookie
    res.cookies.set("mv_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return res;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create account" },
      { status: 500 }
    );
  }
}

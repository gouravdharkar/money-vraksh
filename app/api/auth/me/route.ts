import { NextRequest, NextResponse } from "next/server";
import { db } from "@/backend/db/client";
import { verifySessionToken } from "@/backend/auth/password";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("mv_auth_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, user: null });
    }

    const userId = verifySessionToken(token);
    if (!userId) {
      return NextResponse.json({ success: false, user: null });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, user: null });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ success: false, user: null });
  }
}

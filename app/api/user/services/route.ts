import { NextRequest, NextResponse } from "next/server";
import { db } from "@/backend/db/client";
import { verifySessionToken } from "@/backend/auth/password";
import { OnboardingService } from "@/backend/services/onboardingService";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("mv_auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = verifySessionToken(token);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session. Please sign in again." },
        { status: 401 }
      );
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
      return NextResponse.json(
        { success: false, error: "User account not found" },
        { status: 401 }
      );
    }

    const subscriptions = await OnboardingService.getUserSubscriptions(user);

    return NextResponse.json({
      success: true,
      user,
      subscriptions,
    });
  } catch (error: any) {
    console.error("Error fetching user subscriptions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load subscriptions" },
      { status: 500 }
    );
  }
}

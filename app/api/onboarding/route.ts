import { NextRequest, NextResponse } from "next/server";
import { OnboardingService } from "@/backend/services/onboardingService";
import { verifySessionToken } from "@/backend/auth/password";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if user is authenticated via cookie
    const token = req.cookies.get("mv_auth_token")?.value;
    let userId = body.userId;
    if (!userId && token) {
      userId = verifySessionToken(token) || undefined;
    }

    // Get client IP address if available
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      undefined;

    const result = await OnboardingService.createOrUpdate({
      ...body,
      userId,
      ipAddress: ipAddress ? ipAddress.split(",")[0].trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      onboardingId: result.id,
      onboarding: result,
    });
  } catch (error: any) {
    console.error("Error saving onboarding lead:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to save client details",
      },
      { status: 500 }
    );
  }
}

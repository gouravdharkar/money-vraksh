import { NextRequest, NextResponse } from "next/server";
import { OnboardingService } from "@/backend/services/onboardingService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const service = searchParams.get("service") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const [data, stats] = await Promise.all([
      OnboardingService.getAll({ search, status, service, page, limit }),
      OnboardingService.getStats(),
    ]);

    return NextResponse.json({
      success: true,
      ...data,
      stats,
    });
  } catch (error: any) {
    console.error("Error fetching onboardings for admin:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch data" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { OnboardingService } from "@/backend/services/onboardingService";

export async function GET() {
  try {
    const csvContent = await OnboardingService.exportCsv();

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="money-vriksh-clients-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating CSV export:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export CSV" },
      { status: 500 }
    );
  }
}

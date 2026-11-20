import { NextRequest, NextResponse } from "next/server";
import { OnboardingService } from "@/backend/services/onboardingService";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { status, adminNotes } = body;
    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required" },
        { status: 400 }
      );
    }

    const updated = await OnboardingService.updateStatus(id, status, adminNotes);

    return NextResponse.json({
      success: true,
      onboarding: updated,
    });
  } catch (error: any) {
    console.error("Error updating onboarding status:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update record" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await OnboardingService.delete(id);

    return NextResponse.json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting onboarding record:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete record" },
      { status: 500 }
    );
  }
}

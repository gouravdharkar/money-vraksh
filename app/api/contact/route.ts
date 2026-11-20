import { NextRequest, NextResponse } from "next/server";
import { db } from "@/backend/db/client";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, service, message } = await req.json();

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields (Name, Email, and Phone Number are required)" },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).trim().replace(/\D/g, "");
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(fullName).trim();
    const selectedService =
      service && service !== "Select a service..." && service.trim() !== ""
        ? service.trim()
        : "General Advisory";

    // Map plan pricing based on selected service
    let priceFormatted = "₹10,000";
    if (selectedService.includes("Premium")) {
      priceFormatted = "₹25,000";
    } else if (selectedService.includes("Long-Term") || selectedService.includes("Investment")) {
      priceFormatted = "₹15,000";
    } else {
      priceFormatted = "₹10,000";
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const inquiryNote =
      message && message.trim()
        ? `Customer Enquiry Message:\n"${message.trim()}"`
        : "Website Contact Form Submission";

    // Persist inquiry directly to the clientOnboarding database table
    const newLead = await db.clientOnboarding.create({
      data: {
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        pan: "ENQUIRY", // Initial inquiry from website contact form
        serviceTitle: selectedService,
        planLabel: "Website Contact Form",
        priceFormatted,
        stepReached: 1,
        status: "LEAD_CAPTURED",
        paymentMethod: "NOT_INITIATED",
        adminNotes: inquiryNote,
        ipAddress: clientIp,
      },
    });

    console.log("Contact inquiry recorded in database successfully:", {
      id: newLead.id,
      fullName: newLead.fullName,
      email: newLead.email,
      phone: newLead.phone,
      serviceTitle: newLead.serviceTitle,
    });

    return NextResponse.json({ success: true, leadId: newLead.id }, { status: 200 });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to process inquiry request" },
      { status: 500 }
    );
  }
}

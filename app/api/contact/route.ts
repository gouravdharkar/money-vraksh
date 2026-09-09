// TODO: Re-enable Resend email sending once RESEND_API_KEY is configured.
// Original implementation is preserved below as a comment.
// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY);

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, service, message } = await req.json();

    if (!fullName || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // --- Resend integration disabled until API key is provided ---
    // const data = await resend.emails.send({
    //   from: "MoneyVriksh <onboarding@resend.dev>",
    //   to: "dharkargourav@gmail.com",
    //   subject: `New Contact Form Submission from ${fullName}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${fullName}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Phone:</strong> ${phone}</p>
    //     <p><strong>Service Interest:</strong> ${service}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });

    console.log("Contact form submission received (email sending disabled):", {
      fullName,
      email,
      phone,
      service,
      message,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

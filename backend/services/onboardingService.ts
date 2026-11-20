import { db } from "../db/client";
import { OnboardingData, OnboardingFilter, AdminStats } from "../models/types";

export class OnboardingService {
  /**
   * Create new onboarding lead or update existing one as customer advances through steps
   */
  static async createOrUpdate(data: OnboardingData) {
    const cleanPhone = (data.phone || "").trim().replace(/\D/g, "");
    const cleanPan = (data.pan || "").trim().toUpperCase();
    const cleanEmail = (data.email || "").trim().toLowerCase();
    const cleanName = (data.fullName || "").trim();

    if (data.id) {
      // Check if record exists
      const existing = await db.clientOnboarding.findUnique({
        where: { id: data.id },
      });

      if (existing) {
        return await db.clientOnboarding.update({
          where: { id: data.id },
          data: {
            userId: data.userId || existing.userId,
            fullName: cleanName || existing.fullName,
            email: cleanEmail || existing.email,
            phone: cleanPhone || existing.phone,
            pan: cleanPan || existing.pan,
            serviceTitle: data.serviceTitle || existing.serviceTitle,
            planLabel: data.planLabel || existing.planLabel,
            priceFormatted: data.priceFormatted || existing.priceFormatted,
            stepReached: data.stepReached !== undefined ? Math.max(data.stepReached, existing.stepReached) : existing.stepReached,
            status: data.status || existing.status,
            signedDocumentName: data.signedDocumentName !== undefined ? data.signedDocumentName : existing.signedDocumentName,
            signatureType: data.signatureType !== undefined ? data.signatureType : existing.signatureType,
            signatureData: data.signatureData !== undefined ? data.signatureData : existing.signatureData,
            paymentMethod: data.paymentMethod || existing.paymentMethod,
            utrReference: data.utrReference || existing.utrReference,
            ipAddress: data.ipAddress || existing.ipAddress,
          },
        });
      }
    }

    // Try finding recent duplicate lead with same user, phone or email to update rather than creating noise
    if (data.userId || cleanPhone || cleanEmail) {
      const existingRecent = await db.clientOnboarding.findFirst({
        where: {
          OR: [
            ...(data.userId ? [{ userId: data.userId }] : []),
            ...(cleanPhone ? [{ phone: cleanPhone }] : []),
            ...(cleanEmail ? [{ email: cleanEmail }] : []),
          ],
        },
        orderBy: { createdAt: "desc" },
      });

      if (existingRecent && existingRecent.status !== "VERIFIED_ACTIVE") {
        return await db.clientOnboarding.update({
          where: { id: existingRecent.id },
          data: {
            userId: data.userId || existingRecent.userId,
            fullName: cleanName || existingRecent.fullName,
            email: cleanEmail || existingRecent.email,
            phone: cleanPhone || existingRecent.phone,
            pan: cleanPan || existingRecent.pan,
            serviceTitle: data.serviceTitle || existingRecent.serviceTitle,
            planLabel: data.planLabel || existingRecent.planLabel,
            priceFormatted: data.priceFormatted || existingRecent.priceFormatted,
            stepReached: data.stepReached !== undefined ? Math.max(data.stepReached, existingRecent.stepReached) : existingRecent.stepReached,
            status: data.status || existingRecent.status,
            signedDocumentName: data.signedDocumentName || existingRecent.signedDocumentName,
            signatureType: data.signatureType || existingRecent.signatureType,
            signatureData: data.signatureData || existingRecent.signatureData,
          },
        });
      }
    }

    // Create new lead record
    return await db.clientOnboarding.create({
      data: {
        userId: data.userId || null,
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        pan: cleanPan,
        serviceTitle: data.serviceTitle || "Research Advisory",
        planLabel: data.planLabel || "Standard Plan",
        priceFormatted: data.priceFormatted || "₹0",
        stepReached: data.stepReached || 2,
        status: data.status || "LEAD_CAPTURED",
        signedDocumentName: data.signedDocumentName || null,
        signatureType: data.signatureType || null,
        signatureData: data.signatureData || null,
        paymentMethod: data.paymentMethod || "UPI_QR",
        utrReference: data.utrReference || null,
        ipAddress: data.ipAddress || null,
      },
    });
  }

  /**
   * Fetch paginated list of client onboardings with search and filters
   */
  static async getAll(filter: OnboardingFilter = {}) {
    const { search, status, service, page = 1, limit = 50 } = filter;
    const skip = (page - 1) * limit;

    const whereConditions: any[] = [];

    if (status && status !== "ALL") {
      if (status === "AGREEMENT_SIGNED") {
        whereConditions.push({
          OR: [
            { status: "AGREEMENT_SIGNED" },
            { status: "PAYMENT_SUBMITTED" },
            { status: "VERIFIED_ACTIVE" },
            { signedDocumentName: { not: null } },
            { stepReached: { gte: 6 } },
          ],
        });
      } else {
        whereConditions.push({ status });
      }
    }

    if (service && service !== "ALL") {
      whereConditions.push({ serviceTitle: { contains: service } });
    }

    if (search && search.trim()) {
      const q = search.trim();
      whereConditions.push({
        OR: [
          { fullName: { contains: q } },
          { email: { contains: q } },
          { phone: { contains: q } },
          { pan: { contains: q } },
          { serviceTitle: { contains: q } },
          { signedDocumentName: { contains: q } },
        ],
      });
    }

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    const [items, total] = await Promise.all([
      db.clientOnboarding.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.clientOnboarding.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single onboarding submission by ID
   */
  static async getById(id: string) {
    return await db.clientOnboarding.findUnique({
      where: { id },
    });
  }

  /**
   * Get all purchased subscriptions and agreements for an authenticated user
   */
  static async getUserSubscriptions(user: { id: string; email?: string; phone?: string }) {
    const cleanEmail = (user.email || "").trim().toLowerCase();

    // STRICT MATCHING:
    // Only return subscriptions that belong to this user account (userId === user.id)
    // or where the email address exactly matches this user's email.
    // NEVER match loosely by phone number, because phone numbers can match older test leads.
    // AND only return actual purchased/signed agreements, NOT uncompleted initial leads (LEAD_CAPTURED).
    return await db.clientOnboarding.findMany({
      where: {
        AND: [
          {
            OR: [
              { userId: user.id },
              ...(cleanEmail ? [{ email: cleanEmail }] : []),
            ],
          },
          {
            pan: { not: "ENQUIRY" },
          },
          {
            OR: [
              { status: { in: ["AGREEMENT_SIGNED", "PAYMENT_SUBMITTED", "VERIFIED_ACTIVE"] } },
              { signedDocumentName: { not: null } },
            ],
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Update client onboarding status (e.g. from Admin Panel)
   */
  static async updateStatus(id: string, status: string, adminNotes?: string) {
    const updateData: any = { status };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    return await db.clientOnboarding.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete an onboarding or inquiry record by ID
   */
  static async delete(id: string) {
    return await db.clientOnboarding.delete({
      where: { id },
    });
  }

  /**
   * Calculate dashboard metrics & KPI stats
   */
  static async getStats(): Promise<AdminStats> {
    const all = await db.clientOnboarding.findMany({
      select: { status: true, priceFormatted: true },
    });

    let totalLeads = all.length;
    let agreementsSigned = 0;
    let paymentsSubmitted = 0;
    let verifiedActive = 0;
    let totalRevenuePotential = 0;

    for (const item of all) {
      const amount = parseInt(item.priceFormatted.replace(/\D/g, ""), 10) || 0;
      totalRevenuePotential += amount;

      if (item.status === "AGREEMENT_SIGNED") agreementsSigned++;
      if (item.status === "PAYMENT_SUBMITTED") {
        paymentsSubmitted++;
        agreementsSigned++;
      }
      if (item.status === "VERIFIED_ACTIVE") {
        verifiedActive++;
        agreementsSigned++;
      }
    }

    return {
      totalLeads,
      agreementsSigned,
      paymentsSubmitted,
      verifiedActive,
      totalRevenuePotential,
    };
  }

  /**
   * Export all client records as CSV string for SEBI compliance audit
   */
  static async exportCsv(): Promise<string> {
    const items = await db.clientOnboarding.findMany({
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "ID",
      "Date & Time (IST)",
      "Full Name",
      "Email Address",
      "Mobile Number",
      "PAN Card",
      "Service Name",
      "Plan Duration",
      "Amount",
      "Status",
      "Step Reached",
      "Signed Document Name",
      "Signature Type",
      "Payment Mode",
      "Admin Notes",
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = items.map((item) => [
      escapeCsv(item.id),
      escapeCsv(new Date(item.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })),
      escapeCsv(item.fullName),
      escapeCsv(item.email),
      escapeCsv(item.phone),
      escapeCsv(item.pan),
      escapeCsv(item.serviceTitle),
      escapeCsv(item.planLabel),
      escapeCsv(item.priceFormatted),
      escapeCsv(item.status),
      escapeCsv(item.stepReached),
      escapeCsv(item.signedDocumentName),
      escapeCsv(item.signatureType),
      escapeCsv(item.paymentMethod),
      escapeCsv(item.adminNotes),
    ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }
}

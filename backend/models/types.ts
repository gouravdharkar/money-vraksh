export type OnboardingStatus =
  | "LEAD_CAPTURED"
  | "AGREEMENT_SIGNED"
  | "PAYMENT_SUBMITTED"
  | "VERIFIED_ACTIVE"
  | "REJECTED";

export interface OnboardingData {
  id?: string;
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  pan: string;
  serviceTitle: string;
  planLabel: string;
  priceFormatted: string;
  stepReached?: number;
  status?: OnboardingStatus;
  signedDocumentName?: string;
  signatureType?: "draw" | "select" | string;
  signatureData?: string;
  paymentMethod?: string;
  utrReference?: string;
  adminNotes?: string;
  ipAddress?: string;
}

export interface OnboardingFilter {
  search?: string;
  status?: string;
  service?: string;
  page?: number;
  limit?: number;
}

export interface AdminStats {
  totalLeads: number;
  agreementsSigned: number;
  paymentsSubmitted: number;
  verifiedActive: number;
  totalRevenuePotential: number;
}

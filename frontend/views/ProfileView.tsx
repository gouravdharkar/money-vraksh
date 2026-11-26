"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/public/logo1.jpeg";
import { useAuth } from "@/frontend/components/AuthProvider";
import { useTheme } from "@/frontend/components/ThemeProvider";

interface SubscriptionItem {
  id: string;
  userId?: string | null;
  fullName: string;
  email: string;
  phone: string;
  pan: string;
  serviceTitle: string;
  planLabel: string;
  priceFormatted: string;
  stepReached: number;
  status: string;
  signedDocumentName?: string | null;
  signatureType?: string | null;
  signatureData?: string | null;
  paymentMethod?: string | null;
  utrReference?: string | null;
  adminNotes?: string | null;
  createdAt: string;
}

export default function ProfileView() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgreement, setSelectedAgreement] = useState<SubscriptionItem | null>(null);

  // Auth gate: redirect to login immediately if user is logged out
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/profile");
    }
  }, [user, authLoading, router]);

  // Load user's subscriptions
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    setLoading(true);

    fetch("/api/user/services")
      .then((res) => {
        if (res.status === 401) {
          router.replace("/login?redirect=/profile");
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          setSubscriptions(data.subscriptions || []);
        } else {
          setError(data.error || "Failed to load services");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.message !== "Unauthorized") {
          setError("Network error loading your services");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user, router]);

  // Unauthenticated loading state
  if (authLoading || (!user && !error)) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-6 ${
          isLight ? "bg-slate-50 text-slate-900" : "bg-[#060b14] text-white"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold opacity-75">Loading your advisory profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const activeServices = subscriptions.filter(
    (s) => s.status === "VERIFIED_ACTIVE"
  ).length;
  const pendingServices = subscriptions.filter(
    (s) => s.status === "PAYMENT_SUBMITTED" || s.status === "AGREEMENT_SIGNED"
  ).length;

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return isoStr;
    }
  };

  const maskPan = (panStr: string) => {
    if (!panStr || panStr.length < 5) return panStr || "N/A";
    return panStr.slice(0, 2) + "•••••" + panStr.slice(-2);
  };

  return (
    <div
      className={`min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isLight ? "bg-slate-50 text-slate-900" : "bg-[#060b14] text-white"
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium opacity-70">
            <Link href="/" className="hover:text-emerald-500 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-emerald-500 font-bold">My Profile &amp; Services</span>
          </div>

          <Link
            href="/#services"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            <span>Browse All Advisory Services</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Profile Card */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
            isLight
              ? "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
              : "bg-[#0b121e]/90 border-white/10 text-white shadow-black/60"
          }`}
        >
          {/* Background decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center text-2xl sm:text-3xl font-black uppercase shadow-lg shadow-emerald-500/20 shrink-0">
                {user.username.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{user.username}</h1>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
                      isLight
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    Verified Client
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 flex-wrap text-xs sm:text-sm opacity-80">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-emerald-500">mail</span>
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <span className="material-symbols-outlined text-base text-emerald-500">call</span>
                    +91 {user.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.replace("/");
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition-colors cursor-pointer ${
                  isLight
                    ? "border-rose-300 text-rose-700 hover:bg-rose-50"
                    : "border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                }`}
              >
                <span className="material-symbols-outlined text-base">logout</span>
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
            <div
              className={`p-4 rounded-2xl border ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/5"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Purchased Services
              </p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-500 mt-1">
                {subscriptions.length}
              </p>
              <p className="text-[11px] opacity-60 mt-0.5">Total advisory subscriptions</p>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/5"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Active Research
              </p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-500 mt-1">
                {activeServices}
              </p>
              <p className="text-[11px] opacity-60 mt-0.5">Approved &amp; active recommendations</p>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/5"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Under Verification
              </p>
              <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
                {pendingServices}
              </p>
              <p className="text-[11px] opacity-60 mt-0.5">Agreements &amp; payment confirmation</p>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Purchased Services &amp; Signed Agreements
            </h2>
            <p className="text-xs sm:text-sm opacity-70 mt-0.5">
              Access your subscribed SEBI research advisory packages, payment receipts, and compliance agreements.
            </p>
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div
            className={`p-12 rounded-3xl border flex flex-col items-center justify-center gap-3 ${
              isLight ? "bg-white border-slate-200" : "bg-[#0b121e] border-white/10"
            }`}
          >
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold opacity-70">Fetching your subscribed services...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl border border-rose-300 bg-rose-50 text-rose-800 text-sm font-semibold">
            {error}
          </div>
        ) : subscriptions.length === 0 ? (
          /* Empty state */
          <div
            className={`p-10 sm:p-14 rounded-3xl border text-center flex flex-col items-center justify-center ${
              isLight ? "bg-white border-slate-200 text-slate-800" : "bg-[#0b121e] border-white/10 text-white"
            }`}
          >
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5 border border-emerald-500/20 shadow-inner">
              <span className="material-symbols-outlined text-4xl">inventory_2</span>
            </div>
            <h3 className="text-xl font-black tracking-tight">No Subscribed Services Found</h3>
            <p className="text-xs sm:text-sm opacity-75 max-w-md mt-2 leading-relaxed">
              You haven&apos;t subscribed to any research advisory service yet. Choose a plan to unlock verified market recommendations, risk management strategies, and legally compliant SEBI MITC agreements.
            </p>
            <Link
              href="/#services"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-bg-primary text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(78,222,163,0.4)] transition-all"
            >
              <span className="material-symbols-outlined text-lg">explore</span>
              <span>Explore Research Services</span>
            </Link>
          </div>
        ) : (
          /* Subscriptions Grid */
          <div className="grid grid-cols-1 gap-5">
            {subscriptions.map((sub) => {
              const isPaymentSubmitted = sub.status === "PAYMENT_SUBMITTED";
              const isVerifiedActive = sub.status === "VERIFIED_ACTIVE";
              const isAgreementSigned = sub.status === "AGREEMENT_SIGNED";

              return (
                <div
                  key={sub.id}
                  className={`p-6 sm:p-7 rounded-3xl border transition-all duration-200 relative overflow-hidden shadow-lg ${
                    isLight
                      ? "bg-white border-slate-200 text-slate-900 hover:border-emerald-400/60 shadow-slate-200/50"
                      : "bg-[#0b121e]/90 border-white/10 text-white hover:border-emerald-500/40 shadow-black/60"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Service Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          {sub.planLabel || "Research Advisory"}
                        </span>

                        {/* Status Badge */}
                        {isVerifiedActive ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Active Advisory Subscription
                          </span>
                        ) : isPaymentSubmitted ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            Payment Submitted • Verification Pending
                          </span>
                        ) : isAgreementSigned ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-500" />
                            Agreement Signed
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-500 dark:text-slate-400 border border-slate-500/40 flex items-center gap-1.5">
                            Onboarding Initiated
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                        {sub.serviceTitle}
                      </h3>

                      {/* Details row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs opacity-80 pt-2">
                        <div>
                          <p className="font-semibold opacity-60">Advisory Fee</p>
                          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {sub.priceFormatted || "₹0"}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold opacity-60">Subscribed On</p>
                          <p className="font-medium mt-0.5">{formatDate(sub.createdAt)}</p>
                        </div>
                        <div>
                          <p className="font-semibold opacity-60">Payment Mode</p>
                          <p className="font-medium mt-0.5">{sub.paymentMethod || "UPI QR Code"}</p>
                        </div>
                        <div>
                          <p className="font-semibold opacity-60">Client PAN</p>
                          <p className="font-mono font-medium mt-0.5">{maskPan(sub.pan)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 self-start lg:self-center">
                      <button
                        type="button"
                        onClick={() => setSelectedAgreement(sub)}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                      >
                        <span className="material-symbols-outlined text-base">description</span>
                        <span>View Signed Agreement</span>
                      </button>

                      <a
                        href={`https://wa.me/919827562967?text=${encodeURIComponent(
                          `Hi Gourav Sir, I am subscribed to ${sub.serviceTitle} (${sub.planLabel}) with Money Vriksh (Client: ${user.username}, Mobile: +91 ${user.phone}). I would like advisory assistance.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-colors ${
                          isLight
                            ? "border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                            : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">chat</span>
                        <span>WhatsApp Support</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Signed MITC Agreement Full Modal */}
      {selectedAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div
            className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden animate-fade-in my-auto ${
              isLight ? "bg-white text-slate-900 border-slate-200" : "bg-[#0b121e] text-white border-white/15"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">verified_user</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">
                    Signed MITC Compliance Agreement
                  </h3>
                  <p className="text-xs opacity-70">
                    SEBI Prescribed Agreement Copy • Money Vriksh Research
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/15 text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors cursor-pointer"
                  title="Print / Save PDF"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAgreement(null)}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed">
              {/* Document Header Card */}
              <div
                className={`p-5 rounded-2xl border text-center space-y-2 ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"
                }`}
              >
                <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden mb-1">
                  <Image src={logoImg} alt="Money Vriksh Logo" fill className="object-cover" />
                </div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-emerald-600 dark:text-emerald-400">
                  Money Vriksh Research
                </h2>
                <h4 className="text-sm sm:text-base font-bold tracking-tight">
                  MOST IMPORTANT TERMS AND CONDITIONS (MITC)
                </h4>
                <div className="text-xs opacity-80 space-y-0.5">
                  <p>
                    <strong>Gourav Dharkar</strong> | SEBI Registration No. <strong>INH000025300</strong> | BSE RA Enlistment No. <strong>6983</strong>
                  </p>
                  <p>Website: www.moneyvrikshresearch.com | Email: info@moneyvrikshresearch.com | Contact: +91 9827562967</p>
                  <p>Office Address: Office No. 107, Vikram Urbane, Vijay Nagar, Indore - 452010</p>
                  <p className="text-[11px] opacity-70 italic">
                    Prescribed MITC: Annexure A to SEBI Circular No. SEBI/HO/MIRSD/MIRSD-PoD/P/CIR/2025/20 dated 17 February 2025.
                  </p>
                </div>
              </div>

              {/* Service & Client Summary Box */}
              <div
                className={`p-4 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs ${
                  isLight ? "bg-emerald-50/60 border-emerald-200" : "bg-emerald-950/20 border-emerald-500/20"
                }`}
              >
                <div>
                  <span className="opacity-60 block">Advisory Service:</span>
                  <span className="font-bold">{selectedAgreement.serviceTitle}</span>
                </div>
                <div>
                  <span className="opacity-60 block">Plan &amp; Fee:</span>
                  <span className="font-bold">
                    {selectedAgreement.planLabel} — {selectedAgreement.priceFormatted}
                  </span>
                </div>
                <div>
                  <span className="opacity-60 block">Client Legal Name:</span>
                  <span className="font-bold">
                    {selectedAgreement.signedDocumentName || selectedAgreement.fullName}
                  </span>
                </div>
                <div>
                  <span className="opacity-60 block">Client PAN Card:</span>
                  <span className="font-mono font-bold">{selectedAgreement.pan}</span>
                </div>
              </div>

              {/* 12 Prescribed MITC Clauses */}
              <div className="space-y-3.5 border-t border-b border-slate-200 dark:border-white/10 py-5">
                <h5 className="font-bold uppercase tracking-wider text-xs text-emerald-600 dark:text-emerald-400">
                  Forming part of the Terms and Conditions for providing research services
                </h5>
                <p className="text-xs opacity-80">
                  These Most Important Terms and Conditions apply to research services provided by Money Vriksh Research (the &ldquo;Research Analyst&rdquo; or &ldquo;RA&rdquo;) and must be read together with the complete Terms and Conditions of research services.
                </p>

                <ol className="list-decimal pl-5 space-y-2.5 text-xs sm:text-sm">
                  <li>
                    These terms and conditions, and consent thereon, are for the research services provided by the Research Analyst (RA). The RA cannot execute or carry out any trade (purchase/sell transaction) on behalf of the client. Clients are advised not to permit the RA to execute any trade on their behalf.
                  </li>
                  <li>
                    The fee charged by the RA to the client will be subject to the maximum amount prescribed by SEBI / Research Analyst Administration and Supervisory Body (RAASB) from time to time (applicable only for Individual and HUF clients).
                    <div className="pl-4 mt-1 space-y-0.5 text-xs opacity-85">
                      <p>2.1. The fee limit stated in the cited MITC circular is ₹1,51,000 per annum per family of client for all research services of the RA.</p>
                      <p>2.2. The fee limit does not include statutory charges.</p>
                      <p>2.3. The fee limits do not apply to a non-individual client / accredited investor.</p>
                    </div>
                  </li>
                  <li>
                    The RA may charge fees in advance if agreed by the client. Such advance shall not exceed the period stipulated by SEBI; presently, it is one quarter. In case of premature termination of the RA services by either the client or the RA, the client shall be entitled to seek refund of proportionate fees only for the unexpired period.
                  </li>
                  <li>
                    Fees to the RA may be paid by the client through specified modes such as cheque, online bank transfer, UPI, etc. Cash payment is not allowed. Optionally, the client may make payments through the Centralized Fee Collection Mechanism (CeFCoM) managed by BSE Limited (currently recognized RAASB).
                  </li>
                  <li>
                    The RA is required to abide by applicable regulations, circulars and directions specified by SEBI and RAASB from time to time in relation to disclosure and mitigation of any actual or potential conflict of interest. The RA will endeavour to promptly inform the client of any conflict of interest that may affect the services being rendered to the client.
                  </li>
                  <li>
                    Any assured / guaranteed / fixed-return schemes or any other schemes of a similar nature are prohibited by law. No scheme of this nature shall be offered to the client by the RA.
                  </li>
                  <li>
                    The RA cannot guarantee returns, profits, accuracy or risk-free investments from the use of the RA&apos;s research services. All opinions, projections and estimates of the RA are based on analysis of available data under certain assumptions as of the date of preparation / publication of the research report.
                  </li>
                  <li>
                    Any investment made based on recommendations in research reports is subject to market risks, and recommendations do not provide any assurance of returns. There is no recourse to claim any losses incurred on investments made based on recommendations in the research report. Any reliance placed on the research report provided by the RA shall be as per the client&apos;s own judgement and assessment of the conclusions contained in the research report.
                  </li>
                  <li>
                    SEBI registration, enlistment with RAASB and NISM certification do not guarantee the performance of the RA or assure any returns to the client.
                  </li>
                  <li>
                    For any grievances:
                    <div className="pl-4 mt-1 space-y-0.5 text-xs opacity-85">
                      <p><strong>Step 1:</strong> The client should first contact the RA using the details on the RA&apos;s website or the contact details provided in the Grievance Redressal / Escalation Matrix.</p>
                      <p><strong>Step 2:</strong> If the resolution is unsatisfactory, the client can also lodge grievances through SEBI&apos;s SCORES platform: <span className="font-mono text-emerald-500">https://scores.sebi.gov.in</span>.</p>
                      <p><strong>Step 3:</strong> The client may also consider online dispute resolution through the SMART ODR portal: <span className="font-mono text-emerald-500">https://smartodr.in</span>.</p>
                    </div>
                  </li>
                  <li>
                    Clients are required to keep contact details, including email ID and mobile number(s), updated with the RA at all times.
                  </li>
                  <li>
                    The RA shall never ask for the client&apos;s login credentials and OTPs for the client&apos;s Trading Account, Demat Account and Bank Account. Never share such information with anyone, including the RA.
                  </li>
                </ol>
              </div>

              {/* Client Acknowledgement and Consent Box with Real Canvas Signature */}
              <div
                className={`p-5 rounded-2xl border space-y-4 ${
                  isLight ? "bg-slate-50 border-slate-300" : "bg-white/5 border-white/15"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    Client Acknowledgement &amp; Consent
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Legally Executed eSign
                  </span>
                </div>

                <p className="text-xs opacity-80 leading-relaxed">
                  I / We acknowledge that I / we have received, read and understood these MITC and the complete Terms and Conditions for research services of Money Vriksh Research. I / We have had the opportunity to seek clarification and voluntarily agree to these terms. I / We understand that the RA does not execute trades on my / our behalf and that securities-market investments are subject to market risks.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="opacity-60 block">Client Full Name:</span>
                      <span className="font-bold text-sm">
                        {selectedAgreement.signedDocumentName || selectedAgreement.fullName}
                      </span>
                    </div>
                    <div>
                      <span className="opacity-60 block">Permanent Account Number (PAN):</span>
                      <span className="font-mono font-bold">{selectedAgreement.pan}</span>
                    </div>
                    <div>
                      <span className="opacity-60 block">Execution Timestamp (IST):</span>
                      <span className="font-mono">{formatDate(selectedAgreement.createdAt)}</span>
                    </div>
                    <div>
                      <span className="opacity-60 block">Execution Place / Mode:</span>
                      <span>Digital eSign Portal (Online Execution)</span>
                    </div>
                  </div>

                  {/* Signature Display Frame */}
                  <div className="p-4 bg-white rounded-xl border border-slate-300 flex flex-col items-center justify-center text-slate-900 min-h-[110px] relative shadow-inner">
                    {selectedAgreement.signatureData ? (
                      <div className="w-full flex flex-col items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedAgreement.signatureData}
                          alt={`Official signature of ${selectedAgreement.signedDocumentName || selectedAgreement.fullName}`}
                          className="h-20 max-w-[280px] object-contain filter contrast-125"
                        />
                        <div className="w-48 h-[1px] bg-slate-300 mt-2" />
                        <span className="text-[10px] font-mono text-slate-500 mt-1">
                          Digitally Drawn Signature on Screen
                        </span>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <span className="font-instrument italic text-2xl font-bold text-emerald-800 tracking-tight">
                          {selectedAgreement.signedDocumentName || selectedAgreement.fullName}
                        </span>
                        <div className="w-48 h-[1px] bg-slate-300 mx-auto mt-2" />
                        <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                          Digital Verified Font Signature
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] opacity-70">
                SEBI Registration No. INH000025300 • Gourav Dharkar
              </span>
              <button
                type="button"
                onClick={() => setSelectedAgreement(null)}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors cursor-pointer"
              >
                Close Agreement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

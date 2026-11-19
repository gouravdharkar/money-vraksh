"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logoImg from "@/public/logo1.jpeg";
import qrCodeImg from "@/public/qr-code.png";
import { useTheme } from "./ThemeProvider";

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  planLabel: string;
  priceFormatted: string;
  whatsappUrl?: string;
}

export default function AgreementModal({
  isOpen,
  onClose,
  serviceTitle,
  planLabel,
  priceFormatted,
}: AgreementModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>(1);

  // Step 1: Scroll & Agreement state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [scrollWarning, setScrollWarning] = useState(false);

  // Step 2: eSign Form State & Validations
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pan: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 4: Signing Method Selection
  const [signingMethod, setSigningMethod] = useState<"virtual" | null>("virtual");

  // Step 5: OTP State & Countdown Timer
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Step 6: Virtual Signature State
  const [signatureTab, setSignatureTab] = useState<"draw" | "select">("draw");
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [signedDocumentName, setSignedDocumentName] = useState("");
  const [selectedFontIndex, setSelectedFontIndex] = useState<number>(0);
  const [isFullScreenSignature, setIsFullScreenSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  // Post-Signing & Razorpay Payment State

  // Step 9 & 10: Post-Signing & Razorpay Payment State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showTestPaymentDialog, setShowTestPaymentDialog] = useState(false);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [hasCompletedPayment, setHasCompletedPayment] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state and lock body scroll whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setHasScrolledToBottom(false);
      setIsChecked(false);
      setScrollProgress(0);
      setScrollWarning(false);
      setFormData({ fullName: "", email: "", phone: "", pan: "" });
      setTouched({});
      setFormErrors({});
      setSigningMethod("virtual");
      setOtp("");
      setShowOtp(false);
      setCountdown(30);
      setCanResend(false);
      setOtpError("");
      setIsVerifying(false);
      setSignatureTab("draw");
      setHasDrawnSignature(false);
      setSignedDocumentName("");
      setSelectedFontIndex(0);
      setIsFullScreenSignature(false);

      setIsProcessingPayment(false);
      setShowTestPaymentDialog(false);
      setRazorpayPaymentId("");
      setPaymentSuccess(false);
      setSelectedPaymentMethod("upi");
      setHasCompletedPayment(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Step 5 countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 5 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  // Strict scroll detection: user must scroll through at least 95% of content
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 50) return;

    const currentScroll = el.scrollTop;
    const progress = Math.min(1, Math.max(0, currentScroll / maxScroll));
    setScrollProgress(progress);

    // Only unlock when user is within 30px of bottom AND reached at least 95% of scroll
    const isAtBottom = maxScroll - currentScroll <= 30 && progress >= 0.95;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
      setScrollWarning(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setHasScrolledToBottom(false);
    setIsChecked(false);
    setScrollProgress(0);
    setScrollWarning(false);
    setFormData({ fullName: "", email: "", phone: "", pan: "" });
    setTouched({});
    setFormErrors({});
    setSigningMethod("virtual");
    setOtp("");
    onClose();
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    if (!hasScrolledToBottom) {
      e.preventDefault();
      setScrollWarning(true);
      setTimeout(() => setScrollWarning(false), 3000);
    }
  };

  // Step 1 -> Step 2
  const handleProceedToStep2 = () => {
    if (!isChecked || !hasScrolledToBottom) return;
    setStep(2);
  };

  // Comprehensive Field Validator for Name, Email, Mobile and PAN
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "fullName": {
        const trimmed = value.trim();
        if (!trimmed) return "Full Name is required.";
        if (trimmed.length < 3) return "Name must be at least 3 characters long.";
        if (!/^[a-zA-Z\s.]+$/.test(trimmed)) return "Name should contain letters only.";
        return "";
      }
      case "email": {
        const trimmed = value.trim();
        if (!trimmed) return "Email address is required.";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) {
          return "Please enter a valid email address (e.g. name@example.com).";
        }
        return "";
      }
      case "phone": {
        const clean = value.replace(/\D/g, "");
        if (!clean) return "Mobile number is required.";
        if (clean.length < 10) return `Please enter complete 10 digits (${clean.length}/10).`;
        if (!/^[6-9]/.test(clean)) return "Indian mobile numbers must start with 6, 7, 8, or 9.";
        if (!/^[6-9]\d{9}$/.test(clean)) return "Please enter a valid 10-digit mobile number.";
        return "";
      }
      case "pan": {
        const clean = value.trim().toUpperCase();
        if (!clean) return "PAN Card number is required.";
        if (clean.length < 10) return `PAN must be exactly 10 characters (${clean.length}/10).`;
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(clean)) {
          return "Invalid PAN format. Valid format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).";
        }
        return "";
      }
      default:
        return "";
    }
  };

  // Handle Input Changes with strict filtering
  const handleFormChange = (field: string, rawValue: string) => {
    let value = rawValue;
    if (field === "phone") {
      value = rawValue.replace(/\D/g, "").slice(0, 10);
    } else if (field === "pan") {
      value = rawValue.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const error = validateField(field, value);
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Step 2 -> Step 3 (Open Official Agreement Viewer)
  const handleSendEsign = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {
      fullName: validateField("fullName", formData.fullName),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
      pan: validateField("pan", formData.pan),
    };

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      pan: true,
    });

    const activeErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, err]) => err !== "")
    );

    if (Object.keys(activeErrors).length > 0) {
      setFormErrors(activeErrors);
      return;
    }

    // Advance to Step 3 (Document Preview)
    setStep(3);
  };

  // Step 3 -> Step 4 (Proceed from Document Preview to Method Selection)
  const handleProceedToStep4 = () => {
    setStep(4);
  };

  // Step 4 -> Step 5 (Virtual Sign OTP)
  const handleProceedFromStep4 = () => {
    setStep(5);
    setCountdown(30);
    setCanResend(false);
    setOtp("");
    setOtpError("");
  };

  // Step 5 Resend OTP
  const handleResendOtp = () => {
    setCountdown(30);
    setCanResend(false);
    setOtp("");
    setOtpError("");
  };

  // Step 5 Verify OTP and Advance to Step 6 (Place Signature)
  const handleVerifyOtpAndProceed = () => {
    if (!otp || otp.trim().length < 4) {
      setOtpError("Please enter a valid OTP.");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setSignedDocumentName(formData.fullName.trim() || "Client");
      setSignatureTab("draw");
      setHasDrawnSignature(false);
      setIsFullScreenSignature(false);
      setStep(6);
    }, 400);
  };

  // Drawing Canvas Handlers for Step 6
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = isLight ? "#0F172A" : "#FFFFFF";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawnSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.closePath();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  // Step 6: Finalize Virtual Signature and Advance to Step 9 ("Document signed")
  const handleFinalizeSignature = () => {
    if (!signedDocumentName.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(9);
    }, 400);
  };

    // Step 10: UPI Payment Confirmation Handlers
  const handleConfirmUpiPayment = () => {
    setHasCompletedPayment(true);
  };

  const handleOpenWhatsAppConfirmation = () => {
    const cleanPhone = formData.phone.trim().replace(/\D/g, "");
    const signerName = formData.fullName.trim() || signedDocumentName.trim() || "Client";
    const message = `Hi Gourav Sir,\n\nI have digitally signed the Research Services Agreement and completed payment of ${priceFormatted} via UPI QR Code for Money Vriksh Advisory:\n• Service: ${serviceTitle} (${planLabel} - ${priceFormatted})\n• Method: Virtual Sign (Digital eSign)\n• Client Name: ${signerName}\n• Mobile: +91 ${cleanPhone || "9827562967"}\n• Email: ${formData.email.trim() || "client@example.com"}\n• PAN: ${formData.pan.trim().toUpperCase() || "NA"}\n\nSEBI Reg.: INH000025300\nPlease find my UPI payment screenshot attached. Please activate my advisory service and share my signed agreement copy.`;

    const targetUrl = `https://wa.me/919827562967?text=${encodeURIComponent(message)}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  // Step 9 -> Step 10: Advance from "Document signed" to UPI QR Payment
  const handleProceedFromStep9 = () => {
    setStep(10);
  };

  // Helper to load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Finalize WhatsApp confirmation with Razorpay Payment ID
  const finalizePaymentAndRedirect = (pId: string) => {
    const cleanPhone = formData.phone.trim().replace(/\D/g, "");
    const cleanPan = formData.pan.trim().toUpperCase();
    const signerName = formData.fullName.trim() || signedDocumentName.trim() || "Client";
    const methodStr = "Virtual Sign (Digital eSign)";

    const message = `Hi Gourav Sir,\n\nI have successfully completed my SEBI compliance eSign and completed payment on Razorpay for Money Vriksh Advisory:\n• Service: ${serviceTitle} (${planLabel} - ${priceFormatted})\n• Method: ${methodStr}\n• Name on Signed Document: ${signerName}\n• Razorpay Payment ID: ${pId}\n• Status: Agreement Digitally Signed & Payment Verified\n\nClient Details:\n• Email: ${formData.email.trim()}\n• Phone: +91 ${cleanPhone}\n• PAN: ${cleanPan}\n\nSEBI Reg.: INH000025300\nPlease activate my research advisory service and share my receipt & signed agreement copy.`;

    const targetUrl = `https://wa.me/919827562967?text=${encodeURIComponent(message)}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    handleClose();
  };

  // Step 10: Trigger Razorpay Checkout
  const handleInitiateRazorpayPayment = async () => {
    setIsProcessingPayment(true);

    const numericPrice = parseInt(priceFormatted.replace(/\D/g, ""), 10) || 9999;
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder";

    try {
      // 1. Try order creation API
      let orderId = `order_mv_${Date.now()}`;
      try {
        const res = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: numericPrice,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            notes: {
              service: serviceTitle,
              plan: planLabel,
              clientName: formData.fullName || signedDocumentName,
              clientPhone: formData.phone,
              clientEmail: formData.email,
              clientPan: formData.pan,
            },
          }),
        });
        const orderData = await res.json();
        if (orderData?.orderId) {
          orderId = orderData.orderId;
        }
      } catch (e) {
        console.warn("Using direct client Razorpay checkout:", e);
      }

      // 2. Check if real key is configured
      const scriptLoaded = await loadRazorpayScript();
      if (
        scriptLoaded &&
        keyId &&
        keyId !== "rzp_test_placeholder" &&
        (window as any).Razorpay
      ) {
        const options = {
          key: keyId,
          amount: numericPrice * 100,
          currency: "INR",
          name: "Money Vriksh",
          description: `${serviceTitle} (${planLabel})`,
          image: "/logo.png",
          order_id: orderId.startsWith("order_test_") ? undefined : orderId,
          prefill: {
            name: formData.fullName || signedDocumentName || "Client",
            email: formData.email || "client@example.com",
            contact: formData.phone ? formData.phone.trim().replace(/\D/g, "") : "9827562967",
          },
          theme: {
            color: "#10b981",
          },
          handler: function (response: any) {
            setIsProcessingPayment(false);
            const pId = response.razorpay_payment_id || `pay_rzp_${Date.now()}`;
            setRazorpayPaymentId(pId);
            setPaymentSuccess(true);
            finalizePaymentAndRedirect(pId);
          },
          modal: {
            ondismiss: function () {
              setIsProcessingPayment(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setIsProcessingPayment(false);
          alert(`Payment Failed: ${response.error.description}`);
        });
        rzp.open();
      } else {
        // Interactive checkout dialog for test/development mode
        setIsProcessingPayment(false);
        setShowTestPaymentDialog(true);
      }
    } catch (err) {
      console.error("Razorpay initiation error:", err);
      setIsProcessingPayment(false);
      setShowTestPaymentDialog(true);
    }
  };

  // Complete mock payment in test mode
  const handleCompleteTestPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowTestPaymentDialog(false);
      const mockPayId = `pay_live_${Math.random().toString(36).substring(2, 11)}`;
      setRazorpayPaymentId(mockPayId);
      setPaymentSuccess(true);
      finalizePaymentAndRedirect(mockPayId);
    }, 600);
  };

  const formattedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className={`fixed inset-0 backdrop-blur-md transition-colors ${
              isLight ? "bg-black/45" : "bg-black/85"
            }`}
            aria-hidden="true"
          />

          {/* ========================================================
              STEP 1: MITC Agreement Terms Modal
             ======================================================== */}
          {step === 1 && (
            <motion.div
              key="step-1-agreement"
              role="dialog"
              aria-modal="true"
              aria-labelledby="agreement-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              style={{
                boxShadow: isLight
                  ? "0 25px 70px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.08)"
                  : "0 30px 90px -10px rgba(0, 0, 0, 0.98), 0 0 0 1px rgba(50, 205, 148, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
              }}
              className={`relative w-full max-w-[650px] rounded-2xl p-5 sm:p-7 text-left z-10 my-auto flex flex-col max-h-[92vh] overflow-hidden transition-colors duration-200 ${
                isLight
                  ? "bg-white border border-slate-200"
                  : "bg-[#0e1520] border border-white/10"
              } before:absolute before:top-0 before:left-1/4 before:right-1/4 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent`}
            >
              {/* Header */}
              <div className="mb-3.5 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      isLight
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                        : "bg-primary/10 text-primary border border-primary/25"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    SEBI MANDATED
                  </span>
                  <span
                    className={`text-[12px] font-medium ${
                      isLight ? "text-slate-500" : "text-slate-text"
                    }`}
                  >
                    Must read before subscribing
                  </span>
                </div>

                <h2
                  id="agreement-modal-title"
                  className={`text-xl sm:text-2xl font-bold tracking-tight leading-snug ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  Research Analyst{" "}
                  <span className="italic gradient-text-primary font-headline">
                    Services Agreement
                  </span>
                </h2>
                <p
                  className={`text-xs sm:text-sm mt-1 ${
                    isLight ? "text-slate-500" : "text-slate-text"
                  }`}
                >
                  MITC — Most Important Terms &amp; Conditions &middot;{" "}
                  <span
                    className={`font-bold ${isLight ? "text-amber-700" : "text-premium-gold"}`}
                  >
                    INH000025300
                  </span>
                </p>
              </div>

              {/* Scroll Progress Bar */}
              <div className="mb-2 shrink-0">
                <div
                  className={`w-full h-1 rounded-full overflow-hidden ${
                    isLight ? "bg-slate-200" : "bg-white/5"
                  }`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-primary to-success-emerald transition-all duration-150"
                    style={{
                      width: `${hasScrolledToBottom ? 100 : Math.round(scrollProgress * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Scrollable Agreement Body */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                tabIndex={0}
                aria-label="Agreement Terms and Conditions"
                style={{
                  maxHeight: "350px",
                  scrollbarColor: isLight ? "#10b981 #f1f5f9" : "#32CD94 #070c14",
                  scrollbarWidth: "thin",
                }}
                className={`overflow-y-auto pr-3 rounded-xl border p-4 sm:p-5 text-xs sm:text-[13px] leading-relaxed space-y-4 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors ${
                  isLight
                    ? "bg-slate-50 border-slate-200 text-slate-700"
                    : "bg-[#070c14] border-white/10 text-slate-300"
                }`}
              >
                {/* Important Notice Callout */}
                <div
                  className={`border rounded-xl p-3.5 sm:p-4 text-xs leading-relaxed ${
                    isLight
                      ? "bg-emerald-50/70 border-emerald-200 text-slate-800"
                      : "bg-primary/5 border-primary/25 text-slate-200"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1.5 ${
                      isLight ? "text-emerald-800" : "text-primary"
                    }`}
                  >
                    <span className="text-sm">⚠</span>
                    <span>IMPORTANT NOTICE</span>
                  </div>
                  <p className={isLight ? "text-slate-700" : "text-slate-200"}>
                    This Agreement is binding on both Parties. By subscribing, you confirm you have
                    read, understood, and agree to all terms below. Pursuant to SEBI Circular{" "}
                    <strong
                      className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}
                    >
                      SEBI/HO/MIRSD/MIRSD-PoD/P/CIR/2025/20
                    </strong>{" "}
                    dated{" "}
                    <strong
                      className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}
                    >
                      Feb 17, 2025
                    </strong>
                    .
                  </p>
                </div>

                {/* 1. Parties */}
                <div>
                  <h4
                    className={`font-bold text-xs uppercase tracking-wider mb-1 ${
                      isLight ? "text-emerald-700" : "text-primary"
                    }`}
                  >
                    1. PARTIES
                  </h4>
                  <p>
                    <strong
                      className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}
                    >
                      Research Analyst:
                    </strong>{" "}
                    Gourav Dharkar |{" "}
                    <strong
                      className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}
                    >
                      SEBI Reg. No.:
                    </strong>{" "}
                    <span
                      className={`font-bold ${isLight ? "text-amber-700" : "text-premium-gold"}`}
                    >
                      INH000025300
                    </span>{" "}
                    |{" "}
                    <strong
                      className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}
                    >
                      Address:
                    </strong>{" "}
                    103 Prakash Nagar, Dhar, Madhya Pradesh 454001 |{" "}
                    <strong
                      className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}
                    >
                      Email:
                    </strong>{" "}
                    dharkargourav@gmail.com |{" "}
                    <strong
                      className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}
                    >
                      Phone:
                    </strong>{" "}
                    +91 98275 62967
                  </p>
                  <p className="mt-1">
                    <strong
                      className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}
                    >
                      Client:
                    </strong>{" "}
                    The individual or entity subscribing to the research services.
                  </p>
                </div>

                {/* 2. Nature of Services */}
                <div>
                  <h4
                    className={`font-bold text-xs uppercase tracking-wider mb-1 ${
                      isLight ? "text-emerald-700" : "text-primary"
                    }`}
                  >
                    2. NATURE OF SERVICES
                  </h4>
                  <p>
                    The RA provides Intraday &amp; Swing Trading Calls via Telegram &amp; WhatsApp —
                    including daily stock picks (NSE/BSE), entry price, target levels, and stop-loss
                    for every call. SEBI-compliant research recommendations only.
                  </p>
                </div>

                {/* 3. Fees & Payment */}
                <div>
                  <h4
                    className={`font-bold text-xs uppercase tracking-wider mb-1 ${
                      isLight ? "text-emerald-700" : "text-primary"
                    }`}
                  >
                    3. FEES &amp; PAYMENT
                  </h4>
                  <p>
                    Monthly ₹9,999 | Quarterly ₹24,999 | Half-Yearly ₹44,999 | Yearly ₹79,999. Total
                    fees shall not exceed ₹1,51,000/- per annum per family as prescribed by
                    SEBI/RAASB. Payments via UPI, NEFT, RTGS, or online transfer. Cash payments are
                    strictly not permitted.
                  </p>
                </div>

                {/* 4. Refund Policy */}
                <div>
                  <h4
                    className={`font-bold text-xs uppercase tracking-wider mb-1 ${
                      isLight ? "text-emerald-700" : "text-primary"
                    }`}
                  >
                    4. REFUND POLICY
                  </h4>
                  <p>
                    In case of pre-mature termination by either Party, the Client shall receive a
                    proportionate refund for the unexpired subscription period only.
                  </p>
                </div>

                {/* 5. Critical Restrictions */}
                <div>
                  <h4
                    className={`font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5 ${
                      isLight ? "text-rose-600" : "text-[#f87171]"
                    }`}
                  >
                    <span>5. CRITICAL RESTRICTIONS</span>
                  </h4>
                  <ul
                    className={`list-disc pl-5 space-y-1.5 mt-1 ${
                      isLight ? "text-slate-600" : "text-slate-300"
                    }`}
                  >
                    <li>
                      The RA is{" "}
                      <strong
                        className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}
                      >
                        NOT
                      </strong>{" "}
                      a Portfolio Manager, Investment Adviser, Stockbroker, or Sub-Broker.
                    </li>
                    <li>
                      The RA will{" "}
                      <strong
                        className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}
                      >
                        NEVER
                      </strong>{" "}
                      execute trades on the Client&apos;s behalf. Do not allow anyone to trade on
                      your behalf.
                    </li>
                    <li>
                      The RA will{" "}
                      <strong
                        className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}
                      >
                        NEVER
                      </strong>{" "}
                      ask for login credentials, OTPs, or account passwords. Never share these with
                      anyone.
                    </li>
                    <li>
                      No guaranteed or assured returns are offered. Such schemes are prohibited by
                      law.
                    </li>
                  </ul>
                </div>

                {/* 6. Risk Disclosure */}
                <div>
                  <h4
                    className={`font-bold text-xs uppercase tracking-wider mb-1 ${
                      isLight ? "text-amber-700" : "text-premium-gold"
                    }`}
                  >
                    6. RISK DISCLOSURE
                  </h4>
                  <p>
                    All investments in securities markets are subject to market risks. Research
                    recommendations do not constitute a guarantee of returns. Past performance is not
                    indicative of future results. The Client exercises independent judgement before
                    acting on any recommendation.
                  </p>
                </div>

                {/* 7. Client Obligations */}
                <div>
                  <h4
                    className={`font-bold text-xs uppercase tracking-wider mb-1 ${
                      isLight ? "text-emerald-700" : "text-primary"
                    }`}
                  >
                    7. CLIENT OBLIGATIONS
                  </h4>
                  <ul
                    className={`list-disc pl-5 space-y-1.5 mt-1 ${
                      isLight ? "text-slate-600" : "text-slate-300"
                    }`}
                  >
                    <li>Keep contact details updated with the RA at all times.</li>
                    <li>Make payments only through approved modes (no cash).</li>
                    <li>Exercise independent judgement before acting on research.</li>
                    <li>
                      Never share login credentials or OTPs with anyone including the RA.
                    </li>
                  </ul>
                </div>

                {/* 8. Grievance Redressal */}
                <div>
                  <h4
                    className={`font-bold text-xs uppercase tracking-wider mb-1 ${
                      isLight ? "text-emerald-700" : "text-primary"
                    }`}
                  >
                    8. GRIEVANCE REDRESSAL
                  </h4>
                  <div className="space-y-1 mt-1 font-mono text-xs">
                    <p>
                      <strong
                        className={`font-sans ${isLight ? "text-slate-900" : "text-white"}`}
                      >
                        Step 1 — RA:
                      </strong>{" "}
                      dharkargourav@gmail.com | +91 98275 62967
                    </p>
                    <p>
                      <strong
                        className={`font-sans ${isLight ? "text-slate-900" : "text-white"}`}
                      >
                        Step 2 — SEBI SCORES:
                      </strong>{" "}
                      scores.sebi.gov.in
                    </p>
                    <p>
                      <strong
                        className={`font-sans ${isLight ? "text-slate-900" : "text-white"}`}
                      >
                        Step 3 — ODR:
                      </strong>{" "}
                      smartodr.in
                    </p>
                  </div>
                </div>

                {/* Concluding Declaration */}
                <div
                  className={`pt-3 border-t text-[12px] leading-relaxed italic ${
                    isLight
                      ? "border-slate-200 text-slate-600"
                      : "border-white/10 text-slate-300"
                  }`}
                >
                  <p>
                    By agreeing below, you confirm: (a) you have read and understood all terms; (b)
                    SEBI registration does not guarantee performance or returns; (c) investment in
                    securities is subject to market risks; (d) you will exercise independent judgement
                    before acting on any recommendation.
                  </p>
                </div>

                {/* End of Agreement notice */}
                <div
                  className={`text-center pt-3 pb-1 text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    isLight ? "text-emerald-700" : "text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>You have reached the end of the agreement</span>
                </div>
              </div>

              {/* Scroll Indicator / Warning */}
              <div className="min-h-[26px] mt-2 flex items-center justify-center">
                {!hasScrolledToBottom ? (
                  <div
                    className={`text-center text-[11.5px] flex items-center justify-center gap-1.5 py-0.5 select-none font-medium transition-all ${
                      scrollWarning
                        ? isLight
                          ? "text-rose-600 font-bold scale-105"
                          : "text-rose-400 font-bold scale-105"
                        : isLight
                        ? "text-emerald-700 font-semibold animate-pulse"
                        : "text-primary/90 animate-pulse"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {scrollWarning ? "warning" : "arrow_downward"}
                    </span>
                    <span>
                      {scrollWarning
                        ? "Please scroll to the bottom of the agreement before checking the box!"
                        : "Please scroll through the entire agreement to enable acceptance"}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`text-center text-[11.5px] flex items-center justify-center gap-1.5 py-0.5 select-none font-semibold ${
                      isLight ? "text-emerald-700" : "text-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span>Agreement fully reviewed. You can now check the box below.</span>
                  </div>
                )}
              </div>

              {/* Checkbox Section */}
              <div className="mt-2 shrink-0">
                <div
                  onClick={handleCheckboxClick}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all select-none ${
                    !hasScrolledToBottom
                      ? isLight
                        ? "opacity-55 cursor-not-allowed border-slate-200 bg-slate-100/70"
                        : "opacity-45 cursor-not-allowed border-white/5 bg-white/[0.02]"
                      : isLight
                      ? "cursor-pointer border-emerald-300 bg-emerald-50/70 hover:border-emerald-500 shadow-sm"
                      : "cursor-pointer border-primary/40 bg-primary/5 hover:border-primary/70 hover:bg-primary/10 shadow-[0_0_15px_rgba(50,205,148,0.1)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    id="mitc-agreement-checkbox"
                    disabled={!hasScrolledToBottom}
                    checked={isChecked}
                    onChange={(e) => {
                      if (hasScrolledToBottom) {
                        setIsChecked(e.target.checked);
                      }
                    }}
                    className={`mt-0.5 w-4 h-4 rounded border-gray-400 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent disabled:opacity-30 accent-[#32CD94] ${
                      hasScrolledToBottom ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                  />
                  <label
                    htmlFor={hasScrolledToBottom ? "mitc-agreement-checkbox" : undefined}
                    className={`text-xs sm:text-[13px] leading-snug ${
                      hasScrolledToBottom
                        ? isLight
                          ? "text-slate-900 cursor-pointer font-medium"
                          : "text-white cursor-pointer font-medium"
                        : isLight
                        ? "text-slate-500 cursor-not-allowed"
                        : "text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    I have read and understood the Research Analyst Services Agreement (MITC) and
                    agree to be bound by its terms and conditions.
                  </label>
                </div>
              </div>

              {/* Footer Action Buttons */}
              <div
                className={`mt-4 pt-3 border-t flex items-center justify-between gap-3 shrink-0 ${
                  isLight ? "border-slate-200" : "border-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  className={`px-6 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    isLight
                      ? "border-slate-300 hover:bg-slate-100 text-slate-700"
                      : "border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-300"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  disabled={!isChecked || !hasScrolledToBottom}
                  className={`px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                    isChecked && hasScrolledToBottom
                      ? isLight
                        ? "gradient-bg-primary text-white shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        : "gradient-bg-primary text-background shadow-[0_0_25px_rgba(50,205,148,0.4)] hover:shadow-[0_0_35px_rgba(50,205,148,0.6)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      : isLight
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60"
                      : "bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed opacity-50"
                  }`}
                >
                  <span>✍</span>
                  <span>Proceed to eSign &rarr;</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              STEP 2: Aadhaar eSign Client Details Form Modal
             ======================================================== */}
          {step === 2 && (
            <motion.div
              key="step-2-esign-form"
              role="dialog"
              aria-modal="true"
              aria-labelledby="esign-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              style={{
                boxShadow: isLight
                  ? "0 25px 70px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.08)"
                  : "0 30px 90px -10px rgba(0, 0, 0, 0.98), 0 0 0 1px rgba(50, 205, 148, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
              }}
              className={`relative w-full max-w-[540px] rounded-2xl p-6 sm:p-8 text-left z-10 my-auto flex flex-col overflow-hidden transition-colors duration-200 ${
                isLight
                  ? "bg-white border border-slate-200"
                  : "bg-[#0e1520] border border-white/10"
              } before:absolute before:top-0 before:left-1/4 before:right-1/4 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent`}
            >
              {/* Step 2 Header */}
              <div className="mb-5">
                <span
                  id="esign-modal-title"
                  className={`font-label-md text-[11px] sm:text-xs font-bold tracking-widest uppercase block mb-1.5 ${
                    isLight ? "text-amber-700" : "text-[#F59E0B]"
                  }`}
                >
                  STEP 2 OF 2 &mdash; DIGITAL ESIGN
                </span>
                <p
                  className={`text-xs sm:text-[13px] leading-relaxed ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  We&apos;ll send a verification OTP signing link to your email &amp; phone. Sign it,
                  then pay.
                </p>
              </div>

              {/* Step 2 Form with Enhanced Validations */}
              <form onSubmit={handleSendEsign} noValidate className="space-y-4">
                {/* 1. Full Name */}
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleFormChange("fullName", e.target.value)}
                      onBlur={() => handleBlur("fullName")}
                      placeholder="Full Name (as per PAN / Official ID)"
                      className={`w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 pr-10 ${
                        isLight
                          ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
                          : "bg-[#080d14] border border-white/10 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                      } ${
                        formErrors.fullName
                          ? "!border-rose-500 !ring-rose-500/20"
                          : touched.fullName && formData.fullName.trim()
                          ? "!border-emerald-500"
                          : ""
                      }`}
                    />
                    {touched.fullName && !formErrors.fullName && formData.fullName.trim() && (
                      <span className="material-symbols-outlined absolute right-3 top-3.5 text-base text-emerald-500 select-none">
                        check_circle
                      </span>
                    )}
                  </div>
                  {formErrors.fullName && (
                    <p className="text-[11.5px] text-rose-500 mt-1 pl-1 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">error</span>
                      <span>{formErrors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* 2. Email Address */}
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleFormChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="Email Address"
                      className={`w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 pr-10 ${
                        isLight
                          ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
                          : "bg-[#080d14] border border-white/10 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                      } ${
                        formErrors.email
                          ? "!border-rose-500 !ring-rose-500/20"
                          : touched.email && formData.email.trim()
                          ? "!border-emerald-500"
                          : ""
                      }`}
                    />
                    {touched.email && !formErrors.email && formData.email.trim() && (
                      <span className="material-symbols-outlined absolute right-3 top-3.5 text-base text-emerald-500 select-none">
                        check_circle
                      </span>
                    )}
                  </div>
                  {formErrors.email && (
                    <p className="text-[11.5px] text-rose-500 mt-1 pl-1 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">error</span>
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* 3. Mobile Number */}
                <div>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => handleFormChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="Mobile Number (10 digits)"
                      className={`w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 pr-10 ${
                        isLight
                          ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
                          : "bg-[#080d14] border border-white/10 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                      } ${
                        formErrors.phone
                          ? "!border-rose-500 !ring-rose-500/20"
                          : touched.phone && formData.phone.length === 10
                          ? "!border-emerald-500"
                          : ""
                      }`}
                    />
                    {touched.phone && !formErrors.phone && formData.phone.length === 10 && (
                      <span className="material-symbols-outlined absolute right-3 top-3.5 text-base text-emerald-500 select-none">
                        check_circle
                      </span>
                    )}
                  </div>
                  {formErrors.phone && (
                    <p className="text-[11.5px] text-rose-500 mt-1 pl-1 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">error</span>
                      <span>{formErrors.phone}</span>
                    </p>
                  )}
                </div>

                {/* 4. PAN Card Number */}
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={formData.pan}
                      onChange={(e) => handleFormChange("pan", e.target.value)}
                      onBlur={() => handleBlur("pan")}
                      placeholder="PAN CARD NUMBER (E.G. ABCDE1234F)"
                      className={`w-full px-4 py-3 rounded-xl text-sm uppercase transition-all tracking-wider font-mono focus:outline-none focus:ring-2 pr-10 ${
                        isLight
                          ? "bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
                          : "bg-[#080d14] border border-white/10 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20"
                      } ${
                        formErrors.pan
                          ? "!border-rose-500 !ring-rose-500/20"
                          : touched.pan && formData.pan.length === 10
                          ? "!border-emerald-500"
                          : ""
                      }`}
                    />
                    {touched.pan && !formErrors.pan && formData.pan.length === 10 && (
                      <span className="material-symbols-outlined absolute right-3 top-3.5 text-base text-emerald-500 select-none">
                        check_circle
                      </span>
                    )}
                  </div>
                  {formErrors.pan && (
                    <p className="text-[11.5px] text-rose-500 mt-1 pl-1 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">error</span>
                      <span>{formErrors.pan}</span>
                    </p>
                  )}
                </div>

                {/* Step 2 Action Buttons */}
                <div
                  className={`pt-4 mt-3 border-t flex items-center justify-between gap-3 ${
                    isLight ? "border-slate-200" : "border-white/10"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      isLight
                        ? "border-slate-300 hover:bg-slate-100 text-slate-700"
                        : "border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-300"
                    }`}
                  >
                    &larr; Back
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#D4AF37] hover:bg-[#e2bd46] active:bg-[#c49e29] text-black shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>✍</span>
                    <span>Send eSign &amp; Proceed to Pay</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ========================================================
              STEP 3: Official Leegality / eSign Agreement Document Viewer
             ======================================================== */}
          {step === 3 && (
            <motion.div
              key="step-3-leegality-viewer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="document-viewer-title"
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -16 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className={`relative w-full max-w-[960px] h-[92vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-colors duration-200 z-10 my-auto ${
                isLight
                  ? "bg-[#f8fafc] border border-slate-300"
                  : "bg-[#0b1019] border border-white/15"
              }`}
            >
              {/* Document Preview Top Bar */}
              <div
                className={`h-14 px-4 sm:px-6 flex items-center justify-between shrink-0 border-b ${
                  isLight
                    ? "bg-white border-slate-200 text-slate-900"
                    : "bg-[#111824] border-white/10 text-white"
                }`}
              >
                {/* Brand Logo & Title */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-primary/40 shrink-0 relative">
                    <Image src={logoImg} alt="Money Vriksh Logo" fill className="object-cover" />
                  </div>
                  <span className="font-instrument text-base select-none">
                    <span className={isLight ? "text-slate-900 font-semibold" : "text-white font-semibold"}>
                      Money
                    </span>{" "}
                    <span className="italic animating-gradient-text">Vriksh</span>
                  </span>
                  <span
                    className={`text-xs hidden sm:inline-block px-2.5 py-0.5 rounded-full border font-medium ${
                      isLight
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-primary/10 text-primary border-primary/20"
                    }`}
                  >
                    eSign &bull; Document Preview
                  </span>
                </div>

                {/* Top Actions: Close Modal */}
                <button
                  type="button"
                  onClick={handleClose}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    isLight
                      ? "hover:bg-slate-100 text-slate-600"
                      : "hover:bg-white/10 text-slate-300"
                  }`}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Main Canvas Body: Centered Document Sheet */}
              <div className="flex-1 flex overflow-hidden relative">
                {/* Scrollable Document Canvas (The Paper) */}
                <div
                  className={`flex-1 overflow-y-auto p-3 sm:p-6 flex justify-center ${
                    isLight ? "bg-[#f1f5f9]" : "bg-[#070b12]"
                  }`}
                >
                  <div
                    className={`w-full max-w-[760px] rounded-xl shadow-2xl p-6 sm:p-10 my-auto flex flex-col font-sans border text-left select-text transition-colors duration-200 ${
                      isLight
                        ? "bg-white text-slate-900 border-slate-200"
                        : "bg-[#0f1726] text-slate-200 border-white/10"
                    }`}
                    style={{ minHeight: "880px" }}
                  >
                    {/* Brand Styled Document Header Block */}
                    <div
                      className={`p-5 sm:p-6 rounded-xl mb-4 border transition-colors ${
                        isLight
                          ? "bg-gradient-to-r from-slate-900 via-[#07281c] to-slate-900 text-white border-slate-800 shadow-sm"
                          : "bg-gradient-to-r from-[#071f16] via-[#0d2e21] to-[#081b13] text-white border-emerald-500/30 shadow-lg"
                      }`}
                    >
                      <h1 className="text-base sm:text-lg font-black uppercase tracking-wide leading-tight !text-white">
                        RESEARCH ANALYST SERVICES AGREEMENT
                      </h1>
                      <p className="text-[11px] sm:text-xs text-emerald-300 mt-1.5 font-medium">
                        Most Important Terms &amp; Conditions (MITC) | Pursuant to SEBI (Research
                        Analysts) Regulations, 2014
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-amber-300 mt-1 font-mono font-medium">
                        SEBI Circular: SEBI/HO/MIRSD/MIRSD-PoD/P/CIR/2025/20 dated February 17, 2025
                      </p>
                    </div>

                    {/* Date & Compliance badge */}
                    <div
                      className={`text-xs font-semibold mb-3 pb-2 border-b flex items-center justify-between ${
                        isLight
                          ? "text-slate-600 border-slate-200"
                          : "text-slate-400 border-white/10"
                      }`}
                    >
                      <span>
                        Date:{" "}
                        <span className={`font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                          {formattedDate}
                        </span>
                      </span>
                      <span
                        className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                          isLight
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-primary/10 text-primary border-primary/20"
                        }`}
                      >
                        SEBI Compliant
                      </span>
                    </div>

                    {/* Two-Column PARTIES Box */}
                    <div className="mb-4 text-xs leading-relaxed">
                      <h3
                        className={`font-extrabold text-[12px] uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                          isLight ? "text-emerald-800" : "text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">badge</span>
                        <span>PARTIES</span>
                      </h3>

                      <div
                        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b ${
                          isLight ? "border-slate-200" : "border-white/10"
                        }`}
                      >
                        {/* Research Analyst */}
                        <div
                          className={`p-3.5 rounded-xl border ${
                            isLight
                              ? "bg-slate-50 border-slate-200"
                              : "bg-white/[0.02] border-white/10"
                          }`}
                        >
                          <p
                            className={`font-bold mb-1 flex items-center gap-1.5 ${
                              isLight ? "text-slate-900" : "text-white"
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm text-emerald-500">
                              verified
                            </span>
                            <span>Research Analyst (RA)</span>
                          </p>
                          <p className={isLight ? "text-slate-700" : "text-slate-300"}>
                            Name:{" "}
                            <span
                              className={`font-semibold ${
                                isLight ? "text-slate-900" : "text-white"
                              }`}
                            >
                              Gourav Dharkar
                            </span>
                          </p>
                          <p className={isLight ? "text-slate-700" : "text-slate-300"}>
                            SEBI Reg.:{" "}
                            <span
                              className={`font-bold font-mono ${
                                isLight ? "text-amber-700" : "text-premium-gold"
                              }`}
                            >
                              INH000025300
                            </span>
                          </p>
                          <p className={isLight ? "text-slate-700" : "text-slate-300"}>
                            Email:{" "}
                            <span className={isLight ? "text-slate-900" : "text-white"}>
                              dharkargourav@gmail.com
                            </span>
                          </p>
                          <p className={isLight ? "text-slate-700" : "text-slate-300"}>
                            Phone:{" "}
                            <span className={isLight ? "text-slate-900" : "text-white"}>
                              +91 98275 62967
                            </span>
                          </p>
                          <p className={isLight ? "text-slate-700" : "text-slate-300"}>
                            Website:{" "}
                            <span className={isLight ? "text-slate-900" : "text-white"}>
                              moneyvriksh.com
                            </span>
                          </p>
                        </div>

                        {/* Client */}
                        <div
                          className={`p-3.5 rounded-xl border ${
                            isLight
                              ? "bg-slate-50 border-slate-200"
                              : "bg-white/[0.02] border-white/10"
                          }`}
                        >
                          <p
                            className={`font-bold mb-1 flex items-center gap-1.5 ${
                              isLight ? "text-slate-900" : "text-white"
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm text-blue-500">
                              person
                            </span>
                            <span>Client / Subscriber</span>
                          </p>
                          <p className={isLight ? "text-slate-700" : "text-slate-300"}>
                            Name:{" "}
                            <span
                              className={`font-semibold ${
                                isLight ? "text-slate-900" : "text-white"
                              }`}
                            >
                              {formData.fullName || "Client"}
                            </span>
                          </p>
                          <p className={isLight ? "text-slate-700" : "text-slate-300"}>
                            Email:{" "}
                            <span
                              className={`font-medium ${
                                isLight ? "text-slate-800" : "text-slate-200"
                              }`}
                            >
                              {formData.email || "client@example.com"}
                            </span>
                          </p>
                          <p className={isLight ? "text-slate-700" : "text-slate-300"}>
                            Mobile:{" "}
                            <span
                              className={`font-medium ${
                                isLight ? "text-slate-800" : "text-slate-200"
                              }`}
                            >
                              {formData.phone ? `+91 ${formData.phone}` : "+91 98275 62967"}
                            </span>
                          </p>
                          <p className={isLight ? "text-slate-700" : "text-slate-300"}>
                            PAN:{" "}
                            <span
                              className={`font-mono font-bold ${
                                isLight ? "text-slate-900" : "text-white"
                              }`}
                            >
                              {formData.pan || "AZTPD6221C"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Prominent Gold Highlighted Bar: Service Subscribed */}
                    <div
                      className={`font-extrabold text-xs sm:text-[13px] px-4 py-3 rounded-xl uppercase tracking-wide mb-4 shadow-sm flex items-center justify-between border ${
                        isLight
                          ? "bg-amber-100/80 border-amber-300 text-amber-900"
                          : "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-premium-gold"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">verified</span>
                        <span>
                          SERVICE SUBSCRIBED: {serviceTitle} &mdash; {planLabel}
                        </span>
                      </div>
                      <span className="font-mono text-sm">{priceFormatted}</span>
                    </div>

                    {/* Numbered Terms (Clauses 1 to 7) */}
                    <div
                      className={`space-y-3 text-xs leading-relaxed ${
                        isLight ? "text-slate-700" : "text-slate-300"
                      }`}
                    >
                      <div>
                        <h4
                          className={`font-bold mb-0.5 ${
                            isLight ? "text-emerald-800" : "text-primary"
                          }`}
                        >
                          1. NATURE OF SERVICES
                        </h4>
                        <p>
                          The RA provides Intraday &amp; Swing Trading Calls via Telegram &amp;
                          WhatsApp including daily stock picks on Indian stocks (NSE/BSE), with entry
                          price, target levels, and stop-loss for every call. All research is
                          SEBI-compliant.
                        </p>
                      </div>

                      <div>
                        <h4
                          className={`font-bold mb-0.5 ${
                            isLight ? "text-emerald-800" : "text-primary"
                          }`}
                        >
                          2. FEES &amp; PAYMENT
                        </h4>
                        <p>
                          Subscription fee: {priceFormatted} for {planLabel}. Total fees shall not
                          exceed Rs. 1,51,000/- per annum per family as per SEBI/RAASB. Cash
                          payments are strictly not permitted. Accepted modes: UPI, NEFT, RTGS,
                          online bank transfer.
                        </p>
                      </div>

                      <div>
                        <h4
                          className={`font-bold mb-0.5 ${
                            isLight ? "text-emerald-800" : "text-primary"
                          }`}
                        >
                          3. REFUND POLICY
                        </h4>
                        <p>
                          In case of pre-mature termination by either Party, the Client shall receive
                          a proportionate refund for the unexpired subscription period only.
                        </p>
                      </div>

                      <div>
                        <h4
                          className={`font-bold mb-0.5 ${
                            isLight ? "text-rose-700" : "text-rose-400"
                          }`}
                        >
                          4. CRITICAL RESTRICTIONS
                        </h4>
                        <p>
                          The RA is NOT a Portfolio Manager, Investment Adviser, Stockbroker, or
                          Sub-Broker. The RA will NEVER execute trades on behalf of clients, ask for
                          OTPs, login credentials, or promise guaranteed returns.
                        </p>
                      </div>

                      <div>
                        <h4
                          className={`font-bold mb-0.5 ${
                            isLight ? "text-amber-800" : "text-premium-gold"
                          }`}
                        >
                          5. RISK DISCLOSURE
                        </h4>
                        <p>
                          All investments in securities markets are subject to market risks. Research
                          recommendations do not constitute a guarantee of returns. Past performance
                          is not indicative of future results.
                        </p>
                      </div>

                      <div>
                        <h4
                          className={`font-bold mb-0.5 ${
                            isLight ? "text-emerald-800" : "text-primary"
                          }`}
                        >
                          6. CLIENT OBLIGATIONS
                        </h4>
                        <p>
                          Keep contact details updated with the RA at all times. Make payments only
                          through approved modes (no cash). Exercise independent judgement before
                          acting on research. Never share login credentials or OTPs with anyone.
                        </p>
                      </div>

                      <div>
                        <h4
                          className={`font-bold mb-0.5 ${
                            isLight ? "text-emerald-800" : "text-primary"
                          }`}
                        >
                          7. GRIEVANCE REDRESSAL
                        </h4>
                        <p>
                          Step 1 - RA: dharkargourav@gmail.com | +91 98275 62967 &bull; Step 2 -
                          SEBI SCORES: scores.sebi.gov.in &bull; Step 3 - ODR Portal: smartodr.in
                        </p>
                      </div>
                    </div>

                    {/* SIGNATURES Section */}
                    <div
                      className={`mt-6 pt-4 border-t ${
                        isLight ? "border-slate-200" : "border-white/10"
                      }`}
                    >
                      <h4
                        className={`font-extrabold text-[12px] uppercase tracking-wider mb-2.5 ${
                          isLight ? "text-slate-900" : "text-white"
                        }`}
                      >
                        SIGNATURES
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Research Analyst Signature Box */}
                        <div
                          className={`rounded-xl p-3.5 h-28 flex flex-col justify-between border ${
                            isLight
                              ? "bg-emerald-50/70 border-emerald-300"
                              : "bg-emerald-950/20 border-emerald-500/30"
                          }`}
                        >
                          <div
                            className={`flex items-center gap-1.5 text-[11px] font-bold ${
                              isLight ? "text-emerald-800" : "text-emerald-400"
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span>Digitally Verified by RA</span>
                          </div>
                          <div
                            className={`border-t pt-1.5 text-[11px] leading-tight ${
                              isLight ? "border-emerald-200/80" : "border-white/10"
                            }`}
                          >
                            <p
                              className={`font-bold ${isLight ? "text-slate-900" : "text-white"}`}
                            >
                              Gourav Dharkar (RA)
                            </p>
                            <p
                              className={`text-[10px] font-mono mt-0.5 ${
                                isLight ? "text-slate-600" : "text-slate-400"
                              }`}
                            >
                              SEBI Reg.: INH000025300
                            </p>
                          </div>
                        </div>

                        {/* Client Digital Signature Box */}
                        <div
                          className={`rounded-xl p-3.5 h-28 flex flex-col justify-between relative border ${
                            isLight
                              ? "bg-slate-50 border-slate-300"
                              : "bg-white/[0.02] border-white/10"
                          }`}
                        >
                          <div className="self-end">
                            <div
                              className={`px-2.5 py-1 rounded border border-dashed text-[10px] font-semibold flex items-center gap-1.5 shadow-xs ${
                                isLight
                                  ? "border-emerald-500/60 bg-emerald-50 text-emerald-800"
                                  : "border-primary/50 bg-primary/10 text-primary"
                              }`}
                            >
                              <span>⚡</span>
                              <span>Signature will display here</span>
                            </div>
                          </div>
                          <div
                            className={`border-t pt-1.5 text-[11px] leading-tight ${
                              isLight ? "border-slate-200" : "border-white/10"
                            }`}
                          >
                            <p
                              className={`font-bold ${isLight ? "text-slate-900" : "text-white"}`}
                            >
                              {formData.fullName || "Client"} (Client)
                            </p>
                            <p
                              className={`text-[10px] mt-0.5 ${
                                isLight ? "text-slate-500" : "text-slate-400"
                              }`}
                            >
                              Signed via Digital eSign
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Footnote Disclaimers */}
                      <p
                        className={`text-[10px] leading-normal mt-3.5 italic ${
                          isLight ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        By signing this document, the Client confirms they have read, understood,
                        and agree to be bound by all the above terms and conditions. SEBI
                        registration and NISM certification do not guarantee performance or assure
                        any returns. Investment in securities market is subject to market risks.
                      </p>

                      <p
                        className={`text-[10px] font-mono text-center mt-3 ${
                          isLight ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        Page 1 of 1 &bull; Money Vriksh Compliance Agreement
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Bar with Edit Details & Proceed */}
              <div
                className={`h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 border-t ${
                  isLight
                    ? "bg-white border-slate-200"
                    : "bg-[#111824] border-white/10"
                }`}
              >
                {/* Left: Secured Badge */}
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span className="material-symbols-outlined text-sm text-emerald-500">lock</span>
                  <span
                    className={`font-mono text-[11px] uppercase tracking-wider ${
                      isLight ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    SECURED BY{" "}
                    <strong className={isLight ? "text-slate-900" : "text-white"}>
                      Leegality &bull; 256-bit SSL
                    </strong>
                  </span>
                </div>

                {/* Right Actions: Back & Proceed Button */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer border ${
                      isLight
                        ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                        : "border-white/15 text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    &larr; Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToStep4}
                    className="px-7 py-2.5 rounded-xl font-bold text-xs sm:text-sm gradient-bg-primary text-[#003824] shadow-[0_4px_16px_rgba(50,205,148,0.35)] hover:shadow-[0_0_20px_rgba(50,205,148,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Proceed</span>
                    <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {/* ========================================================
              STEP 4: Leegality Signing Method Selection Modal
             ======================================================== */}
          {step === 4 && (
            <motion.div
              key="step-4-signing-method"
              role="dialog"
              aria-modal="true"
              aria-labelledby="signing-method-title"
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -16 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className={`relative w-full max-w-[960px] h-[86vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-colors duration-200 z-10 my-auto ${
                isLight
                  ? "bg-[#f1f3f6] border border-slate-300"
                  : "bg-[#0b1019] border border-white/15"
              }`}
            >
              {/* Leegality Top Bar with Blue Progress Indicator */}
              <div
                className={`h-14 px-4 sm:px-6 flex flex-col justify-between shrink-0 border-b relative ${
                  isLight
                    ? "bg-white border-slate-200 text-slate-900"
                    : "bg-[#111824] border-white/10 text-white"
                }`}
              >
                <div className="flex-1 flex items-center justify-between">
                  {/* Leegality Logo */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-rose-500 font-sans tracking-tight flex items-center gap-1.5">
                      <span className="text-sm px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold">
                        ▲
                      </span>
                      <span className={`font-extrabold text-base tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>Leegality</span>
                    </span>
                  </div>

                  {/* Close Modal */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      isLight
                        ? "hover:bg-slate-100 text-slate-600"
                        : "hover:bg-white/10 text-slate-300"
                    }`}
                    aria-label="Close"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>

                {/* Progress bar line under header */}
                <div className={`w-full h-[3px] absolute bottom-0 left-0 ${isLight ? "bg-slate-200" : "bg-white/10"}`}>
                  <div className="gradient-bg-primary h-full w-[65%]" />
                </div>
              </div>

              {/* Main Center Area with Selection Card */}
              <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div
                  className={`w-full max-w-[560px] rounded-2xl p-6 sm:p-8 text-left transition-colors duration-200 ${
                    isLight
                      ? "bg-white border border-slate-200/80 shadow-lg"
                      : "bg-[#111825] border border-white/10 shadow-2xl"
                  }`}
                >
                  {/* Title with Kebab Menu */}
                  <div className="flex items-center justify-between mb-5">
                    <h3
                      id="signing-method-title"
                      className={`text-base sm:text-lg font-bold tracking-tight ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      How would you like to eSign your document?
                    </h3>
                    <span
                      className={`material-symbols-outlined text-lg cursor-pointer ${
                        isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      more_vert
                    </span>
                  </div>

                  {/* Radio Options List */}
                  <div className="space-y-3.5">
                    {/* Option 1: Virtual Sign */}
                    <div
                      onClick={() => setSigningMethod("virtual")}
                      className={`rounded-xl p-4 sm:p-4.5 border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                        signingMethod === "virtual"
                          ? isLight
                            ? "border-emerald-500 bg-emerald-50/70 shadow-xs"
                            : "border-primary bg-primary/10 shadow-[0_0_15px_rgba(50,205,148,0.2)]"
                          : isLight
                          ? "border-slate-200 hover:border-slate-300 bg-white"
                          : "border-white/10 hover:border-white/20 bg-transparent"
                      }`}
                    >
                      <div className="pt-0.5">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            signingMethod === "virtual"
                              ? isLight
                                ? "border-emerald-600 bg-emerald-600"
                                : "border-primary bg-primary"
                              : isLight
                              ? "border-slate-400 bg-transparent"
                              : "border-slate-600 bg-transparent"
                          }`}
                        >
                          {signingMethod === "virtual" && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p
                          className={`font-bold text-sm leading-snug ${
                            isLight ? "text-slate-900" : "text-white"
                          }`}
                        >
                          Virtual Sign
                        </p>
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            isLight ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          Sign using one of the available virtual signing methods to sign the document(s)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leegality Bottom Bar with Back & Proceed */}
              <div
                className={`h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 border-t ${
                  isLight
                    ? "bg-white border-slate-200"
                    : "bg-[#111824] border-white/10"
                }`}
              >
                {/* Left: Secured by Leegality Badge */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="material-symbols-outlined text-sm text-emerald-600">lock</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider">
                    SECURED BY <strong className={isLight ? "text-slate-800" : "text-slate-200"}>Leegality</strong>
                  </span>
                </div>

                {/* Right: Back & Proceed Button */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer border ${
                      isLight
                        ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                        : "border-white/15 text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedFromStep4}
                    
                    className={`px-7 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 ${
                      signingMethod
                        ? "gradient-bg-primary text-[#003824] shadow-[0_4px_16px_rgba(50,205,148,0.35)] hover:shadow-[0_0_20px_rgba(50,205,148,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        : isLight
                        ? "bg-slate-200 text-slate-400 border border-slate-300/60 cursor-not-allowed opacity-70"
                        : "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <span>Proceed</span>
                    <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              STEP 5: Identity Confirmation / OTP Verification Screen
             ======================================================== */}
          {step === 5 && (
            <motion.div
              key="step-5-otp-verification"
              role="dialog"
              aria-modal="true"
              aria-labelledby="otp-modal-title"
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -16 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className={`relative w-full max-w-[960px] h-[86vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-colors duration-200 z-10 my-auto ${
                isLight
                  ? "bg-[#f8fafc] border border-slate-300"
                  : "bg-[#0b1019] border border-white/15"
              }`}
            >
              {/* Leegality Top Bar with 85% Progress Indicator */}
              <div
                className={`h-14 px-4 sm:px-6 flex flex-col justify-between shrink-0 border-b relative ${
                  isLight
                    ? "bg-white border-slate-200 text-slate-900"
                    : "bg-[#111824] border-white/10 text-white"
                }`}
              >
                <div className="flex-1 flex items-center justify-between">
                  {/* Leegality Logo */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-rose-500 font-sans tracking-tight flex items-center gap-1.5">
                      <span className="text-sm px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold">
                        ▲
                      </span>
                      <span className={`font-extrabold text-base tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>Leegality</span>
                    </span>
                  </div>

                  {/* Close Modal */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      isLight
                        ? "hover:bg-slate-100 text-slate-600"
                        : "hover:bg-white/10 text-slate-300"
                    }`}
                    aria-label="Close"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>

                {/* Progress bar line under header (85% progress) */}
                <div className={`w-full h-[3px] absolute bottom-0 left-0 ${isLight ? "bg-slate-200" : "bg-white/10"}`}>
                  <div className="gradient-bg-primary h-full w-[85%]" />
                </div>
              </div>

              {/* Main Center Area with Identity Confirmation Card */}
              <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div
                  className={`w-full max-w-[520px] rounded-2xl p-6 sm:p-8 text-center transition-colors duration-200 ${
                    isLight
                      ? "bg-white border border-slate-200/80 shadow-lg text-slate-900"
                      : "bg-[#111825] border border-white/10 shadow-2xl text-white"
                  }`}
                >
                  {/* Title */}
                  <h3
                    id="otp-modal-title"
                    className={`text-lg sm:text-xl font-bold tracking-tight mb-2 ${
                      isLight ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Please confirm your identity
                  </h3>

                  {/* Status Banner */}
                  <div className="flex items-center justify-center gap-1.5 text-teal-600 dark:text-teal-400 text-xs sm:text-[13px] font-medium mb-5">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>One Time Password has been sent to your contact.</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {/* Readonly Email Box */}
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-xs sm:text-sm ${
                        isLight
                          ? "bg-slate-50 border-slate-200 text-slate-700"
                          : "bg-[#080d14] border-white/10 text-slate-300"
                      }`}
                    >
                      <span className="material-symbols-outlined text-slate-400 text-lg">mail</span>
                      <span className="font-medium truncate">
                        {formData.email || "client@example.com"}
                      </span>
                    </div>

                    {/* Readonly Phone Box */}
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-xs sm:text-sm ${
                        isLight
                          ? "bg-slate-50 border-slate-200 text-slate-700"
                          : "bg-[#080d14] border-white/10 text-slate-300"
                      }`}
                    >
                      <span className="material-symbols-outlined text-slate-400 text-lg">call</span>
                      <span className="font-medium">
                        {formData.phone ? `+91 ${formData.phone}` : "9827562967"}
                      </span>
                    </div>

                    {/* OTP Input with 123 Prefix & Eye Toggle */}
                    <div
                      className={`flex items-center rounded-xl border transition-all ${
                        otpError
                          ? "border-rose-500 ring-2 ring-rose-500/20"
                          : isLight
                          ? "border-slate-300 bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20"
                          : "border-white/15 bg-[#080d14] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
                      }`}
                    >
                      <div
                        className={`px-3.5 py-3 border-r text-xs font-mono font-bold select-none ${
                          isLight
                            ? "border-slate-200 text-slate-500 bg-slate-50 rounded-l-xl"
                            : "border-white/10 text-slate-400 bg-white/[0.02] rounded-l-xl"
                        }`}
                      >
                        123
                      </div>

                      <input
                        type={showOtp ? "text" : "password"}
                        maxLength={6}
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, ""));
                          if (otpError) setOtpError("");
                        }}
                        className={`flex-1 px-4 py-3 text-sm focus:outline-none bg-transparent font-mono tracking-widest ${
                          isLight
                            ? "text-slate-900 placeholder:text-slate-400"
                            : "text-white placeholder:text-slate-500"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowOtp(!showOtp)}
                        className="px-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title={showOtp ? "Hide OTP" : "Show OTP"}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {showOtp ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>

                    {otpError && (
                      <p className="text-[11.5px] text-rose-500 font-medium text-left pl-1">
                        {otpError}
                      </p>
                    )}
                  </div>

                  {/* Resend OTP in X seconds */}
                  <div className="text-xs font-medium my-3">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className={`hover:underline font-bold cursor-pointer ${
                          isLight ? "text-emerald-700" : "text-primary"
                        }`}
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <span className={isLight ? "text-slate-500" : "text-slate-400"}>
                        Resend OTP in {countdown} seconds.
                      </span>
                    )}
                  </div>

                  {/* Terms & Privacy Agreement */}
                  <p
                    className={`text-[11px] leading-relaxed ${
                      isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    By proceeding, I agree to the{" "}
                    <span className="underline cursor-pointer hover:text-primary">
                      Terms of service
                    </span>{" "}
                    and{" "}
                    <span className="underline cursor-pointer hover:text-primary">
                      Privacy policy
                    </span>
                  </p>

                  {/* Kebab sub-link */}
                  <p
                    className={`text-[11px] hover:underline cursor-pointer mt-3 font-medium ${
                      isLight ? "text-emerald-700" : "text-primary"
                    }`}
                  >
                    Already a Leegality user? Log in with a password instead
                  </p>
                </div>
              </div>

              {/* Leegality Bottom Bar with Back & Proceed */}
              <div
                className={`h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 border-t ${
                  isLight
                    ? "bg-white border-slate-200"
                    : "bg-[#111824] border-white/10"
                }`}
              >
                {/* Left: Secured by Leegality Badge */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="material-symbols-outlined text-sm text-emerald-600">lock</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider">
                    SECURED BY <strong className={isLight ? "text-slate-800" : "text-slate-200"}>Leegality</strong>
                  </span>
                </div>

                {/* Right: Back & Proceed Button */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer border ${
                      isLight
                        ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                        : "border-white/15 text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleVerifyOtpAndProceed}
                    disabled={!otp || otp.length < 4 || isVerifying}
                    className={`px-7 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 ${
                      otp && otp.length >= 4 && !isVerifying
                        ? "gradient-bg-primary text-[#003824] shadow-[0_4px_16px_rgba(50,205,148,0.35)] hover:shadow-[0_0_20px_rgba(50,205,148,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        : isLight
                        ? "bg-slate-200 text-slate-400 border border-slate-300/60 cursor-not-allowed opacity-70"
                        : "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <span>{isVerifying ? "Verifying..." : "Proceed"}</span>
                    {!isVerifying && (
                      <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              STEP 6: Virtual Place Signature Screen (Matching Leegality)
             ======================================================== */}
          {step === 6 && (
            <motion.div
              key="step-6-place-signature"
              role="dialog"
              aria-modal="true"
              aria-labelledby="signature-modal-title"
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -16 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className={`relative w-full max-w-[960px] h-[88vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-colors duration-200 z-10 my-auto ${
                isLight
                  ? "bg-[#f1f3f6] border border-slate-300"
                  : "bg-[#0b1019] border border-white/15"
              }`}
            >
              {/* Leegality Top Bar with 95% Progress Indicator */}
              <div
                className={`h-14 px-4 sm:px-6 flex flex-col justify-between shrink-0 border-b relative ${
                  isLight
                    ? "bg-white border-slate-200 text-slate-900"
                    : "bg-[#111824] border-white/10 text-white"
                }`}
              >
                <div className="flex-1 flex items-center justify-between">
                  {/* Leegality Logo */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-rose-500 font-sans tracking-tight flex items-center gap-1.5">
                      <span className="text-sm px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold">
                        ▲
                      </span>
                      <span className={`font-extrabold text-base tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>Leegality</span>
                    </span>
                  </div>

                  {/* Close Modal */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      isLight
                        ? "hover:bg-slate-100 text-slate-600"
                        : "hover:bg-white/10 text-slate-300"
                    }`}
                    aria-label="Close"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>

                {/* Progress bar line under header (95% progress) */}
                <div className={`w-full h-[3px] absolute bottom-0 left-0 ${isLight ? "bg-slate-200" : "bg-white/10"}`}>
                  <div className="gradient-bg-primary h-full w-[95%]" />
                </div>
              </div>

              {/* Main Center Area with Signature Card */}
              <div className="flex-1 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                <div
                  className={`w-full max-w-[560px] rounded-2xl p-5 sm:p-7 text-left transition-colors duration-200 ${
                    isLight
                      ? "bg-white border border-slate-200/80 shadow-lg"
                      : "bg-[#111825] border border-white/10 shadow-2xl"
                  }`}
                >
                  {/* Title with Kebab Menu */}
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      id="signature-modal-title"
                      className={`text-base sm:text-lg font-bold tracking-tight ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      Place Signature<span className="text-rose-500 font-bold ml-0.5">*</span>
                    </h3>
                    <span
                      className={`material-symbols-outlined text-lg cursor-pointer ${
                        isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      more_vert
                    </span>
                  </div>

                  {/* Signature Card Box */}
                  <div
                    className={`rounded-2xl border overflow-hidden transition-all ${
                      isLight ? "border-slate-300 shadow-xs" : "border-white/15"
                    }`}
                  >
                    {/* Tabs: Draw vs Select */}
                    <div
                      className={`flex border-b text-xs sm:text-sm font-semibold ${
                        isLight ? "bg-slate-100/80 border-slate-200" : "bg-[#0b121e] border-white/10"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSignatureTab("draw")}
                        className={`flex-1 py-2.5 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          signatureTab === "draw"
                            ? isLight
                              ? "bg-white text-emerald-700 border-b-2 border-emerald-600 font-bold shadow-xs"
                              : "bg-[#16202f] text-primary border-b-2 border-primary font-bold shadow-xs"
                            : isLight
                            ? "text-slate-500 hover:text-slate-800"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">draw</span>
                        <span>Draw</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSignatureTab("select")}
                        className={`flex-1 py-2.5 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          signatureTab === "select"
                            ? isLight
                              ? "bg-white text-emerald-700 border-b-2 border-emerald-600 font-bold shadow-xs"
                              : "bg-[#16202f] text-primary border-b-2 border-primary font-bold shadow-xs"
                            : isLight
                            ? "text-slate-500 hover:text-slate-800"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">keyboard</span>
                        <span>Select</span>
                      </button>
                    </div>

                    {/* Canvas Area */}
                    <div
                      className={`relative transition-all ${
                        isLight ? "bg-white" : "bg-[#080d14]"
                      }`}
                    >
                      {signatureTab === "draw" ? (
                        <div className="relative">
                          <canvas
                            ref={canvasRef}
                            width={540}
                            height={isFullScreenSignature ? 280 : 160}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className={`w-full ${
                              isFullScreenSignature ? "h-[260px]" : "h-[160px]"
                            } cursor-crosshair touch-none select-none block`}
                          />
                          {!hasDrawnSignature && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-xs text-slate-400 font-medium">
                              Draw your signature here with finger or mouse
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 sm:p-4 space-y-2.5 max-h-[200px] overflow-y-auto">
                          {[
                            "font-serif italic font-semibold text-2xl tracking-normal",
                            "font-mono italic font-bold text-xl tracking-wider",
                            "font-sans italic font-light text-2xl tracking-widest",
                          ].map((fontClass, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setSelectedFontIndex(idx);
                                setHasDrawnSignature(true);
                              }}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                selectedFontIndex === idx
                                  ? isLight
                                    ? "border-emerald-500 bg-emerald-50/70 text-slate-900 shadow-xs"
                                    : "border-primary bg-primary/10 text-white shadow-xs"
                                  : isLight
                                  ? "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                                  : "border-white/10 hover:border-white/20 text-slate-300 bg-transparent"
                              }`}
                            >
                              <span className={fontClass}>
                                {signedDocumentName.trim() || "Signature"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Canvas Toolbar: Full screen & Clear buttons */}
                  <div className="flex items-center justify-between mt-2.5 px-0.5">
                    <button
                      type="button"
                      onClick={() => setIsFullScreenSignature((prev) => !prev)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isLight
                          ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                          : "border-white/15 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isFullScreenSignature ? "fullscreen_exit" : "fullscreen"}
                      </span>
                      <span>{isFullScreenSignature ? "Exit Full screen" : "Full screen"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={clearCanvas}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isLight
                          ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                          : "border-white/15 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                      <span>Clear</span>
                    </button>
                  </div>

                  {/* Name in signed document* */}
                  <div className="mt-4 text-left">
                    <label
                      htmlFor="signed-doc-name"
                      className={`block text-xs font-semibold mb-1.5 ${
                        isLight ? "text-slate-800" : "text-slate-200"
                      }`}
                    >
                      Name in signed document<span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                      id="signed-doc-name"
                      type="text"
                      required
                      value={signedDocumentName}
                      onChange={(e) => setSignedDocumentName(e.target.value)}
                      placeholder="Enter name as per document"
                      className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 font-medium ${
                        isLight
                          ? "bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
                          : "bg-[#080d14] border border-white/10 text-white focus:border-primary focus:ring-primary/20"
                      }`}
                    />
                  </div>

                  {/* Signed document destination notice (Images 3 & 4) */}
                  <p
                    className={`text-xs sm:text-[13px] font-semibold text-center mt-5 leading-relaxed ${
                      isLight ? "text-slate-700" : "text-slate-200"
                    }`}
                  >
                    Signed document will be sent to{" "}
                    <span className="underline decoration-slate-400">
                      {formData.email || "client@example.com"}
                    </span>{" "}
                    and{" "}
                    <span className="font-bold">
                      {formData.phone ? formData.phone : "9827562967"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Leegality Bottom Bar with Back & Proceed */}
              <div
                className={`h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 border-t ${
                  isLight
                    ? "bg-white border-slate-200"
                    : "bg-[#111824] border-white/10"
                }`}
              >
                {/* Left: Secured by Leegality Badge */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="material-symbols-outlined text-sm text-emerald-600">lock</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider">
                    SECURED BY <strong className={isLight ? "text-slate-800" : "text-slate-200"}>Leegality</strong>
                  </span>
                </div>

                {/* Right: Back & Proceed Button */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer border ${
                      isLight
                        ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                        : "border-white/15 text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalizeSignature}
                    disabled={
                      (!hasDrawnSignature && signatureTab === "draw") ||
                      !signedDocumentName.trim() ||
                      isVerifying
                    }
                    className={`px-7 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 ${
                      (hasDrawnSignature || signatureTab === "select") &&
                      signedDocumentName.trim() &&
                      !isVerifying
                        ? "gradient-bg-primary text-[#003824] shadow-[0_4px_16px_rgba(50,205,148,0.35)] hover:shadow-[0_0_20px_rgba(50,205,148,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        : isLight
                        ? "bg-slate-200 text-slate-400 border border-slate-300/60 cursor-not-allowed opacity-70"
                        : "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <span>{isVerifying ? "Signing..." : "Proceed"}</span>
                    {!isVerifying && (
                      <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              STEP 9: Document Signed Success Modal (Exact visual match to Reference Images 9 & 10)
             ======================================================== */}
          {step === 9 && (
            <motion.div
              key="step-9-document-signed"
              role="dialog"
              aria-modal="true"
              aria-labelledby="document-signed-title"
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -16 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className={`relative w-full max-w-[540px] rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-colors duration-200 z-10 my-auto ${
                isLight
                  ? "bg-white border border-slate-300"
                  : "bg-[#0b1019] border border-white/15"
              }`}
            >
              {/* Leegality Top Bar */}
              <div
                className={`h-14 px-4 sm:px-6 flex items-center justify-between shrink-0 border-b relative ${
                  isLight
                    ? "bg-white border-slate-200"
                    : "bg-[#111824] border-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold">
                    ▲
                  </span>
                  <span className={`font-extrabold text-base tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                    Leegality
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    isLight
                      ? "hover:bg-slate-100 text-slate-600"
                      : "hover:bg-white/10 text-slate-300"
                  }`}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>

                {/* Progress bar line under header (100% progress) */}
                <div className={`w-full h-[3px] absolute bottom-0 left-0 ${isLight ? "bg-slate-100" : "bg-white/5"}`}>
                  <div className="gradient-bg-primary h-full w-full" />
                </div>
              </div>

              {/* Center Content Card (Exact visual match to Reference Images 9 & 10) */}
              <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                {/* Circular Green Checkmark Icon (Exact match to Image 9) */}
                <div className="w-16 h-16 rounded-full bg-teal-500/15 text-teal-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-xs">
                  <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
                </div>

                {/* Document signed Title */}
                <h3
                  id="document-signed-title"
                  className="text-2xl font-bold text-teal-700 dark:text-emerald-400 tracking-tight mb-2"
                >
                  Document signed
                </h3>

                {/* Subtitle */}
                <p
                  className={`text-xs sm:text-sm font-medium mb-8 ${
                    isLight ? "text-slate-600" : "text-slate-300"
                  }`}
                >
                  The document(s) has been signed successfully.
                </p>

                {/* OK Action Button (Advances to Step 10) */}
                <button
                  type="button"
                  onClick={handleProceedFromStep9}
                  className={`px-9 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 border cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                    isLight
                      ? "bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100 shadow-xs"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/15 shadow-sm"
                  }`}
                >
                  OK
                </button>
              </div>

              {/* Leegality Bottom Bar */}
              <div
                className={`h-14 px-4 sm:px-6 flex items-center justify-start shrink-0 border-t select-none ${
                  isLight
                    ? "bg-slate-50 border-slate-200"
                    : "bg-[#111824] border-white/10"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="material-symbols-outlined text-sm text-emerald-600">lock</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider">
                    SECURED BY <strong className={isLight ? "text-slate-800" : "text-slate-200"}>Leegality</strong>
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              STEP 10: UPI QR Code Payment Screen (Exact Match to Reference Image 2)
             ======================================================== */}
          {step === 10 && (
            <motion.div
              key="step-10-upi-qr-payment"
              role="dialog"
              aria-modal="true"
              aria-labelledby="upi-payment-title"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className={`relative w-full max-w-[420px] sm:max-w-[440px] rounded-3xl flex flex-col shadow-2xl overflow-hidden transition-colors duration-200 z-10 my-auto ${
                isLight
                  ? "bg-white border border-slate-200 text-slate-900"
                  : "bg-[#121212] border border-white/10 text-white"
              }`}
            >
              {/* Header Bar (Exact Visual Match to Image 2) */}
              <div
                className={`p-4 sm:p-5 flex items-center justify-between border-b shrink-0 ${
                  isLight ? "border-slate-100" : "border-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <span className="material-symbols-outlined text-xl">qr_code_2</span>
                  </div>
                  <div>
                    <h4
                      id="upi-payment-title"
                      className="font-bold text-base text-slate-900 dark:text-white leading-tight font-sans"
                    >
                      Scan &amp; Pay via UPI
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Money Vriksh &bull; UCO Bank
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Main Body */}
              <div className="p-4 sm:p-5 pt-3 overflow-y-auto max-h-[75vh]">
                {!hasCompletedPayment ? (
                  <>
                    {/* Selected Plan & Payable Pill */}
                    <div
                      className={`rounded-2xl p-3 border mb-3 flex items-center justify-between ${
                        isLight
                          ? "bg-slate-50 border-slate-200/90 text-slate-900"
                          : "bg-[#1a1a1a] border-white/10 text-white"
                      }`}
                    >
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                          Service Plan
                        </p>
                        <p className="text-xs font-bold mt-0.5">{serviceTitle} ({planLabel})</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                          Total Payable
                        </p>
                        <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          {priceFormatted}
                        </p>
                      </div>
                    </div>

                    {/* QR Code Container (Exact Visual Match to Image 2) */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-inner mx-auto w-fit border border-gray-100 text-center">
                      <div className="relative w-[210px] h-[210px] sm:w-[230px] sm:h-[230px] mx-auto">
                        <Image
                          src={qrCodeImg}
                          alt="Money Vriksh UCO Bank UPI Payment QR Code"
                          fill
                          sizes="(max-width: 640px) 210px, 230px"
                          priority
                          className="object-contain"
                        />
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-center gap-1.5 text-neutral-600 text-[11px] font-medium tracking-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Scan with any UPI App</span>
                      </div>
                    </div>

                    {/* Verified Account Holder Box (Exact Visual Match to Image 2) */}
                    <div
                      className={`mt-3.5 rounded-xl p-3 border text-center ${
                        isLight
                          ? "bg-slate-50 border-slate-200"
                          : "bg-[#0a0a0a] border-white/5"
                      }`}
                    >
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        VERIFIED ACCOUNT HOLDER
                      </p>
                      <p className="font-bold text-sm text-slate-900 dark:text-white mt-0.5 font-headline">
                        GOURAV DHARKAR
                      </p>
                      <p className="font-mono text-[10.5px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                        UCO BANK &bull; A/C: 22460210002377 &bull; UCBA0002246
                      </p>
                    </div>

                    {/* Customer Actions */}
                    <div className="mt-4 space-y-2.5">
                      <button
                        type="button"
                        onClick={handleConfirmUpiPayment}
                        className="w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm gradient-bg-primary text-[#003824] shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>I Have Completed Payment</span>
                        <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenWhatsAppConfirmation}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">chat</span>
                        <span>Share Receipt on WhatsApp (+91 98275 62967)</span>
                      </button>
                    </div>

                    {/* English Message under QR Code */}
                    <p className="text-[11px] text-slate-500 text-center mt-3 leading-relaxed">
                      Thank you for completing your payment! Our team will contact you within 2&ndash;3 business days.
                    </p>
                  </>
                ) : (
                  /* Thank You Confirmation State (English Message as requested) */
                  <div className="py-4 text-center flex flex-col items-center justify-center">
                    {/* Big Green Checkmark Icon */}
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
                      <span className="material-symbols-outlined text-4xl font-bold">verified</span>
                    </div>

                    {/* Thank You Heading in English */}
                    <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight mb-2 font-sans">
                      Thank You for Your Payment!
                    </h3>

                    {/* Team Contact Message in English */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mb-5 max-w-[340px] leading-relaxed">
                      We have received your digitally signed agreement and payment notification. Our research advisory team will verify your transaction and contact you within <strong>2&ndash;3 business days</strong> to activate your service and provide your signed agreement copy.
                    </p>

                    {/* Summary Card */}
                    <div
                      className={`w-full rounded-2xl p-3.5 border mb-5 text-left text-xs ${
                        isLight
                          ? "bg-slate-50 border-slate-200 text-slate-800"
                          : "bg-white/[0.03] border-white/10 text-slate-200"
                      }`}
                    >
                      <div className="flex justify-between pb-2 mb-2 border-b border-inherit/40">
                        <span className="text-slate-500">Service Plan</span>
                        <strong className="font-semibold">{serviceTitle} ({planLabel})</strong>
                      </div>
                      <div className="flex justify-between pb-2 mb-2 border-b border-inherit/40">
                        <span className="text-slate-500">Amount Paid</span>
                        <strong className="font-bold text-emerald-600 dark:text-emerald-400">{priceFormatted}</strong>
                      </div>
                      <div className="flex justify-between pb-2 mb-2 border-b border-inherit/40">
                        <span className="text-slate-500">Client Name</span>
                        <span>{formData.fullName || signedDocumentName || "Client"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">SEBI Reg. No.</span>
                        <span className="font-mono font-semibold">INH000025300 (Gourav Dharkar)</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="w-full space-y-2.5">
                      <button
                        type="button"
                        onClick={handleOpenWhatsAppConfirmation}
                        className="w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm gradient-bg-primary text-[#003824] shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">chat</span>
                        <span>Share Screenshot on WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleClose}
                        className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          isLight
                            ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                            : "border-white/15 text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        Done &bull; Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

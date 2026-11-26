"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getSnapshot = () => {
  try {
    return sessionStorage.getItem("regulatory_disclosure_accepted") === "true";
  } catch {
    return false;
  }
};

// Return true on server so server render matches hydration without flashing
const getServerSnapshot = () => true;

export default function RegulatoryDisclosureModal() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const isAcceptedInStorage = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isDismissed, setIsDismissed] = useState(false);

  const isOpen = !pathname?.startsWith("/admin") && !isAcceptedInStorage && !isDismissed;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Lock background scrolling while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleAcknowledge = () => {
    try {
      sessionStorage.setItem("regulatory_disclosure_accepted", "true");
    } catch {
      // Ignore storage errors
    }
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur & Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`fixed inset-0 backdrop-blur-md transition-colors ${
              isLight ? "bg-black/45" : "bg-black/80"
            }`}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="regulatory-disclosure-title"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              boxShadow: isLight
                ? "0 25px 70px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.08)"
                : "0 25px 60px -15px rgba(0, 0, 0, 0.9), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
            }}
            className={`relative w-full max-w-xl rounded-2xl p-6 sm:p-8 text-left z-10 my-auto transition-colors duration-200 ${
              isLight
                ? "bg-white border border-slate-200"
                : "bg-[#141b26] border border-white/10"
            }`}
          >
            {/* Title */}
            <h2
              id="regulatory-disclosure-title"
              className="text-xl sm:text-2xl font-bold text-[#F87171] tracking-tight leading-snug"
            >
              Regulatory Warning &amp; Risk Disclosure
            </h2>

            {/* Sub-heading */}
            <h3
              className={`text-sm sm:text-base font-bold tracking-wide mt-5 mb-2.5 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Securities Market Warning:
            </h3>

            {/* Warning Body Content */}
            <div
              className={`space-y-3.5 text-xs sm:text-[13.5px] leading-relaxed font-normal ${
                isLight ? "text-slate-600" : "text-[#cbd5e1]"
              }`}
            >
              <p>
                Investments in the securities market are subject to market risks. Read all the
                related documents carefully before investing.
              </p>

              <p>
                Registration granted by SEBI and certification from NISM in no way guarantee
                performance of the intermediary or provide any assurance of returns to investors.
              </p>

              <p>
                By proceeding to this website, you acknowledge that you are accessing the official
                website of{" "}
                <strong
                  className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}
                >
                  Gourav Dharkar
                </strong>{" "}
                (SEBI Registration No:{" "}
                <strong
                  className={`font-bold ${isLight ? "text-amber-700" : "text-premium-gold text-[#D4AF37]"}`}
                >
                  INH000025300
                </strong>
                , Office Address: Office No. 107, Vikram Urbane, Vijay Nagar, Indore - 452010) solely for information regarding research services.
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-7 pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleAcknowledge}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 ${
                  isLight
                    ? "bg-[#D4AF37] hover:bg-[#c9a32c] text-black shadow-amber-500/20"
                    : "bg-[#D4AF37] hover:bg-[#e2bd46] active:bg-[#c49e29] text-black shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)]"
                }`}
              >
                I Acknowledge and Agree
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

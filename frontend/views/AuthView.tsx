"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { useTheme } from "../components/ThemeProvider";
import logoImg from "@/public/logo1.jpeg";

export default function AuthView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "";
  const serviceParam = searchParams.get("service") || "";
  const tabParam = searchParams.get("tab") || "login";

  const { user, login, signup } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [mode, setMode] = useState<"login" | "signup">(tabParam === "signup" ? "signup" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Login form state
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (redirectParam === "pay") {
        router.push("/#services");
      } else if (redirectParam) {
        router.push(redirectParam);
      } else {
        router.push("/");
      }
    }
  }, [user, redirectParam, router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const res = await login(loginData.identifier, loginData.password);
      if (res.success) {
        setSuccessMessage("Login successful! Redirecting to advisory services...");
        setTimeout(() => {
          if (redirectParam === "pay") {
            router.push("/#services");
          } else if (redirectParam) {
            router.push(redirectParam);
          } else {
            router.push("/");
          }
        }, 800);
      } else {
        setErrorMessage(res.error || "Invalid username/email or password");
      }
    } catch {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (signupData.password !== signupData.confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match");
      return;
    }

    if (signupData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signup(signupData);
      if (res.success) {
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          if (redirectParam === "pay") {
            router.push("/#services");
          } else if (redirectParam) {
            router.push(redirectParam);
          } else {
            router.push("/");
          }
        }, 800);
      } else {
        setErrorMessage(res.error || "Failed to create account");
      }
    } catch {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen pt-28 sm:pt-36 pb-20 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center items-center transition-colors duration-300 ${
        isLight ? "bg-[#f8fafc] text-slate-900" : "bg-[#05080f] text-white"
      }`}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Pay Now Context Alert Banner if user clicked Pay Now */}
        {redirectParam === "pay" && (
          <div
            className={`mb-6 p-4 sm:p-5 rounded-2xl border shadow-md transition-all ${
              isLight
                ? "bg-emerald-50 border-emerald-300 text-slate-900"
                : "bg-gradient-to-r from-emerald-950/80 via-[#0d201a] to-[#071410] border-emerald-500/40 text-white"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isLight
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">shopping_cart_checkout</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-extrabold uppercase tracking-wider ${
                        isLight ? "text-emerald-800" : "text-emerald-400"
                      }`}
                    >
                      Subscription Checkout
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isLight
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}
                    >
                      SEBI Compliant
                    </span>
                  </div>
                  <h3
                    className={`text-base sm:text-lg font-black tracking-tight mt-0.5 ${
                      isLight ? "text-slate-950" : "text-white"
                    }`}
                  >
                    {serviceParam ? `Subscribing to: ${serviceParam}` : "Research Advisory Service"}
                  </h3>
                  <p
                    className={`text-xs mt-0.5 leading-relaxed ${
                      isLight ? "text-slate-700 font-medium" : "text-slate-300"
                    }`}
                  >
                    Please <strong>Sign In</strong> or <strong>Create an Account</strong> to proceed to SEBI MITC agreement &amp; payment.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <span
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border shadow-xs ${
                    isLight
                      ? "bg-white text-emerald-900 border-emerald-300"
                      : "bg-white/10 text-emerald-300 border-white/15"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>1-Step Login Required</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main Split Authentication Card */}
        <div
          className={`rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 ${
            isLight
              ? "bg-white border-slate-200 text-slate-900 shadow-slate-200/60"
              : "bg-[#0b121e]/90 border-white/10 text-white backdrop-blur-2xl shadow-black/80"
          }`}
        >
          {/* LEFT SIDE: Brand Identity, Trust Signals & SEBI Info */}
          <div
            className={`lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r ${
              isLight
                ? "bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-100 border-slate-200"
                : "bg-gradient-to-br from-[#0c1626] via-[#09111c] to-[#040810] border-white/10"
            }`}
          >
            <div>
              {/* Brand Logo & Name */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-emerald-500/30 shadow-md shadow-emerald-500/20 shrink-0">
                  <Image
                    src={logoImg}
                    alt="Money Vriksh Logo"
                    width={48}
                    height={48}
                    className="object-cover"
                    priority
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-instrument tracking-tight leading-tight">
                    Money <span className={`italic ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>Vriksh</span>
                  </h2>
                  <p className={`text-[10px] uppercase font-bold tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    SEBI Research Analyst
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight leading-snug mb-2">
                Empowering Investors with Institutional Rigor.
              </h3>
              <p className={`text-xs leading-relaxed mb-6 ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                Access verified setups, SEBI-compliant digital agreements, and disciplined market research from Gourav Dharkar.
              </p>

              {/* SEBI Compliance Badge */}
              <div
                className={`p-3.5 rounded-2xl border mb-6 text-xs flex items-center gap-3 ${
                  isLight
                    ? "bg-white border-emerald-200 text-emerald-900 shadow-xs"
                    : "bg-emerald-950/30 border-emerald-500/25 text-emerald-300 shadow-xs"
                }`}
              >
                <span className="material-symbols-outlined text-2xl text-emerald-500 shrink-0">
                  verified
                </span>
                <div>
                  <p className="font-bold text-[11px] uppercase tracking-wider">SEBI Registered Research Analyst</p>
                  <p className="font-mono text-xs font-semibold mt-0.5">INH000025300 &bull; Gourav Dharkar</p>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 hidden sm:block text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isLight ? "bg-emerald-100 text-emerald-700" : "bg-emerald-500/15 text-emerald-400"
                  }`}>
                    <span className="material-symbols-outlined text-xs font-bold">check</span>
                  </span>
                  <span className={isLight ? "text-slate-700 font-medium" : "text-slate-300 font-medium"}>
                    Live Index FnO, Commodity &amp; Swing Recommendations
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isLight ? "bg-emerald-100 text-emerald-700" : "bg-emerald-500/15 text-emerald-400"
                  }`}>
                    <span className="material-symbols-outlined text-xs font-bold">check</span>
                  </span>
                  <span className={isLight ? "text-slate-700 font-medium" : "text-slate-300 font-medium"}>
                    Legally Binding SEBI MITC Digital eSign Compliance
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isLight ? "bg-emerald-100 text-emerald-700" : "bg-emerald-500/15 text-emerald-400"
                  }`}>
                    <span className="material-symbols-outlined text-xs font-bold">check</span>
                  </span>
                  <span className={isLight ? "text-slate-700 font-medium" : "text-slate-300 font-medium"}>
                    Zero Conflicts of Interest &bull; Strictly Fee-Only Advisory
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Support Callout */}
            <div className={`mt-6 pt-4 border-t text-[11px] ${isLight ? "border-slate-200 text-slate-500" : "border-white/10 text-slate-400"}`}>
              <span>Need help? WhatsApp Support: </span>
              <strong className={isLight ? "text-slate-800" : "text-slate-200"}>+91 98275 62967</strong>
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Login & Signup Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            {/* Top Form Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    {mode === "login" ? "Sign In to Account" : "Create New Account"}
                  </h2>
                  <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    {mode === "login"
                      ? "Enter your credentials to continue to your dashboard"
                      : "Fill in your details to register as a new client"}
                  </p>
                </div>
              </div>

              {/* Segmented Mode Switcher */}
              <div
                className={`mt-4 p-1 rounded-2xl flex border ${
                  isLight ? "bg-slate-100 border-slate-200" : "bg-[#060a12] border-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === "login"
                      ? isLight
                        ? "bg-white text-emerald-800 shadow-sm"
                        : "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                      : isLight
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === "signup"
                      ? isLight
                        ? "bg-white text-emerald-800 shadow-sm"
                        : "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                      : isLight
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className={`mb-4 p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 animate-shake ${
                isLight
                  ? "bg-rose-50 border-rose-300 text-rose-800"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
              }`}>
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className={`mb-4 p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
                isLight
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}>
                <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* 1. LOGIN FORM */}
            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-80">
                    Username or Email Address
                  </label>
                  <div className="relative flex items-center">
                    <span
                      className={`material-symbols-outlined absolute left-3.5 text-base ${
                        isLight ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      account_circle
                    </span>
                    <input
                      type="text"
                      required
                      value={loginData.identifier}
                      onChange={(e) =>
                        setLoginData((prev) => ({ ...prev, identifier: e.target.value }))
                      }
                      placeholder="Enter username or email address"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        isLight
                          ? "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500"
                          : "bg-[#060a12] border-white/15 text-white placeholder:text-slate-500 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-80">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <span
                      className={`material-symbols-outlined absolute left-3.5 text-base ${
                        isLight ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      lock
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData((prev) => ({ ...prev, password: e.target.value }))
                      }
                      placeholder="Enter your account password"
                      className={`w-full pl-10 pr-10 py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        isLight
                          ? "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500"
                          : "bg-[#060a12] border-white/15 text-white placeholder:text-slate-500 focus:border-emerald-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3.5 transition-colors cursor-pointer ${
                        isLight ? "text-slate-400 hover:text-slate-700" : "text-slate-400 hover:text-white"
                      }`}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      <span className="material-symbols-outlined text-base">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                      <span>Verifying &amp; Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Account</span>
                      <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                    </>
                  )}
                </button>

                <div className={`text-center pt-3 border-t ${isLight ? "border-slate-100" : "border-white/5"}`}>
                  <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    Don&apos;t have an account yet?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setErrorMessage("");
                      }}
                      className={`font-bold hover:underline cursor-pointer ${
                        isLight ? "text-emerald-700" : "text-emerald-400"
                      }`}
                    >
                      Create Account here
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* 2. SIGNUP FORM */
              <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
                {/* Username Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-80">
                    Username
                  </label>
                  <div className="relative flex items-center">
                    <span
                      className={`material-symbols-outlined absolute left-3.5 text-base ${
                        isLight ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      person
                    </span>
                    <input
                      type="text"
                      required
                      value={signupData.username}
                      onChange={(e) =>
                        setSignupData((prev) => ({
                          ...prev,
                          username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                        }))
                      }
                      placeholder="Choose unique username (e.g. rahul_verma)"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        isLight
                          ? "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500"
                          : "bg-[#060a12] border-white/15 text-white placeholder:text-slate-500 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Mail ID Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-80">
                    Mail ID (Email Address)
                  </label>
                  <div className="relative flex items-center">
                    <span
                      className={`material-symbols-outlined absolute left-3.5 text-base ${
                        isLight ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      mail
                    </span>
                    <input
                      type="email"
                      required
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="name@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        isLight
                          ? "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500"
                          : "bg-[#060a12] border-white/15 text-white placeholder:text-slate-500 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Mobile Number Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-80">
                    Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <span
                      className={`material-symbols-outlined absolute left-3.5 text-base ${
                        isLight ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      call
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={signupData.phone}
                      onChange={(e) =>
                        setSignupData((prev) => ({
                          ...prev,
                          phone: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                      placeholder="10-digit mobile number"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        isLight
                          ? "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500"
                          : "bg-[#060a12] border-white/15 text-white placeholder:text-slate-500 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Password & Confirm Password side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-80">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <span
                        className={`material-symbols-outlined absolute left-3 text-base ${
                          isLight ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        lock
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={signupData.password}
                        onChange={(e) =>
                          setSignupData((prev) => ({ ...prev, password: e.target.value }))
                        }
                        placeholder="Min 6 chars"
                        className={`w-full pl-9 pr-9 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                          isLight
                            ? "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500"
                            : "bg-[#060a12] border-white/15 text-white placeholder:text-slate-500 focus:border-emerald-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-2.5 transition-colors cursor-pointer ${
                          isLight ? "text-slate-400 hover:text-slate-700" : "text-slate-400 hover:text-white"
                        }`}
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-80">
                      Confirm Password
                    </label>
                    <div className="relative flex items-center">
                      <span
                        className={`material-symbols-outlined absolute left-3 text-base ${
                          isLight ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        lock_reset
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={signupData.confirmPassword}
                        onChange={(e) =>
                          setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                        }
                        placeholder="Re-enter password"
                        className={`w-full pl-9 pr-9 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                          isLight
                            ? "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500"
                            : "bg-[#060a12] border-white/15 text-white placeholder:text-slate-500 focus:border-emerald-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute right-2.5 transition-colors cursor-pointer ${
                          isLight ? "text-slate-400 hover:text-slate-700" : "text-slate-400 hover:text-white"
                        }`}
                        title={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {showConfirmPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 mt-3 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account &amp; Continue</span>
                      <span className="material-symbols-outlined text-sm font-bold">person_add</span>
                    </>
                  )}
                </button>

                <div className={`text-center pt-3 border-t ${isLight ? "border-slate-100" : "border-white/5"}`}>
                  <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setErrorMessage("");
                      }}
                      className={`font-bold hover:underline cursor-pointer ${
                        isLight ? "text-emerald-700" : "text-emerald-400"
                      }`}
                    >
                      Sign In here
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Bottom Back Link */}
            <div className={`mt-5 pt-3 border-t flex items-center justify-between text-[11px] ${
              isLight ? "border-slate-100" : "border-white/5"
            }`}>
              <Link
                href="/"
                className={`inline-flex items-center gap-1 font-semibold hover:text-emerald-500 transition-colors ${
                  isLight ? "text-slate-600" : "text-slate-400"
                }`}
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Money Vriksh Home</span>
              </Link>
              <span className={isLight ? "text-slate-500 font-medium" : "text-slate-400"}>
                256-Bit SSL Secured
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

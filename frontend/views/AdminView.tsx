"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logoImg from "@/public/logo1.jpeg";
import { useTheme } from "../components/ThemeProvider";

interface ClientRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  pan: string;
  serviceTitle: string;
  planLabel: string;
  priceFormatted: string;
  stepReached: number;
  status: string;
  signedDocumentName: string | null;
  signatureType: string | null;
  signatureData: string | null;
  paymentMethod: string | null;
  utrReference: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AdminStats {
  totalLeads: number;
  agreementsSigned: number;
  paymentsSubmitted: number;
  verifiedActive: number;
  totalRevenuePotential: number;
}

type NavSection = "dashboard" | "leads" | "payments" | "clients" | "compliance";

export default function AdminPage() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === "light";

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Navigation & UI Layout states
  const [activeSection, setActiveSection] = useState<NavSection>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data states
  const [records, setRecords] = useState<ClientRecord[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalLeads: 0,
    agreementsSigned: 0,
    paymentsSubmitted: 0,
    verifiedActive: 0,
    totalRevenuePotential: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");

  // Selected client for detail dossier modal
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);
  const [updatingNotes, setUpdatingNotes] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check existing session on mount
  useEffect(() => {
    try {
      const savedAuth = sessionStorage.getItem("mv_admin_auth");
      if (savedAuth === "authorized") {
        setIsAuthenticated(true);
      }
    } catch {}
    setIsCheckingAuth(false);
  }, []);

  // Fetch records whenever filters or authentication change
  useEffect(() => {
    if (isAuthenticated) {
      fetchRecords();
    }
  }, [isAuthenticated, statusFilter, serviceFilter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("mv_admin_auth", "authorized");
      } else {
        setAuthError(data.error || "Incorrect admin passcode");
      }
    } catch {
      setAuthError("Failed to connect to authentication API");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("mv_admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (serviceFilter !== "ALL") params.set("service", serviceFilter);

      const res = await fetch(`/api/admin/onboardings?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.items || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      console.error("Error loading records:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords();
  };

  const handleNavClick = (section: NavSection) => {
    setActiveSection(section);
    setIsSidebarOpen(false);

    switch (section) {
      case "dashboard":
      case "leads":
        setStatusFilter("ALL");
        break;
      case "payments":
        setStatusFilter("PAYMENT_SUBMITTED");
        break;
      case "clients":
        setStatusFilter("VERIFIED_ACTIVE");
        break;
      case "compliance":
        setStatusFilter("ALL");
        break;
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/onboardings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: updatingNotes || selectedClient?.adminNotes || "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRecords((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus, adminNotes: updatingNotes } : item
          )
        );
        if (selectedClient && selectedClient.id === id) {
          setSelectedClient({ ...selectedClient, status: newStatus, adminNotes: updatingNotes });
        }
        fetchRecords();
      }
    } catch (e) {
      console.error("Status update error:", e);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteRecord = async (id: string, name?: string) => {
    const displayName = name ? `inquiry for "${name}"` : "this inquiry";
    const confirmed = window.confirm(
      `Are you sure you want to delete ${displayName}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeletingId(id);
    try {
      const res = await fetch(`/api/admin/onboardings/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setRecords((prev) => prev.filter((item) => item.id !== id));
        if (selectedClient && selectedClient.id === id) {
          setSelectedClient(null);
        }
        fetchRecords();
      } else {
        alert(data.error || "Failed to delete inquiry");
      }
    } catch (e) {
      console.error("Delete record error:", e);
      alert("Failed to delete record from database");
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleTheme = () => {
    setTheme(isLight ? "midnight" : "light");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAYMENT_SUBMITTED":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              isLight
                ? "bg-amber-50 text-amber-800 border-amber-300"
                : "bg-amber-500/15 text-amber-400 border-amber-500/30"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Payment Submitted
          </span>
        );
      case "VERIFIED_ACTIVE":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              isLight
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active Subscribed
          </span>
        );
      case "AGREEMENT_SIGNED":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              isLight
                ? "bg-indigo-50 text-indigo-800 border-indigo-300"
                : "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Agreement Signed
          </span>
        );
      case "LEAD_CAPTURED":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              isLight
                ? "bg-sky-50 text-sky-800 border-sky-300"
                : "bg-sky-500/15 text-sky-400 border-sky-500/30"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Lead Captured
          </span>
        );
      case "REJECTED":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              isLight
                ? "bg-rose-50 text-rose-800 border-rose-300"
                : "bg-rose-500/15 text-rose-400 border-rose-500/30"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      default:
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              isLight
                ? "bg-slate-100 text-slate-700 border-slate-300"
                : "bg-slate-500/15 text-slate-400 border-slate-500/30"
            }`}
          >
            {status}
          </span>
        );
    }
  };

  // 1. Initial Authentication Check Loader
  if (isCheckingAuth) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors ${
          isLight ? "bg-slate-100 text-slate-800" : "bg-[#070b12] text-white"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono tracking-wider text-slate-500">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Login Screen
  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden select-none transition-colors ${
          isLight ? "bg-[#f1f5f9]" : "bg-[#060a10]"
        }`}
      >
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div
          className={`w-full max-w-[420px] rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 text-center border transition-all ${
            isLight
              ? "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
              : "bg-[#0d1420]/95 border-white/10 text-white shadow-black/80"
          }`}
        >
          {/* Brand Icon */}
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 ring-2 ring-emerald-500/40 shadow-md">
            <Image src={logoImg} alt="Money Vriksh Logo" fill priority className="object-cover" />
          </div>

          <h2 className="text-2xl font-black tracking-tight font-sans">
            Money <span className="text-emerald-500">Vriksh</span>
          </h2>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold mt-2 mb-1 border ${
              isLight
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ADMIN CONSOLE
          </div>
          <p className={`text-xs mb-6 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            SEBI Compliance &amp; Client Portfolio Management
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label
                className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Admin Security Passcode
              </label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  placeholder="Enter passcode (default: admin123)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-mono tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                    isLight
                      ? "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500"
                      : "bg-[#070b13] border-white/15 text-white placeholder:text-slate-500 focus:border-emerald-500"
                  }`}
                  autoFocus
                />
              </div>
              {authError && (
                <p className="text-xs text-rose-500 mt-2 pl-1 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 font-sans"
            >
              <span className="material-symbols-outlined text-base font-bold">lock_open</span>
              <span>Access Admin Dashboard</span>
            </button>
          </form>

          <div
            className={`mt-8 pt-5 border-t flex flex-col gap-2 ${
              isLight ? "border-slate-200" : "border-white/10"
            }`}
          >
            <p className="text-[11px] text-slate-500 font-mono">
              RA: Gourav Dharkar &bull; INH000025300
            </p>
            <div className="flex items-center justify-between text-xs pt-1">
              <Link
                href="/"
                className="text-slate-500 hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">arrow_back</span>
                <span>Public Website</span>
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                className="text-slate-500 hover:text-emerald-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">
                  {isLight ? "dark_mode" : "light_mode"}
                </span>
                <span>{isLight ? "Dark Theme" : "Light Theme"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Dashboard with Responsive Sidebar Layout
  return (
    <div
      className={`h-screen w-screen flex overflow-hidden font-sans select-none transition-colors duration-200 ${
        isLight ? "bg-[#f8fafc] text-slate-900" : "bg-[#070b12] text-white"
      }`}
    >
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* ========================================================
          LEFT SIDEBAR (Full Dual-Theme Support)
         ======================================================== */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 sm:w-72 flex flex-col shrink-0 z-50 transition-all duration-300 ease-in-out border-r ${
          isLight
            ? "bg-white border-slate-200 shadow-sm"
            : "bg-[#090e18] border-white/10 shadow-xl"
        } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
            isLight ? "border-slate-200 bg-slate-50/50" : "border-white/10 bg-transparent"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-1 ring-emerald-500/40 shadow-xs shrink-0">
              <Image src={logoImg} alt="Money Vriksh Logo" fill priority className="object-cover" />
            </div>
            <div>
              <span
                className={`font-black text-base tracking-tight block ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Money <span className="text-emerald-500">Vriksh</span>
              </span>
              <span
                className={`text-[10px] font-mono font-bold block ${
                  isLight ? "text-emerald-700" : "text-emerald-400"
                }`}
              >
                SEBI: INH000025300
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className={`lg:hidden p-1.5 rounded-lg ${
              isLight ? "text-slate-500 hover:bg-slate-100" : "text-slate-400 hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Main Navigation */}
          <div>
            <p
              className={`px-3 text-[10.5px] font-bold uppercase tracking-wider mb-2.5 ${
                isLight ? "text-slate-700" : "text-slate-400"
              }`}
            >
              Main Navigation
            </p>
            <nav className="space-y-1">
              {/* Dashboard / Overview */}
              <button
                type="button"
                onClick={() => handleNavClick("dashboard")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === "dashboard"
                    ? isLight
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs"
                      : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs"
                    : isLight
                    ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-lg">dashboard</span>
                  <span>Overview &amp; KPIs</span>
                </div>
              </button>

              {/* All Leads */}
              <button
                type="button"
                onClick={() => handleNavClick("leads")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === "leads"
                    ? isLight
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs"
                      : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs"
                    : isLight
                    ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-lg">group</span>
                  <span>All Inquiries</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isLight ? "bg-slate-200 text-slate-800" : "bg-white/10 text-slate-300"
                  }`}
                >
                  {stats.totalLeads}
                </span>
              </button>


              {/* Payments Submitted */}
              <button
                type="button"
                onClick={() => handleNavClick("payments")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === "payments"
                    ? isLight
                      ? "bg-amber-50 text-amber-900 border border-amber-300 shadow-xs"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-xs"
                    : isLight
                    ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-lg">qr_code_2</span>
                  <span>Payments Pending</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    stats.paymentsSubmitted > 0
                      ? isLight
                        ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                        : "bg-amber-500/25 text-amber-300 animate-pulse"
                      : isLight
                      ? "bg-slate-200 text-slate-700"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  {stats.paymentsSubmitted}
                </span>
              </button>

              {/* Active Clients */}
              <button
                type="button"
                onClick={() => handleNavClick("clients")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === "clients"
                    ? isLight
                      ? "bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-xs"
                      : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs"
                    : isLight
                    ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-lg">verified</span>
                  <span>Active Clients</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isLight
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {stats.verifiedActive}
                </span>
              </button>
            </nav>
          </div>

          {/* Compliance & Export */}
          <div>
            <p
              className={`px-3 text-[10.5px] font-bold uppercase tracking-wider mb-2.5 ${
                isLight ? "text-slate-700" : "text-slate-400"
              }`}
            >
              Compliance &amp; Reports
            </p>
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => handleNavClick("compliance")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === "compliance"
                    ? isLight
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs"
                      : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs"
                    : isLight
                    ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-lg">policy</span>
                  <span>SEBI Audit Log</span>
                </div>
              </button>

              <a
                href="/api/admin/export"
                download
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isLight
                    ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-lg text-emerald-500">download</span>
                <span>Download CSV Export</span>
              </a>
            </nav>
          </div>

          {/* External Links */}
          <div>
            <p
              className={`px-3 text-[10.5px] font-bold uppercase tracking-wider mb-2.5 ${
                isLight ? "text-slate-700" : "text-slate-400"
              }`}
            >
              Public Links
            </p>
            <Link
              href="/"
              target="_blank"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                isLight
                  ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>View Public Site</span>
              </div>
              <span className="text-[10px] text-slate-400">moneyvriksh.com</span>
            </Link>
          </div>
        </div>

        {/* Sidebar Footer: RA Profile Card */}
        <div
          className={`p-4 border-t shrink-0 ${
            isLight ? "bg-slate-50 border-slate-200" : "bg-[#060a12] border-white/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-xs text-emerald-600 dark:text-emerald-400 shrink-0">
                GD
              </div>
              <div className="overflow-hidden">
                <p
                  className={`text-xs font-extrabold leading-tight truncate ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  Gourav Dharkar
                </p>
                <p className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-mono font-medium truncate">
                  Research Analyst
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isLight
                  ? "text-rose-600 hover:bg-rose-50"
                  : "text-rose-400 hover:bg-rose-500/10"
              }`}
              title="Logout from Admin"
            >
              <span className="material-symbols-outlined text-base">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          MAIN WORKSPACE AREA
         ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header
          className={`h-16 px-4 sm:px-6 border-b flex items-center justify-between shrink-0 z-20 transition-colors ${
            isLight
              ? "bg-white/90 backdrop-blur-md border-slate-200 text-slate-900"
              : "bg-[#080d16]/90 backdrop-blur-md border-white/10 text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-xl border ${
                isLight
                  ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                  : "bg-white/5 border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight leading-tight flex items-center gap-2 font-sans">
                <span>
                  {activeSection === "dashboard" && "Dashboard Overview"}
                  {activeSection === "leads" && "Client Onboarding Inquiries"}
                  {activeSection === "payments" && "UPI Payment Verifications"}
                  {activeSection === "clients" && "Verified Advisory Subscribers"}
                  {activeSection === "compliance" && "SEBI Compliance & Audit Dossier"}
                </span>
                <span
                  className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    isLight
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                  }`}
                >
                  LIVE
                </span>
              </h1>
              <p
                className={`text-[11px] hidden sm:block ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Money Vriksh &bull; SEBI Reg. INH000025300 &bull; Gourav Dharkar
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
              }`}
              title={`Switch to ${isLight ? "Dark" : "Light"} Theme`}
            >
              <span className="material-symbols-outlined text-lg">
                {isLight ? "dark_mode" : "light_mode"}
              </span>
            </button>

            {/* Live Indicator Pill */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono font-medium ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-700"
                  : "bg-white/5 border-white/10 text-slate-300"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live DB</span>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={fetchRecords}
              disabled={isLoading}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                  : "bg-[#111927] hover:bg-[#182337] text-slate-300 border-white/15"
              }`}
              title="Refresh Data"
            >
              <span
                className={`material-symbols-outlined text-base ${
                  isLoading ? "animate-spin text-emerald-500" : ""
                }`}
              >
                sync
              </span>
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Export CSV button */}
            <a
              href="/api/admin/export"
              download
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download SEBI Audit CSV"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span className="hidden sm:inline">Export CSV</span>
            </a>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 [scrollbar-width:thin]">
          {/* Top KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Leads */}
            <div
              onClick={() => handleNavClick("leads")}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                isLight
                  ? "bg-white border-slate-200 hover:border-slate-300 text-slate-900"
                  : "bg-[#0d1422] border-white/10 hover:border-white/20 text-white"
              } ${activeSection === "leads" ? "ring-2 ring-emerald-500/50" : ""}`}
            >
              <div
                className={`flex items-center justify-between font-bold text-[11px] uppercase tracking-wider ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                <span>Total Leads</span>
                <span className="material-symbols-outlined text-lg">group</span>
              </div>
              <p
                className={`text-2xl sm:text-3xl font-black mt-2 font-sans ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {stats.totalLeads}
              </p>
              <p className={`text-[11px] mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Inquiries captured via form
              </p>
            </div>

            {/* Revenue Pipeline */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-sm ${
                isLight
                  ? "bg-white border-slate-200 text-slate-900"
                  : "bg-[#0d1422] border-white/10 text-white"
              }`}
            >
              <div
                className={`flex items-center justify-between font-bold text-[11px] uppercase tracking-wider ${
                  isLight ? "text-emerald-700" : "text-emerald-400"
                }`}
              >
                <span>Revenue Pipeline</span>
                <span className="material-symbols-outlined text-lg">payments</span>
              </div>
              <p
                className={`text-2xl sm:text-3xl font-black mt-2 font-mono ${
                  isLight ? "text-emerald-700" : "text-emerald-400"
                }`}
              >
                ₹{stats.totalRevenuePotential.toLocaleString("en-IN")}
              </p>
              <p className={`text-[11px] mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Total prospective fees
              </p>
            </div>

            {/* Payments Submitted */}
            <div
              onClick={() => handleNavClick("payments")}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                isLight
                  ? "bg-white border-slate-200 hover:border-amber-300 text-slate-900"
                  : "bg-[#0d1422] border-white/10 hover:border-amber-500/40 text-white"
              } ${activeSection === "payments" ? "ring-2 ring-amber-500/50" : ""}`}
            >
              <div
                className={`flex items-center justify-between font-bold text-[11px] uppercase tracking-wider ${
                  isLight ? "text-amber-600" : "text-amber-400"
                }`}
              >
                <span>UPI Payments</span>
                <span className="material-symbols-outlined text-lg">qr_code_2</span>
              </div>
              <p
                className={`text-2xl sm:text-3xl font-black mt-2 font-sans ${
                  isLight ? "text-amber-700" : "text-amber-400"
                }`}
              >
                {stats.paymentsSubmitted}
              </p>
              <p className={`text-[11px] mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Transfers awaiting verification
              </p>
            </div>

            {/* Active Subscribed Clients */}
            <div
              onClick={() => handleNavClick("clients")}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                isLight
                  ? "bg-white border-slate-200 hover:border-emerald-300 text-slate-900"
                  : "bg-[#0d1422] border-white/10 hover:border-emerald-500/40 text-white"
              } ${activeSection === "clients" ? "ring-2 ring-emerald-500/50" : ""}`}
            >
              <div
                className={`flex items-center justify-between font-bold text-[11px] uppercase tracking-wider ${
                  isLight ? "text-emerald-600" : "text-emerald-400"
                }`}
              >
                <span>Active Clients</span>
                <span className="material-symbols-outlined text-lg">verified</span>
              </div>
              <p
                className={`text-2xl sm:text-3xl font-black mt-2 font-sans ${
                  isLight ? "text-emerald-700" : "text-emerald-400"
                }`}
              >
                {stats.verifiedActive}
              </p>
              <p className={`text-[11px] mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Activated research advisory
              </p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div
            className={`p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3.5 ${
              isLight ? "bg-white border-slate-200" : "bg-[#0d1422] border-white/10"
            }`}
          >
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg relative flex items-center">
              <span
                className={`material-symbols-outlined absolute left-3.5 text-base ${
                  isLight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Search by client name, mobile (+91), email, or PAN card..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-16 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                  isLight
                    ? "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500"
                    : "bg-[#080d16] border-white/15 text-white placeholder:text-slate-500 focus:border-emerald-500"
                }`}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    fetchRecords();
                  }}
                  className={`absolute right-3 text-xs px-2 py-1 rounded cursor-pointer ${
                    isLight
                      ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      : "bg-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  Clear
                </button>
              )}
            </form>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[11px] font-bold hidden sm:inline ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer focus:outline-none ${
                    isLight
                      ? "bg-slate-50 border-slate-300 text-slate-800 focus:border-emerald-500"
                      : "bg-[#080d16] border-white/15 text-slate-200 focus:border-emerald-500"
                  }`}
                >
                  <option value="ALL">All Statuses ({records.length})</option>
                  <option value="PAYMENT_SUBMITTED">Payment Submitted ({stats.paymentsSubmitted})</option>
                  <option value="LEAD_CAPTURED">Lead In-Progress</option>
                  <option value="VERIFIED_ACTIVE">Active Subscribed ({stats.verifiedActive})</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Service Filter */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[11px] font-bold hidden sm:inline ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Service:
                </span>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer focus:outline-none ${
                    isLight
                      ? "bg-slate-50 border-slate-300 text-slate-800 focus:border-emerald-500"
                      : "bg-[#080d16] border-white/15 text-slate-200 focus:border-emerald-500"
                  }`}
                >
                  <option value="ALL">All Advisory Plans</option>
                  <option value="Commodity">Commodity Advisory</option>
                  <option value="FnO">Index + Equity FnO</option>
                  <option value="Investment">Long-Term Investment</option>
                  <option value="Premium">Premium Advisory Combo</option>
                  <option value="Swing">Swing Trading</option>
                </select>
              </div>
            </div>
          </div>

          {/* Client Table Container */}
          <div
            className={`rounded-2xl border shadow-sm overflow-hidden ${
              isLight ? "bg-white border-slate-200" : "bg-[#0d1422] border-white/10"
            }`}
          >
            <div className="overflow-x-auto [scrollbar-width:thin]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    className={`border-b uppercase text-[10.5px] tracking-wider font-extrabold ${
                      isLight
                        ? "bg-slate-50 border-slate-200 text-slate-700"
                        : "bg-[#090f1a] border-white/10 text-slate-400"
                    }`}
                  >
                    <th className="py-3.5 px-4 whitespace-nowrap">Submission Time</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Client Details</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Contact Info</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">PAN Card</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Service &amp; Plan</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Fee Amount</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? "divide-slate-100" : "divide-white/5"}`}>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span
                            className={`material-symbols-outlined text-5xl mb-3 block ${
                              isLight ? "text-slate-300" : "text-slate-600"
                            }`}
                          >
                            inbox
                          </span>
                          <p
                            className={`text-sm font-bold ${
                              isLight ? "text-slate-800" : "text-slate-300"
                            }`}
                          >
                            {isLoading
                              ? "Loading records from database..."
                              : "No onboarding submissions found matching filters."}
                          </p>
                          <p
                            className={`text-xs mt-1 max-w-sm ${
                              isLight ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            When users fill details or sign the MITC agreement on the website, their compliance dossier will automatically populate here.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    records.map((item) => (
                      <tr
                        key={item.id}
                        className={`transition-colors group cursor-pointer ${
                          isLight
                            ? "hover:bg-slate-50/80 text-slate-800"
                            : "hover:bg-white/[0.03] text-slate-200"
                        }`}
                        onClick={() => {
                          setSelectedClient(item);
                          setUpdatingNotes(item.adminNotes || "");
                        }}
                      >
                        {/* Timestamp */}
                        <td
                          className={`py-3.5 px-4 font-mono whitespace-nowrap ${
                            isLight ? "text-slate-600" : "text-slate-400"
                          }`}
                        >
                          <span className="font-semibold block">
                            {new Date(item.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-[10.5px] text-slate-400">
                            {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>

                        {/* Client Name & Signed Indicator */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 border ${
                                isLight
                                  ? "bg-slate-100 border-slate-300 text-slate-700"
                                  : "bg-white/10 border-white/15 text-slate-200"
                              }`}
                            >
                              {(item.fullName || "C").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong
                                className={`font-bold transition-colors block leading-tight ${
                                  isLight
                                    ? "text-slate-900 group-hover:text-emerald-700"
                                    : "text-white group-hover:text-emerald-400"
                                }`}
                              >
                                {item.fullName || "Unnamed Client"}
                              </strong>
                              {item.signedDocumentName ? (
                                <span
                                  className={`text-[10.5px] font-bold inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded border ${
                                    isLight
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                      : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[12px]">draw</span>
                                  <span>Signed: {item.signedDocumentName}</span>
                                </span>
                              ) : item.pan === "ENQUIRY" || item.planLabel === "Website Contact Form" ? (
                                <span
                                  className={`text-[10.5px] font-bold inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded border ${
                                    isLight
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                      : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[12px]">mail</span>
                                  <span>Website Contact Lead</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  Lead In-Progress (Unsigned)
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Contact Info (Mobile + Email) */}
                        <td className="py-3.5 px-4">
                          <div
                            className={`flex items-center gap-1.5 font-bold ${
                              isLight ? "text-slate-800" : "text-slate-200"
                            }`}
                          >
                            <span>{item.phone ? `+91 ${item.phone}` : "—"}</span>
                            {item.phone && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyText(item.phone, `phone-${item.id}`);
                                }}
                                className={`transition-colors ${
                                  isLight
                                    ? "text-slate-400 hover:text-slate-800"
                                    : "text-slate-500 hover:text-white"
                                }`}
                                title="Copy Mobile"
                              >
                                <span className="material-symbols-outlined text-xs">
                                  {copiedId === `phone-${item.id}` ? "check" : "content_copy"}
                                </span>
                              </button>
                            )}
                          </div>
                          <div
                            className={`text-[11px] truncate max-w-[170px] mt-0.5 font-medium ${
                              isLight ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            {item.email || "—"}
                          </div>
                        </td>

                        {/* PAN Card */}
                        <td className="py-3.5 px-4 font-mono font-bold uppercase tracking-wider">
                          {item.pan && item.pan !== "ENQUIRY" ? (
                            <span
                              className={`px-2 py-0.5 rounded border ${
                                isLight
                                  ? "bg-slate-100 border-slate-300 text-slate-800"
                                  : "bg-white/5 border-white/10 text-slate-200"
                              }`}
                            >
                              {item.pan}
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded text-[10.5px] font-sans font-bold border ${
                                isLight
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              }`}
                            >
                              Inquiry (No PAN)
                            </span>
                          )}
                        </td>

                        {/* Service & Plan */}
                        <td className="py-3.5 px-4">
                          <div
                            className={`font-bold leading-tight ${
                              isLight ? "text-slate-900" : "text-slate-200"
                            }`}
                          >
                            {item.serviceTitle}
                          </div>
                          <div
                            className={`text-[11px] font-medium mt-0.5 ${
                              isLight ? "text-slate-600" : "text-slate-400"
                            }`}
                          >
                            {item.planLabel}
                          </div>
                        </td>

                        {/* Amount */}
                        <td
                          className={`py-3.5 px-4 text-right font-black font-mono text-sm whitespace-nowrap ${
                            isLight ? "text-emerald-700" : "text-emerald-400"
                          }`}
                        >
                          {item.priceFormatted}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div
                            className="flex items-center justify-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* WhatsApp Direct Chat */}
                            {item.phone && (
                              <a
                                href={`https://wa.me/91${item.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                                  `Hello ${item.fullName || "Client"}, this is Gourav Dharkar (SEBI Registered Research Analyst: INH000025300, Money Vriksh). We have received your onboarding details for ${item.serviceTitle}. How can we assist you today?`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  isLight
                                    ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/25"
                                }`}
                                title="Chat with Client on WhatsApp"
                              >
                                <span className="material-symbols-outlined text-sm">chat</span>
                              </a>
                            )}

                            {/* View Full Dossier */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedClient(item);
                                setUpdatingNotes(item.adminNotes || "");
                              }}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                isLight
                                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                                  : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10"
                              }`}
                              title="View Full Compliance Dossier"
                            >
                              <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>

                            {/* Delete Inquiry Record */}
                            <button
                              type="button"
                              onClick={() => handleDeleteRecord(item.id, item.fullName)}
                              disabled={isDeletingId === item.id}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-40 ${
                                isLight
                                  ? "bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border-rose-200"
                                  : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border-rose-500/20"
                              }`}
                              title="Delete this inquiry"
                            >
                              <span
                                className={`material-symbols-outlined text-sm ${
                                  isDeletingId === item.id ? "animate-spin" : ""
                                }`}
                              >
                                {isDeletingId === item.id ? "sync" : "delete"}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================
          CLIENT DOSSIER & COMPLIANCE MODAL
         ======================================================== */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
          <div
            className={`w-full max-w-[640px] rounded-3xl p-6 shadow-2xl text-left border max-h-[92vh] overflow-y-auto transition-colors ${
              isLight
                ? "bg-white border-slate-200 text-slate-900"
                : "bg-[#0e1625] border-white/15 text-white"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between pb-4 border-b ${
                isLight ? "border-slate-200" : "border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${
                    isLight
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                      : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">person</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-tight font-sans">
                    Client Compliance Dossier
                  </h3>
                  <p
                    className={`text-[11px] font-mono ${
                      isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    ID: {selectedClient.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                  isLight
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Status & Action Bar */}
            <div
              className={`my-4 p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isLight
                  ? "bg-slate-50 border-slate-200"
                  : "bg-[#090f1a] border-white/10"
              }`}
            >
              <div>
                <span
                  className={`text-[10px] uppercase tracking-wider font-bold block ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Current Client Status
                </span>
                <div className="mt-1">{getStatusBadge(selectedClient.status)}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(selectedClient.id, "VERIFIED_ACTIVE")}
                  disabled={isUpdatingStatus || selectedClient.status === "VERIFIED_ACTIVE"}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-xs disabled:opacity-40"
                >
                  Activate Advisory
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(selectedClient.id, "REJECTED")}
                  disabled={isUpdatingStatus || selectedClient.status === "REJECTED"}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600/10 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-300 transition-all cursor-pointer disabled:opacity-40"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRecord(selectedClient.id, selectedClient.fullName)}
                  disabled={isDeletingId === selectedClient.id}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer shadow-xs disabled:opacity-40 flex items-center gap-1"
                  title="Delete this client or inquiry from database"
                >
                  <span
                    className={`material-symbols-outlined text-xs ${
                      isDeletingId === selectedClient.id ? "animate-spin" : ""
                    }`}
                  >
                    {isDeletingId === selectedClient.id ? "sync" : "delete"}
                  </span>
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                className={`p-3 rounded-xl border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/5"
                }`}
              >
                <span
                  className={`text-[10.5px] block font-bold uppercase ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Full Name
                </span>
                <strong
                  className={`text-sm font-bold block mt-0.5 ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  {selectedClient.fullName || "—"}
                </strong>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/5"
                }`}
              >
                <span
                  className={`text-[10.5px] block font-bold uppercase ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  PAN Card Number
                </span>
                <strong
                  className={`text-sm font-mono block mt-0.5 font-bold tracking-wider ${
                    isLight ? "text-emerald-700" : "text-emerald-400"
                  }`}
                >
                  {selectedClient.pan && selectedClient.pan !== "ENQUIRY"
                    ? selectedClient.pan
                    : "Not Applicable (Website Inquiry)"}
                </strong>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/5"
                }`}
              >
                <span
                  className={`text-[10.5px] block font-bold uppercase ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Mobile Phone
                </span>
                <span
                  className={`text-sm block mt-0.5 font-semibold ${
                    isLight ? "text-slate-800" : "text-slate-200"
                  }`}
                >
                  {selectedClient.phone ? `+91 ${selectedClient.phone}` : "—"}
                </span>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/5"
                }`}
              >
                <span
                  className={`text-[10.5px] block font-bold uppercase ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Email Address
                </span>
                <span
                  className={`text-sm block mt-0.5 truncate font-semibold ${
                    isLight ? "text-slate-800" : "text-slate-200"
                  }`}
                >
                  {selectedClient.email || "—"}
                </span>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/5"
                }`}
              >
                <span
                  className={`text-[10.5px] block font-bold uppercase ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Service Subscribed
                </span>
                <strong
                  className={`text-xs block mt-0.5 font-bold ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  {selectedClient.serviceTitle} ({selectedClient.planLabel})
                </strong>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-white/5"
                }`}
              >
                <span
                  className={`text-[10.5px] block font-bold uppercase ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Fee Amount
                </span>
                <strong
                  className={`text-sm font-mono block mt-0.5 font-black ${
                    isLight ? "text-emerald-700" : "text-emerald-400"
                  }`}
                >
                  {selectedClient.priceFormatted}
                </strong>
              </div>
            </div>

            {/* SEBI MITC Digital Signature & Payment Audit */}
            <div
              className={`mt-3.5 p-4 rounded-2xl border text-xs space-y-1.5 ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-800"
                  : "bg-[#090f1a] border-white/10 text-slate-300"
              }`}
            >
              <div
                className={`flex items-center justify-between pb-2 border-b ${
                  isLight ? "border-slate-200" : "border-white/5"
                }`}
              >
                <h4
                  className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isLight ? "text-slate-800" : "text-slate-200"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm text-emerald-500">verified</span>
                  <span>SEBI Compliance Digital Signature</span>
                </h4>
                <span
                  className={`text-[10.5px] font-mono ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Stage {selectedClient.stepReached} / 10
                </span>
              </div>

              <div className="pt-2 space-y-2.5">
                {/* Visual Client Signature Box (Real Hand-Drawn Signature Display) */}
                <div
                  className={`p-4 rounded-2xl border ${
                    isLight ? "bg-white border-slate-200" : "bg-[#060a12] border-white/10"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10.5px] text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-emerald-600">draw</span>
                        <span>Client Manual Signature (Real)</span>
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Hand-drawn signature captured during SEBI MITC agreement execution
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        <span>Legally Verified MITC</span>
                      </span>
                    </div>
                  </div>

                  {/* Document Signature Pad Frame */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center min-h-[110px] relative overflow-hidden">
                    {selectedClient.signatureData ? (
                      <div className="w-full flex flex-col items-center justify-center py-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedClient.signatureData}
                          alt={`Official hand-drawn signature of ${selectedClient.signedDocumentName || selectedClient.fullName}`}
                          className="h-20 sm:h-24 max-w-[320px] object-contain filter contrast-125"
                        />
                      </div>
                    ) : selectedClient.signedDocumentName ? (
                      <div className="py-4 text-center">
                        <p className="text-xl italic font-serif text-slate-700 font-bold">
                          {selectedClient.signedDocumentName}
                        </p>
                        <p className="text-[10.5px] text-amber-600 font-mono mt-1">
                          Digitally recorded &bull; Signature verification logged
                        </p>
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <span className="material-symbols-outlined text-3xl text-amber-500 mb-1">
                          pending_actions
                        </span>
                        <p className="text-sm font-bold text-slate-800">
                          Agreement Pending Signing
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Lead captured via Website Contact Form &bull; Awaiting client KYC &amp; MITC signature
                        </p>
                      </div>
                    )}

                    {/* Legal Document Signing Line */}
                    <div className="w-4/5 max-w-[320px] border-b border-dashed border-slate-300 mt-2 mb-1.5" />
                    <div className="flex items-center justify-between w-4/5 max-w-[320px] text-[10.5px] text-slate-500 font-medium">
                      <span>Signer: <strong>{selectedClient.signedDocumentName || selectedClient.fullName}</strong></span>
                      <span className="font-mono text-[10px]">
                        {selectedClient.signatureData
                          ? "Canvas Drawn (Real)"
                          : selectedClient.signedDocumentName
                          ? "eSign Verified"
                          : "Pending Signature"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <p>
                    <strong>Signer Identity:</strong> {selectedClient.signedDocumentName || selectedClient.fullName || "—"}
                  </p>
                  <p>
                    <strong>Payment Mode:</strong> {selectedClient.paymentMethod || "UPI QR Transfer"}
                  </p>
                  <p className="col-span-1 sm:col-span-2 text-slate-400 font-mono">
                    Signed Timestamp: {new Date(selectedClient.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Inquiry Message Details if present */}
            {selectedClient.adminNotes && (
              <div
                className={`mt-4 p-4 rounded-2xl border ${
                  isLight
                    ? "bg-emerald-50/70 border-emerald-200"
                    : "bg-emerald-950/20 border-emerald-500/20"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1.5">
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>Customer Inquiry Message</span>
                </div>
                <p
                  className={`text-xs whitespace-pre-wrap leading-relaxed font-sans ${
                    isLight ? "text-slate-800" : "text-slate-200"
                  }`}
                >
                  {selectedClient.adminNotes}
                </p>
              </div>
            )}

            {/* Admin Notes */}
            <div className="mt-4">
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Private Advisory Notes / Verification Details
              </label>
              <textarea
                rows={2}
                placeholder="Add private verification notes, bank UTR reference, risk profiling notes..."
                value={updatingNotes}
                onChange={(e) => setUpdatingNotes(e.target.value)}
                className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                  isLight
                    ? "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500"
                    : "bg-[#080d15] border-white/15 text-white placeholder:text-slate-500 focus:border-emerald-500"
                }`}
              />
              <button
                type="button"
                onClick={() => handleStatusUpdate(selectedClient.id, selectedClient.status)}
                disabled={isUpdatingStatus}
                className={`mt-2 px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  isLight
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                    : "bg-white/10 hover:bg-white/20 text-slate-200 border-white/10"
                }`}
              >
                Save Notes
              </button>
            </div>

            {/* Modal Bottom Actions */}
            <div
              className={`mt-6 pt-4 border-t flex items-center justify-between ${
                isLight ? "border-slate-200" : "border-white/10"
              }`}
            >
              {selectedClient.phone ? (
                <a
                  href={`https://wa.me/91${selectedClient.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hi ${selectedClient.fullName || "Client"}, your onboarding with Money Vriksh (SEBI Reg: INH000025300) for ${selectedClient.serviceTitle} is being processed.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:scale-[1.01] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-bold">chat</span>
                  <span>Chat on WhatsApp</span>
                </a>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isLight
                    ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                    : "border-white/15 text-slate-300 hover:bg-white/5"
                }`}
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

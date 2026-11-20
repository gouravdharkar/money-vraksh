"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";
import Image from "next/image";
import logoImg from "@/public/logo1.jpeg";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isLight = theme === "light";

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Do not render website Navbar on Admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", "/");
    }
  };

  return (
    <nav
      aria-label="Main Navigation"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "bg-surface-glass/95 backdrop-blur-2xl shadow-md border-b border-primary/20"
        : "bg-surface-glass backdrop-blur-2xl shadow-sm border-b border-transparent"
        } before:absolute before:bottom-0 before:left-1/4 before:right-1/4 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:content-['']`}
    >
      <div className="flex justify-between items-center px-3 sm:px-6 md:px-margin-desktop h-[68px] sm:h-[84px] max-w-container-max mx-auto w-full">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 focus-ring rounded-full py-1 px-1 group transition-transform duration-200 hover:scale-[1.02]"
          aria-label="Money Vriksh Home"
        >
          <div className="relative shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden ring-2 ring-primary/30 shadow-[0_0_12px_rgba(50,205,148,0.15)] group-hover:ring-primary/50 group-hover:shadow-[0_0_18px_rgba(50,205,148,0.25)] transition-all duration-300">
            <Image
              src={logoImg}
              alt="Money Vriksh Logo"
              fill
              sizes="(max-width: 640px) 44px, 52px"
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          <span className="font-instrument text-[1.35rem] sm:text-[1.55rem] leading-none tracking-tight flex items-baseline select-none">
            <span className="text-on-surface font-normal">Money</span>
            <span className="italic font-normal animating-gradient-text pl-1.5 pr-0.5">Vriksh</span>
          </span>
        </Link>

        {/* Actions (Theme toggle & Get Started) */}
        <div className="flex items-center gap-2.5 sm:gap-3 relative">
          {/* Theme Dropdown Toggle */}
          <div className="relative">
            <button
              suppressHydrationWarning
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className={`flex items-center justify-center p-2 rounded-full transition-all duration-200 cursor-pointer focus-ring min-w-[40px] min-h-[40px] ${isLight
                ? "hover:bg-slate-100 text-slate-700 hover:text-emerald-700"
                : "hover:bg-white/10 text-slate-300 hover:text-emerald-400"
                }`}
              title="Switch Theme"
              aria-label="Switch Theme"
            >
              <span className="material-symbols-outlined text-xl" suppressHydrationWarning>
                {!mounted
                  ? "dark_mode"
                  : theme === "midnight"
                    ? "dark_mode"
                    : theme === "truedark"
                      ? "brightness_3"
                      : "light_mode"}
              </span>
            </button>

            {themeMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setThemeMenuOpen(false)}
                />
                <div
                  className={`absolute right-0 mt-2.5 w-44 rounded-2xl py-2 z-50 shadow-2xl animate-fade-in border transition-all ${isLight
                    ? "bg-white border-slate-200 text-slate-800 shadow-xl shadow-slate-300/40"
                    : "bg-[#0c1424] border-slate-700 text-white shadow-2xl shadow-black/90"
                    }`}
                >
                  <button
                    onClick={() => {
                      setTheme("midnight");
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${theme === "midnight"
                      ? isLight
                        ? "text-emerald-700 bg-emerald-50 font-extrabold"
                        : "text-emerald-400 bg-emerald-500/15 font-extrabold"
                      : isLight
                        ? "text-slate-700 hover:bg-slate-100"
                        : "text-slate-300 hover:bg-white/5"
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">dark_mode</span>
                    Midnight
                  </button>
                  <button
                    onClick={() => {
                      setTheme("truedark");
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${theme === "truedark"
                      ? isLight
                        ? "text-emerald-700 bg-emerald-50 font-extrabold"
                        : "text-emerald-400 bg-emerald-500/15 font-extrabold"
                      : isLight
                        ? "text-slate-700 hover:bg-slate-100"
                        : "text-slate-300 hover:bg-white/5"
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">brightness_3</span>
                    True Dark
                  </button>
                  <button
                    onClick={() => {
                      setTheme("light");
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${theme === "light"
                      ? isLight
                        ? "text-emerald-700 bg-emerald-50 font-extrabold"
                        : "text-emerald-400 bg-emerald-500/15 font-extrabold"
                      : isLight
                        ? "text-slate-700 hover:bg-slate-100"
                        : "text-slate-300 hover:bg-white/5"
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">light_mode</span>
                    Light
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User Account / Sign In */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shadow-xs ${isLight
                  ? "border-emerald-300 bg-emerald-50 hover:bg-emerald-100/70 text-slate-900"
                  : "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-white"
                  }`}
                title="Account Profile"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black uppercase shadow-xs">
                  {user.username.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{user.username}</span>
                <span className="material-symbols-outlined text-sm opacity-60">expand_more</span>
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div
                    className={`absolute right-0 mt-3 w-72 rounded-2xl p-3.5 z-50 shadow-2xl animate-fade-in border transition-all text-xs text-left ${isLight
                      ? "bg-white border-slate-200 text-slate-900 shadow-2xl shadow-slate-400/30 ring-1 ring-slate-900/5"
                      : "bg-[#0b121e] border-slate-700/80 text-white shadow-2xl shadow-black/95 ring-1 ring-white/10"
                      }`}
                    style={{ backdropFilter: "none" }}
                  >
                    {/* User Identity Header Card */}
                    <div
                      className={`p-3 rounded-xl mb-2.5 border ${isLight
                        ? "bg-emerald-50/80 border-emerald-200 text-slate-900"
                        : "bg-white/[0.05] border-white/10 text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm uppercase shadow-sm shrink-0">
                          {user.username.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p
                              className={`font-black text-sm truncate ${isLight ? "text-slate-950" : "text-white"
                                }`}
                            >
                              {user.username}
                            </p>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 ${isLight
                                ? "bg-emerald-600 text-white"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                }`}
                            >
                              Client
                            </span>
                          </div>
                          <p
                            className={`text-[11px] truncate mt-0.5 font-medium ${isLight ? "text-slate-700" : "text-slate-300"
                              }`}
                          >
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] font-mono ${isLight
                          ? "border-emerald-200/80 text-slate-700"
                          : "border-white/10 text-slate-300"
                          }`}
                      >
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-emerald-500">
                            call
                          </span>
                          +91 {user.phone}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${isLight ? "text-emerald-700" : "text-emerald-400"
                            }`}
                        >
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className={`w-full text-left px-3 py-2.5 text-xs font-bold flex items-center justify-between rounded-xl transition-all cursor-pointer ${isLight
                          ? "text-slate-800 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200"
                          : "text-slate-200 hover:text-emerald-400 hover:bg-emerald-500/15 border border-transparent hover:border-emerald-500/30"
                          }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-base text-emerald-500">
                            workspace_premium
                          </span>
                          <span>My Services &amp; Agreements</span>
                        </span>
                        <span className="material-symbols-outlined text-sm opacity-50">
                          chevron_right
                        </span>
                      </Link>

                      <Link
                        href="/#services"
                        onClick={() => setUserMenuOpen(false)}
                        className={`w-full text-left px-3 py-2.5 text-xs font-bold flex items-center justify-between rounded-xl transition-all cursor-pointer ${isLight
                          ? "text-slate-800 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200"
                          : "text-slate-200 hover:text-emerald-400 hover:bg-emerald-500/15 border border-transparent hover:border-emerald-500/30"
                          }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-base text-emerald-500">
                            storefront
                          </span>
                          <span>Browse Advisory Plans</span>
                        </span>
                        <span className="material-symbols-outlined text-sm opacity-50">
                          chevron_right
                        </span>
                      </Link>
                    </div>

                    {/* Divider & Sign Out */}
                    <div
                      className={`mt-2 pt-2 border-t ${isLight ? "border-slate-100" : "border-white/10"
                        }`}
                    >
                      <button
                        type="button"
                        onClick={async () => {
                          setUserMenuOpen(false);
                          await logout();
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center gap-2 rounded-xl transition-all cursor-pointer ${isLight
                          ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          : "text-rose-400 hover:text-rose-300 hover:bg-rose-500/15"
                          }`}
                      >
                        <span className="material-symbols-outlined text-base">logout</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={`whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full border text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${isLight
                ? "border-slate-300 hover:border-emerald-500/60 hover:bg-emerald-50 text-slate-800"
                : "border-white/15 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-white"
                }`}
            >
              <span className="material-symbols-outlined text-sm sm:text-base text-emerald-500">
                account_circle
              </span>
              <span>Sign In</span>
            </Link>
          )}

          <a
            href="#contact"
            onClick={handleScrollToContact}
            className="hidden sm:inline-flex items-center justify-center gradient-bg-primary text-background font-label-md text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:shadow-[0_0_15px_rgba(78,222,163,0.4)] transition-all duration-300 focus-ring font-bold shrink-0 cursor-pointer"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}

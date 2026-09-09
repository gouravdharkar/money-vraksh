"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";
import Image from "next/image";

const MotionLink = motion.create(Link);

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Payment", href: "/payment" },
    { name: "Contact Us", href: "/contact" },
    { name: "Disclosure", href: "/disclosure" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled
        ? "bg-surface-glass/95 backdrop-blur-2xl shadow-md border-b border-primary/20"
        : "bg-surface-glass backdrop-blur-2xl shadow-sm border-b border-transparent"
    } before:absolute before:bottom-0 before:left-1/4 before:right-1/4 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:content-['']`}>
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 sm:h-20 max-w-container-max mx-auto w-full">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 sm:gap-3.5 focus-ring rounded-lg py-1 px-1.5 group transition-transform duration-200 hover:scale-[1.02]"
          aria-label="Money Vriksh Home"
        >
          <div className="relative flex items-center justify-center shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
            <Image
              src="/logo1.png"
              alt="Money Vriksh Logo"
              fill
              sizes="(max-width: 640px) 32px, (max-width: 768px) 36px, 40px"
              className="object-contain"
              priority
            />
          </div>
          <span className="font-instrument text-[1.85rem] sm:text-[2.2rem] md:text-[2.4rem] leading-none tracking-tight flex items-baseline select-none">
            <span className="text-white font-normal">Money</span>
            <span className="italic font-normal animating-gradient-text pr-0.5">Vriksh</span>
          </span>
        </Link>

        {/* Desktop Links (Visible on Large Screens) */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-all duration-200 font-body-md text-sm xl:text-base focus-ring rounded-sm py-1 ${
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions (Theme toggle & Get Started) */}
        <div className="flex items-center gap-2 sm:gap-4 relative">
          {/* Theme Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high/50 text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer focus-ring min-w-[40px] min-h-[40px]"
              title="Switch Theme"
              aria-label="Switch Theme"
            >
              <span className="material-symbols-outlined text-xl">
                {theme === "midnight" ? "dark_mode" : theme === "truedark" ? "brightness_3" : "light_mode"}
              </span>
            </button>

            {themeMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setThemeMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-44 glass-panel rounded-xl py-2 z-50 shadow-2xl animate-fade-in border border-white/10">
                  <button
                    onClick={() => {
                      setTheme("midnight");
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer focus-ring rounded-md ${
                      theme === "midnight" ? "text-primary font-bold" : "text-on-surface-variant"
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
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer focus-ring rounded-md ${
                      theme === "truedark" ? "text-primary font-bold" : "text-on-surface-variant"
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
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer focus-ring rounded-md ${
                      theme === "light" ? "text-primary font-bold" : "text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">light_mode</span>
                    Light
                  </button>
                </div>
              </>
            )}
          </div>

          <MotionLink
            href="/contact"
            className="hidden sm:block gradient-bg-primary text-background font-label-md text-xs sm:text-sm px-5 lg:px-6 py-2.5 rounded-full hover:shadow-[0_0_15px_rgba(78,222,163,0.4)] transition-all duration-300 focus-ring font-bold shrink-0"
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Get Started
          </MotionLink>

          {/* Mobile & Tablet Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-on-surface p-2 hover:bg-surface-container-high/50 rounded-full transition-colors cursor-pointer focus-ring min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[56px] sm:top-[64px] bg-black/70 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-full left-0 w-full glass-panel shadow-2xl py-6 px-6 z-50 flex flex-col gap-3 animate-slide-down lg:hidden max-h-[calc(100dvh-64px)] overflow-y-auto border-b border-primary/20">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-body-md py-3 px-3 rounded-lg transition-all focus-ring min-h-[44px] flex items-center ${
                    isActive
                      ? "text-primary font-bold bg-primary/10 border-l-4 border-primary pl-4"
                      : "text-on-surface-variant hover:text-primary hover:bg-white/[0.02]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <MotionLink
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center gradient-bg-primary text-background font-label-md text-sm py-3.5 rounded-xl mt-3 font-bold shadow-lg focus-ring min-h-[44px] flex items-center justify-center"
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Get Started
            </MotionLink>
          </div>
        </>
      )}
    </nav>
  );
}

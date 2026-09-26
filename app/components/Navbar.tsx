"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";
import Image from "next/image";
import logoImg from "@/public/logo1.jpeg";

const MotionLink = motion.create(Link);

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver to detect active section on home page
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["home", "about", "services", "payment", "contact", "disclosure"];
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "#home", id: "home" },
    { name: "About Us", href: "#about", id: "about" },
    { name: "Services", href: "#services", id: "services" },
    { name: "Payment", href: "#payment", id: "payment" },
    { name: "Contact Us", href: "#contact", id: "contact" },
    { name: "Disclosure", href: "#disclosure", id: "disclosure" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
        setActiveSection(id);
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-surface-glass/95 backdrop-blur-2xl shadow-md border-b border-primary/20"
          : "bg-surface-glass backdrop-blur-2xl shadow-sm border-b border-transparent"
      } before:absolute before:bottom-0 before:left-1/4 before:right-1/4 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:content-['']`}
    >
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-[76px] sm:h-[84px] max-w-container-max mx-auto w-full">
        {/* Brand */}
        <Link
          href="/#home"
          onClick={(e) => handleLinkClick(e, "#home", "home")}
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

        {/* Desktop Links (Visible on Large Screens) */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === "/" ? activeSection === link.id : false;
            const fullHref = pathname === "/" ? link.href : `/${link.href}`;

            return (
              <a
                key={link.id}
                href={fullHref}
                onClick={(e) => handleLinkClick(e, link.href, link.id)}
                className={`transition-all duration-200 text-sm xl:text-[0.9rem] focus-ring rounded-lg py-2 px-3 xl:px-4 cursor-pointer ${
                  isActive
                    ? "text-primary font-semibold bg-primary/10 shadow-[inset_0_1px_2px_rgba(50,205,148,0.2)]"
                    : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        {/* Actions (Theme toggle & Get Started) */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
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

          <a
            href={pathname === "/" ? "#contact" : "/#contact"}
            onClick={(e) => handleLinkClick(e, "#contact", "contact")}
            className="hidden sm:inline-flex items-center justify-center gradient-bg-primary text-background font-label-md text-xs sm:text-sm px-5 lg:px-6 py-2.5 rounded-full hover:shadow-[0_0_15px_rgba(78,222,163,0.4)] transition-all duration-300 focus-ring font-bold shrink-0 cursor-pointer"
          >
            Get Started
          </a>

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
            className="fixed inset-0 top-16 sm:top-[72px] bg-black/70 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-full left-0 w-full glass-panel shadow-2xl py-6 px-6 z-50 flex flex-col gap-3 animate-slide-down lg:hidden max-h-[calc(100dvh-72px)] overflow-y-auto border-b border-primary/20">
            {navLinks.map((link) => {
              const isActive = pathname === "/" ? activeSection === link.id : false;
              const fullHref = pathname === "/" ? link.href : `/${link.href}`;

              return (
                <a
                  key={link.id}
                  href={fullHref}
                  onClick={(e) => handleLinkClick(e, link.href, link.id)}
                  className={`text-base font-body-md py-3 px-3 rounded-lg transition-all focus-ring min-h-[44px] flex items-center cursor-pointer ${
                    isActive
                      ? "text-primary font-bold bg-primary/10 border-l-4 border-primary pl-4"
                      : "text-on-surface-variant hover:text-primary hover:bg-white/[0.02]"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <a
              href={pathname === "/" ? "#contact" : "/#contact"}
              onClick={(e) => handleLinkClick(e, "#contact", "contact")}
              className="w-full text-center gradient-bg-primary text-background font-label-md text-sm py-3.5 rounded-xl mt-3 font-bold shadow-lg focus-ring min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              Get Started
            </a>
          </div>
        </>
      )}
    </nav>
  );
}

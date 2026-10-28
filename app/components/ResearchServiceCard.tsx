'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResearchService } from '../services/researchServicesData';

interface ResearchServiceCardProps {
  service: ResearchService;
  index: number;
}

export default function ResearchServiceCard({ service, index }: ResearchServiceCardProps) {
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'quarterly'>('monthly');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentPlan = service.plans[selectedDuration];

  // WhatsApp redirection link
  const whatsappMessage = `Hi, I want to get started with Money Vriksh Research Service: ${service.title} (${currentPlan.label}). Please share onboarding and payment details.`;
  const whatsappUrl = `https://wa.me/919827562967?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className={`h-full ${isDropdownOpen ? 'z-40 relative' : 'z-10 relative'}`}
    >
      <div
        style={{
          boxShadow:
            'inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4), 0 20px 50px rgba(0, 0, 0, 0.6)',
        }}
        className="bg-[#171717] rounded-2xl border-t border-white/20 border-x border-white/[0.03] border-b border-white/10 hover:border-primary/40 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between h-full group relative"
      >
        {/* TOP BLOCK: Fixed minimum height across all cards guarantees identical button baseline */}
        <div className="min-h-[275px] md:min-h-[290px] lg:min-h-[300px] flex flex-col justify-start">
          {/* Badge */}
          <div className="mb-3.5 h-6 flex items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/25">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {service.badge}
            </span>
          </div>

          {/* Title */}
          <div className="min-h-[36px] flex items-center mb-1.5">
            <h3 className="text-2xl sm:text-[26px] font-bold text-on-surface font-sans tracking-tight leading-tight">
              {service.title}
            </h3>
          </div>

          {/* Subtitle */}
          <div className="min-h-[52px] flex items-start mb-2.5">
            <p className="text-xs font-semibold leading-relaxed text-primary/90">
              {service.subtitle}
            </p>
          </div>

          {/* Description */}
          <div className="flex-1 flex items-start mb-4">
            <p className="text-xs text-on-surface-variant/75 leading-relaxed font-normal">
              {service.description}
            </p>
          </div>
        </div>

        {/* MIDDLE BLOCK: DURATION, Pricing & Get Started Button (strictly aligned across all cards) */}
        <div>
          {/* Duration Section */}
          <div className="mb-4">
            <label className="text-[10px] font-bold tracking-widest text-slate-text uppercase mb-2 block font-semibold">
              DURATION
            </label>

            {/* Custom Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="w-full h-[44px] bg-[#070707] border border-white/10 hover:border-primary/40 focus:border-primary text-on-surface rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center justify-between cursor-pointer transition-all shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-1 focus:ring-primary/30"
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
              >
                <span className="font-medium text-on-surface">{currentPlan.label}</span>
                <span
                  className={`material-symbols-outlined text-lg text-primary transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {/* Dropdown Options List */}
              {isDropdownOpen && (
                <div
                  className="absolute left-0 right-0 top-full mt-1.5 bg-[#0e0e0e] border border-white/15 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden z-50 py-1.5 backdrop-blur-md"
                  role="listbox"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDuration('monthly');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                      selectedDuration === 'monthly'
                        ? 'bg-primary/15 text-primary font-bold border-l-2 border-primary'
                        : 'text-on-surface-variant hover:text-white hover:bg-white/5 font-medium'
                    }`}
                    role="option"
                    aria-selected={selectedDuration === 'monthly'}
                  >
                    <span>{service.plans.monthly.label}</span>
                    {selectedDuration === 'monthly' && (
                      <span className="material-symbols-outlined text-sm text-primary">check</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDuration('quarterly');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                      selectedDuration === 'quarterly'
                        ? 'bg-primary/15 text-primary font-bold border-l-2 border-primary'
                        : 'text-on-surface-variant hover:text-white hover:bg-white/5 font-medium'
                    }`}
                    role="option"
                    aria-selected={selectedDuration === 'quarterly'}
                  >
                    <span>{service.plans.quarterly.label}</span>
                    {selectedDuration === 'quarterly' && (
                      <span className="material-symbols-outlined text-sm text-primary">check</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Price Display */}
          <div className="mt-5 mb-5">
            <div className="h-10 flex items-baseline">
              <span className="text-3xl sm:text-4xl font-extrabold font-sans tracking-tight text-white">
                {currentPlan.priceFormatted}
              </span>
            </div>
            <p className="text-xs text-slate-text font-medium mt-1 flex items-center gap-1.5 h-5">
              <span className="material-symbols-outlined text-xs text-primary">schedule</span>
              <span>{currentPlan.validity}</span>
            </p>
          </div>

          {/* Action Button: Get Started (All cards use identical emerald green gradient-bg-primary button) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-[48px] py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer group shadow-lg gradient-bg-primary text-background hover:shadow-[0_0_25px_rgba(50,205,148,0.4)] hover:scale-[1.01] active:scale-[0.98]"
          >
            <span>Get Started</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-200">
              arrow_forward
            </span>
          </a>

          {/* Security badge below button */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-text font-medium mt-3 mb-6 h-5">
            <span
              className="material-symbols-outlined text-sm text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span>Secure UPI QR Payment</span>
          </div>
        </div>

        {/* BOTTOM BLOCK: Features Checklist */}
        <div className="pt-4 border-t border-white/10 flex items-start gap-2.5 text-xs text-on-surface-variant/75 leading-relaxed min-h-[85px]">
          <span className="font-bold text-sm shrink-0 select-none text-primary">
            ✓
          </span>
          <p className="flex-1">{service.features}</p>
        </div>

        {/* Subtle accent line on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary to-success-emerald" />
      </div>
    </motion.div>
  );
}

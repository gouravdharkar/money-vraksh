"use client";

import Link from "next/link";
import { AboutSection } from "./components/AboutSection";
import NiftyLiveCard from "./components/NiftyLiveCard";
import { motion } from "framer-motion";
import { serviceCategories } from "./services/data";
import { ACCENT_THEMES } from "./services/types";

const MotionLink = motion.create(Link);

export default function Home() {
  return (
    <div className="relative w-full pt-[80px] md:pt-[100px]">
      {/* Ambient Light Leaks */}
      <div className="light-leak-primary top-[-100px] left-[-200px]" />
      <div className="light-leak-secondary top-[20%] right-[-100px]" />
      <div className="light-leak-primary bottom-[10%] left-[-100px] opacity-50" />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative px-margin-mobile md:px-margin-desktop py-6 sm:py-10 max-w-container-max mx-auto"
      >
        {/* Main Hero Card Container with generous internal padding */}
        <div className="relative rounded-3xl overflow-hidden border border-elegant p-6 sm:p-10 md:p-12 lg:p-16 glass-panel shadow-2xl">
          {/* Background Image Panel */}
          <div
            className="absolute inset-0 z-[-1] opacity-20 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDlNQ_mxpVKHmffOod9PpCUjb9exANO8Me3LV4sXhu9ySxB_ax2F5Bw63oPRX1Q69fbT7CypbVES437vPA7SFyxSxI1HIluMwqGiEPfd2IVBXaB6J-XK2G2iKf8mcG0vUYoeqXwNkuGkmxFFlHVGZmtit8sNJZTMN4msXkSJbtMUqb5xIdlVvW_3MZIamkF6w75bWuV4Mx-EcSEKwYvzcf5FcHtXZX_kVpr_jBRBjBHj6SmqJ8SLuiBCe7dR8b-lsVQwp1AIZ94boNf')",
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-surface-container-high/60 border border-premium-gold/30 rounded-full px-4 sm:px-5 py-1.5 w-fit mb-5 sm:mb-6 glass-panel mx-auto sm:mx-0 shadow-sm">
                <span className="material-symbols-outlined text-premium-gold text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="font-label-md text-premium-gold uppercase tracking-widest text-[10px] sm:text-xs font-bold">
                  SEBI NO - INH000025300
                </span>
              </div>
              
              <h1 className="font-display-lg text-3xl sm:text-5xl lg:text-6xl font-normal text-on-surface mb-4 sm:mb-6 leading-tight font-headline tracking-tight">
                Your Financial Future <br className="hidden sm:block" />
                <span className="gradient-text-primary italic font-normal">Starts Now</span>
              </h1>
              
              <p className="font-body-lg text-sm sm:text-base lg:text-lg text-slate-text mb-8 sm:mb-10 max-w-2xl mx-auto sm:mx-0 leading-relaxed">
                Professional Stock Market Research, Trading Insights, and Investment Strategies Designed For Consistent Growth in a complex financial landscape.
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 max-w-md sm:max-w-none mx-auto sm:mx-0">
                <MotionLink
                  href="/contact"
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="gradient-bg-primary text-background font-label-md text-sm sm:text-base px-7 py-3.5 sm:py-4 rounded-full hover:shadow-[0_0_20px_rgba(78,222,163,0.5)] transition-all-slow flex items-center justify-center gap-2 font-bold focus-ring cursor-pointer"
                >
                  Talk To Our Experts
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </MotionLink>
                <MotionLink
                  href="/services"
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="bg-transparent border border-premium-gold text-premium-gold font-label-md text-sm sm:text-base px-7 py-3.5 sm:py-4 rounded-full hover:bg-premium-gold/10 transition-all-slow flex items-center justify-center gap-2 font-bold focus-ring cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    explore
                  </span>
                  Explore Services
                </MotionLink>
              </div>
            </div>

            {/* Hero Right Graphic Card (Live Nifty Card across all viewports) */}
            <div className="lg:col-span-5 xl:col-span-4 w-full flex items-center justify-center relative mt-4 lg:mt-0">
              <NiftyLiveCard />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <AboutSection />
      </motion.div>

      {/* Services Section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="px-margin-mobile md:px-margin-desktop py-20 max-w-container-max mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-3xl md:text-5xl font-normal text-on-surface mb-4 font-headline tracking-tight">
            <span className="italic gradient-text-primary">Premium</span> Research Services
          </h2>
          <p className="font-body-lg text-body-lg text-slate-text max-w-2xl mx-auto">
            Tailored strategies for every market condition, designed to maximize your portfolio&apos;s potential.
          </p>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
        >
          {serviceCategories.slice(0, 3).map((category, idx) => {
            const theme = ACCENT_THEMES[category.accentColor] || ACCENT_THEMES.emerald;
            const cardShadow = "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4)";

            return (
              <motion.div
                key={category.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                }}
                whileHover={{
                  y: -3
                }}
                style={{
                  boxShadow: cardShadow
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 18
                }}
                className="bg-[#171717] rounded-2xl p-8 flex flex-col group border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 relative overflow-visible"
              >
                {idx === 1 && (
                  <div className="absolute top-0 right-0 bg-premium-gold text-background-midnight font-data-mono text-[10px] px-4 py-1.5 rounded-bl-xl font-bold tracking-wider uppercase z-20">
                    POPULAR
                  </div>
                )}
                <div className="w-14 h-14 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <span className={`material-symbols-outlined ${theme.text} text-3xl`}>
                    {category.icon}
                  </span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3 font-headline">
                  {category.name}
                </h3>
                <p className="font-body-md text-body-md text-slate-text mb-8 flex-grow">
                  {category.description}
                </p>
                <Link
                  href={`/services/${category.id}`}
                  className={`font-label-md text-label-md ${theme.text} flex items-center gap-2 w-fit hover:opacity-80 transition-colors font-bold focus-ring rounded-sm`}
                >
                  Read More
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_right_alt
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Process Section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative px-margin-mobile md:px-margin-desktop py-14 sm:py-20 max-w-container-max mx-auto before:absolute before:top-0 before:left-1/4 before:right-1/4 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:content-['']"
      >
        <div className="text-center mb-12 sm:mb-16">
          <span className="font-label-md text-xs sm:text-sm text-primary tracking-widest uppercase mb-2 block font-semibold">
            Our Process
          </span>
          <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-5xl font-normal text-on-surface font-headline tracking-tight">
            Get Our Service In <span className="italic gradient-text-primary">4 Steps</span>
          </h2>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {/* Step 1 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
            }}
            whileHover={{
              y: -3
            }}
            style={{
              boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4)"
            }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="bg-[#171717] p-6 sm:p-8 rounded-2xl relative overflow-visible group border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col"
          >
            <div className="absolute top-0 right-0 bg-[#070707] text-premium-gold border-b border-l border-white/10 font-data-mono text-xs sm:text-sm px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-bl-xl font-bold shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)]">
              01
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
              <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary">
                contact_support
              </span>
            </div>
            <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mb-2 font-headline">
              Contact Us
            </h3>
            <p className="font-body-md text-sm sm:text-base text-slate-text">
              Reach out to our advisory desk for personalized market orientation.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
            }}
            whileHover={{
              y: -3
            }}
            style={{
              boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4)"
            }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="bg-[#171717] p-6 sm:p-8 rounded-2xl relative overflow-visible group border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col"
          >
            <div className="absolute top-0 right-0 bg-[#070707] text-premium-gold border-b border-l border-white/10 font-data-mono text-xs sm:text-sm px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-bl-xl font-bold shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)]">
              02
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
              <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary">
                strategy
              </span>
            </div>
            <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mb-2 font-headline">
              Investment Strategy
            </h3>
            <p className="font-body-md text-sm sm:text-base text-slate-text">
              Select the strategy plan tailored to your capital and risk tolerance.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
            }}
            whileHover={{
              y: -3
            }}
            style={{
              boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4)"
            }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="bg-[#171717] p-6 sm:p-8 rounded-2xl relative overflow-visible group border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col"
          >
            <div className="absolute top-0 right-0 bg-[#070707] text-premium-gold border-b border-l border-white/10 font-data-mono text-xs sm:text-sm px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-bl-xl font-bold shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)]">
              03
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
              <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary">
                model_training
              </span>
            </div>
            <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mb-2 font-headline">
              Follow Our Guidance
            </h3>
            <p className="font-body-md text-sm sm:text-base text-slate-text">
              Receive instant real-time market recommendations and entry/exit levels.
            </p>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
            }}
            whileHover={{
              y: -3
            }}
            style={{
              boxShadow: "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 0 0 rgba(0, 0, 0, 0.4)"
            }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="bg-[#171717] p-6 sm:p-8 rounded-2xl relative overflow-visible group border-t border-white/20 border-x border-white/[0.02] border-b border-white/10 flex flex-col"
          >
            <div className="absolute top-0 right-0 bg-[#070707] text-premium-gold border-b border-l border-white/10 font-data-mono text-xs sm:text-sm px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-bl-xl font-bold shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)]">
              04
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#070707] border border-white/5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
              <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary">
                insights
              </span>
            </div>
            <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mb-2 font-headline">
              Grow Your Capital
            </h3>
            <p className="font-body-md text-sm sm:text-base text-slate-text">
              Execute disciplined trades to accomplish your long-term financial milestones.
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Advantages Section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative px-margin-mobile md:px-margin-desktop py-14 sm:py-20 bg-surface-container-low before:absolute before:top-0 before:left-1/4 before:right-1/4 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:content-[''] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-primary/20 after:to-transparent after:content-['']"
      >
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            <span className="font-label-md text-xs sm:text-sm text-primary tracking-widest uppercase mb-2 block font-semibold">
              Why Choose Us
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-5xl font-normal text-on-surface mb-5 font-headline tracking-tight">
              Our <span className="italic gradient-text-primary">Advantages</span>
            </h2>
            <p className="font-body-md text-sm sm:text-base text-slate-text mb-8 leading-relaxed">
              We help our clients adhere to strict money management and risk protocols. Our analysts utilize disciplined trend-following strategies to capture high-probability market opportunities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-xl">timer</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-sm sm:text-base font-semibold text-on-surface font-headline">
                    10+ Years Experience
                  </h4>
                  <p className="text-xs text-slate-text mt-0.5">Proven market resilience</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-xl">workspace_premium</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-sm sm:text-base font-semibold text-on-surface font-headline">
                    SEBI Reg. Research
                  </h4>
                  <p className="text-xs text-slate-text mt-0.5">INH000025300 compliance</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-xl">trending_up</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-sm sm:text-base font-semibold text-on-surface font-headline">
                    Data-Driven Edge
                  </h4>
                  <p className="text-xs text-slate-text mt-0.5">Quantitative technical setups</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-xl">support_agent</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-sm sm:text-base font-semibold text-on-surface font-headline">
                    Dedicated Support
                  </h4>
                  <p className="text-xs text-slate-text mt-0.5">Continuous analyst assistance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden glass-panel aspect-[16/10] sm:aspect-video relative flex items-center justify-center bg-surface-container-high/50 border border-elegant shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-500 hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCWCfTlGgKbr_F1Yl1FWRdrUNiY21JEQSc_56PJHZbQ9g8Vw0AVwcNdERCMtTFjvra5A-lThM_l8coG1Nc5BKAW8uOguBgvIlAD9BYNoQK-JjP4JnlN1qLENAffLNkwhnWVmbkaiw4ZR66aWzqlmpddT1FiK7jlvMpz8xpclI_5LP9y4JrKKWgnobUjc0Zq2eTpHFnE5jkqdtlAT6cwCGGaSiq7S3QLAaMtH1EWE0DmOlcFk_0tVWqP6JXRmMLicman_1kBLzLGXK5K')",
              }}
            />
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="px-margin-mobile md:px-margin-desktop py-14 sm:py-20 max-w-container-max mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-2">
            <span className="font-label-md text-xs sm:text-sm text-primary tracking-widest uppercase mb-2 block font-semibold">
              Our Mission
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl font-normal text-on-surface mb-4 leading-tight font-headline tracking-tight">
              We Come To <span className="italic gradient-text-primary">Protect &amp; Grow</span> Your Investment
            </h2>
            <p className="font-body-md text-sm sm:text-base text-slate-text leading-relaxed">
              Our research team is committed to providing premium institutional market intelligence. Every recommendation is supported by rigorous technical and risk-reward modeling, ensuring superior execution for retail and HNI investors.
            </p>
          </div>
          <div className="lg:col-span-1 glass-panel p-6 sm:p-7 rounded-2xl flex flex-col justify-center border border-elegant bg-gradient-to-br from-primary/10 to-transparent shadow-xl">
            <span className="material-symbols-outlined text-primary text-4xl sm:text-5xl mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <h4 className="font-headline-md text-lg font-bold text-on-surface mb-2 font-headline">
              SEBI Compliant Advisory
            </h4>
            <p className="text-xs sm:text-sm text-slate-text leading-relaxed">
              Strict compliance frameworks and ethical research protocols protecting investor capital.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

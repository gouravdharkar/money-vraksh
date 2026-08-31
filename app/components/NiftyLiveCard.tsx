"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { NiftyResponse } from "../api/nifty/route";

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export default function NiftyLiveCard() {
  const [data, setData] = useState<NiftyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      try {
        const res = await fetch("/api/nifty", { cache: "no-store" });
        if (res.ok && isMounted) {
          const json: NiftyResponse = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Error fetching live Nifty data:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadInitial();
    const interval = setInterval(loadInitial, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const isPositive = data ? data.isPositive : true;
  const strokeColor = isPositive ? "#4edea3" : "#f87171";
  const stopColorTop = isPositive ? "rgba(78, 222, 163, 0.28)" : "rgba(248, 113, 113, 0.25)";
  const lastPoint = data?.lastPoint || { x: 100, y: 16 };

  return (
    <div className="w-full glass-panel rounded-2xl relative overflow-hidden flex flex-col justify-between p-6 bg-gradient-to-br from-surface-container-high/40 via-surface-container-low/20 to-background-midnight border border-elegant shadow-2xl transition-all duration-300">
      {/* Header: Title & Status */}
      <div>
        <div className="flex justify-between items-center w-full mb-3">
          <div className="flex items-center gap-2">
            <span className="font-label-md text-xs text-slate-text uppercase tracking-widest font-semibold">
              NIFTY 50
            </span>
            <span className="text-[10px] text-slate-text/40 font-data-mono px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.04]">
              NSE
            </span>
          </div>

          {/* Minimal Status Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-data-mono text-slate-text/70">
            <span
              className={`w-2 h-2 rounded-full ${
                data?.marketState === "OPEN"
                  ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  : "bg-premium-gold/80"
              }`}
            />
            <span className="tracking-wide">
              {data?.marketState === "OPEN" ? "LIVE" : "CLOSED"}
            </span>
          </div>
        </div>

        {/* Price & Minimal Inline Change */}
        <div className="flex flex-wrap items-baseline gap-3">
          <AnimatePresence mode="wait">
            {loading && !data ? (
              <div className="h-9 w-40 bg-surface-container-high/60 animate-pulse rounded-md" />
            ) : (
              <motion.span
                key={data?.price}
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-data-mono text-data-mono text-on-surface text-3xl md:text-4xl font-bold tracking-tight"
              >
                {data ? formatCurrency(data.price) : "24,080.40"}
              </motion.span>
            )}
          </AnimatePresence>

          {data && (
            <span
              className={`font-data-mono text-sm font-semibold flex items-center gap-1 ${
                isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              <span>{isPositive ? "▲" : "▼"}</span>
              <span>{Math.abs(data.changePercent)}%</span>
              <span className="text-xs opacity-75 font-normal">
                ({isPositive ? "+" : ""}{data.change})
              </span>
            </span>
          )}
        </div>

        {/* Minimal Day Range Bar */}
        {data && (
          <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-data-mono text-slate-text/60">
            <span>L: {formatCurrency(data.dayLow)}</span>
            <div className="flex-1 mx-3 h-[3px] bg-white/[0.06] rounded-full overflow-hidden relative">
              <div
                className={`h-full ${
                  isPositive ? "bg-emerald-400" : "bg-rose-400"
                } rounded-full transition-all duration-500`}
                style={{
                  width: `${Math.max(
                    12,
                    Math.min(
                      88,
                      ((data.price - data.dayLow) / (data.dayHigh - data.dayLow || 1)) * 100
                    )
                  )}%`,
                }}
              />
            </div>
            <span>H: {formatCurrency(data.dayHigh)}</span>
          </div>
        )}
      </div>

      {/* Smooth Elegant SVG Sparkline Chart */}
      <div className="w-full h-36 mt-4 relative flex items-center justify-center">
        <svg
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 50"
        >
          <defs>
            <linearGradient id="minimal-nifty-grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={stopColorTop} />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
            </linearGradient>
            <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="1.5"
                floodColor={strokeColor}
                floodOpacity="0.45"
              />
            </filter>
          </defs>

          {/* Area Fill */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            d={data?.fillPath || "M 0 32 C 25 28, 50 34, 75 22, 100 16 L 100 50 L 0 50 Z"}
            fill="url(#minimal-nifty-grad)"
          />

          {/* Main Curve Line with Glow */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            d={data?.linePath || "M 0 32 C 25 28, 50 34, 75 22, 100 16"}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow-effect)"
            vectorEffect="non-scaling-stroke"
          />

          {/* Pulsating End Point Dot for Current Price */}
          {data && (
            <g transform={`translate(${lastPoint.x}, ${lastPoint.y})`}>
              <circle
                r="4.5"
                fill={strokeColor}
                opacity="0.3"
                className="animate-ping"
              />
              <circle
                r="2.5"
                fill="#ffffff"
                stroke={strokeColor}
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

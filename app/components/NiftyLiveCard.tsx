"use client";

import { useEffect, useState } from "react";
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
        console.error("Error fetching Nifty data:", err);
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

  return (
    <div className="w-full max-w-sm glass-panel rounded-2xl p-6 border border-white/10 bg-surface-container-low/70 shadow-xl flex flex-col justify-center">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-text">
          NIFTY 50
        </span>
        <span className="text-[11px] font-mono text-slate-text/70 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
          NSE
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-4">
        {loading && !data ? (
          <div className="h-9 w-36 bg-white/5 animate-pulse rounded" />
        ) : (
          <div className="font-mono text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            {data ? formatCurrency(data.price) : "24,080.40"}
          </div>
        )}

        {data && (
          <div
            className={`font-mono text-sm font-semibold flex items-center gap-1 ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            <span>{isPositive ? "+" : ""}{data.change.toFixed(2)}</span>
            <span>({isPositive ? "+" : ""}{data.changePercent.toFixed(2)}%)</span>
          </div>
        )}
      </div>
    </div>
  );
}

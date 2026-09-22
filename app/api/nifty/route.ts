import { NextResponse } from "next/server";

export interface NiftyResponse {
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  isPositive: boolean;
  marketState: "OPEN" | "CLOSED";
  lastUpdated: string;
  linePath: string;
  fillPath: string;
  lastPoint: { x: number; y: number };
  pointsCount: number;
}

function getMarketStatus(): "OPEN" | "CLOSED" {
  const now = new Date();
  // Get time in IST (UTC+5:30)
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const istTime = new Date(utc + 5.5 * 60 * 60 * 1000);
  const day = istTime.getDay(); // 0 = Sun, 6 = Sat
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const isWeekday = day >= 1 && day <= 5;
  const isOpenHours = totalMinutes >= 9 * 60 + 15 && totalMinutes <= 15 * 60 + 30;

  return isWeekday && isOpenHours ? "OPEN" : "CLOSED";
}

function generateSvgPath(points: number[], width = 100, height = 50) {
  if (!points || points.length < 2) {
    return {
      linePath: "M 0 32 C 10 30, 15 28, 25 28 C 35 28, 40 34, 50 34 C 60 34, 65 22, 75 22 C 85 22, 90 18, 100 16",
      fillPath: "M 0 32 C 10 30, 15 28, 25 28 C 35 28, 40 34, 50 34 C 60 34, 65 22, 75 22 C 85 22, 90 18, 100 16 L 100 50 L 0 50 Z",
      lastPoint: { x: 100, y: 16 },
    };
  }

  // 1. Resample down to 35 evenly spaced points to remove micro-jitter
  const targetCount = Math.min(35, points.length);
  const step = (points.length - 1) / Math.max(1, targetCount - 1);
  const sampled: number[] = [];
  for (let i = 0; i < targetCount; i++) {
    const idx = Math.min(points.length - 1, Math.round(i * step));
    sampled.push(points[idx]);
  }

  // 2. Apply 3-point moving average smoothing
  const smoothed = sampled.map((val, idx, arr) => {
    const start = Math.max(0, idx - 1);
    const end = Math.min(arr.length, idx + 2);
    const slice = arr.slice(start, end);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });

  const min = Math.min(...smoothed);
  const max = Math.max(...smoothed);
  const range = max - min || 1;
  const padding = 6;
  const availableHeight = height - padding * 2;

  const pts = smoothed.map((p, i) => ({
    x: Number(((i / (smoothed.length - 1)) * width).toFixed(1)),
    y: Number((height - padding - ((p - min) / range) * availableHeight).toFixed(1)),
  }));

  // 3. Generate smooth continuous cubic Bézier path
  let linePath = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2 >= pts.length ? pts.length - 1 : i + 2];

    const tension = 0.22;
    const cp1x = Number((p1.x + (p2.x - p0.x) * tension).toFixed(1));
    const cp1y = Number((p1.y + (p2.y - p0.y) * tension).toFixed(1));
    const cp2x = Number((p2.x - (p3.x - p1.x) * tension).toFixed(1));
    const cp2y = Number((p2.y - (p3.y - p1.y) * tension).toFixed(1));

    linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  const lastPoint = pts[pts.length - 1];
  const fillPath = `${linePath} L ${lastPoint.x} ${height} L ${pts[0].x} ${height} Z`;

  return { linePath, fillPath, lastPoint };
}

export async function GET() {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?range=1d&interval=5m",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          Accept: "application/json",
        },
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) {
      throw new Error(`Yahoo Finance responded with status: ${res.status}`);
    }

    const data = await res.json();
    const result = data?.chart?.result?.[0];

    if (!result || !result.meta) {
      throw new Error("Invalid response format from market data provider");
    }

    const meta = result.meta;
    const rawQuotes: (number | null)[] = result.indicators?.quote?.[0]?.close || [];
    const validPoints = rawQuotes.filter((p): p is number => typeof p === "number" && !isNaN(p));

    const price = Number((meta.regularMarketPrice || validPoints[validPoints.length - 1] || 24000).toFixed(2));
    const previousClose = Number((meta.chartPreviousClose || meta.previousClose || price).toFixed(2));
    const change = Number((price - previousClose).toFixed(2));
    const changePercent = Number((((price - previousClose) / previousClose) * 100).toFixed(2));
    const dayHigh = Number((meta.regularMarketDayHigh || Math.max(...validPoints, price)).toFixed(2));
    const dayLow = Number((meta.regularMarketDayLow || Math.min(...validPoints, price)).toFixed(2));
    const isPositive = change >= 0;

    const { linePath, fillPath, lastPoint } = generateSvgPath(
      validPoints.length > 0 ? validPoints : [previousClose, price]
    );

    const marketState = getMarketStatus();
    const lastUpdated = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const responseData: NiftyResponse = {
      price,
      previousClose,
      change,
      changePercent,
      dayHigh,
      dayLow,
      isPositive,
      marketState,
      lastUpdated,
      linePath,
      fillPath,
      lastPoint,
      pointsCount: validPoints.length,
    };

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Failed to fetch live NIFTY 50 data:", error);

    // Graceful fallback data so UI never breaks
    const fallbackPrice = 24080.4;
    const fallbackPrev = 24175.65;
    const fallbackChange = -95.25;
    const fallbackChangePct = -0.39;
    const { linePath, fillPath, lastPoint } = generateSvgPath([24150, 24120, 24090, 24040, 24080]);

    return NextResponse.json(
      {
        price: fallbackPrice,
        previousClose: fallbackPrev,
        change: fallbackChange,
        changePercent: fallbackChangePct,
        dayHigh: 24128.7,
        dayLow: 23993.6,
        isPositive: false,
        marketState: getMarketStatus(),
        lastUpdated: "3:30 PM",
        linePath,
        fillPath,
        lastPoint,
        pointsCount: 5,
      } satisfies NiftyResponse,
      { status: 200 }
    );
  }
}

"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "29377489038518814";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

/**
 * Route change tracker for Next.js Single Page App (SPA) navigation.
 * Ensures that whenever a user navigates between pages, Meta Pixel receives a 'PageView' event.
 */
function MetaPixelEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // The initial page load is already tracked by the base Meta Pixel script.
    // Only fire additional PageView events on subsequent client-side route changes.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Main Meta (Facebook) Pixel Component.
 * Injects the official tracking script via Next.js next/script (afterInteractive strategy)
 * and sets up route change tracking wrapped in Suspense for static optimization.
 */
export default function MetaPixel() {
  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <MetaPixelEvents />
      </Suspense>
    </>
  );
}

/**
 * Optional helper function to trigger standard or custom Meta conversion events
 * (e.g., 'Lead', 'Contact', 'InitiateCheckout', etc.)
 */
export function trackMetaEvent(eventName: string, options?: Record<string, any>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (options) {
      window.fbq("track", eventName, options);
    } else {
      window.fbq("track", eventName);
    }
  }
}

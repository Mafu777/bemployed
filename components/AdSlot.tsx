"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSlot({ slotId }: { slotId: string }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!adsenseId || !adRef.current) return;

    const ad = adRef.current;

    // Prevent AdSense from processing the same ad slot more than once
    if (ad.getAttribute("data-adsbygoogle-status")) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense may not be ready yet
    }
  }, [adsenseId]);

  if (!adsenseId) {
    return (
      <div className="border border-dashed rounded-xl p-4 text-center text-xs text-gray-400">
        Advertisement placeholder &middot; set NEXT_PUBLIC_ADSENSE_CLIENT_ID to go live
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className="adsbygoogle block"
      style={{ display: "block" }}
      data-ad-client={adsenseId}
      data-ad-slot={slotId}
      data-ad-format="fluid"
      data-ad-layout-key="-fb+5w+4e-db+86"
    />
  );
}
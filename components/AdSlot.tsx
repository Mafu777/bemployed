"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSlot({ slotId }: { slotId: string }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!adsenseId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not loaded yet, safe to ignore
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
      className="adsbygoogle block"
      style={{ display: "block" }}
      data-ad-client={adsenseId}
      data-ad-slot={slotId}
      data-ad-format="fluid"
      data-ad-layout-key="-fb+5w+4e-db+86"
    />
  );
}

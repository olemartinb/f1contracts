import { useEffect, useRef } from 'react';
import { adsense, type AdPlacement } from '../config';
import { t } from '../i18n';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** A responsive AdSense display unit with reserved space, so the page does not jump when it loads. */
export function AdSlot({ placement }: { placement: AdPlacement }) {
  const slot = adsense.slots[placement];
  const pushed = useRef(false);

  useEffect(() => {
    if (!adsense.client || !slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Blocked by an ad blocker or not yet allowed by the consent message; the space stays empty.
    }
  }, [slot]);

  if (!adsense.client || !slot) return null;

  return (
    <aside aria-label={t().advertisement} className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="mb-2 text-center font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{t().advertisement}</p>
      <div className="min-h-[280px] sm:min-h-[250px]">
        <ins
          className="adsbygoogle block"
          data-ad-client={adsense.client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}

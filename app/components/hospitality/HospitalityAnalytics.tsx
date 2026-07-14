'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackHospitalityEvent(
  event: string,
  properties: Record<string, unknown> = {}
) {
  if (typeof window === 'undefined') return;

  const payload = {
    event,
    market: 'us',
    industry: 'hospitality',
    ...properties,
  };

  window.dataLayer?.push(payload);
  window.dispatchEvent(new CustomEvent('whagons:analytics', { detail: payload }));
}

export default function HospitalityAnalytics({ page }: { page: string }) {
  useEffect(() => {
    trackHospitalityEvent('hospitality_page_view', { page });

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trackedElement = target?.closest<HTMLElement>('[data-track]');
      if (!trackedElement) return;

      trackHospitalityEvent(trackedElement.dataset.track || 'hospitality_click', {
        page,
        label: trackedElement.textContent?.trim().slice(0, 120) || '',
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [page]);

  return null;
}

'use client';

import { useEffect } from 'react';

export default function SiteAtmosphere() {
  useEffect(() => {
    const sync = () => {
      document.documentElement.dataset.ambientMotion = document.visibilityState === 'visible' ? 'on' : 'off';
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => { document.removeEventListener('visibilitychange', sync); delete document.documentElement.dataset.ambientMotion; };
  }, []);
  return <div className="site-atmosphere" aria-hidden="true"><span /><span /></div>;
}

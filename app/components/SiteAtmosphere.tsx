'use client';

import { useEffect, useState } from 'react';
import type { Language } from '../lib/locales';

export default function SiteAtmosphere({ lang }: { lang: Language }) {
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { setEnabled(localStorage.getItem('whagons-ambient-motion') !== 'off'); } catch { /* Storage is optional. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    const sync = () => {
      document.documentElement.dataset.ambientMotion = ready && enabled && document.visibilityState === 'visible' ? 'on' : 'off';
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => { document.removeEventListener('visibilitychange', sync); delete document.documentElement.dataset.ambientMotion; };
  }, [enabled, ready]);
  function toggle() {
    setEnabled(value => !value);
    try { localStorage.setItem('whagons-ambient-motion', enabled ? 'off' : 'on'); } catch { /* Keep the current-page preference. */ }
  }
  return <>
    <div className="site-atmosphere" aria-hidden="true"><span /><span /></div>
    <button className="ambient-control" type="button" onClick={toggle} aria-pressed={enabled}>
      <span aria-hidden="true">{enabled ? 'Ⅱ' : '▷'}</span>
      {lang === 'es' ? (enabled ? 'Pausar efectos visuales' : 'Activar efectos visuales') : (enabled ? 'Pause visual effects' : 'Enable visual effects')}
    </button>
  </>;
}

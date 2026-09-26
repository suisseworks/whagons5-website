'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routeFor } from '../lib/locales';

export default function NotFound() {
  const lang = usePathname().split('/')[1] === 'en' ? 'en' : 'es';
  const es = lang === 'es';

  return (
    <main className="pg">
      <section className="pg-hero">
        <div className="pg-hero-inner">
          <div className="pg-hero-copy">
            <p className="pg-eyebrow">404 · {es ? 'Página no encontrada' : 'Page not found'}</p>
            <h1>{es ? 'Busquemos el camino de vuelta.' : 'Let’s get you back on track.'}</h1>
            <p className="pg-lead">
              {es
                ? 'Esta página no está disponible. Puedes volver al inicio para conocer Whagons o solicitar una demo para tu equipo.'
                : 'This page is unavailable. Return to the homepage to explore Whagons or request a demo for your team.'}
            </p>
            <div className="pg-actions">
              <Link href={routeFor(lang, 'home')} className="pg-btn">
                {es ? 'Volver al inicio' : 'Back to home'} <span aria-hidden="true">→</span>
              </Link>
              <Link href={routeFor(lang, 'demo')} className="pg-btn-secondary">
                {es ? 'Solicitar una demo' : 'Request a demo'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

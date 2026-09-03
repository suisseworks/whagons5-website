'use client';

import { translations } from '../../lib/i18n';
import { Language } from '../../lib/locales';
import ScrollReveal from '../../components/ScrollReveal';
import DemoSection from '../../components/DemoSection';
import ContactSection from '../../components/ContactSection';

export default function DemoPageClient({ lang }: { lang: Language }) {
  const t = translations[lang];

  return (
    <>
      <ScrollReveal />

      <main>
        <section className="page-hero">
          <div className="page-hero-inner r">
            <h1 className="page-hero-title">{t.demoPageTitle}</h1>
            <p className="page-hero-desc">{t.demoPageDesc}</p>
          </div>
        </section>

        <DemoSection t={t} language={lang} />
        <ContactSection t={t} language={lang} />
      </main>
    </>
  );
}

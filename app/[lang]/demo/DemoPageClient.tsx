'use client';

import { translations, Language } from '../../lib/i18n';
import ScrollReveal from '../../components/ScrollReveal';
import DemoSection from '../../components/DemoSection';
import ProofSection from '../../components/ProofSection';
import ContactSection from '../../components/ContactSection';

export default function DemoPageClient({ lang }: { lang: Language }) {
  const t = translations[lang];

  return (
    <>
      <ScrollReveal />

      <section className="page-hero">
        <div className="page-hero-inner r">
          <h1 className="page-hero-title">{t.demoPageTitle}</h1>
          <p className="page-hero-desc">{t.demoPageDesc}</p>
        </div>
      </section>

      <DemoSection t={t} language={lang} />
      <ProofSection t={t} />
      <ContactSection t={t} language={lang} />
    </>
  );
}

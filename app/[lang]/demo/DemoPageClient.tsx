'use client';

import { translations } from '../../lib/i18n';
import { demoOffer } from '../../lib/demo-offer';
import { Language } from '../../lib/locales';
import ScrollReveal from '../../components/ScrollReveal';
import DemoSection from '../../components/DemoSection';
import ContactSection from '../../components/ContactSection';

export default function DemoPageClient({ lang }: { lang: Language }) {
  const offer = demoOffer[lang];
  const t = { ...translations[lang], demoSubmit: offer.cta, demoSub: offer.deliverable };

  return (
    <>
      <ScrollReveal />

      <main>
        <section className="page-hero">
          <div className="page-hero-inner r">
            <h1 className="page-hero-title">{offer.title}</h1>
            <p className="page-hero-desc">{offer.description}</p>
          </div>
        </section>

        <DemoSection t={t} language={lang} />
        <ContactSection t={t} language={lang} />
      </main>
    </>
  );
}

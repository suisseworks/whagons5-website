'use client';

import { translations } from '../../lib/i18n';
import { demoOffer } from '../../lib/demo-offer';
import { Language } from '../../lib/locales';
import DemoSection from '../../components/DemoSection';
import ContactSection from '../../components/ContactSection';

export default function DemoPageClient({ lang }: { lang: Language }) {
  const offer = demoOffer[lang];
  const t = { ...translations[lang], demoSubmit: offer.cta, demoSub: offer.deliverable };

  return (
    <main className="pg">
      <DemoSection t={t} language={lang} />
      <ContactSection t={t} language={lang} />
    </main>
  );
}

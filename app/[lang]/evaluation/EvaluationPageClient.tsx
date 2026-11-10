'use client';

import { translations } from '../../lib/i18n';
import { Language } from '../../lib/locales';
import { BUSINESS_EVALUATION_SOURCE, FREE_EVALUATION_SOURCE, businessEvaluation, freeEvaluation } from '../../lib/free-evaluation';
import DemoSection from '../../components/DemoSection';
import ContactSection from '../../components/ContactSection';

// The demo form, worded for a free evaluation (hotel or any business) and
// tagged so the team's notification email says which one was requested.
export default function EvaluationPageClient({ lang, variant = 'hotel' }: { lang: Language; variant?: 'hotel' | 'business' }) {
  const copy = variant === 'business' ? businessEvaluation[lang] : freeEvaluation[lang];
  const t = {
    ...translations[lang],
    demoPerks: copy.perks,
    demoSub: copy.formIntro,
    demoSubmit: copy.cta,
    demoNote: copy.note,
    demoSuccessEyebrow: copy.successEyebrow,
    demoSuccess: copy.success,
  };

  return (
    <main className="pg">
      <DemoSection
        t={t}
        language={lang}
        source={variant === 'business' ? BUSINESS_EVALUATION_SOURCE : FREE_EVALUATION_SOURCE}
        intro={{ eyebrow: copy.eyebrow, title: copy.title, description: copy.lead }}
      />
      <ContactSection t={t} language={lang} />
    </main>
  );
}

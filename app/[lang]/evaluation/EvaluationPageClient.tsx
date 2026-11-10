'use client';

import { translations } from '../../lib/i18n';
import { Language } from '../../lib/locales';
import { FREE_EVALUATION_SOURCE, freeEvaluation } from '../../lib/free-evaluation';
import DemoSection from '../../components/DemoSection';
import ContactSection from '../../components/ContactSection';

// The demo form, worded for the free hotel evaluation and tagged so the team's
// notification email says "Free hotel evaluation".
export default function EvaluationPageClient({ lang }: { lang: Language }) {
  const copy = freeEvaluation[lang];
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
        source={FREE_EVALUATION_SOURCE}
        intro={{ eyebrow: copy.eyebrow, title: copy.title, description: copy.lead }}
      />
      <ContactSection t={t} language={lang} />
    </main>
  );
}

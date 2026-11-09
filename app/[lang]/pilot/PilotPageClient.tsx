'use client';

import { translations } from '../../lib/i18n';
import { Language } from '../../lib/locales';
import { PILOT_WAITLIST_SOURCE, pilotWaitlist } from '../../lib/pilot-waitlist';
import DemoSection from '../../components/DemoSection';
import ContactSection from '../../components/ContactSection';

// The demo form, worded for the pilot waitlist and tagged so the team's
// notification email says "Pilot waitlist".
export default function PilotPageClient({ lang }: { lang: Language }) {
  const copy = pilotWaitlist[lang];
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
        source={PILOT_WAITLIST_SOURCE}
        intro={{ eyebrow: copy.eyebrow, title: copy.pageTitle, description: copy.pageLead }}
      />
      <ContactSection t={t} language={lang} />
    </main>
  );
}

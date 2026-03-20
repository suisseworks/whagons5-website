'use client';

interface ContactSectionProps {
  t: any;
  language: string;
}

export default function ContactSection({ t, language }: ContactSectionProps) {
  return (
    <section id="contact">
      <div className="contact-inner r">
        <div className="contact-h">
          {language === 'es' ? <>&iquest;</> : null}{t.contactTitle1}<br />{t.contactTitle2}
        </div>
        <div className="contact-links">
          <a href={`mailto:${t.contactEmail}`} className="c-link">&#9993; {t.contactEmail}</a>
          <a href="https://wa.me/50684102321" className="c-link" target="_blank" rel="noopener noreferrer">{'\u2197'} {t.contactWhatsapp}</a>
        </div>
      </div>
    </section>
  );
}

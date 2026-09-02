'use client';

interface ContactSectionProps {
  t: any;
  language: string;
}

export default function ContactSection({ t, language }: ContactSectionProps) {
  return (
    <section id="contact">
      <div className="contact-inner r">
        <h2 className="contact-h">
          {language === 'es' ? <>&iquest;</> : null}{t.contactTitle1}<br />{t.contactTitle2}
        </h2>
        <div className="contact-links">
          <a href={`mailto:${t.contactEmail}`} className="c-link">&#9993; {t.contactEmail}</a>
          <a href="https://wa.me/50670717099" className="c-link">{'\u2197'} {t.contactWhatsapp}</a>
        </div>
      </div>
    </section>
  );
}

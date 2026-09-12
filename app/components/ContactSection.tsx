'use client';

interface ContactSectionProps {
  t: any;
  language: string;
}

/* Contact headings are stored in caps in i18n ("TIENES" / "PREGUNTAS?");
   render them as one sentence-case question for the light design system. */
function contactHeading(t: any, language: string) {
  const joined = `${t.contactTitle1} ${t.contactTitle2}`.toLocaleLowerCase();
  const sentence = joined.charAt(0).toLocaleUpperCase() + joined.slice(1);
  return language === 'es' ? `¿${sentence}` : sentence;
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ContactSection({ t, language }: ContactSectionProps) {
  const isEs = language === 'es';
  return (
    <section id="contact" className="pg-section pg-section-tight">
      <div className="pg-panel pg-contact">
        <div>
          <p className="pg-eyebrow">{isEs ? 'Contacto' : 'Contact'}</p>
          <h2>{contactHeading(t, language)}</h2>
          <p className="pg-text" style={{ marginTop: 12 }}>
            {isEs
              ? 'Escríbenos y te respondemos en menos de 24 horas hábiles.'
              : 'Write to us and we reply within one business day.'}
          </p>
        </div>
        <ul className="pg-rows">
          <li>
            <a href={`mailto:${t.contactEmail}`}>
              <div>
                <h3>{isEs ? 'Correo' : 'Email'}</h3>
                <p>{t.contactEmail}</p>
              </div>
              <span className="pg-accent" aria-hidden="true"><Arrow /></span>
            </a>
          </li>
          <li>
            <a href="https://wa.me/50670717099" target="_blank" rel="noopener noreferrer">
              <div>
                <h3>WhatsApp</h3>
                <p>{t.contactWhatsapp}</p>
              </div>
              <span className="pg-accent" aria-hidden="true"><Arrow /></span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

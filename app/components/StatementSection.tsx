'use client';

interface StatementSectionProps {
  t: any;
}

export default function StatementSection({ t }: StatementSectionProps) {
  return (
    <section id="statement">
      <div className="eyebrow r">{t.statementEyebrow}</div>
      <div className="stmt r d1">
        {t.statementText} <em>{t.statementEmphasis}</em> {t.statementText2}
      </div>
      <div className="manifesto-text r d2">
        {t.manifesto} <span className="manifesto-accent">{t.manifestoAccent}</span>
      </div>
    </section>
  );
}

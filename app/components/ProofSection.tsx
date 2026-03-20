'use client';

interface ProofSectionProps {
  t: any;
}

export default function ProofSection({ t }: ProofSectionProps) {
  return (
    <section id="proof">
      <div className="proof-top r">
        <div className="proof-title">{t.socialProofTitle}</div>
        <div className="proof-sub">{t.socialProofSub}</div>
      </div>

      <div className="proof-award r d1">
        <span className="pa-icon">★</span>
        <div className="pa-info">
          <div className="pa-title">{t.award.title}</div>
          <div className="pa-detail">{t.award.event} · {t.award.year}</div>
          <div className="pa-note">{t.award.note}</div>
        </div>
      </div>

      <div className="proof-metrics r d1">
        {t.socialProofMetrics.map((m: any, i: number) => (
          <div className="proof-metric" key={i}>
            <div className="pm-value">{m.value}</div>
            <div className="pm-label">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="proof-testimonials">
        {t.testimonials.map((tm: any, i: number) => (
          <div className={`proof-card r${i > 0 ? ` d${i}` : ''}`} key={i}>
            <blockquote className="pc-text">&ldquo;{tm.text}&rdquo;</blockquote>
            <div className="pc-author">
              <div className="pc-avatar" aria-hidden="true">
                {tm.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="pc-info">
                <div className="pc-name">{tm.name}</div>
                <div className="pc-role">{tm.role}, {tm.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

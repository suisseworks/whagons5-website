'use client';

interface CapabilitiesSectionProps {
  t: any;
}

export default function CapabilitiesSection({ t }: CapabilitiesSectionProps) {
  return (
    <section id="how">
      <div className="cap-top r">
        <div className="cap-title">{t.capTitle}</div>
        <div className="cap-sub">{t.capSub}</div>
      </div>
      <div className="cap-grid">
        {t.capabilities.map((cap: any, i: number) => (
          <div className={`cap-item r${i > 0 && i <= 2 ? ` d${i}` : ''}`} key={cap.num}>
            <div className="cap-num">{cap.num}</div>
            <div className="cap-name">{cap.name}</div>
            <p className="cap-desc">{cap.desc}</p>
          </div>
        ))}
        <a href="#demo" className="cap-item cap-cta">
          <div
            className="cap-cta-logo"
            style={{
              mask: 'url(/whagons.svg) no-repeat center / contain',
              WebkitMask: 'url(/whagons.svg) no-repeat center / contain',
            }}
          />
          <div className="cap-cta-text">{t.capMore}</div>
        </a>
      </div>
    </section>
  );
}

'use client';

interface IndustriesSectionProps {
  t: any;
}

export default function IndustriesSection({ t }: IndustriesSectionProps) {
  return (
    <section id="industries">
      <div className="ind-top r">
        <div className="ind-title">{t.indTitle}</div>
        <div className="ind-sub">{t.indSub}</div>
      </div>
      <div className="r">
        {t.industries.map((ind: any) => (
          <div className="ind-row" key={ind.num}>
            <span className="i-n">{ind.num}</span>
            <span className="i-name">{ind.name}</span>
            <span className="i-desc">{ind.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

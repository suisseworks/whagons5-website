'use client';

interface ColorsSectionProps {
  t: any;
  language: string;
  accentColor: string;
  accentColors: { color: string; name: string }[];
  onSelectColor: (color: string) => void;
}

export default function ColorsSection({ t, language, accentColor, accentColors, onSelectColor }: ColorsSectionProps) {
  return (
    <section id="colors">
      <div className="colors-top r">
        <div className="colors-title">{t.colorsTitle}<br />{t.colorsTitle2}</div>
        <div className="colors-sub">{t.colorsSub}</div>
      </div>
      <div className="colors-grid r d1">
        {accentColors.map((ac) => (
          <button
            className={`color-swatch${accentColor === ac.color ? ' active' : ''}`}
            key={ac.name}
            onClick={() => onSelectColor(ac.color)}
            aria-label={`Select ${ac.name} theme`}
          >
            <div
              className="swatch-icon"
              style={{ backgroundColor: ac.color, color: ac.color }}
            />
            <span className="swatch-label">{ac.name}</span>
          </button>
        ))}
        <label className="color-swatch swatch-add-wrap">
          <div className="swatch-add">
            <span className="swatch-add-mark" aria-hidden="true" />
            <input
              type="color"
              className="color-input"
              value={accentColor}
              onChange={(e) => onSelectColor(e.target.value)}
              aria-label={language === 'es' ? 'Elige tu color' : 'Pick your color'}
            />
          </div>
          <span className="swatch-label">{t.colorsCustom}</span>
        </label>
      </div>
      <p className="colors-desc r d2">{t.colorsDesc}</p>
    </section>
  );
}

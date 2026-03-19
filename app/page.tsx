'use client';

import { useState, useCallback, useEffect, FormEvent } from 'react';
import { translations, Language } from './lib/i18n';
import CustomCursor from './components/CustomCursor';
import ScrollReveal from './components/ScrollReveal';
import ThemeToggle, { Theme } from './components/ThemeToggle';
import FogEffect from './components/FogEffect';

// Costa Rica images for the closing section (verified Pexels URLs)
const CLOSING_IMAGES = [
  'https://images.pexels.com/photos/12832297/pexels-photo-12832297.jpeg?auto=compress&cs=tinysrgb&w=1200', // Palm-lined Costa Rica beach
  'https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg?auto=compress&cs=tinysrgb&w=1200',   // Tropical waterfall in jungle
  'https://images.pexels.com/photos/30670233/pexels-photo-30670233.jpeg?auto=compress&cs=tinysrgb&w=1200', // Colorful toucan
  'https://images.pexels.com/photos/762565/pexels-photo-762565.jpeg?auto=compress&cs=tinysrgb&w=1200',   // Golden sunset on beach
  'https://images.pexels.com/photos/16322443/pexels-photo-16322443.jpeg?auto=compress&cs=tinysrgb&w=1200', // Keel-billed toucan portrait
  'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1200',   // Coffee beans roasting
];

const ACCENT_COLORS = [
  { color: '#D4310A', name: 'Vermillion' },
  { color: '#2D8C3C', name: 'Forest' },
  { color: '#E67E22', name: 'Amber' },
  { color: '#1A6BB5', name: 'Ocean' },
];

export default function Home() {
  const [language, setLanguage] = useState<Language>('es');
  const [theme, setTheme] = useState<Theme>('light');
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0].color);

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  // Brief form state
  const [briefEmail, setBriefEmail] = useState('');
  const [briefIndustry, setBriefIndustry] = useState('');
  const [briefSubmitting, setBriefSubmitting] = useState(false);
  const [briefSuccess, setBriefSuccess] = useState(false);

  // Demo form state
  const [demoName, setDemoName] = useState('');
  const [demoCompany, setDemoCompany] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoPhone, setDemoPhone] = useState('');
  const [demoIndustry, setDemoIndustry] = useState('');
  const [demoTeamSize, setDemoTeamSize] = useState('');
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Random quote and image -- deferred to client to avoid hydration mismatch
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * translations.es.closingQuotes.length));
    setImageIndex(Math.floor(Math.random() * CLOSING_IMAGES.length));
  }, []);

  const closingImageUrl = CLOSING_IMAGES[imageIndex];

  const selectAccentColor = useCallback((color: string) => {
    setAccentColor(color);
    document.documentElement.style.setProperty('--red', color);
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  // Dynamic lang attribute for SEO
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  // Submit brief form
  const submitBrief = async (e: FormEvent) => {
    e.preventDefault();
    if (!briefEmail || !briefIndustry) return;

    setBriefSubmitting(true);
    try {
      await fetch('/api/flowdesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: briefEmail.split('@')[0],
          email: briefEmail.trim(),
          company: '',
          industry: briefIndustry,
          country: 'Unknown',
          language,
          formType: 'brief',
        }),
      });
      setBriefSuccess(true);
    } catch {
      // Graceful — show success anyway (matches API behavior)
      setBriefSuccess(true);
    } finally {
      setBriefSubmitting(false);
    }
  };

  // Submit demo form
  const submitDemo = async (e: FormEvent) => {
    e.preventDefault();
    if (!demoName || !demoEmail || !demoIndustry) return;

    setDemoSubmitting(true);
    try {
      await fetch('/api/flowdesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: demoName.trim(),
          email: demoEmail.trim(),
          company: demoCompany.trim(),
          industry: demoIndustry,
          country: 'Unknown',
          language,
          formType: 'demo',
          phone: demoPhone.trim(),
          teamSize: demoTeamSize,
        }),
      });
      setDemoSuccess(true);
    } catch {
      setDemoSuccess(true);
    } finally {
      setDemoSubmitting(false);
    }
  };

  return (
    <>
      {theme === 'magic' && <CustomCursor />}
      <ScrollReveal />
      {theme === 'magic' && <FogEffect intensity="reduced" />}

      {/* ── NAV ─── */}
      <nav>
        <a href="/" className="logo">
          <span className="logo-icon" aria-hidden="true" />
          Whagons
          <span className="logo-ver">5.0.0</span>
        </a>
        {/* Hamburger toggle (mobile only) */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
          <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
          <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
        </button>
        <div className={`nav-r${menuOpen ? ' nav-open' : ''}`}>
          <a href="#how" className="nl" onClick={() => setMenuOpen(false)}>{t.navPlatform}</a>
          <a href="#industries" className="nl" onClick={() => setMenuOpen(false)}>{t.navIndustries}</a>
          <a href="#brief" className="nl" onClick={() => setMenuOpen(false)}>{t.navBrief}</a>
          <a href="#demo" className="nd" onClick={() => setMenuOpen(false)}>{t.navDemo} &rarr;</a>
          <ThemeToggle onThemeChange={handleThemeChange} />
          <button onClick={toggleLanguage} className="lang-btn" aria-label="Switch language">
            {language === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section id="hero">
        {/* BG watermark word */}
        <div className="hero-bg-word" aria-hidden="true">{t.heroBgWord}</div>

        {/* Vertical ticker */}
        <div className="hero-ticker" aria-hidden="true">
          <span>{t.heroTicker1}</span>
          <span className="ticker-dot">&#9679;</span>
          <span>{t.heroTicker2}</span>
          <span className="ticker-dot">&#9679;</span>
          <span>{t.heroTicker3}</span>
        </div>

        {/* Year stamp */}
        <div className="hero-stamp">{t.heroStamp}</div>

        {/* Scroll indicator */}
        <div className="hero-scroll">
          <div className="scroll-line"></div>
          <div className="scroll-label">{t.heroScroll}</div>
        </div>

        {/* Main headline */}
        <div className="hero-headline">
          <span className="hl-line"><span>{t.heroLine1}</span></span>
          <span className="hl-line outline"><span>{t.heroLine2}</span></span>
          <span className="hl-line accent"><span>{t.heroLine3}</span></span>
        </div>

        {/* Foot bar */}
        <div className="hero-foot">
          <p className="hero-desc">{t.heroDesc}</p>
          <div className="hero-ctas">
            <a href="#brief" className="cta-primary">{t.heroCta1} &rarr;</a>
            <a href="#demo" className="cta-ghost">{t.heroCta2} <span>&nearr;</span></a>
          </div>
        </div>
      </section>

      {/* ── STATEMENT + MANIFESTO (merged) ─── */}
      <section id="statement">
        <div className="eyebrow r">{t.statementEyebrow}</div>
        <div className="stmt r d1">
          {t.statementText} <em>{t.statementEmphasis}</em> {t.statementText2}
        </div>
        <div className="manifesto-text r d2">
          {t.manifesto} <span className="manifesto-accent">{t.manifestoAccent}</span>
        </div>
      </section>

      {/* ── CAPABILITIES ─── */}
      <section id="how">
        <div className="cap-top r">
          <div className="cap-title">{t.capTitle}</div>
          <div className="cap-sub">{t.capSub}</div>
        </div>
        <div className="cap-grid">
          {t.capabilities.map((cap, i) => (
            <div className={`cap-item r${i > 0 && i <= 2 ? ` d${i}` : ''}`} key={cap.num}>
              <div className="cap-num">{cap.num}</div>
              <div className="cap-name">{cap.name}</div>
              <p className="cap-desc">{cap.desc}</p>
            </div>
          ))}
          {/* 8th cell — branded filler */}
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

      {/* ── COLORS / CUSTOMIZATION ─── */}
      <section id="colors">
        <div className="colors-top r">
          <div className="colors-title">{t.colorsTitle}<br />{t.colorsTitle2}</div>
          <div className="colors-sub">{t.colorsSub}</div>
        </div>
        <div className="colors-grid r d1">
          {ACCENT_COLORS.map((ac) => (
            <button
              className={`color-swatch${accentColor === ac.color ? ' active' : ''}`}
              key={ac.name}
              onClick={() => selectAccentColor(ac.color)}
              aria-label={`Select ${ac.name} theme`}
            >
              <div
                className="swatch-icon"
                style={{ backgroundColor: ac.color }}
              >
                <div
                  className="swatch-mask"
                  style={{
                    mask: 'url(/whagons.svg) no-repeat center / contain',
                    WebkitMask: 'url(/whagons.svg) no-repeat center / contain',
                    backgroundColor: '#fff',
                  }}
                />
              </div>
              <span className="swatch-label">{ac.name}</span>
            </button>
          ))}
          {/* Custom color picker – dashed "add" circle */}
          <label className="color-swatch swatch-add-wrap">
            <div className="swatch-add">
              <div
                className="swatch-add-logo"
                style={{
                  mask: 'url(/whagons.svg) no-repeat center / contain',
                  WebkitMask: 'url(/whagons.svg) no-repeat center / contain',
                }}
              />
              <input
                type="color"
                className="color-input"
                value={accentColor}
                onChange={(e) => selectAccentColor(e.target.value)}
                aria-label={language === 'es' ? 'Elige tu color' : 'Pick your color'}
              />
            </div>
            <span className="swatch-label">{t.colorsCustom}</span>
          </label>
        </div>
        <p className="colors-desc r d2">{t.colorsDesc}</p>
      </section>

      {/* ── INDUSTRIES ─── */}
      <section id="industries">
        <div className="ind-top r">
          <div className="ind-title">{t.indTitle}</div>
          <div className="ind-sub">{t.indSub}</div>
        </div>
        <div className="r">
          {t.industries.map((ind) => (
            <div className="ind-row" key={ind.num}>
              <span className="i-n">{ind.num}</span>
              <span className="i-name">{ind.name}</span>
              <span className="i-desc">{ind.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF / TESTIMONIALS ─── */}
      <section id="proof">
        <div className="proof-top r">
          <div className="proof-title">{t.socialProofTitle}</div>
          <div className="proof-sub">{t.socialProofSub}</div>
        </div>

        {/* Metrics strip */}
        <div className="proof-metrics r d1">
          {t.socialProofMetrics.map((m, i) => (
            <div className="proof-metric" key={i}>
              <div className="pm-value">{m.value}</div>
              <div className="pm-label">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="proof-testimonials">
          {t.testimonials.map((tm, i) => (
            <div className={`proof-card r${i > 0 ? ` d${i}` : ''}`} key={i}>
              <blockquote className="pc-text">&ldquo;{tm.text}&rdquo;</blockquote>
              <div className="pc-author">
                <div className="pc-avatar" aria-hidden="true">
                  {tm.name.split(' ').map(n => n[0]).join('')}
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

      {/* ── BRIEF ─── */}
      <section id="brief">
        <div className="brief-top r">
          <div className="brief-title">{t.briefTitle1}<br />{t.briefTitle2}</div>
          <p className="brief-sub">{t.briefSub}</p>
        </div>
        <div className="brief-body">
          <div className="brief-info r">
            <p>{t.briefInfo}</p>
            <ul>
              {t.briefBullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </div>
          <div className="r d1">
            {!briefSuccess ? (
              <form onSubmit={submitBrief}>
                <div className="f-line">
                  <label className="f-lbl" htmlFor="b-email">{t.briefEmailLabel}</label>
                  <input
                    className="f-inp"
                    id="b-email"
                    type="email"
                    placeholder={t.briefEmailPlaceholder}
                    required
                    value={briefEmail}
                    onChange={(e) => setBriefEmail(e.target.value)}
                    disabled={briefSubmitting}
                  />
                </div>
                <div className="f-line">
                  <label className="f-lbl" htmlFor="b-ind">{t.briefIndustryLabel}</label>
                  <select
                    className="f-inp"
                    id="b-ind"
                    required
                    value={briefIndustry}
                    onChange={(e) => setBriefIndustry(e.target.value)}
                    disabled={briefSubmitting}
                  >
                    <option value="" disabled>{t.briefIndustryPlaceholder}</option>
                    {t.industryOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="f-actions">
                  <button type="submit" className="btn-black" disabled={briefSubmitting}>
                    {briefSubmitting ? '...' : `${t.briefSubmit} \u2192`}
                  </button>
                  <p className="f-note">{t.briefNote}</p>
                </div>
              </form>
            ) : (
              <div className="f-success show">{t.briefSuccess}</div>
            )}
          </div>
        </div>
      </section>

      {/* ── DEMO ─── */}
      <section id="demo">
        <div className="demo-top r">
          <div className="demo-title">{t.demoTitle1}<br />{t.demoTitle2}</div>
          <p className="demo-sub">{t.demoSub}</p>
        </div>
        <div className="demo-body">
          <div className="r">
            <ul className="demo-perks">
              {t.demoPerks.map((perk, i) => (
                <li className="demo-perk" key={i}>
                  <span className="dp-n">0{i + 1}</span>
                  <span className="dp-t">{perk}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="r d1">
            {!demoSuccess ? (
              <form onSubmit={submitDemo}>
                <div className="demo-form-grid">
                  <div className="f-line">
                    <label className="f-lbl">{t.demoNameLabel}</label>
                    <input
                      className="f-inp"
                      type="text"
                      placeholder={t.demoNamePlaceholder}
                      required
                      value={demoName}
                      onChange={(e) => setDemoName(e.target.value)}
                      disabled={demoSubmitting}
                    />
                  </div>
                  <div className="f-line">
                    <label className="f-lbl">{t.demoCompanyLabel}</label>
                    <input
                      className="f-inp"
                      type="text"
                      placeholder={t.demoCompanyPlaceholder}
                      required
                      value={demoCompany}
                      onChange={(e) => setDemoCompany(e.target.value)}
                      disabled={demoSubmitting}
                    />
                  </div>
                  <div className="f-line">
                    <label className="f-lbl">{t.demoEmailLabel}</label>
                    <input
                      className="f-inp"
                      type="email"
                      placeholder={t.demoEmailPlaceholder}
                      required
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      disabled={demoSubmitting}
                    />
                  </div>
                  <div className="f-line">
                    <label className="f-lbl">{t.demoPhoneLabel}</label>
                    <input
                      className="f-inp"
                      type="tel"
                      placeholder={t.demoPhonePlaceholder}
                      value={demoPhone}
                      onChange={(e) => setDemoPhone(e.target.value)}
                      disabled={demoSubmitting}
                    />
                  </div>
                  <div className="f-line span2">
                    <label className="f-lbl">{t.demoIndustryLabel}</label>
                    <select
                      className="f-inp"
                      required
                      value={demoIndustry}
                      onChange={(e) => setDemoIndustry(e.target.value)}
                      disabled={demoSubmitting}
                    >
                      <option value="" disabled>{t.briefIndustryPlaceholder}</option>
                      {t.industryOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="f-line span2">
                    <label className="f-lbl">{t.demoTeamSizeLabel}</label>
                    <select
                      className="f-inp"
                      value={demoTeamSize}
                      onChange={(e) => setDemoTeamSize(e.target.value)}
                      disabled={demoSubmitting}
                    >
                      {t.teamSizeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="f-actions" style={{ marginTop: 40 }}>
                  <button type="submit" className="btn-black" disabled={demoSubmitting}>
                    {demoSubmitting ? '...' : `${t.demoSubmit} \u2192`}
                  </button>
                  <p className="f-note">{t.demoNote}</p>
                </div>
              </form>
            ) : (
              <div className="f-success show">{t.demoSuccess}</div>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─── */}
      <section id="contact">
        <div className="contact-inner r">
          <div className="contact-h">
            {language === 'es' ? <>&iquest;</> : null}{t.contactTitle1}<br />{t.contactTitle2}
          </div>
          <div className="contact-links">
            <a href={`mailto:${t.contactEmail}`} className="c-link">&#9993; {t.contactEmail}</a>
            <a href="https://wa.me/50684102321" className="c-link" target="_blank" rel="noopener noreferrer">&nearr; {t.contactWhatsapp}</a>
          </div>
        </div>
      </section>

      {/* ── CLOSING / MOTIVATIONAL ─── */}
      <section id="closing">
        <div className="closing-inner r">
          <div className="closing-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={closingImageUrl}
              alt={t.closingImageAlt}
              className="closing-img"
              loading="lazy"
            />
            <div className="closing-overlay" />
            <blockquote className="closing-quote">
              <p className="closing-text">&ldquo;{t.closingQuotes[quoteIndex].text}&rdquo;</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─── */}
      <footer>
        <div className="f-logo">Whagons <span className="logo-ver">5.0.0</span></div>
        <div className="f-tag">{t.footerTag}</div>
        <div className="f-copy">{t.footerCopy}</div>
      </footer>
    </>
  );
}

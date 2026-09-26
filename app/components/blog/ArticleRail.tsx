'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Language } from '../../lib/locales';
import type { TocItem } from '../../lib/rehype-article';

const copy = {
  es: {
    tree: 'Contenido', share: 'Compartir', hint: 'Usa ↑ / ↓ para desplazarte', copy: 'Copiar enlace',
    copied: 'Enlace copiado', email: 'Correo', progress: 'Progreso de lectura',
  },
  en: {
    tree: 'Contents', share: 'Share', hint: 'Press ↑ / ↓ to scroll', copy: 'Copy URL',
    copied: 'URL copied', email: 'Email', progress: 'Reading progress',
  },
} as const;

interface Group {
  item: TocItem;
  subs: TocItem[];
}

export default function ArticleRail({ lang, title, toc, url }: {
  lang: Language;
  title: string;
  toc: TocItem[];
  url: string;
}) {
  const t = copy[lang];
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [copied, setCopied] = useState(false);

  const groups = useMemo(() => {
    const result: Group[] = [];
    for (const item of toc) {
      if (item.depth === 2 || result.length === 0) result.push({ item, subs: [] });
      else result[result.length - 1].subs.push(item);
    }
    return result;
  }, [toc]);

  useEffect(() => {
    const body = document.getElementById('body');
    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const topBar = document.getElementById('topProg');
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top - line <= 0) current = heading.id;
        else break;
      }
      setActive(current ?? headings[0]?.id ?? null);

      if (body) {
        const rect = body.getBoundingClientRect();
        const total = rect.height - window.innerHeight * 0.6;
        const value = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
        setProgress(value);
        if (topBar) topBar.style.width = `${value * 100}%`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    const heroTitle = document.getElementById('art-title');
    const io = heroTitle
      ? new IntersectionObserver(([entry]) => setShowTitle(!entry.isIntersecting && entry.boundingClientRect.top < 0))
      : null;
    if (heroTitle && io) io.observe(heroTitle);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      io?.disconnect();
    };
  }, [toc]);

  const activeGroup = groups.find((group) => group.item.id === active || group.subs.some((sub) => sub.id === active));
  const pct = Math.round(progress * 100);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside className="rail" data-rise="" style={{ ['--d' as string]: '.2s' }}>
      <div className={`rail-title${showTitle ? ' on' : ''}`} aria-hidden={!showTitle}>{title}</div>
      <div className="th lbl">{t.tree}</div>
      <nav className="rail-tree" aria-label={t.tree}>
        {groups.map((group) => (
          <div key={group.item.id}>
            <a href={`#${group.item.id}`} className={activeGroup === group ? 'on' : undefined}>
              <span className="br" aria-hidden="true" />
              <span>{group.item.text}</span>
            </a>
            {group.subs.length > 0 && (
              <div className={`subs${activeGroup === group ? ' open' : ''}`}>
                <div>
                  {group.subs.map((sub) => (
                    <a key={sub.id} href={`#${sub.id}`} className={`sub${sub.id === active ? ' on' : ''}`} tabIndex={activeGroup === group ? undefined : -1}>
                      <span className="br" aria-hidden="true" />
                      <span>{sub.text}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="prog" role="progressbar" aria-label={t.progress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <span className="prog-bar"><b style={{ width: `${pct}%` }} /></span>
        <span className="pct">{String(pct).padStart(2, '0')}%</span>
      </div>
      <div className="hint">{t.hint}</div>
      <div className="share">
        <div className="th lbl">{t.share}</div>
        <a href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noreferrer"><span className="br" aria-hidden="true" />WhatsApp</a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer"><span className="br" aria-hidden="true" />LinkedIn</a>
        <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noreferrer"><span className="br" aria-hidden="true" />X.com</a>
        <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}><span className="br" aria-hidden="true" />{t.email}</a>
        <button type="button" onClick={copyUrl} aria-live="polite"><span className="br" aria-hidden="true" />{copied ? t.copied : t.copy}</button>
      </div>
    </aside>
  );
}

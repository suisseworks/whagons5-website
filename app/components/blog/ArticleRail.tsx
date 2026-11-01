'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Language } from '../../lib/locales';
import type { TocItem } from '../../lib/rehype-article';
import { trackHospitalityEvent } from '../hospitality/HospitalityAnalytics';

const copy = {
  es: {
    tree: 'Contenido', share: 'Compartir', hint: 'Usa ↑ / ↓ para desplazarte', copy: 'Copiar enlace',
    copied: 'Enlace copiado', email: 'Correo', progress: 'Progreso de lectura', react: 'Reaccionar',
    actions: 'Compartir o reaccionar',
    reactions: { useful: 'Útil', idea: 'Buena idea', love: 'Me encantó' },
  },
  en: {
    tree: 'Contents', share: 'Share', hint: 'Press ↑ / ↓ to scroll', copy: 'Copy URL',
    copied: 'URL copied', email: 'Email', progress: 'Reading progress', react: 'React',
    actions: 'Share or react',
    reactions: { useful: 'Useful', idea: 'Good idea', love: 'Loved it' },
  },
} as const;

const REACTIONS = [
  { id: 'useful', emoji: '👍' },
  { id: 'idea', emoji: '💡' },
  { id: 'love', emoji: '❤️' },
] as const;

type ReactionId = (typeof REACTIONS)[number]['id'];

interface Group {
  item: TocItem;
  subs: TocItem[];
}

export default function ArticleRail({ lang, slug, title, toc, url }: {
  lang: Language;
  slug: string;
  title: string;
  toc: TocItem[];
  url: string;
}) {
  const t = copy[lang];
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<ReactionId | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const reactionKey = `whagons-blog-reaction:${lang}/${slug}`;

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

  // On short screens the tree scrolls, so keep the current section in view.
  useEffect(() => {
    const tree = treeRef.current;
    const link = tree?.querySelector<HTMLElement>('a.sub.on') ?? tree?.querySelector<HTMLElement>('a.on');
    if (!tree || !link || tree.scrollHeight <= tree.clientHeight) return;
    const treeBox = tree.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    if (linkBox.top < treeBox.top || linkBox.bottom > treeBox.bottom) {
      tree.scrollTop += linkBox.top - treeBox.top - (treeBox.height - linkBox.height) / 2;
    }
  }, [active]);

  // Reactions stay on the reader's device, so read them after hydration.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(reactionKey);
      setReaction(REACTIONS.find((item) => item.id === stored)?.id ?? null);
    } catch {
      setReaction(null);
    }
  }, [reactionKey]);

  useEffect(() => {
    if (!sheetOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!barRef.current?.contains(event.target as Node)) setSheetOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSheetOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [sheetOpen]);

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

  const react = (id: ReactionId) => {
    const next = reaction === id ? null : id;
    setReaction(next);
    try {
      if (next) window.localStorage.setItem(reactionKey, next);
      else window.localStorage.removeItem(reactionKey);
    } catch {
      // Storage can be blocked; the choice still holds for this visit.
    }
    if (next) {
      trackHospitalityEvent('blog_article_reaction', { page: slug, reaction: next }, lang === 'es' ? 'latam' : 'us');
    }
  };

  // The phone's own share sheet when there is one, our list of links otherwise.
  const share = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    setSheetOpen((open) => !open);
  };

  const reactionButtons = (
    <div className="react-btns" role="group" aria-label={t.react}>
      {REACTIONS.map((item) => (
        <button
          key={item.id}
          type="button"
          className="react-btn"
          aria-label={t.reactions[item.id]}
          aria-pressed={reaction === item.id}
          title={t.reactions[item.id]}
          onClick={() => react(item.id)}
        >
          <span aria-hidden="true">{item.emoji}</span>
        </button>
      ))}
    </div>
  );

  const shareLinks = (
    <>
      <a href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noreferrer"><span className="br" aria-hidden="true" />WhatsApp</a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer"><span className="br" aria-hidden="true" />LinkedIn</a>
      <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noreferrer"><span className="br" aria-hidden="true" />X.com</a>
      <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}><span className="br" aria-hidden="true" />{t.email}</a>
      <button type="button" onClick={copyUrl} aria-live="polite"><span className="br" aria-hidden="true" />{copied ? t.copied : t.copy}</button>
    </>
  );

  return (
    <>
      <aside className="rail" data-rise="" style={{ ['--d' as string]: '.2s' }}>
        <div className={`rail-title${showTitle ? ' on' : ''}`} aria-hidden={!showTitle}>{title}</div>
        <div className="th lbl">{t.tree}</div>
        <div className="rail-tree" role="navigation" aria-label={t.tree} ref={treeRef}>
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
        </div>
        <div className="prog" role="progressbar" aria-label={t.progress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <span className="prog-bar"><b style={{ width: `${pct}%` }} /></span>
          <span className="pct">{String(pct).padStart(2, '0')}%</span>
        </div>
        <div className="hint">{t.hint}</div>
        <div className="react">
          <div className="th lbl">{t.react}</div>
          {reactionButtons}
        </div>
        <div className="share">
          <div className="th lbl">{t.share}</div>
          {shareLinks}
        </div>
      </aside>
      {/* Outside the rail: its entrance animation would anchor a fixed bar to it. */}
      <div className="art-bar" role="group" aria-label={t.actions} ref={barRef}>
        {reactionButtons}
        <button type="button" className="art-bar-share" aria-expanded={sheetOpen} aria-controls="art-share-sheet" onClick={share}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 10V2M4.75 5 8 1.75 11.25 5M3 8.5v5h10v-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {t.share}
        </button>
        <div className="art-share-sheet" id="art-share-sheet" hidden={!sheetOpen}>
          {shareLinks}
        </div>
      </div>
    </>
  );
}

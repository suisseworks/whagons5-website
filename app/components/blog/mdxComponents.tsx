import Image from 'next/image';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import type { Language } from '../../lib/locales';
import ArticleVideo, { type ArticleVideoProps } from './ArticleVideo';
import CheckItem from './CheckItem';
import CopyButton from './CopyButton';

const copy = {
  es: { code: 'Plantilla', copy: 'Copiar', copied: 'Copiado' },
  en: { code: 'Template', copy: 'Copy', copied: 'Copied' },
} as const;

// Fenced block languages used in articles, shown in the block header.
const BLOCK_LABELS: Record<Language, Record<string, string>> = {
  es: { text: 'Texto', message: 'Mensaje', label: 'Etiqueta', naming: 'Nombres', checklist: 'Lista' },
  en: { text: 'Text', message: 'Message', label: 'Label', naming: 'Naming', checklist: 'Checklist' },
};

function textFrom(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textFrom).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return textFrom((node as ReactElement<{ children?: ReactNode }>).props.children);
  }
  return '';
}

interface FigureProps {
  src: string;
  alt: string;
  fig?: string;
  caption?: string;
  width?: string;
  height?: string;
  wide?: boolean;
}

export function articleComponents(lang: Language) {
  const t = copy[lang];

  return {
    pre: ({ children }: ComponentPropsWithoutRef<'pre'>) => {
      const code = children as ReactElement<{ className?: string; children?: ReactNode }>;
      const language = (code?.props?.className || '').replace(/^language-/, '') || 'text';
      const text = textFrom(code?.props?.children).replace(/\n$/, '');
      return (
        <div className="art-code">
          <div className="ch">
            <span>{t.code}<span className="lang">{BLOCK_LABELS[lang][language] ?? language}</span></span>
            <CopyButton text={text} label={t.copy} done={t.copied} />
          </div>
          <pre><code>{text}</code></pre>
        </div>
      );
    },
    table: (props: ComponentPropsWithoutRef<'table'>) => (
      <div className="table-wrap"><table {...props} /></div>
    ),
    li: ({ className, children, ...rest }: ComponentPropsWithoutRef<'li'>) =>
      className?.includes('task-list-item') ? (
        <li className={className} {...rest}><label className="task-label">{children}</label></li>
      ) : (
        <li className={className} {...rest}>{children}</li>
      ),
    input: CheckItem,
    a: ({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) => {
      const external = /^https?:\/\//.test(href) && !href.startsWith('https://whagons.com');
      return (
        <a href={href} {...rest} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>
      );
    },
    Video: (props: Omit<ArticleVideoProps, 'lang'>) => <ArticleVideo lang={lang} {...props} />,
    Figure: ({ src, alt, fig, caption, width = '1600', height = '900', wide }: FigureProps) => (
      <figure className={`art-fig${wide ? ' wide' : ''}`}>
        <Image className="fg" src={src} alt={alt} width={Number(width)} height={Number(height)} sizes="(max-width: 900px) 100vw, 700px" />
        {(fig || caption) && (
          <figcaption className="cap">{fig && <b>FIG {fig}</b>}{caption && <span>{caption}</span>}</figcaption>
        )}
      </figure>
    ),
  };
}

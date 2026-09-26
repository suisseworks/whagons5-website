// Rehype plugin for blog articles:
//  - gives every h2/h3 a stable id and records it for the table of contents;
//  - wraps each h2 and the content after it in <section class="art-section">,
//    the unit the article layout reveals and spaces.

import { slugify } from './blog';

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

function textOf(node: HastNode): string {
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(textOf).join('');
}

export default function rehypeArticle(options: { toc: TocItem[]; prefix?: string }) {
  return (tree: HastNode) => {
    const used = new Map<string, number>();
    const uniqueId = (text: string) => {
      const base = slugify(text);
      const count = used.get(base) ?? 0;
      used.set(base, count + 1);
      return count === 0 ? base : `${base}-${count + 1}`;
    };

    const visit = (node: HastNode) => {
      if (node.type === 'element' && (node.tagName === 'h2' || node.tagName === 'h3')) {
        const text = textOf(node).trim();
        const id = uniqueId(text);
        node.properties = { ...node.properties, id };
        options.toc.push({ id, text, depth: node.tagName === 'h2' ? 2 : 3 });
      }
      node.children?.forEach(visit);
    };
    visit(tree);

    const sections: HastNode[] = [];
    let current: HastNode[] = [];
    const flush = () => {
      if (!current.some((node) => node.type !== 'text' || (node.value ?? '').trim())) {
        current = [];
        return;
      }
      const index = sections.length;
      sections.push({
        type: 'element',
        tagName: 'section',
        properties: {
          className: ['art-section'],
          id: `${options.prefix ?? 'part'}-s${index}`,
          // The first section is on screen at load; later ones reveal on scroll.
          ...(index === 0 ? { dataRise: '' } : { dataReveal: '' }),
        },
        children: current,
      });
      current = [];
    };
    for (const child of tree.children ?? []) {
      if (child.type === 'element' && child.tagName === 'h2') flush();
      current.push(child);
    }
    flush();
    tree.children = sections;
  };
}

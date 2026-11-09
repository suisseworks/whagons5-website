import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { newsLangs } = require('../newsLangs.js');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function site(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'news-'));
  for (const [file, body] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), body);
  }
  return dir;
}

const release = (extra = '') => `---\ntitle: T\nsummary: S\ndate: 2026-11-09\ntranslationKey: k\n${extra}---\n\nBody\n`;

test('no news folder means no linked languages', () => {
  assert.deepEqual(newsLangs(site({ 'README.md': '' }), false), []);
});

test('drafts do not count as published, unless the drafts preview is on', () => {
  const dir = site({ 'content/news/en/a.mdx': release('draft: true\n'), 'content/news/es/a.mdx': release('draft: true\n') });
  assert.deepEqual(newsLangs(dir, false), []);
  assert.deepEqual(newsLangs(dir, true), ['es', 'en']);
});

test('a language links once it has one published release', () => {
  const dir = site({
    'content/news/en/a.mdx': release('draft: true\n'),
    'content/news/en/b.mdx': release('draft: false\n'),
    'content/news/es/a.mdx': release('draft: true\n'),
  });
  assert.deepEqual(newsLangs(dir, false), ['en']);
});

test('"draft: true" in the body does not hide a release', () => {
  const dir = site({ 'content/news/en/a.mdx': `${release()}\n\`\`\`yaml\ndraft: true\n\`\`\`\n` });
  assert.deepEqual(newsLangs(dir, false), ['en']);
});

test('every release in the repo has its translation and required frontmatter', () => {
  const keys = {};
  for (const lang of ['en', 'es']) {
    const dir = path.join(root, 'content', 'news', lang);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.mdx'))) {
      const source = fs.readFileSync(path.join(dir, file), 'utf8');
      const fm = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
      for (const key of ['title', 'summary', 'date', 'translationKey']) {
        assert.match(fm, new RegExp(`^${key}:\\s*\\S`, 'm'), `${lang}/${file} needs ${key}`);
      }
      assert.match(fm, /^date:\s*\d{4}-\d{2}-\d{2}\s*$/m, `${lang}/${file} date must be YYYY-MM-DD`);
      const key = fm.match(/^translationKey:\s*(\S+)/m)[1];
      (keys[key] ??= []).push(lang);
    }
  }
  for (const [key, langs] of Object.entries(keys)) {
    assert.deepEqual(langs.sort(), ['en', 'es'], `release ${key} needs an en and an es file`);
  }
});

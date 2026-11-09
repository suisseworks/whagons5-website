// Languages that have at least one visible "What's new" release, worked out at
// build time from content/news/<lang>/*.mdx. next.config.js exposes the result
// as NEXT_PUBLIC_NEWS_LANGS so the footer and blog index only link to the
// section once it has something published (or when NEWS_DRAFTS=1 for previews).
const fs = require('fs');
const path = require('path');

function newsLangs(root = __dirname, showDrafts = process.env.NEWS_DRAFTS === '1') {
  const langs = [];
  for (const lang of ['es', 'en']) {
    const dir = path.join(root, 'content', 'news', lang);
    if (!fs.existsSync(dir)) continue;
    const visible = fs.readdirSync(dir).filter((file) => file.endsWith('.mdx')).some((file) => {
      const source = fs.readFileSync(path.join(dir, file), 'utf8');
      const frontmatter = (source.match(/^---\r?\n([\s\S]*?)\r?\n---/) || [])[1] || '';
      return showDrafts || !/^draft:\s*true\s*$/m.test(frontmatter);
    });
    if (visible) langs.push(lang);
  }
  return langs;
}

module.exports = { newsLangs };

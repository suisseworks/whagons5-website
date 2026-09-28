#!/usr/bin/env node
// Renders blog animations to MP4 + poster JPG.
//
//   node scripts/blog-media/render.mjs                 # every scene, es + en
//   node scripts/blog-media/render.mjs work-plans      # scenes whose id contains "work-plans"
//   node scripts/blog-media/render.mjs --lang es --fps 30
//   node scripts/blog-media/render.mjs --frames 0,4000 # stills only, for review
//
// Needs Chrome/Chromium (set CHROME_PATH if it is not found) and ffmpeg.
// Output: public/media/blog/<lang>/<scene-id>.mp4 and .jpg, where the id is
// the scene path with "/" replaced by "-", e.g. work-plans/schedule →
// work-plans-schedule.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUT = path.join(ROOT, 'public', 'media', 'blog');

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  const value = args[index + 1];
  args.splice(index, 2);
  return value;
};
const langs = option('lang', 'es,en').split(',');
const fps = Number(option('fps', '30'));
const crf = option('crf', '26');
const stills = option('frames', null);
const stillDir = option('out', path.join(ROOT, '.media-preview'));
const filters = args;

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error('Chrome not found. Set CHROME_PATH to a Chrome or Chromium binary.');
  return found;
}

function listScenes() {
  const dir = path.join(HERE, 'scenes');
  const result = [];
  for (const group of fs.readdirSync(dir)) {
    const groupDir = path.join(dir, group);
    if (!fs.statSync(groupDir).isDirectory()) continue;
    for (const file of fs.readdirSync(groupDir)) {
      if (!file.endsWith('.js') || file.startsWith('_')) continue;
      const scene = `${group}/${file.replace(/\.js$/, '')}`;
      result.push({ scene, id: scene.replace('/', '-') });
    }
  }
  return result.filter(({ id }) => filters.length === 0 || filters.some((f) => id.includes(f)));
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };

function serve() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const file = path.join(HERE, decodeURIComponent(url.pathname));
    if (!file.startsWith(HERE) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function encoder(file, width, height) {
  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-vf', `scale=${width}:${height}:flags=lanczos,format=yuv420p`,
    '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', crf,
    '-profile:v', 'high', '-movflags', '+faststart', '-an', file,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((resolve, reject) => {
    ff.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`))));
  });
  return { ff, done };
}

async function renderScene(browser, port, { scene, id }, lang) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
  page.on('pageerror', (error) => console.error(`  [${id}/${lang}]`, error.message));
  await page.goto(`http://127.0.0.1:${port}/lib/host.html?scene=${scene}&lang=${lang}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 20000 });
  const info = await page.evaluate(() => ({ duration: window.__scene.duration, poster: window.__scene.poster, size: window.__scene.size, still: window.__scene.still }));
  const [w, h] = info.size;
  await page.setViewportSize({ width: w, height: h });
  const clip = { x: 0, y: 0, width: w, height: h };
  const shot = async (t, type = 'png') => {
    await page.evaluate((time) => window.__scene.render(time), t);
    const png = await page.screenshot({ clip, type: 'png' });
    // Posters and stills: mozjpeg keeps them small without visible loss.
    return type === 'jpeg' ? sharp(png).jpeg({ quality: 80, mozjpeg: true }).toBuffer() : png;
  };

  if (stills) {
    fs.mkdirSync(stillDir, { recursive: true });
    for (const t of stills.split(',').map(Number)) {
      const file = path.join(stillDir, `${id}-${lang}-${t}.png`);
      fs.writeFileSync(file, await shot(t));
      console.log(`  still ${path.relative(ROOT, file)}`);
    }
    await page.close();
    return;
  }

  const dir = path.join(OUT, lang);
  fs.mkdirSync(dir, { recursive: true });
  if (info.still) {
    // Social cards and other stills: one JPG, no video.
    const jpg = path.join(dir, `${id}.jpg`);
    fs.writeFileSync(jpg, await shot(info.poster, 'jpeg'));
    await page.close();
    console.log(`  ${lang}/${id}.jpg  ${Math.round(fs.statSync(jpg).size / 1024)} KB`);
    return;
  }
  const mp4 = path.join(dir, `${id}.mp4`);
  const frames = Math.round((info.duration / 1000) * fps);
  const { ff, done } = encoder(mp4, w * 2, h * 2);
  const started = Date.now();
  for (let i = 0; i < frames; i += 1) {
    const buffer = await shot((i * 1000) / fps);
    if (!ff.stdin.write(buffer)) await new Promise((resolve) => ff.stdin.once('drain', resolve));
  }
  ff.stdin.end();
  await done;
  fs.writeFileSync(path.join(dir, `${id}.jpg`), await shot(info.poster, 'jpeg'));
  await page.close();
  const kb = Math.round(fs.statSync(mp4).size / 1024);
  console.log(`  ${lang}/${id}.mp4  ${frames} frames  ${kb} KB  ${((Date.now() - started) / 1000).toFixed(1)}s`);
}

const scenes = listScenes();
if (scenes.length === 0) {
  console.error('No scenes match', filters.join(' '));
  process.exit(1);
}
const server = await serve();
const browser = await chromium.launch({ executablePath: findChrome(), args: ['--font-render-hinting=none', '--disable-lcd-text'] });
try {
  for (const entry of scenes) {
    console.log(entry.id);
    for (const lang of langs) await renderScene(browser, server.address().port, entry, lang);
  }
} finally {
  await browser.close();
  server.close();
}

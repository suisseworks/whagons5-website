/* ==========================================================================
   Cronus Technology — interactions
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reducedMotion = () => motionQuery.matches;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const fmt = new Intl.NumberFormat('en-US');

  const FOUNDED = new Date(2004, 2, 1); // March 2004

  /* ---------- Dates & derived numbers ---------- */
  function initDates() {
    const now = new Date();
    let years = now.getFullYear() - FOUNDED.getFullYear();
    if (now.getMonth() < FOUNDED.getMonth()) years -= 1;
    const days = Math.floor((now - FOUNDED) / 864e5);

    $$('[data-years]').forEach((el) => { el.textContent = years; });
    $$('[data-year]').forEach((el) => { el.textContent = now.getFullYear(); });
    $$('[data-days]').forEach((el) => { el.textContent = fmt.format(days); });
  }

  /* ---------- Header state, active nav ---------- */
  function initHeader() {
    const header = $('[data-header]');
    let queued = false;
    const update = () => {
      queued = false;
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', () => {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    const links = $$('.nav a');
    const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove('is-active'));
        byId.get(entry.target.id)?.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach((section) => io.observe(section));
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    const toggle = $('.menu-toggle');
    const menu = $('#mobile-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      root.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  /* ---------- Hero: pipeline alignment profile ---------- */
  // Ground and seabed as [x, y]: x is a fraction of the width, y runs from the
  // dimension line (0) to the deepest seabed (1). Vertical scale is exaggerated.
  const GROUND = [
    [0, 0.16], [0.05, 0.13], [0.1, 0.17], [0.15, 0.12], [0.2, 0.15], [0.25, 0.17], [0.29, 0.21],
    [0.32, 0.26], [0.36, 0.3], [0.45, 0.33], [0.53, 0.36], [0.6, 0.4], [0.64, 0.5], [0.68, 0.68],
    [0.72, 0.86], [0.76, 0.96], [0.85, 1], [0.93, 0.97], [1, 0.99],
  ];
  const SEA = 0.26;
  const SHORE = 0.32;
  const SHELF = 0.6;
  const STATION = 0.04;
  const MANIFOLD = 0.86;

  // Catmull-Rom samples through GROUND.
  const groundSamples = (() => {
    const out = [];
    const steps = 14;
    for (let i = 0; i < GROUND.length - 1; i++) {
      const p0 = GROUND[i - 1] || GROUND[i];
      const p1 = GROUND[i];
      const p2 = GROUND[i + 1];
      const p3 = GROUND[i + 2] || p2;
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const t2 = t * t;
        const t3 = t2 * t;
        out.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (p2[k] - p0[k]) * t
          + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2
          + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t3)));
      }
    }
    out.push(GROUND[GROUND.length - 1]);
    return out;
  })();

  const groundAt = (x) => {
    for (let i = 1; i < groundSamples.length; i++) {
      const [x1, y1] = groundSamples[i];
      const [x0, y0] = groundSamples[i - 1];
      if (x <= x1) return lerp(y0, y1, (x - x0) / (x1 - x0 || 1));
    }
    return groundSamples[groundSamples.length - 1][1];
  };

  function profileSVG(w, h, seabed) {
    const top = 44; // room for the segment dimension line
    const X = (fx) => fx * w;
    const Y = (fy) => top + fy * (seabed - top);
    const k = clamp(h / 560, 0.6, 1);
    const pt = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`;
    const narrow = w < 640;

    const ground = groundSamples.map(([x, y]) => [X(x), Y(y)]);
    const groundD = `M${ground.map(([x, y]) => pt(x, y)).join(' L')}`;
    const seaY = Y(SEA);
    const wet = ground.filter(([x]) => x >= X(SHORE));
    const waterD = `M${pt(X(SHORE), seaY)} L${wet.map(([x, y]) => pt(x, y)).join(' L')} L${pt(w, seaY)} Z`;
    const deepY = Y(groundAt(0.85));

    // Pipeline: buried onshore, drilled under the shore approach, then laid on the seabed.
    const pipe = [];
    const stationY = Y(groundAt(STATION));
    pipe.push([X(STATION), stationY - 3]);
    let hddLow = [X(SHORE), 0];
    for (let fx = STATION + 0.012; fx <= MANIFOLD; fx += 0.004) {
      let off;
      if (fx < 0.27) off = 10 * k;
      else if (fx < 0.37) {
        const t = (fx - 0.27) / 0.1;
        off = lerp(10 * k, -3, t) + 24 * k * Math.sin(Math.PI * t);
      } else off = -3;
      const y = Y(groundAt(fx)) + off;
      if (fx >= 0.27 && fx < 0.37 && y > hddLow[1]) hddLow = [X(fx), y];
      pipe.push([X(fx), y]);
    }
    const pipeD = `M${pipe.map(([x, y]) => pt(x, y)).join(' L')}`;
    const manifold = [X(MANIFOLD), Y(groundAt(MANIFOLD))];

    // Segment extents, drawn as a dimension line.
    const dimY = 26;
    const zones = [
      [0, SHORE, 'Onshore'],
      [SHORE, SHELF, narrow ? 'Shallow' : 'Shallow water'],
      [SHELF, 1, 'Deepwater'],
    ];
    let dims = `<path class="p-dim" d="M0 ${dimY} H${w}"/>`;
    [0, SHORE, SHELF, 1].forEach((fx) => {
      const x = Math.min(X(fx), w - 0.5);
      dims += `<path class="p-dim" d="M${x.toFixed(1)} ${dimY - 6} V${dimY + 6}"/>`;
    });
    zones.forEach(([a, b, label]) => {
      dims += `<text class="p-label p-label--halo" x="${X((a + b) / 2).toFixed(1)}" y="${dimY - 10}" text-anchor="middle">${label}</text>`;
    });

    // Mean sea level symbol.
    const mslX = X(0.4);
    const msl = `<path class="p-msl" d="M${pt(X(SHORE), seaY)} H${w}"/>
      <path class="p-msl-mark" d="M${pt(mslX - 6, seaY - 11)} L${pt(mslX + 6, seaY - 11)} L${pt(mslX, seaY - 1)} Z"/>
      <text class="p-note p-label--halo" x="${(mslX + 12).toFixed(1)}" y="${(seaY - 3).toFixed(1)}">Sea level</text>`;

    // Callouts with leader lines.
    const sX = X(STATION);
    const shelfX = X(SHELF);
    const shelfY = Y(groundAt(SHELF));
    let callouts = `
      <rect class="p-station" x="${(sX - 12).toFixed(1)}" y="${(stationY - 16).toFixed(1)}" width="26" height="15"/>
      <text class="p-label p-label--halo" x="${(sX + 20).toFixed(1)}" y="${(stationY - 22).toFixed(1)}">Onshore station</text>
      <rect class="p-manifold" x="${(manifold[0] - 12).toFixed(1)}" y="${(manifold[1] - 11).toFixed(1)}" width="24" height="9"/>`;
    callouts += narrow
      ? `<text class="p-label p-label--wet" x="${(w - 8).toFixed(1)}" y="${(manifold[1] - 24).toFixed(1)}" text-anchor="end">9,000 ft</text>`
      : `<path class="p-leader p-leader--wet" d="M${pt(manifold[0], manifold[1] - 14)} V${(manifold[1] - 40).toFixed(1)}"/>
      <text class="p-label p-label--wet" x="${(manifold[0] + 12).toFixed(1)}" y="${(manifold[1] - 62).toFixed(1)}" text-anchor="end">Subsea manifold</text>
      <text class="p-note p-note--wet" x="${(manifold[0] + 12).toFixed(1)}" y="${(manifold[1] - 46).toFixed(1)}" text-anchor="end">9,000 ft water depth</text>`;
    if (!narrow) {
      callouts += `
        <circle class="p-dot" cx="${hddLow[0].toFixed(1)}" cy="${hddLow[1].toFixed(1)}" r="3"/>
        <path class="p-leader" d="M${pt(hddLow[0], hddLow[1] + 4)} V${(hddLow[1] + 30).toFixed(1)}"/>
        <text class="p-label p-label--halo" x="${(hddLow[0] + 8).toFixed(1)}" y="${(hddLow[1] + 30).toFixed(1)}">Shore approach by HDD</text>
        <circle class="p-dot" cx="${shelfX.toFixed(1)}" cy="${(shelfY - 3).toFixed(1)}" r="3"/>
        <text class="p-note" x="${(shelfX + 10).toFixed(1)}" y="${(shelfY - 10).toFixed(1)}">Shelf edge, 600 ft</text>`;
    }

    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" focusable="false">
      <defs>
        <pattern id="p-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line class="p-hatch-line" x1="0" y1="0" x2="0" y2="8"/>
        </pattern>
        <linearGradient id="p-water" gradientUnits="userSpaceOnUse" x1="0" y1="${seaY.toFixed(1)}" x2="0" y2="${deepY.toFixed(1)}">
          <stop offset="0" stop-color="#cfe0dc"/>
          <stop offset="0.22" stop-color="#7fa6a6"/>
          <stop offset="0.55" stop-color="#2c5a63"/>
          <stop offset="1" stop-color="#123a44"/>
        </linearGradient>
      </defs>
      <path d="${groundD} L${w} ${h} L0 ${h} Z" fill="url(#p-hatch)"/>
      <path d="${waterD}" fill="url(#p-water)"/>
      <path class="p-ground" d="${groundD}"/>
      ${msl}
      ${dims}
      <path class="p-pipe-case" d="${pipeD}"/>
      <path class="p-pipe" d="${pipeD}"/>
      ${callouts}
    </svg>`;
  }

  function initProfile() {
    const host = $('[data-profile]');
    if (!host) return;
    const block = $('.title-block');
    let drawn = false;
    let lastSize = '';

    const draw = () => {
      const w = Math.round(host.clientWidth);
      const h = Math.round(host.clientHeight);
      if (!w || !h || `${w}x${h}` === lastSize) return;
      lastSize = `${w}x${h}`;
      // Keep the deepest seabed clear of the title block when it sits on the drawing.
      const overlaid = block && getComputedStyle(block).position === 'absolute';
      const seabed = overlaid ? h - block.offsetHeight - 48 : h - 28;
      host.innerHTML = profileSVG(w, h, seabed);

      // The one load moment: the line is laid from the station to the manifold.
      if (drawn || reducedMotion()) { drawn = true; return; }
      drawn = true;
      $$('.p-pipe, .p-pipe-case', host).forEach((path) => {
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len} ${len}`;
        path.style.strokeDashoffset = String(len);
        path.getBoundingClientRect();
        path.style.transition = 'stroke-dashoffset 2.6s cubic-bezier(0.45, 0, 0.2, 1) 0.2s';
        path.style.strokeDashoffset = '0';
        path.addEventListener('transitionend', () => {
          path.style.strokeDasharray = '';
          path.style.transition = '';
        }, { once: true });
      });
    };

    // Wait for the web font so the title block has its final height.
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      draw();
      new ResizeObserver(draw).observe(host);
    });
  }

  /* ---------- Segments: depth gauge ---------- */
  function initDepth() {
    const section = $('#segments');
    const wrap = $('[data-depth-panels]');
    if (!section || !wrap) return;
    const panels = $$('.depth-panel', wrap);
    const readout = $('[data-depth-readout]');
    const items = $$('[data-gauge-item]');
    section.classList.add('depth--js');

    // scroll progress -> water depth (ft)
    const KEYS = [[0, 0], [0.3, 0], [0.36, 10], [0.66, 600], [0.72, 1000], [1, 9000]];
    const depthAt = (p) => {
      for (let i = 1; i < KEYS.length; i++) {
        const [p1, d1] = KEYS[i];
        const [p0, d0] = KEYS[i - 1];
        if (p <= p1) return lerp(d0, d1, (p - p0) / (p1 - p0));
      }
      return KEYS[KEYS.length - 1][1];
    };

    let current = 0;
    let target = 0;
    let raf = 0;
    let active = null;

    const setActive = (segment) => {
      if (segment === active) return;
      active = segment;
      panels.forEach((p) => p.classList.toggle('is-active', p.dataset.segment === segment));
      items.forEach((i) => i.classList.toggle('is-active', i.dataset.gaugeItem === segment));
    };

    const tick = () => {
      current += (target - current) * (reducedMotion() ? 1 : 0.14);
      if (Math.abs(target - current) < 0.0005) current = target;
      section.style.setProperty('--depth-progress', current.toFixed(4));
      readout.textContent = fmt.format(Math.round(depthAt(current) / 10) * 10);
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };

    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      const mid = window.innerHeight * 0.5;
      target = clamp((mid - rect.top) / rect.height, 0, 1);
      let segment = panels[0].dataset.segment;
      panels.forEach((p) => { if (p.getBoundingClientRect().top <= mid) segment = p.dataset.segment; });
      setActive(segment);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    measure();
  }

  /* ---------- Service detail dialog ---------- */
  function initModal() {
    const dialog = $('[data-modal]');
    const body = $('[data-modal-body]');
    const triggers = $$('[data-detail]');
    if (!dialog || typeof dialog.showModal !== 'function') {
      // No <dialog> support: reveal details inline instead.
      triggers.forEach((btn) => btn.addEventListener('click', () => {
        const detail = document.getElementById(btn.dataset.detail);
        detail.hidden = !detail.hidden;
      }));
      return;
    }

    let opener = null;
    triggers.forEach((btn) => btn.addEventListener('click', () => {
      body.innerHTML = document.getElementById(btn.dataset.detail).innerHTML;
      opener = btn;
      dialog.showModal();
      root.classList.add('modal-open');
      $('.modal-panel', dialog).scrollTop = 0;
    }));
    dialog.addEventListener('close', () => {
      root.classList.remove('modal-open');
      opener?.focus({ preventScroll: true });
    });
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || e.target.closest('[data-modal-close]')) dialog.close();
    });
  }

  /* ---------- Projects: filters + generated route profiles ---------- */
  const seeded = (seed) => {
    let s = 0;
    for (const ch of seed) s = (Math.imul(s, 31) + ch.charCodeAt(0)) >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  // Catmull-Rom spline through points, as an SVG path.
  const smoothPath = (pts) => {
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  };

  // Drawn in a 140-unit-tall space; `k` keeps nodes a constant size on screen.
  function routeSVG(segment, name, W, k) {
    const H = 140;
    const rnd = seeded(name);
    let route = '';
    let decor = '';
    let start;
    let end;

    if (segment === 'onshore') {
      // Right-of-way: straight legs with crossings (roads, rail, waterbodies).
      const n = 5 + Math.floor(rnd() * 3);
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const jitter = i > 0 && i < n ? (rnd() - 0.5) * (W / n) * 0.5 : 0;
        pts.push([24 + (W - 48) * (i / n) + jitter, 30 + rnd() * (H - 60)]);
      }
      route = `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L')}`;
      for (let c = 0; c < 2; c++) {
        const x = W * (0.25 + rnd() * 0.5);
        decor += `<path class="r-cross" d="M${(x - 14).toFixed(1)} 0 L${(x + 14).toFixed(1)} ${H}"/>`;
      }
      start = pts[0];
      end = pts[pts.length - 1];
    } else if (segment === 'shallow') {
      // Gentle lay along the shelf with a riser up to the waterline.
      const water = 24;
      const base = 84 + (rnd() - 0.5) * 16;
      const n = 6;
      const pts = [];
      for (let i = 0; i <= n; i++) pts.push([24 + (W - 80) * (i / n), base + (rnd() - 0.5) * 30]);
      const last = pts[pts.length - 1];
      const riserX = W - 32;
      pts.push([riserX, last[1]]);
      route = `${smoothPath(pts)} L${riserX} ${water + 6}`;
      decor += `<path class="r-water" d="M0 ${water} H${W}"/>`;
      decor += `<path class="r-seabed" d="M0 ${H - 16} C${W * 0.3} ${H - 24} ${W * 0.6} ${H - 8} ${W} ${H - 18}"/>`;
      decor += `<rect class="r-platform" x="${riserX - 14}" y="${water - 10}" width="28" height="6"/>`;
      start = pts[0];
      end = [riserX, water + 6];
    } else {
      // Deepwater: riser from a host down to the seabed.
      const water = 18;
      const seabed = 116 + rnd() * 6;
      const hostX = 34 + rnd() * 30;
      const touchdown = hostX + W * (0.28 + rnd() * 0.12);
      const pts = [[touchdown, seabed]];
      const n = 4;
      for (let i = 1; i <= n; i++) pts.push([touchdown + (W - 24 - touchdown) * (i / n), seabed + (rnd() - 0.5) * 8]);
      if (rnd() < 0.5) {
        // Steel catenary riser.
        route = `M${hostX.toFixed(1)} ${water + 6} C${(hostX + 6).toFixed(1)} ${(seabed - 10).toFixed(1)} ${(touchdown - 50).toFixed(1)} ${seabed.toFixed(1)} ${touchdown.toFixed(1)} ${seabed.toFixed(1)}`;
        route += smoothPath(pts).replace(/^M[^C]+/, ' ');
      } else {
        // Lazy-wave riser: a buoyancy hump between the host and touchdown.
        const span = touchdown - hostX;
        const hump = 58 + rnd() * 14;
        route = smoothPath([
          [hostX, water + 6],
          [hostX + span * 0.18, water + 56],
          [hostX + span * 0.42, hump + 26],
          [hostX + span * 0.6, hump],
          [hostX + span * 0.8, hump + 24],
          ...pts,
        ]);
        decor += `<path class="r-buoy" d="M${(hostX + span * 0.5).toFixed(1)} ${(hump + 4).toFixed(1)} Q${(hostX + span * 0.6).toFixed(1)} ${(hump - 8).toFixed(1)} ${(hostX + span * 0.7).toFixed(1)} ${(hump + 4).toFixed(1)}"/>`;
      }
      decor += `<path class="r-water" d="M0 ${water} H${W}"/>`;
      decor += `<path class="r-seabed" d="M0 ${(seabed + 8).toFixed(1)} H${W}"/>`;
      decor += `<rect class="r-platform" x="${(hostX - 16).toFixed(1)}" y="${water - 8}" width="32" height="8"/>`;
      start = [hostX, water + 6];
      end = pts[pts.length - 1];
    }

    const r = (3.5 * k).toFixed(1);
    return `<svg viewBox="0 0 ${W.toFixed(1)} ${H}" focusable="false">
      ${decor}
      <path class="r-line" d="${route}"/>
      <circle class="r-node" cx="${start[0].toFixed(1)}" cy="${start[1].toFixed(1)}" r="${r}"/>
      <circle class="r-node r-node--end" cx="${end[0].toFixed(1)}" cy="${end[1].toFixed(1)}" r="${r}"/>
    </svg>`;
  }

  function initProjects() {
    const grid = $('[data-project-grid]');
    if (!grid) return;
    const cards = $$('.project', grid);
    const buttons = $$('[data-filter]');

    const drawRoutes = () => {
      cards.forEach((card) => {
        if (card.hidden) return;
        const host = $('[data-route]', card);
        const width = Math.round(host.clientWidth);
        const height = Math.round(host.clientHeight);
        const key = `${width}x${height}`;
        if (!width || !height || host.dataset.size === key) return;
        host.dataset.size = key;
        const k = 140 / height;
        host.innerHTML = routeSVG(card.dataset.segment, $('h3', card).textContent, width * k, k);
      });
    };

    const apply = (filter) => {
      buttons.forEach((b) => {
        const on = b.dataset.filter === filter;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.segment === filter;
        card.hidden = !show;
        card.classList.remove('is-entering');
        if (show) {
          void card.offsetWidth; // restart the fade so the change is visible
          card.classList.add('is-entering');
        }
      });
      drawRoutes();
    };

    buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter)));
    $$('[data-filter-link]').forEach((a) => a.addEventListener('click', () => apply(a.dataset.filterLink)));

    new ResizeObserver(drawRoutes).observe(grid);
    drawRoutes();
  }

  /* ---------- World map ---------- */
  const PLACES = [
    { id: 'us', name: 'Houston, Texas', note: 'Headquarters', at: [-95.37, 29.76], hq: true },
    { id: 'gom', name: 'Gulf of Mexico', note: 'SPOT, Lucius, Whale, Holstein', at: [-90.2, 26.6] },
    { id: 'mx', name: 'Mexico', note: 'Construction experience', at: [-99.1, 19.4] },
    { id: 'br', name: 'Brazil', note: 'Construction experience', at: [-43.2, -22.9] },
    { id: 'es', name: 'Spain', note: 'Construction experience', at: [-3.7, 40.4] },
    { id: 'eg', name: 'Egypt', note: 'Construction experience', at: [31.2, 30.0] },
    { id: 'il', name: 'Israel', note: 'Leviathan for Noble Energy', at: [34.8, 32.6] },
    { id: 'gq', name: 'Equatorial Guinea', note: 'Alen Gas Monetization for Noble Energy', at: [8.8, 3.7] },
    { id: 'ao', name: 'Angola', note: 'Sanha and Mafumeira Sul for Chevron', at: [12.3, -5.8] },
    { id: 'kr', name: 'South Korea', note: 'Construction experience', at: [128.9, 35.2] },
    { id: 'pg', name: 'Papua New Guinea', note: 'Construction experience', at: [147.2, -9.4] },
  ];

  function initMap() {
    const svg = $('[data-world]');
    const data = window.CRONUS_WORLD;
    if (!svg || !data) return;
    const tip = $('[data-map-tip]');
    const CELL = 10;
    const VW = data.cols * CELL;
    const VH = data.rows.length * CELL;
    svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);

    let dots = '';
    data.rows.forEach((row, r) => {
      let c = 0;
      let land = false;
      row.split('.').forEach((run) => {
        const n = Number(run);
        if (land) {
          for (let k = 0; k < n; k++) dots += `M${(c + k) * CELL + CELL / 2} ${r * CELL + CELL / 2}h0`;
        }
        c += n;
        land = !land;
      });
    });

    const project = ([lon, lat]) => [
      ((lon + 180) / 360) * VW,
      ((data.latMax - lat) / data.step) * CELL,
    ];

    const hq = project(PLACES[0].at);
    let arcs = '';
    let pins = '';
    PLACES.forEach((place) => {
      const [x, y] = project(place.at);
      place.xy = [x, y];
      if (!place.hq) {
        const dist = Math.hypot(x - hq[0], y - hq[1]);
        const cx = (x + hq[0]) / 2;
        const cy = (y + hq[1]) / 2 - Math.min(dist * 0.32, 230);
        arcs += `<path class="arc" d="M${hq[0].toFixed(1)} ${hq[1].toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}"/>`;
      }
      pins += `<g class="pin${place.hq ? ' pin--hq' : ''}" data-pin="${place.id}">
        <circle class="pin-hit" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="22"/>
        <circle class="pin-ring" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${place.hq ? 13 : 10}"/>
        <circle class="pin-core" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${place.hq ? 7 : 5.5}"/>
      </g>`;
    });

    svg.insertAdjacentHTML('beforeend', `
      <path class="world-dots" d="${dots}"/>
      <g>${arcs}</g>
      <g>${pins}</g>`);

    const show = (id) => {
      const place = PLACES.find((p) => p.id === id);
      $$('.pin', svg).forEach((p) => p.classList.toggle('is-hot', p.dataset.pin === id));
      if (!place) { tip.classList.remove('is-on'); return; }
      tip.innerHTML = `<strong>${place.name}</strong><span>${place.note}</span>`;
      tip.style.left = `${(place.xy[0] / VW) * 100}%`;
      tip.style.top = `${(place.xy[1] / VH) * 100}%`;
      tip.classList.add('is-on');
    };
    const hide = () => show(null);

    $$('.pin', svg).forEach((pin) => {
      pin.addEventListener('pointerenter', () => show(pin.dataset.pin));
      pin.addEventListener('pointerleave', hide);
      pin.addEventListener('click', () => show(pin.dataset.pin));
    });
    $$('[data-place]').forEach((li) => {
      li.addEventListener('pointerenter', () => show(li.dataset.place));
      li.addEventListener('pointerleave', hide);
    });

    // On narrow screens the map is wider than the viewport: start scrolled to the Atlantic.
    const scroller = $('[data-map-scroll]');
    if (scroller.scrollWidth > scroller.clientWidth) {
      scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) * 0.35;
    }
  }

  /* ---------- Contact form (opens the visitor's email client) ---------- */
  function initForm() {
    const form = $('[data-contact-form]');
    const status = $('[data-form-status]');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        status.textContent = 'Add your name, a valid email address and a short message.';
        form.querySelector(':invalid')?.focus();
        return;
      }
      form.classList.remove('was-validated');
      const data = new FormData(form);
      const val = (key) => String(data.get(key) || '').trim();
      const subject = `Project inquiry${val('company') ? ` — ${val('company')}` : ''}`;
      const body = [
        `Name: ${val('name')}`,
        val('company') ? `Company: ${val('company')}` : null,
        `Email: ${val('email')}`,
        val('phone') ? `Phone: ${val('phone')}` : null,
        `Segment: ${val('segment')}`,
        '',
        val('message'),
      ].filter((line) => line !== null).join('\n');

      window.location.href = `mailto:info@cronustec.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Your email app should open with the message ready to send. If it doesn’t, write to info@cronustec.com.';
    });
  }

  /* ---------- Boot ---------- */
  initDates();
  initHeader();
  initMenu();
  initProfile();
  initDepth();
  initModal();
  initProjects();
  initMap();
  initForm();
})();

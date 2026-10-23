/* ==========================================================================
   Cronus — interactions
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

  /* ---------- Dates ---------- */
  function initDates() {
    const year = new Date().getFullYear();
    $$('[data-year]').forEach((el) => { el.textContent = year; });
  }

  /* ---------- Header state, active nav ---------- */
  function initHeader() {
    const header = $('[data-header]');
    let queued = false;
    const update = () => {
      queued = false;
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      const max = root.scrollHeight - window.innerHeight;
      header.style.setProperty('--progress', max > 0 ? clamp(window.scrollY / max, 0, 1).toFixed(4) : 0);
    };
    window.addEventListener('scroll', () => {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    // Section tracking only applies on the home page; other pages mark their section in the markup.
    if (!$('.hero')) return;
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

  /* ---------- Scroll reveal ---------- */
  // Sections fade up once as they enter the view; the life-cycle line draws in.
  function initReveal() {
    const els = $$('[data-reveal]');
    const perParent = new Map();
    els.forEach((el) => {
      const i = perParent.get(el.parentElement) || 0;
      perParent.set(el.parentElement, i + 1);
      el.style.setProperty('--d', Math.min(i, 3));
    });
    const timeline = $('[data-timeline]');
    if (timeline) $$('.timeline li', timeline).forEach((li, i) => li.style.setProperty('--i', i));
    const targets = timeline ? [...els, timeline] : els;

    if (!root.classList.contains('js') || reducedMotion() || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    const toggle = $('.menu-toggle');
    const menu = $('#mobile-menu');
    if (!toggle || !menu) return;

    // While the menu is open, the page behind it can't be tabbed into.
    const behind = $$('main, .site-footer');
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      root.classList.toggle('menu-open', open);
      behind.forEach((el) => { el.inert = open; });
      if (open) $('a', menu)?.focus();
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
  const PLET = 0.835; // pipeline end, where the jumper picks up
  const MANIFOLD = 0.875;

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

  // On a phone the onshore and shelf segments are squeezed, so the deepwater
  // end, where the pipeline story finishes, keeps its width.
  const squeeze = (fx) => {
    if (fx <= SHORE) return fx * (0.2 / SHORE);
    if (fx <= SHELF) return 0.2 + (fx - SHORE) * (0.26 / (SHELF - SHORE));
    return 0.46 + (fx - SHELF) * (0.54 / (1 - SHELF));
  };

  function profileSVG(w, h, seabed) {
    const top = 44; // room for the segment dimension line
    const narrow = w < 640;
    const X = (fx) => (narrow ? squeeze(fx) : fx) * w;
    const Y = (fy) => top + fy * (seabed - top);
    const k = clamp(h / 560, 0.6, 1);
    const pt = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`;
    const station = narrow ? 0.09 : STATION; // keep the station clear of the edge

    const ground = groundSamples.map(([x, y]) => [X(x), Y(y)]);
    const groundD = `M${ground.map(([x, y]) => pt(x, y)).join(' L')}`;
    const seaY = Y(SEA);
    const wet = ground.filter(([x]) => x >= X(SHORE));
    const waterD = `M${pt(X(SHORE), seaY)} L${wet.map(([x, y]) => pt(x, y)).join(' L')} L${pt(w, seaY)} Z`;
    const deepY = Y(groundAt(0.85));

    // Pipeline: buried onshore, drilled under the shore approach, then laid on the seabed.
    const pipe = [];
    const stationY = Y(groundAt(station));
    pipe.push([X(station), stationY - 3]);
    let hddLow = [X(SHORE), 0];
    for (let fx = station + 0.012; fx <= PLET; fx += 0.004) {
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
    // The path runs from the manifold end to the station, the way product flows.
    const pipeD = `M${[...pipe].reverse().map(([x, y]) => pt(x, y)).join(' L')}`;
    const manifold = [X(MANIFOLD), Y(groundAt(MANIFOLD))];
    const plet = pipe[pipe.length - 1];
    const archY = Math.min(plet[1], manifold[1]) - 22 * k;

    // Segment extents, drawn as a dimension line.
    const dimY = 26;
    const zones = [
      [0, SHORE, 'Onshore'],
      [SHORE, SHELF, 'Shelf'],
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
    const sX = X(station);
    const shelfX = X(SHELF);
    const shelfY = Y(groundAt(SHELF));
    let callouts = `
      <rect class="p-station" x="${(sX - 12).toFixed(1)}" y="${(stationY - 16).toFixed(1)}" width="26" height="15"/>
      <text class="p-label p-label--halo" x="${(sX + 20).toFixed(1)}" y="${(stationY - 22).toFixed(1)}">Onshore station</text>
      <path class="p-jumper" d="M${pt(plet[0] + 3, plet[1] - 4)} V${archY.toFixed(1)} H${(manifold[0] - 6).toFixed(1)} V${(manifold[1] - 10).toFixed(1)}"/>
      <rect class="p-manifold" x="${(plet[0] - 5).toFixed(1)}" y="${(plet[1] - 6).toFixed(1)}" width="10" height="6"/>
      <rect class="p-manifold" x="${(manifold[0] - 12).toFixed(1)}" y="${(manifold[1] - 11).toFixed(1)}" width="24" height="9"/>`;
    // On a phone the labels sit higher, in open water clear of the slope.
    const labelX = narrow ? w - 10 : manifold[0] + 12;
    const labelY = narrow ? archY - 66 : archY - 40;
    callouts += `${narrow ? '' : `<text class="p-note p-note--wet" x="${(plet[0] - 6).toFixed(1)}" y="${(archY + 4).toFixed(1)}" text-anchor="end">Jumper</text>`}
      <path class="p-leader p-leader--wet" d="M${pt(manifold[0] + 4, manifold[1] - 14)} V${(labelY + 22).toFixed(1)}"/>
      <text class="p-label p-label--wet" x="${labelX.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="end">Subsea manifold</text>
      <text class="p-note p-note--wet" x="${labelX.toFixed(1)}" y="${(labelY + 16).toFixed(1)}" text-anchor="end">${narrow ? 'Nearly 9,000 ft deep' : 'Nearly 9,000 ft water depth'}</text>`;
    if (!narrow) {
      callouts += `
        <circle class="p-dot" cx="${hddLow[0].toFixed(1)}" cy="${hddLow[1].toFixed(1)}" r="3"/>
        <path class="p-leader" d="M${pt(hddLow[0], hddLow[1] + 4)} V${(hddLow[1] + 30).toFixed(1)}"/>
        <text class="p-label p-label--halo" x="${(hddLow[0] + 8).toFixed(1)}" y="${(hddLow[1] + 30).toFixed(1)}">Landfall, by HDD shore approach</text>
        <circle class="p-dot" cx="${shelfX.toFixed(1)}" cy="${(shelfY - 3).toFixed(1)}" r="3"/>
        <text class="p-note" x="${(shelfX + 10).toFixed(1)}" y="${(shelfY - 10).toFixed(1)}">Shelf edge, 600 ft</text>`;
    }

    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" focusable="false">
      <defs>
        <pattern id="p-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line class="p-hatch-line" x1="0" y1="0" x2="0" y2="8"/>
        </pattern>
        <linearGradient id="p-water" gradientUnits="userSpaceOnUse" x1="0" y1="${seaY.toFixed(1)}" x2="0" y2="${deepY.toFixed(1)}">
          <stop offset="0" stop-color="#e0f0fa"/>
          <stop offset="0.22" stop-color="#8cc4e8"/>
          <stop offset="0.55" stop-color="#1d6aa8"/>
          <stop offset="1" stop-color="#0b2a45"/>
        </linearGradient>
        <linearGradient id="p-pipe-grad" gradientUnits="userSpaceOnUse" x1="${X(station).toFixed(1)}" y1="0" x2="${X(PLET).toFixed(1)}" y2="0">
          <stop offset="0" stop-color="#0077c8"/>
          <stop offset="0.45" stop-color="#0077c8"/>
          <stop offset="1" stop-color="#00b5e2"/>
        </linearGradient>
      </defs>
      <path d="${groundD} L${w} ${h} L0 ${h} Z" fill="url(#p-hatch)"/>
      <path d="${waterD}" fill="url(#p-water)"/>
      <path class="p-ground" d="${groundD}"/>
      ${msl}
      ${dims}
      <path class="p-pipe-case" d="${pipeD}"/>
      <path class="p-pipe" d="${pipeD}"/>
      <path class="p-flow" d="${pipeD}"/>
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
      const svg = $('svg', host);

      // On load the line is laid from the manifold to the station, then product flows through it to shore.
      if (drawn || reducedMotion()) { drawn = true; svg.classList.add('is-flowing'); return; }
      drawn = true;
      const paths = $$('.p-pipe, .p-pipe-case', host);
      paths[0].addEventListener('transitionend', () => svg.classList.add('is-flowing'), { once: true });
      paths.forEach((path) => {
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

    // Pause the flow while the hero is off screen.
    new IntersectionObserver(([entry]) => host.classList.toggle('is-paused', !entry.isIntersecting)).observe(host);

    // Wait for the web font so the title block has its final height.
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      draw();
      new ResizeObserver(draw).observe(host);
    });
  }

  // A list that scrolls sideways (on phones) must be reachable by keyboard.
  // Returns an update function for when the content width changes.
  const keyboardScrollable = (el, label, role) => {
    const update = () => {
      if (el.scrollWidth > el.clientWidth + 1) {
        el.tabIndex = 0;
        el.setAttribute('aria-label', label);
        if (role) el.setAttribute('role', role);
      } else {
        el.removeAttribute('tabindex');
        el.removeAttribute('aria-label');
        if (role) el.removeAttribute('role');
      }
    };
    new ResizeObserver(update).observe(el);
    update();
    return update;
  };

  /* ---------- Service detail dialog ---------- */
  function initModal() {
    const dialog = $('[data-modal]');
    const body = $('[data-modal-body]');
    const triggers = $$('[data-detail]');
    if (!dialog || typeof dialog.showModal !== 'function') {
      // No <dialog> support: reveal details inline instead.
      triggers.forEach((btn) => btn.addEventListener('click', () => {
        document.getElementById(btn.dataset.detail).classList.toggle('is-open');
      }));
      return;
    }

    let opener = null;
    let returnTo = null;
    triggers.forEach((btn) => btn.addEventListener('click', () => {
      body.innerHTML = document.getElementById(btn.dataset.detail).innerHTML;
      $('h3', body)?.setAttribute('id', 'modal-title'); // names the dialog
      opener = btn;
      returnTo = null;
      dialog.showModal();
      root.classList.add('modal-open');
      $('.modal-panel', dialog).scrollTop = 0;
    }));
    dialog.addEventListener('close', () => {
      root.classList.remove('modal-open');
      (returnTo || opener)?.focus({ preventScroll: true });
    });
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || e.target.closest('[data-modal-close]')) {
        // A link out of the dialog (e.g. "Talk to an engineer") moves focus to where it leads.
        const link = e.target.closest('a[href^="#"]');
        returnTo = link ? document.getElementById(link.hash.slice(1))?.querySelector('[tabindex="-1"]') : null;
        dialog.close();
      }
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
      <path class="r-flow" d="${route}"/>
      <circle class="r-node" cx="${start[0].toFixed(1)}" cy="${start[1].toFixed(1)}" r="${r}"/>
      <circle class="r-node r-node--end" cx="${end[0].toFixed(1)}" cy="${end[1].toFixed(1)}" r="${r}"/>
    </svg>`;
  }

  // Draws (or redraws, after a resize) the route artwork in a [data-route] host.
  const drawRoute = (host, kind, seed) => {
    const width = Math.round(host.clientWidth);
    const height = Math.round(host.clientHeight);
    const key = `${width}x${height}`;
    if (!width || !height || host.dataset.size === key) return;
    host.dataset.size = key;
    const k = 140 / height;
    host.innerHTML = routeSVG(kind, seed, width * k, k);
  };

  // Sector cards and page heroes carry route artwork of a given kind.
  function initRouteArt() {
    const hosts = $$('[data-route][data-kind]');
    if (!hosts.length) return;
    const draw = () => hosts.forEach((host) => drawRoute(host, host.dataset.kind, host.dataset.seed));
    const ro = new ResizeObserver(draw);
    hosts.forEach((host) => ro.observe(host));
    draw();
  }

  function initProjects() {
    const grid = $('[data-project-grid]');
    if (!grid) return;
    const cards = $$('.project', grid);
    const buttons = $$('[data-filter]');

    const drawRoutes = () => {
      cards.forEach((card) => {
        if (!card.hidden) drawRoute($('[data-route]', card), card.dataset.segment, $('h3', card).textContent);
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

    // Phones: the register scrolls sideways; show where the visitor is in it.
    const progress = $('[data-project-progress]');
    const updateProgress = () => {
      if (!progress) return;
      const max = grid.scrollWidth;
      progress.style.setProperty('--thumb', max ? (grid.clientWidth / max).toFixed(4) : 1);
      progress.style.setProperty('--pos', max ? (grid.scrollLeft / max).toFixed(4) : 0);
    };
    const status = $('[data-filter-status]');
    const LABELS = { onshore: 'onshore', shallow: 'shelf', deep: 'deepwater' };
    const updateScrollable = keyboardScrollable(grid, 'Selected projects, scrolls sideways');
    const choose = (filter) => {
      apply(filter);
      grid.scrollLeft = 0;
      updateProgress();
      updateScrollable();
      const n = cards.filter((card) => !card.hidden).length;
      if (status) status.textContent = filter === 'all' ? 'Showing projects from every sector.' : `Showing ${LABELS[filter]} projects.`;
    };
    grid.addEventListener('scroll', updateProgress, { passive: true });

    buttons.forEach((b) => b.addEventListener('click', () => choose(b.dataset.filter)));

    new ResizeObserver(() => { drawRoutes(); updateProgress(); }).observe(grid);
    drawRoutes();
  }

  /* ---------- World map ---------- */
  const PLACES = [
    { id: 'us', name: 'Houston, Texas', note: 'Our office, where every project is run', at: [-95.37, 29.76], hq: true },
    { id: 'gom', name: 'Gulf of Mexico', note: 'Deepwater pipelines, tiebacks and an offshore terminal', at: [-90.2, 26.6] },
    { id: 'mx', name: 'Mexico', note: 'Construction experience', at: [-99.1, 19.4] },
    { id: 'br', name: 'Brazil', note: 'Construction experience', at: [-43.2, -22.9] },
    { id: 'il', name: 'Israel', note: 'Deepwater gas field development in the Eastern Mediterranean', at: [34.8, 32.6] },
    { id: 'gq', name: 'Equatorial Guinea', note: 'Gas export pipeline to shore', at: [8.8, 3.7] },
    { id: 'ao', name: 'Angola', note: 'Gas and crude export pipelines, risers and pipeline repair', at: [12.3, -5.8] },
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
    PLACES.forEach((place, i) => {
      const [x, y] = project(place.at);
      place.xy = [x, y];
      if (!place.hq) {
        const dist = Math.hypot(x - hq[0], y - hq[1]);
        const cx = (x + hq[0]) / 2;
        const cy = (y + hq[1]) / 2 - Math.min(dist * 0.32, 230);
        arcs += `<path class="arc" pathLength="1" d="M${hq[0].toFixed(1)} ${hq[1].toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}"/>`;
      }
      pins += `<g class="pin${place.hq ? ' pin--hq' : ''}" data-pin="${place.id}">
        <circle class="pin-hit" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="56"/>
        <circle class="pin-ring" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${place.hq ? 13 : 10}"/>
        <circle class="pin-core" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${place.hq ? 7 : 5.5}"/>
      </g>`;
    });

    svg.insertAdjacentHTML('beforeend', `
      <path class="world-dots" d="${dots}"/>
      <g>${arcs}</g>
      <g>${pins}</g>`);
    const hqPin = $('.pin--hq', svg);
    hqPin.parentNode.append(hqPin);
    // Arcs draw out one after another (set here, not in markup, for the CSP).
    $$('.arc', svg).forEach((arc, i) => arc.style.setProperty('--i', i + 1));

    const show = (id) => {
      const place = PLACES.find((p) => p.id === id);
      $$('.pin', svg).forEach((p) => p.classList.toggle('is-hot', p.dataset.pin === id));
      if (!place) { tip.classList.remove('is-on'); return; }
      tip.innerHTML = `<strong>${place.name}</strong><span>${place.note}</span>`;
      const box = svg.getBoundingClientRect();
      const origin = tip.offsetParent.getBoundingClientRect();
      tip.style.left = `${box.left - origin.left + (place.xy[0] / VW) * box.width}px`;
      tip.style.top = `${box.top - origin.top + (place.xy[1] / VH) * box.height}px`;
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

    // Arcs draw out from Houston once, when the map comes into view.
    const wrap = $('[data-map-scroll]');
    if (reducedMotion()) wrap.classList.add('is-in');
    else {
      const io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        wrap.classList.add('is-in');
        io.disconnect();
      }, { threshold: 0.3 });
      io.observe(wrap);
    }

    // On narrow screens the map is wider than the viewport: start scrolled to the Atlantic.
    const scroller = $('[data-map-scroll]');
    if (scroller.scrollWidth > scroller.clientWidth) {
      scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) * 0.35;
    }
    keyboardScrollable(scroller, 'World map, scrolls sideways', 'region');
  }

  /* ---------- Analytics ---------- */
  // Google Analytics loads only when the page names a property (data-ga on
  // <html>, from site.json). Events go to the data layer either way, so they
  // start counting the moment analytics is switched on.
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); } // eslint-disable-line prefer-rest-params
  const track = (name, params = {}) => gtag('event', name, params);

  // Visitors from the EEA, the UK and Switzerland are measured without cookies.
  const NO_COOKIE_REGIONS = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT',
    'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH'];

  function initAnalytics() {
    const id = root.dataset.ga;
    if (id) {
      const denied = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
      gtag('consent', 'default', { ...denied, analytics_storage: 'denied', region: NO_COOKIE_REGIONS });
      gtag('consent', 'default', { ...denied, analytics_storage: 'granted' });
      gtag('js', new Date());
      gtag('config', id);
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      document.head.append(script);
    }

    const where = (el) => el.closest('[id]')?.id || 'page';
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a, button');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      const label = link.textContent.trim().replace(/\s+/g, ' ').slice(0, 80);
      if (href.startsWith('tel:')) track('phone_click', { link_text: label, section: where(link) });
      else if (href.startsWith('mailto:')) track('email_click', { link_text: href.slice(7).split('?')[0], section: where(link) });
      else if (/\.pdf($|\?)/i.test(href)) track('pdf_download', { file_name: href.split('/').pop().split('?')[0], link_text: label });
      else if (link.classList.contains('btn') && link.type !== 'submit') track('cta_click', { link_text: label, section: where(link) });
    });
  }

  /* ---------- Technical papers ---------- */
  // Marks the section being read, and folds the contents list away on phones.
  function initToc() {
    const toc = $('[data-toc]');
    if (!toc) return;
    const summary = $('summary', toc);
    const narrow = window.matchMedia('(max-width: 1080px)');
    const fit = () => {
      toc.open = !narrow.matches;
      // On wider screens the list is always open, so its title isn't a control.
      if (narrow.matches) summary.removeAttribute('tabindex');
      else summary.tabIndex = -1;
    };
    summary.addEventListener('click', (e) => { if (!narrow.matches) e.preventDefault(); });
    narrow.addEventListener('change', fit);
    fit();
    // Following a contents link on a phone closes the list behind it.
    toc.addEventListener('click', (e) => { if (narrow.matches && e.target.closest('a')) toc.open = false; });

    const links = $$('a', toc);
    const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove('is-current'));
        byId.get(entry.target.id)?.classList.add('is-current');
      });
    }, { rootMargin: '-15% 0px -75% 0px' });
    $$('.article h2[id]').forEach((h) => io.observe(h));
  }

  // Tables wider than the screen scroll sideways: say so, and fade the cut-off edge.
  function initTables() {
    $$('.article .table-wrap').forEach((wrap, i) => {
      const frame = document.createElement('div');
      frame.className = 'table-frame';
      const hint = document.createElement('p');
      hint.className = 'table-hint';
      hint.textContent = 'Scroll sideways to see the whole table';
      wrap.before(frame);
      frame.append(hint, wrap);
      const heading = wrap.parentElement.closest('.article') && [...$$('h2, h3', wrap.closest('.article'))]
        .filter((h) => h.compareDocumentPosition(wrap) & Node.DOCUMENT_POSITION_FOLLOWING).pop();
      const update = () => {
        const scrollable = wrap.scrollWidth > wrap.clientWidth + 1;
        frame.classList.toggle('is-scrollable', scrollable);
        frame.classList.toggle('at-end', wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 2);
        frame.style.setProperty('--table-h', `${wrap.offsetHeight - 2}px`);
      };
      wrap.addEventListener('scroll', update, { passive: true });
      new ResizeObserver(update).observe(wrap);
      update();
      keyboardScrollable(wrap, `Table ${i + 1}${heading ? `, ${heading.textContent.trim()}` : ''}, scrolls sideways`, 'region');
    });
  }

  /* ---------- Forms ---------- */
  // Each form posts to its action URL. If that can't be reached, the visitor
  // gets a ready-made email to send instead, so no message is lost.
  const mailtoLink = (address, subject, body) =>
    `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Cloudflare Turnstile, when the site has a key: one widget per form.
  function initTurnstile() {
    const boxes = $$('[data-turnstile]');
    if (!boxes.length) return;
    window.cronusTurnstile = () => boxes.forEach((box) => {
      window.turnstile.render(box, { sitekey: box.dataset.turnstile, action: box.closest('form').dataset.applyForm !== undefined ? 'apply' : 'contact' });
    });
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=cronusTurnstile&render=explicit';
    script.async = true;
    document.head.append(script);
  }
  const turnstileToken = (form) => $('[name="cf-turnstile-response"]', form)?.value || '';
  const resetTurnstile = (form) => {
    const box = $('[data-turnstile]', form);
    if (box && window.turnstile) window.turnstile.reset(box);
  };

  function formBasics(form) {
    const status = $('[data-form-status]', form);
    const button = $('button[type="submit"]', form);
    const controls = $$('input, select, textarea', form).filter((c) => c.type !== 'radio' && c.name !== 'website' && c.type !== 'hidden');
    const markInvalid = () => controls.forEach((c) => {
      if (c.checkValidity()) c.removeAttribute('aria-invalid');
      else c.setAttribute('aria-invalid', 'true');
    });
    // After a failed submit, clear each field's error state as soon as it's fixed.
    form.addEventListener('input', () => { if (form.classList.contains('was-validated')) markInvalid(); });
    const busy = (on) => {
      form.classList.toggle('is-sending', on);
      button.disabled = on;
    };
    return { status, markInvalid, busy };
  }

  function initForms() {
    $$('[data-contact-form]').forEach((form) => {
      const { status, markInvalid, busy } = formBasics(form);
      const address = form.dataset.mailto;
      const mailtoFor = (f) => mailtoLink(address, `Project inquiry${f.company ? ` — ${f.company}` : ''}`, [
        `Name: ${f.name}`,
        f.company ? `Company: ${f.company}` : null,
        `Email: ${f.email}`,
        f.phone ? `Phone: ${f.phone}` : null,
        f.line ? `Working with us: ${f.line}` : null,
        '',
        f.message,
      ].filter((line) => line !== null).join('\n'));

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (form.classList.contains('is-sending')) return;
        markInvalid();
        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          status.textContent = 'Add your name, a valid email address and a short message.';
          form.querySelector(':invalid')?.focus();
          return;
        }
        form.classList.remove('was-validated');
        const data = new FormData(form);
        const fields = Object.fromEntries(
          ['name', 'company', 'email', 'phone', 'line', 'message', 'website'].map((k) => [k, String(data.get(k) || '').trim()]),
        );
        fields.turnstile = turnstileToken(form);

        busy(true);
        status.textContent = 'Sending your message…';
        let outcome = 'unreachable';
        try {
          const res = await fetch(form.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(fields),
          });
          if (res.ok) outcome = 'sent';
          else if (res.status === 400) outcome = 'invalid';
          else if (res.status === 429) outcome = 'busy';
          else if (res.status === 403 && (await res.json().catch(() => ({}))).error === 'CHALLENGE_FAILED') outcome = 'check';
        } catch {
          // Offline, or no endpoint on this host: offer email instead.
        }
        busy(false);
        resetTurnstile(form);

        if (outcome === 'sent') {
          form.reset();
          status.textContent = 'Thank you. Your message is with our team, and we’ll be in touch soon. We’ve emailed you a confirmation.';
          track('generate_lead', { form: form.dataset.where || 'contact' });
        } else if (outcome === 'invalid') {
          status.textContent = 'Please check your name, email address and message, then try again.';
        } else if (outcome === 'check') {
          status.textContent = 'We couldn’t confirm you’re not a robot. Please try again.';
        } else {
          const why = outcome === 'busy' ? 'We’ve had several messages from you in a short time.' : 'We couldn’t send your message just now.';
          status.innerHTML = `${why} <a href="${mailtoFor(fields)}">Email it to ${address} instead</a>; it’s written and ready to send.`;
        }
      });
    });

    // Careers: an application with a résumé attached.
    const MAX_RESUME = 5 * 1024 * 1024;
    const RESUME_TYPES = /\.(pdf|docx?)$/i;
    $$('[data-apply-form]').forEach((form) => {
      const { status, markInvalid, busy } = formBasics(form);
      const address = form.dataset.mailto;
      const file = $('input[type="file"]', form);
      const checkFile = () => {
        const f = file.files[0];
        let problem = '';
        if (f && !RESUME_TYPES.test(f.name)) problem = 'Please attach your résumé as a PDF or Word file.';
        else if (f && f.size > MAX_RESUME) problem = 'Please attach a résumé smaller than 5 MB.';
        file.setCustomValidity(problem);
        return problem;
      };
      file.addEventListener('change', () => { checkFile(); if (form.classList.contains('was-validated')) markInvalid(); });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (form.classList.contains('is-sending')) return;
        const fileProblem = checkFile();
        markInvalid();
        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          status.textContent = fileProblem || 'Add your name, a valid email address, your discipline and your résumé.';
          form.querySelector(':invalid')?.focus();
          return;
        }
        form.classList.remove('was-validated');
        const data = new FormData(form);
        data.set('turnstile', turnstileToken(form));
        data.delete('cf-turnstile-response');

        busy(true);
        status.textContent = 'Sending your application…';
        let outcome = 'unreachable';
        try {
          const res = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
          if (res.ok) outcome = 'sent';
          else if (res.status === 400) outcome = 'invalid';
          else if (res.status === 413) outcome = 'large';
          else if (res.status === 429) outcome = 'busy';
          else if (res.status === 403 && (await res.json().catch(() => ({}))).error === 'CHALLENGE_FAILED') outcome = 'check';
        } catch {
          // Offline, or no endpoint on this host.
        }
        busy(false);
        resetTurnstile(form);

        if (outcome === 'sent') {
          form.reset();
          status.textContent = 'Thank you. Your application is with our hiring team, and we’ve emailed you a confirmation.';
          track('application_submit', { discipline: String(data.get('discipline') || '') });
        } else if (outcome === 'invalid') {
          status.textContent = 'Please check your details and résumé, then try again.';
        } else if (outcome === 'large') {
          status.textContent = 'That résumé is too large to send. Please attach one smaller than 5 MB.';
        } else if (outcome === 'check') {
          status.textContent = 'We couldn’t confirm you’re not a robot. Please try again.';
        } else {
          const why = outcome === 'busy' ? 'We’ve had several applications from you in a short time.' : 'We couldn’t send your application just now.';
          const body = `Name: ${data.get('name')}\nPhone: ${data.get('phone') || ''}\nDiscipline: ${data.get('discipline')}\nLinkedIn: ${data.get('linkedin') || ''}\n\n${data.get('message') || ''}\n\n(Please attach your résumé.)`;
          status.innerHTML = `${why} <a href="${mailtoLink(address, `Application: ${data.get('discipline')}`, body)}">Email it to ${address} instead</a>, and attach your résumé.`;
        }
      });
    });
  }

  /* ---------- Boot ---------- */
  // Each part starts on its own, so one failure can't stop the rest.
  const boot = (fn) => { try { fn(); } catch (err) { console.error(err); } };
  window.CRONUS_READY = true;
  [initDates, initAnalytics, initHeader, initReveal, initMenu, initProfile, initModal, initRouteArt,
    initProjects, initMap, initToc, initTables, initTurnstile, initForms].forEach(boot);
})();

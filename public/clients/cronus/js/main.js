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

  // Shared between the depth gauge and the marine-snow canvas.
  const depthState = { progress: 0 };

  /* ---------- Dates & derived numbers ---------- */
  function initDates() {
    const now = new Date();
    let years = now.getFullYear() - FOUNDED.getFullYear();
    if (now.getMonth() < FOUNDED.getMonth()) years -= 1;
    const days = Math.floor((now - FOUNDED) / 864e5);

    $$('[data-years]').forEach((el) => { el.textContent = years; });
    $$('[data-years-count]').forEach((el) => { el.dataset.count = years; el.textContent = years; });
    $$('[data-year]').forEach((el) => { el.textContent = now.getFullYear(); });
    $$('[data-days]').forEach((el) => { el.dataset.count = days; el.textContent = fmt.format(days); });
  }

  /* ---------- Header, progress bar, active nav ---------- */
  function initHeader() {
    const header = $('[data-header]');
    const bar = $('.scroll-progress span');
    let queued = false;

    const update = () => {
      queued = false;
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      const max = root.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
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

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const els = $$('[data-reveal]');
    const perParent = new Map();
    els.forEach((el) => {
      const i = perParent.get(el.parentElement) || 0;
      perParent.set(el.parentElement, i + 1);
      el.style.setProperty('--d', Math.min(i, 8) * 70);
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Headline word split ---------- */
  function initSplit() {
    $$('[data-split]').forEach((el) => {
      let i = 0;
      const wrapWords = (text, extraClass) => {
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(' '); return; }
          const word = document.createElement('span');
          word.className = 'word';
          word.setAttribute('aria-hidden', 'true');
          const inner = document.createElement('span');
          inner.className = extraClass ? `word-inner ${extraClass}` : 'word-inner';
          inner.style.setProperty('--i', i++);
          inner.textContent = part;
          word.append(inner);
          frag.append(word);
        });
        return frag;
      };

      el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
      [...el.childNodes].forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) node.replaceWith(wrapWords(node.textContent));
        else if (node.nodeType === Node.ELEMENT_NODE) node.replaceWith(wrapWords(node.textContent, node.className));
      });
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-split')));
    });
    const hero = $('.hero');
    requestAnimationFrame(() => requestAnimationFrame(() => hero?.classList.add('is-ready')));
  }

  /* ---------- Hero flowline canvas ---------- */
  function initHeroCanvas() {
    const canvas = $('.hero-canvas');
    if (!canvas) return;
    const hero = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const t0 = performance.now();
    let w = 0;
    let h = 0;
    let lines = [];
    let particles = [];
    let raf = 0;
    let running = false;
    let inView = true;

    const sprite = (() => {
      const s = document.createElement('canvas');
      s.width = s.height = 64;
      const c = s.getContext('2d');
      const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.14, 'rgba(160,228,255,0.95)');
      g.addColorStop(0.4, 'rgba(56,160,255,0.28)');
      g.addColorStop(1, 'rgba(56,160,255,0)');
      c.fillStyle = g;
      c.fillRect(0, 0, 64, 64);
      return s;
    })();

    const spawn = (s = 0) => ({
      line: (Math.random() * lines.length) | 0,
      s,
      v: 0.0011 + Math.random() * 0.0016,
      size: 12 + Math.random() * 16,
    });

    function layout() {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = Math.round(clamp(w / 80, 9, 20));
      lines = Array.from({ length: n }, (_, i) => ({
        k: i / (n - 1),
        amp: 16 + Math.random() * 34,
        speed: 0.00016 + Math.random() * 0.00024,
        phase: Math.random() * Math.PI * 2,
      }));
      particles = Array.from({ length: Math.round(n * 2.4) }, () => spawn(Math.random() * 1.3));
    }

    const hub = () => {
      const mobile = w < 760;
      const bx = mobile ? 0.8 : 0.74;
      const by = mobile ? 0.84 : 0.56;
      return {
        x: w * (bx + (pointer.x - 0.5) * 0.05),
        y: h * (by + (pointer.y - 0.5) * 0.06),
      };
    };

    const cubic = (a, b, c, d, t) => {
      const u = 1 - t;
      return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
    };

    const geometry = (L, time, C) => {
      const y0 = lerp(-h * 0.18, h * 1.18, L.k);
      const wob = Math.sin(time * L.speed + L.phase) * L.amp;
      const wob2 = Math.cos(time * L.speed * 1.3 + L.phase) * L.amp * 0.55;
      return {
        x: [-40, w * 0.3, w * 0.52, C.x],
        y: [y0, y0 + wob, lerp(y0, C.y, 0.7) + wob2, C.y],
      };
    };

    const EXPORT = 0.3; // portion of a particle's life spent on the export line

    const pointAt = (g, s, C) => {
      if (s <= 1) return { x: cubic(...g.x, s), y: cubic(...g.y, s) };
      return { x: lerp(C.x, w + 40, (s - 1) / EXPORT), y: C.y };
    };

    function draw(now) {
      const time = now - t0;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      const C = hub();
      const geoms = lines.map((L) => geometry(L, time, C));

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);

      // flowlines
      ctx.lineWidth = 1;
      geoms.forEach((g, i) => {
        const alpha = 0.06 + 0.12 * Math.sin(lines[i].k * Math.PI);
        ctx.strokeStyle = `rgba(90,165,255,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(g.x[0], g.y[0]);
        ctx.bezierCurveTo(g.x[1], g.y[1], g.x[2], g.y[2], g.x[3], g.y[3]);
        ctx.stroke();
      });

      // export line
      const grad = ctx.createLinearGradient(C.x, 0, w, 0);
      grad.addColorStop(0, 'rgba(130,205,255,0.75)');
      grad.addColorStop(1, 'rgba(130,205,255,0.04)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(C.x, C.y);
      ctx.lineTo(w + 40, C.y);
      ctx.stroke();

      // particles with short trails
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        if (running) p.s += p.v * (p.s > 1 ? 1.7 : 1);
        if (p.s > 1 + EXPORT) { p = particles[i] = spawn(0); }
        const g = geoms[p.line];
        const life = Math.min(1, p.s * 8) * (p.s > 1 + EXPORT * 0.6 ? (1 + EXPORT - p.s) / (EXPORT * 0.4) : 1);
        for (let k = 3; k >= 0; k--) {
          const s = p.s - k * p.v * 7;
          if (s < 0) continue;
          const pt = pointAt(g, s, C);
          const size = p.size * (1 - k * 0.2);
          ctx.globalAlpha = life * (1 - k * 0.24);
          ctx.drawImage(sprite, pt.x - size / 2, pt.y - size / 2, size, size);
        }
      }
      ctx.globalAlpha = 1;

      // hub pulse
      const pulse = (time % 2600) / 2600;
      ctx.strokeStyle = `rgba(130,215,255,${(0.55 * (1 - pulse)).toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(C.x, C.y, 10 + pulse * 42, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#eaf7ff';
      ctx.beginPath();
      ctx.arc(C.x, C.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(130,215,255,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(C.x, C.y, 11, 0, Math.PI * 2);
      ctx.stroke();

      if (running) raf = requestAnimationFrame(draw);
    }

    const start = () => {
      if (running || reducedMotion() || !inView || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    layout();
    draw(performance.now());

    new ResizeObserver(() => {
      layout();
      if (!running) draw(performance.now());
    }).observe(hero);
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start(); else stop();
    }).observe(hero);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    motionQuery.addEventListener('change', () => (reducedMotion() ? stop() : start()));
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      pointer.tx = (e.clientX - rect.left) / rect.width;
      pointer.ty = (e.clientY - rect.top) / rect.height;
    });
    start();
  }

  /* ---------- Count-up numbers ---------- */
  function initCounters() {
    const els = $$('[data-count]');
    const run = (el) => {
      const target = Number(el.dataset.count);
      if (reducedMotion() || !target) { el.textContent = fmt.format(target); return; }
      const duration = 1500 + Math.min(target, 9000) / 9000 * 700;
      const start = performance.now();
      const step = (now) => {
        const p = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = fmt.format(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    els.forEach((el) => {
      if (!reducedMotion()) el.textContent = '0';
      io.observe(el);
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
      depthState.progress = current;
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

    // Light rays start where the water does: at the shallow-water panel.
    const shallow = panels.find((p) => p.dataset.segment === 'shallow');
    const placeRays = () => {
      if (!shallow) return;
      const top = shallow.getBoundingClientRect().top - section.getBoundingClientRect().top;
      section.style.setProperty('--rays-top', `${Math.round(top)}px`);
    };

    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', () => { measure(); placeRays(); });
    document.fonts?.ready.then(placeRays);
    measure();
    placeRays();
  }

  /* ---------- Segments: marine snow ---------- */
  function initSnow() {
    const canvas = $('.segments-snow');
    const section = $('#segments');
    if (!canvas || !section || reducedMotion()) return;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let flakes = [];
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      flakes = Array.from({ length: Math.round(clamp(w / 16, 30, 110)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.6,
        vy: 0.12 + Math.random() * 0.35,
        sway: Math.random() * Math.PI * 2,
        a: 0.25 + Math.random() * 0.6,
      }));
    };

    const frame = (now) => {
      // fade in from mid-shallow to deep
      const visibility = clamp((depthState.progress - 0.4) / 0.4, 0, 1);
      ctx.clearRect(0, 0, w, h);
      if (visibility > 0) {
        ctx.fillStyle = '#cfe9ff';
        flakes.forEach((f) => {
          f.y += f.vy;
          f.x += Math.sin(now * 0.0006 + f.sway) * 0.15;
          if (f.y > h + 4) { f.y = -4; f.x = Math.random() * w; }
          ctx.globalAlpha = f.a * visibility * 0.5;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener('resize', resize);
    new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(frame);
    }).observe(section);
  }

  /* ---------- Pointer spotlight ---------- */
  function initSpotlight() {
    $$('[data-spotlight]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });
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

  /* ---------- Timeline ---------- */
  function initTimeline() {
    const timeline = $('[data-timeline]');
    if (!timeline) return;
    $$('.timeline-step', timeline).forEach((step, i) => step.style.setProperty('--i', i));
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      timeline.classList.add('is-on');
      io.disconnect();
    }, { threshold: 0.25 });
    io.observe(timeline);
  }

  /* ---------- Marquees ---------- */
  function initMarquees() {
    $$('[data-marquee]').forEach((marquee) => {
      const track = $('.marquee-track', marquee);
      const originals = [...track.children];
      // Three copies; the animation shifts by exactly one copy for a seamless loop.
      for (let copy = 0; copy < 2; copy++) {
        originals.forEach((li) => {
          const clone = li.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          track.append(clone);
        });
      }
      marquee.classList.add('is-ready');
    });
  }

  /* ---------- Projects: filters + generated route art ---------- */
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

  function routeSVG(segment, name, W) {
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
      for (let k = 0; k < 2; k++) {
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
      decor += `<rect class="r-platform" x="${riserX - 14}" y="${water - 10}" width="28" height="6" rx="1.5"/>`;
      start = pts[0];
      end = [riserX, water + 6];
    } else {
      // Deepwater: steel catenary riser from a host down to the seabed.
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
      decor += `<rect class="r-platform" x="${(hostX - 16).toFixed(1)}" y="${water - 8}" width="32" height="8" rx="2"/>`;
      start = [hostX, water + 6];
      end = pts[pts.length - 1];
    }

    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" focusable="false">
      ${decor}
      <path class="r-glow" d="${route}"/>
      <path class="r-line" d="${route}"/>
      <path class="r-flow" d="${route}"/>
      <circle class="r-node" cx="${start[0].toFixed(1)}" cy="${start[1].toFixed(1)}" r="4.5"/>
      <circle class="r-node r-node--end" cx="${end[0].toFixed(1)}" cy="${end[1].toFixed(1)}" r="4.5"/>
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
        if (!width || Number(host.dataset.w) === width) return;
        host.dataset.w = width;
        host.innerHTML = routeSVG(card.dataset.segment, $('h3', card).textContent, width);
      });
    };

    const apply = (filter) => {
      buttons.forEach((b) => {
        const on = b.dataset.filter === filter;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      let i = 0;
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.segment === filter;
        card.hidden = !show;
        card.classList.remove('is-entering');
        if (show) {
          void card.offsetWidth; // restart the entrance animation
          card.style.setProperty('--i', i++);
          card.classList.add('is-entering');
        }
      });
      drawRoutes();
    };

    buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter)));
    $$('[data-filter-link]').forEach((a) => a.addEventListener('click', () => apply(a.dataset.filterLink)));

    new ResizeObserver(drawRoutes).observe(grid);
    drawRoutes();

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      grid.classList.add('is-ready');
      apply($('.filter.is-active')?.dataset.filter || 'all');
      io.disconnect();
    }, { threshold: 0.05 });
    io.observe(grid);
  }

  /* ---------- World map ---------- */
  const PLACES = [
    { id: 'us', name: 'Houston, Texas', note: 'Headquarters', at: [-95.37, 29.76], hq: true },
    { id: 'gom', name: 'Gulf of Mexico', note: 'SPOT · Lucius · Whale · Holstein', at: [-90.2, 26.6] },
    { id: 'mx', name: 'Mexico', note: 'Construction experience', at: [-99.1, 19.4] },
    { id: 'br', name: 'Brazil', note: 'Construction experience', at: [-43.2, -22.9] },
    { id: 'es', name: 'Spain', note: 'Construction experience', at: [-3.7, 40.4] },
    { id: 'eg', name: 'Egypt', note: 'Construction experience', at: [31.2, 30.0] },
    { id: 'il', name: 'Israel', note: 'Leviathan · Noble Energy', at: [34.8, 32.6] },
    { id: 'gq', name: 'Equatorial Guinea', note: 'Alen Gas Monetization · Noble Energy', at: [8.8, 3.7] },
    { id: 'ao', name: 'Angola', note: 'Sanha · Mafumeira Sul · Chevron', at: [12.3, -5.8] },
    { id: 'kr', name: 'South Korea', note: 'Construction experience', at: [128.9, 35.2] },
    { id: 'pg', name: 'Papua New Guinea', note: 'Construction experience', at: [147.2, -9.4] },
  ];

  function initMap() {
    const svg = $('[data-world]');
    const data = window.CRONUS_WORLD;
    if (!svg || !data) return;
    const wrap = svg.parentElement;
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
        const d = `M${hq[0].toFixed(1)} ${hq[1].toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
        arcs += `<path class="arc" pathLength="1" style="--i:${i}" d="${d}"/><path class="arc-flow" style="--i:${i}" d="${d}"/>`;
      }
      pins += `<g class="pin${place.hq ? ' pin--hq' : ''}" data-pin="${place.id}" style="--i:${i}">
        <circle class="pin-hit" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="22"/>
        <circle class="pin-ring" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${place.hq ? 8 : 6}"/>
        <circle class="pin-core" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${place.hq ? 7 : 5.5}"/>
      </g>`;
    });

    svg.insertAdjacentHTML('beforeend', `
      <defs>
        <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#3d9bff"/>
          <stop offset="1" stop-color="#38e1ff"/>
        </linearGradient>
      </defs>
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
        status.textContent = 'Please add your name, a valid email and a short message.';
        form.querySelector(':invalid')?.focus();
        return;
      }
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
      status.textContent = 'Opening your email app… If nothing happens, write to info@cronustec.com.';
    });
  }

  /* ---------- Avatars: subtle per-person gradient ---------- */
  function initAvatars() {
    const palette = [
      ['#2575bb', '#38e1ff'],
      ['#1b4f8a', '#3d9bff'],
      ['#0e3a66', '#2bb5d9'],
      ['#2a5fb0', '#8b9bff'],
      ['#13518f', '#56c7f0'],
    ];
    $$('.avatar').forEach((el, i) => {
      const [a, b] = palette[i % palette.length];
      el.style.setProperty('--a', a);
      el.style.setProperty('--b', b);
    });
  }

  /* ---------- Boot ---------- */
  initDates();
  initHeader();
  initMenu();
  initSplit();
  initReveal();
  initHeroCanvas();
  initCounters();
  initDepth();
  initSnow();
  initSpotlight();
  initModal();
  initTimeline();
  initMarquees();
  initProjects();
  initMap();
  initForm();
  initAvatars();
})();

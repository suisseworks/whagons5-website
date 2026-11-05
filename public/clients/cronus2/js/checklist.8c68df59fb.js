/* ==========================================================================
   Cronus — project checklist (review copy only)
   Marks overdue items, and loads and posts comments once the visitor enters
   the access code. Comments live on the server (GitHub issues, one per item);
   this page only reads and adds them. Everything is built with textContent, so
   comment text can never become markup.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const root = $('[data-checklist]');
  if (!root) return;
  const endpoint = root.dataset.endpoint;
  const CODE_KEY = 'cronus-checklist-code';
  const NAME_KEY = 'cronus-checklist-name';

  // Browser storage can be missing or blocked (private windows). Values are kept
  // in memory too, so the page still works for this visit without it.
  const memory = {};
  const store = {
    get(k) { try { return localStorage.getItem(k) || memory[k] || ''; } catch { return memory[k] || ''; } },
    set(k, v) { memory[k] = v; try { localStorage.setItem(k, v); } catch { /* kept in memory only */ } },
    del(k) { delete memory[k]; try { localStorage.removeItem(k); } catch { /* nothing to clear */ } },
  };

  const el = (tag, props = {}, ...kids) => {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k in node) node[k] = v;
      else node.setAttribute(k, v);
    });
    kids.flat().forEach((kid) => kid && node.append(kid));
    return node;
  };

  const when = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  /* ---------- Overdue items ---------- */
  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();
  $$('.cl-item[data-due]').forEach((item) => {
    if (item.dataset.status !== 'done' && item.dataset.due < today) {
      item.classList.add('cl-item--overdue');
      $('[data-status-label]', item).after(el('span', { class: 'cl-status cl-status--overdue', text: 'Overdue' }));
    }
  });

  /* ---------- Comments ---------- */
  const access = $('[data-cl-access]');
  const accessStatus = $('[data-cl-access-status]');
  const signedIn = $('[data-cl-signed-in]');
  const signedInStatus = $('[data-cl-signed-in-status]');
  const recent = $('[data-cl-recent]');
  const recentList = $('[data-cl-recent-list]');
  const items = new Map($$('.cl-item').map((li) => [li.dataset.item, li]));
  const titleOf = (id) => $('.cl-title', items.get(id))?.textContent || id;
  let comments = {};

  const request = (method, body) => fetch(endpoint, {
    method,
    headers: { Accept: 'application/json', 'X-Checklist-Code': store.get(CODE_KEY), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });

  function showSignedOut(message) {
    signedIn.hidden = true;
    recent.hidden = true;
    access.hidden = false;
    items.forEach((li) => { const t = $('[data-thread]', li); t.hidden = true; t.replaceChildren(); });
    if (message) accessStatus.textContent = message;
  }

  function renderRecent() {
    const all = Object.entries(comments).flatMap(([id, list]) => list.map((c) => ({ ...c, item: id })));
    all.sort((a, b) => String(b.at).localeCompare(String(a.at)));
    const total = all.length;
    signedInStatus.textContent = total ? `${total} comment${total === 1 ? '' : 's'} so far.` : 'No comments yet. Open any item below to add one.';
    recentList.replaceChildren(...all.slice(0, 5).map((c) => el('li', {},
      el('p', { class: 'cl-comment-meta' }, el('strong', { text: c.author }), ` on `, el('a', { href: `#item-${c.item}`, text: titleOf(c.item) }), ` · ${when(c.at)}`),
      el('p', { class: 'cl-recent-body', text: c.body.length > 160 ? `${c.body.slice(0, 157)}…` : c.body }))));
    recent.hidden = !total;
  }

  function renderThread(id) {
    const li = items.get(id);
    const thread = $('[data-thread]', li);
    const wasOpen = $('details', thread)?.open;
    const list = comments[id] || [];
    const summary = el('summary', { text: list.length ? `Comments (${list.length})` : 'Add a comment' });
    const ol = el('ol', { class: 'cl-comment-list' }, list.map((c) => el('li', {},
      el('p', { class: 'cl-comment-meta' }, el('strong', { text: c.author }), ` · ${when(c.at)}`),
      el('p', { class: 'cl-comment-body', text: c.body }))));

    const status = el('p', { class: 'form-status', role: 'status', 'aria-live': 'polite' });
    const name = el('input', { type: 'text', name: 'name', autocomplete: 'name', maxLength: 80, required: true, value: store.get(NAME_KEY) });
    const body = el('textarea', { name: 'body', rows: 3, maxLength: 4000, required: true });
    const button = el('button', { class: 'btn btn-primary btn-sm', type: 'submit', text: 'Post comment' });
    const form = el('form', { class: 'cl-comment-form', noValidate: true },
      el('label', { class: 'field' }, el('span', { text: 'Your name' }), name),
      el('label', { class: 'field' }, el('span', { text: 'Comment' }), body),
      el('div', { class: 'hp', 'aria-hidden': 'true' }, el('label', {}, 'Leave this field empty ', el('input', { type: 'text', name: 'website', tabIndex: -1, autocomplete: 'off' }))),
      el('div', { class: 'form-foot' }, button, status));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (button.disabled) return;
      if (!name.value.trim() || !body.value.trim()) {
        status.textContent = 'Add your name and a comment.';
        (name.value.trim() ? body : name).focus();
        return;
      }
      button.disabled = true;
      status.textContent = 'Posting…';
      try {
        const res = await request('POST', { item: id, name: name.value.trim(), body: body.value.trim(), website: $('[name="website"]', form).value });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.comment) {
          store.set(NAME_KEY, name.value.trim());
          comments[id] = [...(comments[id] || []), json.comment];
          renderThread(id);
          renderRecent();
          $('[role="status"]', items.get(id)).textContent = 'Posted.';
          return;
        }
        if (res.status === 401) { store.del(CODE_KEY); showSignedOut('That access code no longer works. Enter the current one.'); return; }
        status.textContent = res.status === 429 ? 'Too many comments in a short time. Try again in a few minutes.'
          : res.status === 400 ? 'Comments can be up to 4,000 characters, with a name up to 80.'
            : 'We couldn’t post that just now. Try again, or email Matthias.';
      } catch {
        status.textContent = 'We couldn’t reach the server. Check your connection and try again.';
      }
      button.disabled = false;
    });

    const details = el('details', { class: 'cl-comments' }, summary, list.length ? ol : null, form);
    details.open = Boolean(wasOpen) || location.hash === `#item-${id}`;
    thread.replaceChildren(details);
    thread.hidden = false;
  }

  async function load() {
    accessStatus.textContent = 'Loading comments…';
    let res;
    try {
      res = await request('GET');
    } catch {
      showSignedOut('We couldn’t reach the server. Check your connection and try again.');
      return;
    }
    const json = await res.json().catch(() => ({}));
    if (res.status === 401) { store.del(CODE_KEY); showSignedOut('That code didn’t work. Check it and try again.'); return; }
    if (!res.ok) {
      showSignedOut(json.error === 'NOT_CONFIGURED' ? 'Comments aren’t switched on yet.' : 'Comments couldn’t load just now. Try again in a minute.');
      return;
    }
    comments = json.items || {};
    access.hidden = true;
    signedIn.hidden = false;
    items.forEach((_, id) => renderThread(id));
    renderRecent();
    const target = location.hash && $(location.hash);
    if (target) target.scrollIntoView();
  }

  access.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = access.elements.code.value.trim();
    if (!code) { accessStatus.textContent = 'Enter the access code.'; access.elements.code.focus(); return; }
    store.set(CODE_KEY, code);
    access.elements.code.value = '';
    load();
  });
  $('[data-cl-forget]').addEventListener('click', () => {
    store.del(CODE_KEY);
    comments = {};
    showSignedOut('Code forgotten on this browser.');
  });

  if (store.get(CODE_KEY)) load();
})();

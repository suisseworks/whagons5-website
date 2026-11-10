// Whagons Chat — the team inbox. Plain JS, no build step.
// Talks to the hub over one WebSocket (/api/a/ws); see chat/src/hub.ts for frames.

const $ = (id) => document.getElementById(id);

const state = {
  me: null,
  conversations: new Map(),
  messages: new Map(),     // conversation id → Message[] (only for opened conversations)
  openId: null,
  filter: 'open',
  socket: null,
  retry: 0,
  reconnectTimer: null,
  outbox: [],
  pushOn: false,
  lastTypingSent: 0,
  typingTimer: null,
  sound: readSetting('wc-sound', '1') === '1',
  audio: null,
};

const isTouch = matchMedia('(pointer: coarse)').matches;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const pushSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

function readSetting(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function writeSetting(key, value) {
  try { localStorage.setItem(key, value); } catch { /* private mode */ }
}

async function api(method, path, body) {
  return fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'content-type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
}

function toast(text, ms = 3200) {
  const el = $('toast');
  el.textContent = text;
  el.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { el.hidden = true; }, ms);
}

function show(screen) {
  for (const id of ['signin', 'naming', 'app']) $(id).hidden = id !== screen;
}

// ── Boot ────────────────────────────────────────────────────────────────────

boot();

async function boot() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  const params = new URLSearchParams(location.search);
  if (params.get('signin') === 'expired') {
    history.replaceState(null, '', location.pathname + location.hash);
    showSignin('That sign-in link has expired or was already used. Ask for a new code.');
    return;
  }
  let response;
  try {
    response = await api('GET', '/api/a/me');
  } catch {
    showSignin('Can’t reach the server. Check your connection and reload.');
    return;
  }
  if (!response.ok) return showSignin();
  const { me } = await response.json();
  state.me = me;
  if (!me.name) return showNaming();
  startInbox();
}

// ── Sign in ─────────────────────────────────────────────────────────────────

function showSignin(error = '') {
  if (state.socket) {
    state.socket.onclose = null;
    state.socket.close();
    state.socket = null;
  }
  show('signin');
  $('email-form').hidden = false;
  $('code-form').hidden = true;
  $('signin-error').textContent = error;
  $('email').value = readSetting('wc-email', '');
  setTimeout(() => $('email').focus(), 50);
}

$('email-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = $('email').value.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    $('signin-error').textContent = 'Enter your work email.';
    return;
  }
  const button = event.submitter || $('email-form').querySelector('button');
  button.disabled = true;
  $('signin-error').textContent = '';
  try {
    const response = await api('POST', '/api/a/login', { email });
    if (response.status === 429) {
      $('signin-error').textContent = 'Too many attempts. Try again in a few minutes.';
      return;
    }
    writeSetting('wc-email', email);
    $('email-form').hidden = true;
    $('code-form').hidden = false;
    $('code-sent').textContent = `If ${email} is on the team, a code is on its way. It expires in 15 minutes.`;
    $('code').value = '';
    $('code').focus();
  } catch {
    $('signin-error').textContent = 'Can’t reach the server. Try again.';
  } finally {
    button.disabled = false;
  }
});

$('code').addEventListener('input', () => {
  const digits = $('code').value.replace(/\D/g, '').slice(0, 6);
  $('code').value = digits;
  if (digits.length === 6) $('code-form').requestSubmit();
});

$('code-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const code = $('code').value.replace(/\D/g, '');
  if (code.length !== 6) return;
  const email = readSetting('wc-email', $('email').value.trim().toLowerCase());
  $('signin-error').textContent = '';
  try {
    const response = await api('POST', '/api/a/verify', { email, code });
    if (!response.ok) {
      const { error } = await response.json().catch(() => ({}));
      $('signin-error').textContent = error === 'wrong_code'
        ? 'That code isn’t right. Use the one in the latest email.'
        : 'This code has expired. Ask for a new one.';
      $('code').select();
      return;
    }
    const { me } = await response.json();
    state.me = me;
    if (!me.name) showNaming();
    else startInbox();
  } catch {
    $('signin-error').textContent = 'Can’t reach the server. Try again.';
  }
});

$('code-back').addEventListener('click', () => showSignin());

// ── First name ──────────────────────────────────────────────────────────────

function showNaming() {
  show('naming');
  setTimeout(() => $('name-first').focus(), 50);
}

$('name-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = $('name-first').value.trim();
  if (!name) {
    $('name-error').textContent = 'Enter the name visitors should see.';
    return;
  }
  const response = await api('POST', '/api/a/me', { name });
  if (!response.ok) {
    $('name-error').textContent = 'Couldn’t save that. Try again.';
    return;
  }
  state.me = (await response.json()).me;
  startInbox();
});

// ── Inbox ───────────────────────────────────────────────────────────────────

function startInbox() {
  show('app');
  connect();
  refreshPush();
  setInterval(renderList, 30_000);
}

function connect() {
  clearTimeout(state.reconnectTimer);
  if (state.socket && state.socket.readyState <= 1) return;
  const ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/api/a/ws`);
  state.socket = ws;
  let ping;
  ws.onopen = () => {
    state.retry = 0;
    setConnected(true);
    sendNow({ type: 'visible', visible: !document.hidden });
    for (const frame of state.outbox.splice(0)) sendNow(frame);
    ping = setInterval(() => ws.readyState === 1 && ws.send('ping'), 25_000);
  };
  ws.onmessage = (event) => {
    if (event.data === 'pong') return;
    try {
      handle(JSON.parse(event.data));
    } catch (error) {
      console.error(error);
    }
  };
  ws.onclose = (event) => {
    clearInterval(ping);
    setConnected(false);
    if (state.socket !== ws) return;
    state.socket = null;
    if (event.code === 4401) return showSignin('You were signed out. Sign in again.');
    const delay = Math.min(30_000, 1000 * 2 ** state.retry) + Math.random() * 500;
    state.retry += 1;
    state.reconnectTimer = setTimeout(connect, delay);
  };
}

function setConnected(on) {
  $('conn').classList.toggle('on', on);
  $('conn').title = on ? 'Connected' : 'Reconnecting…';
}

function sendNow(frame) {
  state.socket?.send(JSON.stringify(frame));
}

/** Sends now, or once the connection is back. */
function send(frame) {
  if (state.socket?.readyState === 1) sendNow(frame);
  else {
    state.outbox.push(frame);
    connect();
  }
}

addEventListener('online', () => connect());
document.addEventListener('visibilitychange', () => {
  if (!state.me) return;
  if (!document.hidden) {
    connect();
    if (state.openId) send({ type: 'read', conversationId: state.openId });
  }
  if (state.socket?.readyState === 1) sendNow({ type: 'visible', visible: !document.hidden });
});

navigator.serviceWorker?.addEventListener('message', (event) => {
  if (event.data?.type !== 'open') return;
  const id = new URL(event.data.url).hash.match(/c=([\w-]+)/)?.[1];
  if (id) openConversation(id);
});

function handle(frame) {
  switch (frame.type) {
    case 'init': {
      state.me = frame.me;
      state.conversations = new Map(frame.conversations.map((c) => [c.id, c]));
      renderList();
      const fromHash = location.hash.match(/c=([\w-]+)/)?.[1];
      const target = state.openId || fromHash;
      if (target && state.conversations.has(target)) openConversation(target);
      else if (state.openId) closeConversation();
      break;
    }
    case 'conversation': {
      const isNew = !state.conversations.has(frame.conversation.id);
      state.conversations.set(frame.conversation.id, frame.conversation);
      renderList();
      if (frame.conversation.id === state.openId) renderThreadHeader();
      if (isNew) chime();
      break;
    }
    case 'removed':
      state.conversations.delete(frame.conversationId);
      state.messages.delete(frame.conversationId);
      if (state.openId === frame.conversationId) closeConversation();
      renderList();
      break;
    case 'history':
      state.messages.set(frame.conversationId, frame.messages);
      if (frame.conversationId === state.openId) renderMessages(true);
      break;
    case 'message': {
      const list = state.messages.get(frame.conversationId);
      if (list) {
        const pending = frame.message.clientId && list.findIndex((m) => m.clientId === frame.message.clientId && m.pending);
        if (pending != null && pending >= 0) list[pending] = frame.message;
        else if (!list.some((m) => m.id === frame.message.id)) list.push(frame.message);
      }
      if (frame.conversationId === state.openId) {
        if (frame.message.from === 'visitor') {
          $('typing').hidden = true;
          if (!document.hidden) send({ type: 'read', conversationId: state.openId });
        }
        renderMessages(false);
      }
      if (frame.message.from === 'visitor' && state.conversations.has(frame.conversationId)) chime();
      break;
    }
    case 'typing':
      if (frame.conversationId === state.openId) {
        $('typing').hidden = false;
        clearTimeout(state.typingTimer);
        state.typingTimer = setTimeout(() => { $('typing').hidden = true; }, 4000);
      }
      break;
    case 'error':
      toast(frame.error === 'invalid' ? 'That message couldn’t be sent.' : 'Something went wrong.');
      break;
  }
}

// ── Conversation list ───────────────────────────────────────────────────────

const regionNames = (() => {
  try { return new Intl.DisplayNames([navigator.language || 'en'], { type: 'region' }); } catch { return null; }
})();

function countryName(code) {
  if (!code) return '';
  try { return regionNames?.of(code) || code; } catch { return code; }
}

function label(conv) {
  if (conv.name) return conv.name;
  if (conv.email) return conv.email;
  return conv.country ? `Visitor from ${countryName(conv.country)}` : 'Visitor';
}

function ago(at) {
  const minutes = Math.floor((Date.now() - at) / 60_000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return new Date(at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

function sortedConversations() {
  return [...state.conversations.values()]
    .filter((c) => c.status === state.filter)
    .sort((a, b) => {
      // Visitors waiting for an answer first, longest wait at the top.
      const aw = a.status === 'open' && a.waitingSince ? a.waitingSince : null;
      const bw = b.status === 'open' && b.waitingSince ? b.waitingSince : null;
      if (aw && bw) return aw - bw;
      if (aw) return -1;
      if (bw) return 1;
      return b.updatedAt - a.updatedAt;
    });
}

function renderList() {
  const list = $('convs');
  const items = sortedConversations();
  list.replaceChildren(...items.map((conv) => {
    const waiting = conv.status === 'open' && conv.waitingSince;
    const preview = conv.last
      ? `${conv.last.from === 'agent' ? 'Team: ' : ''}${conv.last.text.replace(/\s+/g, ' ')}`
      : '';
    const claimed = conv.claimedBy
      ? (conv.claimedBy === state.me?.email ? 'Yours' : conv.claimedName || conv.claimedBy)
      : null;
    return el('li', {},
      el('button', {
        class: `conv${conv.unread ? ' unread' : ''}`,
        'aria-current': conv.id === state.openId ? 'true' : null,
        onclick: () => openConversation(conv.id),
      },
      el('span', { class: 'name' }, conv.visitorOnline ? el('span', { class: 'dot', title: 'On the page now' }) : null, label(conv)),
      el('span', { class: 'time' }, conv.last ? ago(conv.last.at) : ''),
      el('span', { class: 'preview' }, preview),
      conv.unread ? el('span', { class: 'badge' }, conv.unread) : el('span'),
      el('span', { class: 'tags' },
        waiting ? el('span', { class: 'tag waiting' }, `Waiting ${ago(conv.waitingSince)}`) : null,
        claimed ? el('span', { class: 'tag' }, claimed) : null,
        conv.lang ? el('span', { class: 'tag' }, conv.lang.toUpperCase()) : null,
        conv.page ? el('span', { class: 'tag' }, conv.page) : null,
      )),
    );
  }));
  $('convs-empty').hidden = items.length > 0;
  if (state.filter === 'closed') $('convs-empty').textContent = 'No closed chats.';
  else $('convs-empty').textContent = 'No chats yet. When someone writes on whagons.com, it shows up here.';

  const open = [...state.conversations.values()].filter((c) => c.status === 'open');
  const waiting = open.filter((c) => c.waitingSince).length;
  $('count-open').textContent = open.length ? `(${open.length})` : '';
  const unread = [...state.conversations.values()].reduce((sum, c) => sum + (c.unread || 0), 0);
  document.title = unread ? `(${unread}) Whagons Chat` : waiting ? `(${waiting}) Whagons Chat` : 'Whagons Chat';
  if ('setAppBadge' in navigator) {
    (unread ? navigator.setAppBadge(unread) : navigator.clearAppBadge()).catch(() => {});
  }
}

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => {
    state.filter = tab.dataset.filter;
    for (const other of document.querySelectorAll('.tab')) other.setAttribute('aria-selected', String(other === tab));
    renderList();
  });
}

// ── One conversation ────────────────────────────────────────────────────────

function openConversation(id) {
  if (!state.conversations.has(id)) return;
  const conv = state.conversations.get(id);
  if (conv.status !== state.filter) {
    state.filter = conv.status;
    for (const tab of document.querySelectorAll('.tab')) tab.setAttribute('aria-selected', String(tab.dataset.filter === state.filter));
  }
  const switched = state.openId !== id;
  state.openId = id;
  history.replaceState(null, '', `#c=${id}`);
  $('app').classList.add('viewing');
  $('placeholder').hidden = true;
  $('thread-body').hidden = false;
  if (switched) {
    $('typing').hidden = true;
    $('reply').value = readSetting(`wc-draft-${id}`, '');
    autosize();
  }
  renderList();
  renderThreadHeader();
  renderMessages(true);
  send({ type: 'open', conversationId: id });
  if (!isTouch && switched) $('reply').focus();
}

function closeConversation() {
  state.openId = null;
  history.replaceState(null, '', location.pathname);
  $('app').classList.remove('viewing');
  $('placeholder').hidden = false;
  $('thread-body').hidden = true;
  renderList();
}

$('back-btn').addEventListener('click', closeConversation);

function renderThreadHeader() {
  const conv = state.conversations.get(state.openId);
  if (!conv) return;
  $('t-name').textContent = label(conv);
  const place = [conv.city, countryName(conv.country)].filter(Boolean).join(', ');
  $('t-meta').textContent = [conv.name && conv.email ? conv.email : null, place, conv.page, conv.lang?.toUpperCase()]
    .filter(Boolean).join(' · ');

  const claim = $('t-claim');
  if (!conv.claimedBy) {
    claim.textContent = 'Take';
    claim.className = 'chip primary';
    claim.onclick = () => send({ type: 'claim', conversationId: conv.id });
  } else if (conv.claimedBy === state.me.email) {
    claim.textContent = 'Release';
    claim.className = 'chip';
    claim.onclick = () => send({ type: 'release', conversationId: conv.id });
  } else {
    claim.textContent = `${conv.claimedName || conv.claimedBy} has it · Take over`;
    claim.className = 'chip';
    claim.onclick = () => send({ type: 'claim', conversationId: conv.id });
  }
  const close = $('t-close');
  close.textContent = conv.status === 'open' ? 'Close' : 'Reopen';
  close.onclick = () => send({ type: conv.status === 'open' ? 'close' : 'reopen', conversationId: conv.id });

  $('t-hint').textContent = conv.visitorOnline
    ? ''
    : conv.email
      ? `Left the page. Replies are emailed to ${conv.email} after a minute.`
      : 'Left the page. They’ll see your reply if they come back to whagons.com.';
}

function linkify(text) {
  const parts = [];
  const pattern = /\bhttps?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)\]]/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    parts.push(text.slice(last, match.index));
    parts.push(el('a', { href: match[0], target: '_blank', rel: 'noopener noreferrer' }, match[0]));
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));
  return parts;
}

function renderMessages(jump) {
  const box = $('messages');
  const messages = state.messages.get(state.openId);
  if (!messages) {
    box.replaceChildren(el('li', { class: 'day' }, 'Loading…'));
    return;
  }
  const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 120;
  const nodes = [];
  let lastDay = '';
  for (const m of messages) {
    const day = new Date(m.at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    if (day !== lastDay) {
      nodes.push(el('li', { class: 'day' }, day));
      lastDay = day;
    }
    const time = new Date(m.at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    nodes.push(el('li', { class: `msg ${m.from}${m.pending ? ' pending' : ''}` },
      el('div', { class: 'bubble' }, linkify(m.text)),
      el('span', { class: 'meta' }, m.pending ? 'Sending…' : m.from === 'agent' ? `${m.name || 'Whagons'} · ${time}` : time),
    ));
  }
  box.replaceChildren(...nodes);
  if (jump || nearBottom) box.scrollTop = box.scrollHeight;
}

function autosize() {
  const area = $('reply');
  area.style.height = 'auto';
  area.style.height = `${Math.min(area.scrollHeight + 2, innerHeight * 0.4)}px`;
}

$('reply').addEventListener('input', () => {
  autosize();
  if (state.openId) writeSetting(`wc-draft-${state.openId}`, $('reply').value);
  const now = Date.now();
  if (state.openId && $('reply').value && now - state.lastTypingSent > 3000) {
    state.lastTypingSent = now;
    if (state.socket?.readyState === 1) sendNow({ type: 'typing', conversationId: state.openId });
  }
});

$('reply').addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && !isTouch) {
    event.preventDefault();
    $('composer').requestSubmit();
  }
});

$('composer').addEventListener('submit', (event) => {
  event.preventDefault();
  const text = $('reply').value.trim();
  const id = state.openId;
  if (!text || !id) return;
  const clientId = crypto.randomUUID();
  const list = state.messages.get(id);
  list?.push({ id: clientId, clientId, pending: true, from: 'agent', text, at: Date.now(), name: state.me.name });
  send({ type: 'send', conversationId: id, text, clientId });
  if (state.socket?.readyState !== 1) toast('Offline. Your reply will send when the connection is back.');
  $('reply').value = '';
  writeSetting(`wc-draft-${id}`, '');
  autosize();
  renderMessages(true);
  if (isTouch) $('reply').focus();
});

$('t-more').addEventListener('click', () => $('more').showModal());
$('more-delete').addEventListener('click', () => {
  if (!state.openId) return;
  if (!confirm('Delete this conversation and all of its messages? This can’t be undone.')) return;
  send({ type: 'delete', conversationId: state.openId });
  $('more').close();
});

// ── Sound ───────────────────────────────────────────────────────────────────

addEventListener('pointerdown', () => {
  if (!state.audio && 'AudioContext' in window) state.audio = new AudioContext();
}, { once: true });

function chime() {
  if (!state.sound || document.hidden || !state.audio) return;
  const ctx = state.audio;
  const now = ctx.currentTime;
  for (const [i, freq] of [880, 1320].entries()) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.3);
  }
}

// ── Push notifications ──────────────────────────────────────────────────────

function keyBytes(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function currentSubscription() {
  if (!pushSupported) return null;
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

async function refreshPush() {
  try {
    const sub = await currentSubscription();
    state.pushOn = Boolean(sub) && Notification.permission === 'granted';
    // Make sure the server still has this device (after a sign-in, for example).
    if (sub && state.pushOn) await api('POST', '/api/a/push', { subscription: sub.toJSON() });
  } catch {
    state.pushOn = false;
  }
  renderPushNotice();
}

function renderPushNotice() {
  const notice = $('push-notice');
  notice.replaceChildren();
  let text = '';
  let action = null;
  if (state.pushOn) {
    notice.hidden = true;
    return;
  }
  if (isIOS && !isStandalone) {
    text = 'To get notifications on iPhone: tap Share, then “Add to Home Screen”. Open Whagons Chat from your home screen and turn notifications on there.';
  } else if (!pushSupported) {
    text = 'This browser can’t show notifications. Keep this tab open, or install the inbox on your phone.';
  } else if (Notification.permission === 'denied') {
    text = 'Notifications are blocked for this site. Allow them in your browser or phone settings, then reload.';
  } else {
    text = 'Turn on notifications so you hear about new chats right away, even when the inbox is closed.';
    action = el('button', { class: 'btn small', onclick: enablePush }, 'Turn on notifications');
  }
  notice.append(el('p', {}, text));
  if (action) notice.append(action);
  notice.hidden = false;
}

async function enablePush() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      renderPushNotice();
      return;
    }
    const keyResponse = await api('GET', '/api/a/push');
    const { publicKey } = await keyResponse.json();
    if (!publicKey) {
      toast('Notifications aren’t set up on the server yet.');
      return;
    }
    const registration = await navigator.serviceWorker.ready;
    let sub = await registration.pushManager.getSubscription();
    if (sub) {
      // A subscription made with an older key cannot be reused.
      const current = sub.options?.applicationServerKey;
      const matches = current && new Uint8Array(current).join() === keyBytes(publicKey).join();
      if (!matches) {
        await sub.unsubscribe();
        sub = null;
      }
    }
    sub ??= await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(publicKey) });
    const saved = await api('POST', '/api/a/push', { subscription: sub.toJSON() });
    if (!saved.ok) throw new Error('save failed');
    state.pushOn = true;
    renderPushNotice();
    renderMenu();
    toast('Notifications are on for this device.');
  } catch (error) {
    console.error(error);
    toast('Couldn’t turn on notifications. Try again.');
  }
}

async function disablePush() {
  try {
    const sub = await currentSubscription();
    if (sub) {
      await api('DELETE', '/api/a/push', { endpoint: sub.endpoint });
      await sub.unsubscribe();
    }
  } catch { /* already gone */ }
  state.pushOn = false;
  renderPushNotice();
  renderMenu();
}

// ── Settings ────────────────────────────────────────────────────────────────

function renderMenu() {
  $('menu-email').textContent = `Signed in as ${state.me?.email || ''}`;
  $('menu-push-status').textContent = state.pushOn
    ? 'On. New chats and messages notify this device.'
    : 'Off on this device.';
  $('menu-push-toggle').textContent = state.pushOn ? 'Turn off' : 'Turn on';
  $('menu-push-toggle').disabled = !pushSupported || (isIOS && !isStandalone);
  $('menu-push-test').hidden = !state.pushOn;
  $('menu-sound').checked = state.sound;
}

$('menu-btn').addEventListener('click', () => {
  $('menu-name').value = state.me?.name || '';
  renderMenu();
  $('menu').showModal();
});

$('menu-name-save').addEventListener('click', async () => {
  const name = $('menu-name').value.trim();
  if (!name) return;
  const response = await api('POST', '/api/a/me', { name });
  if (response.ok) {
    state.me = (await response.json()).me;
    toast('Name saved.');
  } else toast('Couldn’t save the name.');
});

$('menu-push-toggle').addEventListener('click', () => (state.pushOn ? disablePush() : enablePush()));

$('menu-push-test').addEventListener('click', async () => {
  const response = await api('POST', '/api/a/push/test');
  const result = await response.json().catch(() => ({}));
  toast(response.ok ? `Test sent to ${result.sent} of ${result.devices} device(s).` : 'Couldn’t send a test.');
});

$('menu-sound').addEventListener('change', () => {
  state.sound = $('menu-sound').checked;
  writeSetting('wc-sound', state.sound ? '1' : '0');
});

$('menu-signout').addEventListener('click', async () => {
  await disablePush();
  await api('POST', '/api/a/logout');
  $('menu').close();
  state.me = null;
  showSignin();
});

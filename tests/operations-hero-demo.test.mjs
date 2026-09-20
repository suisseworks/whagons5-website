import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';

// Render the real component with a deterministic clock and minimal hook host.
// Browser layout and native interaction are verified separately in the local preview.
function mount(reduce = false) {
  let cursor = 0, dirty = true, tree, now = 0, observer, disconnected = false;
  const slots = [], effects = [], timers = new Map(), listeners = new Map();
  let timerId = 0;
  const media = { matches: reduce, addEventListener: (event, fn) => listeners.set('media', fn), removeEventListener: () => listeners.delete('media') };
  const document = { visibilityState: 'visible', addEventListener: (event, fn) => listeners.set(event, fn), removeEventListener: event => listeners.delete(event) };
  const react = {
    useState(initial) { const i = cursor++; slots[i] ??= { value: initial }; return [slots[i].value, value => { const next = typeof value === 'function' ? value(slots[i].value) : value; if (!Object.is(next, slots[i].value)) { slots[i].value = next; dirty = true; } }]; },
    useRef(initial) { const i = cursor++; slots[i] ??= { current: initial }; return slots[i]; },
    useEffect(fn, deps) { const i = cursor++; const old = slots[i]; if (!old || deps.some((value, index) => !Object.is(value, old.deps[index]))) effects.push(() => { old?.cleanup?.(); slots[i] = { deps, cleanup: fn() }; }); },
  };
  const jsx = (type, props) => ({ type, props });
  const exports = {};
  const source = ts.transpileModule(readFileSync(new URL('../app/components/home/OperationsHeroDemo.tsx', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(source, { exports, require: id => id === 'react' ? react : id === 'react/jsx-runtime' ? { jsx, jsxs: jsx } : { default: {} }, document,
    performance: { now: () => now }, window: { matchMedia: () => media, setTimeout: (fn, delay) => { timers.set(++timerId, { fn, at: now + delay }); return timerId; }, clearTimeout: id => timers.delete(id) },
    IntersectionObserver: class { constructor(fn) { observer = fn; } observe() {} disconnect() { disconnected = true; } },
  });
  const render = () => { while (dirty) { dirty = false; cursor = 0; tree = exports.default({ lang: 'es' }); tree.props.ref.current = {}; effects.splice(0).forEach(fn => fn()); } return tree; };
  const nodes = node => !node || typeof node !== 'object' ? [] : Array.isArray(node) ? node.flatMap(nodes) : [node, ...nodes(node.props?.children)];
  const text = node => typeof node === 'string' ? node : Array.isArray(node) ? node.map(text).join('') : node && typeof node === 'object' ? text(node.props?.children) : '';
  render();
  return {
    step: () => render().props['data-step'], playing: () => render().props['data-playing'],
    intersect(ratio) { observer([{ isIntersecting: ratio > 0, intersectionRatio: ratio }]); render(); },
    visibility(value) { document.visibilityState = value; listeners.get('visibilitychange')(); render(); },
    reduce(value) { media.matches = value; listeners.get('media')(); render(); },
    click(label) { const button = nodes(render()).find(node => node.type === 'button' && text(node).includes(label)); assert.ok(button, label); assert.ok(!button.props.disabled); button.props.onClick(); render(); },
    advance(ms) { const end = now + ms; for (;;) { const next = [...timers].sort((a,b) => a[1].at - b[1].at)[0]; if (!next || next[1].at > end) break; now = next[1].at; timers.delete(next[0]); next[1].fn(); render(); } now = end; },
    unmount() { slots.forEach(slot => slot.cleanup?.()); assert.equal(timers.size, 0); assert.equal(listeners.size, 0); assert.equal(disconnected, true); },
  };
}

test('starts at half visibility, finishes once in 12 seconds and does not restart on re-entry', () => {
  const app = mount(); app.intersect(.49); app.advance(20000); assert.equal(app.step(), 0);
  app.intersect(.5); app.advance(11999); assert.equal(app.step(), 2); app.advance(1); assert.equal(app.step(), 3);
  app.intersect(0); app.intersect(1); app.advance(20000); assert.equal(app.step(), 3); assert.equal(app.playing(), false); app.unmount();
});
test('pause, viewport exit and hidden tabs preserve the remaining time', () => {
  const app = mount(); app.intersect(1); app.advance(1000); app.click('Pausar'); app.advance(9000); assert.equal(app.step(), 0);
  app.click('Continuar'); app.advance(1000); app.intersect(0); app.advance(9000); assert.equal(app.step(), 0);
  app.intersect(1); app.advance(1000); app.visibility('hidden'); app.advance(9000); assert.equal(app.step(), 0);
  app.visibility('visible'); app.advance(1000); assert.equal(app.step(), 1); app.unmount();
});
test('replay during the first step resets the full timer; channel selection stops autoplay', () => {
  const app = mount(); app.intersect(1); app.advance(3000); app.click('Repetir'); app.advance(3999); assert.equal(app.step(), 0);
  app.advance(1); assert.equal(app.step(), 1); app.click('QR'); app.advance(20000); assert.equal(app.step(), undefined); assert.equal(app.playing(), false);
  app.click('Ver formulario'); app.click('Ver recorrido'); assert.equal(app.step(), 0); app.advance(12000); assert.equal(app.step(), 3); app.unmount();
});
test('reduced motion remains manual, including replay and a changed preference', () => {
  const app = mount(true); app.intersect(1); app.advance(20000); assert.equal(app.step(), 0);
  app.click('Siguiente paso'); assert.equal(app.step(), 1); app.click('Repetir'); assert.equal(app.step(), 0);
  app.reduce(false); app.advance(4000); assert.equal(app.step(), 1); app.reduce(true); app.advance(20000); assert.equal(app.step(), 1); app.unmount();
});

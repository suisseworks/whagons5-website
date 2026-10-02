# Blog animations

Scenes live in `scenes/<group>/<name>.js` and render to
`public/media/blog/<lang>/<group>-<name>.mp4` plus a poster `.jpg`.

A scene module exports:

```js
export default {
  size: [800, 450],     // CSS pixels, captured at 2x (1600x900)
  duration: 15000,      // ms; videos loop
  poster: 10000,        // ms of the frame used as the poster
  still: false,         // true renders only the JPG (social cards)
  strings: { es: {...}, en: {...} },
  build(stage, s, { lang, w, h, duration }) {
    // Create the DOM once, then return a pure function of time.
    return (t) => { /* set styles for time t */ };
  },
};
```

`render(t)` must depend only on `t`. No timers, `Math.random()` or CSS
transitions: the renderer jumps to each frame and takes a screenshot.

Helpers:

- `lib/kit.js` has easing, `seg()` for eased progress windows, `set()` and
  `rise()` for transforms, `caption()` for the numbered lower-third, `cursor()`
  for an animated pointer with clicks, `center()` to aim the pointer at an
  element, and `loopVeil()` for a clean loop seam.
- `lib/stage.css` is the visual kit: panels, pills, task rows, cards.
- `lib/rooms.js`, `lib/space.js`, `lib/checklist.js` and `lib/og.js` build
  the room cards, KPI cards, closing checklists and social cards.
- `lib/tasks.js` builds the task grid, approval badge, popovers, side sheet,
  toast and photo thumbnail used by the first-day and approvals scenes.

Scenes may carry `pt` and `de` strings too; render them with
`--lang en,es,pt,de`. The Whagons app's Learn center plays these files, so
every language a guide lists in `shared/learn/catalog.ts` (whagons5-client)
needs its renders here.

Review a scene with stills before rendering the video:

```bash
node scripts/blog-media/render.mjs work-plans-schedule --lang es --frames 2000,8000
```

The fonts in `fonts/` are Instrument Sans and JetBrains Mono, both under the
SIL Open Font License.

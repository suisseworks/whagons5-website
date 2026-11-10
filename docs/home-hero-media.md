# Home hero: media, sequence and socket

The home page opens on a mosaic of real operations that turns into the Whagons interface. This note lists every asset it uses, where each one comes from, the shots still missing, and how to change any of it.

Code: `app/components/home/hero/` (`Hero.tsx` runs the sequence, `media.ts` lists the mosaic media, `ProductScene.tsx` draws the interface, `Socket.tsx` and `plugs.ts` draw the outlet, cable and plug). Copy for the rest of the page is in `app/components/home/content.ts`.

## The sequence

| Step | What happens | Where to change it |
| --- | --- | --- |
| 1 | Tiles rise in (photos and 6 s silent clips). | `TILES` in `media.ts` (first item of each pool) |
| 2 | One tile at a time crossfades to its next photo or clip, every 2.3–3.4 s. At most one hospitality tile is shown at once; at most 4 clips play on desktop, 3 on tablets, 2 on phones. | `swapOne`, `VIDEO_CAP` in `Hero.tsx` |
| 3 | After about 15 s every tile turns over, in a cascade. | `startMosaic`, `FLIP_MS`, `CASCADE_MS` |
| 4 | The backs line up into one screen (each back holds a slice of the same interface), which then becomes a single live layer. | `slice` / `sceneLayer` in `Hero.tsx` |
| 5 | A task is created, assigned, received on the assignee's phone, started, completed with its checklist and a photo or signature, and the board and KPI cards follow (13.6 s). | `SCRIPT` in `scenarios.ts` |
| 6 | The screen holds for about 8 s, then the tiles turn back to new footage and the cycle starts again. | `playScene` |

Every timing runs on a clock that stops while the visitor has paused, while the hero is off screen and while the tab is in the background. With `prefers-reduced-motion` nothing moves: the mosaic shows still photos and plugging in swaps to a still, finished interface.

Plugging the cable in sends a pulse of light along it; when it reaches the mosaic the tiles light up from the cable's port outward and turn over from there. If the interface is already showing, it plays a short pulse linking the team's space, the task, the assignee's phone and the KPI cards. While plugged in, the screen moves on to another team (maintenance, housekeeping, delivery) instead of turning back; unplugging turns it back to the mosaic.

The interface is an HTML recreation of the Whagons app (labels, statuses and layout follow the app; the data is sample data) and says so on screen: *Interfaz de Whagons · datos de ejemplo*.

## Mosaic media

### Clips (`public/media/home/`)

Each clip is a 6 s loop (the last 0.6 s crossfades into the first frame), muted H.264, 960×540 (1280×720 for the two that can fill the large tile), with a JPG poster of its first frame. All are from Mixkit under the **Mixkit Stock Video Free License** (commercial use allowed, no attribution required). Each item's licence was checked on its page before download; Mixkit's *Restricted* items (personal use only) were excluded.

| File | Mixkit item | Source | Licence | Cut from |
| --- | --- | --- | --- | --- |
| `port-cargo` | Cargo ship full of containers | https://mixkit.co/free-stock-video/cargo-ship-full-of-containers-4011/ | Free | 6 s |
| `warehouse-inventory` | Young worker doing inventory | https://mixkit.co/free-stock-video/young-worker-doing-inventory-4705/ | Free | 1 s |
| `cleaning-bathroom` | Man with face mask cleaning the surface of a bathroom | https://mixkit.co/free-stock-video/man-with-face-mask-cleaning-the-surface-of-a-bathroom-5319/ | Free | 0 s |
| `delivery-boxes` | Courier worker preparing boxes on a loading truck | https://mixkit.co/free-stock-video/courier-worker-preparing-boxes-on-a-loading-truck-31346/ | Free | 2 s |
| `delivery-signature` | Mail delivery with digital signature | https://mixkit.co/free-stock-video/mail-delivery-with-digital-signature-31214/ | Free | 2.5 s |
| `mechanic-engine` | Mechanic repairing a car engine | https://mixkit.co/free-stock-video/mechanic-repairing-a-car-engine-4716/ | Free | 1 s |
| `mechanic-motorcycle` | Professional mechanic fixing a motorcycle | https://mixkit.co/free-stock-video/professional-mechanic-fixing-a-motorcycle-41933/ | Free | 0 s |
| `lab-scientist` | Scientist adjusting equipment in a laboratory | https://mixkit.co/free-stock-video/scientist-adjusting-equipment-in-a-laboratory-4765/ | Free | 0.5 s |
| `pharma-capsules` | Capsule packing machine in a factory | https://mixkit.co/free-stock-video/capsule-packing-machine-in-a-factory-4750/ | Free | 0 s |
| `brewery-tank` | Brewer opening a barley bagasse tank | https://mixkit.co/free-stock-video/brewer-opening-a-barley-bagasse-tank-1411/ | Free | 0 s |
| `construction-frame` | Construction workers at a house under construction | https://mixkit.co/free-stock-video/construction-workers-at-a-house-under-construction-1459/ | Free | 1.5 s |
| `packing-tape` (vertical) | Hands of two people sealing a package with tape | https://mixkit.co/free-stock-video/hands-of-two-people-sealing-a-package-with-tape-42137/ | Free | 0 s |
| `delivery-walk` | Delivery man looking for an address on the street | https://mixkit.co/free-stock-video/delivery-man-looking-for-an-address-on-the-street-31136/ | Free | 0.5 s |
| `parcels-carry` | Parcel worker looking for an address | https://mixkit.co/free-stock-video/parcel-worker-looking-for-an-address-42128/ | Free | 2.8 s |

To re-encode a clip from its Mixkit source (`<id>-720.mp4`), starting at `S` seconds:

```bash
ffmpeg -ss S -t 6.6 -i source.mp4 -an -filter_complex \
  "[0:v]scale=960:540:force_original_aspect_ratio=increase,crop=960:540,split[a][b];\
   [a]trim=start=0.6:duration=6,setpts=PTS-STARTPTS[main];[b]trim=duration=0.6,setpts=PTS-STARTPTS[head];\
   [main][head]xfade=transition=fade:duration=0.6:offset=5.4,format=yuv420p[v]" \
  -map "[v]" -c:v libx264 -preset slow -crf 26 -profile:v high -g 48 -movflags +faststart name.mp4
ffmpeg -i name.mp4 -frames:v 1 -q:v 4 name.jpg
```

### Photos (already in the site)

Free Unsplash images added with the earlier home and industries pages: `public/images/photos/room-readiness.jpg`, `engineering.jpg`, `industries-hero.jpg`, `guest-requests.jpg`, `hero-maintenance.jpg`, `quality.jpg`, `hero-woman.jpg`, `maintenance.jpg`, and `public/images/industries/retail.jpg`, `construccion.jpg`.

### Shots still missing

These sectors are named in the hero brief but have no licensed footage yet. Each one has a slot ready: drop the file in and point an entry in `MEDIA` (`media.ts`) at it.

| Needed | Why | Format |
| --- | --- | --- |
| A truck on the road, or at a loading dock with a driver | Transport is represented by a port, deliveries and a loading dolly, but no truck. Mixkit's truck clips are all *Restricted*. | 6–8 s clip, 1280×720 or larger, no visible brands or plates; or a 1600 px photo |
| A forklift moving pallets in a warehouse | The warehouse tiles show inventory and packing, not goods moving. | Clip as above |
| Housekeeping in motion (a room attendant making a bed or with a cart) | Hospitality cleaning is a still photo; a clip would match the other sectors. | Clip as above, ideally vertical-friendly |
| A store employee at work (restocking, an opening checklist) | Retail is one still photo of a counter. | Clip or photo |
| Your own customers' teams | Real footage from Whagons customers, with their written consent, would beat any stock. | Any of the above |

Real screen recordings of the app (rather than the HTML recreation and the rendered guide animations) would also be welcome for the "Cómo funciona" section; until then those animations are labelled as product animations with sample data.

## The socket

The outlet and plug follow the visitor's country: a choice saved in `localStorage` (`whagons-plug`), then the country the CDN reports (`/api/geo`, which only reads the `cf-ipcountry` style headers the middleware already uses and stores nothing), then the device's time zone and language. Without any of those it shows the main market for the page language: Costa Rica (ES) or the United States (EN), both type A/B. Countries with more than one standard offer them as a choice. Standards and their geometry are in `plugs.ts` (13 types: A, B, C, D, E, F, G, H, I, J, L, M, N).

The plug can be dragged in, clicked or tapped, or connected with Enter/Space; it is a button with `aria-pressed`, and the line above it announces the result.

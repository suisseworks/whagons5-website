# Home hero: media, sequence and socket

The home page opens on a mosaic of real operations that turns into the Whagons interface. This note lists every asset it uses, where each one comes from, the shots still missing, and how to change any of it.

Code: `app/components/home/hero/` (`Hero.tsx` runs the sequence, `media.ts` lists the mosaic media, `ProductScene.tsx` draws the interface, `Socket.tsx` and `plugs.ts` draw the outlet, cable and plug). Copy for the rest of the page is in `app/components/home/content.ts`.

The hotel page (`/es/operaciones-hoteleras`) uses the same hero through `app/components/hospitality/HotelHero.tsx`: its own tiles and screen (`hotelScene.ts`, with the extra `hotel…` items at the end of `MEDIA`) and a room key card with its wall switch in place of the plug (`KeyCard.tsx`). Everything below applies to it too.

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
| `clinic-reception` | Clinic staff at a hospital reception | https://mixkit.co/free-stock-video/clinic-staff-at-a-hospital-reception-4766/ | Free | 3 s |
| `airport-ramp` | Flight getting ready for departure | https://mixkit.co/free-stock-video/flight-getting-ready-for-departure-4065/ | Free | 12 s, cropped to the right of the frame so the airline's livery is out of shot |
| `welder-height` | Welder working at a construction | https://mixkit.co/free-stock-video/welder-working-at-a-construction-4125/ | Free | 2 s |
| `kitchen-grill` | Chef cooking on a large grill | https://mixkit.co/free-stock-video/chef-cooking-on-a-large-grill-4678/ | Free | 4 s |
| `kitchen-bakery` | Chef working in a large kitchen | https://mixkit.co/free-stock-video/chef-working-in-a-large-kitchen-43048/ | Free | 0.5 s |
| `restaurant-service` | Waiter serving meat stew in a restaurant | https://mixkit.co/free-stock-video/waiter-serving-meat-stew-in-a-restaurant-4672/ | Free | 3 s |
| `barista-shift` | Skilled employee working in a coffee shop | https://mixkit.co/free-stock-video/skilled-employee-working-in-a-coffee-shop-41856/ | Free | 0.5 s |
| `gardener-plants` | Gardener arranging the soil for a plant | https://mixkit.co/free-stock-video/gardener-arranging-the-soil-for-a-plant-43697/ | Free | 2 s |
| `hotel-room-service` | Hotel room with breakfast served | https://mixkit.co/free-stock-video/hotel-room-with-breakfast-served-4019/ | Free | 2 s |

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

## Elsewhere on the home page

- **Mosaic pools**: each tile now has a fourth item from the clips above (clinic, airport, coffee shop, grounds, work at height, kitchen, bakery, restaurant), so the mosaic covers more sectors over a cycle.
- **En el piso / On the floor** (`sections/Field.tsx`): the earlier hero photo (`public/images/photos/hero-woman.jpg`) with its three floating product cards (`sections/FieldCards.tsx`, restored from the earlier `HeroVisual`). The cards rise in when the section scrolls into view, then drift.
- **Donde se hace el trabajo / Where the work happens** (`sections/Reel.tsx`): a wall of 10 tiles (clips above plus `quality.jpg` and `engineering.jpg`). Each clip loads and plays only while its tile is on screen; photos drift slowly. Reduced motion or Save-Data keep the posters.
- **FAQ**: `public/images/photos/faq-team.jpg` under the contact line.
- **Next step**: `delivery-walk` plays, darkened, behind the closing band (`sections/Backdrop.tsx`), only while it is on screen.

Mixkit items checked and left out because they are *Restricted*: forklift, freight truck at a warehouse, solar installers, grocery and store staff, factory and food-plant workers, hotel staff with towels, pharmacy checkout. An excavator-and-truck clip (Free) was left out because the machine's maker's logo is in every frame.

## The socket

The outlet and plug follow the visitor's country: a choice saved in `localStorage` (`whagons-plug`), then the country the CDN reports (`/api/geo`, which only reads the `cf-ipcountry` style headers the middleware already uses and stores nothing), then the device's time zone and language. Without any of those it shows the main market for the page language: Costa Rica (ES) or the United States (EN), both type A/B. Countries with more than one standard offer them as a choice. Standards and their geometry are in `plugs.ts` (13 types: A, B, C, D, E, F, G, H, I, J, L, M, N).

The plug can be dragged in, clicked or tapped, or connected with Enter/Space; it is a button with `aria-pressed`, and the line above it announces the result.

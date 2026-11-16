/**
 * Rufo in 3D: a small three.js model built from primitives to match the
 * character sheet (clay-red body, the Whagons W as antlers, tan feet and
 * belly, glossy eyes). Being a real model, he turns all the way round and
 * his head and eyes follow the mouse smoothly.
 *
 * Loaded on demand by Rufo.tsx; the flat poses stay as the fallback.
 * Renders only while something moves, so a resting Rufo costs nothing.
 */
import {
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type Pose3D = 'front' | 'turn' | 'side' | 'back' | 'wink' | 'look' | 'sad';

export interface Rufo3D {
  /** One of the sheet's poses; mirror = facing right. */
  pose(pose: Pose3D, mirror: boolean): void;
  /** Turn the head toward a point: x, y in -1..1 (right, up). */
  aim(x: number, y: number): void;
  /** One full turn on the spot. */
  spin(ms: number): Promise<void>;
  dispose(): void;
}

type Expression = 'smile' | 'wink' | 'sad' | 'look';

// The body is an ellipsoid with these radii (x across, y up, z toward you).
const BX = 1;
const BY = 0.96;
const BZ = 0.95;

const TAU = Math.PI * 2;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function createRufo3D(canvas: HTMLCanvasElement, still: boolean): Rufo3D | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 0.92;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const env = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = env;

  const camera = new PerspectiveCamera(22, 1, 0.1, 50);
  camera.position.set(0, 1.05, 8.4);
  camera.lookAt(0, 0.34, 0);

  const key = new DirectionalLight(0xfff1e2, 1.9);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const rim = new DirectionalLight(0xffe0d0, 0.7);
  rim.position.set(3, 2.5, -3);
  scene.add(rim);
  scene.add(new HemisphereLight(0xfff4ea, 0x6a2a1c, 0.7));

  // ---- materials ----
  const red = new MeshPhysicalMaterial({
    color: new Color('#d8350f'), roughness: 0.62, clearcoat: 0.08, clearcoatRoughness: 0.7,
    sheen: 0.35, sheenColor: new Color('#ff7a52'), sheenRoughness: 0.8, envMapIntensity: 0.55,
  });
  const tan = new MeshPhysicalMaterial({ color: new Color('#e9be86'), roughness: 0.6, envMapIntensity: 0.5 });
  const cream = new MeshPhysicalMaterial({ color: new Color('#f3dfc4'), roughness: 0.35, clearcoat: 0.3, envMapIntensity: 0.5 });
  const iris = new MeshPhysicalMaterial({ color: new Color('#4a220c'), roughness: 0.25, clearcoat: 1, envMapIntensity: 0.6 });
  const pupil = new MeshPhysicalMaterial({ color: new Color('#140a05'), roughness: 0.1, clearcoat: 1 });
  const shine = new MeshBasicMaterial({ color: 0xffffff });
  const dark = new MeshStandardMaterial({ color: new Color('#4e180c'), roughness: 0.6 });
  const mouthIn = new MeshStandardMaterial({ color: new Color('#6a170c'), roughness: 0.7, side: DoubleSide });
  const tongue = new MeshStandardMaterial({ color: new Color('#ef6f68'), roughness: 0.6, side: DoubleSide });
  const blush = new MeshStandardMaterial({
    color: new Color('#ff8d73'), roughness: 0.9, transparent: true, opacity: 0.55, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -2,
  });
  const materials = [red, tan, cream, iris, pupil, shine, dark, mouthIn, tongue, blush];

  const ball = new SphereGeometry(1, 48, 32);
  const geometries: { dispose(): void }[] = [ball];
  const blob = (mat: MeshStandardMaterial | MeshBasicMaterial, sx: number, sy: number, sz: number) => {
    const m = new Mesh(ball, mat);
    m.scale.set(sx, sy, sz);
    return m;
  };

  // A point on the body's surface (front side) and its outward normal.
  const surface = (x: number, y: number) => {
    const z = BZ * Math.sqrt(Math.max(0, 1 - (x / BX) ** 2 - (y / BY) ** 2));
    const p = new Vector3(x, y, z);
    const n = new Vector3(x / (BX * BX), y / (BY * BY), z / (BZ * BZ)).normalize();
    return { p, n };
  };
  // Stick something onto the body, its +z facing out.
  const stick = (o: Object3D, x: number, y: number, lift = 0) => {
    const { p, n } = surface(x, y);
    o.position.copy(p).addScaledVector(n, lift);
    o.lookAt(o.position.clone().add(n));
    return o;
  };

  // ---- the model ----
  const rig = new Group(); // turns (yaw) and nods (pitch)
  scene.add(rig);

  // The body: an ellipsoid, a little narrower toward the top, like the sheet.
  const bodyGeo = new SphereGeometry(1, 64, 48);
  const pos = bodyGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const squeeze = 1 - 0.09 * Math.max(0, y) + 0.03 * Math.min(0, y);
    pos.setXYZ(i, pos.getX(i) * squeeze, y, pos.getZ(i) * squeeze);
  }
  bodyGeo.computeVertexNormals();
  geometries.push(bodyGeo);
  const bodyMesh = new Mesh(bodyGeo, red);
  bodyMesh.scale.set(BX, BY, BZ);
  rig.add(bodyMesh);
  // The little peak where the antlers grow out.
  const tuft = blob(red, 0.34, 0.2, 0.3);
  tuft.position.set(0.0, 0.86, 0.02);
  rig.add(tuft);

  // Antlers: the Whagons W as one thick tube, leaning back a little.
  const antler = new Group();
  const pts = [
    [-1.1, 1.34, -0.08], [-0.84, 1.12, -0.03], [-0.52, 0.94, 0.03], [-0.22, 0.86, 0.08], [0.02, 1.08, 0.1],
    [0.2, 1.38, 0.08], [0.36, 1.2, 0.05], [0.56, 0.95, 0.02], [0.82, 1.14, -0.04], [1.06, 1.38, -0.1],
  ].map(([x, y, z]) => new Vector3(x, y, z));
  const curve = new CatmullRomCurve3(pts, false, 'centripetal');
  const tube = new TubeGeometry(curve, 160, 0.19, 22, false);
  geometries.push(tube);
  antler.add(new Mesh(tube, red));
  for (const end of [pts[0], pts[pts.length - 1]]) {
    const cap = blob(red, 0.19, 0.19, 0.19);
    cap.position.copy(end);
    antler.add(cap);
  }
  antler.position.set(0, 0, 0);
  const antlerPivot = new Group();
  antlerPivot.position.set(0, 0.8, 0);
  antler.position.set(0, -0.72, 0);
  antlerPivot.rotation.x = -0.26;
  antlerPivot.add(antler);
  rig.add(antlerPivot);

  // Arms.
  for (const s of [-1, 1]) {
    const arm = blob(red, 0.13, 0.2, 0.15);
    arm.position.set(0.99 * s, -0.14, 0.06);
    arm.rotation.z = 0.28 * s;
    rig.add(arm);
  }

  // Legs: a red cuff and a tan foot, two in front and two behind.
  for (const [x, z] of [[-0.52, 0.46], [0.52, 0.46], [-0.52, -0.46], [0.52, -0.46]]) {
    const cuff = blob(red, 0.23, 0.16, 0.23);
    cuff.position.set(x, -0.8, z);
    rig.add(cuff);
    const foot = blob(tan, 0.19, 0.14, 0.23);
    foot.position.set(x, -0.93, z + 0.08);
    rig.add(foot);
  }

  // Belly patch.
  rig.add(stick(blob(tan, 0.44, 0.24, 0.12), 0, -0.7, -0.06));

  // Cheeks.
  const cheekGeo = new CircleGeometry(0.115, 28);
  geometries.push(cheekGeo);
  for (const s of [-1, 1]) rig.add(stick(new Mesh(cheekGeo, blush), 0.67 * s, -0.06, 0.004));

  // Eyes: cream, brown iris, dark pupil, two highlights. The iris group
  // moves a little to look around; the whole eye squashes to blink.
  const eyes: { eye: Group; look: Group; arc: Mesh; brow: Mesh }[] = [];
  const arcGeo = new TorusGeometry(0.1, 0.021, 10, 28, Math.PI);
  const browGeo = new TorusGeometry(0.11, 0.018, 8, 24, 1.1);
  geometries.push(arcGeo, browGeo);
  for (const s of [-1, 1]) {
    const holder = stick(new Group(), 0.42 * s, 0.16, -0.035);
    const eye = new Group();
    holder.add(eye);
    eye.add(blob(cream, 0.2, 0.21, 0.075));
    const look = new Group();
    look.position.z = 0.03;
    const ir = blob(iris, 0.172, 0.18, 0.062);
    look.add(ir);
    const pu = blob(pupil, 0.112, 0.118, 0.044);
    pu.position.z = 0.038;
    look.add(pu);
    const h1 = blob(shine, 0.045, 0.045, 0.02);
    h1.position.set(-0.05, 0.062, 0.085);
    look.add(h1);
    const h2 = blob(shine, 0.02, 0.02, 0.012);
    h2.position.set(0.055, -0.05, 0.08);
    look.add(h2);
    eye.add(look);
    // Closed, happy eye (the wink): an arch over the cream.
    const arc = new Mesh(arcGeo, dark);
    arc.position.set(0, -0.03, 0.08);
    arc.visible = false;
    eye.add(arc);
    rig.add(holder);
    // Worried brow, inner end up.
    const brow = new Mesh(browGeo, dark);
    stick(brow, 0.38 * s, 0.43, 0.01);
    brow.rotateZ(s < 0 ? -0.2 + Math.PI / 2 - 0.55 : Math.PI / 2 - 0.55 + 0.2 + 0.0);
    brow.visible = false;
    rig.add(brow);
    eyes.push({ eye, look, arc, brow });
  }

  // Mouths, one shown at a time.
  const smileGeo = new TorusGeometry(0.075, 0.014, 8, 24, Math.PI);
  geometries.push(smileGeo);
  const smile = stick(new Group(), 0, -0.02, 0.005);
  const smileArc = new Mesh(smileGeo, dark);
  smileArc.rotation.z = Math.PI;
  smile.add(smileArc);
  rig.add(smile);

  const open = stick(new Group(), 0, -0.035, 0.006);
  const openGeo = new CircleGeometry(0.1, 28, Math.PI, Math.PI);
  const tongueGeo = new CircleGeometry(0.055, 20, Math.PI, Math.PI);
  geometries.push(openGeo, tongueGeo);
  const openIn = new Mesh(openGeo, mouthIn);
  openIn.scale.set(1, 0.85, 1);
  open.add(openIn);
  const tg = new Mesh(tongueGeo, tongue);
  tg.position.set(0, -0.04, 0.002);
  open.add(tg);
  open.visible = false;
  rig.add(open);

  const frown = stick(new Group(), 0, -0.07, 0.005);
  const frownArc = new Mesh(smileGeo, dark);
  frownArc.scale.set(0.75, 0.6, 1);
  frown.add(frownArc);
  frown.visible = false;
  rig.add(frown);

  const flat = stick(new Group(), 0, -0.04, 0.005);
  const flatArc = new Mesh(smileGeo, dark);
  flatArc.rotation.z = Math.PI;
  flatArc.scale.set(0.55, 0.3, 1);
  flat.add(flatArc);
  flat.visible = false;
  rig.add(flat);

  // Sits on the bottom of the frame: feet at y = -0.98.
  rig.position.y = 0;

  // ---- state ----
  let yaw = 0;
  let yawTo = 0;
  let pitch = 0;
  let pitchTo = 0;
  let lookX = 0;
  let lookY = 0;
  let lookXTo = 0;
  let lookYTo = 0;
  let expression: Expression = 'smile';
  let spinning: { from: number; start: number; ms: number; done: () => void } | null = null;
  let blinkAt = 0;
  let nextBlink = performance.now() + 2500;

  const setExpression = (e: Expression) => {
    expression = e;
    smile.visible = e === 'smile';
    open.visible = e === 'wink';
    frown.visible = e === 'sad';
    flat.visible = e === 'look';
    const right = eyes[1];
    right.arc.visible = e === 'wink';
    right.look.visible = e !== 'wink';
    for (const it of eyes) it.brow.visible = e === 'sad';
    kick();
  };

  // ---- drawing ----
  let w = 0;
  let h = 0;
  const resize = () => {
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (!cw || !ch || (cw === w && ch === h)) return;
    w = cw;
    h = ch;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  let frame = 0;
  let last = 0;
  const step = (now: number) => {
    frame = 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    resize();
    let busy = false;
    const k = still ? 1 : 1 - Math.exp(-dt * 11);

    if (spinning) {
      const t = Math.min(1, (now - spinning.start) / spinning.ms);
      yaw = spinning.from + ease(t) * TAU;
      busy = true;
      if (t >= 1) {
        yaw = spinning.from;
        const done = spinning.done;
        spinning = null;
        done();
      }
    } else {
      yaw += (yawTo - yaw) * k;
      if (Math.abs(yawTo - yaw) > 0.0005) busy = true;
      else yaw = yawTo;
    }
    pitch += (pitchTo - pitch) * k;
    lookX += (lookXTo - lookX) * k;
    lookY += (lookYTo - lookY) * k;
    if (Math.abs(pitchTo - pitch) + Math.abs(lookXTo - lookX) + Math.abs(lookYTo - lookY) > 0.0005) busy = true;

    rig.rotation.set(pitch, yaw, 0, 'YXZ');
    for (const it of eyes) it.look.position.set(lookX * 0.045, lookY * 0.04, 0.03);

    // Blink now and then (not while winking or turned away).
    let blink = 1;
    if (!still && expression !== 'wink') {
      if (!blinkAt && now > nextBlink) blinkAt = now;
      if (blinkAt) {
        const t = (now - blinkAt) / 150;
        blink = t < 0.5 ? 1 - t * 1.8 : t < 1 ? 0.1 + (t - 0.5) * 1.8 : 1;
        busy = true;
        if (t >= 1) {
          blinkAt = 0;
          nextBlink = now + 2200 + Math.random() * 4200;
        }
      }
    }
    for (const it of eyes) it.eye.scale.y = Math.max(0.08, blink);

    renderer.render(scene, camera);
    if (busy) frame = requestAnimationFrame(step);
  };
  function kick() {
    if (!frame) {
      last = 0;
      frame = requestAnimationFrame(step);
    }
  }
  // Blinks need a wake-up call while he is otherwise at rest.
  const blinker = still ? 0 : window.setInterval(() => {
    if (document.visibilityState === 'visible' && performance.now() > nextBlink) kick();
  }, 500);

  const nearest = (to: number) => {
    // Turn the short way round from wherever the last spin left him.
    const base = Math.round((yaw - to) / TAU) * TAU;
    return to + base;
  };

  const api: Rufo3D = {
    pose(p, mirror) {
      const s = mirror ? 1 : -1;
      let to = 0;
      let nod = 0;
      let e: Expression = 'smile';
      if (p === 'turn') to = 0.62 * s;
      else if (p === 'side') to = 1.32 * s;
      else if (p === 'back') to = Math.PI;
      else if (p === 'look') { to = 0.45 * s; nod = 0.16; e = 'look'; }
      else if (p === 'wink') e = 'wink';
      else if (p === 'sad') { nod = -0.06; e = 'sad'; }
      yawTo = nearest(to);
      pitchTo = nod;
      lookXTo = p === 'turn' || p === 'side' ? s * 0.6 : 0;
      lookYTo = p === 'sad' ? 0.5 : p === 'look' ? -0.5 : 0;
      if (e !== expression) setExpression(e);
      kick();
    },
    aim(x, y) {
      yawTo = nearest(Math.max(-0.75, Math.min(0.75, x * 0.75)));
      pitchTo = Math.max(-0.16, Math.min(0.12, -y * 0.16));
      lookXTo = Math.max(-1, Math.min(1, x * 1.4));
      lookYTo = Math.max(-1, Math.min(1, y * 1.4));
      if (expression !== 'smile') setExpression('smile');
      kick();
    },
    spin(ms) {
      return new Promise<void>((resolve) => {
        if (spinning) spinning.done();
        yaw = nearest(0);
        yawTo = yaw;
        spinning = { from: yaw, start: performance.now(), ms, done: resolve };
        kick();
      });
    },
    dispose() {
      if (frame) cancelAnimationFrame(frame);
      window.clearInterval(blinker);
      if (spinning) spinning.done();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
  setExpression('smile');
  return api;
}

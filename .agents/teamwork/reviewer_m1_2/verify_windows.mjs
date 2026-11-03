import * as THREE from '../../../kantor-agent/skills/kantor-agent/runtime/public/assets/vendor/three/build/three.module.js';

// Setup constants matching kantor.js
const ROOM = { x0: -10, x1: 10, z0: -7, z1: 6, h: 4.8 };

function box(w, h, d, r = 0.02) {
  return new THREE.BoxGeometry(w, h, d);
}

function buildTestWindow(spec) {
  const wall = spec.wall || 'back';
  const w = spec.w ?? 1.9;
  const h = spec.h ?? 1.9;
  const cy = spec.cy ?? 2.3;

  const group = new THREE.Group();

  const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h));
  glass.position.set(0, 0, 0.015);
  glass.name = 'glass';
  group.add(glass);

  const t = 0.08;
  const frameD = 0.08;
  const frameZ = 0.03;

  const topBar = new THREE.Mesh(new THREE.BoxGeometry(w + t * 2, t, frameD));
  topBar.position.set(0, h / 2 + t / 2, frameZ);
  topBar.name = 'topBar';

  const botBar = new THREE.Mesh(new THREE.BoxGeometry(w + t * 2, t, frameD));
  botBar.position.set(0, -h / 2 - t / 2, frameZ);
  botBar.name = 'botBar';

  const leftBar = new THREE.Mesh(new THREE.BoxGeometry(t, h, frameD));
  leftBar.position.set(-w / 2 - t / 2, 0, frameZ);
  leftBar.name = 'leftBar';

  const rightBar = new THREE.Mesh(new THREE.BoxGeometry(t, h, frameD));
  rightBar.position.set(w / 2 + t / 2, 0, frameZ);
  rightBar.name = 'rightBar';

  const mw = t * 0.6;
  const mullionD = 0.06;
  const mullion = new THREE.Mesh(new THREE.BoxGeometry(mw, h, mullionD));
  mullion.position.set(0, 0, frameZ);
  mullion.name = 'mullion';

  const tw = (w - mw) / 2;
  const th = t * 0.6;
  const ty = h * 0.15;
  const transomL = new THREE.Mesh(new THREE.BoxGeometry(tw, th, mullionD));
  transomL.position.set(-(w + mw) / 4, ty, frameZ);
  transomL.name = 'transomL';

  const transomR = new THREE.Mesh(new THREE.BoxGeometry(tw, th, mullionD));
  transomR.position.set((w + mw) / 4, ty, frameZ);
  transomR.name = 'transomR';

  group.add(topBar, botBar, leftBar, rightBar, mullion, transomL, transomR);

  const sillW = w + t * 2 + 0.14;
  const sillH = 0.06;
  const sillD = 0.22;
  const sill = new THREE.Mesh(box(sillW, sillH, sillD, 0.015));
  sill.position.set(0, -h / 2 - t - sillH / 2, 0.09);
  sill.name = 'sill';
  group.add(sill);

  if (wall === 'side') {
    const x = spec.x ?? ROOM.x1;
    const z = spec.z ?? spec.cz ?? 0.5;
    const rotY = typeof spec.rotY === 'number' ? spec.rotY : -Math.PI / 2;
    group.position.set(x, cy, z);
    group.rotation.y = rotY;
  } else {
    const cx = spec.cx ?? 0;
    const cz = spec.cz ?? spec.z ?? ROOM.z0;
    const rotY = typeof spec.rotY === 'number' ? spec.rotY : 0;
    group.position.set(cx, cy, cz);
    group.rotation.y = rotY;
  }

  group.updateMatrixWorld(true);
  return group;
}

// Instantiate the 3 windows
const w1 = buildTestWindow({ cx: 3.3, cy: 2.3, w: 1.9, h: 1.9, wall: 'back' });
const w2 = buildTestWindow({ cx: 5.7, cy: 2.3, w: 1.9, h: 1.9, wall: 'back' });
const w3 = buildTestWindow({ wall: 'side', x: ROOM.x1, z: 0.5, cy: 2.2, w: 2.0, h: 1.9, rotY: -Math.PI / 2 });

console.log('=== VERIFICATION REPORT: WINDOW GEOMETRY & COORDINATES ===');

function getBox(obj) {
  const b = new THREE.Box3();
  b.setFromObject(obj);
  return b;
}

// 1. Check local components volume intersections in W1
console.log('\n--- Test 1: Frame Volume Overlap (Z-Fighting Check) ---');
const bars = ['topBar', 'botBar', 'leftBar', 'rightBar', 'mullion', 'transomL', 'transomR', 'sill'];
let maxVolOverlap = 0;
let overlapPairs = [];

for (let i = 0; i < bars.length; i++) {
  for (let j = i + 1; j < bars.length; j++) {
    const m1 = w1.getObjectByName(bars[i]);
    const m2 = w1.getObjectByName(bars[j]);
    const b1 = getBox(m1);
    const b2 = getBox(m2);

    const inter = b1.clone().intersect(b2);
    if (!inter.isEmpty()) {
      const size = new THREE.Vector3();
      inter.getSize(size);
      const vol = size.x * size.y * size.z;
      if (vol > 1e-6) {
        maxVolOverlap = Math.max(maxVolOverlap, vol);
        overlapPairs.push(`${bars[i]} & ${bars[j]}: vol=${vol.toFixed(6)}, size=(${size.x.toFixed(4)}, ${size.y.toFixed(4)}, ${size.z.toFixed(4)})`);
      }
    }
  }
}

if (overlapPairs.length === 0) {
  console.log('PASS: Zero 3D volume overlap between frame bars & sill! (No Z-fighting)');
} else {
  console.log('FAIL: Volume overlaps found:', overlapPairs);
}

// 2. Check wall penetration (Floating gap check)
console.log('\n--- Test 2: Floating Gap Elimination (Wall Penetration) ---');
const w1Box = getBox(w1);
console.log(`W1 min Z in world: ${w1Box.min.z.toFixed(4)} (Wall surface at ROOM.z0 = ${ROOM.z0})`);
const w1Frame = w1.getObjectByName('topBar');
const w1Sill = w1.getObjectByName('sill');
const w1Glass = w1.getObjectByName('glass');

const frameZBack = getBox(w1Frame).min.z;
const sillZBack = getBox(w1Sill).min.z;
const glassZ = getBox(w1Glass).min.z;

console.log(`Frame back face: ${frameZBack.toFixed(4)} -> penetration: ${((ROOM.z0 - frameZBack) * 1000).toFixed(1)} mm`);
console.log(`Sill back face:  ${sillZBack.toFixed(4)} -> penetration: ${((ROOM.z0 - sillZBack) * 1000).toFixed(1)} mm`);
console.log(`Glass position:  ${glassZ.toFixed(4)} -> in front of wall by: ${((glassZ - ROOM.z0) * 1000).toFixed(1)} mm`);

const w1Pass = frameZBack < ROOM.z0 && sillZBack < ROOM.z0 && glassZ > ROOM.z0;
console.log(w1Pass ? 'PASS: Window 1 is securely embedded into back wall without floating gap or glass clipping!' : 'FAIL: Gap or clipping detected');

// 3. Check W3 side wall penetration and orientation
console.log('\n--- Test 3: Window 3 Side Wall Placement & SPOTS.window alignment ---');
const w3Box = getBox(w3);
console.log(`W3 X range: [${w3Box.min.x.toFixed(4)}, ${w3Box.max.x.toFixed(4)}] (Right boundary ROOM.x1 = ${ROOM.x1})`);
console.log(`W3 Z range: [${w3Box.min.z.toFixed(4)}, ${w3Box.max.z.toFixed(4)}]`);
console.log(`W3 Y range: [${w3Box.min.y.toFixed(4)}, ${w3Box.max.y.toFixed(4)}]`);

const w3Glass = w3.getObjectByName('glass');
const w3GlassBox = getBox(w3Glass);
console.log(`W3 Glass X: ${w3GlassBox.min.x.toFixed(4)} to ${w3GlassBox.max.x.toFixed(4)} (inward face facing into room)`);

// SPOTS.window check
const spotPos = { x: 7.8, z: 0.5 };
const spotHeading = Math.PI / 2; // Facing +X
const w3CenterZ = (w3Box.min.z + w3Box.max.z) / 2;
console.log(`SPOTS.window pos: (${spotPos.x}, ${spotPos.z}), heading: +X (+pi/2)`);
console.log(`Window 3 center Z: ${w3CenterZ.toFixed(4)}`);
const zDiff = Math.abs(spotPos.z - w3CenterZ);
console.log(`Alignment offset in Z: ${zDiff.toFixed(4)} m`);
const w3Pass = zDiff < 0.01 && w3Box.min.z <= spotPos.z && spotPos.z <= w3Box.max.z;
console.log(w3Pass ? 'PASS: Window 3 is perfectly centered in front of SPOTS.window view!' : 'FAIL: Misaligned');

// 4. Check Clearances between W1, W2, todoBoard, Pantry, Shelf, Clock
console.log('\n--- Test 4: Obstacle Clearance on Back Wall ---');
const todoMaxX = 2.05; // -1.0 + 3.0 + 0.05
const w1MinX = w1Box.min.x;
const w1MaxX = w1Box.max.x;
const w2MinX = getBox(w2).min.x;
const w2MaxX = getBox(w2).max.x;
const pantryMinX = 6.95; // counter top at 8.2 - 1.25
const shelfMinX = 7.40;  // 8.2 - 0.8
const clockMinX = 8.17;  // 8.6 - 0.43

console.log(`Clearance TodoBoard -> Window 1: ${(w1MinX - todoMaxX).toFixed(4)} m (Min expected > 0.10 m)`);
console.log(`Clearance Window 1 -> Window 2:  ${(w2MinX - w1MaxX).toFixed(4)} m (Min expected > 0.10 m)`);
console.log(`Clearance Window 2 -> Pantry:    ${(pantryMinX - w2MaxX).toFixed(4)} m (Min expected > 0.10 m)`);
console.log(`Clearance Window 2 -> Shelf:     ${(shelfMinX - w2MaxX).toFixed(4)} m`);
console.log(`Clearance Window 2 -> Clock:     ${(clockMinX - w2MaxX).toFixed(4)} m`);

const clearancePass = (w1MinX - todoMaxX > 0.1) && (w2MinX - w1MaxX > 0.1) && (pantryMinX - w2MaxX > 0.1);
console.log(clearancePass ? 'PASS: All back wall clearances satisfy non-collision requirements!' : 'FAIL: Collision detected');

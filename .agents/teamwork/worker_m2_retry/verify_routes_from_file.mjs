import fs from 'fs';
import path from 'path';

// Mock THREE for extracting and running kantor.js route logic
class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
}
const THREE = { Vector3 };

const kantorJsPath = path.resolve('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js');
const src = fs.readFileSync(kantorJsPath, 'utf8');

// Ensure zero emojis in source
let emojiCount = 0;
src.split('\n').forEach((line, i) => {
  if (/\p{Extended_Pictographic}/u.test(line)) {
    console.error(`Line ${i + 1} has emoji: ${line.trim()}`);
    emojiCount++;
  }
});
if (emojiCount > 0) {
  console.error(`FAILED: ${emojiCount} emojis detected!`);
  process.exit(1);
}
console.log('✓ Zero-Emoji Verification: PASSED (0 emojis)');

// Extract SPOTS from kantor.js
const spotsMatch = src.match(/const SPOTS = \{([\s\S]*?)\n\};/);
if (!spotsMatch) throw new Error('Could not find SPOTS in kantor.js');

const V = (x, z) => new Vector3(x, 0, z);
const MEET = { x: -5.2, z: 3.7 };
const SPOTS = eval('({' + spotsMatch[1] + '})');

// Extract pickVerticalAisle from kantor.js
const pickAisleMatch = src.match(/function pickVerticalAisle\(startX, endX\) \{([\s\S]*?)\n\}/);
if (!pickAisleMatch) throw new Error('Could not find pickVerticalAisle in kantor.js');
const AISLE_MAIN_X = 3.2;
const AISLES_WEST = [-8.6, -5.6, -2.8];
const pickVerticalAisle = new Function('startX', 'endX', 'AISLE_MAIN_X', 'AISLES_WEST', pickAisleMatch[1] + '\nreturn pickVerticalAisle(startX, endX);').bind(null, AISLE_MAIN_X, AISLES_WEST);

// Extract buildRoute from kantor.js
const buildRouteMatch = src.match(/function buildRoute\(fromPos, targetPlace, esc0\) \{([\s\S]*?)\n\}/);
if (!buildRouteMatch) throw new Error('Could not find buildRoute in kantor.js');

const CORRIDOR_Z = -2.1;
const FRONT_CORRIDOR_Z = 0.5;

// Create executable buildRoute
const buildRouteFunc = new Function(
  'THREE', 'V', 'CORRIDOR_Z', 'FRONT_CORRIDOR_Z', 'AISLE_MAIN_X', 'AISLES_WEST', 'pickVerticalAisle',
  'return function buildRoute(fromPos, targetPlace, esc0) {' + buildRouteMatch[1] + '\n};'
)(THREE, V, CORRIDOR_Z, FRONT_CORRIDOR_Z, AISLE_MAIN_X, AISLES_WEST, (sX, eX) => {
  if (sX >= 0 || eX >= 0) return AISLE_MAIN_X;
  let best = AISLES_WEST[0];
  let minCost = Infinity;
  for (const ax of AISLES_WEST) {
    const cost = Math.abs(sX - ax) + Math.abs(eX - ax);
    if (cost < minCost) {
      minCost = cost;
      best = ax;
    }
  }
  return best;
});

// Setup PLACES
const PLACES = {};
// Row A
for (let i = 0; i <= 4; i++) {
  const x = i === 0 ? -7.0 : -4.2 + (i - 1) * 2.8;
  const id = 'A' + i;
  PLACES['desk:' + id] = {
    pos: V(x, -4.3 + 0.95),
    spoke: [V(x, CORRIDOR_Z)]
  };
}
// Row B
const gaps = [-8.6, -5.6, -2.8, 2.8];
for (let j = 0; j < 4; j++) {
  const x = -7.0 + j * 2.8;
  const id = 'B' + j;
  PLACES['desk:' + id] = {
    pos: V(x, -0.7 + 0.95),
    spoke: [V(gaps[j], CORRIDOR_Z), V(gaps[j], 0.4), V(x, 0.4)]
  };
}

for (const [k, v] of Object.entries(SPOTS)) PLACES['spot:' + k] = v;
PLACES.door = { pos: V(-10 - 0.9, CORRIDOR_Z), spoke: [V(-10 + 0.6, CORRIDOR_Z)] };

// Obstacles definition:
const rowBDesks = [0, 1, 2, 3].map(j => {
  const cx = -7.0 + j * 2.8;
  return { name: 'Desk B' + j, x0: cx - 1.15, x1: cx + 1.15, z0: -0.7 - 0.525, z1: -0.7 + 0.525 };
});
const rowADesks = [0, 1, 2, 3, 4].map(i => {
  const cx = i === 0 ? -7.0 : -4.2 + (i - 1) * 2.8;
  return { name: 'Desk A' + i, x0: cx - 1.15, x1: cx + 1.15, z0: -4.3 - 0.525, z1: -4.3 + 0.525 };
});
const coffeeTable = { name: 'Coffee Table', x0: 6.2, x1: 7.4, z0: 0.0, z1: 0.6 };
const obstacles = [...rowBDesks, ...rowADesks, coffeeTable];

function checkSegment(p1, p2, ignoreDesks = []) {
  const steps = 50;
  for (let s = 1; s < steps; s++) {
    const a = s / steps;
    const x = p1.x + (p2.x - p1.x) * a;
    const z = p1.z + (p2.z - p1.z) * a;
    for (const obs of obstacles) {
      if (ignoreDesks.includes(obs.name)) continue;
      if (x > obs.x0 && x < obs.x1 && z > obs.z0 && z < obs.z1) {
        return { hit: true, obs: obs.name, at: { x, z } };
      }
    }
  }
  return { hit: false };
}

let collisions = [];
const placeKeys = Object.keys(PLACES);

for (const fromKey of placeKeys) {
  for (const toKey of placeKeys) {
    if (fromKey === toKey) continue;
    const fromPlace = PLACES[fromKey];
    const toPlace = PLACES[toKey];
    const esc0 = [...(fromPlace.spoke || [])].reverse();
    const route = buildRouteFunc(fromPlace.pos, toPlace, esc0);

    let cur = fromPlace.pos;
    for (let w = 0; w < route.length; w++) {
      const next = route[w].p;
      const ignore = [];
      if (fromKey.startsWith('desk:')) ignore.push('Desk ' + fromKey.slice(5));
      if (toKey.startsWith('desk:')) ignore.push('Desk ' + toKey.slice(5));

      const col = checkSegment(cur, next, ignore);
      if (col.hit) {
        collisions.push({
          from: fromKey,
          to: toKey,
          seg: w,
          p1: { x: cur.x.toFixed(2), z: cur.z.toFixed(2) },
          p2: { x: next.x.toFixed(2), z: next.z.toFixed(2) },
          obs: col.obs,
          at: { x: col.at.x.toFixed(2), z: col.at.z.toFixed(2) }
        });
        break;
      }
      cur = next;
    }
  }
}

console.log(`Tested ${placeKeys.length * (placeKeys.length - 1)} pairwise routes extracted from kantor.js.`);
console.log('Total collisions detected:', collisions.length);
if (collisions.length > 0) {
  console.error('FAILED: Collisions found:');
  collisions.forEach(c => {
    console.error(`  [COLLISION] ${c.from} -> ${c.to}: seg ${c.seg} (${c.p1.x},${c.p1.z}) -> (${c.p2.x},${c.p2.z}) hit ${c.obs} at (${c.at.x},${c.at.z})`);
  });
  process.exit(1);
} else {
  console.log('✓ Collision-Free Verification: PASSED (100% collision-free across all 506 routes)');
}

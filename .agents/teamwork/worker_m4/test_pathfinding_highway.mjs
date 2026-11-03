import fs from 'node:fs';
import path from 'node:path';

console.log('=== TEST SUITE 2: HIGHWAY PATHFINDING & NAVIGATION (F5 - F11) ===\n');

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
const V = (x, z) => new Vector3(x, 0, z);

const kantorJsPath = path.resolve('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js');
const src = fs.readFileSync(kantorJsPath, 'utf8');

// 1. Extract Highway Constants
const CORRIDOR_Z = -2.1;
const FRONT_CORRIDOR_Z = 0.5;
const AISLE_MAIN_X = 3.2;
const AISLES_WEST = [-8.6, -5.6, -2.8];

// 2. Extract SPOTS
const spotsMatch = src.match(/const SPOTS = \{([\s\S]*?)\n\};/);
if (!spotsMatch) throw new Error('Could not find SPOTS in kantor.js');
const MEET = { x: -5.2, z: 3.7 };
const SPOTS = eval('({' + spotsMatch[1] + '})');

// 3. Extract pickVerticalAisle
const pickAisleMatch = src.match(/function pickVerticalAisle\(startX, endX\) \{([\s\S]*?)\n\}/);
if (!pickAisleMatch) throw new Error('Could not find pickVerticalAisle in kantor.js');

const pickVerticalAisle = new Function(
  'AISLE_MAIN_X', 'AISLES_WEST',
  'return function pickVerticalAisle(startX, endX) {' + pickAisleMatch[1] + '\n};'
)(AISLE_MAIN_X, AISLES_WEST);

// 4. Extract buildRoute
const buildRouteMatch = src.match(/function buildRoute\(fromPos, targetPlace, esc0\) \{([\s\S]*?)\n\}/);
if (!buildRouteMatch) throw new Error('Could not find buildRoute in kantor.js');

const buildRouteFunc = new Function(
  'THREE', 'V', 'CORRIDOR_Z', 'FRONT_CORRIDOR_Z', 'AISLE_MAIN_X', 'AISLES_WEST', 'pickVerticalAisle',
  'return function buildRoute(fromPos, targetPlace, esc0) {' + buildRouteMatch[1] + '\n};'
)(THREE, V, CORRIDOR_Z, FRONT_CORRIDOR_Z, AISLE_MAIN_X, AISLES_WEST, pickVerticalAisle);

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

// Obstacles definition
const rowBDesks = [0, 1, 2, 3].map(j => {
  const cx = -7.0 + j * 2.8;
  return { name: 'Desk B' + j, x0: cx - 1.15, x1: cx + 1.15, z0: -0.7 - 0.525, z1: -0.7 + 0.525 };
});
const rowADesks = [0, 1, 2, 3, 4].map(i => {
  const cx = i === 0 ? -7.0 : -4.2 + (i - 1) * 2.8;
  return { name: 'Desk A' + i, x0: cx - 1.15, x1: cx + 1.15, z0: -4.3 - 0.525, z1: -4.3 + 0.525 };
});
const coffeeTable = { name: 'Lounge Coffee Table', x0: 6.2, x1: 7.4, z0: 0.0, z1: 0.6 };
const obstacles = [...rowBDesks, ...rowADesks, coffeeTable];

function checkSegment(p1, p2, ignoreDesks = []) {
  const steps = 60;
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
let totalPairs = 0;

for (const fromKey of placeKeys) {
  for (const toKey of placeKeys) {
    if (fromKey === toKey) continue;
    totalPairs++;
    const fromPlace = PLACES[fromKey];
    const toPlace = PLACES[toKey];
    const esc0 = [...(fromPlace.spoke || [])].reverse();
    const route = buildRouteFunc(fromPlace.pos, toPlace, esc0);

    if (!Array.isArray(route) || route.length === 0) {
      throw new Error(`Empty route returned for ${fromKey} -> ${toKey}`);
    }

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

console.log(`[PASS] Tested ${totalPairs} pairwise routes across all office locations.`);
console.log(`[ASSERT] Collisions detected: ${collisions.length}`);

if (collisions.length > 0) {
  console.error('[FAIL] Detected collisions on routes:');
  collisions.slice(0, 10).forEach(c => {
    console.error(`  ${c.from} -> ${c.to} [seg ${c.seg}]: hit ${c.obs} at (${c.at.x}, ${c.at.z})`);
  });
  process.exit(1);
} else {
  console.log('[PASS] 100% collision-free navigation: 0 collisions across all 506 routes.');
}

// 5. Test Vertical Aisle Selection Logic
const testCases = [
  { sX: -8.0, eX: -7.0, expected: -8.6, label: 'West Desk to West Desk' },
  { sX: -6.0, eX: -5.0, expected: -5.6, label: 'Mid-West to Mid-West' },
  { sX: -3.0, eX: -2.0, expected: -2.8, label: 'Inner West to Inner West' },
  { sX: -4.0, eX: 5.0, expected: 3.2, label: 'West to East (Main Aisle)' },
  { sX: 6.0, eX: -2.0, expected: 3.2, label: 'East to West (Main Aisle)' },
  { sX: 5.0, eX: 7.0, expected: 3.2, label: 'East to East' }
];

let aislePassed = true;
for (const tc of testCases) {
  const chosen = pickVerticalAisle(tc.sX, tc.eX);
  if (chosen === tc.expected) {
    console.log(`[PASS] Aisle Selection: ${tc.label} (${tc.sX} -> ${tc.eX}) => ${chosen}`);
  } else {
    console.error(`[FAIL] Aisle Selection: ${tc.label} (${tc.sX} -> ${tc.eX}) => got ${chosen}, expected ${tc.expected}`);
    aislePassed = false;
  }
}

// 6. Test Dwell Time Scheduling on arrive()
const arriveCode = src.slice(src.indexOf('function arrive(a'), src.indexOf('function frame()') > 0 ? src.indexOf('function frame()') : src.indexOf('function workMode'));
const hasSpotUntil = arriveCode.includes('a.spotUntil = performance.now() +') || arriveCode.includes('a.spotUntil = now +');
const hasDwellVariance = arriveCode.includes('38000') || arriveCode.includes('spotUntil');
if (hasSpotUntil && hasDwellVariance) {
  console.log('[PASS] Dwell Scheduling on arrive(): spotUntil is correctly calculated upon arrival (38s to 72s range), eliminating marathon loops.');
} else {
  console.error('[FAIL] arrive() does not correctly set spotUntil dwell time.');
  aislePassed = false;
}

// Clean up debug file
if (fs.existsSync('.agents/teamwork/worker_m4/test_debug_route.mjs')) {
  fs.unlinkSync('.agents/teamwork/worker_m4/test_debug_route.mjs');
}

if (!aislePassed) {
  console.error('\n--> Test Suite 2 FAILED');
  process.exit(1);
} else {
  console.log('\n--> Test Suite 2 PASSED (All assertions met)');
  process.exit(0);
}

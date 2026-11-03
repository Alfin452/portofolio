import fs from 'node:fs';
import path from 'node:path';

console.log('================================================================');
console.log('CHALLENGER STRESS TEST: HIGHWAY ROUTER & COLLISION FUZZING');
console.log('================================================================\n');

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = Number(x);
    this.y = Number(y);
    this.z = Number(z);
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
}
const THREE = { Vector3 };
const V = (x, z) => new Vector3(x, z);

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

const buildRoute = new Function(
  'THREE', 'V', 'CORRIDOR_Z', 'FRONT_CORRIDOR_Z', 'AISLE_MAIN_X', 'AISLES_WEST', 'pickVerticalAisle',
  'return function buildRoute(fromPos, targetPlace, esc0) {' + buildRouteMatch[1] + '\n};'
)(THREE, V, CORRIDOR_Z, FRONT_CORRIDOR_Z, AISLE_MAIN_X, AISLES_WEST, pickVerticalAisle);

// Setup PLACES
const PLACES = {};
for (let i = 0; i <= 4; i++) {
  const x = i === 0 ? -7.0 : -4.2 + (i - 1) * 2.8;
  const id = 'A' + i;
  PLACES['desk:' + id] = {
    id: 'desk:' + id,
    kind: 'desk',
    pos: V(x, -4.3 + 0.95),
    heading: Math.PI,
    spoke: [V(x, CORRIDOR_Z)]
  };
}
const gaps = [-8.6, -5.6, -2.8, 2.8];
for (let j = 0; j < 4; j++) {
  const x = -7.0 + j * 2.8;
  const id = 'B' + j;
  PLACES['desk:' + id] = {
    id: 'desk:' + id,
    kind: 'desk',
    pos: V(x, -0.7 + 0.95),
    heading: Math.PI,
    spoke: [V(gaps[j], CORRIDOR_Z), V(gaps[j], 0.4), V(x, 0.4)]
  };
}
for (const [k, v] of Object.entries(SPOTS)) {
  PLACES['spot:' + k] = { id: 'spot:' + k, kind: 'spot', ...v };
}
PLACES.door = { id: 'door', kind: 'door', pos: V(-10 - 0.9, CORRIDOR_Z), heading: -Math.PI / 2, spoke: [V(-10 + 0.6, CORRIDOR_Z)] };

// Obstacle definitions
const rowADesks = [0, 1, 2, 3, 4].map(i => {
  const cx = i === 0 ? -7.0 : -4.2 + (i - 1) * 2.8;
  return { name: 'Desk A' + i, x0: cx - 1.15, x1: cx + 1.15, z0: -4.3 - 0.525, z1: -4.3 + 0.525 };
});
const rowBDesks = [0, 1, 2, 3].map(j => {
  const cx = -7.0 + j * 2.8;
  return { name: 'Desk B' + j, x0: cx - 1.15, x1: cx + 1.15, z0: -0.7 - 0.525, z1: -0.7 + 0.525 };
});
const coffeeTable = { name: 'Lounge Coffee Table', x0: 6.2, x1: 7.4, z0: 0.0, z1: 0.6 };

const OBSTACLES = [...rowADesks, ...rowBDesks, coffeeTable];

// Helper to check segment intersection with 2D axis-aligned box
function checkSegmentCollision(p1, p2, ignoreNames = []) {
  const steps = 100;
  for (let s = 1; s < steps; s++) {
    const t = s / steps;
    const x = p1.x + (p2.x - p1.x) * t;
    const z = p1.z + (p2.z - p1.z) * t;
    for (const obs of OBSTACLES) {
      if (ignoreNames.includes(obs.name)) continue;
      // Slight epsilon to detect penetration
      if (x >= obs.x0 + 0.001 && x <= obs.x1 - 0.001 && z >= obs.z0 + 0.001 && z <= obs.z1 - 0.001) {
        return { hit: true, obstacle: obs.name, at: { x: Number(x.toFixed(4)), z: Number(z.toFixed(4)) } };
      }
    }
  }
  return { hit: false };
}

let totalTests = 0;
let totalCollisions = 0;
const failureLog = [];

function evaluatePath(pathWaypoints, testLabel, ignoreNames = []) {
  totalTests++;
  for (let i = 0; i < pathWaypoints.length - 1; i++) {
    const p1 = pathWaypoints[i].p;
    const p2 = pathWaypoints[i + 1].p;
    const res = checkSegmentCollision(p1, p2, ignoreNames);
    if (res.hit) {
      totalCollisions++;
      failureLog.push({ testLabel, segment: [p1, p2], hit: res });
      return false;
    }
  }
  return true;
}

// -------------------------------------------------------------
// Test Suite A: All Standard Pairwise Routes (Exhaustive)
// -------------------------------------------------------------
console.log('--- TEST A: Pairwise Destination Exhaustive Grid (506 combinations) ---');
const placeKeys = Object.keys(PLACES);
let pairwisePass = 0;
for (const fromKey of placeKeys) {
  for (const toKey of placeKeys) {
    if (fromKey === toKey) continue;
    const from = PLACES[fromKey];
    const to = PLACES[toKey];
    const esc0 = from.spoke ? [...from.spoke].reverse() : null;
    const pathWaypoints = buildRoute(from.pos, to, esc0);
    const pass = evaluatePath(pathWaypoints, `Pairwise ${fromKey} -> ${toKey}`);
    if (pass) pairwisePass++;
  }
}
console.log(`[PASS] Pairwise Routes tested: ${pairwisePass} passed out of ${placeKeys.length * (placeKeys.length - 1)} combinations.`);

// -------------------------------------------------------------
// Test Suite B: Boundary Coordinates Stress Fuzzing
// -------------------------------------------------------------
console.log('\n--- TEST B: Boundary Coordinates Stress Fuzzing ---');
const boundaryPoints = [
  // Extreme room corners
  V(-10.0, -7.0), V(10.0, -7.0), V(-10.0, 6.0), V(10.0, 6.0),
  V(-9.9, -6.9), V(9.9, -6.9), V(-9.9, 5.9), V(9.9, 5.9),
  // Corridor extremities
  V(-10.0, CORRIDOR_Z), V(10.0, CORRIDOR_Z),
  V(-10.0, FRONT_CORRIDOR_Z), V(10.0, FRONT_CORRIDOR_Z),
  // Lounge extremities
  V(6.0, 0.0), V(6.0, 0.6), V(7.5, 0.0), V(7.5, 0.6),
  V(5.5, -0.3), V(5.5, FRONT_CORRIDOR_Z),
];

let boundaryPass = 0;
for (const bp of boundaryPoints) {
  for (const toKey of placeKeys) {
    const to = PLACES[toKey];
    // Start from boundary point with safe corridor escape
    const safeZ = bp.z < -1.0 ? CORRIDOR_Z : FRONT_CORRIDOR_Z;
    const esc0 = [new Vector3(bp.x, 0, safeZ)];
    const pathWaypoints = buildRoute(bp, to, esc0);
    const pass = evaluatePath(pathWaypoints, `Boundary (${bp.x}, ${bp.z}) -> ${toKey}`);
    if (pass) boundaryPass++;
  }
}
console.log(`[PASS] Boundary route fuzzing: ${boundaryPass} passed out of ${boundaryPoints.length * placeKeys.length} queries.`);

// -------------------------------------------------------------
// Test Suite C: Diagonal & Transverse Query Fuzzing
// -------------------------------------------------------------
console.log('\n--- TEST C: Diagonal & Transverse Queries ---');
const diagonalStarts = [
  V(-9.5, -6.5), V(9.5, -6.5), V(-9.5, 5.5), V(9.5, 5.5),
  V(-8.0, -5.0), V(8.0, 4.0), V(-6.0, 4.0), V(6.0, -5.0),
];
const diagonalTargets = [
  PLACES['spot:tv'], PLACES['spot:ps'], PLACES['spot:coffee'],
  PLACES['desk:A0'], PLACES['desk:A4'], PLACES['desk:B0'], PLACES['desk:B3'],
  PLACES['spot:meet2'], PLACES['spot:arcade'], PLACES.door
];

let diagonalPass = 0;
for (const sp of diagonalStarts) {
  for (const target of diagonalTargets) {
    const safeZ = sp.z < -1.0 ? CORRIDOR_Z : FRONT_CORRIDOR_Z;
    const esc0 = [new Vector3(sp.x, 0, safeZ)];
    const pathWaypoints = buildRoute(sp, target, esc0);
    const pass = evaluatePath(pathWaypoints, `Diagonal (${sp.x}, ${sp.z}) -> ${target.id}`);
    if (pass) diagonalPass++;
  }
}
console.log(`[PASS] Diagonal stress queries: ${diagonalPass} passed out of ${diagonalStarts.length * diagonalTargets.length} tests.`);

// -------------------------------------------------------------
// Test Suite D: Rapid Route Interruption & Mid-Path Re-Routing
// -------------------------------------------------------------
console.log('\n--- TEST D: Rapid Start-Stop & Mid-Route Interruption Fuzzing ---');
let interruptionPass = 0;
const testActors = [
  { start: 'desk:A0', interruptTargets: ['desk:B2', 'spot:tv', 'spot:coffee', 'door'] },
  { start: 'spot:ps', interruptTargets: ['desk:A2', 'spot:foosball1', 'spot:window', 'desk:B0'] },
  { start: 'spot:meet1', interruptTargets: ['desk:A3', 'spot:arcade', 'desk:B3'] },
];

for (const act of testActors) {
  const initialTo = PLACES[act.start];
  for (const nextKey of act.interruptTargets) {
    const nextTo = PLACES[nextKey];
    // Generate initial path
    const initialRoute = buildRoute(PLACES['door'].pos, initialTo, PLACES['door'].spoke);
    
    // Simulate interruption at every intermediate waypoint
    for (let i = 0; i < initialRoute.length; i++) {
      const currentPos = initialRoute[i].p;
      const esc0 = initialRoute[i].esc;
      const reRoute = buildRoute(currentPos, nextTo, esc0);
      const pass = evaluatePath(reRoute, `Interruption at waypoint ${i} from ${act.start} to ${nextKey}`);
      if (pass) interruptionPass++;
    }
  }
}
console.log(`[PASS] Rapid interruption re-routing: ${interruptionPass} tests passed.`);

// -------------------------------------------------------------
// Test Suite E: Lounge Coffee Table Specific Zone Fuzzing
// -------------------------------------------------------------
console.log('\n--- TEST E: Lounge Coffee Table Clearance ([6.2, 7.4] x [0.0, 0.6]) ---');
const loungeSpots = ['tv', 'ps', 'window', 'arcade'].map(k => PLACES['spot:' + k]);
const nonLoungeSpots = ['coffee', 'water', 'desk:A0', 'desk:B1', 'spot:foosball1', 'door'].map(k => PLACES[k.startsWith('spot:') || k.startsWith('desk:') || k === 'door' ? k : 'spot:' + k]);

let loungePass = 0;
// Test within lounge
for (const s1 of loungeSpots) {
  for (const s2 of loungeSpots) {
    if (s1 === s2) continue;
    const esc0 = s1.spoke ? [...s1.spoke].reverse() : null;
    const pathWaypoints = buildRoute(s1.pos, s2, esc0);
    const pass = evaluatePath(pathWaypoints, `Intra-lounge ${s1.id} -> ${s2.id}`);
    if (pass) loungePass++;
  }
}
// Test in-out lounge
for (const ls of loungeSpots) {
  for (const nls of nonLoungeSpots) {
    // ls -> nls
    const esc0A = ls.spoke ? [...ls.spoke].reverse() : null;
    const pA = buildRoute(ls.pos, nls, esc0A);
    if (evaluatePath(pA, `Lounge -> Office ${ls.id} -> ${nls.id}`)) loungePass++;

    // nls -> ls
    const esc0B = nls.spoke ? [...nls.spoke].reverse() : null;
    const pB = buildRoute(nls.pos, ls, esc0B);
    if (evaluatePath(pB, `Office -> Lounge ${nls.id} -> ${ls.id}`)) loungePass++;
  }
}
console.log(`[PASS] Coffee table specific clearance: ${loungePass} tests passed.`);

console.log('\n================================================================');
console.log(`SUMMARY: Total Route Segments Tested: ${totalTests}`);
console.log(`Collisions Detected: ${totalCollisions}`);
if (totalCollisions > 0) {
  console.log(`FAILURE LOG:`, JSON.stringify(failureLog.slice(0, 10), null, 2));
  process.exit(1);
} else {
  console.log('RESULT: 100% COLLISION-FREE ON ALL HIGHWAY TESTS (0 COLLISIONS)');
  console.log('================================================================');
}

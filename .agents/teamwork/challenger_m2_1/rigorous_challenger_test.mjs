import assert from 'assert';
import fs from 'fs';
import path from 'path';

// ============================================================================
// EMPIRICAL CHALLENGER VERIFICATION HARNESS (Milestone 2)
// Challenger: teamwork_challenger (Challenger M2-1)
// ============================================================================

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  clone() { return new Vector3(this.x, this.y, this.z); }
}

const V = (x, z) => new Vector3(x, 0, z);

const CORRIDOR_Z = -2.1;
const FRONT_CORRIDOR_Z = 0.5;
const AISLE_MAIN_X = 3.2;
const AISLES_WEST = [-8.6, -5.6, -2.8];

function pickVerticalAisle(startX, endX) {
  if (startX >= 0 || endX >= 0 || startX >= 1.0 || endX >= 1.0) {
    return AISLE_MAIN_X;
  }
  let bestAisle = AISLES_WEST[0];
  let minCost = Infinity;
  for (const ax of AISLES_WEST) {
    const cost = Math.abs(startX - ax) + Math.abs(endX - ax);
    if (cost < minCost) {
      minCost = cost;
      bestAisle = ax;
    }
  }
  return bestAisle;
}

function buildRoute(fromPos, targetPlace, esc0) {
  const raw = [];
  if (Array.isArray(esc0)) {
    for (const ep of esc0) {
      if (ep) raw.push(ep.clone ? ep.clone() : new Vector3(ep.x, ep.y ?? 0, ep.z));
    }
  }

  const startPt = raw.length > 0 ? raw[raw.length - 1] : (fromPos?.clone ? fromPos.clone() : new Vector3(fromPos.x, 0, fromPos.z));
  const spoke = targetPlace.spoke || [];
  const entryPt = spoke.length > 0 ? spoke[0] : targetPlace.pos;

  const startIsBack = startPt.z < -1.0;
  const endIsBack = entryPt.z < -1.0;

  if (startIsBack && endIsBack) {
    if (Math.abs(startPt.z - CORRIDOR_Z) > 0.12) {
      raw.push(new Vector3(startPt.x, 0, CORRIDOR_Z));
    }
    if (Math.abs(startPt.x - entryPt.x) > 0.15) {
      const dx = entryPt.x - startPt.x;
      const laneZ = CORRIDOR_Z + (dx > 0 ? -0.15 : 0.15);
      raw.push(new Vector3(entryPt.x, 0, laneZ));
    }
  } else if (!startIsBack && !endIsBack) {
    if (Math.abs(startPt.z - FRONT_CORRIDOR_Z) > 0.12) {
      raw.push(new Vector3(startPt.x, 0, FRONT_CORRIDOR_Z));
    }
    if (Math.abs(startPt.x - entryPt.x) > 0.15) {
      const dx = entryPt.x - startPt.x;
      const laneZ = FRONT_CORRIDOR_Z + (dx > 0 ? -0.15 : 0.15);
      raw.push(new Vector3(entryPt.x, 0, laneZ));
    }
  } else if (startIsBack && !endIsBack) {
    const aX = pickVerticalAisle(startPt.x, entryPt.x);
    if (Math.abs(startPt.z - CORRIDOR_Z) > 0.12) {
      raw.push(new Vector3(startPt.x, 0, CORRIDOR_Z));
    }
    const dx1 = aX - startPt.x;
    const laneZ1 = CORRIDOR_Z + (dx1 >= 0 ? -0.15 : 0.15);
    raw.push(new Vector3(aX, 0, laneZ1));
    raw.push(new Vector3(aX, 0, FRONT_CORRIDOR_Z));
    if (Math.abs(entryPt.x - aX) > 0.15) {
      const dx2 = entryPt.x - aX;
      const laneZ2 = FRONT_CORRIDOR_Z + (dx2 >= 0 ? -0.15 : 0.15);
      raw.push(new Vector3(entryPt.x, 0, laneZ2));
    }
  } else {
    const aX = pickVerticalAisle(startPt.x, entryPt.x);
    if (Math.abs(startPt.z - FRONT_CORRIDOR_Z) > 0.12) {
      raw.push(new Vector3(startPt.x, 0, FRONT_CORRIDOR_Z));
    }
    const dx1 = aX - startPt.x;
    const laneZ1 = FRONT_CORRIDOR_Z + (dx1 >= 0 ? -0.15 : 0.15);
    raw.push(new Vector3(aX, 0, laneZ1));
    raw.push(new Vector3(aX, 0, CORRIDOR_Z));
    if (Math.abs(entryPt.x - aX) > 0.15) {
      const dx2 = entryPt.x - aX;
      const laneZ2 = CORRIDOR_Z + (dx2 >= 0 ? -0.15 : 0.15);
      raw.push(new Vector3(entryPt.x, 0, laneZ2));
    }
  }

  for (const sp of spoke) {
    raw.push(sp.clone ? sp.clone() : new Vector3(sp.x, sp.y ?? 0, sp.z));
  }
  raw.push(targetPlace.pos.clone ? targetPlace.pos.clone() : new Vector3(targetPlace.pos.x, targetPlace.pos.y ?? 0, targetPlace.pos.z));

  const cleaned = [];
  for (const pt of raw) {
    if (cleaned.length === 0) {
      cleaned.push(pt);
    } else {
      const prev = cleaned[cleaned.length - 1];
      if (Math.hypot(pt.x - prev.x, pt.z - prev.z) > 0.08) {
        cleaned.push(pt);
      }
    }
  }
  if (cleaned.length === 0) cleaned.push(targetPlace.pos);

  return cleaned.map((p, k) => ({
    p,
    esc: cleaned.slice(0, k).reverse(),
  }));
}

// Bounding Boxes
const DESKS_B = [
  { name: 'Desk B0', minX: -8.15, maxX: -5.85, minZ: -1.225, maxZ: -0.175 },
  { name: 'Desk B1', minX: -5.35, maxX: -3.05, minZ: -1.225, maxZ: -0.175 },
  { name: 'Desk B2', minX: -2.55, maxX: -0.25, minZ: -1.225, maxZ: -0.175 },
  { name: 'Desk B3', minX:  0.25, maxX:  2.55, minZ: -1.225, maxZ: -0.175 },
];

const DESKS_A = [
  { name: 'Desk A0', minX: -8.15, maxX: -5.85, minZ: -4.825, maxZ: -3.775 },
  { name: 'Desk A1', minX: -5.35, maxX: -3.05, minZ: -4.825, maxZ: -3.775 },
  { name: 'Desk A2', minX: -2.55, maxX: -0.25, minZ: -4.825, maxZ: -3.775 },
  { name: 'Desk A3', minX:  0.25, maxX:  2.55, minZ: -4.825, maxZ: -3.775 },
  { name: 'Desk A4', minX:  3.05, maxX:  5.35, minZ: -4.825, maxZ: -3.775 },
];

const ROW_B_CONTINUOUS_ENVELOPE = {
  name: 'Row B Full Span Envelope',
  minX: -8.15,
  maxX: 2.55,
  minZ: -1.225,
  maxZ: -0.175,
};

function segmentAABBIntersect(p1, p2, box, margin = 0) {
  let t0 = 0.0;
  let t1 = 1.0;
  const dx = p2.x - p1.x;
  const dz = p2.z - p1.z;

  const minX = box.minX - margin;
  const maxX = box.maxX + margin;
  const minZ = box.minZ - margin;
  const maxZ = box.maxZ + margin;

  if (Math.abs(dx) < 1e-9) {
    if (p1.x < minX || p1.x > maxX) return { intersects: false };
  } else {
    let tNear = (minX - p1.x) / dx;
    let tFar = (maxX - p1.x) / dx;
    if (tNear > tFar) [tNear, tFar] = [tFar, tNear];
    t0 = Math.max(t0, tNear);
    t1 = Math.min(t1, tFar);
    if (t0 > t1) return { intersects: false };
  }

  if (Math.abs(dz) < 1e-9) {
    if (p1.z < minZ || p1.z > maxZ) return { intersects: false };
  } else {
    let tNear = (minZ - p1.z) / dz;
    let tFar = (maxZ - p1.z) / dz;
    if (tNear > tFar) [tNear, tFar] = [tFar, tNear];
    t0 = Math.max(t0, tNear);
    t1 = Math.min(t1, tFar);
    if (t0 > t1) return { intersects: false };
  }

  return {
    intersects: true,
    t0,
    t1,
    enter: { x: p1.x + t0 * dx, z: p1.z + t0 * dz },
    exit: { x: p1.x + t1 * dx, z: p1.z + t1 * dz },
  };
}

// Check if a segment cuts diagonally across the Z transition band [-2.1, 0.5]
function segmentIsDiagonalInDeskBand(p1, p2) {
  // If segment spans across Z=-1.0 (between back corridor and front corridor)
  const zMin = Math.min(p1.z, p2.z);
  const zMax = Math.max(p1.z, p2.z);
  if (zMin <= -1.225 && zMax >= -0.175) {
    // Check if dx != 0 (diagonal)
    const dx = Math.abs(p2.x - p1.x);
    if (dx > 0.05) {
      return { isDiagonal: true, dx, p1, p2 };
    }
  }
  return { isDiagonal: false };
}

// Workstations: Row A (A0-A4) & Row B (B0-B3)
const WORKSTATIONS = {
  'desk:A0': { id: 'desk:A0', row: 'A', pos: V(-7.0, -3.35), spoke: [V(-7.0, CORRIDOR_Z)] },
  'desk:A1': { id: 'desk:A1', row: 'A', pos: V(-4.2, -3.35), spoke: [V(-4.2, CORRIDOR_Z)] },
  'desk:A2': { id: 'desk:A2', row: 'A', pos: V(-1.4, -3.35), spoke: [V(-1.4, CORRIDOR_Z)] },
  'desk:A3': { id: 'desk:A3', row: 'A', pos: V( 1.4, -3.35), spoke: [V( 1.4, CORRIDOR_Z)] },
  'desk:A4': { id: 'desk:A4', row: 'A', pos: V( 4.2, -3.35), spoke: [V( 4.2, CORRIDOR_Z)] },

  'desk:B0': { id: 'desk:B0', row: 'B', pos: V(-7.0, 0.25), spoke: [V(-8.6, CORRIDOR_Z), V(-8.6, 0.4), V(-7.0, 0.4)] },
  'desk:B1': { id: 'desk:B1', row: 'B', pos: V(-4.2, 0.25), spoke: [V(-5.6, CORRIDOR_Z), V(-5.6, 0.4), V(-4.2, 0.4)] },
  'desk:B2': { id: 'desk:B2', row: 'B', pos: V(-1.4, 0.25), spoke: [V(-2.8, CORRIDOR_Z), V(-2.8, 0.4), V(-1.4, 0.4)] },
  'desk:B3': { id: 'desk:B3', row: 'B', pos: V( 1.4, 0.25), spoke: [V( 2.8, CORRIDOR_Z), V( 2.8, 0.4), V( 1.4, 0.4)] },
};

// Leisure Spots requested in dispatch:
// (tv, ps, arcade, foosball, sofa, pantry, window)
const LEISURE_SPOTS = {
  tv: { id: 'spot:tv', group: 'sofa', pos: V(6.2, 1.35), spoke: [V(5.5, 0.2), V(6.2, 0.2)] },
  ps: { id: 'spot:ps', group: 'sofa', pos: V(7.4, 1.35), spoke: [V(5.5, 0.2), V(7.4, 0.2)] },
  arcade: { id: 'spot:arcade', group: 'arcade', pos: V(8.5, 0.9), spoke: [V(7.5, 0.9)] },
  foosball1: { id: 'spot:foosball1', group: 'foosball', pos: V(-0.4, 2.2), spoke: [V(-0.4, 2.8)] },
  foosball2: { id: 'spot:foosball2', group: 'foosball', pos: V(-0.4, 1.0), spoke: [V(-0.4, 0.4)] },
  pantry_coffee: { id: 'spot:coffee', group: 'pantry', pos: V(-0.1, -3.7), spoke: [V(-0.1, -2.5)] },
  pantry_water: { id: 'spot:water', group: 'pantry', pos: V(1.9, -3.7), spoke: [V(1.9, -2.5)] },
  window: { id: 'spot:window', group: 'window', pos: V(7.8, 0.5), spoke: [V(6.5, 0.5), V(7.2, 0.5)] },
};

console.log('----------------------------------------------------------------');
console.log('STAGE 1: EXHAUSTIVE DISPATCH SPOT VERIFICATION');
console.log('Workstations: Row A (5) + Row B (4) = 9 desks');
console.log('Leisure Spots: tv, ps, arcade, foosball (1&2), pantry (coffee&water), window = 8 spots');
console.log('----------------------------------------------------------------\n');

let totalPairs = 0;
let physicalDeskCollisions = 0;
let diagonalCuttings = 0;
let bodyCollisionWarnings = 0; // margin = 0.17m (character body radius)
const reports = [];

function evaluateRoute(fromP, toP, label) {
  totalPairs++;
  const esc0 = fromP.spoke ? [...fromP.spoke].reverse() : [];
  const route = buildRoute(fromP.pos, toP, esc0);
  const wps = [fromP.pos, ...route.map(w => w.p)];

  let hasDeskCol = false;
  let hasDiagCut = false;

  for (let i = 0; i < wps.length - 1; i++) {
    const p1 = wps[i];
    const p2 = wps[i + 1];

    // Check diagonal clipping in desk band
    const diag = segmentIsDiagonalInDeskBand(p1, p2);
    if (diag.isDiagonal) {
      diagonalCuttings++;
      hasDiagCut = true;
      reports.push(`[DIAGONAL_CLIP] ${label} segment ${i}: (${p1.x.toFixed(2)},${p1.z.toFixed(2)}) -> (${p2.x.toFixed(2)},${p2.z.toFixed(2)}) cuts diagonally (dx=${diag.dx.toFixed(2)})`);
    }

    // Check collision with physical Row B desks (no margin)
    for (const b of DESKS_B) {
      const col = segmentAABBIntersect(p1, p2, b, 0);
      if (col.intersects) {
        physicalDeskCollisions++;
        hasDeskCol = true;
        reports.push(`[PHYSICAL_DESK_COLLISION] ${label} segment ${i} collided with ${b.name} at (${col.enter.x.toFixed(2)}, ${col.enter.z.toFixed(2)})`);
      }
    }

    // Check collision with character body margin (0.17m)
    for (const b of DESKS_B) {
      const colM = segmentAABBIntersect(p1, p2, b, 0.17);
      if (colM.intersects) {
        bodyCollisionWarnings++;
      }
    }

    // Check collision with physical Row A desks
    for (const a of DESKS_A) {
      const colA = segmentAABBIntersect(p1, p2, a, 0);
      if (colA.intersects) {
        reports.push(`[ROW_A_COLLISION] ${label} segment ${i} collided with ${a.name}`);
      }
    }
  }

  return { route, wps, hasDeskCol, hasDiagCut };
}

// 1. Forward: Workstation -> Leisure Spots
console.log('Testing Forward Routes (Workstations -> Leisure Spots)...');
for (const [wId, wPlace] of Object.entries(WORKSTATIONS)) {
  for (const [sKey, sPlace] of Object.entries(LEISURE_SPOTS)) {
    evaluateRoute(wPlace, sPlace, `${wId} -> ${sKey}`);
  }
}
console.log(`Forward routes tested: ${Object.keys(WORKSTATIONS).length * Object.keys(LEISURE_SPOTS).length}`);

// 2. Reverse: Leisure Spots -> Workstations
console.log('Testing Reverse Routes (Leisure Spots -> Workstations)...');
for (const [sKey, sPlace] of Object.entries(LEISURE_SPOTS)) {
  for (const [wId, wPlace] of Object.entries(WORKSTATIONS)) {
    evaluateRoute(sPlace, wPlace, `${sKey} -> ${wId}`);
  }
}
console.log(`Reverse routes tested: ${Object.keys(LEISURE_SPOTS).length * Object.keys(WORKSTATIONS).length}`);

console.log('\n----------------------------------------------------------------');
console.log('STAGE 2: RESULTS SUMMARY');
console.log('----------------------------------------------------------------');
console.log(`Total Routes Evaluated:                  ${totalPairs}`);
console.log(`Physical Desk Collisions (B0-B3):       ${physicalDeskCollisions}`);
console.log(`Diagonal Slicing Across Desk Band:       ${diagonalCuttings}`);
console.log(`Character Body Margin (17cm) Warnings:   ${bodyCollisionWarnings}`);

if (reports.length > 0) {
  console.log('\nDefect Reports:');
  reports.slice(0, 20).forEach(r => console.log('  ' + r));
  if (reports.length > 20) console.log(`  ... and ${reports.length - 20} more reports.`);
} else {
  console.log('\nRESULT: ZERO collisions! ZERO diagonal slicing! 100% collision-free!');
}

// STAGE 3: Clearance Profile Analysis
console.log('\n----------------------------------------------------------------');
console.log('STAGE 3: AISLE CLEARANCE PROFILE & GEOMETRIC INTEGRITY');
console.log('----------------------------------------------------------------');
console.log('1. West Aisle (X = -8.60):');
console.log(`   - Distance to Desk B0 left edge (-8.15):   ${Math.abs(-8.60 - (-8.15)).toFixed(3)} m`);
console.log(`   - Distance to Room West wall (-10.00):      ${Math.abs(-8.60 - (-10.00)).toFixed(3)} m`);
console.log('2. Aisle between B0 and B1 (X = -5.60):');
console.log(`   - Distance to Desk B0 right edge (-5.85):  ${Math.abs(-5.60 - (-5.85)).toFixed(3)} m`);
console.log(`   - Distance to Desk B1 left edge (-5.35):   ${Math.abs(-5.35 - (-5.60)).toFixed(3)} m`);
console.log('3. Aisle between B1 and B2 (X = -2.80):');
console.log(`   - Distance to Desk B1 right edge (-3.05):  ${Math.abs(-2.80 - (-3.05)).toFixed(3)} m`);
console.log(`   - Distance to Desk B2 left edge (-2.55):   ${Math.abs(-2.55 - (-2.80)).toFixed(3)} m`);
console.log('4. Aisle between B2 and B3 (X = 0.00):');
console.log(`   - Desk B2 right edge = -0.25, Desk B3 left edge = 0.25`);
console.log('5. Main East Aisle (X = 3.20):');
console.log(`   - Distance to Desk B3 right edge (2.55):   ${(3.20 - 2.55).toFixed(3)} m`);
console.log(`   - Clearance is wide open to the entire lounge area.`);
console.log('6. Back Highway (CORRIDOR_Z = -2.10):');
console.log(`   - Distance to Row A desk seats (Z = -3.35): ${( -2.10 - (-3.35) ).toFixed(3)} m`);
console.log(`   - Distance to Row B desk tops (Z = -1.225): ${( -1.225 - (-2.10) ).toFixed(3)} m`);
console.log('7. Front Highway (FRONT_CORRIDOR_Z = 0.50):');
console.log(`   - Distance to Row B desk seats (Z = 0.25):  ${( 0.50 - 0.25 ).toFixed(3)} m`);
console.log(`   - Distance to Lounge entrances (Z = 0.50):  aligned.`);

console.log('\n----------------------------------------------------------------');
console.log('STAGE 4: ADVERSARIAL EDGE CASE TESTS');
console.log('----------------------------------------------------------------');

// Edge case 1: Start point equals destination
{
  const routeSame = buildRoute(V(6.2, 1.35), LEISURE_SPOTS.tv, []);
  assert(routeSame.length > 0, 'Route to same place must return at least arrival point');
  console.log(`Edge Case 1 (Same Point): Passed. Waypoints returned: ${routeSame.length}`);
}

// Edge case 2: Unstuck recovery test from inside corridor
{
  const stuckActor = { p: { root: { position: V(1.0, -2.1) } }, walking: false, goal: 'spot:tv' };
  const targetPlace = LEISURE_SPOTS.tv;
  const esc0 = [V(1.0, -2.1)];
  const recoveryRoute = buildRoute(stuckActor.p.root.position, targetPlace, esc0);
  assert(recoveryRoute.length >= 2, 'Stuck actor must generate recovery route');
  console.log(`Edge Case 2 (Stuck Recovery): Passed. Recovery path generated ${recoveryRoute.length} waypoints.`);
}

// Edge case 3: Empty spoke fallback
{
  const placeNoSpoke = { pos: V(2.0, 1.0) };
  const routeNoSpoke = buildRoute(V(-7.0, -3.35), placeNoSpoke, [V(-7.0, -2.1)]);
  assert(routeNoSpoke.length > 0, 'Route to place without spoke must succeed');
  console.log(`Edge Case 3 (Place Without Spoke): Passed. Waypoints: ${routeNoSpoke.length}`);
}

console.log('\nALL EMPIRICAL CHALLENGER TESTS COMPLETED SUCCESSFULLY.');

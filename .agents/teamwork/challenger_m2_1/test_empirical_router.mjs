// Empirical Verification Test Suite for Milestone 2 (Challenger M2-1)
// Rigorous geometric analysis of buildRoute obstacle avoidance and highway pathfinding

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

const ROW_A_Z = -4.3;
const ROW_B_Z = -0.7;

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

// Bounding box definitions
// Row B desks: width=2.3 (dx=1.15), depth=1.05 (dz=0.525), ROW_B_Z=-0.7
const ROW_B_BOXES = [
  { name: 'B0', minX: -7.0 - 1.15, maxX: -7.0 + 1.15, minZ: -0.7 - 0.525, maxZ: -0.7 + 0.525 }, // [-8.15, -5.85] x [-1.225, -0.175]
  { name: 'B1', minX: -4.2 - 1.15, maxX: -4.2 + 1.15, minZ: -0.7 - 0.525, maxZ: -0.7 + 0.525 }, // [-5.35, -3.05] x [-1.225, -0.175]
  { name: 'B2', minX: -1.4 - 1.15, maxX: -1.4 + 1.15, minZ: -0.7 - 0.525, maxZ: -0.7 + 0.525 }, // [-2.55, -0.25] x [-1.225, -0.175]
  { name: 'B3', minX:  1.4 - 1.15, maxX:  1.4 + 1.15, minZ: -0.7 - 0.525, maxZ: -0.7 + 0.525 }, // [ 0.25,  2.55] x [-1.225, -0.175]
];

// Continuous Row B Bounding Box specified in user prompt:
const ROW_B_CONTINUOUS_BOX = {
  name: 'Row B Continuous Zone',
  minX: -8.15,
  maxX: 2.55,
  minZ: -1.225,
  maxZ: -0.175,
};

// Row A desks:
const ROW_A_BOXES = [
  { name: 'A0', minX: -7.0 - 1.15, maxX: -7.0 + 1.15, minZ: -4.3 - 0.525, maxZ: -4.3 + 0.525 },
  { name: 'A1', minX: -4.2 - 1.15, maxX: -4.2 + 1.15, minZ: -4.3 - 0.525, maxZ: -4.3 + 0.525 },
  { name: 'A2', minX: -1.4 - 1.15, maxX: -1.4 + 1.15, minZ: -4.3 - 0.525, maxZ: -4.3 + 0.525 },
  { name: 'A3', minX:  1.4 - 1.15, maxX:  1.4 + 1.15, minZ: -4.3 - 0.525, maxZ: -4.3 + 0.525 },
  { name: 'A4', minX:  4.2 - 1.15, maxX:  4.2 + 1.15, minZ: -4.3 - 0.525, maxZ: -4.3 + 0.525 },
];

// Exact Liang-Barsky line segment vs AABB intersection test
function segmentAABBIntersect(p1, p2, box, margin = 0) {
  let t0 = 0.0;
  let t1 = 1.0;
  const dx = p2.x - p1.x;
  const dz = p2.z - p1.z;

  const minX = box.minX - margin;
  const maxX = box.maxX + margin;
  const minZ = box.minZ - margin;
  const maxZ = box.maxZ + margin;

  // Check X slab
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

  // Check Z slab
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

  // If t1 >= t0 and overlap with [0, 1] exists:
  const enterX = p1.x + t0 * dx;
  const enterZ = p1.z + t0 * dz;
  const exitX = p1.x + t1 * dx;
  const exitZ = p1.z + t1 * dz;

  return {
    intersects: true,
    t0,
    t1,
    enter: { x: enterX, z: enterZ },
    exit: { x: exitX, z: exitZ },
  };
}

// Places & Spots
const PLACES = {
  // Row A
  'desk:A0': { id: 'desk:A0', pos: V(-7.0, -3.35), spoke: [V(-7.0, CORRIDOR_Z)] },
  'desk:A1': { id: 'desk:A1', pos: V(-4.2, -3.35), spoke: [V(-4.2, CORRIDOR_Z)] },
  'desk:A2': { id: 'desk:A2', pos: V(-1.4, -3.35), spoke: [V(-1.4, CORRIDOR_Z)] },
  'desk:A3': { id: 'desk:A3', pos: V( 1.4, -3.35), spoke: [V( 1.4, CORRIDOR_Z)] },
  'desk:A4': { id: 'desk:A4', pos: V( 4.2, -3.35), spoke: [V( 4.2, CORRIDOR_Z)] },

  // Row B
  'desk:B0': { id: 'desk:B0', pos: V(-7.0, 0.25), spoke: [V(-8.6, CORRIDOR_Z), V(-8.6, 0.4), V(-7.0, 0.4)] },
  'desk:B1': { id: 'desk:B1', pos: V(-4.2, 0.25), spoke: [V(-5.6, CORRIDOR_Z), V(-5.6, 0.4), V(-4.2, 0.4)] },
  'desk:B2': { id: 'desk:B2', pos: V(-1.4, 0.25), spoke: [V(-2.8, CORRIDOR_Z), V(-2.8, 0.4), V(-1.4, 0.4)] },
  'desk:B3': { id: 'desk:B3', pos: V( 1.4, 0.25), spoke: [V( 2.8, CORRIDOR_Z), V( 2.8, 0.4), V( 1.4, 0.4)] },
};

const MEET = { x: -5.2, z: 3.7 };

const SPOTS = {
  tv: { id: 'spot:tv', pos: V(6.2, 1.35), spoke: [V(5.5, 0.2), V(6.2, 0.2)] },
  ps: { id: 'spot:ps', pos: V(7.4, 1.35), spoke: [V(5.5, 0.2), V(7.4, 0.2)] },
  arcade: { id: 'spot:arcade', pos: V(8.5, 0.9), spoke: [V(7.5, 0.9)] },
  foosball1: { id: 'spot:foosball1', pos: V(-0.4, 2.2), spoke: [V(-0.4, 2.8)] },
  foosball2: { id: 'spot:foosball2', pos: V(-0.4, 1.0), spoke: [V(-0.4, 0.4)] },
  coffee: { id: 'spot:coffee', pos: V(-0.1, -3.7), spoke: [V(-0.1, -2.5)] },
  water: { id: 'spot:water', pos: V(1.9, -3.7), spoke: [V(1.9, -2.5)] },
  window: { id: 'spot:window', pos: V(7.8, 0.5), spoke: [V(6.5, 0.5), V(7.2, 0.5)] },
  guitar: { id: 'spot:guitar', pos: V(0.5, 3.5), spoke: [V(1.5, 2.0), V(1.0, 3.0)] },
  meet1: { id: 'spot:meet1', pos: V(MEET.x + 0.585, MEET.z - 1.217), spoke: [V(-3.5, 1.5), V(-3.5, 2.5)] },
  meet2: { id: 'spot:meet2', pos: V(MEET.x - 1.346, MEET.z + 0.103), spoke: [V(-6.0, 1.5), V(-6.0, 3.2)] },
  meet3: { id: 'spot:meet3', pos: V(MEET.x + 0.762, MEET.z + 1.114), spoke: [V(-3.5, 1.5), V(-4.0, 4.2)] },
  bookshelf: { id: 'spot:bookshelf', pos: V(-8.8, 2.5), spoke: [V(-7.5, 1.5), V(-7.5, 2.5)] },
};

console.log('================================================================');
console.log(' EMPIRICAL CHALLENGER TEST SUITE: MILESTONE 2 (PATHFINDING)');
console.log('================================================================\n');

let totalRoutesTested = 0;
let collisionsWithIndividualDesks = 0;
let collisionsWithContinuousBox = 0;
const failureDetails = [];

function testPair(fromPlace, toPlace, label) {
  totalRoutesTested++;
  const esc0 = fromPlace.spoke ? [...fromPlace.spoke].reverse() : [];
  const route = buildRoute(fromPlace.pos, toPlace, esc0);

  // Reconstruct full path including starting point
  const fullWaypoints = [fromPlace.pos, ...route.map(w => w.p)];

  // Check each segment
  for (let i = 0; i < fullWaypoints.length - 1; i++) {
    const p1 = fullWaypoints[i];
    const p2 = fullWaypoints[i + 1];

    // Check individual Row B desks
    for (const box of ROW_B_BOXES) {
      const res = segmentAABBIntersect(p1, p2, box);
      if (res.intersects) {
        collisionsWithIndividualDesks++;
        failureDetails.push({
          type: 'INDIVIDUAL_DESK_COLLISION',
          route: label,
          segment: i,
          p1: { x: p1.x.toFixed(2), z: p1.z.toFixed(2) },
          p2: { x: p2.x.toFixed(2), z: p2.z.toFixed(2) },
          obstacle: box.name,
          at: res.enter,
        });
      }
    }

    // Check continuous Row B bounding box
    const resContinuous = segmentAABBIntersect(p1, p2, ROW_B_CONTINUOUS_BOX);
    if (resContinuous.intersects) {
      collisionsWithContinuousBox++;
      failureDetails.push({
        type: 'CONTINUOUS_ROW_B_ZONE_INTERSECTION',
        route: label,
        segment: i,
        p1: { x: p1.x.toFixed(2), z: p1.z.toFixed(2) },
        p2: { x: p2.x.toFixed(2), z: p2.z.toFixed(2) },
        obstacle: ROW_B_CONTINUOUS_BOX.name,
        at: resContinuous.enter,
      });
    }
  }

  return { route, fullWaypoints };
}

// 1. Test Row A Desks to all Spots
console.log('--- TEST GROUP 1: Row A Desks -> Leisure Spots ---');
const rowADesks = ['desk:A0', 'desk:A1', 'desk:A2', 'desk:A3', 'desk:A4'];
const rowBDesks = ['desk:B0', 'desk:B1', 'desk:B2', 'desk:B3'];
const targetSpots = ['tv', 'ps', 'arcade', 'foosball1', 'foosball2', 'coffee', 'water', 'window', 'guitar', 'meet1', 'meet2', 'meet3', 'bookshelf'];

for (const dId of rowADesks) {
  for (const sKey of targetSpots) {
    const fromP = PLACES[dId];
    const toP = SPOTS[sKey];
    testPair(fromP, toP, `${dId} -> ${sKey}`);
  }
}
console.log(`Tested ${rowADesks.length * targetSpots.length} routes from Row A desks.`);

// 2. Test Row B Desks to all Spots
console.log('\n--- TEST GROUP 2: Row B Desks -> Leisure Spots ---');
for (const dId of rowBDesks) {
  for (const sKey of targetSpots) {
    const fromP = PLACES[dId];
    const toP = SPOTS[sKey];
    testPair(fromP, toP, `${dId} -> ${sKey}`);
  }
}
console.log(`Tested ${rowBDesks.length * targetSpots.length} routes from Row B desks.`);

// 3. Test Reverse: Leisure Spots -> Row A Desks
console.log('\n--- TEST GROUP 3: Leisure Spots -> Row A Desks ---');
for (const sKey of targetSpots) {
  for (const dId of rowADesks) {
    const fromP = SPOTS[sKey];
    const toP = PLACES[dId];
    testPair(fromP, toP, `${sKey} -> ${dId}`);
  }
}
console.log(`Tested ${targetSpots.length * rowADesks.length} routes from Leisure Spots to Row A.`);

// 4. Test Reverse: Leisure Spots -> Row B Desks
console.log('\n--- TEST GROUP 4: Leisure Spots -> Row B Desks ---');
for (const sKey of targetSpots) {
  for (const dId of rowBDesks) {
    const fromP = SPOTS[sKey];
    const toP = PLACES[dId];
    testPair(fromP, toP, `${sKey} -> ${dId}`);
  }
}
console.log(`Tested ${targetSpots.length * rowBDesks.length} routes from Leisure Spots to Row B.`);

// 5. Test Inter-Desk Transitions
console.log('\n--- TEST GROUP 5: Inter-Desk Transitions (Row A <-> Row B) ---');
for (const aId of rowADesks) {
  for (const bId of rowBDesks) {
    testPair(PLACES[aId], PLACES[bId], `${aId} -> ${bId}`);
    testPair(PLACES[bId], PLACES[aId], `${bId} -> ${aId}`);
  }
}
console.log(`Tested ${rowADesks.length * rowBDesks.length * 2} inter-desk routes.`);

console.log('\n================================================================');
console.log(' TEST SUMMARY RESULTS');
console.log('================================================================');
console.log(`Total Routes Evaluated:               ${totalRoutesTested}`);
console.log(`Individual Row B Desk Collisions:     ${collisionsWithIndividualDesks}`);
console.log(`Continuous Row B Zone Intersections:  ${collisionsWithContinuousBox}`);

if (collisionsWithIndividualDesks > 0) {
  console.log('\n[CRITICAL FAILURE] Collisions detected with physical Row B desks:');
  const deskCollisions = failureDetails.filter(f => f.type === 'INDIVIDUAL_DESK_COLLISION');
  deskCollisions.slice(0, 15).forEach(f => {
    console.log(`  - Route: ${f.route} | Segment ${f.segment} (${f.p1.x}, ${f.p1.z}) -> (${f.p2.x}, ${f.p2.z}) collided with ${f.obstacle} at (${f.at.x.toFixed(2)}, ${f.at.z.toFixed(2)})`);
  });
  if (deskCollisions.length > 15) console.log(`  ... and ${deskCollisions.length - 15} more collisions.`);
} else {
  console.log('\n[PASS] ZERO collisions with individual physical Row B desks (B0, B1, B2, B3)!');
}

if (collisionsWithContinuousBox > 0) {
  console.log('\n[INFO/NOTICE] Intersections with the Continuous Zone Box [-8.15, 2.55] x [-1.225, -0.175]:');
  const contIntersections = failureDetails.filter(f => f.type === 'CONTINUOUS_ROW_B_ZONE_INTERSECTION');
  console.log(`  Total segments crossing the Row B Z-band within X=[-8.15, 2.55]: ${contIntersections.length}`);
  // Analyze which X coordinates crossed the zone
  const crossedAisles = new Set();
  contIntersections.forEach(f => {
    crossedAisles.add(`X=${f.at.x.toFixed(2)} on ${f.route}`);
  });
  console.log(`  Crossing locations:`);
  Array.from(crossedAisles).slice(0, 10).forEach(loc => console.log(`    - ${loc}`));
}

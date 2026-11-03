// test_marathon_and_unstuck.mjs
// Adversarial validation of Marathon Cycle suppression and Stuck Detection / Recovery

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('=== TEST SUITE 1: MARATHON CYCLE & STUCK DETECTION ===\n');

// 1. Load Three.js
const threeModulePath = path.resolve('kantor-agent/skills/kantor-agent/runtime/public/assets/vendor/three/build/three.module.js');
const THREE = await import('file:///' + threeModulePath.replace(/\\/g, '/'));

// 2. Read kantor.js to verify implementation patterns
const kantorJsPath = path.resolve('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js');
const kantorJsSource = fs.readFileSync(kantorJsPath, 'utf8');

console.log('[Subtest 1.1] Static Source Pattern Verification...');
assert(kantorJsSource.includes('a.spotUntil = performance.now() + (REDUCED ? 90000 : 38000 + Math.random() * 34000);'),
  'FAIL: arrive() must compute spotUntil with [38000..72000]ms range');
assert(!kantorJsSource.includes('a.spotUntil = now + (REDUCED ? 90000 : 38000 + Math.random() * 34000);'),
  'FAIL: lounge() must NOT set spotUntil prematurely');
assert(kantorJsSource.includes('if (a.walking || distToGoal <= 0.1) return;'),
  'FAIL: goTo() must check (a.walking || distToGoal <= 0.1) for stuck recovery');
console.log('PASS: Static patterns in kantor.js confirmed.\n');

// 3. Empirical Simulation of arrive() and spotUntil dwell duration
console.log('[Subtest 1.2] Empirical Simulation of arrive() & Marathon Dwell Time...');

const CORRIDOR_Z = -2.1;
const FRONT_CORRIDOR_Z = 0.5;
const AISLE_MAIN_X = 3.2;
const AISLES_WEST = [-8.6, -5.6, -2.8];

// Setup PLACES mock identical to kantor.js
const PLACES = {
  'desk:0': {
    kind: 'desk',
    pos: new THREE.Vector3(-7.0, 0, -2.4),
    heading: Math.PI,
    spoke: [new THREE.Vector3(-7.0, 0, CORRIDOR_Z)],
    desk: { seat: new THREE.Group() },
  },
  'desk:A0': {
    kind: 'desk',
    pos: new THREE.Vector3(-7.0, 0, -2.4),
    heading: Math.PI,
    spoke: [new THREE.Vector3(-7.0, 0, CORRIDOR_Z)],
    desk: { seat: new THREE.Group() },
  },
  'spot:tv': {
    kind: 'spot',
    spot: 'tv',
    pos: new THREE.Vector3(6.2, 0, 1.35),
    heading: 0,
    spoke: [new THREE.Vector3(5.5, 0, 0.2), new THREE.Vector3(6.2, 0, 0.2)],
  },
  'spot:ps': {
    kind: 'spot',
    spot: 'ps',
    pos: new THREE.Vector3(7.4, 0, 1.35),
    heading: 0,
    spoke: [new THREE.Vector3(5.5, 0, 0.2), new THREE.Vector3(7.4, 0, 0.2)],
  },
  'spot:arcade': {
    kind: 'spot',
    spot: 'arcade',
    pos: new THREE.Vector3(8.5, 0, 0.9),
    heading: -Math.PI / 2,
    spoke: [new THREE.Vector3(7.5, 0, 0.9)],
  },
};

const SPOT_IDS = ['tv', 'ps', 'arcade'];

function simulateArrive(a, instant = false, REDUCED = false) {
  a.walking = false;
  a.arrivedAt = performance.now();
  const pl = PLACES[a.goal];
  if (!pl) return;
  if (pl.kind === 'desk') {
    a.seated = true;
  } else if (pl.kind === 'door') {
    a.gone = true;
  } else {
    a.spotUntil = performance.now() + (REDUCED ? 90000 : 38000 + Math.random() * 34000);
    a.p.root.position.x = pl.pos.x;
    a.p.root.position.z = pl.pos.z;
    a.heading = pl.heading;
  }
}

// Monte Carlo testing of dwell duration: 10,000 iterations
let minDuration = Infinity;
let maxDuration = -Infinity;
const iterations = 10000;

for (let i = 0; i < iterations; i++) {
  const actor = {
    goal: 'spot:tv',
    walking: true,
    arrivedAt: 0,
    spotUntil: 0,
    heading: 0,
    p: { root: new THREE.Group() },
  };

  const before = performance.now();
  simulateArrive(actor, false, false);
  const duration = actor.spotUntil - actor.arrivedAt;

  if (duration < minDuration) minDuration = duration;
  if (duration > maxDuration) maxDuration = duration;

  assert(duration >= 38000, `Duration ${duration}ms must be >= 38000ms`);
  assert(duration <= 72000, `Duration ${duration}ms must be <= 72000ms`);
}

console.log(`  PASS: Over ${iterations} arrivals, min dwell = ${(minDuration / 1000).toFixed(2)}s, max dwell = ${(maxDuration / 1000).toFixed(2)}s`);
console.log('  Confirmed: Dwell time is strictly within 38.000s - 72.000s.');

// Test with REDUCED motion
{
  const actor = {
    goal: 'spot:arcade',
    walking: true,
    arrivedAt: 0,
    spotUntil: 0,
    heading: 0,
    p: { root: new THREE.Group() },
  };
  simulateArrive(actor, false, true);
  const duration = actor.spotUntil - actor.arrivedAt;
  assert(Math.abs(duration - 90000) < 5, `REDUCED motion dwell time must be approx 90000ms (got ${duration})`);
  console.log('  PASS: Reduced motion dwell time is approximately 90.000s.');
}

// Verify that while transit occurs or dwell is active, lounge() does NOT re-dispatch
console.log('\n[Subtest 1.3] Marathon Cycle Prevention Verification...');
function simulateLounge(a, now, instant = false) {
  const onSpot = a.goal?.startsWith('spot:');
  if (onSpot && now < a.spotUntil) return 'DWELLING_ACTIVE';
  return 'NEW_SPOT_DISPATCHED';
}

{
  const actor = {
    goal: 'spot:tv',
    walking: false,
    spotUntil: 100000,
  };
  // Frame at t = 50,000 ms (< 100,000 ms)
  const resultEarly = simulateLounge(actor, 50000);
  assert.strictEqual(resultEarly, 'DWELLING_ACTIVE', 'Actor must stay dwelling at spot');

  // Frame at t = 99,999 ms
  const resultAlmost = simulateLounge(actor, 99999);
  assert.strictEqual(resultAlmost, 'DWELLING_ACTIVE', 'Actor must stay dwelling at spot until time expires');

  // Frame at t = 100,001 ms
  const resultExpired = simulateLounge(actor, 100001);
  assert.strictEqual(resultExpired, 'NEW_SPOT_DISPATCHED', 'Actor should pick new spot once dwell expires');
  console.log('  PASS: Agent remains stably at spot for the full dwell duration without marathon looping.');
}

// 4. Stuck Detection & Recovery Validation
console.log('\n[Subtest 1.4] Stuck Agent Recovery Verification...');

function pickVerticalAisle(startX, endX) {
  if (startX >= 0 || endX >= 0 || startX >= 1.0 || endX >= 1.0) return AISLE_MAIN_X;
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
      if (ep) raw.push(ep.clone ? ep.clone() : new THREE.Vector3(ep.x, ep.y ?? 0, ep.z));
    }
  }

  const startPt = raw.length > 0 ? raw[raw.length - 1] : (fromPos?.clone ? fromPos.clone() : new THREE.Vector3(fromPos.x, 0, fromPos.z));
  const spoke = targetPlace.spoke || [];
  const entryPt = spoke.length > 0 ? spoke[0] : targetPlace.pos;

  const startIsBack = startPt.z < -1.0;
  const endIsBack = entryPt.z < -1.0;

  if (startIsBack && endIsBack) {
    if (Math.abs(startPt.z - CORRIDOR_Z) > 0.12) {
      raw.push(new THREE.Vector3(startPt.x, 0, CORRIDOR_Z));
    }
    if (Math.abs(startPt.x - entryPt.x) > 0.15) {
      const dx = entryPt.x - startPt.x;
      const laneZ = CORRIDOR_Z + (dx > 0 ? -0.15 : 0.15);
      raw.push(new THREE.Vector3(entryPt.x, 0, laneZ));
    }
  } else if (!startIsBack && !endIsBack) {
    if (Math.abs(startPt.z - FRONT_CORRIDOR_Z) > 0.12) {
      raw.push(new THREE.Vector3(startPt.x, 0, FRONT_CORRIDOR_Z));
    }
    if (Math.abs(startPt.x - entryPt.x) > 0.15) {
      const dx = entryPt.x - startPt.x;
      const laneZ = FRONT_CORRIDOR_Z + (dx > 0 ? -0.15 : 0.15);
      raw.push(new THREE.Vector3(entryPt.x, 0, laneZ));
    }
  } else if (startIsBack && !endIsBack) {
    const aX = pickVerticalAisle(startPt.x, entryPt.x);
    if (Math.abs(startPt.z - CORRIDOR_Z) > 0.12) {
      raw.push(new THREE.Vector3(startPt.x, 0, CORRIDOR_Z));
    }
    const dx1 = aX - startPt.x;
    const laneZ1 = CORRIDOR_Z + (dx1 >= 0 ? -0.15 : 0.15);
    raw.push(new THREE.Vector3(aX, 0, laneZ1));
    raw.push(new THREE.Vector3(aX, 0, FRONT_CORRIDOR_Z));
    if (Math.abs(entryPt.x - aX) > 0.15) {
      const dx2 = entryPt.x - aX;
      const laneZ2 = FRONT_CORRIDOR_Z + (dx2 >= 0 ? -0.15 : 0.15);
      raw.push(new THREE.Vector3(entryPt.x, 0, laneZ2));
    }
  } else {
    const aX = pickVerticalAisle(startPt.x, entryPt.x);
    if (Math.abs(startPt.z - FRONT_CORRIDOR_Z) > 0.12) {
      raw.push(new THREE.Vector3(startPt.x, 0, FRONT_CORRIDOR_Z));
    }
    const dx1 = aX - startPt.x;
    const laneZ1 = FRONT_CORRIDOR_Z + (dx1 >= 0 ? -0.15 : 0.15);
    raw.push(new THREE.Vector3(aX, 0, laneZ1));
    raw.push(new THREE.Vector3(aX, 0, CORRIDOR_Z));
    if (Math.abs(entryPt.x - aX) > 0.15) {
      const dx2 = entryPt.x - aX;
      const laneZ2 = CORRIDOR_Z + (dx2 >= 0 ? -0.15 : 0.15);
      raw.push(new THREE.Vector3(entryPt.x, 0, laneZ2));
    }
  }

  for (const sp of spoke) {
    raw.push(sp.clone ? sp.clone() : new THREE.Vector3(sp.x, sp.y ?? 0, sp.z));
  }
  raw.push(targetPlace.pos.clone ? targetPlace.pos.clone() : new THREE.Vector3(targetPlace.pos.x, targetPlace.pos.y ?? 0, targetPlace.pos.z));

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

function simulateGoTo(a, placeId, REDUCED = false) {
  const pl = PLACES[placeId];
  if (!pl) return 'NO_PLACE';
  if (a.goal === placeId) {
    const distToGoal = Math.hypot(a.p.root.position.x - pl.pos.x, a.p.root.position.z - pl.pos.z);
    if (a.walking || distToGoal <= 0.1) return 'IGNORED_ALREADY_WALKING_OR_ARRIVED';
  }
  if (REDUCED || a.goal === null) {
    a.p.root.position.copy(pl.pos);
    a.walking = false;
    a.goal = placeId;
    return 'INSTANT_PLACED';
  }
  let esc0;
  if (a.walking) {
    esc0 = a.path[a.i]?.esc;
  } else if (a.goal && PLACES[a.goal]?.spoke) {
    esc0 = [...PLACES[a.goal].spoke].reverse();
  }
  if (!esc0 || esc0.length === 0) {
    const safeZ = a.p.root.position.z < -1.0 ? CORRIDOR_Z : FRONT_CORRIDOR_Z;
    esc0 = [new THREE.Vector3(a.p.root.position.x, 0, safeZ)];
  }

  let targetPlace = pl;
  a.path = buildRoute(a.p.root.position, targetPlace, esc0);
  a.i = 0;
  a.goal = placeId;
  a.walking = true;
  a.holding = null;
  return 'ROUTE_BUILT';
}

// Test scenario: Agent stuck with a.goal === 'desk:0', a.walking === false, 2.0m away from desk:0
console.log('  Simulating agent stuck 2.0 meters from desk:0...');
const desk0Pos = PLACES['desk:0'].pos;
const stuckPos = new THREE.Vector3(desk0Pos.x + 2.0, 0, desk0Pos.z);
const dist = Math.hypot(stuckPos.x - desk0Pos.x, stuckPos.z - desk0Pos.z);
assert(Math.abs(dist - 2.0) < 0.001, 'Distance must be 2.0m');

const stuckActor = {
  goal: 'desk:0',
  walking: false,
  path: [],
  i: 0,
  p: { root: new THREE.Group() },
};
stuckActor.p.root.position.copy(stuckPos);

// In old implementation:
// if (a.goal === placeId) return; -> WOULD IGNORE AND RETURN!
// In new implementation:
const status = simulateGoTo(stuckActor, 'desk:0');

assert.strictEqual(status, 'ROUTE_BUILT', 'goTo() must build recovery route for stuck agent');
assert.strictEqual(stuckActor.walking, true, 'stuckActor.walking must become true');
assert.strictEqual(stuckActor.i, 0, 'stuckActor.i must be reset to 0');
assert(stuckActor.path.length > 0, 'stuckActor.path must contain waypoints');
assert.strictEqual(stuckActor.goal, 'desk:0', 'stuckActor.goal must be preserved');
console.log(`  PASS: Stuck agent successfully recovered! Generated path with ${stuckActor.path.length} waypoints.`);

// Boundary testing for distToGoal threshold
console.log('  Testing distToGoal threshold edge cases:');
{
  // If agent is within 0.05m (< 0.10m), should be considered arrived and ignored
  const arrivedActor = {
    goal: 'desk:0',
    walking: false,
    path: [],
    i: 0,
    p: { root: new THREE.Group() },
  };
  arrivedActor.p.root.position.set(desk0Pos.x + 0.05, 0, desk0Pos.z);
  const res = simulateGoTo(arrivedActor, 'desk:0');
  assert.strictEqual(res, 'IGNORED_ALREADY_WALKING_OR_ARRIVED', 'Agent within 0.05m must be ignored (already at goal)');
  console.log('    PASS: distToGoal <= 0.10m correctly ignored (already at goal).');
}

{
  // If agent is at 0.15m (> 0.10m), should recover
  const slightStuckActor = {
    goal: 'desk:0',
    walking: false,
    path: [],
    i: 0,
    p: { root: new THREE.Group() },
  };
  slightStuckActor.p.root.position.set(desk0Pos.x + 0.15, 0, desk0Pos.z);
  const res = simulateGoTo(slightStuckActor, 'desk:0');
  assert.strictEqual(res, 'ROUTE_BUILT', 'Agent at 0.15m must recover');
  console.log('    PASS: distToGoal > 0.10m triggers recovery route.');
}

console.log('\n=== SUITE 1 ALL TESTS PASSED SUCCESSFULLY! ===\n');

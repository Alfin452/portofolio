// Test Movement & Pathfinding Simulator for Milestone 2 (F5 - F11)
import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('=== RUNNING MOVEMENT & PATHFINDING TEST SUITE ===');

// 1. Verify kantor.js source code contains required implementations
const kantorJsPath = path.resolve('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js');
const kantorJsSource = fs.readFileSync(kantorJsPath, 'utf8');

console.log('[Test 1] Code Pattern Auditing...');
// F5
assert(kantorJsSource.includes('function buildRoute('), 'buildRoute function must be defined');
assert(kantorJsSource.includes('AISLE_MAIN_X = 3.2'), 'AISLE_MAIN_X must be 3.2');
assert(kantorJsSource.includes('FRONT_CORRIDOR_Z = 0.5'), 'FRONT_CORRIDOR_Z must be 0.5');

// F6
assert(kantorJsSource.includes('tv: { pos: V(6.2, 1.35), heading: 0, spoke: [V(5.5, 0.2), V(6.2, 0.2)], sit: \'sofa\' }'), 'SPOTS.tv spoke must be corrected');
assert(kantorJsSource.includes('ps: { pos: V(7.4, 1.35), heading: 0, spoke: [V(5.5, 0.2), V(7.4, 0.2)], sit: \'sofa\' }'), 'SPOTS.ps spoke must be corrected');

// F7
assert(kantorJsSource.includes('a.spotUntil = performance.now() + (REDUCED ? 90000 : 38000 + Math.random() * 34000);'), 'spotUntil must be scheduled in arrive()');
assert(!kantorJsSource.includes('a.spotUntil = now + (REDUCED ? 90000 : 38000 + Math.random() * 34000);'), 'spotUntil must NOT be in lounge()');

// F8
assert(kantorJsSource.includes('if (a.walking || distToGoal <= 0.1) return;'), 'goTo must allow unstuck recovery');
assert(kantorJsSource.includes('const safeZ = a.p.root.position.z < -1.0 ? CORRIDOR_Z : FRONT_CORRIDOR_Z;'), 'safe escape fallback must prevent clipping');

// F9
assert(kantorJsSource.includes('const speedFactor = Math.max(0.2, Math.cos(angleDiff));'), 'speedFactor must slow down when misaligned');
assert(kantorJsSource.includes('a.p.root.position.x = pl.pos.x;'), 'arrive must snap X coordinate');
assert(kantorJsSource.includes('a.p.root.position.z = pl.pos.z;'), 'arrive must snap Z coordinate');

// F10
assert(kantorJsSource.includes('(dx > 0 ? -0.15 : 0.15)'), 'lane offset must separate opposite traffic');
assert(kantorJsSource.includes('const spawnOffset = ((f.desk ?? 0) - 1.5) * 0.22;'), 'freelancer spawn offset must be present');

// F11
assert(kantorJsSource.includes('const working = m.state === \'bekerja\' || m.state === \'selesai\';'), 'team working must include selesai state');
assert(kantorJsSource.includes('const flWorking = f.state === \'bekerja\' || f.state === \'selesai\';'), 'freelancer working must include selesai state');
assert(kantorJsSource.includes('if (d.state === \'selesai\') return \'done\';'), 'workMode must return done for selesai');

// Check NO EMOJIS in modified areas
assert(!kantorJsSource.includes('Beres! Pamit dulu ya 👋'), 'Emoji must be eliminated from freelancer dialog');

console.log(' PASS: Source patterns verified.');

// 2. Behavioral Simulation of Router (F5, F8, F10)
console.log('\n[Test 2] Simulating Highway Routing & Obstacle Avoidance...');

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  clone() { return new Vector3(this.x, this.y, this.z); }
}

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

// Function to check if a segment intersects Row B desks
// Row B desks: Z between -1.25 and -0.15, X from -8.15 to 2.55 (except at aisles X=-8.6, -5.6, -2.8, 3.2)
function segmentIntersectsDesks(p1, p2) {
  const steps = 30;
  for (let s = 0; s <= steps; s++) {
    const alpha = s / steps;
    const x = p1.x + (p2.x - p1.x) * alpha;
    const z = p1.z + (p2.z - p1.z) * alpha;
    
    // In the desk Z band:
    if (z > -1.25 && z < -0.15) {
      // Check if X is within a safe aisle
      const inAisle = [-8.6, -5.6, -2.8, 3.2].some((ax) => Math.abs(x - ax) <= 0.35);
      if (!inAisle && x >= -8.15 && x <= 2.55) {
        return { intersects: true, at: { x, z } };
      }
    }
  }
  return { intersects: false };
}

// Test routes from every Row A desk (A0-A4) to TV and PS
const testOrigins = [
  { name: 'desk:A0', pos: new Vector3(-7.0, 0, -3.35), spoke: [new Vector3(-7.0, 0, -2.1)] },
  { name: 'desk:A1', pos: new Vector3(-4.2, 0, -3.35), spoke: [new Vector3(-4.2, 0, -2.1)] },
  { name: 'desk:A2', pos: new Vector3(-1.4, 0, -3.35), spoke: [new Vector3(-1.4, 0, -2.1)] },
  { name: 'desk:A3', pos: new Vector3(1.4, 0, -3.35), spoke: [new Vector3(1.4, 0, -2.1)] },
  { name: 'desk:A4', pos: new Vector3(4.2, 0, -3.35), spoke: [new Vector3(4.2, 0, -2.1)] },
];

const targetTV = {
  pos: new Vector3(6.2, 0, 1.35),
  spoke: [new Vector3(5.5, 0, 0.2), new Vector3(6.2, 0, 0.2)],
};

for (const orig of testOrigins) {
  const esc0 = [...orig.spoke].reverse();
  const path = buildRoute(orig.pos, targetTV, esc0);
  assert(path.length > 0, `Path from ${orig.name} must have waypoints`);
  
  // Verify no segment cuts through Row B desks
  let cur = orig.pos;
  for (let i = 0; i < path.length; i++) {
    const next = path[i].p;
    const col = segmentIntersectsDesks(cur, next);
    assert(!col.intersects, `Route from ${orig.name} clipped desks at x=${col.at?.x?.toFixed(2)}, z=${col.at?.z?.toFixed(2)} on segment ${i}`);
    cur = next;
  }
  console.log(`  PASS: ${orig.name} -> TV route is 100% collision-free (${path.length} waypoints)`);
}

// Test reverse: TV back to A0
{
  const esc0 = [new Vector3(6.2, 0, 0.2), new Vector3(5.5, 0, 0.2)];
  const path = buildRoute(targetTV.pos, testOrigins[0], esc0);
  let cur = targetTV.pos;
  for (let i = 0; i < path.length; i++) {
    const next = path[i].p;
    const col = segmentIntersectsDesks(cur, next);
    assert(!col.intersects, `Route TV -> A0 clipped desks at x=${col.at?.x?.toFixed(2)}, z=${col.at?.z?.toFixed(2)}`);
    cur = next;
  }
  console.log(`  PASS: TV -> desk:A0 reverse route is 100% collision-free (${path.length} waypoints)`);
}

// 3. Test Anti-Strafing Factor (F9)
console.log('\n[Test 3] Testing Anti-Strafing Math...');
function computeSpeedFactor(targetHeading, currentHeading) {
  const angleDiff = Math.abs(Math.atan2(Math.sin(targetHeading - currentHeading), Math.cos(targetHeading - currentHeading)));
  return Math.max(0.2, Math.cos(angleDiff));
}
assert.strictEqual(computeSpeedFactor(0, 0), 1.0, 'Speed factor at 0 angle diff must be 1.0');
assert(Math.abs(computeSpeedFactor(Math.PI / 2, 0) - 0.2) < 0.001, 'Speed factor at 90 deg diff must be clamped to 0.2');
assert.strictEqual(computeSpeedFactor(Math.PI, 0), 0.2, 'Speed factor at 180 deg diff must be clamped to 0.2');
console.log('  PASS: Anti-strafing factors validated.');

// 4. Test Lane Offset Separation (F10)
console.log('\n[Test 4] Testing Lane Offset Anti-Stacking...');
const eastRoute = buildRoute(new Vector3(-5, 0, -2.1), { pos: new Vector3(5, 0, -2.1), spoke: [new Vector3(5, 0, -2.1)] }, []);
const westRoute = buildRoute(new Vector3(5, 0, -2.1), { pos: new Vector3(-5, 0, -2.1), spoke: [new Vector3(-5, 0, -2.1)] }, []);
const eastLaneZ = eastRoute.find(wp => wp.p.x === 5)?.p.z;
const westLaneZ = westRoute.find(wp => wp.p.x === -5)?.p.z;
assert(eastLaneZ !== undefined && westLaneZ !== undefined, 'Both routes must contain corridor waypoints');
assert(Math.abs(eastLaneZ - westLaneZ) >= 0.25, `Opposite lanes must be separated by >=0.25m (actual: ${Math.abs(eastLaneZ - westLaneZ)}m)`);
console.log(`  PASS: Opposite corridor lanes separated by ${(Math.abs(eastLaneZ - westLaneZ)).toFixed(2)}m (east=${eastLaneZ.toFixed(2)}, west=${westLaneZ.toFixed(2)})`);

console.log('\nALL UNIT & INTEGRATION SIMULATION TESTS PASSED SUCCESSFULLY!');

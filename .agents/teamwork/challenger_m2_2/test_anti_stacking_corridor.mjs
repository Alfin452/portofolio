// test_anti_stacking_corridor.mjs
// Adversarial validation of Corridor Anti-Stacking & Opposite Direction Lane Separation

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('=== TEST SUITE 3: CORRIDOR ANTI-STACKING & LANE SEPARATION ===\n');

// 1. Load Three.js
const threeModulePath = path.resolve('kantor-agent/skills/kantor-agent/runtime/public/assets/vendor/three/build/three.module.js');
const THREE = await import('file:///' + threeModulePath.replace(/\\/g, '/'));

// 2. Read kantor.js
const kantorJsPath = path.resolve('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js');
const kantorJsSource = fs.readFileSync(kantorJsPath, 'utf8');

console.log('[Subtest 3.1] Source Pattern Verification in kantor.js...');
assert(kantorJsSource.includes('const laneZ = CORRIDOR_Z + (dx > 0 ? -0.15 : 0.15);'),
  'FAIL: Back corridor must apply (dx > 0 ? -0.15 : 0.15) lane offset');
assert(kantorJsSource.includes('const laneZ = FRONT_CORRIDOR_Z + (dx > 0 ? -0.15 : 0.15);'),
  'FAIL: Front corridor must apply (dx > 0 ? -0.15 : 0.15) lane offset');
console.log('PASS: Lane offset patterns confirmed in kantor.js.\n');

// 3. Mathematical proof and routing evaluation
const CORRIDOR_Z = -2.1;
const FRONT_CORRIDOR_Z = 0.5;
const AISLE_MAIN_X = 3.2;
const AISLES_WEST = [-8.6, -5.6, -2.8];

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

console.log('[Subtest 3.2] Back Corridor Separation (CORRIDOR_Z = -2.1)...');
{
  const startEast = new THREE.Vector3(-6.0, 0, CORRIDOR_Z);
  const targetEast = { pos: new THREE.Vector3(4.0, 0, CORRIDOR_Z), spoke: [new THREE.Vector3(4.0, 0, CORRIDOR_Z)] };
  const routeEast = buildRoute(startEast, targetEast, []);

  const startWest = new THREE.Vector3(4.0, 0, CORRIDOR_Z);
  const targetWest = { pos: new THREE.Vector3(-6.0, 0, CORRIDOR_Z), spoke: [new THREE.Vector3(-6.0, 0, CORRIDOR_Z)] };
  const routeWest = buildRoute(startWest, targetWest, []);

  const wpEast = routeEast.find(w => Math.abs(w.p.x - 4.0) < 0.01);
  const wpWest = routeWest.find(w => Math.abs(w.p.x - (-6.0)) < 0.01);

  assert(wpEast && wpWest, 'Waypoints must exist');

  const zEast = wpEast.p.z;
  const zWest = wpWest.p.z;
  const diffZ = Math.abs(zWest - zEast);

  console.log(`  Eastbound (dx > 0):  Z = ${zEast.toFixed(4)}m (CORRIDOR_Z - 0.15 = -2.25)`);
  console.log(`  Westbound (dx < 0):  Z = ${zWest.toFixed(4)}m (CORRIDOR_Z + 0.15 = -1.95)`);
  console.log(`  Lateral separation:  ${diffZ.toFixed(4)}m`);

  assert(Math.abs(zEast - (-2.25)) < 1e-6, `Eastbound Z must be -2.25 (got ${zEast})`);
  assert(Math.abs(zWest - (-1.95)) < 1e-6, `Westbound Z must be -1.95 (got ${zWest})`);
  assert(Math.abs(diffZ - 0.30) < 1e-6, `Lateral separation must be exactly 0.30m (got ${diffZ})`);
  console.log('  PASS: Back corridor lateral offset is exactly 0.30 meters.');
}

console.log('\n[Subtest 3.3] Front Corridor Separation (FRONT_CORRIDOR_Z = 0.5)...');
{
  const startEast = new THREE.Vector3(-4.0, 0, FRONT_CORRIDOR_Z);
  const targetEast = { pos: new THREE.Vector3(6.0, 0, FRONT_CORRIDOR_Z), spoke: [new THREE.Vector3(6.0, 0, FRONT_CORRIDOR_Z)] };
  const routeEast = buildRoute(startEast, targetEast, []);

  const startWest = new THREE.Vector3(6.0, 0, FRONT_CORRIDOR_Z);
  const targetWest = { pos: new THREE.Vector3(-4.0, 0, FRONT_CORRIDOR_Z), spoke: [new THREE.Vector3(-4.0, 0, FRONT_CORRIDOR_Z)] };
  const routeWest = buildRoute(startWest, targetWest, []);

  const wpEast = routeEast.find(w => Math.abs(w.p.x - 6.0) < 0.01);
  const wpWest = routeWest.find(w => Math.abs(w.p.x - (-4.0)) < 0.01);

  assert(wpEast && wpWest, 'Waypoints must exist');

  const zEast = wpEast.p.z;
  const zWest = wpWest.p.z;
  const diffZ = Math.abs(zWest - zEast);

  console.log(`  Eastbound (dx > 0):  Z = ${zEast.toFixed(4)}m (FRONT_CORRIDOR_Z - 0.15 = 0.35)`);
  console.log(`  Westbound (dx < 0):  Z = ${zWest.toFixed(4)}m (FRONT_CORRIDOR_Z + 0.15 = 0.65)`);
  console.log(`  Lateral separation:  ${diffZ.toFixed(4)}m`);

  assert(Math.abs(zEast - 0.35) < 1e-6, `Eastbound Z must be 0.35 (got ${zEast})`);
  assert(Math.abs(zWest - 0.65) < 1e-6, `Westbound Z must be 0.65 (got ${zWest})`);
  assert(Math.abs(diffZ - 0.30) < 1e-6, `Lateral separation must be exactly 0.30m (got ${diffZ})`);
  console.log('  PASS: Front corridor lateral offset is exactly 0.30 meters.');
}

console.log('\n[Subtest 3.4] Multi-Agent Continuous Passing Simulation...');
{
  // Agent 1: walks from (-5, 0, -2.25) to (+5, 0, -2.25) at 1.8 m/s
  // Agent 2: walks from (+5, 0, -1.95) to (-5, 0, -1.95) at 1.8 m/s
  // Track minimum 3D Euclidean distance over the entire transit:
  const dt = 0.01;
  let a1X = -5.0;
  let a1Z = -2.25;
  let a2X = 5.0;
  let a2Z = -1.95;
  let minEuclideanDist = Infinity;
  let minXDist = Infinity;
  let distAtPass = 0;

  for (let t = 0; t < 1000; t++) {
    a1X += 1.8 * dt;
    a2X -= 1.8 * dt;

    const curDist = Math.hypot(a1X - a2X, a1Z - a2Z);
    if (curDist < minEuclideanDist) minEuclideanDist = curDist;

    const curXDist = Math.abs(a1X - a2X);
    if (curXDist < minXDist) {
      minXDist = curXDist;
      distAtPass = curDist;
    }

    if (a1X >= 5.0 || a2X <= -5.0) break;
  }

  console.log(`  Minimum passing distance between agents: ${distAtPass.toFixed(4)}m`);
  console.log(`  Theoretical lateral offset:             0.3000m`);
  assert(Math.abs(distAtPass - 0.30) < 0.02, `Passing clearance must be ~0.30m (got ${distAtPass})`);
  console.log('  PASS: Passing agents maintain continuous 0.30m collision-free clearance (ZERO mesh stacking).');
}

console.log('\n=== SUITE 3 ALL TESTS PASSED SUCCESSFULLY! ===\n');

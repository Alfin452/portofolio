// test_anti_strafing.mjs
// Adversarial validation of Anti-Strafing Locomotion & Turn-Before-Translate

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('=== TEST SUITE 2: ANTI-STRAFING LOCOMOTION VALIDATION ===\n');

// 1. Verify pattern in kantor.js
const kantorJsPath = path.resolve('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js');
const kantorJsSource = fs.readFileSync(kantorJsPath, 'utf8');

console.log('[Subtest 2.1] Source Pattern Verification in kantor.js...');
assert(kantorJsSource.includes('const targetHeading = Math.atan2(tmpV.x, tmpV.z);'),
  'FAIL: targetHeading must be computed from tmpV');
assert(kantorJsSource.includes('const angleDiff = Math.abs(Math.atan2(Math.sin(targetHeading - a.heading), Math.cos(targetHeading - a.heading)));'),
  'FAIL: angleDiff must compute angular difference');
assert(kantorJsSource.includes('const speedFactor = Math.max(0.2, Math.cos(angleDiff));'),
  'FAIL: speedFactor must clamp Math.cos(angleDiff) to min 0.2');
assert(kantorJsSource.includes('const step = Math.min(horizDist, 1.8 * dt * speedFactor);'),
  'FAIL: step translation must be scaled by speedFactor');
console.log('PASS: Anti-strafing patterns confirmed in kantor.js.\n');

// 2. Mathematical Proof of speedFactor across angles
console.log('[Subtest 2.2] Mathematical Verification of speedFactor across all angles...');

function computeSpeedFactor(targetHeading, currentHeading) {
  const angleDiff = Math.abs(Math.atan2(Math.sin(targetHeading - currentHeading), Math.cos(targetHeading - currentHeading)));
  return Math.max(0.2, Math.cos(angleDiff));
}

// 0 degrees deviation -> speedFactor = 1.0 (100% speed)
const sf0 = computeSpeedFactor(0, 0);
assert.strictEqual(sf0, 1.0, '0 deg diff must yield speedFactor 1.0');

// 30 degrees deviation
const sf30 = computeSpeedFactor(Math.PI / 6, 0);
assert(Math.abs(sf30 - Math.cos(Math.PI / 6)) < 1e-6, '30 deg diff must match cos(30 deg)');

// 45 degrees deviation
const sf45 = computeSpeedFactor(Math.PI / 4, 0);
assert(Math.abs(sf45 - Math.SQRT1_2) < 1e-6, '45 deg diff must match sqrt(0.5)');

// 60 degrees deviation
const sf60 = computeSpeedFactor(Math.PI / 3, 0);
assert(Math.abs(sf60 - 0.5) < 1e-6, '60 deg diff must be 0.5');

// 90 degrees deviation (exact requirement: speedFactor === 0.20)
const sf90 = computeSpeedFactor(Math.PI / 2, 0);
assert(Math.abs(sf90 - 0.20) < 1e-6, `90 deg diff must yield 0.20 (got ${sf90})`);

// -90 degrees deviation (left turn)
const sfNeg90 = computeSpeedFactor(-Math.PI / 2, 0);
assert(Math.abs(sfNeg90 - 0.20) < 1e-6, `-90 deg diff must yield 0.20 (got ${sfNeg90})`);

// 120 degrees deviation -> cos(120) = -0.5 -> clamped to 0.20
const sf120 = computeSpeedFactor((2 * Math.PI) / 3, 0);
assert.strictEqual(sf120, 0.20, '120 deg diff must be clamped to 0.20');

// 180 degrees deviation (about-face) -> cos(180) = -1.0 -> clamped to 0.20
const sf180 = computeSpeedFactor(Math.PI, 0);
assert.strictEqual(sf180, 0.20, '180 deg diff must be clamped to 0.20');

console.log('  PASS: speedFactor at 0 deg:   ' + sf0.toFixed(4) + ' (100% velocity)');
console.log('  PASS: speedFactor at 30 deg:  ' + sf30.toFixed(4) + ' (86.6% velocity)');
console.log('  PASS: speedFactor at 45 deg:  ' + sf45.toFixed(4) + ' (70.7% velocity)');
console.log('  PASS: speedFactor at 60 deg:  ' + sf60.toFixed(4) + ' (50.0% velocity)');
console.log('  PASS: speedFactor at 90 deg:  ' + sf90.toFixed(4) + ' (20.0% velocity - throttled by 80%)');
console.log('  PASS: speedFactor at 180 deg: ' + sf180.toFixed(4) + ' (20.0% velocity - clamped)');

// 3. Dynamic Frame-by-Frame Locomotion Simulation
console.log('\n[Subtest 2.3] Dynamic Frame-by-Frame Locomotion Simulation (60 FPS)...');

function turnTo(cur, target, step) {
  const diff = Math.atan2(Math.sin(target - cur), Math.cos(target - cur));
  return Math.abs(diff) <= step ? target : cur + Math.sign(diff) * step;
}

// Simulation setup:
// Agent starts at (0, 0, 0) facing North (heading = 0).
// Commanded to walk to waypoint at (4.0, 0, 0) (East, heading = PI/2 = 90 deg).
// Compare NEW locomotion (with speedFactor) vs OLD locomotion (without speedFactor).

function runLocomotionSim(useSpeedFactor) {
  let posX = 0;
  let posZ = 0;
  let heading = 0; // facing North (+Z direction in this coordinate convention)
  const targetX = 4.0;
  const targetZ = 0.0;
  const dt = 0.016; // ~60 FPS
  const history = [];

  for (let frame = 0; frame < 200; frame++) {
    const dx = targetX - posX;
    const dz = targetZ - posZ;
    const horizDist = Math.hypot(dx, dz);
    if (horizDist < 0.01) break;

    const targetHeading = Math.atan2(dx, dz);
    const angleDiff = Math.abs(Math.atan2(Math.sin(targetHeading - heading), Math.cos(targetHeading - heading)));
    const speedFactor = useSpeedFactor ? Math.max(0.2, Math.cos(angleDiff)) : 1.0;
    const step = Math.min(horizDist, 1.8 * dt * speedFactor);

    posX += (dx / horizDist) * step;
    posZ += (dz / horizDist) * step;
    heading = turnTo(heading, targetHeading, dt * 7);

    history.push({
      frame,
      time: frame * dt,
      posX,
      posZ,
      headingDeg: (heading * 180 / Math.PI),
      angleDiffDeg: (angleDiff * 180 / Math.PI),
      speedFactor,
      velocity: step / dt,
    });
  }

  return history;
}

const newSim = runLocomotionSim(true);
const oldSim = runLocomotionSim(false);

// At frame 0:
console.log(`  Initial frame 0:`);
console.log(`    Deviation angle: ${newSim[0].angleDiffDeg.toFixed(1)} deg`);
console.log(`    NEW velocity:    ${newSim[0].velocity.toFixed(3)} m/s (speedFactor = ${newSim[0].speedFactor.toFixed(2)})`);
console.log(`    OLD velocity:    ${oldSim[0].velocity.toFixed(3)} m/s (speedFactor = ${oldSim[0].speedFactor.toFixed(2)})`);
console.log(`    Speed reduction: ${((1 - newSim[0].velocity / oldSim[0].velocity) * 100).toFixed(1)}%`);

assert(Math.abs(newSim[0].speedFactor - 0.20) < 1e-4, 'Frame 0 speedFactor must be 0.20');
assert(Math.abs(newSim[0].velocity - 0.36) < 0.01, 'Frame 0 velocity must be 0.36 m/s (1.8 * 0.20)');

// Measure lateral drift before turning is 90% complete (angleDiff < 10 deg):
const newTurnedFrame = newSim.find(f => f.angleDiffDeg < 10);
const oldTurnedFrame = oldSim.find(f => f.angleDiffDeg < 10);

console.log(`\n  Turn completion benchmark (angle deviation < 10 deg):`);
console.log(`    NEW locomotion: Frame ${newTurnedFrame.frame} (t = ${newTurnedFrame.time.toFixed(3)}s), traveled distance = ${newTurnedFrame.posX.toFixed(3)}m`);
console.log(`    OLD locomotion: Frame ${oldTurnedFrame.frame} (t = ${oldTurnedFrame.time.toFixed(3)}s), traveled distance = ${oldTurnedFrame.posX.toFixed(3)}m`);

// In the old locomotion, the agent slid forward ~0.403m sideways.
// In the new locomotion, translation during the turn arc is reduced to ~0.250m (~38% less drift across the entire arc).
assert(newTurnedFrame.posX < oldTurnedFrame.posX * 0.70, 'Sideways translation during turn arc must be reduced by >30%');
console.log(`  PASS: Crab-walk/strafing sideways drift reduced by ${((1 - newTurnedFrame.posX / oldTurnedFrame.posX) * 100).toFixed(1)}%!`);

console.log('\n=== SUITE 2 ALL TESTS PASSED SUCCESSFULLY! ===\n');

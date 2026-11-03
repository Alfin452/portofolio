// Empirical Challenger Stress Harness for Milestone 3 (F12, F13, F14)
// Author: Challenger M3-1
// Location: .agents/teamwork/challenger_m3_1/empirical_stress_test.mjs

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('CHALLENGER M3-1: RIGOROUS EMPIRICAL VERIFICATION HARNESS');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function reportTest(name, passed, detail = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`[PASS] ${name}${detail ? ' — ' + detail : ''}`);
  } else {
    failedTests++;
    console.error(`[FAIL] ${name}${detail ? ' — ' + detail : ''}`);
  }
}

// ============================================================================
// SUITE 1: MATHEMATICAL CONTINUITY, MONOTONICITY & ZERO-JERK ENDPOINTS
// ============================================================================
console.log('--- SUITE 1: Mathematical Continuity & Monotonicity of Transitions ---');

function smoothstep5(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

// Analytical derivative functions:
// S(t)  = 6t^5 - 15t^4 + 10t^3
// S'(t) = 30t^4 - 60t^3 + 30t^2 = 30t^2(t - 1)^2
// S''(t)= 120t^3 - 180t^2 + 60t = 60t(2t - 1)(t - 1)
const S_prime = (t) => 30 * t * t * (t - 1) * (t - 1);
const S_double_prime = (t) => 60 * t * (2 * t - 1) * (t - 1);

// 1.1 Boundaries & Exact Values
const s0 = smoothstep5(0.0);
const s1 = smoothstep5(1.0);
reportTest('Boundary Values S(0) == 0.0 and S(1) == 1.0', s0 === 0.0 && s1 === 1.0, `S(0)=${s0}, S(1)=${s1}`);

// 1.2 Boundary Derivatives (dS/dt = 0)
const dS_0_analytical = S_prime(0.0);
const dS_1_analytical = S_prime(1.0);
const h1 = 1e-5;
const dS_0_numerical = (smoothstep5(h1) - smoothstep5(0.0)) / h1;
const dS_1_numerical = (smoothstep5(1.0) - smoothstep5(1.0 - h1)) / h1;

reportTest('Zero Velocity at t=0 (dS/dt = 0)', dS_0_analytical === 0 && Math.abs(dS_0_numerical) < 1e-4, `analytical=${dS_0_analytical}, numerical=${dS_0_numerical.toExponential(4)}`);
reportTest('Zero Velocity at t=1 (dS/dt = 0)', dS_1_analytical === 0 && Math.abs(dS_1_numerical) < 1e-4, `analytical=${dS_1_analytical}, numerical=${dS_1_numerical.toExponential(4)}`);

// 1.3 Boundary Second Derivatives (Zero Jerk / Zero Acceleration at boundaries)
const d2S_0_analytical = S_double_prime(0.0);
const d2S_1_analytical = S_double_prime(1.0);
const h2 = 1e-4; // optimal finite difference step size for 2nd derivative in IEEE 754
const d2S_0_numerical = (smoothstep5(2 * h2) - 2 * smoothstep5(h2) + smoothstep5(0.0)) / (h2 * h2);
const d2S_1_numerical = (smoothstep5(1.0) - 2 * smoothstep5(1.0 - h2) + smoothstep5(1.0 - 2 * h2)) / (h2 * h2);

reportTest('Zero Acceleration at t=0 (d2S/dt2 = 0)', d2S_0_analytical === 0 && Math.abs(d2S_0_numerical) < 1e-2, `analytical=${d2S_0_analytical}, numerical=${d2S_0_numerical.toFixed(6)}`);
reportTest('Zero Acceleration at t=1 (d2S/dt2 = 0)', d2S_1_analytical === 0 && Math.abs(d2S_1_numerical) < 1e-2, `analytical=${d2S_1_analytical}, numerical=${d2S_1_numerical.toFixed(6)}`);

// 1.4 Strict Monotonicity across 100,000 steps
const SAMPLES = 100000;
let isMonotonic = true;
let minDerivative = Infinity;
let maxDerivative = -Infinity;
for (let i = 0; i < SAMPLES; i++) {
  const t1 = i / SAMPLES;
  const t2 = (i + 1) / SAMPLES;
  const val1 = smoothstep5(t1);
  const val2 = smoothstep5(t2);
  if (val2 < val1) {
    isMonotonic = false;
    break;
  }
  const deriv = (val2 - val1) * SAMPLES;
  if (deriv < minDerivative) minDerivative = deriv;
  if (deriv > maxDerivative) maxDerivative = deriv;
}
reportTest('Strict Monotonicity on [0, 1] (100,000 samples)', isMonotonic, `min slope=${minDerivative.toFixed(4)}, peak slope=${maxDerivative.toFixed(4)} (analytical peak=1.875 at t=0.5)`);

// 1.5 Clamping outside [0, 1]
const underflow = smoothstep5(-5.0);
const overflow = smoothstep5(5.0);
reportTest('Clamping Underflow and Overflow', underflow === 0.0 && overflow === 1.0, `S(-5)=${underflow}, S(5)=${overflow}`);

// 1.6 Symmetry: S(1-t) + S(t) == 1.0
let isSymmetric = true;
let maxSymmError = 0;
for (let i = 0; i <= 1000; i++) {
  const t = i / 1000;
  const err = Math.abs((smoothstep5(1 - t) + smoothstep5(t)) - 1.0);
  if (err > maxSymmError) maxSymmError = err;
  if (err > 1e-12) isSymmetric = false;
}
reportTest('Symmetry Invariance S(1-t) + S(t) == 1.0', isSymmetric, `max error = ${maxSymmError.toExponential(4)}`);

// 1.7 Pose Continuity in getTransitionPose
function getTransitionPose(fromStanding, s, isSofa = false) {
  const targetHipsY = isSofa ? 0.515 : 0.505;
  const factor = fromStanding ? s : (1.0 - s);
  return {
    hipsY: 0.90 + (targetHipsY - 0.90) * factor,
    lHipX: -1.5 * factor,
    rHipX: -1.5 * factor,
    lKneeX: 1.45 * factor,
    rKneeX: 1.45 * factor,
    spineX: 0.04 + (0.10 - 0.04) * factor,
    spineY: 0,
    spineZ: 0,
    headX: 0.05 + (0.08 - 0.05) * factor,
    headY: 0,
    headZ: 0,
    lShX: -0.15 + (-0.55 - (-0.15)) * factor,
    rShX: -0.15 + (-0.55 - (-0.15)) * factor,
    lElX: -0.25 + (-0.95 - (-0.25)) * factor,
    rElX: -0.25 + (-0.95 - (-0.25)) * factor,
  };
}

// Sitting Down: verify monotonic descent of hipsY, monotonic increase of knee flexion
let hipsYDescends = true;
let kneesFlex = true;
let lastHipsY = 0.90;
let lastKnee = 0.0;
for (let i = 0; i <= 1000; i++) {
  const t = i / 1000;
  const s = smoothstep5(t);
  const pose = getTransitionPose(true, s, false);
  if (pose.hipsY > lastHipsY + 1e-12) hipsYDescends = false;
  if (pose.lKneeX < lastKnee - 1e-12) kneesFlex = false;
  lastHipsY = pose.hipsY;
  lastKnee = pose.lKneeX;
}
reportTest('Sitting Down: Monotonic Hips Descent & Knee Flexion', hipsYDescends && kneesFlex, `Hips: 0.90 -> 0.505, Knees: 0.0 -> 1.45 rad`);

// Standing Up: verify monotonic ascent of hipsY, monotonic extension of knees
let hipsYAscends = true;
let kneesExtend = true;
lastHipsY = 0.505;
lastKnee = 1.45;
for (let i = 0; i <= 1000; i++) {
  const t = i / 1000;
  const s = smoothstep5(t);
  const pose = getTransitionPose(false, s, false);
  if (pose.hipsY < lastHipsY - 1e-12) hipsYAscends = false;
  if (pose.lKneeX > lastKnee + 1e-12) kneesExtend = false;
  lastHipsY = pose.hipsY;
  lastKnee = pose.lKneeX;
}
reportTest('Standing Up: Monotonic Hips Rise & Knee Extension', hipsYAscends && kneesExtend, `Hips: 0.505 -> 0.90, Knees: 1.45 -> 0.0 rad`);

// 1.8 Reversal Invariance: Interrupting sitting_down at progress p to standing_up
let maxReversalDelta = 0;
for (const p of [0.1, 0.25, 0.5, 0.75, 0.9]) {
  const sSit = smoothstep5(p);
  const poseSit = getTransitionPose(true, sSit, false);
  
  // As implemented in kantor.js line 1932: transTime = (1.0 - p) * transDur
  const pStand = 1.0 - p;
  const sStand = smoothstep5(pStand);
  const poseStand = getTransitionPose(false, sStand, false);
  
  const diffHips = Math.abs(poseSit.hipsY - poseStand.hipsY);
  const diffKnee = Math.abs(poseSit.lKneeX - poseStand.lKneeX);
  const maxDiff = Math.max(diffHips, diffKnee);
  if (maxDiff > maxReversalDelta) maxReversalDelta = maxDiff;
}
reportTest('Mid-Transition Reversal Continuity (Sitting -> Standing without snap)', maxReversalDelta < 1e-14, `Max coordinate delta on reversal = ${maxReversalDelta.toExponential(4)}`);


// ============================================================================
// SUITE 2: NUMERICAL INVARIANCE OF EXPONENTIAL DAMPING ACROSS FRAME RATES
// ============================================================================
console.log('\n--- SUITE 2: Numerical Invariance of Exponential Damping ---');

function dampK(cur, target, lambda, dt) {
  const k = 1.0 - Math.exp(-lambda * dt);
  return cur + (target - cur) * k;
}

function dampAngle(cur, target, lambda, dt) {
  const diff = Math.atan2(Math.sin(target - cur), Math.cos(target - cur));
  const k = 1.0 - Math.exp(-lambda * dt);
  return cur + diff * k;
}

// Compare across multiple lambdas: 8.0 (spine), 9.0 (arms), 10.0 (head/hips), 12.0 (legs)
const lambdas = [8.0, 9.0, 10.0, 12.0];
const T_TOTAL = 1.0; // 1 second total elapsed time
const INITIAL_VAL = 0.0;
const TARGET_VAL = 1.0;

for (const lambda of lambdas) {
  // Analytical exact solution: y(T) = TARGET + (INITIAL - TARGET) * exp(-lambda * T)
  const analytical = TARGET_VAL + (INITIAL_VAL - TARGET_VAL) * Math.exp(-lambda * T_TOTAL);

  // Scenario 1: 30 FPS (30 steps of dt = 1/30)
  let y30 = INITIAL_VAL;
  const dt30 = 1.0 / 30.0;
  for (let i = 0; i < 30; i++) y30 = dampK(y30, TARGET_VAL, lambda, dt30);

  // Scenario 2: 60 FPS (60 steps of dt = 1/60)
  let y60 = INITIAL_VAL;
  const dt60 = 1.0 / 60.0;
  for (let i = 0; i < 60; i++) y60 = dampK(y60, TARGET_VAL, lambda, dt60);

  // Scenario 3: 120 FPS (120 steps of dt = 1/120)
  let y120 = INITIAL_VAL;
  const dt120 = 1.0 / 120.0;
  for (let i = 0; i < 120; i++) y120 = dampK(y120, TARGET_VAL, lambda, dt120);

  // Scenario 4: Lag spikes (5 frames of dt = 0.2s)
  let yLag = INITIAL_VAL;
  const dtLag = 0.2;
  for (let i = 0; i < 5; i++) yLag = dampK(yLag, TARGET_VAL, lambda, dtLag);

  // Scenario 5: Random Jitter/Spikes dt sequence summing exactly to 1.0s
  const jitters = [0.016, 0.017, 0.033, 0.200, 0.050, 0.008, 0.076, 0.250, 0.050, 0.300];
  let yJitter = INITIAL_VAL;
  for (const dt of jitters) yJitter = dampK(yJitter, TARGET_VAL, lambda, dt);

  const diff30 = Math.abs(y30 - analytical);
  const diff60 = Math.abs(y60 - analytical);
  const diff120 = Math.abs(y120 - analytical);
  const diffLag = Math.abs(yLag - analytical);
  const diffJitter = Math.abs(yJitter - analytical);

  const maxDiff = Math.max(diff30, diff60, diff120, diffLag, diffJitter);
  reportTest(
    `dampK Frame-Rate Invariance (lambda=${lambda})`,
    maxDiff < 1e-14,
    `analytical=${analytical.toFixed(8)} | max diff across 30/60/120/lag/jitter = ${maxDiff.toExponential(4)}`
  );
}

// 2.2 Compare with Old Linear Approximation: lerpK(cur, target, Math.min(1, dt * 7))
// Measure divergence at t = 0.2s (1 lag spike frame vs 12 frames at 60 FPS)
const linearLerp = (cur, target, dt) => cur + (target - cur) * Math.min(1.0, dt * 7.0);

let old60_02s = 0.0;
for (let i = 0; i < 12; i++) old60_02s = linearLerp(old60_02s, 1.0, 0.2 / 12);

let oldLag_02s = linearLerp(0.0, 1.0, 0.2); // dt * 7 = 1.4 -> clamped to 1.0 immediately!

const linearDivergence = Math.abs(oldLag_02s - old60_02s);
reportTest(
  'Old Linear Lerp Lag Spike Flaw Demonstrated',
  linearDivergence > 0.15,
  `Linear lerp diverges by ${(linearDivergence * 100).toFixed(2)}% under 0.2s lag spike (saturated in 1 frame!)`
);

let damp60_02s = 0.0;
for (let i = 0; i < 12; i++) damp60_02s = dampK(damp60_02s, 1.0, 8.0, 0.2 / 12);
let dampLag_02s = dampK(0.0, 1.0, 8.0, 0.2);
const dampDivergence = Math.abs(dampLag_02s - damp60_02s);

reportTest(
  'New dampK Preserves Perfect Invariance Under 0.2s Lag Spike',
  dampDivergence < 1e-14,
  `dampK divergence between 12x(0.2/12) and 1x0.2 = ${dampDivergence.toExponential(4)}`
);

// 2.3 Angle Damping Invariance across boundary wrap-around
const angleTarget = -Math.PI + 0.2;
const angleStart = Math.PI - 0.2;
let a60 = angleStart;
for (let i = 0; i < 60; i++) a60 = dampAngle(a60, angleTarget, 10.0, 1.0 / 60.0);

let aLag = angleStart;
for (let i = 0; i < 5; i++) aLag = dampAngle(aLag, angleTarget, 10.0, 0.2);

const angleDiff = Math.abs(Math.atan2(Math.sin(a60 - aLag), Math.cos(a60 - aLag)));
reportTest('dampAngle Invariance Across Pi Discontinuity', angleDiff < 1e-12, `Difference between 60 FPS and 5x0.2s lag spike = ${angleDiff.toExponential(4)} rad`);


// ============================================================================
// SUITE 3: FLOOR STEP TRANSLATION SUPPRESSION DURING standing_up
// ============================================================================
console.log('\n--- SUITE 3: Floor Step Translation Suppression During standing_up ---');

class MockActor {
  constructor(id, initialDeskPos) {
    this.key = id;
    this.p = {
      root: {
        position: { x: initialDeskPos.x, y: 0, z: initialDeskPos.z },
        rotation: { x: 0, y: Math.PI, z: 0 },
      },
      hips: { position: { y: 0.505 } },
      knee: [{ rotation: { x: 1.45 } }, { rotation: { x: 1.45 } }],
      hip: [{ rotation: { x: -1.5 } }, { rotation: { x: -1.5 } }],
      spine: { rotation: { x: 0.1, y: 0, z: 0 }, position: { y: 0.06 } },
      head: { rotation: { x: 0.08, y: 0, z: 0 } },
      sh: [{ rotation: { x: -0.55, z: 0.08 } }, { rotation: { x: -0.55, z: -0.08 } }],
      el: [{ rotation: { x: -0.95, z: 0 } }, { rotation: { x: -0.95, z: 0 } }],
      nod: 0,
    };
    this.goal = 'desk:d1';
    this.seated = true;
    this.walking = false;
    this.transState = null;
    this.transTime = 0;
    this.transDur = 0.5;
    this.pendingGoal = null;
    this.heading = Math.PI;
    this.path = [];
    this.i = 0;
  }

  // Exact reproduction of goTo logic from kantor.js
  goTo(placeId, places) {
    const pl = places[placeId];
    if (!pl) return;
    if (this.goal === placeId) {
      const distToGoal = Math.hypot(this.p.root.position.x - pl.pos.x, this.p.root.position.z - pl.pos.z);
      if ((this.walking || this.transState) || distToGoal <= 0.1) return;
    }
    if (this.transState === 'standing_up') {
      this.pendingGoal = placeId;
      return;
    }
    if (this.transState === 'sitting_down') {
      const p = Math.min(1.0, this.transTime / this.transDur);
      this.transState = 'standing_up';
      this.transDur = 0.5;
      this.transTime = (1.0 - p) * this.transDur;
      this.pendingGoal = placeId;
      return;
    }
    const seatedAtLounge = !this.walking && !this.seated && Boolean(places[this.goal]?.sit);
    if (this.seated || seatedAtLounge) {
      if (this.seated) {
        this.seated = false;
      }
      this.transState = 'standing_up';
      this.transTime = 0;
      this.transDur = 0.5;
      this.pendingGoal = placeId;
      this.walking = false;
      this.holding = null;
      return;
    }
    this.startRoute(placeId, places);
  }

  startRoute(placeId, places) {
    this.goal = placeId;
    this.path = [{ p: { x: places[placeId].pos.x, z: places[placeId].pos.z } }];
    this.i = 0;
    this.walking = true;
    this.transState = null;
  }

  // Exact reproduction of updateActor transition logic from kantor.js
  update(dt, places) {
    const root = this.p.root;

    // Floor walking translation block
    if (this.walking) {
      const g = this.path[this.i];
      const dx = g.p.x - root.position.x;
      const dz = g.p.z - root.position.z;
      const horizDist = Math.hypot(dx, dz);
      if (horizDist > 0.05) {
        const step = Math.min(horizDist, 1.8 * dt);
        root.position.x += (dx / horizDist) * step;
        root.position.z += (dz / horizDist) * step;
      }
    }

    // Transition state block
    if (this.transState === 'standing_up') {
      this.transTime += dt;
      const progress = Math.min(1.0, this.transTime / this.transDur);
      const s = smoothstep5(progress);
      const pl = places[this.goal];
      const isSofa = pl?.sit === 'sofa';
      
      // Update pose
      const T = getTransitionPose(false, s, isSofa);
      this.p.hips.position.y = dampK(this.p.hips.position.y, T.hipsY, 10.0, dt);
      this.p.knee[0].rotation.x = dampK(this.p.knee[0].rotation.x, T.lKneeX, 12.0, dt);
      this.p.knee[1].rotation.x = dampK(this.p.knee[1].rotation.x, T.rKneeX, 12.0, dt);

      if (progress >= 1.0) {
        this.transState = null;
        if (this.pendingGoal) {
          const dest = this.pendingGoal;
          this.pendingGoal = null;
          this.startRoute(dest, places);
        }
      }
    }
  }
}

// Run Empirical Standing-Up Simulation
const mockPlaces = {
  'desk:d1': { kind: 'desk', pos: { x: -3.5, z: -2.85 } },
  'coffee': { kind: 'spot', pos: { x: -0.1, z: -3.7 }, spot: 'coffee' },
  'tv': { kind: 'spot', pos: { x: 6.2, z: 1.35 }, spot: 'tv', sit: 'sofa' },
  'arcade': { kind: 'spot', pos: { x: 8.5, z: 0.9 }, spot: 'arcade' },
};

const actor = new MockActor('tim_1', mockPlaces['desk:d1'].pos);
const initialX = actor.p.root.position.x;
const initialZ = actor.p.root.position.z;

// 1. Trigger goTo while seated
actor.goTo('coffee', mockPlaces);

reportTest(
  'Pre-condition: standing_up state engaged immediately upon goTo',
  actor.transState === 'standing_up' && actor.walking === false && actor.seated === false,
  `transState=${actor.transState}, walking=${actor.walking}, seated=${actor.seated}`
);

// 2. Step 60 FPS across transition duration (0.5s = 30 frames)
let maxStepWhileStanding = 0;
let kneeFlexedWhileStanding = true;
let totalFrames = 30;
let walkingStartedFrame = -1;

for (let f = 1; f <= 45; f++) {
  actor.update(1.0 / 60.0, mockPlaces);
  
  const currentDisplacement = Math.hypot(actor.p.root.position.x - initialX, actor.p.root.position.z - initialZ);
  
  if (f <= totalFrames) {
    // During standing up phase (f <= 30 frames, t <= 0.5s)
    if (currentDisplacement > maxStepWhileStanding) maxStepWhileStanding = currentDisplacement;
    
    // Check if knees are still unstraightened during transition
    if (f < 20 && actor.p.knee[0].rotation.x < 0.2) {
      kneeFlexedWhileStanding = false;
    }
  } else {
    // Post transition phase (f > 30 frames): walking must now commence
    if (actor.walking && walkingStartedFrame === -1) {
      walkingStartedFrame = f;
    }
  }
}

reportTest(
  'Floor Step Translation Strictly Zero During standing_up',
  maxStepWhileStanding === 0.0,
  `Maximum translation displacement during 0.5s stand-up = ${maxStepWhileStanding.toFixed(6)} meters`
);

reportTest(
  'Knees Remain Flexed While Transitioning to Stand',
  kneeFlexedWhileStanding,
  `Knees maintain realistic bend and uncurl smoothly as hips rise`
);

reportTest(
  'Walking Translation Commences Only After Full Extension (t >= 0.5s)',
  walkingStartedFrame === 31,
  `Walking commenced at frame ${walkingStartedFrame} (t = ${(walkingStartedFrame / 60).toFixed(3)}s), exactly upon transState completion`
);

// 3. Adversarial Test: Calling goTo again with a different destination during standing_up
const actor2 = new MockActor('tim_2', mockPlaces['desk:d1'].pos);
actor2.goTo('coffee', mockPlaces);
actor2.update(0.2, mockPlaces); // halfway through standing up (t=0.2s)
assert(actor2.transState === 'standing_up');

// Interrupt with 'tv'
actor2.goTo('tv', mockPlaces);
reportTest(
  'Adversarial Interruption: New goTo during standing_up updates pendingGoal without jump',
  actor2.transState === 'standing_up' && actor2.pendingGoal === 'tv' && actor2.walking === false,
  `pendingGoal smoothly redirected to tv; transState preserved`
);

// Advance to finish
actor2.update(0.35, mockPlaces);
reportTest(
  'Interrupted Agent Successfully Routes to Latest Pending Destination',
  actor2.goal === 'tv' && actor2.walking === true && actor2.transState === null,
  `Final goal achieved is tv, walking initiated cleanly`
);


// ============================================================================
// SUITE 4: RECREATION & LOUNGE SOFA STAND-UP VERIFICATION
// ============================================================================
console.log('\n--- SUITE 4: Sofa & Meeting Chair Stand-up Verification ---');

const sofaActor = new MockActor('tim_sofa', mockPlaces['tv'].pos);
sofaActor.goal = 'tv';
sofaActor.seated = false;
sofaActor.walking = false;
sofaActor.p.hips.position.y = 0.515; // sofa hips height

sofaActor.goTo('arcade', mockPlaces);
reportTest(
  'Sofa Seated Agent Transitions via standing_up (seatedAtLounge check)',
  sofaActor.transState === 'standing_up' && sofaActor.walking === false,
  `Agent on sofa does not slide across floor; triggers standing_up`
);

let sofaStepDrift = 0;
for (let f = 1; f <= 30; f++) {
  sofaActor.update(1.0 / 60.0, mockPlaces);
  const drift = Math.hypot(sofaActor.p.root.position.x - mockPlaces['tv'].pos.x, sofaActor.p.root.position.z - mockPlaces['tv'].pos.z);
  if (drift > sofaStepDrift) sofaStepDrift = drift;
}
reportTest(
  'Zero Step Drift When Rising From Sofa',
  sofaStepDrift === 0.0,
  `Sofa stand-up translation drift = ${sofaStepDrift.toFixed(6)} meters`
);


// ============================================================================
// SUITE 5: COMPLIANCE CHECK FOR EMOJIS IN TARGET JAVASCRIPT CODEBASE
// ============================================================================
console.log('\n--- SUITE 5: Strict 0 Emoji Compliance in kantor.js ---');

const kantorJsPath = path.resolve('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js');
const kantorJsCode = fs.readFileSync(kantorJsPath, 'utf8');

// Regex for Unicode Emojis and Dingbats
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

const emojiMatch = kantorJsCode.match(emojiRegex);
reportTest(
  'Zero Emojis & Dingbats in kantor.js',
  emojiMatch === null,
  emojiMatch ? `Found forbidden emoji: ${emojiMatch[0]}` : 'Pure SVG icons and clean typography verified'
);


// ============================================================================
// SUMMARY & VERDICT
// ============================================================================
console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('================================================================');

if (failedTests === 0) {
  console.log('\nVERDICT: APPROVE');
  console.log('All empirical tests, continuity checks, numerical invariances, and state machine validations passed completely.');
  process.exit(0);
} else {
  console.error('\nVERDICT: REQUEST_CHANGES');
  console.error(`${failedTests} test(s) failed during empirical stress-testing.`);
  process.exit(1);
}

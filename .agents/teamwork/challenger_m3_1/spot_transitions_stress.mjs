// Spot Transition Stress Test across all spots in kantor.js
// Author: Challenger M3-1

import assert from 'assert';

console.log('=== MULTI-SPOT TRANSITION SIMULATION HARNESS ===\n');

const SPOTS_DEF = {
  tv: { sit: 'sofa' },
  ps: { sit: 'sofa' },
  arcade: {},
  foosball1: {},
  foosball2: {},
  coffee: {},
  water: {},
  window: {},
  guitar: {},
  meet1: { sit: 'chair' },
  meet2: { sit: 'chair' },
  meet3: { sit: 'chair' },
  'desk:d1': { kind: 'desk' },
  'desk:d2': { kind: 'desk' },
};

function smoothstep5(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

function dampK(cur, target, lambda, dt) {
  const k = 1.0 - Math.exp(-lambda * dt);
  return cur + (target - cur) * k;
}

function getTransitionPose(fromStanding, s, isSofa = false) {
  const targetHipsY = isSofa ? 0.515 : 0.505;
  const factor = fromStanding ? s : (1.0 - s);
  return {
    hipsY: 0.90 + (targetHipsY - 0.90) * factor,
    lKneeX: 1.45 * factor,
    rKneeX: 1.45 * factor,
  };
}

class AgentState {
  constructor() {
    this.goal = 'desk:d1';
    this.seated = true;
    this.walking = false;
    this.transState = null;
    this.transTime = 0;
    this.transDur = 0.5;
    this.pendingGoal = null;
    this.posX = 0;
    this.posZ = 0;
    this.hipsY = 0.505;
    this.kneeX = 1.45;
  }

  goTo(placeId) {
    const pl = SPOTS_DEF[placeId];
    if (!pl) return;
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
    const seatedAtLounge = !this.walking && !this.seated && Boolean(SPOTS_DEF[this.goal]?.sit);
    if (this.seated || seatedAtLounge) {
      if (this.seated) this.seated = false;
      this.transState = 'standing_up';
      this.transTime = 0;
      this.transDur = 0.5;
      this.pendingGoal = placeId;
      this.walking = false;
      return;
    }
    this.startRoute(placeId);
  }

  startRoute(placeId) {
    this.goal = placeId;
    this.walking = true;
    this.transState = null;
  }

  arrive() {
    this.walking = false;
    const pl = SPOTS_DEF[this.goal];
    if (pl.kind === 'desk' || pl.sit) {
      this.transState = 'sitting_down';
      this.transTime = 0;
      this.transDur = 0.5;
    }
  }

  step(dt) {
    if (this.walking) {
      this.posX += 1.8 * dt; // simulate walking translation
      this.posZ += 1.8 * dt;
    }
    if (this.transState === 'standing_up') {
      this.transTime += dt;
      const p = Math.min(1.0, this.transTime / this.transDur);
      const s = smoothstep5(p);
      const isSofa = SPOTS_DEF[this.goal]?.sit === 'sofa';
      const T = getTransitionPose(false, s, isSofa);
      this.hipsY = dampK(this.hipsY, T.hipsY, 10.0, dt);
      this.kneeX = dampK(this.kneeX, T.lKneeX, 12.0, dt);
      if (p >= 1.0) {
        this.transState = null;
        if (this.pendingGoal) {
          const dest = this.pendingGoal;
          this.pendingGoal = null;
          this.startRoute(dest);
        }
      }
    } else if (this.transState === 'sitting_down') {
      this.transTime += dt;
      const p = Math.min(1.0, this.transTime / this.transDur);
      const s = smoothstep5(p);
      const isSofa = SPOTS_DEF[this.goal]?.sit === 'sofa';
      const T = getTransitionPose(true, s, isSofa);
      this.hipsY = dampK(this.hipsY, T.hipsY, 10.0, dt);
      this.kneeX = dampK(this.kneeX, T.lKneeX, 12.0, dt);
      if (p >= 1.0) {
        this.transState = null;
        if (SPOTS_DEF[this.goal]?.kind === 'desk') {
          this.seated = true;
        }
      }
    }
  }
}

// Test matrix of origin -> destination paths
const journeys = [
  { from: 'desk:d1', to: 'coffee', expectStand: true, expectSit: false },
  { from: 'coffee', to: 'tv', expectStand: false, expectSit: true },
  { from: 'tv', to: 'ps', expectStand: true, expectSit: true },
  { from: 'ps', to: 'meet1', expectStand: true, expectSit: true },
  { from: 'meet1', to: 'arcade', expectStand: true, expectSit: false },
  { from: 'arcade', to: 'guitar', expectStand: false, expectSit: false },
  { from: 'guitar', to: 'desk:d2', expectStand: false, expectSit: true },
];

const dt = 1 / 60;
let totalJourneys = 0;
let passedJourneys = 0;

for (const j of journeys) {
  totalJourneys++;
  const a = new AgentState();
  a.goal = j.from;
  if (SPOTS_DEF[j.from].kind === 'desk') {
    a.seated = true;
    a.hipsY = 0.505;
  } else if (SPOTS_DEF[j.from].sit) {
    a.seated = false;
    a.hipsY = SPOTS_DEF[j.from].sit === 'sofa' ? 0.515 : 0.505;
  } else {
    a.seated = false;
    a.hipsY = 0.90;
    a.kneeX = 0.0;
  }

  const startX = a.posX;
  const startZ = a.posZ;

  a.goTo(j.to);

  let translationDuringStand = 0;

  if (j.expectStand) {
    assert.strictEqual(a.transState, 'standing_up', `Expected standing_up for journey ${j.from} -> ${j.to}`);
    assert.strictEqual(a.walking, false, `Expected walking=false during standing_up`);
    // Run stand-up duration until transition completes
    let standFrames = 0;
    while (a.transState === 'standing_up' && standFrames < 35) {
      a.step(dt);
      standFrames++;
      const shift = Math.hypot(a.posX - startX, a.posZ - startZ);
      if (shift > translationDuringStand) translationDuringStand = shift;
    }
    assert.strictEqual(translationDuringStand, 0, `Floor translation must be 0 while standing up`);
    assert.strictEqual(a.transState, null, `standing_up should complete cleanly`);
    assert.strictEqual(a.walking, true, `Walking should now start after standing up`);
  } else {
    assert.strictEqual(a.walking, true, `Expected immediate walking for ${j.from} -> ${j.to}`);
  }

  // Simulate walking to destination (10 frames)
  for (let f = 0; f < 10; f++) a.step(dt);
  assert.strictEqual(a.walking, true);

  // Arrive
  a.arrive();
  if (j.expectSit) {
    assert.strictEqual(a.transState, 'sitting_down', `Expected sitting_down upon arrive at ${j.to}`);
    // Run sitting down duration
    let sitFrames = 0;
    while (a.transState === 'sitting_down' && sitFrames < 35) {
      a.step(dt);
      sitFrames++;
    }
    assert.strictEqual(a.transState, null, `sitting_down must complete after 0.5s`);
  } else {
    assert.strictEqual(a.transState, null, `Expected no sitting transition for standing spot ${j.to}`);
  }

  passedJourneys++;
  console.log(`[PASS] Journey ${j.from.padEnd(8)} -> ${j.to.padEnd(8)} (Stand: ${j.expectStand}, Sit: ${j.expectSit}) verified.`);
}

console.log(`\nSuccessfully validated all ${passedJourneys}/${totalJourneys} spot transition journeys.`);

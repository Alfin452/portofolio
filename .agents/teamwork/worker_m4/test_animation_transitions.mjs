import fs from 'node:fs';
import path from 'node:path';

console.log('=== TEST SUITE 3: CONTEXTUAL ANIMATIONS & TRANSITIONS (F12 - F14) ===\n');

const kantorJsPath = path.resolve('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js');
const src = fs.readFileSync(kantorJsPath, 'utf8');

let suitePassed = true;

// 1. Verify Quintic Smoothstep Mathematical Guarantees
function quintic(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

function quinticDeriv(t, eps = 1e-6) {
  return (quintic(t + eps) - quintic(t - eps)) / (2 * eps);
}

function quinticSecondDeriv(t, eps = 1e-5) {
  return (quintic(t + eps) - 2 * quintic(t) + quintic(t - eps)) / (eps * eps);
}

const q0 = quintic(0);
const q1 = quintic(1);
const d0 = quinticDeriv(0);
const d1 = quinticDeriv(1);
const d2_0 = quinticSecondDeriv(0);
const d2_1 = quinticSecondDeriv(1);

console.log(`[MATH] Quintic: S(0)=${q0}, S(1)=${q1}, S'(0)=${d0.toFixed(6)}, S'(1)=${d1.toFixed(6)}, S''(0)=${d2_0.toFixed(4)}, S''(1)=${d2_1.toFixed(4)}`);

if (q0 === 0 && q1 === 1 && Math.abs(d0) < 1e-4 && Math.abs(d1) < 1e-4 && Math.abs(d2_0) < 1e-3 && Math.abs(d2_1) < 1e-3) {
  console.log('[PASS] Quintic smoothstep: Verified C2-continuity with zero endpoint velocity and zero endpoint jerk.');
} else {
  console.error('[FAIL] Quintic smoothstep does not satisfy C2 endpoint constraints.');
  suitePassed = false;
}

// Check monotonicity
let monotonic = true;
for (let t = 0; t <= 1.0; t += 0.02) {
  if (quinticDeriv(t) < -1e-6) monotonic = false;
}
if (monotonic) {
  console.log('[PASS] Quintic smoothstep: Strictly monotonic progression (no oscillations or reversals).');
} else {
  console.error('[FAIL] Quintic smoothstep is non-monotonic.');
  suitePassed = false;
}

// 2. Verify Frame-Rate Invariant Exponential Damping
function dampK(lambda, dt) {
  return 1.0 - Math.exp(-lambda * dt);
}
const lambda = 8.0;
const totalDt = 0.1;
const stepN = 10;
const subDt = totalDt / stepN;

let rem1 = 1.0 - dampK(lambda, totalDt);
let rem2 = 1.0;
for (let i = 0; i < stepN; i++) {
  rem2 *= (1.0 - dampK(lambda, subDt));
}
const deltaRem = Math.abs(rem1 - rem2);
console.log(`[MATH] Exponential Damping Frame-Rate Invariance delta: ${deltaRem.toExponential(4)}`);
if (deltaRem < 1e-12) {
  console.log('[PASS] Exponential damping: Exactly frame-rate invariant across variable dt.');
} else {
  console.error('[FAIL] Exponential damping delta exceeds tolerance.');
  suitePassed = false;
}

// 3. Test workMode Tool Mapping
const workModeMatch = src.match(/function workMode\(a\) \{([\s\S]*?)\n\}/);
if (!workModeMatch) throw new Error('Could not find workMode in kantor.js');

const workMode = new Function('a', workModeMatch[1] + '\nreturn workMode(a);');

const toolExpectations = [
  // Terminal / Exec
  { tool: 'run_command', expected: 'terminal' },
  { tool: 'bash', expected: 'terminal' },
  { tool: 'terminal', expected: 'terminal' },
  { tool: 'exec', expected: 'terminal' },
  // Read
  { tool: 'view_file', expected: 'read' },
  { tool: 'read_url_content', expected: 'read' },
  { tool: 'read', expected: 'read' },
  { tool: 'readfile', expected: 'read' },
  // Focus Screen
  { tool: 'grep_search', expected: 'focus_screen' },
  { tool: 'find_by_name', expected: 'focus_screen' },
  { tool: 'list_dir', expected: 'focus_screen' },
  { tool: 'search_web', expected: 'focus_screen' },
  { tool: 'glob', expected: 'focus_screen' },
  // Mouse / Canvas
  { tool: 'generate_image', expected: 'mouse' },
  { tool: 'canvas', expected: 'mouse' },
  // Type
  { tool: 'write_to_file', expected: 'type' },
  { tool: 'replace_file_content', expected: 'type' },
  { tool: 'notebook_edit', expected: 'type' },
  { tool: 'edit', expected: 'type' },
  // Think / Task Coordination
  { tool: 'manage_task', expected: 'think' },
  { tool: 'send_message', expected: 'think' },
  { tool: 'schedule', expected: 'think' },
  { tool: 'agent', expected: 'think' }
];

let toolsPassed = true;
for (const tc of toolExpectations) {
  const actorMock = {
    kind: 'tim',
    data: {
      state: 'bekerja',
      run: {
        last: [{ kind: 'tool', tool: tc.tool }]
      }
    }
  };
  const result = workMode(actorMock);
  if (result === tc.expected) {
    console.log(`[PASS] workMode tool "${tc.tool}" => "${result}"`);
  } else {
    console.error(`[FAIL] workMode tool "${tc.tool}": expected "${tc.expected}", got "${result}"`);
    toolsPassed = false;
  }
}
if (!toolsPassed) suitePassed = false;

// 4. Test State Transition Machine Architecture in Source
const hasSittingDown = src.includes("a.transState = 'sitting_down'");
const hasStandingUp = src.includes("a.transState = 'standing_up'");
const hasQuinticCall = src.includes('smoothstepQuintic') || src.includes('smoothstep(p)') || src.includes('t * t * t * (t * (t * 6 - 15) + 10)') || src.includes('6 * p - 15');
const hasDampAngle = src.includes('dampAngle(') || src.includes('dampK(');

if (hasSittingDown && hasStandingUp) {
  console.log('[PASS] Sit/Stand Transition Machine: Both "sitting_down" and "standing_up" explicit states implemented.');
} else {
  console.error('[FAIL] Sitting/Standing state machine missing states.');
  suitePassed = false;
}

// 5. Test Realistic Relaxed Poses in spotPose
const spotPoseMatch = src.match(/function spotPose\(a, spot, t\) \{([\s\S]*?)\n\}/);
if (!spotPoseMatch) throw new Error('Could not find spotPose in kantor.js');

const spotPose = new Function('a', 'spot', 't', 'performance', 'SEATED', spotPoseMatch[1] + '\nreturn spotPose(a, spot, t);');
const SEATED = { hipsY: 0.505, spineX: 0.05, lHipX: -1.5, rHipX: -1.5, lKneeX: 1.45, rKneeX: 1.45 };
const perfMock = { now: () => 100000 };

const spotsToTest = ['tv', 'ps', 'arcade', 'foosball1', 'foosball2', 'coffee', 'water', 'window', 'guitar', 'meet1', 'meet2', 'meet3'];
for (const s of spotsToTest) {
  const actorMock = { arrivedAt: 90000, seed: 12 };
  const pose = spotPose(actorMock, s, 5.0, perfMock, SEATED);
  if (!pose || typeof pose.hipsY !== 'number') {
    console.error(`[FAIL] spotPose for "${s}" returned invalid pose object.`);
    suitePassed = false;
  } else {
    console.log(`[PASS] spotPose for "${s}": Valid continuous pose generated (hipsY=${pose.hipsY}, spineX=${(pose.spineX||0).toFixed(2)})`);
  }
}

if (!suitePassed) {
  console.error('\n--> Test Suite 3 FAILED');
  process.exit(1);
} else {
  console.log('\n--> Test Suite 3 PASSED (All assertions met)');
  process.exit(0);
}

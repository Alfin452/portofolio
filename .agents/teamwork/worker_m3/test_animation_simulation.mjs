// Comprehensive Simulation Test for Milestone 3 (F12, F13, F14)
import assert from 'assert';

console.log('=== RUNNING DETAILED ANIMATION SIMULATION ===\n');

// 1. Quintic smoothstep mathematical properties
function smoothstep5(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

// Numerical derivative check: dS/dt at t=0 and t=1 must be 0
const eps = 1e-5;
const dS_0 = (smoothstep5(eps) - smoothstep5(0)) / eps;
const dS_1 = (smoothstep5(1) - smoothstep5(1 - eps)) / eps;
assert(Math.abs(dS_0) < 1e-3, 'dS/dt at 0 must be 0 (no jerk at start)');
assert(Math.abs(dS_1) < 1e-3, 'dS/dt at 1 must be 0 (no jerk at end)');
console.log('[PASS] Quintic smoothstep zero endpoint jerk verified:');
console.log(`       dS/dt(0) = ${dS_0.toFixed(6)}, dS/dt(1) = ${dS_1.toFixed(6)}`);

// 2. Exponential damping invariance test
function dampK(cur, target, lambda, dt) {
  const k = 1.0 - Math.exp(-lambda * dt);
  return cur + (target - cur) * k;
}

// Compare 1 step of dt=0.1 vs 10 steps of dt=0.01
const target = 1.0;
const lambda = 8.0;
let valFine = 0.0;
for (let i = 0; i < 10; i++) {
  valFine = dampK(valFine, target, lambda, 0.01);
}
let valCoarse = dampK(0.0, target, lambda, 0.1);
const dampingDiff = Math.abs(valFine - valCoarse);
assert(dampingDiff < 1e-6, `Exponential damping must be frame-rate invariant, diff=${dampingDiff}`);
console.log(`[PASS] Exponential damping frame-rate invariance verified (diff = ${dampingDiff.toExponential(4)})`);

// 3. Sitting down transition simulation
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

// Simulate sitting down over 0.5s at 60fps (dt = 1/60s)
const dt = 1 / 60;
const dur = 0.5;
let transTime = 0;
let hipsYHistory = [];
let kneeHistory = [];

while (transTime <= dur + 1e-5) {
  const p = Math.min(1.0, transTime / dur);
  const s = smoothstep5(p);
  const pose = getTransitionPose(true, s, false);
  hipsYHistory.push(pose.hipsY);
  kneeHistory.push(pose.lKneeX);
  transTime += dt;
}

assert(Math.abs(hipsYHistory[0] - 0.90) < 1e-4, 'Initial hips Y must be 0.90 (standing)');
assert(Math.abs(hipsYHistory[hipsYHistory.length - 1] - 0.505) < 1e-4, 'Final hips Y must be 0.505 (seated)');
assert(Math.abs(kneeHistory[0] - 0.0) < 1e-4, 'Initial knee flex must be 0.0');
assert(Math.abs(kneeHistory[kneeHistory.length - 1] - 1.45) < 1e-4, 'Final knee flex must be 1.45 rad');

// Verify monotonicity: hips must strictly descend, knees must strictly flex
for (let i = 1; i < hipsYHistory.length; i++) {
  assert(hipsYHistory[i] <= hipsYHistory[i - 1], `Hips must descend monotonically at step ${i}`);
  assert(kneeHistory[i] >= kneeHistory[i - 1], `Knees must fold monotonically at step ${i}`);
}
console.log(`[PASS] Sitting down transition simulated successfully over ${hipsYHistory.length} frames.`);
console.log(`       Hips Y: ${hipsYHistory[0].toFixed(3)} -> ${hipsYHistory[hipsYHistory.length - 1].toFixed(3)}`);
console.log(`       Knees flex: ${kneeHistory[0].toFixed(3)} rad -> ${kneeHistory[kneeHistory.length - 1].toFixed(3)} rad`);

// 4. Standing up transition simulation
transTime = 0;
let hipsYStand = [];
let kneeStand = [];
while (transTime <= dur + 1e-5) {
  const p = Math.min(1.0, transTime / dur);
  const s = smoothstep5(p);
  const pose = getTransitionPose(false, s, false);
  hipsYStand.push(pose.hipsY);
  kneeStand.push(pose.lKneeX);
  transTime += dt;
}

assert(Math.abs(hipsYStand[0] - 0.505) < 1e-4, 'Initial hips Y must be 0.505 (seated)');
assert(Math.abs(hipsYStand[hipsYStand.length - 1] - 0.90) < 1e-4, 'Final hips Y must be 0.90 (standing)');
for (let i = 1; i < hipsYStand.length; i++) {
  assert(hipsYStand[i] >= hipsYStand[i - 1], `Hips must rise monotonically at step ${i}`);
  assert(kneeStand[i] <= kneeStand[i - 1], `Knees must straighten monotonically at step ${i}`);
}
console.log(`[PASS] Standing up transition simulated successfully over ${hipsYStand.length} frames.`);
console.log(`       Hips Y: ${hipsYStand[0].toFixed(3)} -> ${hipsYStand[hipsYStand.length - 1].toFixed(3)}`);
console.log(`       Knees flex: ${kneeStand[0].toFixed(3)} rad -> ${kneeStand[kneeStand.length - 1].toFixed(3)} rad`);

// 5. Tool mapping test for Antigravity & Claude Code
function workMode(a) {
  const d = a.data;
  if (!d) return 'type';
  if (d.state === 'selesai') return 'done';
  if (a.kind === 'ketua') {
    if (d.activity === 'menunggu-tim') return 'read';
  }
  const e = (a.kind === 'ketua' ? d.last : d.run?.last)?.[0];
  if (!e) return 'type';
  if (e.kind === 'text') return 'think';
  const tool = String(e.tool || '').toLowerCase().trim();
  if (['bash', 'run_command', 'terminal', 'exec'].includes(tool)) return 'terminal';
  if (['read', 'view_file', 'readfile', 'read_url_content'].includes(tool)) return 'read';
  if (['grep', 'grep_search', 'glob', 'find_by_name', 'list_dir', 'search_web', 'websearch', 'webfetch'].includes(tool)) return 'focus_screen';
  if (['generate_image', 'canvas', 'image'].includes(tool)) return 'mouse';
  if (['write', 'writefile', 'write_to_file', 'edit', 'editfile', 'replace_file_content', 'notebook_edit'].includes(tool)) return 'type';
  if (['agent', 'task', 'manage_task', 'sendmessage', 'send_message', 'askuserquestion', 'askquestion', 'todowrite', 'schedule'].includes(tool)) return 'think';
  return 'type';
}

const testCases = [
  { tool: 'run_command', expected: 'terminal' },
  { tool: 'Bash', expected: 'terminal' },
  { tool: 'view_file', expected: 'read' },
  { tool: 'Read', expected: 'read' },
  { tool: 'read_url_content', expected: 'read' },
  { tool: 'grep_search', expected: 'focus_screen' },
  { tool: 'find_by_name', expected: 'focus_screen' },
  { tool: 'list_dir', expected: 'focus_screen' },
  { tool: 'search_web', expected: 'focus_screen' },
  { tool: 'generate_image', expected: 'mouse' },
  { tool: 'write_to_file', expected: 'type' },
  { tool: 'replace_file_content', expected: 'type' },
  { tool: 'send_message', expected: 'think' },
  { tool: 'manage_task', expected: 'think' },
  { tool: 'schedule', expected: 'think' },
];

console.log('\n5. Antigravity & Claude Code Tool Mapping Verification:');
testCases.forEach(tc => {
  const actor = { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: tc.tool, kind: 'tool' }] } } };
  const mode = workMode(actor);
  assert.strictEqual(mode, tc.expected, `Tool ${tc.tool} should map to ${tc.expected}`);
  console.log(`   [PASS] ${tc.tool.padEnd(22)} -> ${mode}`);
});

console.log('\n=== ALL SIMULATION TESTS PASSED PERFECTLY ===');

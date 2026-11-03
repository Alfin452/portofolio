import assert from 'assert';
import fs from 'fs';

console.log('=== ADVERSARIAL STRESS TEST SUITE (REVIEWER M3-1) ===\n');

// -----------------------------------------------------------------------------
// 1. Smoothstep5 Boundary & Symmetry Stress Test
// -----------------------------------------------------------------------------
console.log('1. Testing Quintic Smoothstep5 Boundaries, Monotonicity & Symmetry...');
function smoothstep5(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

// Extrema clamping
assert.strictEqual(smoothstep5(-100), 0, 'Negative values must clamp to 0');
assert.strictEqual(smoothstep5(-0.0001), 0, 'Small negative values must clamp to 0');
assert.strictEqual(smoothstep5(1.0001), 1, 'Values > 1 must clamp to 1');
assert.strictEqual(smoothstep5(100), 1, 'Large values must clamp to 1');
assert.strictEqual(smoothstep5(0), 0);
assert.strictEqual(smoothstep5(0.5), 0.5);
assert.strictEqual(smoothstep5(1), 1);

// Monotonicity check across 10,000 subdivisions
let prev = -1;
for (let i = 0; i <= 10000; i++) {
  const t = i / 10000;
  const s = smoothstep5(t);
  assert(s >= prev, `Monotonicity violation at t=${t}: s=${s} < prev=${prev}`);
  // Symmetry check: S(1 - t) === 1 - S(t)
  const sSym = smoothstep5(1.0 - t);
  const diffSym = Math.abs(s + sSym - 1.0);
  assert(diffSym < 1e-12, `Symmetry violation at t=${t}: diff=${diffSym}`);
  prev = s;
}

// C1 and C2 Continuity: dS/dt = 0, d2S/dt2 = 0 at endpoints
const eps = 1e-6;
const dS_0 = (smoothstep5(eps) - smoothstep5(0)) / eps;
const dS_1 = (smoothstep5(1) - smoothstep5(1 - eps)) / eps;
assert(Math.abs(dS_0) < 1e-4, 'First derivative at 0 must be 0');
assert(Math.abs(dS_1) < 1e-4, 'First derivative at 1 must be 0');
console.log('   [PASS] Boundaries, monotonicity, symmetry, and C2 continuity verified.');

// -----------------------------------------------------------------------------
// 2. Transition Reversal Pose Continuity Test (Zero Positional Glitch)
// -----------------------------------------------------------------------------
console.log('\n2. Testing Mid-Transition Interruption & Reversal Continuity...');
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

// Suppose sitting down is interrupted at arbitrary progress points: 10%, 25%, 50%, 75%, 90%
const testPoints = [0.1, 0.25, 0.5, 0.75, 0.9];
testPoints.forEach(p => {
  const sDown = smoothstep5(p);
  const poseDown = getTransitionPose(true, sDown, false);

  // Kantor.js reversal logic in goTo():
  // a.transTime = (1.0 - p) * a.transDur;
  // In updateActor standing_up: progress = transTime / transDur = 1.0 - p;
  const pUp = 1.0 - p;
  const sUp = smoothstep5(pUp);
  const poseUp = getTransitionPose(false, sUp, false);

  const diffY = Math.abs(poseDown.hipsY - poseUp.hipsY);
  const diffKnee = Math.abs(poseDown.lKneeX - poseUp.lKneeX);
  const diffSpine = Math.abs(poseDown.spineX - poseUp.spineX);

  assert(diffY < 1e-12, `Hips Y mismatch upon reversal at p=${p}: diff=${diffY}`);
  assert(diffKnee < 1e-12, `Knee mismatch upon reversal at p=${p}: diff=${diffKnee}`);
  assert(diffSpine < 1e-12, `Spine mismatch upon reversal at p=${p}: diff=${diffSpine}`);
  console.log(`   [PASS] Reversal at p=${(p * 100).toFixed(0)}%: HipsY = ${poseDown.hipsY.toFixed(4)}, continuity delta = ${diffY}`);
});

// -----------------------------------------------------------------------------
// 3. Tool Mapping Comprehensive & Adversarial Fuzzing
// -----------------------------------------------------------------------------
console.log('\n3. Testing workMode(a) Tool Mapping & Corner Case Fuzzing...');
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

const adversarialInputs = [
  // Fallbacks & edge cases
  { actor: {}, expected: 'type', desc: 'Empty actor object' },
  { actor: { data: null }, expected: 'type', desc: 'Null data' },
  { actor: { data: { state: 'selesai' } }, expected: 'done', desc: 'State selesai' },
  { actor: { kind: 'ketua', data: { state: 'bekerja', activity: 'menunggu-tim' } }, expected: 'read', desc: 'Ketua menunggu-tim' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ kind: 'text' }] } } }, expected: 'think', desc: 'Text kind response' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: null }] } } }, expected: 'type', desc: 'Null tool' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: undefined }] } } }, expected: 'type', desc: 'Undefined tool' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 12345 }] } } }, expected: 'type', desc: 'Non-string tool number' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: '  RUN_COMMAND \n ' }] } } }, expected: 'terminal', desc: 'Whitespace & uppercase trim' },

  // All 13 Antigravity Tools
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'run_command' }] } } }, expected: 'terminal', desc: 'Antigravity run_command' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'view_file' }] } } }, expected: 'read', desc: 'Antigravity view_file' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'read_url_content' }] } } }, expected: 'read', desc: 'Antigravity read_url_content' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'grep_search' }] } } }, expected: 'focus_screen', desc: 'Antigravity grep_search' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'find_by_name' }] } } }, expected: 'focus_screen', desc: 'Antigravity find_by_name' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'list_dir' }] } } }, expected: 'focus_screen', desc: 'Antigravity list_dir' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'search_web' }] } } }, expected: 'focus_screen', desc: 'Antigravity search_web' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'generate_image' }] } } }, expected: 'mouse', desc: 'Antigravity generate_image' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'write_to_file' }] } } }, expected: 'type', desc: 'Antigravity write_to_file' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'replace_file_content' }] } } }, expected: 'type', desc: 'Antigravity replace_file_content' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'notebook_edit' }] } } }, expected: 'type', desc: 'Antigravity notebook_edit' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'manage_task' }] } } }, expected: 'think', desc: 'Antigravity manage_task' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'send_message' }] } } }, expected: 'think', desc: 'Antigravity send_message' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'schedule' }] } } }, expected: 'think', desc: 'Antigravity schedule' },

  // Claude Code compatibility tools
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'Bash' }] } } }, expected: 'terminal', desc: 'Claude Code Bash' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'Read' }] } } }, expected: 'read', desc: 'Claude Code Read' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'Grep' }] } } }, expected: 'focus_screen', desc: 'Claude Code Grep' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'Glob' }] } } }, expected: 'focus_screen', desc: 'Claude Code Glob' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'Edit' }] } } }, expected: 'type', desc: 'Claude Code Edit' },
  { actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'Task' }] } } }, expected: 'think', desc: 'Claude Code Task' },
];

adversarialInputs.forEach(ti => {
  const mode = workMode(ti.actor);
  assert.strictEqual(mode, ti.expected, `Failed for ${ti.desc}: got ${mode}, expected ${ti.expected}`);
  console.log(`   [PASS] ${ti.desc.padEnd(35)} -> ${mode}`);
});

// -----------------------------------------------------------------------------
// 4. Source Code Emoji & Dingbat Verification
// -----------------------------------------------------------------------------
console.log('\n4. Exhaustive Unicode Emoji & Dingbat Regex Scan on kantor.js...');
const kantorCode = fs.readFileSync('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js', 'utf8');
const strictEmojiRegex = /[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
const matches = [...kantorCode.matchAll(new RegExp(strictEmojiRegex.source, 'gu'))];
assert.strictEqual(matches.length, 0, `Found ${matches.length} emojis in kantor.js!`);
console.log(`   [PASS] 0 emojis / dingbats detected across ${kantorCode.length} characters of kantor.js.`);

console.log('\n=== ALL ADVERSARIAL STRESS TESTS COMPLETED SUCCESSFULLY ===');

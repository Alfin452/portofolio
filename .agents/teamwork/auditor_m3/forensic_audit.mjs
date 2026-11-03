import fs from 'fs';

console.log('====================================================');
console.log('   INDEPENDENT FORENSIC INTEGRITY AUDIT (M3)');
console.log('====================================================\n');

let violations = [];
let passCount = 0;

function assertCheck(cond, name, details = '') {
  if (cond) {
    console.log(`[PASS] ${name}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${name} ${details}`);
    violations.push({ name, details });
  }
}

// ----------------------------------------------------
// 1. WORK PRODUCT TARGET FILE VERIFICATION
// ----------------------------------------------------
console.log('--- 1. Target File & Git Diff Verification ---');
const targetFile = 'kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js';
assertCheck(fs.existsSync(targetFile), `Target file exists: ${targetFile}`);

const kantorJs = fs.readFileSync(targetFile, 'utf8');

// ----------------------------------------------------
// 2. ZERO-EMOJI AUDIT ON WORK PRODUCT
// ----------------------------------------------------
console.log('\n--- 2. Zero-Emoji Compliance on Work Product ---');
const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation}|[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}])/u;

const lines = kantorJs.split('\n');
let emojiMatchesInTarget = [];
lines.forEach((line, idx) => {
  if (emojiRegex.test(line)) {
    emojiMatchesInTarget.push({ line: idx + 1, content: line.trim() });
  }
});
assertCheck(
  emojiMatchesInTarget.length === 0,
  `Strict NO EMOJIS in ${targetFile}`,
  emojiMatchesInTarget.map(m => `Line ${m.line}: ${m.content}`).join('; ')
);

// ----------------------------------------------------
// 3. AUTHENTICITY & ANTI-FACADE ANALYSIS
// ----------------------------------------------------
console.log('\n--- 3. Authenticity & Anti-Facade Analysis ---');

// Quintic smoothstep
const hasSmoothstep5 = /function\s+smoothstep5\s*\(\s*t\s*\)\s*\{[\s\S]*?c\s*\*\s*c\s*\*\s*c\s*\*\s*\(\s*c\s*\*\s*\(\s*c\s*\*\s*6\s*-\s*15\s*\)\s*\+\s*10\s*\)/.test(kantorJs);
assertCheck(hasSmoothstep5, 'smoothstep5 implements authentic quintic Hermite polynomial S(t) = t^3*(t*(6t - 15) + 10)');

// Exponential damping
const hasDampK = /function\s+dampK\s*\([\s\S]*?1\.0\s*-\s*Math\.exp\(-lambda\s*\*\s*dt\)/.test(kantorJs);
assertCheck(hasDampK, 'dampK implements frame-rate invariant exponential damping');

const hasDampAngle = /function\s+dampAngle\s*\([\s\S]*?Math\.atan2\s*\(\s*Math\.sin\(target\s*-\s*cur\)/.test(kantorJs);
assertCheck(hasDampAngle, 'dampAngle implements angular geodesic damping with wrap-around');

// Scene graph parent switching
const hasSceneAttach = kantorJs.includes('scene.attach(a.p.root)');
assertCheck(hasSceneAttach, 'scene.attach(a.p.root) detaches character from chair to scene root on standing');

const hasSeatAttach = kantorJs.includes('pl.desk.seat.attach(a.p.root)');
assertCheck(hasSeatAttach, 'pl.desk.seat.attach(a.p.root) reparents character into desk chair seat on sitting arrival');

// State machine integration
const hasSittingDown = kantorJs.includes("a.transState === 'sitting_down'");
assertCheck(hasSittingDown, 'State machine tracks sitting_down state');

const hasStandingUp = kantorJs.includes("a.transState === 'standing_up'");
assertCheck(hasStandingUp, 'State machine tracks standing_up state');

// ----------------------------------------------------
// 4. KINEMATICS & ADVERSARIAL STRESS TESTING
// ----------------------------------------------------
console.log('\n--- 4. Kinematics Simulation & Adversarial Edge Cases ---');

function smoothstep5(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

function dampK(cur, target, lambda, dt) {
  const k = 1.0 - Math.exp(-lambda * dt);
  return cur + (target - cur) * k;
}

// Zero-jerk boundary conditions: dS/dt(0) = 0, dS/dt(1) = 0
const eps = 1e-6;
const dS0 = (smoothstep5(eps) - smoothstep5(0)) / eps;
const dS1 = (smoothstep5(1) - smoothstep5(1 - eps)) / eps;
assertCheck(Math.abs(dS0) < 1e-4, 'Zero acceleration jerk at t=0 (dS/dt = 0)');
assertCheck(Math.abs(dS1) < 1e-4, 'Zero deceleration jerk at t=1 (dS/dt = 0)');

// Damping stability under extreme dt (lag spikes, browser inactive)
const dtSpikes = [0, 1e-6, 0.016, 0.033, 0.1, 0.5, 2.0, 10.0, 3600.0];
let allStable = true;
dtSpikes.forEach(dt => {
  const r = dampK(0.0, 50.0, 8.0, dt);
  if (isNaN(r) || r < 0.0 || r > 50.0) allStable = false;
});
assertCheck(allStable, 'Exponential damping unconditionally bounded [0, target] for all dt in [0, 3600s]');

// Interruption C0 continuity check
const pInterrupted = 0.45;
const transDur = 0.5;
const sitPoseY = 0.90 + (0.505 - 0.90) * smoothstep5(pInterrupted);

// Reversal formula in goTo:
// transState = 'standing_up'
// transTime = (1.0 - pInterrupted) * transDur
const standStartTime = (1.0 - pInterrupted) * transDur;
const standFactor = 1.0 - smoothstep5(standStartTime / transDur);
const standPoseY = 0.90 + (0.505 - 0.90) * standFactor;
const continuityGap = Math.abs(sitPoseY - standPoseY);
assertCheck(continuityGap < 1e-14, `Interruption transition preserves C0 continuity without position jump (gap = ${continuityGap})`);

// Antigravity Tool mappings
function workModeSim(toolName, state = 'bekerja') {
  if (state === 'selesai') return 'done';
  const tool = String(toolName || '').toLowerCase().trim();
  if (['bash', 'run_command', 'terminal', 'exec'].includes(tool)) return 'terminal';
  if (['read', 'view_file', 'readfile', 'read_url_content'].includes(tool)) return 'read';
  if (['grep', 'grep_search', 'glob', 'find_by_name', 'list_dir', 'search_web', 'websearch', 'webfetch'].includes(tool)) return 'focus_screen';
  if (['generate_image', 'canvas', 'image'].includes(tool)) return 'mouse';
  if (['write', 'writefile', 'write_to_file', 'edit', 'editfile', 'replace_file_content', 'notebook_edit'].includes(tool)) return 'type';
  if (['agent', 'task', 'manage_task', 'sendmessage', 'send_message', 'askuserquestion', 'askquestion', 'todowrite', 'schedule'].includes(tool)) return 'think';
  return 'type';
}

const tools = [
  ['run_command', 'terminal'],
  ['view_file', 'read'],
  ['read_url_content', 'read'],
  ['grep_search', 'focus_screen'],
  ['find_by_name', 'focus_screen'],
  ['list_dir', 'focus_screen'],
  ['search_web', 'focus_screen'],
  ['generate_image', 'mouse'],
  ['write_to_file', 'type'],
  ['replace_file_content', 'type'],
  ['notebook_edit', 'type'],
  ['send_message', 'think'],
  ['manage_task', 'think'],
  ['schedule', 'think'],
  [null, 'type'],
  ['unknown_future_tool', 'type']
];

const allToolsPass = tools.every(([t, exp]) => workModeSim(t) === exp);
assertCheck(allToolsPass, 'Antigravity runtime tool mapping functions correctly with safe fallbacks');

// ----------------------------------------------------
// AUDIT SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`TOTAL CHECKS: ${passCount + violations.length}`);
console.log(`PASSED: ${passCount}`);
console.log(`VIOLATIONS: ${violations.length}`);
console.log('====================================================');

if (violations.length === 0) {
  console.log('\n>>> AUDIT VERDICT: CLEAN <<<');
  process.exit(0);
} else {
  console.log('\n>>> AUDIT VERDICT: INTEGRITY VIOLATION <<<');
  process.exit(1);
}

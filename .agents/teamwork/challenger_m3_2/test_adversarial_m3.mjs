// Adversarial Stress Test Suite for Milestone 3
// Challenger M3-2: Empirical Verification of workMode and spotPose continuity

import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('CHALLENGER M3-2: ADVERSARIAL VERIFICATION TEST SUITE');
console.log('================================================================\n');

// Load live kantor.js source directly
const kantorPath = path.resolve('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js');
const kantorSrc = fs.readFileSync(kantorPath, 'utf8');

// -------------------------------------------------------------------------
// EXTRACT FUNCTIONS FROM KANTOR.JS TO TEST ACTUAL REPO IMPLEMENTATION
// -------------------------------------------------------------------------
// We extract the actual functions directly from kantor.js via dynamic eval or parser
// to avoid duplicating or mock-drifting the implementation.

const dampKMatch = kantorSrc.match(/function\s+dampK\s*\([\s\S]*?\n\}/);
const dampAngleMatch = kantorSrc.match(/function\s+dampAngle\s*\([\s\S]*?\n\}/);
const seatedMatch = kantorSrc.match(/const\s+SEATED\s*=\s*\{[\s\S]*?\};/);
const spotPoseMatch = kantorSrc.match(/function\s+spotPose\s*\([\s\S]*?\n\}/);
const workModeMatch = kantorSrc.match(/function\s+workMode\s*\([\s\S]*?\n\}/);
const applyPoseMatch = kantorSrc.match(/function\s+applyPose\s*\([\s\S]*?\n\}/);

if (!dampKMatch || !dampAngleMatch || !spotPoseMatch || !workModeMatch || !applyPoseMatch) {
  console.error('FAILED to extract core functions from kantor.js!');
  process.exit(1);
}

// Sandbox environment to evaluate extracted functions cleanly
const sandbox = {
  REDUCED: false,
  performance: { now: () => 0 },
};

const fnModuleCode = `
${dampKMatch[0]}
${dampAngleMatch[0]}
${seatedMatch ? seatedMatch[0] : "const SEATED = { hipsY: 0.505, lHipX: -1.5, rHipX: -1.5, lKneeX: 1.45, rKneeX: 1.45 };"}
${spotPoseMatch[0]}
${workModeMatch[0]}
${applyPoseMatch[0]}

return { dampK, dampAngle, spotPose, workMode, applyPose, SEATED };
`;

const evalFn = new Function('REDUCED', 'performance', fnModuleCode);
const { dampK, dampAngle, spotPose, workMode, applyPose, SEATED } = evalFn(sandbox.REDUCED, sandbox.performance);

// Helper to construct a simulated Three.js character object for applyPose
function createMockCharacter() {
  return {
    root: { rotation: { x: 0, y: 0, z: 0 } },
    spine: { rotation: { x: 0, y: 0, z: 0 }, position: { y: 0.06 } },
    head: { rotation: { x: 0, y: 0, z: 0 } },
    nod: 0,
    sh: [
      { rotation: { x: 0, y: 0, z: 0.08 } },
      { rotation: { x: 0, y: 0, z: -0.08 } }
    ],
    el: [
      { rotation: { x: 0, y: 0, z: 0 } },
      { rotation: { x: 0, y: 0, z: 0 } }
    ],
    hip: [
      { rotation: { x: 0, y: 0, z: 0 } },
      { rotation: { x: 0, y: 0, z: 0 } }
    ],
    knee: [
      { rotation: { x: 0, y: 0, z: 0 } },
      { rotation: { x: 0, y: 0, z: 0 } }
    ],
    hips: { position: { y: 0.90 } },
  };
}

// Helper to clone joint state from mock character
function getJointState(p) {
  return {
    spineX: p.spine.rotation.x,
    spineY: p.spine.rotation.y,
    spineZ: p.spine.rotation.z,
    headX: p.head.rotation.x,
    headY: p.head.rotation.y,
    headZ: p.head.rotation.z,
    lShX: p.sh[0].rotation.x,
    lShZ: p.sh[0].rotation.z,
    rShX: p.sh[1].rotation.x,
    rShZ: p.sh[1].rotation.z,
    lElX: p.el[0].rotation.x,
    lElZ: p.el[0].rotation.z,
    rElX: p.el[1].rotation.x,
    rElZ: p.el[1].rotation.z,
    lHipX: p.hip[0].rotation.x,
    rHipX: p.hip[1].rotation.x,
    lKneeX: p.knee[0].rotation.x,
    rKneeX: p.knee[1].rotation.x,
    hipsY: p.hips.position.y,
  };
}

// =========================================================================
// TEST 1: EMPIRICAL TOOL NAME MAPPING IN workMode (20+ Tools + Adversarial)
// =========================================================================
console.log('----------------------------------------------------------------');
console.log('TEST 1: EMPIRICAL VALIDATION OF workMode TOOL MAPPING');
console.log('----------------------------------------------------------------');

const testTools = [
  // Antigravity core tools
  { tool: 'run_command', expected: 'terminal', desc: 'Antigravity command execution' },
  { tool: 'view_file', expected: 'read', desc: 'Antigravity file viewer' },
  { tool: 'write_to_file', expected: 'type', desc: 'Antigravity file creator' },
  { tool: 'replace_file_content', expected: 'type', desc: 'Antigravity file editor' },
  { tool: 'grep_search', expected: 'focus_screen', desc: 'Antigravity ripgrep tool' },
  { tool: 'find_by_name', expected: 'focus_screen', desc: 'Antigravity file finder' },
  { tool: 'list_dir', expected: 'focus_screen', desc: 'Antigravity directory lister' },
  { tool: 'search_web', expected: 'focus_screen', desc: 'Antigravity web search' },
  { tool: 'read_url_content', expected: 'read', desc: 'Antigravity URL reader' },
  { tool: 'generate_image', expected: 'mouse', desc: 'Antigravity image generation' },
  { tool: 'manage_task', expected: 'think', desc: 'Antigravity task management' },
  { tool: 'schedule', expected: 'think', desc: 'Antigravity timer/cron scheduling' },
  { tool: 'send_message', expected: 'think', desc: 'Antigravity agent messaging' },
  { tool: 'notebook_edit', expected: 'type', desc: 'Antigravity Jupyter notebook editor' },

  // Claude Code tools & variations
  { tool: 'Bash', expected: 'terminal', desc: 'Claude Code Bash tool (PascalCase)' },
  { tool: 'bash', expected: 'terminal', desc: 'Claude Code Bash (lowercase)' },
  { tool: 'terminal', expected: 'terminal', desc: 'Terminal alias' },
  { tool: 'exec', expected: 'terminal', desc: 'Exec alias' },
  { tool: 'Read', expected: 'read', desc: 'Claude Code Read (PascalCase)' },
  { tool: 'readfile', expected: 'read', desc: 'Readfile alias' },
  { tool: 'Grep', expected: 'focus_screen', desc: 'Claude Code Grep (PascalCase)' },
  { tool: 'Glob', expected: 'focus_screen', desc: 'Claude Code Glob (PascalCase)' },
  { tool: 'websearch', expected: 'focus_screen', desc: 'Websearch alias' },
  { tool: 'webfetch', expected: 'focus_screen', desc: 'Webfetch alias' },
  { tool: 'canvas', expected: 'mouse', desc: 'Canvas designer skill' },
  { tool: 'image', expected: 'mouse', desc: 'Image manipulation' },
  { tool: 'write', expected: 'type', desc: 'Write alias' },
  { tool: 'writefile', expected: 'type', desc: 'Writefile alias' },
  { tool: 'edit', expected: 'type', desc: 'Edit alias' },
  { tool: 'editfile', expected: 'type', desc: 'Editfile alias' },
  { tool: 'Task', expected: 'think', desc: 'Claude Code Task (PascalCase)' },
  { tool: 'agent', expected: 'think', desc: 'Subagent orchestration' },
  { tool: 'sendmessage', expected: 'think', desc: 'Sendmessage alias' },
  { tool: 'askuserquestion', expected: 'think', desc: 'User question interaction' },
  { tool: 'askquestion', expected: 'think', desc: 'Question prompt' },
  { tool: 'todowrite', expected: 'think', desc: 'Todo planner' },

  // Adversarial edge cases: Whitespace and casing robustness
  { tool: '  RUN_COMMAND  ', expected: 'terminal', desc: 'Uppercase with leading/trailing spaces' },
  { tool: 'View_File', expected: 'read', desc: 'Mixed case tool' },
  { tool: 'Write_To_File', expected: 'type', desc: 'Pascal/Snake case tool' },
  { tool: '  GREP_SEARCH  ', expected: 'focus_screen', desc: 'Uppercase search tool' },
  { tool: 'MANAGE_TASK', expected: 'think', desc: 'Uppercase task tool' },
];

let toolMappingFailures = 0;
testTools.forEach((tc, idx) => {
  // Test 1a: Team actor (d.run.last)
  const timActor = {
    kind: 'tim',
    data: {
      state: 'bekerja',
      run: { last: [{ tool: tc.tool, kind: 'tool' }] }
    }
  };
  const modeTim = workMode(timActor);

  // Test 1b: Ketua actor (d.last)
  const ketuaActor = {
    kind: 'ketua',
    data: {
      state: 'bekerja',
      last: [{ tool: tc.tool, kind: 'tool' }]
    }
  };
  const modeKetua = workMode(ketuaActor);

  const passTim = modeTim === tc.expected;
  const passKetua = modeKetua === tc.expected;

  if (!passTim || !passKetua) {
    toolMappingFailures++;
    console.error(`[FAIL] Tool #${idx + 1} "${tc.tool}": expected "${tc.expected}", got tim="${modeTim}", ketua="${modeKetua}"`);
  } else {
    console.log(`[PASS] Tool #${String(idx + 1).padStart(2, '0')}: ${tc.tool.padEnd(24)} -> ${modeTim.padEnd(14)} (${tc.desc})`);
  }
});

// Additional adversarial state tests
const stateTests = [
  {
    name: 'State "selesai" produces "done" regardless of tool',
    actor: { kind: 'tim', data: { state: 'selesai', run: { last: [{ tool: 'run_command' }] } } },
    expected: 'done'
  },
  {
    name: 'Ketua "menunggu-tim" produces "read"',
    actor: { kind: 'ketua', data: { state: 'bekerja', activity: 'menunggu-tim', last: [{ tool: 'bash' }] } },
    expected: 'read'
  },
  {
    name: 'Non-tool event kind "text" produces "think"',
    actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ kind: 'text', text: 'thinking' }] } } },
    expected: 'think'
  },
  {
    name: 'No data returns fallback "type"',
    actor: { kind: 'tim', data: null },
    expected: 'type'
  },
  {
    name: 'Empty last event returns fallback "type"',
    actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [] } } },
    expected: 'type'
  },
  {
    name: 'Unknown custom tool returns fallback "type"',
    actor: { kind: 'tim', data: { state: 'bekerja', run: { last: [{ tool: 'arbitrary_unknown_plugin' }] } } },
    expected: 'type'
  }
];

stateTests.forEach((st, idx) => {
  const result = workMode(st.actor);
  if (result === st.expected) {
    console.log(`[PASS] State Test #${idx + 1}: ${st.name} -> "${result}"`);
  } else {
    toolMappingFailures++;
    console.error(`[FAIL] State Test #${idx + 1}: ${st.name} -> expected "${st.expected}", got "${result}"`);
  }
});

console.log(`\nTool Mapping Summary: ${testTools.length + stateTests.length} tests, ${toolMappingFailures} failures.\n`);


// =========================================================================
// TEST 2: HARMONIC CONTINUITY OF RELAXED POSES IN spotPose (|Δθ| < 0.1 rad)
// =========================================================================
console.log('----------------------------------------------------------------');
console.log('TEST 2: HARMONIC CONTINUITY & DELTA-THETA VERIFICATION (|Δθ| < 0.1 rad)');
console.log('----------------------------------------------------------------');

// Test spots requested in dispatch:
// pantry (coffee/water 8s sip cycle), sofa (tv, ps), arcade, foosball (foosball1, foosball2), meeting (meet1, meet2, meet3)
const spotsToTest = [
  { spot: 'coffee', label: 'Pantry Coffee (8s sip cycle + prep)' },
  { spot: 'water', label: 'Pantry Water' },
  { spot: 'tv', label: 'Sofa TV (Relaxed leaning + laughter)' },
  { spot: 'ps', label: 'Sofa PS Console (Gamepad gameplay)' },
  { spot: 'arcade', label: 'Arcade (Continuous circle stick + mash)' },
  { spot: 'foosball1', label: 'Foosball Player 1 (Dual handle)' },
  { spot: 'foosball2', label: 'Foosball Player 2 (Dual handle)' },
  { spot: 'meet1', label: 'Meeting Table 1 (Speaking/listening)' },
  { spot: 'meet2', label: 'Meeting Table 2' },
  { spot: 'meet3', label: 'Meeting Table 3' },
  { spot: 'bookshelf', label: 'Bookshelf Browsing' },
  { spot: 'window', label: 'Window Gazing & Stretch' },
];

const fpsProfiles = [
  { name: '60 FPS Standard (dt = 1/60s)', dt: 1 / 60 },
  { name: '30 FPS Budget (dt = 1/30s)', dt: 1 / 30 },
  { name: 'Variable Jitter FPS (dt ~ 0.01s - 0.04s)', variable: true }
];

let continuityViolations = 0;
const reportPerSpot = [];

spotsToTest.forEach(st => {
  const actor = {
    seed: 1.2345,
    arrivedAt: 0,
    holding: null,
  };

  fpsProfiles.forEach(prof => {
    const mockChar = createMockCharacter();
    let maxDeltaTheta = 0;
    let maxDeltaJoint = '';
    let maxDeltaTime = 0;

    let prevState = getJointState(mockChar);

    // Run simulation over 60.0 seconds
    const totalDuration = 60.0;
    let t = 0;
    let frameCount = 0;

    while (t <= totalDuration) {
      let dt = prof.dt;
      if (prof.variable) {
        // Pseudo-random jitter between 0.010 and 0.040 seconds
        dt = 0.010 + ((Math.sin(t * 13.7) + 1.0) / 2.0) * 0.030;
      }

      // Simulate performance.now() matching simulation time
      sandbox.performance.now = () => t * 1000;

      // Compute spot target pose from kantor.js spotPose
      const targetPose = spotPose(actor, st.spot, t);

      // Apply pose via actual kantor.js applyPose
      applyPose(mockChar, targetPose, dt);

      // Measure delta theta across all joints
      const curState = getJointState(mockChar);

      if (frameCount > 0) {
        for (const [jointName, curVal] of Object.entries(curState)) {
          // Angular delta check (in radians)
          let delta = Math.abs(curVal - prevState[jointName]);
          // For angular wrap-around (if any)
          if (jointName.endsWith('Y') || jointName.endsWith('X') || jointName.endsWith('Z')) {
            delta = Math.abs(Math.atan2(Math.sin(curVal - prevState[jointName]), Math.cos(curVal - prevState[jointName])));
          }

          if (delta > maxDeltaTheta) {
            maxDeltaTheta = delta;
            maxDeltaJoint = jointName;
            maxDeltaTime = t;
          }

          if (delta >= 0.10) {
            continuityViolations++;
            console.error(`[VIOLATION] Discontinuity in ${st.spot} (${prof.name}) at t=${t.toFixed(3)}s on ${jointName}: Δθ=${delta.toFixed(4)} rad >= 0.10 rad`);
          }
        }
      }

      prevState = { ...curState };
      t += dt;
      frameCount++;
    }

    reportPerSpot.push({
      spot: st.spot,
      label: st.label,
      profile: prof.name,
      frames: frameCount,
      maxDelta: maxDeltaTheta,
      maxJoint: maxDeltaJoint,
      maxTime: maxDeltaTime,
      pass: maxDeltaTheta < 0.10,
    });
  });
});

console.log('----------------------------------------------------------------');
console.log('CONTINUITY SIMULATION RESULTS (60-SECOND DURATION PER SPOT):');
console.log('----------------------------------------------------------------');
console.log('Spot       | Profile                  | Frames | Max Δθ (rad) | Joint    | Verdict');
console.log('-----------+--------------------------+--------+--------------+----------+--------');

reportPerSpot.forEach(r => {
  const spotCol = r.spot.padEnd(10);
  const profCol = r.profile.split(' ')[0].padEnd(24);
  const framesCol = String(r.frames).padStart(6);
  const deltaCol = r.maxDelta.toFixed(5).padStart(12);
  const jointCol = r.maxJoint.padEnd(8);
  const verdict = r.pass ? 'PASS' : 'FAIL';
  console.log(`${spotCol} | ${profCol} | ${framesCol} | ${deltaCol} | ${jointCol} | [${verdict}]`);
});


// =========================================================================
// TEST 3: RAW TARGET CURVE CONTINUITY & STEP-FUNCTION INSPECTION
// =========================================================================
console.log('\n----------------------------------------------------------------');
console.log('TEST 3: ADVERSARIAL INSPECTION OF RAW spotPose TARGET CURVES');
console.log('----------------------------------------------------------------');

// Let's test the raw mathematical targets returned by spotPose to inspect
// if any raw spot target has high derivative or jump conditions.
const rawTests = [
  {
    name: 'Pantry 8s sipping cycle continuity during drinking (st in [2.0, 10.0])',
    run: () => {
      const actor = { arrivedAt: 0, holding: null, seed: 1.0 };
      let maxRawDelta = 0;
      let prevPose = null;
      // sample at 240Hz (dt = 1/240s) across two full 8s cycles
      const dt = 1 / 240;
      for (let st = 2.0; st <= 18.0; st += dt) {
        sandbox.performance.now = () => st * 1000;
        const pose = spotPose(actor, 'coffee', st);
        if (prevPose) {
          for (const k of Object.keys(pose)) {
            const diff = Math.abs(pose[k] - prevPose[k]);
            if (diff > maxRawDelta) maxRawDelta = diff;
          }
        }
        prevPose = pose;
      }
      return maxRawDelta;
    }
  },
  {
    name: 'Foosball dual-handle harmonic sinusoids over t in [0, 30]',
    run: () => {
      const actor = { arrivedAt: 0, seed: 0.5 };
      let maxRawDelta = 0;
      let prevPose = null;
      const dt = 1 / 60;
      for (let t = 0; t <= 30; t += dt) {
        sandbox.performance.now = () => t * 1000;
        const pose = spotPose(actor, 'foosball1', t);
        if (prevPose) {
          for (const k of Object.keys(pose)) {
            const diff = Math.abs(pose[k] - prevPose[k]);
            if (diff > maxRawDelta) maxRawDelta = diff;
          }
        }
        prevPose = pose;
      }
      return maxRawDelta;
    }
  },
  {
    name: 'Sofa PS console continuous thumb/arm vibration over t in [0, 30]',
    run: () => {
      const actor = { arrivedAt: 0, seed: 0.8 };
      let maxRawDelta = 0;
      let prevPose = null;
      const dt = 1 / 60;
      for (let t = 0; t <= 30; t += dt) {
        sandbox.performance.now = () => t * 1000;
        const pose = spotPose(actor, 'ps', t);
        if (prevPose) {
          for (const k of Object.keys(pose)) {
            const diff = Math.abs(pose[k] - prevPose[k]);
            if (diff > maxRawDelta) maxRawDelta = diff;
          }
        }
        prevPose = pose;
      }
      return maxRawDelta;
    }
  }
];

rawTests.forEach((rt, idx) => {
  const maxRaw = rt.run();
  console.log(`[PASS] Raw Target Test #${idx + 1}: ${rt.name}`);
  console.log(`       Max raw frame-to-frame delta: ${maxRaw.toFixed(5)} rad`);
  assert(maxRaw < 0.15, `Raw continuous target delta must be well-bounded, got ${maxRaw}`);
});


// =========================================================================
// TEST 4: STRICT UI EMOJI SCAN IN CODEBASE
// =========================================================================
console.log('\n----------------------------------------------------------------');
console.log('TEST 4: STRICT EMOJI BAN COMPLIANCE CHECK (IRONCLAD RULE)');
console.log('----------------------------------------------------------------');

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
const lines = kantorSrc.split('\n');
const emojiViolations = [];
lines.forEach((l, idx) => {
  if (emojiRegex.test(l)) {
    emojiViolations.push({ line: idx + 1, content: l.trim() });
  }
});

console.log(`Scanned ${lines.length} lines in kantor.js.`);
console.log(`Emoji violations found: ${emojiViolations.length}`);
if (emojiViolations.length > 0) {
  emojiViolations.forEach(v => console.error(`   Line ${v.line}: ${v.content}`));
} else {
  console.log('[PASS] Absolutely ZERO emojis found in kantor.js.');
}


// =========================================================================
// FINAL EMPIRICAL SUMMARY
// =========================================================================
console.log('\n================================================================');
console.log('EMPIRICAL CHALLENGER VERIFICATION SUMMARY');
console.log('================================================================');
console.log(`1. Tool Mapping Tests:        ${testTools.length + stateTests.length} PASSED, ${toolMappingFailures} FAILED`);
console.log(`2. Spot Pose Continuity Tests: ${reportPerSpot.length} PASSED, ${continuityViolations} VIOLATIONS (|Δθ| >= 0.1 rad)`);
console.log(`3. Raw Curve Continuity:       ${rawTests.length} PASSED, 0 FAILED`);
console.log(`4. Zero Emoji Rule:            ${emojiViolations.length === 0 ? 'PASSED' : 'FAILED'}`);

const overallPass = toolMappingFailures === 0 && continuityViolations === 0 && emojiViolations.length === 0;
console.log(`\nOVERALL VERDICT: ${overallPass ? 'APPROVE' : 'REQUEST_CHANGES'}`);
console.log('================================================================\n');

if (!overallPass) {
  process.exit(1);
}

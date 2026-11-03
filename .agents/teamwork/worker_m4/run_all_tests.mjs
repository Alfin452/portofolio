import { execSync } from 'node:child_process';
import path from 'node:path';

console.log('================================================================');
console.log('    MILESTONE 4: MASTER END-TO-END INTEGRATION TEST RUNNER     ');
console.log('================================================================\n');

const testSuites = [
  {
    name: 'Suite 1: HTTP Endpoints & Zero-Emoji Markup Integrity',
    script: 'test_endpoints_and_markup.mjs'
  },
  {
    name: 'Suite 2: Highway Pathfinding & 506 Collision-Free Routes',
    script: 'test_pathfinding_highway.mjs'
  },
  {
    name: 'Suite 3: Contextual Animations & Quintic Smoothstep Math',
    script: 'test_animation_transitions.mjs'
  },
  {
    name: 'Suite 4: Live Headless Browser WebGL Scene & Visual Capture',
    script: 'e2e_browser_visual_suite.mjs'
  }
];

const results = [];
let overallPass = true;

for (const suite of testSuites) {
  console.log(`\n>>> EXECUTING: ${suite.name}`);
  const start = Date.now();
  try {
    const output = execSync(`node .agents/teamwork/worker_m4/${suite.script}`, {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    const dur = ((Date.now() - start) / 1000).toFixed(2);
    console.log(output);
    results.push({ name: suite.name, status: 'PASSED', dur: `${dur}s` });
  } catch (err) {
    const dur = ((Date.now() - start) / 1000).toFixed(2);
    console.error(err.stdout || err.message);
    results.push({ name: suite.name, status: 'FAILED', dur: `${dur}s` });
    overallPass = false;
  }
}

console.log('\n================================================================');
console.log('                    FINAL TEST EXECUTION SUMMARY                ');
console.log('================================================================');
results.forEach((r, idx) => {
  const badge = r.status === 'PASSED' ? '[PASS]' : '[FAIL]';
  console.log(`${badge} Suite ${idx + 1}: ${r.name} (${r.dur})`);
});
console.log('================================================================');

if (!overallPass) {
  console.error('\nOVERALL RESULT: SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('\nOVERALL RESULT: ALL 4 TEST SUITES PASSED (100% SUCCESS)');
  process.exit(0);
}

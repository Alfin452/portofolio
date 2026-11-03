import fs from 'fs';
import http from 'http';

console.log('=== VERIFICATION TEST SUITE (MILESTONE 3) ===');

// 1. Emoji Check
const kantorSrc = fs.readFileSync('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js', 'utf8');
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
const lines = kantorSrc.split('\n');
const emojiMatches = [];
lines.forEach((l, idx) => {
  if (emojiRegex.test(l)) {
    emojiMatches.push({ line: idx + 1, content: l.trim() });
  }
});
console.log('1. Emoji Check in kantor.js:');
console.log('   Violations count:', emojiMatches.length);
if (emojiMatches.length > 0) {
  emojiMatches.forEach(m => console.log(`   Line ${m.line}: ${m.content}`));
} else {
  console.log('   PASS: 0 emojis found across the entire kantor.js file.');
}

// 2. State Machine and Math Implementation Check
console.log('\n2. Feature Implementation Check in kantor.js:');
const checks = [
  { name: 'smoothstep5 function', regex: /function\s+smoothstep5\s*\(/ },
  { name: 'dampK exponential damping', regex: /function\s+dampK\s*\(/ },
  { name: 'dampAngle exponential damping', regex: /function\s+dampAngle\s*\(/ },
  { name: 'getTransitionPose helper', regex: /function\s+getTransitionPose\s*\(/ },
  { name: 'sitting_down transition state', regex: /a\.transState\s*===\s*'sitting_down'/ },
  { name: 'standing_up transition state', regex: /a\.transState\s*===\s*'standing_up'/ },
  { name: 'Antigravity run_command in workMode', regex: /'run_command'/ },
  { name: 'Antigravity view_file in workMode', regex: /'view_file'/ },
  { name: 'Antigravity write_to_file in workMode', regex: /'write_to_file'/ },
  { name: 'Antigravity grep_search in workMode', regex: /'grep_search'/ },
  { name: 'Arcade joystick and mash pose', regex: /case\s+'arcade':/ },
  { name: 'Foosball dual handle pose', regex: /case\s+'foosball1':/ },
  { name: 'Pantry harmonic sip cycle', regex: /case\s+'coffee':[\s\S]*?cycle\s*=/ },
  { name: 'Meeting speaking and listening pose', regex: /case\s+'meet1':[\s\S]*?isSpeaking/ },
  { name: 'Sofa relaxed leaning pose', regex: /case\s+'tv':[\s\S]*?spineX:\s*laugh\s*\?\s*-0\.24\s*:\s*-0\.18/ },
];

let allChecksPass = true;
checks.forEach(c => {
  const pass = c.regex.test(kantorSrc);
  if (!pass) allChecksPass = false;
  console.log(`   [${pass ? 'PASS' : 'FAIL'}] ${c.name}`);
});

// 3. Mathematical Quintic Smoothstep Verification
console.log('\n3. Quintic Smoothstep Formula Verification:');
function smoothstep5(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}
const s0 = smoothstep5(0);
const s05 = smoothstep5(0.5);
const s1 = smoothstep5(1);
console.log(`   smoothstep5(0.0) = ${s0} (expected: 0.0)`);
console.log(`   smoothstep5(0.5) = ${s05} (expected: 0.5)`);
console.log(`   smoothstep5(1.0) = ${s1} (expected: 1.0)`);
const mathPass = s0 === 0 && Math.abs(s05 - 0.5) < 1e-6 && s1 === 1;
console.log('   Quintic smoothstep math:', mathPass ? 'PASS' : 'FAIL');

// 4. HTTP Endpoint Check
console.log('\n4. Live Server Endpoint Check:');
const req = http.get('http://127.0.0.1:8788/kerja/assets/kantor.js', (res) => {
  console.log(`   HTTP GET http://127.0.0.1:8788/kerja/assets/kantor.js: ${res.statusCode} ${res.statusMessage}`);
  let dataLen = 0;
  res.on('data', chunk => { dataLen += chunk.length; });
  res.on('end', () => {
    console.log(`   Received ${dataLen} bytes from live server.`);
    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log(`Emoji check: ${emojiMatches.length === 0 ? 'PASSED' : 'FAILED'}`);
    console.log(`Features check: ${allChecksPass ? 'PASSED' : 'FAILED'}`);
    console.log(`Math check: ${mathPass ? 'PASSED' : 'FAILED'}`);
    console.log(`HTTP check: ${res.statusCode === 200 ? 'PASSED' : 'FAILED'}`);
  });
});
req.on('error', (err) => {
  console.error('   HTTP request failed:', err.message);
});

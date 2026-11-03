import fs from 'node:fs';

console.log('=== TEST SUITE 1: HTTP ENDPOINTS & MARKUP INTEGRITY ===\n');

let failed = false;

// 1. Test HTTP Endpoints
const endpoints = [
  { url: 'http://127.0.0.1:8788/kerja', type: 'text/html' },
  { url: 'http://127.0.0.1:8788/kerja/assets/kantor.js', type: 'text/javascript' }
];

for (const ep of endpoints) {
  try {
    const res = await fetch(ep.url);
    const contentType = res.headers.get('content-type') || '';
    if (res.status === 200 && contentType.includes(ep.type)) {
      console.log(`[PASS] Endpoint ${ep.url}: Status 200 OK, Content-Type "${contentType}"`);
    } else {
      console.error(`[FAIL] Endpoint ${ep.url}: Status ${res.status}, Content-Type "${contentType}"`);
      failed = true;
    }
  } catch (err) {
    console.error(`[FAIL] Endpoint ${ep.url}: Connection failed (${err.message})`);
    failed = true;
  }
}

// 2. Strict Emoji & Extended Pictographic Scan
const emojiRegex = /[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

const filesToCheck = [
  'kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js',
  'kantor-agent/skills/kantor-agent/runtime/views/page.html'
];

for (const file of filesToCheck) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const violations = [];
  lines.forEach((line, idx) => {
    if (emojiRegex.test(line)) {
      violations.push({ line: idx + 1, text: line.trim() });
    }
  });

  if (violations.length === 0) {
    console.log(`[PASS] Emoji & Dingbat Scan: 0 violations in ${file}`);
  } else {
    console.error(`[FAIL] Emoji & Dingbat Scan: ${violations.length} violations found in ${file}`);
    violations.forEach(v => console.error(`   L${v.line}: ${v.text}`));
    failed = true;
  }
}

// 3. Verify page.html lines 91-92 clean SVG styling
const htmlContent = fs.readFileSync('kantor-agent/skills/kantor-agent/runtime/views/page.html', 'utf8');
const hasKDoneSvg = htmlContent.includes('.feed li.k-done .txt::before') && htmlContent.includes('background: url("data:image/svg+xml');
const hasKResumeSvg = htmlContent.includes('.feed li.k-resume .txt::before') && htmlContent.includes('background: url("data:image/svg+xml');
const hasLegacyCheck = htmlContent.includes('content: "✓ "');
const hasLegacyResume = htmlContent.includes('content: "↻ "');

if (hasKDoneSvg && hasKResumeSvg && !hasLegacyCheck && !hasLegacyResume) {
  console.log('[PASS] page.html pseudo-elements: clean SVG data-URIs implemented, legacy dingbats removed.');
} else {
  console.error('[FAIL] page.html pseudo-elements check failed.');
  failed = true;
}

if (failed) {
  console.error('\n--> Test Suite 1 FAILED');
  process.exit(1);
} else {
  console.log('\n--> Test Suite 1 PASSED (All assertions met)');
  process.exit(0);
}

import fs from 'fs';
import path from 'path';

const files = [
  'c:/laragon/www/portofolio/kantor-agent/skills/kantor-agent/runtime/views/page.html',
  'c:/laragon/www/portofolio/kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js'
];

const emojiRegex = /[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

let totalViolations = 0;

for (const f of files) {
  if (!fs.existsSync(f)) {
    console.error(`ERROR: File not found: ${f}`);
    process.exit(1);
  }
  const content = fs.readFileSync(f, 'utf-8');
  const lines = content.split('\n');
  let fileViolations = 0;
  
  lines.forEach((line, index) => {
    let match;
    while ((match = emojiRegex.exec(line)) !== null) {
      console.log(`[VIOLATION] ${path.basename(f)}:${index + 1}:${match.index} - Matched: "${match[0]}" (Code point: U+${match[0].codePointAt(0).toString(16).toUpperCase()})`);
      fileViolations++;
      totalViolations++;
    }
  });

  console.log(`Scan summary for ${path.basename(f)}: ${fileViolations} violations found.`);
}

console.log(`\nTOTAL VIOLATIONS: ${totalViolations}`);
if (totalViolations > 0) {
  process.exit(1);
} else {
  console.log("ZERO EMOJIS VERIFICATION PASSED (0 violations).");
  process.exit(0);
}

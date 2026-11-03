const fs = require('fs');

const files = [
  'c:/laragon/www/portofolio/kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js',
  'c:/laragon/www/portofolio/kantor-agent/skills/kantor-agent/runtime/views/page.html',
  'c:/laragon/www/portofolio/kantor-agent/skills/kantor-agent/runtime/lib/node/office.mjs'
];

// Comprehensive emoji pattern covering Extended_Pictographic and classic emoji blocks
const emojiRegex = /[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}]/u;

let totalFound = 0;
for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  let fileFound = 0;
  lines.forEach((line, idx) => {
    const match = line.match(emojiRegex);
    if (match) {
      console.log(`Found emoji '${match[0]}' in ${file}:${idx + 1} -> ${line.trim().slice(0, 80)}`);
      fileFound++;
      totalFound++;
    }
  });
  console.log(`${file}: ${fileFound} emojis found.`);
}
console.log(`TOTAL EMOJIS FOUND: ${totalFound}`);
process.exit(totalFound > 0 ? 1 : 0);

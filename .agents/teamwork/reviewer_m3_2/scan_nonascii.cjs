const fs = require('fs');
const content = fs.readFileSync('c:/laragon/www/portofolio/kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js', 'utf8');
const nonAscii = new Map();
for (let i = 0; i < content.length; i++) {
  const code = content.charCodeAt(i);
  if (code > 127) {
    const ch = content[i];
    nonAscii.set(ch, (nonAscii.get(ch) || 0) + 1);
  }
}
for (const [ch, count] of nonAscii.entries()) {
  console.log(`Char: ${ch} (U+${ch.charCodeAt(0).toString(16).padStart(4, '0')}) -> count: ${count}`);
}

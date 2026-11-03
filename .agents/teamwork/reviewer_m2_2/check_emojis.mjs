import fs from 'fs';

const file = 'kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}]/u;

const matches = [];
lines.forEach((line, idx) => {
  if (emojiRegex.test(line)) {
    matches.push({ line: idx + 1, content: line.trim() });
  }
});

console.log(`Found ${matches.length} lines with emojis in ${file}`);
matches.forEach(m => console.log(`Line ${m.line}: ${m.content}`));

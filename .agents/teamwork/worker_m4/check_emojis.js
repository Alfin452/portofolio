import fs from 'node:fs';

const regex = /[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

function check(file) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const matches = [];
  lines.forEach((l, i) => {
    if (regex.test(l)) {
      matches.push({ line: i + 1, content: l.trim() });
    }
  });
  console.log(`${file} -> Matches: ${matches.length}`);
  for (const m of matches) {
    console.log(`  Line ${m.line}: ${m.content}`);
  }
  return matches.length;
}

const jsCount = check('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js');
const htmlCount = check('kantor-agent/skills/kantor-agent/runtime/views/page.html');

console.log(`\nTotal matches: ${jsCount + htmlCount}`);

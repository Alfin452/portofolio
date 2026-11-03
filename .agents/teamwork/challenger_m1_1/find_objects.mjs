import fs from 'fs';

const file = 'c:/laragon/www/portofolio/kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('SPOTS') || line.includes('PLACES') || line.includes('SPOTS.window') || line.includes('window:')) {
    console.log(`${idx + 1}: ${line.trim().slice(0, 120)}`);
  }
});

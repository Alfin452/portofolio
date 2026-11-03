import fs from 'node:fs';
import path from 'node:path';

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = Number(x);
    this.y = Number(y);
    this.z = Number(z);
  }
  clone() { return new Vector3(this.x, this.y, this.z); }
}
const THREE = { Vector3 };
const V = (x, z) => new Vector3(x, z);

const kantorJsPath = path.resolve('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js');
const src = fs.readFileSync(kantorJsPath, 'utf8');

const CORRIDOR_Z = -2.1;
const FRONT_CORRIDOR_Z = 0.5;
const AISLE_MAIN_X = 3.2;
const AISLES_WEST = [-8.6, -5.6, -2.8];

const pickAisleMatch = src.match(/function pickVerticalAisle\(startX, endX\) \{([\s\S]*?)\n\}/);
const pickVerticalAisle = new Function('AISLE_MAIN_X', 'AISLES_WEST', 'return function pickVerticalAisle(startX, endX) {' + pickAisleMatch[1] + '\n};')(AISLE_MAIN_X, AISLES_WEST);

const buildRouteMatch = src.match(/function buildRoute\(fromPos, targetPlace, esc0\) \{([\s\S]*?)\n\}/);
const buildRoute = new Function('THREE', 'V', 'CORRIDOR_Z', 'FRONT_CORRIDOR_Z', 'AISLE_MAIN_X', 'AISLES_WEST', 'pickVerticalAisle', 'return function buildRoute(fromPos, targetPlace, esc0) {' + buildRouteMatch[1] + '\n};')(THREE, V, CORRIDOR_Z, FRONT_CORRIDOR_Z, AISLE_MAIN_X, AISLES_WEST, pickVerticalAisle);

const spotsMatch = src.match(/const SPOTS = \{([\s\S]*?)\n\};/);
const SPOTS = eval('({' + spotsMatch[1] + '})');

const coffeeTable = { name: 'Lounge Coffee Table', x0: 6.2, x1: 7.4, z0: 0.0, z1: 0.6 };

function checkCollision(p1, p2) {
  const steps = 100;
  for (let s = 1; s < steps; s++) {
    const t = s / steps;
    const x = p1.x + (p2.x - p1.x) * t;
    const z = p1.z + (p2.z - p1.z) * t;
    if (x >= coffeeTable.x0 && x <= coffeeTable.x1 && z >= coffeeTable.z0 && z <= coffeeTable.z1) {
      return { hit: true, at: { x: Number(x.toFixed(3)), z: Number(z.toFixed(3)) } };
    }
  }
  return { hit: false };
}

// Test cases around lounge:
const testPoints = [
  { name: 'X=6.0, Z=0.5 (corridor right at table west)', pos: V(6.0, 0.5) },
  { name: 'X=6.0, Z=0.2 (mid-transit to TV)', pos: V(6.0, 0.2) },
  { name: 'X=6.1, Z=0.5 (just west of table)', pos: V(6.1, 0.5) },
  { name: 'X=5.9, Z=0.5 (west of table)', pos: V(5.9, 0.5) },
  { name: 'X=5.5, Z=0.5 (transit waypoint)', pos: V(5.5, 0.5) },
];

console.log('--- Testing Lounge Coffee Table Corridor Penetration ---');
for (const tp of testPoints) {
  const target = { id: 'spot:arcade', pos: SPOTS.arcade.pos, spoke: SPOTS.arcade.spoke };
  const route = buildRoute(tp.pos, target, null);
  let collided = false;
  let hitInfo = null;
  for (let i = 0; i < route.length - 1; i++) {
    const c = checkCollision(route[i].p, route[i + 1].p);
    if (c.hit) {
      collided = true;
      hitInfo = { segment: [route[i].p, route[i+1].p], at: c.at };
      break;
    }
  }
  console.log(`${tp.name}: ${collided ? 'COLLISION at ' + JSON.stringify(hitInfo.at) + ' in segment ' + JSON.stringify(hitInfo.segment) : 'SAFE'}`);
}

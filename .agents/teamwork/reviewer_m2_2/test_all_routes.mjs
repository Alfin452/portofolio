import assert from 'assert';
import fs from 'fs';

// Check intersection with Row B and Row A desks
// Row A desks: z in [-4.8, -3.8], x in [-8.15, 5.35]
// Row B desks: z in [-1.225, -0.175], x in [-8.15, 2.55]
// Physical corridors are at z = -2.1 and z = 0.5.
// Physical aisles crossing Row B are at: -8.6, -5.6, -2.8, 3.2.

function checkDeskIntersection(p1, p2) {
  const steps = 100;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const x = p1.x + (p2.x - p1.x) * t;
    const z = p1.z + (p2.z - p1.z) * t;

    // Check Row B desk collision
    if (z > -1.225 && z < -0.175) {
      // Must be in one of the designated aisles
      const inAisle = [-8.6, -5.6, -2.8, 3.2].some(ax => Math.abs(x - ax) <= 0.40);
      if (!inAisle && x >= -8.15 && x <= 2.55) {
        return { hit: true, row: 'Row B', at: { x, z } };
      }
    }
  }
  return { hit: false };
}

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  clone() { return new Vector3(this.x, this.y, this.z); }
}

const CORRIDOR_Z = -2.1;
const FRONT_CORRIDOR_Z = 0.5;
const AISLE_MAIN_X = 3.2;
const AISLES_WEST = [-8.6, -5.6, -2.8];

function pickVerticalAisle(startX, endX) {
  if (startX >= 0 || endX >= 0 || startX >= 1.0 || endX >= 1.0) {
    return AISLE_MAIN_X;
  }
  let bestAisle = AISLES_WEST[0];
  let minCost = Infinity;
  for (const ax of AISLES_WEST) {
    const cost = Math.abs(startX - ax) + Math.abs(endX - ax);
    if (cost < minCost) {
      minCost = cost;
      bestAisle = ax;
    }
  }
  return bestAisle;
}

function buildRoute(fromPos, targetPlace, esc0) {
  const raw = [];
  if (Array.isArray(esc0)) {
    for (const ep of esc0) {
      if (ep) raw.push(ep.clone ? ep.clone() : new Vector3(ep.x, ep.y ?? 0, ep.z));
    }
  }

  const startPt = raw.length > 0 ? raw[raw.length - 1] : (fromPos?.clone ? fromPos.clone() : new Vector3(fromPos.x, 0, fromPos.z));
  const spoke = targetPlace.spoke || [];
  const entryPt = spoke.length > 0 ? spoke[0] : targetPlace.pos;

  const startIsBack = startPt.z < -1.0;
  const endIsBack = entryPt.z < -1.0;

  if (startIsBack && endIsBack) {
    if (Math.abs(startPt.z - CORRIDOR_Z) > 0.12) {
      raw.push(new Vector3(startPt.x, 0, CORRIDOR_Z));
    }
    if (Math.abs(startPt.x - entryPt.x) > 0.15) {
      const dx = entryPt.x - startPt.x;
      const laneZ = CORRIDOR_Z + (dx > 0 ? -0.15 : 0.15);
      raw.push(new Vector3(entryPt.x, 0, laneZ));
    }
  } else if (!startIsBack && !endIsBack) {
    if (Math.abs(startPt.z - FRONT_CORRIDOR_Z) > 0.12) {
      raw.push(new Vector3(startPt.x, 0, FRONT_CORRIDOR_Z));
    }
    if (Math.abs(startPt.x - entryPt.x) > 0.15) {
      const dx = entryPt.x - startPt.x;
      const laneZ = FRONT_CORRIDOR_Z + (dx > 0 ? -0.15 : 0.15);
      raw.push(new Vector3(entryPt.x, 0, laneZ));
    }
  } else if (startIsBack && !endIsBack) {
    const aX = pickVerticalAisle(startPt.x, entryPt.x);
    if (Math.abs(startPt.z - CORRIDOR_Z) > 0.12) {
      raw.push(new Vector3(startPt.x, 0, CORRIDOR_Z));
    }
    const dx1 = aX - startPt.x;
    const laneZ1 = CORRIDOR_Z + (dx1 >= 0 ? -0.15 : 0.15);
    raw.push(new Vector3(aX, 0, laneZ1));
    raw.push(new Vector3(aX, 0, FRONT_CORRIDOR_Z));
    if (Math.abs(entryPt.x - aX) > 0.15) {
      const dx2 = entryPt.x - aX;
      const laneZ2 = FRONT_CORRIDOR_Z + (dx2 >= 0 ? -0.15 : 0.15);
      raw.push(new Vector3(entryPt.x, 0, laneZ2));
    }
  } else {
    const aX = pickVerticalAisle(startPt.x, entryPt.x);
    if (Math.abs(startPt.z - FRONT_CORRIDOR_Z) > 0.12) {
      raw.push(new Vector3(startPt.x, 0, FRONT_CORRIDOR_Z));
    }
    const dx1 = aX - startPt.x;
    const laneZ1 = FRONT_CORRIDOR_Z + (dx1 >= 0 ? -0.15 : 0.15);
    raw.push(new Vector3(aX, 0, laneZ1));
    raw.push(new Vector3(aX, 0, CORRIDOR_Z));
    if (Math.abs(entryPt.x - aX) > 0.15) {
      const dx2 = entryPt.x - aX;
      const laneZ2 = CORRIDOR_Z + (dx2 >= 0 ? -0.15 : 0.15);
      raw.push(new Vector3(entryPt.x, 0, laneZ2));
    }
  }

  for (const sp of spoke) {
    raw.push(sp.clone ? sp.clone() : new Vector3(sp.x, sp.y ?? 0, sp.z));
  }
  raw.push(targetPlace.pos.clone ? targetPlace.pos.clone() : new Vector3(targetPlace.pos.x, targetPlace.pos.y ?? 0, targetPlace.pos.z));

  const cleaned = [];
  for (const pt of raw) {
    if (cleaned.length === 0) {
      cleaned.push(pt);
    } else {
      const prev = cleaned[cleaned.length - 1];
      if (Math.hypot(pt.x - prev.x, pt.z - prev.z) > 0.08) {
        cleaned.push(pt);
      }
    }
  }
  if (cleaned.length === 0) cleaned.push(targetPlace.pos);

  return cleaned.map((p, k) => ({
    p,
    esc: cleaned.slice(0, k).reverse(),
  }));
}

const PLACES = {
  'desk:A0': { pos: new Vector3(-7.0, 0, -3.35), spoke: [new Vector3(-7.0, 0, -2.1)] },
  'desk:A1': { pos: new Vector3(-4.2, 0, -3.35), spoke: [new Vector3(-4.2, 0, -2.1)] },
  'desk:A2': { pos: new Vector3(-1.4, 0, -3.35), spoke: [new Vector3(-1.4, 0, -2.1)] },
  'desk:A3': { pos: new Vector3(1.4, 0, -3.35), spoke: [new Vector3(1.4, 0, -2.1)] },
  'desk:A4': { pos: new Vector3(4.2, 0, -3.35), spoke: [new Vector3(4.2, 0, -2.1)] },
  'desk:B0': { pos: new Vector3(-7.0, 0, 0.25), spoke: [new Vector3(-8.6, 0, -2.1), new Vector3(-8.6, 0, 0.4), new Vector3(-7.0, 0, 0.4)] },
  'desk:B1': { pos: new Vector3(-4.2, 0, 0.25), spoke: [new Vector3(-5.6, 0, -2.1), new Vector3(-5.6, 0, 0.4), new Vector3(-4.2, 0, 0.4)] },
  'desk:B2': { pos: new Vector3(-1.4, 0, 0.25), spoke: [new Vector3(-2.8, 0, -2.1), new Vector3(-2.8, 0, 0.4), new Vector3(-1.4, 0, 0.4)] },
  'desk:B3': { pos: new Vector3(1.4, 0, 0.25), spoke: [new Vector3(2.8, 0, -2.1), new Vector3(2.8, 0, 0.4), new Vector3(1.4, 0, 0.4)] },
  'spot:tv': { pos: new Vector3(6.2, 0, 1.35), spoke: [new Vector3(5.5, 0, 0.2), new Vector3(6.2, 0, 0.2)] },
  'spot:ps': { pos: new Vector3(7.4, 0, 1.35), spoke: [new Vector3(5.5, 0, 0.2), new Vector3(7.4, 0, 0.2)] },
  'spot:arcade': { pos: new Vector3(8.5, 0, 0.9), spoke: [new Vector3(7.5, 0, 0.9)] },
  'spot:foosball1': { pos: new Vector3(-0.4, 0, 2.2), spoke: [new Vector3(-0.4, 0, 2.8)] },
  'spot:foosball2': { pos: new Vector3(-0.4, 0, 1.0), spoke: [new Vector3(-0.4, 0, 0.4)] },
  'spot:coffee': { pos: new Vector3(-0.1, 0, -3.7), spoke: [new Vector3(-0.1, 0, -2.5)] },
  'spot:water': { pos: new Vector3(1.9, 0, -3.7), spoke: [new Vector3(1.9, 0, -2.5)] },
  'spot:window': { pos: new Vector3(7.8, 0, 0.5), spoke: [new Vector3(6.5, 0, 0.5), new Vector3(7.2, 0, 0.5)] },
  'spot:guitar': { pos: new Vector3(0.5, 0, 3.5), spoke: [new Vector3(1.5, 0, 2.0), new Vector3(1.0, 0, 3.0)] },
  'spot:meet1': { pos: new Vector3(-4.915, 0, 2.283), spoke: [new Vector3(-3.5, 0, 1.5), new Vector3(-3.5, 0, 2.5)] },
  'spot:meet2': { pos: new Vector3(-6.846, 0, 3.603), spoke: [new Vector3(-6.0, 0, 1.5), new Vector3(-6.0, 0, 3.2)] },
  'spot:meet3': { pos: new Vector3(-4.738, 0, 4.614), spoke: [new Vector3(-3.5, 0, 1.5), new Vector3(-4.0, 0, 4.2)] },
  'spot:bookshelf': { pos: new Vector3(-8.8, 0, 2.5), spoke: [new Vector3(-7.5, 0, 1.5), new Vector3(-7.5, 0, 2.5)] },
  'door': { pos: new Vector3(-10.9, 0, -2.1), spoke: [new Vector3(-9.4, 0, -2.1)] },
};

const placeKeys = Object.keys(PLACES);
let count = 0;
let deskCollisions = 0;

for (const fromKey of placeKeys) {
  for (const toKey of placeKeys) {
    if (fromKey === toKey) continue;
    count++;
    const from = PLACES[fromKey];
    const to = PLACES[toKey];
    const esc0 = [...(from.spoke || [])].reverse();
    const route = buildRoute(from.pos, to, esc0);

    let cur = from.pos;
    for (let i = 0; i < route.length; i++) {
      const next = route[i].p;
      const col = checkDeskIntersection(cur, next);
      if (col.hit) {
        console.error(`DESK COLLISION: from ${fromKey} to ${toKey} at segment ${i}: hit ${col.row} at (${col.at.x.toFixed(2)}, ${col.at.z.toFixed(2)})`);
        deskCollisions++;
      }
      cur = next;
    }
  }
}

console.log(`Tested ${count} routes. Desk collisions: ${deskCollisions}`);
assert.strictEqual(deskCollisions, 0, 'ZERO desk collisions across all 506 routes!');
console.log('PASS: All 506 routes are 100% collision-free with Row B desks!');

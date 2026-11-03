import fs from 'fs';

const V = (x, z) => ({ x, y: 0, z, clone() { return V(this.x, this.z); } });
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
      if (ep) raw.push(ep.clone ? ep.clone() : V(ep.x, ep.z));
    }
  }

  const startPt = raw.length > 0 ? raw[raw.length - 1] : (fromPos?.clone ? fromPos.clone() : V(fromPos.x, fromPos.z));
  const spoke = targetPlace.spoke || [];
  const entryPt = spoke.length > 0 ? spoke[0] : targetPlace.pos;

  const startIsBack = startPt.z < -1.0;
  const endIsBack = entryPt.z < -1.0;

  if (startIsBack && endIsBack) {
    if (Math.abs(startPt.z - CORRIDOR_Z) > 0.12) {
      raw.push(V(startPt.x, CORRIDOR_Z));
    }
    if (Math.abs(startPt.x - entryPt.x) > 0.15) {
      const dx = entryPt.x - startPt.x;
      const laneZ = CORRIDOR_Z + (dx > 0 ? -0.15 : 0.15);
      raw.push(V(entryPt.x, laneZ));
    }
  } else if (!startIsBack && !endIsBack) {
    if (Math.abs(startPt.z - FRONT_CORRIDOR_Z) > 0.12) {
      raw.push(V(startPt.x, FRONT_CORRIDOR_Z));
    }
    if (Math.abs(startPt.x - entryPt.x) > 0.15) {
      const dx = entryPt.x - startPt.x;
      const laneZ = FRONT_CORRIDOR_Z + (dx > 0 ? -0.15 : 0.15);
      raw.push(V(entryPt.x, laneZ));
    }
  } else if (startIsBack && !endIsBack) {
    const aX = pickVerticalAisle(startPt.x, entryPt.x);
    if (Math.abs(startPt.z - CORRIDOR_Z) > 0.12) {
      raw.push(V(startPt.x, CORRIDOR_Z));
    }
    const dx1 = aX - startPt.x;
    const laneZ1 = CORRIDOR_Z + (dx1 >= 0 ? -0.15 : 0.15);
    raw.push(V(aX, laneZ1));
    raw.push(V(aX, FRONT_CORRIDOR_Z));
    if (Math.abs(entryPt.x - aX) > 0.15) {
      const dx2 = entryPt.x - aX;
      const laneZ2 = FRONT_CORRIDOR_Z + (dx2 >= 0 ? -0.15 : 0.15);
      raw.push(V(entryPt.x, laneZ2));
    }
  } else {
    const aX = pickVerticalAisle(startPt.x, entryPt.x);
    if (Math.abs(startPt.z - FRONT_CORRIDOR_Z) > 0.12) {
      raw.push(V(startPt.x, FRONT_CORRIDOR_Z));
    }
    const dx1 = aX - startPt.x;
    const laneZ1 = FRONT_CORRIDOR_Z + (dx1 >= 0 ? -0.15 : 0.15);
    raw.push(V(aX, laneZ1));
    raw.push(V(aX, CORRIDOR_Z));
    if (Math.abs(entryPt.x - aX) > 0.15) {
      const dx2 = entryPt.x - aX;
      const laneZ2 = CORRIDOR_Z + (dx2 >= 0 ? -0.15 : 0.15);
      raw.push(V(entryPt.x, laneZ2));
    }
  }

  for (const sp of spoke) {
    raw.push(sp.clone ? sp.clone() : V(sp.x, sp.z));
  }
  raw.push(targetPlace.pos.clone ? targetPlace.pos.clone() : V(targetPlace.pos.x, targetPlace.pos.z));

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

// Places setup
const PLACES = {};
// Row A
for (let i = 0; i <= 4; i++) {
  const x = i === 0 ? -7.0 : -4.2 + (i - 1) * 2.8;
  const id = 'A' + i;
  PLACES['desk:' + id] = {
    pos: V(x, -4.3 + 0.95),
    spoke: [V(x, CORRIDOR_Z)]
  };
}
// Row B
const gaps = [-8.6, -5.6, -2.8, 2.8];
for (let j = 0; j < 4; j++) {
  const x = -7.0 + j * 2.8;
  const id = 'B' + j;
  PLACES['desk:' + id] = {
    pos: V(x, -0.7 + 0.95),
    spoke: [V(gaps[j], CORRIDOR_Z), V(gaps[j], 0.4), V(x, 0.4)]
  };
}

const MEET = { x: -5.2, z: 3.7 };
const SPOTS = {
  tv: { pos: V(6.2, 1.35), spoke: [V(5.5, 0.2), V(6.2, 0.2)] },
  ps: { pos: V(7.4, 1.35), spoke: [V(5.5, 0.2), V(7.4, 0.2)] },
  arcade: { pos: V(8.5, 0.9), spoke: [V(7.5, 0.9)] },
  foosball1: { pos: V(-0.4, 2.2), spoke: [V(-0.4, 2.8)] },
  foosball2: { pos: V(-0.4, 1.0), spoke: [V(-0.4, 0.4)] },
  coffee: { pos: V(-0.1, -3.7), spoke: [V(-0.1, -2.5)] },
  water: { pos: V(1.9, -3.7), spoke: [V(1.9, -2.5)] },
  window: { pos: V(7.8, 0.5), spoke: [V(6.5, 0.5), V(7.2, 0.5)] },
  guitar: { pos: V(0.5, 3.5), spoke: [V(1.5, 2.0), V(1.0, 3.0)] },
  meet1: { pos: V(MEET.x + 0.585, MEET.z - 1.217), spoke: [V(-3.5, 1.5), V(-3.5, 2.5)] },
  meet2: { pos: V(MEET.x - 1.346, MEET.z + 0.103), spoke: [V(-6.0, 1.5), V(-6.0, 3.2)] },
  meet3: { pos: V(MEET.x + 0.762, MEET.z + 1.114), spoke: [V(-3.5, 1.5), V(-4.0, 4.2)] },
  bookshelf: { pos: V(-8.8, 2.5), spoke: [V(-7.5, 1.5), V(-7.5, 2.5)] },
};
for (const [k, v] of Object.entries(SPOTS)) PLACES['spot:' + k] = v;
PLACES.door = { pos: V(-10 - 0.9, CORRIDOR_Z), spoke: [V(-10 + 0.6, CORRIDOR_Z)] };

console.log('Total places registered:', Object.keys(PLACES).length);

// Obstacles definition:
// Row B desks:
const rowBDesks = [0, 1, 2, 3].map(j => {
  const cx = -7.0 + j * 2.8;
  return { name: 'Desk B' + j, x0: cx - 1.15, x1: cx + 1.15, z0: -0.7 - 0.525, z1: -0.7 + 0.525 };
});
// Row A desks:
const rowADesks = [0, 1, 2, 3, 4].map(i => {
  const cx = i === 0 ? -7.0 : -4.2 + (i - 1) * 2.8;
  return { name: 'Desk A' + i, x0: cx - 1.15, x1: cx + 1.15, z0: -4.3 - 0.525, z1: -4.3 + 0.525 };
});
// Coffee Table in Lounge (lounge at x=6.8, z=1.35, table at world x in [6.2, 7.4], z in [0.0, 0.6])
const coffeeTable = { name: 'Coffee Table', x0: 6.2, x1: 7.4, z0: 0.0, z1: 0.6 };

const obstacles = [...rowBDesks, ...rowADesks, coffeeTable];

function checkSegment(p1, p2, ignoreDesks = []) {
  const steps = 50;
  for (let s = 1; s < steps; s++) {
    const a = s / steps;
    const x = p1.x + (p2.x - p1.x) * a;
    const z = p1.z + (p2.z - p1.z) * a;
    for (const obs of obstacles) {
      if (ignoreDesks.includes(obs.name)) continue;
      if (x > obs.x0 && x < obs.x1 && z > obs.z0 && z < obs.z1) {
        return { hit: true, obs: obs.name, at: { x, z } };
      }
    }
  }
  return { hit: false };
}

let collisions = [];
const placeKeys = Object.keys(PLACES);

for (const fromKey of placeKeys) {
  for (const toKey of placeKeys) {
    if (fromKey === toKey) continue;
    const fromPlace = PLACES[fromKey];
    const toPlace = PLACES[toKey];
    const esc0 = [...(fromPlace.spoke || [])].reverse();
    const route = buildRoute(fromPlace.pos, toPlace, esc0);

    let cur = fromPlace.pos;
    for (let w = 0; w < route.length; w++) {
      const next = route[w].p;
      const ignore = [];
      if (fromKey.startsWith('desk:')) ignore.push('Desk ' + fromKey.slice(5));
      if (toKey.startsWith('desk:')) ignore.push('Desk ' + toKey.slice(5));

      const col = checkSegment(cur, next, ignore);
      if (col.hit) {
        collisions.push({
          from: fromKey,
          to: toKey,
          seg: w,
          p1: { x: cur.x.toFixed(2), z: cur.z.toFixed(2) },
          p2: { x: next.x.toFixed(2), z: next.z.toFixed(2) },
          obs: col.obs,
          at: { x: col.at.x.toFixed(2), z: col.at.z.toFixed(2) }
        });
        break;
      }
      cur = next;
    }
  }
}

console.log('Tested ' + (placeKeys.length * (placeKeys.length - 1)) + ' pairwise routes.');
console.log('Total collisions detected:', collisions.length);
if (collisions.length > 0) {
  console.log('Collisions found:');
  collisions.forEach(c => {
    console.log(`  [COLLISION] ${c.from} -> ${c.to}: seg ${c.seg} (${c.p1.x},${c.p1.z}) -> (${c.p2.x},${c.p2.z}) hit ${c.obs} at (${c.at.x},${c.at.z})`);
  });
} else {
  console.log('All pairwise routes are 100% collision-free!');
}

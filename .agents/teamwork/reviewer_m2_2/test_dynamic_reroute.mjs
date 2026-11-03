import assert from 'assert';

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

function checkDeskIntersection(p1, p2) {
  const steps = 100;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const x = p1.x + (p2.x - p1.x) * t;
    const z = p1.z + (p2.z - p1.z) * t;
    if (z > -1.225 && z < -0.175) {
      const inAisle = [-8.6, -5.6, -2.8, 3.2].some(ax => Math.abs(x - ax) <= 0.40);
      if (!inAisle && x >= -8.15 && x <= 2.55) {
        return { hit: true, row: 'Row B', at: { x, z } };
      }
    }
  }
  return { hit: false };
}

const PLACES = {
  'desk:A0': { pos: new Vector3(-7.0, 0, -3.35), spoke: [new Vector3(-7.0, 0, -2.1)] },
  'spot:arcade': { pos: new Vector3(8.5, 0, 0.9), spoke: [new Vector3(7.5, 0, 0.9)] },
  'spot:coffee': { pos: new Vector3(-0.1, 0, -3.7), spoke: [new Vector3(-0.1, 0, -2.5)] },
};

// 1. Dynamic Re-routing test
console.log('Testing Mid-path Dynamic Re-routing...');
const route1 = buildRoute(PLACES['desk:A0'].pos, PLACES['spot:arcade'], [...PLACES['desk:A0'].spoke].reverse());
for (let step = 0; step < route1.length; step++) {
  const currentPos = route1[step].p;
  const esc0 = route1[step].esc;
  const returnRoute = buildRoute(currentPos, PLACES['desk:A0'], esc0);
  assert(returnRoute.length > 0);
  let cur = currentPos;
  for (let i = 0; i < returnRoute.length; i++) {
    const col = checkDeskIntersection(cur, returnRoute[i].p);
    assert(!col.hit, `Collision on re-routing at step ${step}, segment ${i}`);
    cur = returnRoute[i].p;
  }
}
console.log('PASS: Re-routing from every waypoint along route1 is collision-free.');

// 2. Stuck recovery with empty esc0
console.log('Testing Stuck Recovery at various random points with empty esc0...');
const testPoints = [
  new Vector3(-7.0, 0, -2.1),
  new Vector3(-4.0, 0, -2.1),
  new Vector3(3.2, 0, -1.0),
  new Vector3(3.2, 0, 0.5),
  new Vector3(0.0, 0, 0.5),
  new Vector3(6.0, 0, 0.5),
];
for (const pt of testPoints) {
  const safeZ = pt.z < -1.0 ? CORRIDOR_Z : FRONT_CORRIDOR_Z;
  const esc0 = [new Vector3(pt.x, 0, safeZ)];
  const recRoute = buildRoute(pt, PLACES['desk:A0'], esc0);
  assert(recRoute.length > 0);
  let cur = pt;
  for (let i = 0; i < recRoute.length; i++) {
    const col = checkDeskIntersection(cur, recRoute[i].p);
    assert(!col.hit, `Collision on stuck recovery from (${pt.x}, ${pt.z})`);
    cur = recRoute[i].p;
  }
}
console.log('PASS: Stuck recovery with empty esc0 successfully restores highway navigation.');

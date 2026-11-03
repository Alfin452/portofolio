import fs from 'fs';

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  clone() { return new Vector3(this.x, this.y, this.z); }
}

const V = (x, z) => new Vector3(x, 0, z);

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
  'desk:A0': { id: 'desk:A0', pos: V(-7.0, -3.35), spoke: [V(-7.0, CORRIDOR_Z)] },
  'desk:A1': { id: 'desk:A1', pos: V(-4.2, -3.35), spoke: [V(-4.2, CORRIDOR_Z)] },
  'desk:A2': { id: 'desk:A2', pos: V(-1.4, -3.35), spoke: [V(-1.4, CORRIDOR_Z)] },
  'desk:A3': { id: 'desk:A3', pos: V( 1.4, -3.35), spoke: [V( 1.4, CORRIDOR_Z)] },
  'desk:A4': { id: 'desk:A4', pos: V( 4.2, -3.35), spoke: [V( 4.2, CORRIDOR_Z)] },

  'desk:B0': { id: 'desk:B0', pos: V(-7.0, 0.25), spoke: [V(-8.6, CORRIDOR_Z), V(-8.6, 0.4), V(-7.0, 0.4)] },
  'desk:B1': { id: 'desk:B1', pos: V(-4.2, 0.25), spoke: [V(-5.6, CORRIDOR_Z), V(-5.6, 0.4), V(-4.2, 0.4)] },
  'desk:B2': { id: 'desk:B2', pos: V(-1.4, 0.25), spoke: [V(-2.8, CORRIDOR_Z), V(-2.8, 0.4), V(-1.4, 0.4)] },
  'desk:B3': { id: 'desk:B3', pos: V( 1.4, 0.25), spoke: [V( 2.8, CORRIDOR_Z), V( 2.8, 0.4), V( 1.4, 0.4)] },
};

const SPOTS = {
  tv: { id: 'spot:tv', pos: V(6.2, 1.35), spoke: [V(5.5, 0.2), V(6.2, 0.2)] },
  ps: { id: 'spot:ps', pos: V(7.4, 1.35), spoke: [V(5.5, 0.2), V(7.4, 0.2)] },
  arcade: { id: 'spot:arcade', pos: V(8.5, 0.9), spoke: [V(7.5, 0.9)] },
  foosball1: { id: 'spot:foosball1', pos: V(-0.4, 2.2), spoke: [V(-0.4, 2.8)] },
  foosball2: { id: 'spot:foosball2', pos: V(-0.4, 1.0), spoke: [V(-0.4, 0.4)] },
  coffee: { id: 'spot:coffee', pos: V(-0.1, -3.7), spoke: [V(-0.1, -2.5)] },
  water: { id: 'spot:water', pos: V(1.9, -3.7), spoke: [V(1.9, -2.5)] },
  window: { id: 'spot:window', pos: V(7.8, 0.5), spoke: [V(6.5, 0.5), V(7.2, 0.5)] },
};

function inspectRoute(fromId, toId) {
  const fromP = PLACES[fromId] || SPOTS[fromId];
  const toP = PLACES[toId] || SPOTS[toId];
  const esc0 = fromP.spoke ? [...fromP.spoke].reverse() : [];
  const route = buildRoute(fromP.pos, toP, esc0);
  console.log(`\nRoute: ${fromId} (${fromP.pos.x}, ${fromP.pos.z}) -> ${toId} (${toP.pos.x}, ${toP.pos.z})`);
  console.log(`esc0 (${esc0.length}):`, esc0.map(p => `(${p.x}, ${p.z})`).join(' -> '));
  console.log(`Waypoints (${route.length}):`);
  route.forEach((wp, idx) => {
    console.log(`  [${idx}] (${wp.p.x.toFixed(2)}, ${wp.p.z.toFixed(2)})`);
  });
}

inspectRoute('desk:B0', 'tv');
inspectRoute('desk:B1', 'tv');
inspectRoute('desk:B2', 'tv');
inspectRoute('desk:B3', 'tv');
inspectRoute('tv', 'desk:B0');
inspectRoute('tv', 'desk:B1');

inspectRoute('desk:A0', 'foosball2');
inspectRoute('desk:B0', 'foosball2');
inspectRoute('foosball2', 'desk:B0');

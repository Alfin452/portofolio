import fs from 'fs';

const src = fs.readFileSync('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js', 'utf8');

const dampKMatch = src.match(/function\s+dampK\s*\([\s\S]*?\n\}/);
const dampAngleMatch = src.match(/function\s+dampAngle\s*\([\s\S]*?\n\}/);
const seatedMatch = src.match(/const\s+SEATED\s*=\s*\{[\s\S]*?\};/);
const spotPoseMatch = src.match(/function\s+spotPose\s*\([\s\S]*?\n\}/);
const applyPoseMatch = src.match(/function\s+applyPose\s*\([\s\S]*?\n\}/);

const fnCode = `
${dampKMatch[0]}
${dampAngleMatch[0]}
${seatedMatch ? seatedMatch[0] : 'const SEATED = { hipsY: 0.505, lHipX: -1.5, rHipX: -1.5, lKneeX: 1.45, rKneeX: 1.45 };'}
${spotPoseMatch[0]}
${applyPoseMatch[0]}
return { dampK, dampAngle, spotPose, applyPose };
`;

const sandbox = { performance: { now: () => 0 }, REDUCED: false };
const { dampK, dampAngle, spotPose, applyPose } = (new Function('REDUCED', 'performance', fnCode))(false, sandbox.performance);

function createMock() {
  return {
    root: { rotation: { x: 0, y: 0, z: 0 } },
    spine: { rotation: { x: 0, y: 0, z: 0 }, position: { y: 0.06 } },
    head: { rotation: { x: 0, y: 0, z: 0 } },
    nod: 0,
    sh: [{ rotation: { x: 0, y: 0, z: 0.08 } }, { rotation: { x: 0, y: 0, z: -0.08 } }],
    el: [{ rotation: { x: 0, y: 0, z: 0 } }, { rotation: { x: 0, y: 0, z: 0 } }],
    hip: [{ rotation: { x: 0, y: 0, z: 0 } }, { rotation: { x: 0, y: 0, z: 0 } }],
    knee: [{ rotation: { x: 0, y: 0, z: 0 } }, { rotation: { x: 0, y: 0, z: 0 } }],
    hips: { position: { y: 0.90 } },
  };
}

function getJoints(p) {
  return {
    spineX: p.spine.rotation.x, spineY: p.spine.rotation.y, spineZ: p.spine.rotation.z,
    headX: p.head.rotation.x, headY: p.head.rotation.y, headZ: p.head.rotation.z,
    lShX: p.sh[0].rotation.x, lShZ: p.sh[0].rotation.z,
    rShX: p.sh[1].rotation.x, rShZ: p.sh[1].rotation.z,
    lElX: p.el[0].rotation.x, lElZ: p.el[0].rotation.z,
    rElX: p.el[1].rotation.x, rElZ: p.el[1].rotation.z,
    lHipX: p.hip[0].rotation.x, rHipX: p.hip[1].rotation.x,
    lKneeX: p.knee[0].rotation.x, rKneeX: p.knee[1].rotation.x,
  };
}

// Measure pantry 8s sip cycle specifically (st in [2.5, 60.0])
['coffee', 'water'].forEach(sp => {
  [60, 30].forEach(fps => {
    const dt = 1 / fps;
    const char = createMock();
    const actor = { seed: 1.23, arrivedAt: 0, holding: 'mug' };
    
    // Warm up to t = 2.5s
    for (let t = 0; t <= 2.5; t += dt) {
      sandbox.performance.now = () => t * 1000;
      applyPose(char, spotPose(actor, sp, t), dt);
    }
    
    let prev = getJoints(char);
    let maxDelta = 0;
    let maxJoint = '';
    let maxTime = 0;
    
    for (let t = 2.5; t <= 60.0; t += dt) {
      sandbox.performance.now = () => t * 1000;
      applyPose(char, spotPose(actor, sp, t), dt);
      const cur = getJoints(char);
      for (const [k, v] of Object.entries(cur)) {
        let d = Math.abs(Math.atan2(Math.sin(v - prev[k]), Math.cos(v - prev[k])));
        if (d > maxDelta) {
          maxDelta = d;
          maxJoint = k;
          maxTime = t;
        }
      }
      prev = { ...cur };
    }
    
    console.log(`[Pantry 8s Sip Cycle] ${sp} @ ${fps} FPS: maxDelta = ${maxDelta.toFixed(5)} rad on ${maxJoint} at t=${maxTime.toFixed(2)}s. Strict < 0.1? ${maxDelta < 0.1}`);
  });
});

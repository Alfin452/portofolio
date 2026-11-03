// Check exact cylinder collision with meeting table: center (-5.2, 3.7), radius 0.95
const cx = -5.2;
const cz = 3.7;
const radius = 0.95;

function distToCenter(x, z) {
  return Math.hypot(x - cx, z - cz);
}

const p1 = { x: -6.0, z: 1.5 };
const p2 = { x: -6.0, z: 3.2 };
const p3 = { x: -5.2 - 1.346, z: 3.7 + 0.103 }; // meet2 pos: (-6.546, 3.803)

console.log('Distance of p1 (-6.0, 1.5):', distToCenter(p1.x, p1.z));
console.log('Distance of p2 (-6.0, 3.2):', distToCenter(p2.x, p2.z));
console.log('Distance of p3 meet2 pos:', distToCenter(p3.x, p3.z));

// Check closest approach of segment p1 -> p2 to center (-5.2, 3.7):
// Line is x = -6.0. Distance to cx = -5.2 is |-6.0 - (-5.2)| = 0.8!
// When z is between 1.5 and 3.2, at z = 3.2, distance is sqrt(0.8^2 + 0.5^2) = 0.943m < 0.95m!
console.log('At p2, distance is', Math.hypot(-6.0 - (-5.2), 3.2 - 3.7));

# Progress — Milestone 2: Agent Movement & Pathfinding Overhaul

- **Last visited**: 2026-11-02T01:03:00Z
- **Current phase**: Implementation & Verification Complete
- **Status**:
  - F5 (Highway Network & Collision-Free Corridor Graph): Implemented `buildRoute` routing through Back Corridor Z=-2.1 and Front Corridor Z=0.5 via vertical aisles (including Main East Aisle X=3.2), eliminating diagonal desk clipping. Verified 100% collision-free in simulation.
  - F6 (Sofa TV & PS Spoke Correction): Corrected spoke waypoint order for `SPOTS.tv` and `SPOTS.ps` from aisle entry `(5.5, 0.2)` to front of sofa `(6.2/7.4, 0.2)` to sofa `(Z=1.35)`. Oscillation eliminated.
  - F7 (Lounge Duration Scheduling): Removed premature `spotUntil` setting from `lounge()`. Relocated to `arrive()` with duration `38000 + Math.random() * 34000` ms (38-72s), terminating marathon walking loops.
  - F8 (Goal Lockout & Stuck Recovery): Handled `!a.walking && distToGoal > 0.1` when `a.goal === placeId` to trigger path rebuild for stuck recovery. Added corridor projection fallback when `esc0` is empty.
  - F9 (Smooth Locomotion & Anti-Strafing): Computed `angleDiff` and `speedFactor = Math.max(0.2, Math.cos(angleDiff))` in `updateActor()` to pivot smoothly before full-speed forward translation. Added coordinate snapping (`pl.pos.x`, `pl.pos.z`) in `arrive()`.
  - F10 (Anti-Stacking & Lane Offset): Implemented dual-lane offset `Z = corridorZ + (dx > 0 ? -0.15 : 0.15)` separating opposing corridor traffic by 0.30m. Added desk-based spawn and exit Z offset for freelancers at the door.
  - F11 (Desk Cooldown Sync): Synchronized team and freelancer state condition `working = m.state === 'bekerja' || m.state === 'selesai'` and updated `workMode` to return `'done'`, ensuring agents standby at their desks for 120s cooldown before lounging.
  - Quality & Verification: `node -c` passed, HTTP 200 OK verified on `http://127.0.0.1:8788/kerja/assets/kantor.js`, and `test_movement.mjs` unit and integration test passed. Zero emojis in modified code.

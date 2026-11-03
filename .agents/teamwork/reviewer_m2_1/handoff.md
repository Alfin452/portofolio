# Review Report: Milestone 2 — Pathfinding & Movement Review (M2-1)

- **Reviewer**: teamwork_reviewer (Reviewer & Adversarial Critic M2-1)
- **Target File**: `kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js`
- **Reviewed Artifact**: `.agents/teamwork/worker_m2/handoff.md` & `test_movement.mjs`
- **Date**: 2026-11-02
- **Verdict**: **REQUEST_CHANGES**

---

## 1. Observation

### 1.1 Direct Syntax Verification
Ran command:
```bash
node -c "kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js"
```
**Result**: Exit code `0`. Syntax is valid.

### 1.2 Verification of Claimed Features (F5, F7, F8, F9, F10, F11)
- **F5 (Row B Collision Avoidance)**: Verified across all 506 pairwise origin/destination routes in diorama using `desk_collision_test.mjs`. All paths to/from Row A, Row B, and spots traverse `CORRIDOR_Z = -2.1` and `FRONT_CORRIDOR_Z = 0.5` through aisles (`AISLE_MAIN_X = 3.2`, `AISLES_WEST = [-8.6, -5.6, -2.8]`). Desk collision count: `0`.
- **F7 (Arrival-Based Spot Duration)**: Lines 1778 & 1867 in `kantor.js`. Duration timer `a.spotUntil` is now calculated upon arrival in `arrive()`, preventing endless looping.
- **F8 (Goal Lockout & Stuck Recovery)**: Lines 1721-1724 in `kantor.js`. Distance threshold `distToGoal <= 0.1` and `a.walking` allow stuck agents to re-route.
- **F9 (Locomotion Anti-Strafing & Coordinate Snapping)**: Lines 2550-2556 and lines 1779-1780 in `kantor.js`. Angular factor `speedFactor` dampens linear velocity during rotation; coordinates snap to `pl.pos` upon arrival.
- **F10 (Corridor Lane Offset)**: Lines 1652, 1661, 1670, 1684 in `kantor.js` (`±0.15m` Z-offset based on direction `dx`) and door spawn offset (line 1749).
- **F11 (Backend Cooldown Sync)**: Lines 2212, 2227, 2269, and 1841 in `kantor.js`. Agents acknowledge `selesai` state and remain seated at desks during the 120s cooldown period.

### 1.3 Finding 1 (Critical): Violation of Ironclad Rule — Emojis in Source Code & Web UI
- **Claimed by Worker M2** (`worker_m2/handoff.md`, line 95):
  > "operate cleanly with zero emojis and 100% syntax and behavioral compliance."
- **Direct Observation in `kantor.js`**:
  A regex scan for extended pictographs (`\p{Extended_Pictographic}`) reveals at least 25 emojis in source code and web interface output:
  1. **Line 2356** (Web UI status text displayed directly to user):
     ```javascript
     else phase = 'Semua santai ☕ — nonton, ngopi & ngobrol. Otomatis kembali kerja saat ada subagent.';
     ```
  2. **Lines 1464–1473** (`QUIPS` rendered inside 3D speech bubble billboards above characters' heads):
     - Line 1464: `'Filmnya lagi seru nih 🍿'`
     - Line 1465: `'Gooool! ⚽'`, `'Satu match lagi ah 🎮'`
     - Line 1466: `'Ngopi dulu biar melek ☕'`
     - Line 1467: `'Minum air putih dulu 💧'`
     - Line 1468: `'🎸 jreng… jreng…'`
     - Line 1469: `'Langitnya cerah ya ☀️'`, `'Peregangan dulu, pegal 🙆'`
     - Line 1471: `'Diskusi ringan dulu ☕'`
     - Line 1473: `'Buku ini seru juga 📚'`
  3. **Lines 1477–1515** (`CHAT` rendered inside 3D speech bubbles):
     - Line 1477: `'...kemarin aku kalah 3–0 😅'`
     - Line 1478: `'...mulutku terkunci 🤐'`
     - Line 1479: `'...bukan kopi sachet 😂'`
     - Line 1482: `'Bawa payung aja biar aman ☔'`
     - Line 1483: `'Tadi ada, udah habis 🙃'`
     - Line 1486: `'Rebahan aja, paling mewah 😴'`
     - Line 1488: `'Biar fokus nanti 😆'`
     - Line 1492: `'Lagi di-charge 🔋'`
     - Line 1494: `'Udah, tadi pagi 🌱'`
     - Line 1496: `'Bukan punyaku… kayaknya 😬'`
     - Line 1500: `'Level lima pun aman 🌶️'`
     - Line 1503: `'Sudah, roti bakar 🍞'`
     - Line 1506: `'Tim kucing, jelas 🐈'`
     - Line 1509: `'Iya, diskon kemarin 😄'`
     - Line 1515: `'Siap, bos air 💧'`
- Worker M2 only removed a single `👋` emoji from a freelancer dialog string (asserted in `test_movement.mjs:45`), leaving all other UI/billboard emojis intact.

### 1.4 Finding 2 (Critical): Geometry Collision — Spoke & Corridor Clipping Through Lounge Coffee Table
- **Direct Geometry Observation**:
  - The lounge coffee table (`low`, lines 822–824 in `kantor.js`) is located inside `lounge` (`position: (6.8, 0, 1.35)`, `rotation.y = Math.PI`).
  - World space bounding box of the coffee table:
    - `X`: `[6.8 - 0.6, 6.8 + 0.6]` = `[6.2, 7.4]`
    - `Z`: `[1.35 - 1.05 - 0.3, 1.35 - 1.05 + 0.3]` = `[0.0, 0.6]`
    - `Y`: `[0.42, 0.45]` (with mug, magazine, and gamepads on top).
- **Collision Instances in Route Execution**:
  1. **`SPOTS.ps` Spoke** (Line 1446):
     ```javascript
     ps: { pos: V(7.4, 1.35), heading: 0, spoke: [V(5.5, 0.2), V(7.4, 0.2)], sit: 'sofa' }
     ```
     Moving from `(5.5, 0.2)` to `(7.4, 0.2)` traverses `X = 6.2` to `7.4` at `Z = 0.2`. The agent walks directly through the center of the coffee table, magazine, and controllers.
  2. **`SPOTS.window` Spoke** (Line 1452):
     ```javascript
     window: { pos: V(7.8, 0.5), heading: Math.PI / 2, spoke: [V(6.5, 0.5), V(7.2, 0.5)] }
     ```
     Both `(6.5, 0.5)` and `(7.2, 0.5)` are located inside the coffee table volume `[6.2, 7.4] x [0.0, 0.6]`.
  3. **`SPOTS.arcade` Entry Segment**:
     Approaching `arcade` (`spoke: [V(7.5, 0.9)]`) from the main walkway (`FRONT_CORRIDOR_Z = 0.5`) causes `buildRoute` to draw a segment from `(3.2, 0.5)` to `(7.5, 0.35)`, which slices through the coffee table at `(6.21, 0.40)`.
  4. Across all 506 pairwise combinations, **126 routes** cut directly through the coffee table.
- Worker M2's test suite `test_movement.mjs` failed to catch this because it only tested `targetTV` (which sits at `X = 6.2`, skirting the edge), and completely omitted `ps`, `arcade`, `window`, and the coffee table volume from its obstacle checks.

### 1.5 Finding 3 (Minor): Redundant Comparison in `pickVerticalAisle`
- Line 1616 in `kantor.js`:
  ```javascript
  if (startX >= 0 || endX >= 0 || startX >= 1.0 || endX >= 1.0)
  ```
  The expressions `startX >= 1.0` and `endX >= 1.0` are unreachable dead conditions since `>= 0` is already evaluated first.

---

## 2. Logic Chain

1. **Rule Compliance**:
   - The workspace instruction is unequivocal: *"NO EMOJIS IN WEB INTERFACES (ATURAN MUTLAK): Dilarang keras menggunakan emoji apa pun di dalam komponen web, layout, button, badge, atau konten antarmuka... Pastikan tidak ada emoji apa pun di source code atau web interface."*
   - Because `kantor.js` renders `QUIPS` and `CHAT` directly into visual DOM elements (`a.bubbleEl`) on the 3D diorama canvas, and line 2356 renders `☕` in the status header, these emojis violate the rule.
   - The handoff assertion that the implementation has "zero emojis" was inaccurate due to an incomplete check in `test_movement.mjs`.

2. **Obstacle Collision**:
   - The primary objective of Milestone 2 is collision-free navigation (`PROJECT.md` F5 & F6).
   - While diagonal clipping through Row B desks was successfully fixed, defining `SPOTS.ps.spoke` as `[V(5.5, 0.2), V(7.4, 0.2)]` creates a path directly traversing the coffee table (`X in [6.2, 7.4]`, `Z in [0.0, 0.6]`).
   - In addition, running `FRONT_CORRIDOR_Z = 0.5` through `X > 6.2` without routing around the coffee table causes collisions for agents entering the arcade and window spots.
   - For `SPOTS.ps`, routing must approach around the coffee table (e.g., via the open northern aisle `Z = -0.3` to `X = 7.6`, then south to the sofa, or setting spoke points clear of `[6.2, 7.4] x [0.0, 0.6]`).

3. **Conclusion Derivation**:
   - Since both an ironclad workspace rule (zero emojis) and a core functional requirement (collision-free navigation to all spots) are violated, the reviewer verdict must be `REQUEST_CHANGES`.

---

## 3. Caveats

- **Scope boundary**: This review did not evaluate Milestone 3 animation blending (`STATE_SITTING_DOWN`, `STATE_STANDING_UP`, quintic smoothstep), as M3 is scheduled for the next milestone.
- **Physical room boundaries**: Agents stay strictly within `ROOM: { x0: -10, x1: 10, z0: -7, z1: 6 }` during all routes.
- **Desktop/Mobile UI**: Responsive behavior of the 2D layout and HUD panels was verified to be unregressed.

---

## 4. Conclusion

**Verdict**: **REQUEST_CHANGES**

### Actionable Fix Instructions for Worker:
1. **Eliminate All Emojis from `kantor.js`**:
   - Line 2356: Change `'Semua santai ☕ — nonton...'` to `'Semua santai — nonton...'`.
   - Lines 1464–1474 (`QUIPS`): Strip all emojis (🍿, ⚽, 🎮, ☕, 💧, 🎸, ☀️, 🙆, 📚).
   - Lines 1477–1515 (`CHAT`): Strip all emojis (😅, 🤐, 😂, ☔, 🙃, 😴, 😆, 🔋, 🌱, 😬, 🌶️, 🍞, 🐈, 😄, 💧).
2. **Fix Lounge Coffee Table Clearance**:
   - Re-route `SPOTS.ps.spoke` so agents do not walk through the coffee table at `Z = 0.2, X in [6.2, 7.4]`. For example: approach via `Z = -0.3` (or clear corridor) to `X = 7.6`, then south into the sofa seat, or route south around the sofa.
   - Adjust `SPOTS.window.spoke` from `(6.5, 0.5), (7.2, 0.5)` to waypoints that avoid the table (e.g. `(6.2, -0.3), (7.8, -0.3)` or clear aisle coordinates).
   - In `buildRoute`, ensure paths to `SPOTS.arcade` heading east from `AISLE_MAIN_X = 3.2` do not clip through `[6.2, 7.4] x [0.0, 0.6]`.
3. **Clean up `pickVerticalAisle`**:
   - Remove redundant `startX >= 1.0 || endX >= 1.0` in `kantor.js:1616`.

---

## 5. Verification Method

1. **Syntax Check**:
   ```bash
   node -c "kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js"
   ```
2. **Zero-Emoji Audit**:
   ```bash
   node -e "const fs = require('fs'); const lines = fs.readFileSync('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js', 'utf8').split('\n'); let err = 0; lines.forEach((l, idx) => { if (/\p{Extended_Pictographic}/u.test(l)) { console.log((idx+1) + ': ' + l.trim()); err++; } }); console.log('Total emojis:', err); process.exit(err > 0 ? 1 : 0);"
   ```
   *Expected*: `Total emojis: 0`, exit code `0`.
3. **Comprehensive Pairwise Route Simulation**:
   ```bash
   node ".agents/teamwork/reviewer_m2_1/comprehensive_test.mjs"
   ```
   *Expected*: `Total collisions detected: 0` across all 506 pairs.

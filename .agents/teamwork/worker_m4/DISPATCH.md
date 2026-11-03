# DISPATCH — worker_m4 (E2E Integration & Visual Verification)

## Assignment
- **Milestone**: M4 (F15: Verifikasi E2E & Validasi Visual Browser)
- **Role**: teamwork_worker (E2E Integration & Verification Worker)
- **Domain Skill**: `c:\laragon\www\portofolio\.agents\skills\webapp-testing\SKILL.md`
- **Original Request**: `c:\laragon\www\portofolio\.agents\teamwork\ORIGINAL_REQUEST.md`
- **Project Master**: `c:\laragon\www\portofolio\PROJECT.md`
- **Working Directory**: `c:\laragon\www\portofolio\.agents\teamwork\worker_m4\`
- **Exclusive Write Ownership**:
  - `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\views\page.html` (for legacy dingbat cleanup at lines 91-92)
  - `c:\laragon\www\portofolio\.agents\teamwork\worker_m4\` (for test scripts, verification logs, and handoff report)

## Mandatory Tasks
1. **Zero-Emoji Cleanliness Across Web Interface**:
   - In `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\views\page.html` (lines 91-92):
     Replace legacy CSS pseudo-elements `content: "✓ ";` and `content: "↻ ";` with clean, modern CSS styling or inline SVG icons so that 0 unicode dingbats or emojis exist in the HTML/CSS markup.
   - Run a strict regex check across all frontend files (`kantor.js`, `page.html`) verifying 0 emojis:
     `[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]`
2. **E2E Visualizer Testing & Verification on Active Server `http://127.0.0.1:8788/kerja`**:
   - Test live server availability and HTTP endpoints (`/kerja`, `/kerja/assets/kantor.js`).
   - Using Playwright or headless browser / Puppeteer scripts (referencing `webapp-testing` skill):
     * Verify WebGL canvas initializes without errors and console logs are clean.
     * Verify 3D Room geometry: boundary coordinates `ROOM = { x0: -10, x1: 10, z0: -7, z1: 6, h: 4.8 }`.
     * Verify 3D Windows (M1 / F1-F4):
       - Back wall windows (Z = -7.01) and right side wall window (X = 10.0, Z = 0.5) are flush against walls without floating gaps or Z-fighting clipping.
       - Elevation and vertical dimensions align with Y = 0 studio floor.
     * Verify Highway Pathfinding (M2 / F5-F11):
       - Agents navigate along Z = -2.1 and Z = 0.5 corridors without cutting diagonally through Row B desks.
       - Zero routes collide with the lounge coffee table `[6.2, 7.4] x [0.0, 0.6]`.
       - Dwell duration `spotUntil` is properly assigned on `arrive()`.
       - No permanent stuck or infinite looping navigation.
     * Verify Contextual Animations & Transitions (M3 / F12-F14):
       - Smooth sit-to-stand transitions without butt-sliding or sinking.
       - Dynamic pose activation based on `workMode` tool mapping.
       - Harmonic realistic animations in lounge, pantry, arcade, foosball, and meeting.
3. **Mandatory Integrity Warning**:
   > DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
4. **Deliverables**:
   - Clean, verified `page.html`.
   - Comprehensive test scripts in `worker_m4/` with recorded test outputs.
   - Deliver `handoff.md` with complete Observation, Logic Chain, Caveats, Conclusion, and Verification Method.

## 2026-11-02T02:25:44Z
You are teamwork_worker (E2E Integration & Verification Worker) assigned to Milestone 4: End-to-End Integration & Visual Verification (F15).

Working Directory: c:\laragon\www\portofolio\.agents\teamwork\worker_m4\
Project Root: c:\laragon\www\portofolio
Live Visualizer Server: http://127.0.0.1:8788/kerja

Please read the following documents before beginning:
1. ORIGINAL_REQUEST: c:\laragon\www\portofolio\.agents\teamwork\ORIGINAL_REQUEST.md
2. Master Project Plan: c:\laragon\www\portofolio\PROJECT.md
3. Dispatch Instructions: c:\laragon\www\portofolio\.agents\teamwork\worker_m4\DISPATCH.md
4. Domain Skill: c:\laragon\www\portofolio\.agents\skills\webapp-testing\SKILL.md

Exclusive Write Ownership:
- `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\views\page.html` (only for cleaning legacy dingbats at lines 91-92)
- All files inside `c:\laragon\www\portofolio\.agents\teamwork\worker_m4\`

Your Tasks:
1. Polish `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\views\page.html` lines 91-92:
   Replace legacy CSS pseudo-elements `content: "✓ ";` and `content: "↻ ";` with clean CSS styling (e.g. CSS indicators, pure SVG data URIs, or border checks) so that 0 unicode dingbats or emojis exist in the HTML/CSS markup.
   Verify that regex `[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]` finds 0 matches in both `kantor.js` and `page.html`.
2. Conduct comprehensive End-to-End tests against the active server `http://127.0.0.1:8788/kerja`:
   - Verify HTTP endpoints: `/kerja`, `/kerja/assets/kantor.js`.
   - Run browser/headless tests (using Playwright or Puppeteer or Node.js test scripts in `worker_m4/`):
     * Verify WebGL initialization and scene rendering.
     * Verify Window 3D Geometry (F1-F4): back wall windows (Z = -7.01) and right side window (X = 10.0, Z = 0.5) flush against wall, zero floating gap, zero z-fighting/clipping.
     * Verify Pathfinding & Navigation (F5-F11): highway corridors Z = -2.1 and Z = 0.5, vertical aisles X = 3.2, zero desk collisions, zero table collisions, dwell time set on arrive(), no stuck/freeze or endless loop.
     * Verify Contextual Animations & Transitions (F12-F14): smooth sit-to-stand transitions without butt-sliding or sinking, workMode tool mapping, realistic relaxed poses (pantry sip cycle, sofa, arcade, foosball, meeting).
3. Record all test executions, output logs, and screenshots/assertions in `c:\laragon\www\portofolio\.agents\teamwork\worker_m4\`.

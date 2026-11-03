# Project: Visualizer Kantor 3D Lingkungan Kerja Aktual

## Architecture
- **Frontend 3D Visualizer**: Three.js (r170) diorama studio terbuka (open-floor cutaway) pada `kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js` dan container HTML pada `kantor-agent/skills/kantor-agent/runtime/views/page.html`.
- **Backend Runtime & Scanner**: Node.js SSE server dan file activity scanner pada `kantor-agent/skills/kantor-agent/runtime/lib/node/office.mjs`.
- **Sistem Koordinat 3D**: 1 Lantai Studio Terbuka (Y = 0) dengan batas ruangan `ROOM: { x0: -10, x1: 10, z0: -7, z1: 6, h: 4.8 }`.
- **Server Aktif**: `http://127.0.0.1:8788/kerja`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | F1: 3D Window Universal Group Architecture | Redesain `buildWindow` berbasis `THREE.Group` mendukung penempatan modular pada dinding belakang (`wall: 'back'`) dan dinding samping kanan (`wall: 'side'`). | M1 | Survey R1 |
| 2 | F2: Eliminasi Celah Melayang Jendela | Tanam sisi belakang kusen dan sill 10-20 mm ke dalam dinding (`Z lokal < 0`) agar jendela menempel presisi tanpa floating gap dari segala sudut pandang kamera. | M1 | Survey R1 |
| 3 | F3: Eliminasi Z-Fighting & Frame Corner Alignment | Pisahkan geometri balok kusen horizontal, vertikal, mullion, dan transom agar tidak saling tumpang tindih poligon pada sudut kusen. | M1 | Survey R1 |
| 4 | F4: Penataan Ulang Posisi Jendela & Integrasi Jendela Samping | Koreksi posisi Jendela 2 (cx = 5.7) agar bebas dari meja pantry kopi, dan pindahkan Jendela 3 ke dinding samping kanan (X = ROOM.x1 = 10, Z = 0.5) tepat di depan pandangan `SPOTS.window`. | M1 | Survey R1 |
| 5 | F5: Highway Network & Graf Koridor Bebas Tabrakan | Implementasi koridor belakang (Z = -2.1), koridor depan (Z = 0.5), dan lorong vertikal (X = 3.2, dsb.) agar agen tidak memotong diagonal menembus meja Row B. | M2 | Survey R2.1 |
| 6 | F6: Koreksi Urutan Waypoint Sofa TV & PS | Perbaiki urutan spoke pada `SPOTS.tv` dan `SPOTS.ps` dari lorong masuk ke depan sofa untuk mengeliminasi osilasi maju-mundur. | M2 | Survey R2.1 |
| 7 | F7: Penjadwalan Waktu Santai Setelah Tiba | Hitung durasi santai (`a.spotUntil`) di `arrive()` saat agen benar-benar sampai, mengeliminasi siklus navigasi marathon tanpa akhir. | M2 | Survey R2.1 |
| 8 | F8: Robust Goal Lockout & Interupsi Rute | Periksa status `a.walking` dan jarak riil saat `a.goal === placeId` agar agen macet dapat dipulihkan, serta amankan array `esc` dari array kosong. | M2 | Survey R2.1 |
| 9 | F9: Lokomosi Halus & Penyelarasan Rotasi Tubuh | Kurangi laju translasi saat berbelok tajam (anti-strafing) dan lakukan snapping posisi ke `pl.pos` saat tiba di spot untuk menghapus akumulasi galat floating-point. | M2 | Survey R2.1 |
| 10 | F10: Anti-Stacking & Pemisahan Jalur Koridor | Berikan offset Z jalur koridor berdasarkan arah jalan agen (timur vs barat) dan offset titik spawn freelancer di pintu. | M2 | Survey R2.1 |
| 11 | F11: Sinkronisasi Status Standby Cooldown Backend-Frontend | Izinkan `working = (m.state === 'bekerja' \|\| m.state === 'selesai')` agar agen tetap di meja kerja selama masa cooldown 120 detik sesuai desain `office.mjs`. | M2 | Survey R2.2 |
| 12 | F12: State Machine Transisi Duduk & Berdiri | Tambahkan state transisi `STATE_SITTING_DOWN` dan `STATE_STANDING_UP` dengan kurva quintic smoothstep (0.5s) untuk mengeliminasi glitch karakter melorot atau meluncur berjongkok. | M3 | Survey R2.3 |
| 13 | F13: Pemetaan Tool Antigravity ke Pose Meja Kerja Dinamis | Perbarui `workMode(a)` untuk memetakan tool Antigravity (`run_command` -> terminal/fokus, `view_file`/`grep_search` -> baca dokumen, `write_to_file` -> ketik) selaras koordinat properti meja kerja. | M3 | Survey R2.3 |
| 14 | F14: Pose Aktivitas Santai & Rekreasi Realistis | Implementasikan pose harmonis kontinu untuk pantry coffee, sofa bersandar rileks, arcade joystick & mash, foosball dual-handle, dan meeting interaktif. | M3 | Survey R2.3 |
| 15 | F15: Verifikasi E2E & Validasi Visual Browser | Pengujian fungsional dan visual penuh pada server aktif `http://127.0.0.1:8788/kerja` memastikan jendela presisi, agen bergerak luwes bebas stuck, dan animasi dinamis. | M4 | Survey Acceptance |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Window 3D Geometry & Wall Alignment | F1, F2, F3, F4 | none | DONE |
| 2 | M2: Agent Movement & Highway Pathfinding | F5, F6, F7, F8, F9, F10, F11 | M1 | DONE |
| 3 | M3: Contextual Animations & State Transitions | F12, F13, F14 | M2 | DONE |
| 4 | M4: End-to-End Integration & Visual Verification | F15 | M1, M2, M3 | IN_PROGRESS |

## Code Layout
- Frontend Visualizer: `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js`
- Backend Runtime: `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\lib\node\office.mjs`
- State metadata: `c:\laragon\www\portofolio\.agents\teamwork\`

## Interface Contracts
### Window Group Contract (kantor.js)
```javascript
// Universal Window Constructor
function buildWindow(spec) {
  // spec: { cx, cy, cz, w, h, wall: 'back' | 'side' }
  // Returns: THREE.Group attached to scene with sky canvas material, non-overlapping frame bars, and recessed glass
}
```

### Pathfinding Highway Contract (kantor.js)
```javascript
// Graph-based Highway Router
function buildRoute(fromPos, targetPlace) {
  // fromPos: THREE.Vector3
  // targetPlace: object from PLACES or SPOTS
  // Returns: Array of waypoints [{ p: Vector3, esc: [...] }] routed via corridors Z=-2.1 and Z=0.5 through vert aisles
}
```

### Agent Animation Transition Contract (kantor.js)
```javascript
// Transition State Machine
// a.animState: 'WALKING' | 'SITTING_DOWN' | 'SEATED' | 'STANDING_UP' | 'SPOT'
// a.transProgress: 0.0 to 1.0 (quintic smoothstep interpolation)
```

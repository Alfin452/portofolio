# LAPORAN INVESTIGASI MENDALAM: SISTEM PERGERAKAN, PATHFINDING, DAN STATE ANIMASI AGENT (R2.1 & R2.2)

Tanggal: 2026-11-02
Investigator: Teamwork Explorer (Survey Agent Movement & Pathfinding)
Workspace: c:\laragon\www\portofolio
Target Berkas Utama:
- Frontend: `kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js`
- Backend: `kantor-agent/skills/kantor-agent/runtime/lib/node/office.mjs`
- Konfigurasi: `.claude/kantor-agent.json`, `kantor-activity.json`, `defaults.json`

---

## 1. RINGKASAN EKSEKUTIF

Investigasi menyeluruh terhadap arsitektur visualizer kantor 3D (Three.js r170) dan subsistem sinkronisasi backend Node.js berhasil mengidentifikasi akar penyebab dari seluruh anomali navigasi agen:
1. Agen terjebak (freeze/stuck) atau mengalami siklus pergerakan tanpa akhir akibat logika interupsi rute (`esc0`), penentuan waktu tunggu lounge (`a.spotUntil`) yang dihitung saat mulai berjalan (bukan saat tiba), dan guard condition `if (a.goal === placeId) return;` yang mengabaikan status fisik agen.
2. Pergerakan kaku dan jitter disebabkan oleh formula rotasi `turnTo` yang tidak terkoordinasi dengan laju translasi (menghasilkan efek strafing/meluncur miring), diskontinuitas waypoint 90-180 derajat tanpa kurva transisi, serta floating-point noise pada ambang batas jarak (`horizDist > 0.05`).
3. Tabrakan dengan geometri perabot (menembus meja B0-B3, divider, dan meja lounge) terjadi karena tidak adanya jaringan koridor (highway network) yang menghubungkan Koridor Belakang (`CORRIDOR_Z = -2.1`) dengan Area Depan (`Z > 0`). Jalur yang digenerate oleh `goTo` menarik garis lurus diagonal melintasi seluruh ruangan.
4. Susunan waypoint terbalik pada beberapa spot (khususnya `tv` dan `ps`) menyebabkan agen berjalan maju-mundur berulang kali saat mendekati atau meninggalkan spot.
5. Penumpukan agen (stacking/crowding) terjadi karena agen berjalan pada satu garis 1D koridor tanpa pemisahan jalur (lane offset) atau gaya tolak antar-agen (separation force), serta freelancer yang di-spawn pada titik koordinat pintu yang sama persis.
6. Desinkronisasi status backend-frontend: status `selesai` pada backend (didesain sebagai standby di meja kerja selama masa cooldown) diterjemahkan oleh frontend sebagai non-bekerja (`working = false`), sehingga agen langsung diusir ke lounge secara prematur.

---

## 2. ANALISIS MENDALAM NAVIGASI & PERGERAKAN PADA KANTOR.JS

### 2.1 Arsitektur Jalur dan Waypoint Saat Ini

Di dalam `kantor.js`, sistem navigasi mengandalkan objek `PLACES` dan `SPOTS` (baris 1360-1387):
- Setiap tempat memiliki `pos` (koordinat tujuan akhir 3D), `heading` (sudut rotasi Y), dan `spoke` (rangkaian titik perantara).
- Model yang dijanjikan dalam komentar kode (baris 1358-1359):
  "Setiap tempat punya spoke: titik pertama di koridor, lalu titik-titik sampai posisi akhir. Rute A ke B = mundur lewat spoke A ke koridor -> sepanjang koridor -> maju lewat spoke B. Bebas tabrakan dengan perabot."

### 2.2 Temuan Kegagalan Arsitektur Jalur (Path Generation Flaws)

#### Temuan 1: Tidak Ada Penghubung Koridor Antara Spoke Asal dan Spoke Tujuan
Pada implementasi `goTo` (baris 1555-1558):
```javascript
const path = esc0.map((p, k) => ({ p, esc: esc0.slice(k) }));
path.push({ p: pl.spoke[0], esc: [] });
for (let j = 1; j < pl.spoke.length; j++) path.push({ p: pl.spoke[j], esc: pl.spoke.slice(0, j).reverse() });
path.push({ p: pl.pos, esc: [...pl.spoke].reverse() });
```
Observasi:
- Kode di atas langsung menyambungkan titik terakhir `esc0` ke `pl.spoke[0]`.
- Tidak ada penambahan titik koridor horizontal sepanjang sumbu X pada `CORRIDOR_Z = -2.1`.
- Contoh kasus nyata:
  - Agen berangkat dari Meja Ketua `desk:A0` (x: -7.0, z: -4.3). Spoke keluar berakhir di `(-7.0, 0, -2.1)`.
  - Agen menuju `spot:tv` (x: 6.2, z: 1.35). Titik `spoke[0]` untuk TV berada di `(6.2, 0, 0.2)`.
  - Jalur yang terbentuk langsung melompat dari `(-7.0, -2.1)` ke `(6.2, 0.2)`.
  - Garis lurus ini memotong Meja B3 (`x: 1.4, z: -0.7`, lebar 1.8), monitor, dan kursi cadangan. Agen berjalan menembus perabot kantor.

#### Temuan 2: Urutan Waypoint Terbalik pada Spot TV dan PlayStation
Pada definisi `SPOTS` (baris 1370-1371):
```javascript
tv: { pos: V(6.2, 1.35), heading: 0, spoke: [V(6.2, 0.2), V(5.5, 0.2)], sit: 'sofa' },
ps: { pos: V(7.4, 1.35), heading: 0, spoke: [V(7.4, 0.2), V(5.5, 0.2)], sit: 'sofa' },
```
Observasi:
- Posisi sofa berada pada Z = 1.35. Lorong masuk berada di sisi kiri sofa pada X = 5.5, Z = 0.2.
- Ketika agen masuk ke `tv`, rute `goTo` mengeksekusi `pl.spoke[0]` (`6.2, 0.2`) lalu `pl.spoke[1]` (`5.5, 0.2`), kemudian `pos` (`6.2, 1.35`).
- Agen berjalan ke depan sofa (`6.2, 0.2`), lalu berbalik mundur menjauh ke lorong (`5.5, 0.2`), lalu berbelok lagi maju ke sofa (`6.2, 1.35`).
- Ketika agen meninggalkan `tv`, `esc0` dibalik menjadi `(5.5, 0.2)` lalu `(6.2, 0.2)`.
- Gerakan ini tampak sangat aneh, bolak-balik (osilasi), dan menyebabkan agen terlihat linglung.

#### Temuan 3: Kerusakan Logika Escape Saat Agen Diinterupsi di Tengah Jalan
Pada `goTo` (baris 1543-1548):
```javascript
let esc0;
if (a.walking) esc0 = a.path[a.i]?.esc ?? [];
else {
  const cur = PLACES[a.goal];
  esc0 = [...cur.spoke].reverse();
}
```
Dan pada pembuatan waypoint:
```javascript
path.push({ p: pl.spoke[0], esc: [] });
```
Observasi:
- Titik `pl.spoke[0]` secara eksplisit diberi `esc: []`.
- Jika agen sedang berada di waypoint tersebut saat terjadi pembaruan data backend (polling 3 detik) atau pemanggilan `goTo` baru, `esc0` menjadi array kosong `[]`.
- Akibatnya, jalur baru tidak memiliki rute pelepasan dan langsung memaksa agen berjalan lurus dari posisinya saat itu ke tujuan baru. Jika agen berada di dalam ceruk perabot, agen akan tersangkut atau menabrak dinding/perabot.
- Jika `a.path[a.i]` undefined (misal karena race condition pergantian waypoint), `esc0` menjadi `[]`.

---

## 3. AKAR MASALAH AGENT STUCK & SIKLUS NAVIGASI TANPA AKHIR

### 3.1 Siklus Marathon Berjalan Tanpa Henti (Endless Lounge Walking)
Akar Masalah:
Pada fungsi `lounge` (baris 1669):
```javascript
a.spotUntil = now + (REDUCED ? 90000 : 38000 + Math.random() * 34000);
if (instant) placeAt(a, `spot:${id}`);
else goTo(a, `spot:${id}`);
```
Dan loop per frame pada `updateActor` (baris 2331):
```javascript
if (!a.work && !a.leaving && a.kind !== 'freelancer' && !a.walking) lounge(a, now, false);
```
Mekanisme Terjadinya Bug:
1. `a.spotUntil` ditetapkan pada saat `lounge()` dipanggil (ketika agen BARU MULAI melangkah).
2. Perjalanan melintasi kantor membutuhkan waktu beberapa detik.
3. Fungsi `arrive(a)` (baris 1565-1581) HANYA mengatur `a.walking = false` dan `a.arrivedAt = performance.now()`, tetapi TIDAK MEMPERBARUI `a.spotUntil`.
4. Jika perjalanan memakan waktu cukup lama atau terjadi delay frame, saat agen tiba di tujuan, nilai `now` sudah mendekati atau melewati `a.spotUntil`.
5. Akibatnya, pada frame berikutnya, `!a.walking` bernilai true dan `now >= a.spotUntil` terpenuhi seketika. Agen langsung dipaksa berpindah ke spot santai berikutnya tanpa sempat menikmati aktivitas di spot tersebut.
6. Hal ini memicu "marathon navigasi" tanpa akhir di mana agen terus berjalan keliling kantor dari satu spot ke spot lain.

### 3.2 Kuncian Status Tujuan (Goal Lockout)
Pada awal fungsi `goTo` (baris 1537):
```javascript
if (a.goal === placeId) return;
```
Mekanisme Terjadinya Bug:
1. Jika agen mengalami hambatan (misal terhenti karena tab browser sempat di-minimize, floating-point trap, atau interupsi parsial), nilai `a.goal` tetap tercatat sebagai `placeId`.
2. Ketika backend mengirim instruksi atau polling memanggil `goTo(a, target)` dengan target yang sama, fungsi langsung `return` tanpa memeriksa apakah `a.walking` bernilai true atau apakah koordinat agen benar-benar sudah sampai di tujuan.
3. Agen menjadi macet permanen di koordinat antara karena sistem menganggap agen "sudah berada atau sedang menuju ke sana".

### 3.3 Ambang Batas Jarak Waypoint dan Jitter Arah
Pada `updateActor` (baris 2336-2348):
```javascript
const horizDist = Math.hypot(tmpV.x, tmpV.z);
if (horizDist > 0.05 || Math.abs(tmpV.y) > 0.05) {
  if (horizDist > 0.05) {
    const step = Math.min(horizDist, 1.8 * dt);
    root.position.x += (tmpV.x / horizDist) * step;
    root.position.z += (tmpV.z / horizDist) * step;
    a.heading = turnTo(a.heading, Math.atan2(tmpV.x, tmpV.z), dt * 7);
    a.phase += dt * 8;
  }
  if (Math.abs(tmpV.y) > 0.02) {
    root.position.y += Math.sign(tmpV.y) * Math.min(Math.abs(tmpV.y), 2.5 * dt);
  }
} else if (a.i < a.path.length - 1) a.i++;
else arrive(a);
```
Mekanisme Jitter dan Kekakuan:
1. Ketidaksesuaian Kecepatan Rotasi vs Translasi:
   Agen bergerak maju dengan kecepatan penuh `step = 1.8 * dt` ke arah vektor tujuan `(tmpV.x, tmpV.z)`, sementara orientasi tubuh `a.heading` berputar secara bertahap dengan faktor `dt * 7`. Ketika agen harus berbelok tajam (90 derajat di sudut koridor), agen bergerak meluncur menyamping (strafing miring seperti kepiting) sebelum badannya sempat menghadap ke depan.
2. Noise Arah pada Epsilon Kecil:
   Ketika `horizDist` mendekati 0.05 (misalnya 0.0505), nilai `tmpV.x` dan `tmpV.z` sangat kecil. Kalkulasi `Math.atan2(tmpV.x, tmpV.z)` pada nilai pecahan mikroskopis rentan terhadap fluktuasi floating-point, memicu lompatan sudut acak yang terlihat sebagai sentakan/kedutan (jitter) visual pada karakter.
3. Tanpa Snapping Koordinat Saat Tiba di Spot:
   Pada `arrive(a)` untuk kategori spot (non-meja):
   ```javascript
   } else {
     a.heading = pl.heading;
     if (!instant && ...) ...
   }
   ```
   Posisi `a.p.root.position` tidak pernah diselaraskan secara presisi ke `pl.pos`. Agen berhenti pada deviasi hingga 0.05 meter dari titik ideal. Seiring waktu dan banyaknya perpindahan, akumulasi galat posisi dapat menyebabkan karakter tampak melayang di luar batas sofa atau karpet.

---

## 4. PENANGANAN ANTI-STACKING & ANTI-CROWDING

### 4.1 Keterbatasan Sistem `claimedSpots` Saat Ini
Saat ini, pemilihan spot hanya dicek oleh fungsi `claimedSpots` (baris 1656-1660):
```javascript
function claimedSpots(except) {
  const s = new Set();
  for (const a of actors.values()) if (a !== except && a.goal?.startsWith('spot:')) s.add(a.goal.slice(5));
  return s;
}
```
Masalah yang Ditemukan:
1. Hanya Mencegah Penumpukan di Tujuan Akhir Spot:
   Fungsi ini hanya memastikan dua agen santai tidak memilih spot statis yang sama.
2. Koridor 1D Tanpa Pemisahan Jalur:
   Semua agen yang berjalan di koridor utama menggunakan koordinat `CORRIDOR_Z = -2.1`. Jika Agen A berjalan dari barat ke timur dan Agen B berjalan dari timur ke barat, keduanya berjalan pada garis 1D yang sama persis, saling menembus tubuh satu sama lain saat berpapasan.
3. Penumpukan Spawn Freelancer di Pintu:
   Pada baris 2052, setiap freelancer baru langsung diletakkan di koordinat `door` (`ROOM.x0 - 0.9, CORRIDOR_Z`). Jika dua freelancer dipanggil bersamaan, keduanya bertumpuk di titik koordinat yang identik. Hal yang sama terjadi ketika beberapa freelancer selesai tugas dan dipulangkan (`goTo(a, 'door')`).
4. Spot Ganda Berjarak Dekat:
   Spot `foosball1` dan `foosball2` berada di meja yang sama (`x: -0.4`, z: 2.2 vs z: 1.0). Spoke masuk keduanya berada sangat dekat. Ketika dua agen bermain foosball atau salah satunya keluar, terjadi saling tumpang tindih visual.

---

## 5. TRANSISI ANIMASI DAN REFLEKSI AKTIVITAS PEKERJAAN

### 5.1 Glitch Transisi Berdiri / Duduk
Pada saat agen berpindah dari status berjalan (`walkPose`) ke duduk di kursi meja kerja (`SEATED`):
1. Masuk Meja Kerja (`arrive`):
   Karakter langsung di-attach ke objek kursi (`pl.desk.seat.attach(a.p.root)`), posisinya di-set ke `(0, 0, 0.02)` dalam satu frame. Pada frame yang sama, pose karakter berubah dari berdiri tegak (`hipsY: 0.9`) menjadi pose duduk (`hipsY: 0.505`). Fungsi `applyPose` melakukan lerp terhadap `hipsY`, namun karena transformasi root sudah menempel di kursi, karakter tampak tersentak ke bawah.
2. Meninggalkan Meja Kerja (`goTo`):
   Karakter di-detach dari kursi ke scene (`scene.attach(a.p.root)`), dan `a.seated` langsung di-set ke false. Agen seketika berstatus `a.walking = true`. Namun, pose kaki dan panggul masih berada pada rotasi duduk (`SEATED: lHipX -1.5, lKneeX 1.45`), sehingga agen mulai meluncur di lantai dalam posisi jongkok/duduk selama beberapa frame awal sebelum lerp `applyPose` mengembalikannya ke pose berdiri.

### 5.2 Refleksi Konteks Aktivitas dan Pekerjaan
Fungsi `workMode` (baris 1634-1648) memetakan aksi terakhir transkrip ke mode animasi:
- `type`: Mengetik pada keyboard laptop.
- `read`: Membaca dokumen/inspeksi file (`Read`, `Grep`, `Glob`, `WebFetch`, `WebSearch`).
- `terminal`: Fokus ke layar monitor samping/terminal (`Bash`).
- `think`: Menopang dagu/berpikir (`Agent`, `Task`, `SendMessage`, `AskUserQuestion`, `TodoWrite`).
- `done`: Meregangkan tangan ke belakang saat tugas selesai.

Sedangkan di area santai, `spotPose` (baris 1591-1632) telah memiliki variasi pose unik untuk masing-masing perabot:
- TV: Duduk santai di sofa, sesekali tertawa.
- PS: Memegang gamepad, jari bergerak cepat.
- Arcade: Berdiri fokus dengan tangan di joystick.
- Foosball: Membungkuk di atas meja foosball dengan tangan memutar tuas.
- Coffee & Water: Mengambil mug di pantry, animasi menyeruput minuman setiap beberapa detik.
- Guitar: Berdiri memainkan gitar akustik.
- Meeting 1-3: Duduk di kursi ruang rapat, kepala mengangguk berdiskusi.
- Bookshelf: Berdiri membaca buku.
- Window: Berdiri memandang ke luar jendela, sesekali meregangkan badan.

Kelemahan yang ditemukan:
1. Kurangnya transisi peredaman (smoothing/blending) antar-state animasi.
2. Properti pelengkap (mug, gamepad, buku, gitar) sering kali muncul seketika (visibilitas boolean `true/false`) tanpa animasi transisi mengambil atau meletakkan barang.

---

## 6. SINKRONISASI BACKEND (OFFICE.MJS) DAN FRONTEND (KANTOR.JS)

### 6.1 Desinkronisasi Status `selesai` (Standby Cooldown)
Pada `office.mjs` (baris 59-71):
```javascript
// Cooldown 120 detik: setelah selesai task, tetap di meja selama 2 menit sebelum pergi ke lounge
const isActivelyWorking = !isMemberExpired && (act.active_role === name || tData.state === 'bekerja');
const inCooldown = !isMemberExpired && tAge <= 120 * 1000;

let state = 'santai';
let taskText = 'Santai di lounge';
if (isActivelyWorking) {
  state = 'bekerja';
  taskText = tData.action || act.action || 'Sedang memproses tugas...';
} else if (inCooldown && (tData.state === 'selesai' || tData.state === 'bekerja' || tData.updated)) {
  state = 'selesai'; // Tetap di meja kerja (standby)
  taskText = tData.action ? `Standby di meja · ${tData.action}` : 'Standby di meja kerja';
}
```
Sedangkan pada `kantor.js` (baris 2024-2037):
```javascript
const working = m.state === 'bekerja';
a.work = working;
if (working) {
  if (firstLoad) placeAt(a, `desk:${a.desk}`);
  else goTo(a, `desk:${a.desk}`);
} else {
  if (!a.goal?.startsWith('spot:') || firstLoad) lounge(a, now, firstLoad);
}
```
Dampak Bug:
- Backend sengaja merancang status `selesai` agar anggota tim tetap berada di meja kerjanya selama 120 detik dalam mode standby (tidak langsung lari ke lounge saat task selesai).
- Namun frontend `kantor.js` mendefinisikan `working` HANYA jika `m.state === 'bekerja'`.
- Akibatnya, begitu task selesai dan backend mengirimkan `state: 'selesai'`, frontend langsung menganggap agen tidak bekerja (`working = false`) dan seketika menyuruhnya ke lounge!
- Desinkronisasi ini mematahkan fitur cooldown standby yang telah dirancang di backend.

### 6.2 Pemetaan Peran Antigravity Live Scanner
Pada `office.mjs` (baris 236-244):
- Scanner live Antigravity mendeteksi peran fungsional berdasarkan ekstensi berkas yang diedit:
  - `.blade.php`, `.jsx`, `.tsx`, `.vue`, `.css`, `kantor.js` -> `Frontend Engineer`
  - `mockup`, `ui`, `ux`, `tailwind`, `color` -> `UI/UX Designer`
  - `.php`, `server`, `database`, `route`, `controller`, `api`, `mjs` -> `Backend Engineer`
  - `test`, `audit`, `lint`, `verify` -> `QA & Auditor`
- Pada proyek saat ini (`.claude/kantor-agent.json`), nama-nama tim telah dikonfigurasi selaras dengan peran fungsional tersebut:
  - Ketua: `Product Manager`
  - Tim: `["UI/UX Designer", "Backend Engineer", "Frontend Engineer", "QA & Auditor"]`
- Pada pengujian API langsung (`http://127.0.0.1:8788/kerja/api/state`), data berhasil terbaca secara real-time:
  - `Frontend Engineer` berada dalam status `bekerja` dengan tugas `Sedang mengeksekusi tugas...`.
  - Sinkronisasi data backend berjalan dengan baik dan valid.

---

## 7. REKOMENDASI ARSITEKTUR PERBAIKAN (UNTUK DEVELOPER AGENT)

Untuk menuntaskan seluruh Acceptance Criteria pada R2.1 & R2.2, berikut adalah rencana arsitektur perbaikan yang terperinci dan siap diimplementasikan:

### Rekomendasi 1: Implementasi Jaringan Navigasi Berbasis Graf Koridor (Highway Network)
Gantikan penyambungan langsung `esc0 -> pl.spoke[0]` dengan topologi graf koridor sederhana namun terstruktur:
1. Dua Koridor Horizontal (Highways):
   - Koridor Belakang (Area Kerja & Meja Row A, Pantry): `Z = -2.1`
   - Koridor Depan (Area Lounge, Rapat, Hiburan): `Z = 0.5`
2. Lorong Penghubung Vertikal (Aisles / Chutes):
   - Lorong Barat: `X = -8.6` (Akses ke Bookshelf & Ruang Rapat Barat)
   - Lorong Tengah-Kiri: `X = -5.6` (Akses antara Meja B0 dan B1 ke Ruang Rapat)
   - Lorong Tengah-Kanan: `X = -2.8` (Akses antara Meja B1 dan B2)
   - Lorong Timur Utama: `X = 3.2` (Akses terbuka bebas antara Deretan Meja Kerja dan Area Lounge)
3. Algoritma Pembuatan Rute `buildPath(fromPos, toPlace)`:
   - Mundur keluar dari posisi duduk/spot ke koridor terdekat (belakang atau depan).
   - Jika lokasi asal dan tujuan berada di zona Z yang berbeda, agen berpindah melalui salah satu Lorong Vertikal terdekat (misal `X = 3.2` untuk menuju Lounge).
   - Meluncur di sepanjang koridor menuju spoke tempat tujuan, lalu masuk ke spot.
   - Hal ini 100% mencegah agen berjalan diagonal memotong meja dan perabot.

### Rekomendasi 2: Koreksi Susunan Waypoint Spot `tv` dan `ps`
Ubah urutan spoke pada `SPOTS.tv` dan `SPOTS.ps` dari luar ke dalam:
- `tv`: `spoke: [V(5.5, 0.5), V(6.2, 0.5)]`, `pos: V(6.2, 1.35)`
- `ps`: `spoke: [V(5.5, 0.5), V(7.4, 0.5)]`, `pos: V(7.4, 1.35)`
Dengan urutan ini, agen akan berjalan dari lorong masuk (`X: 5.5`), bergerak ke depan posisi duduk (`X: 6.2` atau `7.4`), lalu duduk ke sofa. Pergerakan menjadi bersih tanpa osilasi.

### Rekomendasi 3: Penjadwalan Waktu Santai Setelah Tiba (`arrive`)
Pindahkan kalkulasi durasi santai dari saat pemanggilan `lounge()` ke fungsi `arrive()`:
- Di `goTo()`: Hapus penetapan `a.spotUntil`.
- Di `arrive()`: Tambahkan `a.spotUntil = performance.now() + (REDUCED ? 90000 : 38000 + Math.random() * 34000);` khusus untuk spot santai.
- Hal ini menjamin setiap agen selalu menikmati waktu santai minimal 38-72 detik di spot tujuan sebelum memutuskan berpindah ke tempat lain, mengeliminasi siklus marathon navigasi tanpa henti.

### Rekomendasi 4: Penghalusan Lokomosi & Eliminasi Strafing
Pada `updateActor`:
1. Pengaturan Kecepatan Berdasarkan Sudut Arah:
   Hitung perbedaan sudut antara orientasi agen saat ini `a.heading` dan target orientasi `targetHeading`:
   `const angleDiff = Math.abs(Math.atan2(Math.sin(targetHeading - a.heading), Math.cos(targetHeading - a.heading)));`
   Kurangi laju translasi ketika badan agen belum menghadap ke arah jalan:
   `const speedFactor = Math.max(0.2, Math.cos(angleDiff));`
   `const step = Math.min(horizDist, 1.8 * dt * speedFactor);`
   Hal ini membuat agen berbelok secara wajar sebelum melangkah maju, menghilangkan efek meluncur menyamping (strafing kaku).
2. Snapping Posisi Saat `arrive`:
   Pada saat mencapai waypoint terakhir dan memanggil `arrive(a)`, set koordinat `root.position.x = pl.pos.x` dan `root.position.z = pl.pos.z` secara presisi untuk membersihkan akumulasi galat floating-point.

### Rekomendasi 5: Pencegahan Tabrakan Koridor & Anti-Stacking
1. Lane Offset Berdasarkan Arah Berjalan di Koridor:
   Beri sedikit offset pada sumbu Z di koridor berdasarkan arah pergerakan X:
   Jika agen berjalan ke arah timur (`dx > 0`), gunakan `Z = CORRIDOR_Z - 0.15`.
   Jika agen berjalan ke arah barat (`dx < 0`), gunakan `Z = CORRIDOR_Z + 0.15`.
   Hal ini secara otomatis memisahkan dua agen yang berpapasan di koridor menjadi dua jalur (kiri-kanan) tanpa tabrakan.
2. Desinkronisasi Waktu Spawn Freelancer:
   Tambahkan offset acak kecil (misal `dx = index * 0.3`) pada titik awal masuk pintu agar beberapa freelancer tidak menempati satu titik geometris yang sama.

### Rekomendasi 6: Penyelarasan Status Cooldown Meja Kerja
Di `kantor.js`, perbaiki kondisi kerja tim:
```javascript
const working = m.state === 'bekerja' || m.state === 'selesai';
```
Atau jika `m.state === 'selesai'`, agen tetap duduk di mejanya dengan pose `seatedPose('done')` atau `'rest'` hingga durasi cooldown 120 detik selesai dan backend mengubah statusnya menjadi `'santai'`. Hal ini selaras sempurna dengan arsitektur backend di `office.mjs`.

### Rekomendasi 7: Penghalusan Transisi Berdiri-Duduk
Saat berdiri dari kursi, jangan langsung mengaktifkan `walkPose` dengan panggul menekuk. Berikan waktu transisi berdiri singkat (0.2-0.3 detik) di mana pose kembali tegak sebelum koordinat translasi mulai melangkah. Hal ini mencegah karakter meluncur sambil berjongkok.

---

## 8. KESIMPULAN

Seluruh akar permasalahan pergerakan, jalan menembus meja, karakter stuck, siklus navigasi marathon, dan kekakuan pose telah teridentifikasi dengan presisi matematis dan referensi kode sumber yang lengkap. Solusi perbaikan yang direkomendasikan tidak membutuhkan penulisan ulang Three.js secara masif, melainkan perbaikan terarah pada logika graf waypoint koridor, sinkronisasi state cooldown, dan kalkulasi lokomosi pada `kantor.js`.

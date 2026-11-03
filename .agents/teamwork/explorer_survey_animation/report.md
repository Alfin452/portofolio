# Laporan Investigasi Mendalam: Sistem Animasi & Variasi Pose Dinamis Sesuai Aktivitas Kerja dan Santai (R2.3)

Tanggal Investigasi: 2026-11-02  
Fokus Modul: Visualizer 3D Kantor Agent (`kantor.js`) dan Runtime Backend (`office.mjs`)  
Target File Utama:
- `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js`
- `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\lib\node\office.mjs`
- `c:\laragon\www\portofolio\.claude\kantor-agent.json`
- `c:\laragon\www\portofolio\kantor-activity.json`

---

## 1. Eksekutif Ringkasan (Executive Summary)

Penyelidikan mendalam terhadap arsitektur visualizer 3D (`kantor.js`) dan runtime penghasil state (`office.mjs`) menemukan akar permasalahan fundamental terkait kekakuan gerak (*stiffness*), kedutan posisi (*jitter/snap glitch*), dan kurangnya dinamika pose agent:

1. **Akar Penyebab Glitch dan Kedutan Transisi**: Terjadi karena ketiadaan fase transisi intermediat (*transient state machine*) saat berpindah status dari berjalan (`walking`) ke duduk (`seated`). Saat agent tiba di meja, `pl.desk.seat.attach(a.p.root)` langsung dieksekusi bersamaan dengan `position.set(0, 0, 0.02)`, memaksa koordinat melompat seketika (*instant spatial snap*), sementara pose tubuh masih berada di posisi berdiri (`hipsY = 0.9`). Sebaliknya, saat bangkit dari kursi, agent langsung bergerak maju melintasi lantai sebelum tubuh sempat berdiri tegak, sehingga agent tampak meluncur/berseluncur di lantai dalam pose duduk bersila (*sliding on butt*).
2. **Kekakuan Kinematika Berjalan dan Bekerja**:
   - Fungsi `walkPose` hanya mengayunkan sendi pinggul dan bahu pada sumbu X dengan siku beku (`lElX: -0.25`), tanpa rotasi berlawanan arah pada tulang punggung (*torso counter-rotation / yaw*), tanpa ayunan panggul lateral (*pelvic sway*), dan tanpa fleksi siku dinamis.
   - Pengecekan tool pada `workMode(a)` hanya mengenali nama alat Claude Code berformat PascalCase (`Bash`, `Read`, `Grep`), sehingga seluruh eksekusi alat Antigravity (`run_command`, `view_file`, `grep_search`, `write_to_file`, `replace_file_content`) gagal dicocokkan dan jatuh ke fallback `type` secara seragam.
3. **Formulasi Interpolasi Euler Asimptotik yang Sensitif Frame-Rate**: `lerpK(cur, target, dt * 7)` bukan peredaman eksponensial matematis yang invarian terhadap frame-rate. Saat terjadi fluktuasi `dt` (misal pergantian tab browser), `dt * 7` melompat ke nilai saturasi (`1.0`), memicu sentakan rotasi mendadak.
4. **Kebutuhan Variasi Pose**: Lingkungan kerja 3D (`kantor.js`) telah memiliki objek interaktif di meja (keyboard pada X=-0.25, mouse pada X=0.20, monitor sekunder pada X=0.68, berkas dokumen pada X=-0.85) serta area rekreasi (sofa, arcade, foosball, coffee station, meeting table). Namun, seluruh pose saat ini belum diarahkan ke posisi objek-objek tersebut secara presisi.

---

## 2. Analisis Struktur 3D Model Agent (Three.js Hierarchy)

Model humanoid dirakit secara prosedural melalui fungsi `buildPerson(cfg, key)` pada baris 1020-1199 `kantor.js`. Struktur hierarki sendi (*joint tree*) dan komponen pendukung adalah sebagai berikut:

```text
root (THREE.Group) [Ditempatkan di scene atau di-attach ke seat kursi meja]
└── hips (THREE.Group, position.y = 0.9 untuk berdiri, 0.505 untuk duduk)
    ├── Mesh Panggul / Celana (Capsule / Box)
    ├── spine (THREE.Group, position.y = 0.06)
    │   ├── Mesh Torso / Baju (CapsuleGeometry 0.16, 0.26, scale: 1.14, 1, 0.74)
    │   ├── Kerah Baju / Hood Jaket
    │   ├── Dasi (opsional) & Tas Punggung (opsional)
    │   ├── Leher (CylinderGeometry, position.y = 0.53)
    │   ├── head (THREE.Group, position.y = 0.67 pada spine)
    │   │   ├── Tengkorak Kepala (SphereGeometry R=0.128, scale: 1, 1.1, 1.02)
    │   │   ├── Mata, Alis, Telinga, Hidung, Mulut
    │   │   ├── Rambut (Gaya: short, side, curly, bun, long)
    │   │   ├── Kacamata (opsional) & Headphone (opsional)
    │   ├── sh[0] / Shoulder Kiri (THREE.Group, position: (-0.2, 0.44, 0))
    │   │   ├── Lengan Atas (CapsuleGeometry 0.05, 0.19, position.y = -0.14)
    │   │   └── el[0] / Elbow Kiri (THREE.Group, position.y = -0.29)
    │   │       ├── Lengan Bawah (CapsuleGeometry 0.043, 0.17, position.y = -0.12)
    │   │       └── hand[0] / Telapak Tangan Kiri (SphereGeometry, position.y = -0.26)
    │   ├── sh[1] / Shoulder Kanan (THREE.Group, position: (0.2, 0.44, 0))
    │   │   ├── Lengan Atas (CapsuleGeometry 0.05, 0.19, position.y = -0.14)
    │   │   └── el[1] / Elbow Kanan (THREE.Group, position.y = -0.29)
    │   │       ├── Lengan Bawah (CapsuleGeometry 0.043, 0.17, position.y = -0.12)
    │   │       └── hand[1] / Telapak Tangan Kanan (SphereGeometry, position.y = -0.26)
    │   │           └── mug (Mesh Cangkir Kopi, bila a.holding === 'mug')
    │   ├── guitar (Mesh Gitar Akustik, visible bila spot === 'guitar')
    │   ├── pad (Mesh Stik Gamepad, visible bila spot === 'ps')
    │   └── book (Mesh Buku, visible bila spot === 'bookshelf')
    ├── hip[0] / Hip Joint Kiri (THREE.Group, position: (-0.095, -0.03, 0))
    │   ├── Paha Kiri (CapsuleGeometry 0.068, 0.26, position.y = -0.2)
    │   └── kn[0] / Knee Joint Kiri (THREE.Group, position.y = -0.41)
    │       ├── Betis Kiri (CapsuleGeometry 0.058, 0.27, position.y = -0.18)
    │       └── foot[0] / Sepatu Kiri (BoxGeometry, position: (0, -0.4, 0.05))
    └── hip[1] / Hip Joint Kanan (THREE.Group, position: (0.095, -0.03, 0))
        ├── Paha Kanan (CapsuleGeometry 0.068, 0.26, position.y = -0.2)
        └── kn[1] / Knee Joint Kanan (THREE.Group, position.y = -0.41)
            ├── Betis Kanan (CapsuleGeometry 0.058, 0.27, position.y = -0.18)
            └── foot[1] / Sepatu Kanan (BoxGeometry, position: (0, -0.4, 0.05))
```

### Aksesori Scene dan Label HTML:
- Label nama dan status agent menggunakan `CSS2DObject` yang ditempatkan di atas kepala:
  `a.label.position.set(tmpV.x, tmpV.y + 0.42, tmpV.z)` (baris 2372).

---

## 3. Investigasi Fungsi Animasi Saat Ini & Akar Masalah Glitch / Kedutan

### 3.1. Mekanisme Animasi Saat Ini
Penerapan rotasi sendi dilakukan di dalam `applyPose(p, T, dt)` pada baris 1201-1219:
```javascript
const lerpK = (a, b, k) => a + (b - a) * k;
function applyPose(p, T, dt) {
  const k = REDUCED ? 1 : Math.min(1, dt * 7);
  p.spine.rotation.x = lerpK(p.spine.rotation.x, T.spineX ?? 0, k);
  p.spine.rotation.z = lerpK(p.spine.rotation.z, T.spineZ ?? 0, k);
  p.head.rotation.x = lerpK(p.head.rotation.x, (T.headX ?? 0) + p.nod, Math.min(1, k * 1.4));
  p.head.rotation.y = lerpK(p.head.rotation.y, T.headY ?? 0, k);
  p.head.rotation.z = lerpK(p.head.rotation.z, T.headZ ?? 0, k);
  const side = ['l', 'r'];
  for (let i = 0; i < 2; i++) {
    const s = side[i];
    p.sh[i].rotation.x = lerpK(p.sh[i].rotation.x, T[`${s}ShX`] ?? 0, k);
    p.sh[i].rotation.z = lerpK(p.sh[i].rotation.z, T[`${s}ShZ`] ?? (i ? -0.08 : 0.08), k);
    p.el[i].rotation.x = lerpK(p.el[i].rotation.x, T[`${s}ElX`] ?? 0, k);
    p.el[i].rotation.z = lerpK(p.el[i].rotation.z, T[`${s}ElZ`] ?? 0, k);
    p.hip[i].rotation.x = lerpK(p.hip[i].rotation.x, T[`${s}HipX`] ?? 0, Math.min(1, k * 1.5));
    p.knee[i].rotation.x = lerpK(p.knee[i].rotation.x, T[`${s}KneeX`] ?? 0, Math.min(1, k * 1.5));
  }
  p.hips.position.y = lerpK(p.hips.position.y, T.hipsY ?? p.hips.position.y, k);
}
```

### 3.2. Lima Akar Masalah Utama (Root Causes)

#### Akar Masalah 1: Re-parenting & Coordinate Snap Seketika (`arrive` vs `goTo`)
- Pada baris 1569-1575 (`arrive`):
  ```javascript
  if (pl.kind === 'desk') {
    pl.desk.seat.rotation.y = Math.PI;
    pl.desk.seat.attach(a.p.root);
    a.p.root.position.set(0, 0, 0.02);
    a.p.root.rotation.set(0, 0, 0);
    a.seated = true;
  }
  ```
  `attach` menjaga transformasi dunia, tetapi baris berikutnya langsung menimpa posisi lokal ke `(0, 0, 0.02)`. Padahal, pada frame tersebut tinggi pinggul (`p.hips.position.y`) masih `0.9` (ketinggian berdiri). Akibatnya, agent seketika berada di dalam kursi dalam kondisi berdiri, lalu melorot ke bawah selama 0.5 detik hingga mencapai `0.505`.
- Pada baris 1549-1554 (`goTo`):
  ```javascript
  if (a.seated) {
    scene.attach(a.p.root);
    a.p.root.rotation.set(0, a.p.root.rotation.y, 0);
    a.heading = a.p.root.rotation.y;
    a.seated = false;
  }
  ```
  Saat agent ditugaskan pergi, `a.seated` langsung disetel `false` dan `a.walking = true` (baris 1562). Pada frame loop berikutnya (baris 2339-2341), posisi X dan Z langsung ditambahkan pergerakan langkah (`root.position.x += ...`). Namun, kaki agent masih terlipat pada `-1.5` rad dan panggul masih berada di ketinggian `0.505` (posisi duduk). Agent tampak "berseluncur di lantai dengan lutut terlipat" menuju waypoint pertama.

#### Akar Masalah 2: Pemutusan Fase Ayunan Kaki Tanpa Transisi Pulih (`walkPose` Cut-off)
- `walkPose` digerakkan oleh `sw = Math.sin(a.phase)` (baris 1583).
- Ketika agent sampai di tujuan, `a.walking = false` seketika mematikan kemajuan fase (`a.phase += dt * 8` berhenti).
- Jika pada saat berhenti `sw = 0.9` (satu kaki maju penuh dan satu kaki mundur penuh), target sendi langsung beralih ke `spotPose` atau `SEATED` (kaki 0.0 rad atau -1.5 rad). Ini menghasilkan hentakan mendadak (*abrupt jerk*) saat kedua kaki meluruskan diri secara tergesa-gesa.

#### Akar Masalah 3: Formulasi Interpolasi Euler Asimptotik yang Tidak Tahan Fluktuasi Frame-Rate
- Ekspresi `k = Math.min(1, dt * 7)` adalah pendekatan linear dari fungsi peluruhan eksponensial.
- Jika refresh rate layar 60 fps (`dt ≈ 0.016s`), maka `k ≈ 0.116`.
- Jika terjadi lag atau browser beralih tab (`dt > 0.142s`), nilai `dt * 7` melampaui `1.0` sehingga terpotong menjadi `1.0`. Pada kondisi ini, interpolasi hilang total dan terjadi lompatan seketika (*instant jump*).
- Formulasi peredaman eksponensial kontinu sejati yang mathematically correct adalah:
  $$k = 1.0 - \exp(-\lambda \cdot \Delta t)$$
  di mana $\lambda$ adalah koefisien ketahanan redaman (*stiffness damping rate*).

#### Akar Masalah 4: Kekakuan Kinematika Berjalan (Limb Kinematics Rigidity)
- Dalam `walkPose`:
  * Lengan kiri dan kanan hanya berayun pada sumbu pitch X (`lShX: -sw * 0.35`, `rShX: sw * 0.35`). Siku sama sekali tidak ditekuk (`lElX: -0.25` konstan).
  * Tulang belakang (`spine`) terkunci kaku pada `spineX: 0.04`, tanpa rotasi yaw (tulang bahu tidak berlawanan arah dengan panggul). Pada gerak manusia normal (*locomotion biomechanics*), bahu berotasi berlawanan dengan panggul sebesar ±3-5 derajat (±0.05 - 0.08 rad) untuk mempertahankan momentum angular.
  * Panggul hanya naik-turun (`hipsY = 0.9 + abs(cos(phase)) * 0.03`) tanpa kemiringan lateral (*pelvic roll / tilt*), membuat karakter terlihat seperti robot atau boneka kayu.

#### Akar Masalah 5: Glitch Step Function pada Pose Minum Pantry
- Pada baris 1611:
  `const sip = st % 6 < 1.8;`
  Digunakan percabangan ternary: `headX: sip ? -0.15 : 0.05`, `rShX: sip ? -1.05 : -0.55`, `rElX: sip ? -2.05 : -1.35`.
  Pernyataan boolean ini merupakan *step function* diskontinu. Setiap interval 6 detik, nilai target melompat tajam antara pose mengangkat gelas dan pose menurunkan gelas, menyebabkan gerakan tangan berkedut tanpa kurva angkat-turun yang mulus.

---

## 4. Evaluasi Backend State (`office.mjs` & Aktivitas)

### 4.1. Data yang Disediakan Backend
Dari pemeriksaan `office.mjs` (baris 21-170 dan 265-314), data aktivitas yang dikirimkan via endpoint `/kerja/api/state` mencakup:

| Bidang Data | Tipe / Contoh | Peran dalam Visualizer |
|---|---|---|
| `ketua.state` | `'bekerja'`, `'santai'`, `'selesai'` | Menentukan apakah Ketua duduk di meja A0 atau di lounge |
| `ketua.last[0]` | `{ t, kind, text, tool }` | Aksi terakhir Ketua (misal `tool: 'Agent'`) |
| `ketua.todos` | `{ items: [...], at, source }` | Daftar tugas di papan tulis |
| `team[i].state` | `'bekerja'`, `'santai'`, `'selesai'` | Menentukan apakah anggota tim menuju meja atau lounge |
| `team[i].run` | `{ id, task, status, last, files, tools }` | Detail tugas aktif anggota tim |
| `team[i].run.last[0]` | `{ t, kind: 'tool', text, tool }` | Alat terakhir yang dijalankan (misal `tool: 'run_command'`) |
| `freelancers` | Daftar freelancer dinamis bila meja tim penuh | Masuk dari pintu (`door`) dan menempati meja cadangan B0-B3 |

### 4.2. Temuan Anomali: Mapping Tool Antigravity Tidak Terbaca
Pada baris 1641-1647 `kantor.js`:
```javascript
const e = (a.kind === 'ketua' ? d.last : d.run?.last)?.[0];
if (!e) return 'type';
if (e.kind === 'text') return 'think';
if (['Read', 'Grep', 'Glob', 'WebFetch', 'WebSearch'].includes(e.tool)) return 'read';
if (e.tool === 'Bash') return 'terminal';
if (['Agent', 'Task', 'SendMessage', 'AskUserQuestion', 'TodoWrite'].includes(e.tool)) return 'think';
return 'type';
```
Backend `office.mjs` memindai log Antigravity dan mengisi `e.tool` dengan nama fungsi aktual seperti:
`run_command`, `view_file`, `grep_search`, `write_to_file`, `replace_file_content`, `send_message`.
Karena pemetaan di atas hanya mencocokkan format PascalCase Claude Code, nama alat seperti `run_command` tidak cocok dengan `'Bash'`, `view_file` tidak cocok dengan `'Read'`, dan `send_message` tidak cocok dengan `'SendMessage'`.
Dampaknya: **100% aktivitas kerja Antigravity jatuh ke pose default `type`**, menghilangkan seluruh variasi visual bekerja di meja.

---

## 5. Rancangan Matematis & Kinematika Pose Dinamis (Three.js Rotation Design)

Berikut adalah spesifikasi matematis rotasi Euler (radian) dan translasi sendi untuk setiap aktivitas kerja dan santai yang presisi dan selaras dengan geometri ruangan.

### 5.1. Pose Aktivitas Meja Kerja (`seatedPose`)

Koordinat acuan meja kerja:
- Posisi Permukaan Meja: `Y = 0.74`
- Keyboard: `X = -0.25, Z = 0.30, Y = 0.775`
- Mouse: `X = 0.20, Z = 0.30, Y = 0.780`
- Tumpukan Berkas Dokumen: `X = -0.85, Z = 0.15, Y = 0.775`
- Monitor Utama: `X = -0.30, Z = -0.25, Y = 1.26`
- Monitor Samping (miring -0.35 rad): `X = 0.68, Z = -0.18, Y = 1.22`

#### 1. Mengetik di Keyboard (`mode = 'type'`)
Kedua tangan bertumpu di area keyboard (-0.25, 0.30) dengan mikromosi ketikan bergantian:
- `spineX: 0.10` (condong ke depan ke arah keyboard)
- `spineY: 0.0`
- `headX: 0.14 + Math.sin(t * 1.5 + seed) * 0.02` (mata menatap ke keyboard dan layar)
- `headY: -0.05`
- `lShX: -0.60, lShZ: 0.18, lElX: -1.02 + Math.sin(t * 14 + seed) * 0.05` (tangan kiri mengetik)
- `rShX: -0.62, rShZ: -0.15, rElX: -0.98 - Math.sin(t * 14 + seed) * 0.05` (tangan kanan mengetik)

#### 2. Memegang Mouse & Navigasi Layar (`mode = 'mouse'`)
Tangan kanan memegang mouse pada koordinat X=0.20, sementara tangan kiri rileks di tepi keyboard/meja:
- `spineX: 0.08, spineZ: -0.02` (sedikit condong ke arah kanan/mouse)
- `headX: 0.04, headY: -0.06` (fokus ke layar monitor utama)
- `lShX: -0.42, lShZ: 0.24, lElX: -0.82` (tangan kiri rileks bertumpu di meja)
- `rShX: -0.52 + Math.sin(t * 2.8 + seed) * 0.03` (lengan kanan bergerak mikro menggeser mouse)
- `rShZ: -0.08`
- `rElX: -0.92 + Math.cos(t * 2.8 + seed) * 0.03`

#### 3. Fokus Layar & Inspeksi Dual-Monitor (`mode = 'focus_screen'`)
Agent berkonsentrasi membaca hasil terminal atau kode, sesekali melirik monitor sekunder di sebelah kanan:
- Parameter siklus lirik: `const glance = Math.sin(t * 0.7 + seed) > 0.6;`
- `spineX: 0.14` (condong mendekat ke monitor)
- `spineY: glance ? 0.12 : 0.0`
- `headX: 0.02`
- `headY: glance ? 0.35 : -0.08` (melirik ke monitor samping X=0.68)
- `lShX: -0.45, lShZ: 0.20, lElX: -0.90` (tangan kiri di meja)
- `rShX: -1.18, rShZ: -0.26, rElX: -2.10` (tangan kanan menopang dagu/pipi sambil berpikir)

#### 4. Membaca Dokumen Fisik / Spesifikasi (`mode = 'read_doc'`)
Agent menoleh ke arah kiri bawah tempat dokumen bertumpuk pada X=-0.85:
- `spineX: 0.14, spineY: -0.18, spineZ: 0.04` (tubuh memutar ke kiri menghadap berkas)
- `headX: 0.26, headY: -0.32` (kepala menunduk menatap lembar kertas)
- `lShX: -0.70, lShZ: 0.36, lElX: -0.85` (tangan kiri menunjuk/memegang tepi dokumen)
- `rShX: -0.40, rShZ: -0.10, rElX: -0.95` (tangan kanan rileks di atas meja)

---

### 5.2. Pose Area Santai & Rekreasi (`spotPose`)

#### 1. Area Santai: Sofa TV (`spot = 'tv'` / `'sofa'`)
Menghilangkan kesan kaku duduk tegak di sofa:
- Sandaran rileks santai:
  * `hipsY: 0.515`
  * `spineX: -0.18` (bersandar nyaman ke bantalan sofa)
  * `headX: -0.06` (kepala tegak menghadap layar TV)
  * `headY: Math.sin(t * 0.4 + seed) * 0.10`
  * Lengan kanan bersandar di atas sandaran punggung sofa:
    `rShX: -0.22, rShZ: 1.10, rElX: -0.45`
  * Lengan kiri bertumpu di paha:
    `lShX: -0.36, lShZ: 0.28, lElX: -1.08`
  * Posisi kaki rileks santai:
    `lHipX: -1.42, rHipX: -1.52, lKneeX: 1.38, rKneeX: 1.28`

#### 2. Area Rekreasi: Mesin Arcade (`spot = 'arcade'`)
Tangan kiri memegang joystick dengan gerakan melingkar/arah, tangan kanan mengetuk tombol aksi:
- Posisi berdiri: `hipsY: 0.90`
- `spineX: 0.15` (condong ke arah layar arcade)
- `headX: 0.16` (menatap layar arcade)
- Joystick tangan kiri (lingkaran mikro):
  * `lShX: -0.72 + Math.sin(t * 6.0) * 0.05`
  * `lShZ: 0.18 + Math.cos(t * 6.0) * 0.05`
  * `lElX: -1.18`
- Tombol tangan kanan (ketukan cepat):
  * `rShX: -0.82`
  * `rShZ: -0.14`
  * `rElX: -1.22 + (Math.sin(t * 14.0) > 0.25 ? 0.10 : 0.0)`
- Kaki: tumpuan kaki seimbang `lHipX: 0.06, rHipX: -0.06`

#### 3. Area Rekreasi: Meja Foosball (`spot = 'foosball1'` / `'foosball2'`)
Kedua tangan memegang dua batang pegangan (*handles*) foosball yang terpisah:
- Posisi berdiri: `hipsY: 0.90`
- `spineX: 0.24` (membungkuk di atas meja foosball)
- `spineZ: Math.sin(t * 4.0) * 0.05` (tubuh bergeser kiri-kanan mengikuti bola)
- `headX: 0.34` (kepala menunduk melihat lapangan bola foosball)
- Handle 1 (tangan kiri - dorong/tarik rod):
  * `lShX: -0.72 + Math.sin(t * 7.5 + seed) * 0.14`
  * `lShZ: 0.28`
  * `lElX: -0.96`
- Handle 2 (tangan kanan - putar & geser rod):
  * `rShX: -0.76 + Math.cos(t * 8.5 + seed) * 0.16`
  * `rShZ: -0.28`
  * `rElX: -0.96`

#### 4. Area Pantry: Minum Kopi / Air (`spot = 'coffee'` / `'water'`)
Menggantikan percabangan ternary diskontinu dengan kurva periodik harmonis kontinu (periode 8.0 detik):
```javascript
const cycle = (st % 8.0) / 8.0; // 0.0 hingga 1.0
// Tahap: 0.0-0.35 Pegang cangkir di dada, 0.35-0.50 Angkat ke mulut, 0.50-0.65 Menyeruput, 0.65-0.80 Turunkan, 0.80-1.0 Bernapas/santai
let sipFactor = 0.0;
if (cycle >= 0.35 && cycle < 0.50) {
  const p = (cycle - 0.35) / 0.15;
  sipFactor = p * p * (3 - 2 * p); // smoothstep naik
} else if (cycle >= 0.50 && cycle < 0.65) {
  sipFactor = 1.0;
} else if (cycle >= 0.65 && cycle < 0.80) {
  const p = (cycle - 0.65) / 0.15;
  sipFactor = 1.0 - p * p * (3 - 2 * p); // smoothstep turun
}

const rShX = -0.55 + sipFactor * (-0.50); // dari -0.55 ke -1.05
const rElX = -1.35 + sipFactor * (-0.75); // dari -1.35 ke -2.10
const rShZ = -0.15 + sipFactor * (-0.20); // dari -0.15 ke -0.35
const headX = (1.0 - sipFactor) * 0.02 + sipFactor * (-0.18); // kepala mendongak saat minum
const headY = (1.0 - sipFactor) * Math.sin(t * 0.8) * 0.35; // menoleh santai saat tidak minum
```
Hasil: Tangan mengangkat cangkir dan meminum kopi dengan kurva mulus tanpa sentakan.

#### 5. Area Diskusi / Meeting (`spot = 'meet1'` / `'meet2'` / `'meet3'`)
Dua peran percakapan bergantian: **Mendengarkan (Listening)** dan **Berbicara (Speaking)**:
- Pembagian peran berdasarkan waktu dan seed: `const isSpeaking = Math.sin(t * 0.25 + a.seed) > 0.1;`
- **Saat Mendengarkan**:
  * `spineX: 0.08` (sikap mendengarkan atentif)
  * `headX: 0.06 + Math.max(0, Math.sin(t * 3.0 + a.seed)) * 0.12` (anggukan setuju berkala)
  * `headY: Math.sin(t * 0.6 + a.seed) * 0.22` (pandangan menatap ke pembicara lain)
  * `lShX: -0.50, lShZ: 0.20, lElX: -0.85`
  * `rShX: -0.50, rShZ: -0.20, rElX: -0.85` (kedua tangan terlipat di atas meja)
- **Saat Berbicara**:
  * `spineX: 0.12 + Math.sin(t * 2.2) * 0.03`
  * `headX: 0.08 + Math.sin(t * 3.2) * 0.08`
  * Gestur tangan kanan menjelaskan poin diskusi:
    `rShX: -0.75 + Math.sin(t * 3.2) * 0.15`
    `rShZ: -0.25 + Math.cos(t * 2.1) * 0.12`
    `rElX: -1.25 + Math.sin(t * 3.2) * 0.20`
  * Tangan kiri menopang di meja:
    `lShX: -0.45, lShZ: 0.18, lElX: -0.80`

---

## 6. Arsitektur Interpolasi Pose & State Machine Transisi (Transition Engine)

### 6.1. State Machine Gerakan dengan Status Intermediat
Ketiadaan transisi intermediat adalah penyebab utama glitch duduk/berdiri. Sistem harus memperluas status agent dari sekadar boolean biner (`walking: true/false`, `seated: true/false`) menjadi state machine eksplisit:

```text
[STATE_IDLE_STAND] ──(perintah jalan)──> [STATE_WALKING]
       ▲                                       │
       │ (selesai berdiri)             (tiba di kursi)
       │                                       ▼
[STATE_STANDING_UP]                    [STATE_SITTING_DOWN]
       ▲                                       │
       │ (perintah beranjak)            (selesai duduk)
       │                                       ▼
       └──────────────────────────────── [STATE_SEATED]
```

### 6.2. Logika Duduk Mulus (`STATE_SITTING_DOWN`)
1. Ketika agent mencapai waypoint terakhir di depan kursi, jangan langsung panggil `attach` dan jangan langsung menimpa koordinat lokal ke `(0, 0, 0.02)`.
2. Aktifkan `a.transState = 'sitting'`, `a.transTime = 0.0`, durasi `DUR_SIT = 0.65` detik.
3. Selama `a.transTime < DUR_SIT`:
   - `alpha = a.transTime / DUR_SIT`
   - Hitung kurva pelunakan quintic:
     $$s = \alpha^3 \cdot (\alpha \cdot (6\alpha - 15) + 10)$$
   - Koordinat dunia panggul (`hips.position.y`) bergeser mulus dari `0.90` ke `0.505`.
   - Rotasi paha dan lutut bergeser mulus dari `(0, 0)` ke `(-1.50, 1.45)`.
4. Setelah `a.transTime >= DUR_SIT`:
   - Lakukan `pl.desk.seat.attach(a.p.root)`.
   - Setel `a.seated = true`, `a.transState = null`.

### 6.3. Logika Berdiri Mulus (`STATE_STANDING_UP`)
1. Ketika `goTo(a, target)` dipanggil saat `a.seated === true`:
   - Lakukan `scene.attach(a.p.root)` untuk memindahkan parent kembali ke scene dengan mempertahankan koordinat dunia eksak.
   - Aktifkan `a.transState = 'standing'`, `a.transTime = 0.0`, durasi `DUR_STAND = 0.55` detik.
   - Tahan pergerakan translasi lintasan (`step = 0`).
2. Selama `a.transTime < DUR_STAND`:
   - `alpha = a.transTime / DUR_STAND`
   - $$s = \alpha^3 \cdot (\alpha \cdot (6\alpha - 15) + 10)$$
   - `hips.position.y` naik dari `0.505` ke `0.90`.
   - Rotasi paha dan lutut kembali dari `(-1.50, 1.45)` ke `(0, 0)`.
3. Setelah `a.transTime >= DUR_STAND`:
   - Setel `a.seated = false`, `a.transState = null`.
   - Aktifkan `a.walking = true` dan mulailah melangkah menyusuri waypoint.
   - **Hasil**: Agent berdiri tegak terlebih dahulu di samping kursi, baru kemudian melangkah maju. Tidak ada lagi gerakan meluncur di lantai dalam pose duduk.

### 6.4. Formulasi Peredaman Eksponensial Kontinu (Frame-Rate Invariant)
Gantikan `lerpK` linear dengan fungsi redaman matematis:
```javascript
function dampK(cur, target, lambda, dt) {
  const k = 1.0 - Math.exp(-lambda * dt);
  return cur + (target - cur) * k;
}
```
Untuk sudut rotasi tunggal (menghindari putaran 360 derajat):
```javascript
function dampAngle(cur, target, lambda, dt) {
  const diff = Math.atan2(Math.sin(target - cur), Math.cos(target - cur));
  const k = 1.0 - Math.exp(-lambda * dt);
  return cur + diff * k;
}
```
Koefisien yang direkomendasikan:
- Tulang belakang (`spine`): $\lambda = 8.0\,\text{s}^{-1}$
- Kepala (`head`): $\lambda = 10.0\,\text{s}^{-1}$
- Bahu & siku (`shoulder`, `elbow`): $\lambda = 9.0\,\text{s}^{-1}$
- Paha & lutut (`hip`, `knee`): $\lambda = 12.0\,\text{s}^{-1}$
- Ketinggian panggul (`hips.position.y`): $\lambda = 10.0\,\text{s}^{-1}$

---

## 7. Rekomendasi Perbaikan Kode Sumber (Actionable Recommendations)

Berikut adalah daftar perbaikan konkret yang direkomendasikan untuk implementer:

1. **Pemutakhiran `workMode(a)` di `kantor.js`**:
   Tambahkan pencocokan nama alat Antigravity (case-insensitive) dan perluas variasi mode:
   - Tool `run_command`, `Bash`, `terminal`, `exec` $\rightarrow$ mode `'terminal'`
   - Tool `view_file`, `Read`, `read_url_content`, `read` $\rightarrow$ mode `'read'` / `'focus_screen'`
   - Tool `grep_search`, `Grep`, `find_by_name`, `Glob`, `list_dir`, `search_web` $\rightarrow$ mode `'focus_screen'`
   - Tool `write_to_file`, `replace_file_content`, `Write`, `Edit` $\rightarrow$ mode `'type'`
   - Tool `generate_image`, `canvas` $\rightarrow$ mode `'mouse'`
   - Tool `Agent`, `Task`, `manage_task`, `send_message`, `schedule` $\rightarrow$ mode `'think'`
2. **Implementasi State Machine Duduk/Berdiri**:
   Tambahkan penanganan `a.transState` pada fungsi `updateActor`, `goTo`, dan `arrive`.
3. **Peningkatan Biomekanika `walkPose`**:
   Tambahkan yaw counter-rotation pada `spine`:
   `spineY: -Math.sin(a.phase) * 0.06`
   Tambahkan fleksi siku dinamis saat melangkah:
   `lElX: -0.25 - Math.max(0, -sw) * 0.35`
   `rElX: -0.25 - Math.max(0, sw) * 0.35`
4. **Pembersihan Emoji pada Kode Web**:
   Hapus emoji pada string `QUIPS` (baris 1389-1398) dan `CHAT` (baris 1402-1420) di `kantor.js` sesuai Aturan Mutlak Desain Workspace (*NO EMOJIS IN WEB INTERFACES*).

---

## 8. Verifikasi Visual & Validasi Lapangan

- **URL Visualizer Aktif**: `http://127.0.0.1:8788/kerja`
- **Uji Interaktivitas**:
  1. Pantau transisi agent saat ditugaskan dari lounge menuju meja kerja (`desk:A1` hingga `A4`). Pastikan saat tiba, agent tidak melorot tiba-tiba melainkan menekuk lutut secara teratur ke atas kursi.
  2. Pantau saat agent selesai bertugas dan kembali ke lounge. Pastikan agent berdiri tegak di samping kursi sebelum melangkah menuju koridor.
  3. Amati keberagaman pose di area kerja: agent yang menjalankan `view_file` harus menampilkan pose membaca layar/dokumen, agent yang menjalankan `run_command` harus menampilkan pose konsol terminal, dan agent yang menjalankan `write_to_file` menampilkan pose mengetik keyboard.
  4. Amati area lounge: pastikan cangkir kopi terangkat dengan kurva mulus tanpa sentakan diskontinu, pemain arcade menggerakkan joystick secara luwes, dan foosball menampilkan ayunan batang meja secara dinamis.

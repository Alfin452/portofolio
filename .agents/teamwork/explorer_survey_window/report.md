# Laporan Investigasi: Penyesuaian Posisi dan Geometri Jendela 3D di Dinding (R1)

## 1. Ringkasan Eksekutif
Investigasi mendalam terhadap sistem rendering 3D visualizer kantor (`kantor.js` dan `page.html`) mengungkap tiga anomali arsitektur dan geometri kritis pada penempatan jendela:
1. **Floating Gap (Celah Melayang)**: Kusen jendela (`BoxGeometry`) memiliki ketebalan 0.08 dan diposisikan pada Z = `ROOM.z0 + 0.05`. Akibatnya, permukaan belakang kusen berada pada Z = -6.99, menyisakan celah melayang 10 mm (0.01 unit) dari permukaan dinding belakang (Z = -7.00). Sebaliknya, sill (ambang jendela) menyentuh Z = -7.00, menciptakan ketidaksesuaian visual yang mencolok.
2. **Tabrakan Geometri Ekstrem Jendela 3**: Pemanggilan `buildWindow(7.8, 1.8, 1.8, 1.8)` menempatkan jendela ketiga pada dinding belakang di X = 7.8. Koordinat ini bertabrakan langsung dengan Jendela 2 (overlap 40 cm pada rentang X = 6.9 hingga 7.3), rak kopi pojok (X = 7.4-9.0, Y = 1.75), cangkir keramik (Y = 1.77), meja pantry espresso (X = 7.0-9.4), dan jam dinding (X = 8.6, Y = 2.6).
3. **Disorientasi Waypoint `SPOTS.window`**: Spot aktivitas agen `SPOTS.window` didefinisikan pada koordinat (X = 7.8, Z = 0.5) dengan orientasi `heading: Math.PI / 2` (menghadap ke arah +X / dinding kanan studio). Pengembang sebelumnya keliru menyalin nilai `7.8` ke fungsi `buildWindow` dinding belakang. Fungsi `buildWindow` tidak memiliki kapabilitas rotasi atau penempatan pada dinding samping (`ROOM.x1`), sehingga jendela ketiga terpasang di dinding belakang di belakang coffee machine alih-alih pada dinding samping yang ditatap oleh karakter.

---

## 2. Analisis Geometri Ruangan dan Sistem Koordinat

### 2.1 Definisi Ruangan (`ROOM`)
Pada `kantor.js` baris 204:
```javascript
const ROOM = { x0: -10, x1: 10, z0: -7, z1: 6, h: 4.8 };
const FLOOR2_Y = 0;
const CORRIDOR_Z = -2.1;
```
- Sumbu X: Rentang dari X0 = -10 (dinding kiri) hingga X1 = +10 (batas samping kanan). Total lebar W = 20 unit.
- Sumbu Z: Rentang dari Z0 = -7 (dinding belakang) hingga Z1 = +6 (batas depan). Total kedalaman D = 13 unit.
- Sumbu Y: Ketinggian lantai studio terbuka pada Y = 0 hingga plafon pada Y = 4.8 unit.

### 2.2 Konstruksi Dinding Aktual dalam `buildRoom()`
1. **Dinding Belakang (`back`)** (baris 238-241):
   - Geometri: `BoxGeometry(W + 0.6, ROOM.h, 0.3)` -> Dimensi 20.6 x 4.8 x 0.3 unit.
   - Posisi: `back.position.set(cx, ROOM.h / 2, ROOM.z0 - 0.15)` -> (0, 2.4, -7.15).
   - Analisis batas Z dinding:
     - Titik pusat Z = -7.15
     - Ketebalan dinding = 0.30 unit (30 cm)
     - Permukaan luar (eksterior): Z = -7.15 - 0.15 = -7.30
     - Permukaan dalam (interior ruang): Z = -7.15 + 0.15 = -7.00 (`ROOM.z0`)
   - Dinding belakang merupakan sebuah balok solid monolitik tanpa lubang (cutout) geometri untuk jendela.

2. **Dinding Kiri** (baris 246-252):
   - Terdiri dari `segA`, `segB`, dan `lintel` dengan ketebalan 0.3 unit, membentuk bukaan pintu koridor pada Z = -2.65 hingga Z = -1.55, tinggi 2.3 unit.
   - Permukaan dalam interior berada pada X = -10.00 (`ROOM.x0`).

3. **Dinding Pembatas Samping Kanan (X = +10)**:
   - Pada `buildRoom()` saat ini, tidak ada mesh dinding samping kanan karena konsep visualizer adalah diorama studio terbuka (open-floor cutaway) agar kamera OrbitControls tidak terhalang saat memandang dari kuadran depan.
   - Namun batas arsitektur tetap berada pada X = `ROOM.x1` (+10.00).

---

## 3. Dekonstruksi Fungsi `buildWindow` dan Penyebab Floating Gap

### 3.1 Implementasi Saat Ini
Pada `kantor.js` baris 313-329:
```javascript
const windows = [];
function buildWindow(cx, cy, w, h) {
  const sky = canvasTex(256, 256);
  const glass = mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: sky.tex, toneMapped: false }), { cast: false });
  glass.position.set(cx, cy, ROOM.z0 + 0.02);
  scene.add(glass);
  const frameM = mat('#fbfaf7', 0.6);
  const t = 0.08;
  for (const [pw, ph, px, py] of [[w + t * 2, t, cx, cy + h / 2], [w + t * 2, t, cx, cy - h / 2], [t, h, cx - w / 2, cy], [t, h, cx + w / 2, cy], [t * 0.6, h, cx, cy], [w, t * 0.6, cx, cy + h * 0.15]]) {
    const f = mesh(new THREE.BoxGeometry(pw, ph, 0.08), frameM);
    f.position.set(px, py, ROOM.z0 + 0.05);
    scene.add(f);
  }
  const sill = mesh(box(w + 0.3, 0.06, 0.26), frameM);
  sill.position.set(cx, cy - h / 2 - 0.05, ROOM.z0 + 0.13);
  scene.add(sill);
  windows.push(sky);
}
```

### 3.2 Analisis Matematis Offset Sumbu Z
Periksa koordinat Z setiap komponen terhadap dinding interior (Z = -7.00):
1. **Kaca (`glass`)**:
   - Geometri: `PlaneGeometry(w, h)`
   - Posisi Z: `ROOM.z0 + 0.02` = -6.98.
   - Offset dari dinding: +0.02 unit (20 mm).
2. **Kusen Bingkai (`f`)**:
   - Geometri: `BoxGeometry(pw, ph, 0.08)` -> Kedalaman = 0.08 unit (80 mm).
   - Posisi Z pusat: `ROOM.z0 + 0.05` = -6.95.
   - Sisi belakang kusen: -6.95 - (0.08 / 2) = -6.99 (`ROOM.z0 + 0.01`).
   - Sisi depan kusen: -6.95 + (0.08 / 2) = -6.91 (`ROOM.z0 + 0.09`).
   - **Celah Melayang Teridentifikasi**: Sisi belakang kusen berada pada Z = -6.99, sedangkan permukaan dinding pada Z = -7.00. Terdapat celah udara 0.01 unit (10 mm) antara dinding dan kusen jendela. Dari sudut elevasi kamera (Y = 13.5, Z = 18.2), celah ini menyebabkan cahaya matahari `sun.position.set(8, 14, 10)` menghasilkan bayangan bocor dan kusen tampak menggantung di udara.
3. **Ambang Jendela (`sill`)**:
   - Geometri: `box(w + 0.3, 0.06, 0.26)` -> Kedalaman = 0.26 unit (260 mm).
   - Posisi Z pusat: `ROOM.z0 + 0.13` = -6.87.
   - Sisi belakang sill: -6.87 - (0.26 / 2) = -7.00 (`ROOM.z0`).
   - Sisi depan sill: -6.87 + (0.26 / 2) = -6.74 (`ROOM.z0 + 0.26`).
   - Sisi belakang sill menempel tepat pada Z = -7.00, tetapi kusen di atasnya mengambang di Z = -6.99. Perbedaan 10 mm ini menyebabkan ketidaksinkronan pertemuan antara dasar kusen vertikal dan sill.

### 3.3 Analisis Z-Fighting Internal Sudut Kusen
Pada loop pembuatan kusen:
- Batang luar horizontal atas memiliki lebar `w + 2t` dan tinggi `t`, mencakup rentang X: `[cx - w/2 - t, cx + w/2 + t]` dan rentang Y: `[cy + h/2 - t/2, cy + h/2 + t/2]`.
- Batang luar vertikal kiri memiliki lebar `t` dan tinggi `h`, mencakup rentang X: `[cx - w/2 - t/2, cx - w/2 + t/2]` dan rentang Y: `[cy - h/2, cy + h/2]`.
- Pada keempat sudut (misal sudut kiri atas), kedua balok BoxGeometry ini saling menumpuk pada volume yang identik di Z = `ROOM.z0 + 0.05`. Karena materialnya sama (`frameM`), bidang poligon yang tumpang tindih memicu z-fighting (kedipan piksel) saat kamera bergerak atau melakukan orbit zoom.

---

## 4. Pemetaan Tata Letak Dinding Belakang dan Tabrakan Jendela 3

Berikut adalah denah tata letak horizontal pada dinding belakang (Z = -7.00) dari X = -10.00 hingga X = +10.00:

| Rentang X | Elemen Objek | Elevasi Y | Keterangan Status |
| :--- | :--- | :--- | :--- |
| `[-9.30, -5.10]` | `histBoard` (Papan Riwayat) | Y = 1.10 - 3.50 (cy = 2.3) | Bersih, menempel di Z = -6.98 |
| `[-5.10, -4.00]` | Ruang kosong dinding | Y = 0.00 - 4.80 | Jarak pemisah 1.1 meter |
| `[-4.00, +2.00]` | `todoBoard` (Papan Tugas) | Y = 1.05 - 3.55 (cy = 2.3) | Lebar 6.0 meter, posisi sentral |
| `[+2.00, +2.50]` | Ruang kosong dinding | Y = 0.00 - 4.80 | Jarak pemisah 0.5 meter |
| `[+2.50, +4.50]` | **Jendela 1** | Y = 1.35 - 3.25 (cy = 2.3) | Sesuai, lebar 2.0 meter |
| `[+4.50, +5.30]` | Ruang kosong dinding | Y = 0.00 - 4.80 | Jarak pemisah 0.8 meter |
| `[+5.30, +7.30]` | **Jendela 2** | Y = 1.35 - 3.25 (cy = 2.3) | Sesuai, lebar 2.0 meter |
| `[+6.90, +8.70]` | **Jendela 3 (ANOMALI)** | Y = 0.90 - 2.70 (cy = 1.8) | **TABRAKAN PARAH** (Lihat detail) |
| `[+7.00, +9.40]` | Counter Meja Pantry Kopi | Y = 0.00 - 0.95 | Tabrakan dengan bagian bawah Jendela 3 |
| `[+6.95, +9.45]` | Daun Meja Pantry Kopi (`top`) | Y = 0.945 - 0.995 | Memotong kaca Jendela 3 |
| `[+7.40, +9.00]` | Rak Gantung Kopi (`shelf`) | Y = 1.73 - 1.77 (cy = 1.75) | Memotong tepat di tengah Jendela 3 |
| `[+7.70, +7.70]` | Mesin Espresso | Y = 0.995 | Terpotong oleh kusen dan kaca Jendela 3 |
| `[+7.70, +8.20]` | Cangkir Kopi di Rak | Y = 1.77 | Mengambang di tengah kaca langit Jendela 3 |
| `[+8.18, +9.02]` | Jam Dinding (`buildClock`) | Y = 2.18 - 3.02 (cy = 2.6) | Kusen kanan atas Jendela 3 menembus jam |
| `[+9.10, +10.00]` | Water Dispenser & Sudut Kanan | Y = 0.00 - 1.50 | Batas sudut ruangan |

### Bukti Konkrit Tabrakan Jendela 3:
1. **Overlap dengan Jendela 2**: Sisi kanan kusen Jendela 2 berada pada X = 7.38, sedangkan sisi kiri kusen Jendela 3 berada pada X = 6.82. Kedua jendela saling menabrak dan menembus sejauh 56 cm.
2. **Penetrasi Rak Kopi**: Rak kopi berada pada X = 7.4 hingga 9.0 pada ketinggian Y = 1.75. Kaca Jendela 3 berada pada X = 6.9 hingga 8.7 dengan ketinggian Y = 0.9 hingga 2.7. Rak kopi menembus kaca jendela secara melintang.
3. **Penetrasi Jam Dinding**: Pusat jam berada pada X = 8.6, Y = 2.6. Sudut kanan atas kusen Jendela 3 berada pada X = 8.7, Y = 2.7. Jam dinding terbenam ke dalam kusen jendela.

---

## 5. Hubungan Arsitektur Antara Jendela Samping dan `SPOTS.window`

### 5.1 Definisi Spot Aktivitas Karakter
Pada `kantor.js` baris 1377:
```javascript
window: { pos: V(7.8, 0.5), heading: Math.PI / 2, spoke: [V(6.5, 0.5), V(7.2, 0.5)] },
```
Dialog karakter pada spot ini (baris 1394):
```javascript
window: ['Langitnya cerah ya', 'Peregangan dulu, pegal', 'Macet banget di bawah', 'Ada layangan tuh!'],
```

### 5.2 Analisis Vektor Arah Pandang Karakter
- Posisi berdiri karakter: X = 7.8, Z = 0.5, Y = 0.
- Rotasi kepala dan tubuh: `heading = Math.PI / 2` (+90 derajat).
- Dalam koordinat Three.js pada scene ini:
  - `heading = 0` mengarah ke +Z (ke arah kamera depan).
  - `heading = Math.PI` mengarah ke -Z (ke arah dinding belakang).
  - `heading = Math.PI / 2` mengarah ke +X (ke arah dinding pembatas samping kanan pada X = 10.0).
- Garis pandang karakter: Dari titik (7.8, 0.5) lurus menuju (10.0, 0.5). Jarak ke batas dinding kanan adalah 2.2 meter.
- Kondisi aktual saat ini:
  - Karakter memandang ke arah +X (dinding samping kanan), namun di sana tidak ada jendela sama sekali.
  - Jendela ketiga justru berada di Z = -7.00 (7.5 meter di belakang karakter), tersembunyi di balik mesin kopi dan tertabrak oleh Jendela 2.

### 5.3 Kesimpulan Desain
Jendela ketiga secara konseptual dirancang sebagai **Jendela Samping (Side Window)** pada dinding pembatas kanan (`ROOM.x1 = 10`), sejajar dengan koordinat Z = 0.5. Karena fungsi `buildWindow` sebelumnya tidak mendukung orientasi dinding samping (tidak memiliki parameter rotasi sumbu Y), pengembang terdahulu menempatkannya di dinding belakang dengan koordinat X = 7.8, menghasilkan kesalahan geometri bertingkat.

---

## 6. Analisis Elevasi Vertikal (1 Lantai Studio Terbuka, Y = 0)

1. **Proporsi Tubuh Karakter**:
   - Berdasarkan `buildPerson` (baris 1020-1080): Pinggul pada Y = 0.9, tulang belakang pada Y = 0.96, kepala pada Y = 1.63, puncak kepala pada Y = 1.76.
   - Garis mata rata-rata karakter yang berdiri berada pada rentang Y = 1.58 hingga 1.65 unit.
2. **Elevasi Jendela Belakang (Jendela 1 & 2)**:
   - Titik tengah Y = 2.3, tinggi H = 1.9 unit.
   - Ambang bawah kaca: Y = 2.3 - 0.95 = 1.35 unit.
   - Ambang atas kaca: Y = 2.3 + 0.95 = 3.25 unit.
   - Garis mata karakter (1.62 unit) berada tepat di zona pandang optimal kaca jendela.
   - Sisa dinding atas (lintel) dari Y = 3.25 hingga plafon Y = 4.8 adalah 1.55 meter, proporsional dengan arsitektur studio industri bertingkat tinggi.
3. **Elevasi Jendela Samping yang Direkomendasikan**:
   - Titik tengah Y = 2.20 hingga 2.30, tinggi H = 2.00 unit.
   - Ambang bawah kaca: Y = 1.20 hingga 1.30 unit.
   - Ketinggian kusen bawah (sill) berada pada Y = 1.15 hingga 1.25 unit, selaras secara estetika dengan meja kerja dan visual lounge di sekitarnya.

---

## 7. Analisis Konfigurasi Viewport dan Canvas (`page.html` & `kantor.js`)

1. **Canvas Viewport**:
   - `page.html` mendefinisikan `#scene { position: fixed; inset: 0; }` dan `#scene canvas { display: block; touch-action: none; }`.
   - Ukuran canvas mengikuti ukuran layar dinamis (`innerWidth`, `innerHeight`) via listener `onResize()`.
2. **Kamera dan Rentang Kedalaman (Z-Buffer)**:
   - Kamera didefinisikan: `new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 160)`.
   - Rasio rentang frustum: `far / near = 160 / 0.1 = 1600`.
   - Resolusi depth buffer 24-bit pada jarak rata-rata pandang kamera (d ~ 27 unit) adalah sekitar 0.07 mm. Secara teoritis, resolusi ini memadai untuk memisahkan bidang dengan jarak 15-20 mm.
   - Namun, pada `kantor.js` baris 136-137:
     ```javascript
     sun.shadow.bias = -0.0005;
     sun.shadow.normalBias = 0.02;
     ```
     Parameter `normalBias = 0.02` (20 mm) identik dengan offset kaca jendela lama (`ROOM.z0 + 0.02`). Hal ini memperbesar risiko terjadinya bayangan bergerigi (shadow acne) dan z-fighting pada sudut pengamatan tertentu jika kaca tidak di-offset dengan benar atau bayangan tidak di-disable (`cast: false` sudah benar diterapkan).

---

## 8. Rekomendasi Perbaikan Presisi untuk Tim Implementer

Untuk menyelesaikan seluruh Acceptance Criteria R1 secara tuntas, rekomendasi perbaikan berikut disiapkan secara presisi:

### 8.1 Rekomendasi 1: Redesain Fungsi `buildWindow` Universal Berbasis `THREE.Group`
Ubah arsitektur `buildWindow` agar mendukung orientasi modular dinding belakang (`back`) dan dinding samping (`right`/`side`):
- Gunakan `THREE.Group` sebagai wadah hierarki jendela.
- Posisi group ditempatkan tepat pada permukaan dinding:
  - Dinding Belakang: `group.position.set(cx, cy, ROOM.z0)`, `group.rotation.y = 0`.
  - Dinding Samping Kanan: `group.position.set(ROOM.x1, cy, cz)`, `group.rotation.y = -Math.PI / 2`.
- Dalam sistem koordinat lokal group:
  - Sumbu Z lokal positif (+Z) selalu mengarah ke dalam ruangan.
  - Sumbu Z lokal negatif (-Z) selalu menembus ke dalam dinding.
  - Sumbu X lokal selalu sejajar dengan permukaan dinding horizontal.
  - Sumbu Y lokal selalu vertikal.

### 8.2 Rekomendasi 2: Eliminasi Floating Gap dengan Penetrasi Geometri
- **Kusen (`BoxGeometry`)**:
  - Tentukan ketebalan kusen D = 0.08 unit (80 mm).
  - Posisikan pusat kusen pada Z lokal = +0.03 unit.
  - Hasil batas Z: Sisi belakang kusen berada pada Z lokal = 0.03 - 0.04 = -0.01 unit (tertanam 10 mm ke dalam dinding). Sisi depan berada pada Z lokal = +0.07 unit.
  - Karena sisi belakang menembus ke dalam dinding (Z lokal < 0), celah melayang (floating gap) 100% musnah dari segala sudut pandang kamera.
- **Kaca (`PlaneGeometry`)**:
  - Posisikan pada Z lokal = +0.015 unit.
  - Kaca berada aman di antara dinding (Z = 0) dan muka depan kusen (Z = +0.07), memberikan kesan kaca terpasang rapi di dalam lekukan profil kusen (recessed window pocket).
- **Ambang Jendela (`sill`)**:
  - Geometri balok: lebar `w + 2*t + 0.14`, tinggi 0.06, kedalaman 0.22 unit.
  - Posisikan pusat sill pada Y lokal = `-h/2 - t - 0.03`, dan Z lokal = +0.09 unit.
  - Sisi belakang sill berada pada Z lokal = 0.09 - 0.11 = -0.02 unit (tertanam 20 mm ke dalam dinding).
  - Sisi atas sill menempel presisi pada dasar kusen tanpa overlap atau celah.

### 8.3 Rekomendasi 3: Eliminasi Z-Fighting pada Pertemuan Sudut Kusen
Pisahkan dimensi balok kusen agar tidak saling tumpang tindih volume:
- Batang atas: lebar `w + 2*t`, tinggi `t`, posisi Y lokal = `h/2 + t/2`.
- Batang bawah: lebar `w + 2*t`, tinggi `t`, posisi Y lokal = `-h/2 - t/2`.
- Batang vertikal kiri: lebar `t`, tinggi `h`, posisi X lokal = `-w/2 - t/2`, posisi Y lokal = 0.
- Batang vertikal kanan: lebar `t`, tinggi `h`, posisi X lokal = `+w/2 + t/2`, posisi Y lokal = 0.
- Mullion vertikal tengah: lebar `0.6*t`, tinggi `h`, kedalaman 0.06 unit (sedikit lebih tipis untuk aksen profil realistis).
- Transom horizontal: lebar `w`, tinggi `0.6*t`, kedalaman 0.06 unit, posisi Y lokal = `h * 0.15`.
Keempat batang kusen luar dan pembagi kaca bertemu pada sambungan bersih tanpa tumpang tindih poligon.

### 8.4 Rekomendasi 4: Koreksi Distribusi dan Penempatan Jendela
Ganti konfigurasi tiga jendela lama:
1. **Jendela Belakang 1**:
   - Dinding belakang: `cx = 3.3, cy = 2.3, w = 1.9, h = 1.9`.
   - Rentang X: [2.35, 4.25]. Jarak aman dari `todoBoard` (X <= 2.0).
2. **Jendela Belakang 2**:
   - Dinding belakang: `cx = 5.7, cy = 2.3, w = 1.9, h = 1.9`.
   - Rentang X: [4.75, 6.65]. Ujung terluar sill berada pada X = 6.80.
   - Memberikan jarak bebas 15 cm dari meja pantry kopi (dimulai pada X = 6.95), menyelesaikan seluruh tabrakan dengan rak kopi dan jam dinding.
3. **Jendela Samping (Side Window untuk `SPOTS.window`)**:
   - Dinding samping kanan: `wall: 'side'`, `pos: 0.5 (cz), cy = 2.2, w = 2.0, h = 1.9`.
   - Berada pada X = `ROOM.x1` (+10.00), menghadap ke arah -X.
   - Berhadapan langsung dengan karakter yang berdiri di (X = 7.8, Z = 0.5) dengan pandangan `heading = Math.PI / 2`.
   - Mengubah pengalaman visual pengguna: saat agen santai menatap jendela, di hadapannya benar-benar terdapat jendela kaca panorama perkotaan dengan simulasi siang/malam dinamis.

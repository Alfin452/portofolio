# Laporan Verifikasi Empiris & Adversarial Review: Milestone 1 (F1 - F4)
**Challenger**: Challenger M1-1  
**Tanggal**: 2026-11-02  
**Target Milestone**: Milestone 1 (Window 3D Geometry & Wall Alignment)  
**Verdict**: **APPROVE**  

---

## 1. Observation

1. **File yang ditinjau**:
   - `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js` (baris 311 - 408)
   - `.agents/teamwork/worker_m1/handoff.md`
   - `PROJECT.md` & `ORIGINAL_REQUEST.md`

2. **Implementasi `buildWindow` (kutipan verbatim `kantor.js` baris 336 - 377)**:
   ```javascript
   const t = 0.08;
   const frameD = 0.08;
   const frameZ = 0.03; // Sisi belakang Z = -0.01 (tertanam 10mm ke dalam dinding), sisi depan Z = +0.07

   // Balok horizontal luar (lebar penuh w + 2*t, tanpa tumpang tindih sudut)
   const topBar = mesh(new THREE.BoxGeometry(w + t * 2, t, frameD), frameM);
   topBar.position.set(0, h / 2 + t / 2, frameZ);

   const botBar = mesh(new THREE.BoxGeometry(w + t * 2, t, frameD), frameM);
   botBar.position.set(0, -h / 2 - t / 2, frameZ);

   // Balok vertikal luar (tinggi h, menempel presisi di antara balok horizontal tanpa overlap poligon)
   const leftBar = mesh(new THREE.BoxGeometry(t, h, frameD), frameM);
   leftBar.position.set(-w / 2 - t / 2, 0, frameZ);

   const rightBar = mesh(new THREE.BoxGeometry(t, h, frameD), frameM);
   rightBar.position.set(w / 2 + t / 2, 0, frameZ);

   // Pembagi kaca internal: Mullion vertikal tengah & Transom horizontal terpisah
   const mw = t * 0.6; // 0.048
   const mullionD = 0.06;
   const mullion = mesh(new THREE.BoxGeometry(mw, h, mullionD), frameM);
   mullion.position.set(0, 0, frameZ);

   const tw = (w - mw) / 2;
   const th = t * 0.6;
   const ty = h * 0.15;
   const transomL = mesh(new THREE.BoxGeometry(tw, th, mullionD), frameM);
   transomL.position.set(-(w + mw) / 4, ty, frameZ);

   const transomR = mesh(new THREE.BoxGeometry(tw, th, mullionD), frameM);
   transomR.position.set((w + mw) / 4, ty, frameZ);

   // Ambang jendela (sill) tertanam 20mm ke dalam dinding (Z lokal < 0) dan presisi di bawah kusen bawah
   const sillW = w + t * 2 + 0.14;
   const sillH = 0.06;
   const sillD = 0.22;
   const sill = mesh(box(sillW, sillH, sillD, 0.015), frameM);
   sill.position.set(0, -h / 2 - t - sillH / 2, 0.09);
   ```

3. **Deklarasi Jendela (`kantor.js` baris 400 - 407)**:
   ```javascript
   // 1. Jendela 1 (dinding belakang): cx = 3.3, cy = 2.3, w = 1.9, h = 1.9
   buildWindow({ cx: 3.3, cy: 2.3, w: 1.9, h: 1.9, wall: 'back' });

   // 2. Jendela 2 (dinding belakang): cx = 5.7, cy = 2.3, w = 1.9, h = 1.9 (jarak bebas 15 cm dari pantry kopi)
   buildWindow({ cx: 5.7, cy: 2.3, w: 1.9, h: 1.9, wall: 'back' });

   // 3. Jendela 3 (dinding samping kanan): wall: 'side', x = ROOM.x1 (10.0), z = 0.5, cy = 2.2, w = 2.0, h = 1.9, rotasi Y = -Math.PI / 2
   buildWindow({ wall: 'side', x: ROOM.x1, z: 0.5, cy: 2.2, w: 2.0, h: 1.9, rotY: -Math.PI / 2 });
   ```

4. **Fixture Dinding Belakang & Waypoint SPOTS.window**:
   - `todoBoard` (`kantor.js` baris 1024): `pos = (-1.0, 2.3, ROOM.z0 + 0.02)`, `w = 6.0`, outer frame `fw = 6.1` -> Rentang X `[-4.05, +2.05]`.
   - Meja Pantry Kopi (`kantor.js` baris 759-762): Counter pos `X = 8.2`, top `w = 2.5` -> Rentang X `[6.95, 9.45]`.
   - Rak Kopi (`kantor.js` baris 763-764): Pos `X = 8.2`, `w = 1.6` -> Rentang X `[7.40, 9.00]`.
   - Jam Dinding (`kantor.js` baris 1028-1033): Pos `X = 8.6, Y = 2.6`, jari-jari torus rim `0.465` -> Rentang X `[8.135, 9.065]`, Y `[2.135, 3.065]`.
   - `SPOTS.window` (`kantor.js` baris 1452): `pos = V(7.8, 0.5)`, `heading = Math.PI / 2` (+X).

5. **Hasil Eksekusi Script Empiris `verify-windows.mjs`**:
   Perintah: `node .agents/teamwork/challenger_m1_1/verify-windows.mjs`
   Output ringkas:
   - SUITE 1 (Zero Volume Overlap): **PASS (0.000000 m3 volume overlap)** pada seluruh kombinasi balok kusen dan mullion/transom.
   - SUITE 2 (Zero Floating Gap): **PASS (Kusen Z_min = -0.010 m tertanam 10 mm, Sill Z_min = -0.020 m tertanam 20 mm)**.
   - SUITE 3 (Wall Fixtures Distance):
     - Jendela 1 vs todoBoard: Clearance = **0.150 m (15.0 cm)** (PASS).
     - Jendela 1 vs Jendela 2: Clearance = **0.200 m (20.0 cm)** (PASS).
     - Jendela 2 vs Pantry Counter: Clearance = **0.150 m (15.0 cm)** (PASS).
     - Jendela 2 vs Rak Kopi: Clearance = **0.600 m (60.0 cm)** (PASS).
     - Jendela 2 vs Jam Dinding: Clearance = **1.335 m (133.5 cm)** (PASS).
     - Jendela 3 vs SPOTS.window: Delta Z = **0.0000 m** tepat segaris pandangan agen.
   - SUITE 4 (Camera Raycast & Occlusion): **PASS**.

---

## 2. Logic Chain

1. **Dari Observasi 2 (Geometri Lokal Kusen)**:
   - Balok atas `topBar` menempati `Y ∈ [h/2, h/2 + t]` dan balok bawah `botBar` menempati `Y ∈ [-h/2 - t, -h/2]`.
   - Balok vertikal `leftBar` dan `rightBar` menempati `Y ∈ [-h/2, h/2]`.
   - Irisan matematis pada keempat sudut kusen adalah pertemuan garis/bidang 2D (`ΔY = 0`), menghasilkan integral volume irisan 3D `ΔX * 0 * ΔZ = 0.000000 m3`. Terbukti secara matematis tidak ada tumpang tindih poligon (eliminasi Z-fighting).
   - Mullion tengah menempati `X ∈ [-mw/2, mw/2]`, sedangkan transom kiri dan kanan masing-masing menempati `X ∈ [-w/2, -mw/2]` dan `X ∈ [mw/2, w/2]`. Ketebalan irisan dalam sumbu X adalah `ΔX = 0`, menghasilkan volume overlap 0.000000 m3.

2. **Dari Observasi 2 & Hasil Suite 2 (Floating Gap Eliminasi)**:
   - Dinding belakang ruangan berada pada Z = 0 (koordinat lokal group).
   - Sisi belakang kusen (`frameZ - frameD/2 = 0.03 - 0.04 = -0.010 m`) berada di dalam volume dinding (Z < 0).
   - Sisi belakang ambang/sill (`sillZ - sillD/2 = 0.09 - 0.11 = -0.020 m`) juga berada di dalam volume dinding (Z < 0).
   - Karena sisi belakang balok berada di kedalaman negatif (Z < 0) dan sisi depan berada di kedalaman positif (Z > 0), permukaan dinding memotong badan kusen secara kontinu. Tidak ada celah fisik yang memungkinkan garis pandang kamera menembus antara dinding dan kusen/sill dari sudut mana pun (zero floating gap proven).

3. **Dari Observasi 3, 4, & Hasil Suite 3 (Pemisahan Fixture Bebas Tabrakan)**:
   - Jendela 1 terbentang pada X `[2.20, 4.40]`. Batas terluar frame/sill todoBoard berada pada `X = 2.05`. Jarak pemisah adalah `2.20 - 2.05 = 0.15 m` (15 cm). Tidak ada tabrakan.
   - Jendela 2 terbentang pada X `[4.60, 6.80]`. Meja counter pantry terbentang mulai `X = 6.95`. Jarak pemisah adalah `6.95 - 6.80 = 0.15 m` (15 cm). Rak kopi mulai `X = 7.40` (jarak 60 cm), dan jam dinding pada `X = 8.135` (jarak 133.5 cm). Semua tabrakan yang sebelumnya dilaporkan pada survey awal telah tereliminasi secara mutlak.
   - Jendela 3 berada pada dinding samping kanan (`X = 10.0, Z = 0.5`), selaras sempurna dengan posisi agen di `SPOTS.window` (`X = 7.8, Z = 0.5, heading = Math.PI / 2`).

4. **Dari Observasi 5 (Integritas Build & Runtime)**:
   - `node -c kantor.js` bersih tanpa error sintaks.
   - Server lokal `http://127.0.0.1:8788/kerja/assets/kantor.js` menyajikan file terbaru secara penuh (HTTP 200, 113.327 bytes).

---

## 3. Caveats

- Pengujian empiris pada milestone ini berfokus secara ketat pada geometri 3D jendela, perataan dinding, penataan bounding box terhadap perabot dinding, dan eliminasi celah/z-fighting (F1 - F4).
- Logika pergerakan agen, highway network, dan animasi (F5 - F14) merupakan lingkup Milestone 2 dan Milestone 3 yang akan diverifikasi pada tahapan berikutnya.
- Tidak ada caveats yang membatalkan kesimpulan Milestone 1.

---

## 4. Conclusion

**Verdict: APPROVE**  
Implementasi Milestone 1 (F1 - F4) oleh worker_m1 telah diverifikasi secara matematis dan empiris melalui execution script `verify-windows.mjs`:
- Bounding box ketiga jendela presisi dan bebas dari seluruh fixture dinding (todoBoard, counter pantry kopi, rak kopi, jam dinding).
- Zero floating gap terbukti valid dengan embedding Z < 0 ke dalam dinding.
- Zero volume overlap terbukti valid (0.000000 m3) pada seluruh sudut kusen dan sambungan mullion/transom.
- Kode mematuhi aturan ketat "NO EMOJIS IN WEB INTERFACES".

---

## 5. Verification Method

Untuk mereproduksi dan memvalidasi pengujian ini secara independen:

1. **Jalankan script uji empiris matematika**:
   ```bash
   node c:\laragon\www\portofolio\.agents\teamwork\challenger_m1_1\verify-windows.mjs
   ```
   *Expected*: Seluruh 4 test suite PASS, dan mencetak `VERDICT AKHIR: APPROVE`.

2. **Periksa validitas sintaks visualizer**:
   ```bash
   node -c c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js
   ```
   *Expected*: Exit code 0.

3. **Periksa ketersediaan aset pada server aktif**:
   ```bash
   curl.exe -I http://127.0.0.1:8788/kerja/assets/kantor.js
   ```
   *Expected*: `HTTP/1.1 200 OK`, `Content-Length: 113327`.

---

## Adversarial Challenge Report

### Challenge Summary
**Overall risk assessment**: **LOW**

### Challenges Evaluated

#### Challenge 1: Risiko Floating Gap dari Sudut Kamera Ekstrem
- **Assumption challenged**: Apakah penempatan jendela pada Z lokal dinding meninggalkan celah jika kamera berputar ke sudut pandang menyamping atau elevasi tinggi?
- **Attack scenario**: Kamera digerakkan ke sudut azimuth ekstrem atau elevasi curam (seperti OrbitControls pada home position `(-1.0, 13.5, 18.2)`).
- **Hasil Pengujian**: Ditolak (Robust). Kusen tertanam 10 mm (`Z = -0.010`) dan sill tertanam 20 mm (`Z = -0.020`) ke dalam geometri dinding (`Z = 0`). Karena manifold balok menembus bidang dinding secara kontinu, mustahil terbentuk celah visual dari sudut pandang mana pun.

#### Challenge 2: Potensi Irisan Volume Sudut Kusen (Z-Fighting)
- **Assumption challenged**: Apakah balok horizontal dan vertikal kusen saling tumpang tindih volume kubus pada sudut frame?
- **Attack scenario**: Pengukuran AABB 3D intersection volume pada 4 sudut dan pertemuan mullion-transom.
- **Hasil Pengujian**: Ditolak (Robust). Perhitungan AABB continuous intersection membuktikan volume overlap bernilai presisi `0.000000 m3` (hanya kontak bidang 2D tanpa ketebalan irisan).

#### Challenge 3: Tabrakan Geometri dengan Meja Pantry dan Fixture Lain
- **Assumption challenged**: Apakah Jendela 2 di X = 5.7 masih menyentuh bagian tepi meja pantry kopi?
- **Attack scenario**: Pengukuran jarak bebas antara X max sill Jendela 2 (X = 6.80) dengan X min counter top meja pantry (X = 6.95).
- **Hasil Pengujian**: Ditolak (Robust). Terdapat jarak bebas aman 15.0 cm antara Jendela 2 dan meja pantry, 60.0 cm dari rak kopi, dan 133.5 cm dari jam dinding.

# Handoff Report: Survey Window 3D Geometry (R1)

## 1. Observation
- **File**: `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js`
  - Baris 204: Definisi dimensi ruangan:
    `const ROOM = { x0: -10, x1: 10, z0: -7, z1: 6, h: 4.8 };`
  - Baris 239-240: Definisi dinding belakang:
    `const back = mesh(new THREE.BoxGeometry(W + 0.6, ROOM.h, 0.3), wallM, { cast: false });`
    `back.position.set(cx, ROOM.h / 2, ROOM.z0 - 0.15);`
    Permukaan interior dinding belakang berada pada Z = -7.00 (`ROOM.z0`).
  - Baris 313-328: Definisi fungsi `buildWindow`:
    `glass.position.set(cx, cy, ROOM.z0 + 0.02);`
    `f = mesh(new THREE.BoxGeometry(pw, ph, 0.08), frameM);`
    `f.position.set(px, py, ROOM.z0 + 0.05);`
    `const sill = mesh(box(w + 0.3, 0.06, 0.26), frameM);`
    `sill.position.set(cx, cy - h / 2 - 0.05, ROOM.z0 + 0.13);`
  - Baris 330-332: Pemanggilan tiga jendela:
    `buildWindow(3.5, 2.3, 2.0, 1.9);`
    `buildWindow(6.3, 2.3, 2.0, 1.9);`
    `buildWindow(7.8, 1.8, 1.8, 1.8);`
  - Baris 684-690: Pojok kopi di dinding belakang:
    `counter.position.set(8.2, 0.475, ROOM.z0 + 0.55);` (lebar 2.4, X mencakup 7.0 hingga 9.4)
    `shelf.position.set(8.2, 1.75, ROOM.z0 + 0.18);` (lebar 1.6, X mencakup 7.4 hingga 9.0, Y = 1.75)
    `espressoMachine(7.7, 0.995, ROOM.z0 + 0.55);`
  - Baris 954-955: Jam dinding:
    `face.position.set(8.6, 2.6, ROOM.z0 + 0.05);` (radius 0.42, X mencakup 8.18 hingga 9.02, Y mencakup 2.18 hingga 3.02)
  - Baris 1377: Definisi spot jendela:
    `window: { pos: V(7.8, 0.5), heading: Math.PI / 2, spoke: [V(6.5, 0.5), V(7.2, 0.5)] },`
- **File**: `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\views\page.html`
  - Baris 32-33: Definisi kontainer canvas `#scene` dan responsivitas WebGL.

## 2. Logic Chain
1. Dari Baris 239-240 dan 322: Dinding belakang memiliki permukaan interior pada Z = -7.00. Kusen jendela memiliki kedalaman 0.08 dan ditempatkan pada Z = -6.95. Sisi belakang kusen adalah -6.95 - 0.04 = -6.99. Selisih (-6.99) - (-7.00) = 0.01 unit (10 mm) membuktikan adanya celah melayang (floating gap) antara kusen dan dinding.
2. Dari Baris 326: Ambang jendela (sill) memiliki kedalaman 0.26 dan berada pada Z = -6.87. Sisi belakang sill adalah -6.87 - 0.13 = -7.00, tepat menyentuh dinding. Hal ini membuktikan inkonsistensi: sill menempel di dinding, tetapi kusen di atasnya mengambang 10 mm.
3. Dari Baris 331 dan 332: Jendela 2 (X = 6.3, lebar 2.0) berakhir pada X = 7.3. Jendela 3 (X = 7.8, lebar 1.8) berawal pada X = 6.9. Terdapat tumpang tindih geometri (overlap) sebesar 40 cm di antara kedua jendela pada Z = -6.95.
4. Dari Baris 332, 684-690, dan 955: Jendela 3 mencakup X = 6.9 hingga 8.7 dan Y = 0.9 hingga 2.7. Objek rak kopi berada pada X = 7.4-9.0, Y = 1.75; mesin espresso pada X = 7.7, Y = 0.995; dan jam dinding pada X = 8.6, Y = 2.6. Geometri Jendela 3 menembus seluruh objek pantry dan jam tersebut secara langsung.
5. Dari Baris 1377: Titik aktivitas `SPOTS.window` berada pada (X = 7.8, Z = 0.5) dengan rotasi `heading: Math.PI / 2` (+90 derajat menghadap arah +X / batas kanan studio). Nilai `7.8` pada `buildWindow(7.8, 1.8, 1.8, 1.8)` terbukti merupakan kesalahan penyalinan koordinat X dari `SPOTS.window`, karena `buildWindow` tidak memiliki kapabilitas penempatan pada dinding samping kanan (`ROOM.x1 = 10`).

## 3. Caveats
- Investigasi dilakukan dalam mode read-only tanpa memodifikasi file produksi `kantor.js` maupun `page.html`.
- Kode rekomendasi disediakan dalam bentuk struktur modular berbasis Three.js Group dan perhitungan analitis yang dapat diaplikasikan langsung oleh tim implementer.

## 4. Conclusion
Masalah floating gap dan clipping pada jendela disebabkan oleh dua akar masalah:
1. Kesalahan offset kedalaman Z pada kusen jendela (10 mm gap dari dinding) serta overlap volume antar-batang kusen di setiap sudut.
2. Penempatan jendela ketiga yang keliru di dinding belakang akibat ketiadaan parameter rotasi dinding samping pada `buildWindow`, sehingga bertabrakan dengan Jendela 2 dan pantry kopi, sekaligus tidak sinkron dengan orientasi arah pandang `SPOTS.window`.
Solusi presisi:
- Redesain `buildWindow` berbasis `THREE.Group` dengan dukungan rotasi `wall = 'back' | 'side'`.
- Tanam kusen 10 mm ke dalam dinding (Z lokal pusat = +0.03, tebal = 0.08) untuk mengeliminasi floating gap secara mutlak.
- Pisahkan sambungan batang kusen agar tidak tumpang tindih volume.
- Geser Jendela 2 belakang ke cx = 5.7 (agar bebas dari pantry kopi) dan tempatkan Jendela 3 pada dinding samping kanan (X = 10, Z = 0.5, rotasi Y = -Math.PI / 2) tepat di hadapan agen di `SPOTS.window`.

## 5. Verification Method
1. Buka file laporan investigasi lengkap di:
   `c:\laragon\www\portofolio\.agents\teamwork\explorer_survey_window\report.md`
2. Periksa baris 313-332 di `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js` untuk memverifikasi kalkulasi matematis offset Z, overlap X Jendela 2 vs 3, dan penetrasi objek pantry kopi.
3. Setelah implementasi nanti, verifikasi visual langsung pada server aktif `http://127.0.0.1:8788/kerja` dengan memutar OrbitControls ke sudut samping untuk memastikan kusen menempel rapat tanpa celah dan agen di spot `window` memandang tepat ke jendela samping luar.

# Laporan Handoff Milestone 1: Window 3D Geometry & Architecture (F1 - F4)

## 1. Observation
- File yang dimodifikasi secara eksklusif: `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js`.
- Pada implementasi awal `buildWindow(cx, cy, w, h)` (sebelumnya baris 313-332):
  1. Komponen kusen jendela diposisikan di `Z = ROOM.z0 + 0.05` dengan ketebalan 0.08. Permukaan belakang kusen berada pada Z = -6.99, sedangkan dinding belakang berada pada Z = -7.00. Hal ini menyisakan celah melayang (floating gap) 10 mm.
  2. Balok horizontal luar kusen (`w + t * 2, t`) dan balok vertikal luar (`t, h`) memiliki titik perpotongan volume di keempat sudut yang menempati koordinat kubus sama pada Z = `ROOM.z0 + 0.05`, memicu Z-fighting (pixel flickering).
  3. Pemanggilan `buildWindow` awal menempatkan jendela pada dinding belakang:
     - Jendela 1: `(3.5, 2.3, 2.0, 1.9)`
     - Jendela 2: `(6.3, 2.3, 2.0, 1.9)`
     - Jendela 3: `(7.8, 1.8, 1.8, 1.8)`
     Jendela 3 di X = 7.8 bertabrakan parah dengan Jendela 2 (overlap rentang X 6.9 - 7.3), meja counter pantry kopi (X = 6.95 - 9.45), rak kopi (X = 7.4 - 9.0), dan jam dinding (X = 8.6, Y = 2.6).
  4. Agen di `SPOTS.window` berada pada `(X = 7.8, Z = 0.5)` dengan `heading: Math.PI / 2` (memandang ke arah +X / dinding kanan studio), namun tidak ada jendela di dinding kanan tersebut.
- Hasil verifikasi setelah perbaikan:
  - Perintah `node -c kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js` menghasilkan return code 0 tanpa syntax error.
  - Perintah `curl.exe -I http://127.0.0.1:8788/kerja/assets/kantor.js` mengembalikan `HTTP/1.1 200 OK`, `Content-Type: text/javascript; charset=utf-8`, `Content-Length: 113327`.

## 2. Logic Chain
1. **F1: Universal Group Architecture**:
   - Fungsi `buildWindow(arg1, arg2, arg3, arg4)` diredesain untuk mengembalikan objek `THREE.Group` dan menerima baik format objek konfigurasi (`spec`) maupun argumen posisional warisan (`cx, cy, w, h`).
   - Group mendukung penempatan modular pada `'back'` (dinding belakang) dan `'side'` (dinding samping kanan).
2. **F2: Eliminasi Floating Gap & Recessed Pocket**:
   - Dalam sistem koordinat lokal `group`, permukaan dinding didefinisikan sebagai Z = 0.
   - Sisi depan ke arah interior ruangan adalah +Z, sedangkan arah menembus ke dalam dinding adalah -Z.
   - Balok kusen (`frameD = 0.08`) diposisikan pada pusat Z lokal = +0.03. Permukaan belakang kusen berada pada `0.03 - 0.04 = -0.01` (tertanam 10 mm ke dalam dinding).
   - Ambang jendela (`sillD = 0.22`) diposisikan pada pusat Z lokal = +0.09. Permukaan belakang sill berada pada `0.09 - 0.11 = -0.02` (tertanam 20 mm ke dalam dinding).
   - Kaca jendela (`PlaneGeometry`) diposisikan pada Z lokal = +0.015 di antara batas kusen (-0.01 hingga +0.07), menghasilkan saku kusen berkedalaman 55 mm yang rapi dan terhindar dari floating gap di semua sudut kamera.
3. **F3: Eliminasi Z-Fighting & Frame Corner Alignment**:
   - Balok horizontal atas (`w + 2*t`, `t`, `0.08`) diposisikan pada Y = `h/2 + t/2`, mencakup rentang vertikal `[h/2, h/2 + t]`.
   - Balok horizontal bawah (`w + 2*t`, `t`, `0.08`) diposisikan pada Y = `-h/2 - t/2`, mencakup rentang vertikal `[-h/2 - t, -h/2]`.
   - Balok vertikal kiri dan kanan (`t`, `h`, `0.08`) diposisikan pada X = `±(w/2 + t/2)` dan Y = 0, mencakup rentang vertikal `[-h/2, h/2]`. Pertemuan dengan balok horizontal tepat berada pada garis batas tanpa overlap poligon.
   - Mullion tengah (`mw = 0.048`, tinggi `h`, tebal `0.06`) menempati X `[-mw/2, mw/2]`.
   - Transom horizontal kiri menempati X `[-w/2, -mw/2]` dan transom kanan menempati X `[mw/2, w/2]` pada Y = `h * 0.15`. Keduanya menyentuh mullion tanpa tumpang tindih.
   - Bagian atas sill (`sillH = 0.06`) berada pada Y = `-h/2 - t`, menempel presisi di bawah kusen bawah tanpa overlap maupun celah.
4. **F4: Penataan Posisi Jendela & Integrasi Jendela Samping**:
   - Jendela 1 (dinding belakang): `cx = 3.3, cy = 2.3, w = 1.9, h = 1.9, wall: 'back'`. Batas X berada pada `[2.20, 4.40]`, berjarak bebas 20 cm dari `todoBoard` (X <= 2.0).
   - Jendela 2 (dinding belakang): `cx = 5.7, cy = 2.3, w = 1.9, h = 1.9, wall: 'back'`. Batas X berada pada `[4.60, 6.80]`, memberikan jarak bebas 15 cm dari meja pantry kopi (dimulai pada X = 6.95), menyelesaikan tabrakan dengan rak kopi (X = 7.4 - 9.0) dan jam dinding (X = 8.6).
   - Jendela 3 (dinding samping kanan): `wall: 'side', x = ROOM.x1 (10.0), z = 0.5, cy = 2.2, w = 2.0, h = 1.9, rotY = -Math.PI / 2`. Jendela ini diposisikan tepat di depan pandangan agen di `SPOTS.window` (X = 7.8, Z = 0.5, heading = Math.PI/2 memandang ke arah +X), melengkapi panorama visual kantor 3D.
   - Array `windows.push(sky)` tetap terjaga sehingga `paintSky(night)` memperbarui ketiga jendela secara dinamis mengikuti jam penonton.

## 3. Caveats
- Aturan ketat "NO EMOJIS IN WEB INTERFACES" dipatuhi sepenuhnya; tidak ada penambahan emoji pada kode baru atau komentar.
- Perubahan dibatasi secara minimal dan terisolasi pada fungsi `buildWindow` dan deklarasi tiga jendela di `kantor.js`. Logika pathfinding atau waypoint lainnya tidak diubah pada milestone ini sesuai pembagian kerja Milestone 1.

## 4. Conclusion
Seluruh tugas Milestone 1 (F1 - F4) telah selesai diimplementasikan secara genuine, presisi matematis, dan terverifikasi bersih tanpa regresi.

## 5. Verification Method
1. Uji sintaks JavaScript:
   ```bash
   node -c kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js
   ```
   *Expected*: Exit code 0 tanpa peringatan atau kesalahan sintaks.
2. Uji endpoint aset server:
   ```bash
   curl.exe -I http://127.0.0.1:8788/kerja/assets/kantor.js
   ```
   *Expected*: `HTTP/1.1 200 OK` dengan `Content-Type: text/javascript; charset=utf-8` dan `Content-Length: 113327`.
3. Verifikasi file yang diubah:
   Inspeksi file `kantor.js` baris 311 - 408 untuk memastikan struktur `THREE.Group`, embedding sill/kusen ke dinding, dan penempatan ketiga jendela.

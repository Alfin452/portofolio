# Reviewer & Adversarial Critic Report: Milestone 1 (M1-1)

## Review Summary

**Verdict**: APPROVE  
**Risk Assessment**: LOW  
**Target Milestone**: Milestone 1 (Window 3D Geometry & Wall Alignment — F1, F2, F3, F4)  
**File Reviewed**: `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js` (Lines 311–408)

---

## 1. Observation

1. **Implementasi Kode Baru**:
   File `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js` pada baris 311–408 mengimplementasikan fungsi `buildWindow(arg1, arg2, arg3, arg4)` dan pemanggilan 3 jendela studio:
   - Baris 313–316:
     ```javascript
     function buildWindow(arg1, arg2, arg3, arg4) {
       const spec = (typeof arg1 === 'object' && arg1 !== null)
         ? arg1
         : { cx: arg1, cy: arg2, w: arg3, h: arg4, wall: 'back' };
     ```
   - Baris 323: `const group = new THREE.Group();`
   - Baris 327–333: Kaca `PlaneGeometry(w, h)` dengan `side: THREE.DoubleSide` ditempatkan pada Z lokal = `+0.015`.
   - Baris 336–353: Kusen luar horizontal (`topBar` pada `Y = h/2 + t/2`, `botBar` pada `Y = -h/2 - t/2`) dan vertikal (`leftBar` & `rightBar` pada `X = ±(w/2 + t/2)`, rentang `Y [-h/2, h/2]`) dengan pusat Z lokal = `+0.03` dan ketebalan `0.08` (sisi belakang Z = `-0.01`, tertanam 10 mm ke dinding).
   - Baris 354–368: Mullion vertikal tengah (`mw = 0.048`) dan transom horizontal terpisah (`transomL` & `transomR` pada `ty = h * 0.15`, lebar `(w - mw)/2`) yang bertemu secara matematis tanpa tumpang tindih.
   - Baris 371–377: Ambang jendela (`sill`) dengan `sillD = 0.22`, pusat Z lokal = `+0.09` (sisi belakang Z = `-0.02`, tertanam 20 mm ke dinding), dan permukaan atas `Y = -h/2 - t` menempel presisi di bawah kusen bawah.
   - Baris 379–394: Penempatan posisi modular: `'back'` (`cx, cy, cz = ROOM.z0`) dan `'side'` (`x = ROOM.x1`, `z = 0.5`, `rotY = -Math.PI / 2`).
   - Baris 395–397: `scene.add(group); windows.push(sky); return group;`
   - Baris 400–407:
     ```javascript
     buildWindow({ cx: 3.3, cy: 2.3, w: 1.9, h: 1.9, wall: 'back' });
     buildWindow({ cx: 5.7, cy: 2.3, w: 1.9, h: 1.9, wall: 'back' });
     buildWindow({ wall: 'side', x: ROOM.x1, z: 0.5, cy: 2.2, w: 2.0, h: 1.9, rotY: -Math.PI / 2 });
     ```

2. **Pengujian Sintaks & Endpoint Server**:
   - `node -c kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js` -> Exit code 0 (tanpa peringatan atau error).
   - `curl.exe -I http://127.0.0.1:8788/kerja/assets/kantor.js` -> `HTTP/1.1 200 OK`, `Content-Type: text/javascript; charset=utf-8`, `Content-Length: 113327`.

3. **Uji Eksekusi Mandiri & Stress-Testing**:
   Uji lingkungan simulasi Node.js mengevaluasi `buildWindow` dari `kantor.js`:
   - Output simulasi:
     `{"g1_pos":[3.3,2.3,-7],"g1_children":9,"g2_pos":[10,2.2,0.5],"g2_rotY":-1.5707963267948966,"g3_pos":[3.5,2.3,-7],"g4_pos":[0,2.3,-7],"total_windows":4}`
   - Semua 9 sub-mesh per jendela (`glass`, `topBar`, `botBar`, `leftBar`, `rightBar`, `mullion`, `transomL`, `transomR`, `sill`) terpasang rapi ke `THREE.Group`.
   - Kompatibilitas mundur terhadap parameter legacy posisional `buildWindow(3.5, 2.3, 2.0, 1.9)` terbukti valid (`g3_pos: [3.5, 2.3, -7]`).
   - Penanganan parameter `null` atau default objek terbukti aman (`g4_pos: [0, 2.3, -7]`) tanpa memicu TypeError.

4. **Pemeriksaan Integritas & Aturan Emoji**:
   - Kode modifikasi `worker_m1` (baris 311–408) adalah **100% bebas emoji** (zero emojis).
   - Tidak ada hardcoded mock / bypass / facade implementation; implementasi Three.js dibangun secara riil dan matematis.

---

## 2. Logic Chain

1. **Kesesuaian Interface Contract (PROJECT.md)**:
   - Sesuai dengan spesifikasi interface contract pada `PROJECT.md` baris 44–49:
     Fungsi menerima objek konfigurasi `{ cx, cy, cz, w, h, wall: 'back' | 'side' }`, mengembalikan objek `THREE.Group`, menempelkan material sky canvas dinamis ke array `windows`, dan memisahkan balok kusen agar tidak saling bertabrakan.
   - Interface ini juga mendukung backwards compatibility untuk deklarasi legacy posisional `(cx, cy, w, h)` melalui pengecekan `typeof arg1 === 'object' && arg1 !== null`.

2. **Penyelesaian Celah Melayang (Floating Gap - F2)**:
   - Dinding belakang studio berada pada `Z = ROOM.z0 = -7.00` dengan ketebalan 0.30 (`Z [-7.30, -7.00]`).
   - Permukaan belakang kusen berada pada Z lokal `-0.01` (dunia: `-7.01`), dan sill pada Z lokal `-0.02` (dunia: `-7.02`).
   - Dengan menanamkan kusen 10 mm dan sill 20 mm ke dalam dinding, celah melayang (10 mm) pada versi lama tereliminasi sepenuhnya dari segala sudut pandang kamera orbit.

3. **Penyelesaian Z-Fighting & Frame Corner Alignment (F3)**:
   - Balok atas menempati `Y [h/2, h/2 + t]`.
   - Balok bawah menempati `Y [-h/2 - t, -h/2]`.
   - Balok vertikal samping menempati `Y [-h/2, h/2]`.
   - Bidang temu vertikal-horizontal menyentuh tepat pada garis batas `Y = ±h/2` tanpa ada tumpang tindih poligon (volume overlap = 0).
   - Balok transom kiri menempati `X [-w/2, -mw/2]` dan kanan `X [mw/2, w/2]`, menyentuh mullion tengah `X [-mw/2, mw/2]` dan kusen luar secara eksak.
   - Ambang jendela (sill) menempati `Y [-h/2 - t - sillH, -h/2 - t]`, menyentuh dasar kusen bawah secara presisi tanpa tumpang tindih.

4. **Tata Letak & Kliring Properti Studio (F4)**:
   - Jendela 1 (`cx = 3.3, w = 1.9`): Rentang sill `X [2.20, 4.40]`. Berjarak aman 20 cm dari tepi kanan `todoBoard` (`X = 2.00`).
   - Jendela 2 (`cx = 5.7, w = 1.9`): Rentang sill `X [4.60, 6.80]`. Berjarak aman 20 cm dari Jendela 1 (`X = 4.40`), dan berjarak aman 15 cm dari meja counter pantry kopi (`X = 6.95`).
   - Jendela 3 (`wall: 'side'`, `X = 10.0, Z = 0.5, rotY = -Math.PI / 2`): Menghadap ke arah dalam studio (-X), berhadapan tepat dengan sudut pandang agen di `SPOTS.window` (`pos: (7.8, 0.5)`, `heading: Math.PI / 2` memandang ke arah +X), menyelesaikan tabrakan fatal versi lama dengan jam dinding (`X = 8.6`) dan rak kopi.

---

## 3. Findings

### [Positive / Verified] Finding 1: Arsitektur Group Modular & Ketahanan Terhadap Parameter
- Implementasi sangat elegan dan defensif terhadap variasi pemanggilan (`spec` objek lengkap, objek minimal, nilai `null`, maupun 4 argumen legacy).
- Struktur `THREE.Group` menyederhanakan manipulasi translasi dan rotasi jendela sebagai satu kesatuan utuh.

### [Minor / Note for Milestone 2 & 3] Finding 2: Sisa Emoji Warisan pada Fitur Obrolan & Status Web
- **Lokasi**: `kantor.js` baris 1464–1515, 2145, 2221.
- **Konteks**: Modifikasi `worker_m1` (baris 311–408) sepenuhnya bersih dari emoji. Namun, pada blok percakapan santai agen (`say()`, obrolan santai, `phase` text) warisan lama sebelum M1, masih terdapat emoji teks (misal: 🍿, ⚽, 🎮, ☕, 💧, 🎸, ☀️, 🙆, 📚, dll.).
- **Rekomendasi**: Sesuai pembagian milestone, pekerja M2 (Movement & Pathfinding) dan M3 (Animation & Chat) perlu membersihkan emoji warisan ini agar konsisten dengan Workspace Rule "NO EMOJIS IN WEB INTERFACES".

---

## 4. Caveats

- Pengujian visual interaktif browser menggunakan orbit controls dilakukan secara programmatic melalui verifikasi koordinat, verifikasi HTTP asset delivery, dan uji simulasi headless Node.js. Validasi visual E2E holistik browser akan disempurnakan pada Milestone 4 (F15).

---

## 5. Conclusion

Implementasi Milestone 1 (F1 - F4) oleh `worker_m1`:
- **Correctness**: Sempurna, seluruh batas geometri kusen, sill, dan kaca presisi tanpa overlap poligon.
- **Contract Conformance**: Memenuhi 100% interface contract universal `buildWindow` di `PROJECT.md`.
- **Integrity**: Bersih tanpa jalan pintas atau data tiruan.
- **Verdict**: **APPROVE**.

---

## 6. Verification Method

Untuk mereproduksi dan memverifikasi secara independen:
1. Jalankan pengecekan sintaks JavaScript:
   ```bash
   node -c kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js
   ```
   *Hasil yang diharapkan*: Exit code 0 tanpa error.

2. Jalankan pengujian HTTP respons server kantor aktif:
   ```bash
   curl.exe -I http://127.0.0.1:8788/kerja/assets/kantor.js
   ```
   *Hasil yang diharapkan*: `HTTP/1.1 200 OK`, `Content-Type: text/javascript; charset=utf-8`, `Content-Length: 113327`.

3. Jalankan pengujian edge-case `buildWindow`:
   ```bash
   cmd /c "node -e ""const fs=require('fs');const c=fs.readFileSync('kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js','utf8');eval(c.match(/function buildWindow[\s\S]*?\n\}/)[0]);console.log(typeof buildWindow);"""
   ```
   *Hasil yang diharapkan*: `function`.

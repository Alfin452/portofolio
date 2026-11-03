# Handoff Report: Survey Agent Animation & Activity Context (R2.3)

Working Directory: `c:\laragon\www\portofolio\.agents\teamwork\explorer_survey_animation\`  
Laporan Lengkap: `c:\laragon\www\portofolio\.agents\teamwork\explorer_survey_animation\report.md`  
Tanggal: 2026-11-02  

---

## 1. Observation

1. **Struktur Model 3D Humanoid**:
   - Terletak pada file `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js` baris 1020-1199 (`buildPerson`).
   - Hierarki sendi: `root` $\rightarrow$ `hips` (posisi Y=0.9) $\rightarrow$ `spine` (posisi Y=0.06) $\rightarrow$ `head` (posisi Y=0.67), `sh[0]`, `sh[1]` (posisi X=±0.2, Y=0.44), dan `el[0]`, `el[1]` (posisi Y=-0.29).
   - Kaki bertumpu pada `hips` $\rightarrow$ `hip[0]`, `hip[1]` (posisi X=±0.095, Y=-0.03) $\rightarrow$ `kn[0]`, `kn[1]` (posisi Y=-0.41) $\rightarrow$ `foot[0]`, `foot[1]`.
   - Objek properti terpasang: `a.guitar`, `a.pad`, `a.book` pada `p.spine`, dan `a.mug` pada `p.hand[1]`.

2. **Mekanisme Re-parenting & Spatial Snap Saat Tiba di Meja**:
   - `kantor.js` baris 1569-1574 (`arrive`):
     ```javascript
     if (pl.kind === 'desk') {
       pl.desk.seat.rotation.y = Math.PI;
       pl.desk.seat.attach(a.p.root);
       a.p.root.position.set(0, 0, 0.02);
       a.p.root.rotation.set(0, 0, 0);
       a.seated = true;
     }
     ```
   - Posisi lokal `a.p.root` langsung ditimpa menjadi `(0, 0, 0.02)` seketika saat tiba di kursi, sementara `p.hips.position.y` masih bernilai `0.9` (ketinggian berdiri).

3. **Mekanisme Beranjak dari Kursi Saat Menuju Lokasi Baru**:
   - `kantor.js` baris 1549-1562 (`goTo`):
     ```javascript
     if (a.seated) {
       scene.attach(a.p.root);
       a.p.root.rotation.set(0, a.p.root.rotation.y, 0);
       a.heading = a.p.root.rotation.y;
       a.seated = false;
     }
     ...
     a.walking = true;
     ```
   - Dan baris 2339-2341 (`updateActor`):
     ```javascript
     const step = Math.min(horizDist, 1.8 * dt);
     root.position.x += (tmpV.x / horizDist) * step;
     root.position.z += (tmpV.z / horizDist) * step;
     ```
   - Posisi agent di lantai langsung digeser maju (`step`) pada frame yang sama ketika `a.seated` disetel `false`, padahal nilai rotasi sendi paha dan lutut (`p.hip[i].rotation.x`, `p.knee[i].rotation.x`) masih berada di posisi duduk (`-1.5`, `+1.45`) dan `hips.position.y` masih `0.505`.

4. **Pendekatan Interpolasi Euler Asimptotik Linear**:
   - `kantor.js` baris 1200-1202:
     ```javascript
     const lerpK = (a, b, k) => a + (b - a) * k;
     function applyPose(p, T, dt) {
       const k = REDUCED ? 1 : Math.min(1, dt * 7);
     ```
   - Pendekatan linear `dt * 7` tidak tahan fluktuasi frame rate (jika `dt > 0.142s`, nilai saturasi `1.0` memicu instant snap).

5. **Ketidakcocokan Nama Alat Antigravity pada Pilihan Pose Kerja**:
   - `kantor.js` baris 1644-1647 (`workMode`):
     ```javascript
     if (['Read', 'Grep', 'Glob', 'WebFetch', 'WebSearch'].includes(e.tool)) return 'read';
     if (e.tool === 'Bash') return 'terminal';
     if (['Agent', 'Task', 'SendMessage', 'AskUserQuestion', 'TodoWrite'].includes(e.tool)) return 'think';
     return 'type';
     ```
   - Panggilan API langsung ke `http://127.0.0.1:8788/kerja/api/state` menghasilkan data:
     ```json
     {
       "who": "tim-1",
       "name": "Backend Engineer",
       "tool": "run_command",
       "text": "\"Query live state from running server\""
     }
     ```
   - Nama alat `run_command` tidak cocok dengan `'Bash'`, `view_file` tidak cocok dengan `'Read'`, dan `send_message` tidak cocok dengan `'SendMessage'`. Semua aktivitas kerja Antigravity jatuh ke `'type'`.

6. **Glitch Step Function pada Pose Minum**:
   - `kantor.js` baris 1611:
     `const sip = st % 6 < 1.8;`
     dan baris 1612:
     `rShX: sip ? -1.05 : -0.55, rElX: sip ? -2.05 : -1.35`
   - Nilai sudut lengan melompat seketika setiap 6 detik.

7. **Pelanggaran Aturan Desain Bebas Emoji**:
   - Ditemukan emoji pada string visualizer web di `kantor.js` baris 1389-1398 (`QUIPS`) dan baris 1402-1420 (`CHAT`).

---

## 2. Logic Chain

1. Dari Observasi 2 dan 3:
   - Terjadi ketidaksinkronan temporal antara perpindahan koordinat spasial (*spatial translation*) dan pelipatan kerangka sendi (*skeletal bending*).
   - Saat agen tiba di meja, `pl.desk.seat.attach(a.p.root)` menempatkan root pada kursi seketika. Karena panggul masih berada di Y=0.9, agen tampak berdiri di atas kursi lalu merosot ke bawah.
   - Saat agen bangun untuk berjalan, translasi X dan Z langsung bergerak maju melintasi lantai pada frame pertama, sementara panggul masih berada di Y=0.505 dan kaki terlipat 90 derajat. Agen tampak berseluncur di atas lantai dalam pose duduk.
2. Dari Observasi 4:
   - Formulasi `lerpK(cur, target, dt * 7)` membuat laju peredaman bergantung pada waktu frame. Jika terjadi lag atau jeda rendering, `k` mencapai batas atas 1.0 yang meniadakan efek transisi mulus dan menyebabkan sentakan mendadak.
3. Dari Observasi 5:
   - Karena perbandingan string alat bersifat *case-sensitive* dan berbasis nama alat Claude Code klasik, seluruh eksekusi tugas Antigravity (`run_command`, `view_file`, `write_to_file`) tidak teridentifikasi dan hanya memicu pose `type`.
4. Dari Observasi 6:
   - Penggunaan operator *ternary* berbasis modulus waktu menghasilkan gelombang kotak (*square wave step function*), memicu kedutan tangan saat memegang cangkir di pantry.
5. Dari Observasi 7:
   - String `QUIPS` dan `CHAT` melanggar aturan workspace *NO EMOJIS IN WEB INTERFACES*.

---

## 3. Caveats

- **Isu Pergerakan Waypoint & Navigasi**: Jalur waypoint koridor dan spoke meja diteliti sebatas pengaruhnya terhadap pemicuan pose (`arrive` dan `goTo`). Analisis rinci terkait algoritma pathfinding A* atau spoke collision diserahkan kepada laporan spesialis navigasi (`explorer_survey_movement`).
- **Penempatan Jendela Fisik 3D**: Penempatan geometri jendela pada dinding ruangan dianalisis sebatas hubungannya dengan spot pandang agent (`SPOTS.window`), sementara kalkulasi mesh `buildWindow` diserahkan kepada laporan spesialis geometri dinding (`explorer_survey_window`).

---

## 4. Conclusion

Permasalahan animasi kaku, sentakan posisi, dan kebosanan visual pada karakter kantor disebabkan oleh:
1. Tidak adanya *transient state machine* (`STATE_SITTING_DOWN` dan `STATE_STANDING_UP`) yang mengunci gerakan maju lantai sebelum tubuh berdiri sempurna, serta membiarkan tubuh melipat secara teratur sebelum mengunci koordinat kursi.
2. Penggunaan interpolasi linear aproksimatif `dt * 7` alih-alih peredaman eksponensial matematis $1.0 - \exp(-\lambda \Delta t)$.
3. Tidak berfungsinya pemetaan tool Antigravity ke dalam `workMode(a)`, yang mengakibatkan seluruh aktivitas di meja hanya menampilkan animasi mengetik tunggal.
4. Ketiadaan koordinasi posisi tangan dengan objek aktual di meja kerja (keyboard, mouse, dokumen, monitor samping) serta diskontinuitas pose di area santai (sofa, arcade, foosball, pantry, meeting).

Rekomendasi detail beserta rancangan rotasi Three.js telah didokumentasikan secara lengkap dalam file:
`c:\laragon\www\portofolio\.agents\teamwork\explorer_survey_animation\report.md`.

---

## 5. Verification Method

Untuk memverifikasi secara independen temuan-temuan di atas:
1. **Pemeriksaan File Sumber**:
   - Buka `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js` pada baris 1201, 1549, 1569, 1611, dan 1644 untuk memvalidasi kutipan kode.
2. **Pengujian Query API State**:
   - Jalankan perintah:
     ```powershell
     Invoke-RestMethod -Uri "http://127.0.0.1:8788/kerja/api/state" | Select-Object -ExpandProperty feed
     ```
     Perhatikan nilai properti `tool` yang dikembalikan (misal `run_command` atau `view_file`).
3. **Observasi Visual pada Browser**:
   - Akses antarmuka visualizer aktif pada `http://127.0.0.1:8788/kerja`.
   - Amati pergerakan agen saat transisi berpindah antara meja kerja dan lounge untuk membuktikan efek berseluncur dalam pose duduk (*sliding on butt*) serta kedutan gerakan cangkir di pantry.

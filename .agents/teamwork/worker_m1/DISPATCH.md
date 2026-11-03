## 2026-11-02T00:08:27Z
Anda adalah teamwork_worker (Window Geometry Worker).
Working directory Anda: c:\laragon\www\portofolio\.agents\teamwork\worker_m1\

BACA TERLEBIH DAHULU:
1. Wajib membaca ORIGINAL_REQUEST.md di: c:\laragon\www\portofolio\.agents\teamwork\ORIGINAL_REQUEST.md
2. Wajib membaca master plan PROJECT.md di: c:\laragon\www\portofolio\PROJECT.md
3. Wajib membaca laporan survei geometri jendela di: c:\laragon\www\portofolio\.agents\teamwork\explorer_survey_window\report.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

ATURAN MUTLAK UI:
- NO EMOJIS IN WEB INTERFACES: Dilarang keras menggunakan emoji apa pun di dalam kode, teks antarmuka, layout, atau komponen.

File Hak Milik Penulisan (Exclusive Write Ownership):
`c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js`

Tugas Implementasi Milestone 1 (F1 - F4):
1. Redesain fungsi `buildWindow` menjadi modular berbasis `THREE.Group` yang mendukung dinding belakang (`wall: 'back'`) dan dinding samping kanan (`wall: 'side'`).
2. Hilangkan floating gap: Pastikan sisi belakang kusen dan sill menembus/tertanam 10-20 mm ke dalam dinding (Z lokal < 0) sehingga tidak ada celah melayang dari sudut kamera mana pun. Kaca (`PlaneGeometry`) ditempatkan rapi di dalam saku kusen.
3. Hilangkan Z-fighting dan clipping pada sudut kusen dengan memisahkan dimensi balok horizontal dan vertikal tanpa tumpang tindih poligon.
4. Koreksi posisi dan tata letak jendela:
   - Jendela 1 (dinding belakang): cx = 3.3, cy = 2.3, w = 1.9, h = 1.9.
   - Jendela 2 (dinding belakang): cx = 5.7, cy = 2.3, w = 1.9, h = 1.9 (memberi jarak aman bebas 15 cm dari meja pantry kopi X=6.95, menyelesaikan tabrakan rak kopi & jam dinding).
   - Jendela 3 (dinding samping kanan): wall: 'side', x = ROOM.x1 (10.0), z = 0.5, cy = 2.2, w = 2.0, h = 1.9, rotasi Y = -Math.PI / 2. Jendela ini berada tepat di depan pandangan agen di `SPOTS.window` (X=7.8, Z=0.5, heading=Math.PI/2 memandang ke arah +X).
5. Verifikasi kode:
   - Uji sintaks JavaScript (misal via `node -c` pada file yang diubah).
   - Pastikan server http://127.0.0.1:8788/kerja merespons dengan normal tanpa error sintaks di browser.

Deliverable:
Tulis laporan hasil kerja dan verifikasi di `handoff.md` di working directory Anda (`.agents/teamwork/worker_m1/handoff.md`).
Setelah selesai, kirim pesan ringkasan kembali via `send_message`.

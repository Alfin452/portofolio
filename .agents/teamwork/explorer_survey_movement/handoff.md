# HANDOFF REPORT: SURVEY AGENT MOVEMENT & PATHFINDING (R2.1 & R2.2)

Handoff Type: Hard (Task Complete)
Investigator: Teamwork Explorer (Survey Agent Movement & Pathfinding)
Working Directory: `c:\laragon\www\portofolio\.agents\teamwork\explorer_survey_movement\`
Date: 2026-11-02

---

## 1. OBSERVATION

1. Berkas `kantor-agent/skills/kantor-agent/runtime/public/assets/kantor.js`:
   - Baris 1358-1359: Menyatakan desain sistem jalur: "Setiap tempat punya spoke: titik pertama di koridor, lalu titik-titik sampai posisi akhir. Rute A ke B = mundur lewat spoke A ke koridor -> sepanjang koridor -> maju lewat spoke B. Bebas tabrakan dengan perabot."
   - Baris 1360-1385: Definisi `PLACES` dan `SPOTS`. Titik spoke spot (`tv`, `ps`, `arcade`, `foosball1`, `window`, dsb.) berada pada koordinat Z antara `0.2` hingga `2.8`, bukan pada `CORRIDOR_Z = -2.1`.
   - Baris 1370-1371:
     `tv: { pos: V(6.2, 1.35), heading: 0, spoke: [V(6.2, 0.2), V(5.5, 0.2)], sit: 'sofa' },`
     `ps: { pos: V(7.4, 1.35), heading: 0, spoke: [V(7.4, 0.2), V(5.5, 0.2)], sit: 'sofa' },`
     Urutan spoke terbalik dari dekat sofa ke lorong, bukan dari lorong masuk ke depan sofa.
   - Baris 1537: `if (a.goal === placeId) return;` langsung keluar tanpa memeriksa `a.walking` atau apakah agen macet di tengah jalan.
   - Baris 1543-1544: `if (a.walking) esc0 = a.path[a.i]?.esc ?? [];`
   - Baris 1555-1558: Rute baru dibentuk dengan:
     `const path = esc0.map((p, k) => ({ p, esc: esc0.slice(k) }));`
     `path.push({ p: pl.spoke[0], esc: [] });`
     Tidak ada waypoint koridor penghubung antara `esc0` dan `pl.spoke[0]`.
   - Baris 1565-1581 (`arrive`): Saat tiba di spot, `a.spotUntil` tidak diperbarui; `a.p.root.position` tidak diselaraskan ke `pl.pos`.
   - Baris 1669 (`lounge`): `a.spotUntil = now + (REDUCED ? 90000 : 38000 + Math.random() * 34000);` dipasang di awal langkah sebelum agen sampai.
   - Baris 2024-2037: `const working = m.state === 'bekerja';` mengabaikan status `selesai`, menyebabkan agen langsung diarahkan ke lounge tanpa masa standby di meja kerja.
   - Baris 2336-2348 (`updateActor`): Translasi `step = Math.min(horizDist, 1.8 * dt)` dieksekusi simultan dengan `a.heading = turnTo(a.heading, Math.atan2(tmpV.x, tmpV.z), dt * 7)` tanpa mempertimbangkan deviasi sudut arah gerak, menghasilkan efek strafing meluncur miring.

2. Berkas `kantor-agent/skills/kantor-agent/runtime/lib/node/office.mjs`:
   - Baris 60-71: Logika cooldown standby di meja kerja:
     `const isActivelyWorking = !isMemberExpired && (act.active_role === name || tData.state === 'bekerja');`
     `const inCooldown = !isMemberExpired && tAge <= 120 * 1000;`
     `else if (inCooldown && (tData.state === 'selesai' || tData.state === 'bekerja' || tData.updated)) {`
     `  state = 'selesai'; // Tetap di meja kerja (standby)`
     `}`
   - Baris 236-244: Scanner Antigravity memetakan peran ke `Frontend Engineer`, `UI/UX Designer`, `Backend Engineer`, `QA & Auditor`.

3. Konfigurasi dan API:
   - File `.claude/kantor-agent.json` mengonfigurasi `ketua: "Product Manager"`, `team: ["UI/UX Designer", "Backend Engineer", "Frontend Engineer", "QA & Auditor"]`.
   - Hasil eksekusi `Invoke-RestMethod -Uri "http://127.0.0.1:8788/kerja/api/state"` menunjukkan data real-time aktif dengan `Frontend Engineer` berstatus `bekerja` pada `tim-2` (meja A3).

---

## 2. LOGIC CHAIN

1. Dari Observasi 1 (baris 1555-1558) dan Observasi 1 (baris 1360-1385):
   Ketika agen berpindah dari area kerja (`Z = -2.1` atau `Z = -4.3`) ke area lounge (`Z > 0`), jalur hanya berisi `[esc0..., pl.spoke[0], ...]`. Karena tidak ada titik perantara di lorong vertikal (seperti `X = 3.2`), agen ditarik dalam garis diagonal lurus memotong Meja Cadangan Row B (B0 hingga B3, `Z = -0.7`) beserta layar monitor dan kursinya.

2. Dari Observasi 1 (baris 1370-1371):
   Pada spot `tv` dan `ps`, spoke pertama didefinisikan di `(6.2, 0.2)` dan spoke kedua di `(5.5, 0.2)`. Karena sofa berada di `Z = 1.35` dan akses lorong di `X = 5.5`, agen bergerak maju ke depan sofa, mundur ke lorong, lalu maju kembali ke sofa. Ini menjelaskan fenomena gerakan anomali dan ragu-ragu saat agen menuju sofa.

3. Dari Observasi 1 (baris 1669) dan Observasi 1 (baris 1565-1581):
   `a.spotUntil` ditetapkan saat `lounge()` dipanggil. Jika waktu tempuh dari meja ke spot adalah 15-30 detik (atau terjadi lag frame), saat agen memanggil `arrive()`, waktu tersisa untuk `a.spotUntil` hampir habis atau sudah lampau. Pada frame berikutnya, kondisi `!a.walking && now >= a.spotUntil` langsung aktif kembali, memicu pemanggilan `lounge()` baru secara berantai. Ini adalah penyebab langsung siklus marathon tanpa henti di mana agen tidak pernah menetap di tempat santai.

4. Dari Observasi 1 (baris 1537):
   Pemeriksaan `if (a.goal === placeId) return;` hanya memeriksa identitas target tanpa memverifikasi apakah agen sedang berhenti atau mengalami hambatan koordinat. Jika terjadi interupsi sesaat, agen terjebak di tengah jalan tanpa bisa dipulihkan oleh pemanggilan navigasi baru dengan tujuan yang sama.

5. Dari Observasi 1 (baris 2336-2348):
   Karakter ditranslasikan dengan kecepatan penuh `1.8 * dt` ke arah vektor tujuan sementara sudut tubuh `turnTo` berputar secara gradual dengan laju `dt * 7`. Ketika agen berbelok 90 derajat di koridor, agen meluncur menyamping sebelum badannya berputar menghadap arah jalan (strafing kaku). Selain itu, kalkulasi `Math.atan2` pada jarak mendekati threshold 0.05 meter menghasilkan noise orientasi yang memicu kedutan (jitter) visual.

6. Dari Observasi 2 (baris 60-71) dan Observasi 1 (baris 2024-2037):
   Backend mengirimkan status `selesai` agar agen standby di meja kerja selama 120 detik masa cooldown. Namun, frontend mensyaratkan `m.state === 'bekerja'` untuk menetapkan `a.work = true`. Akibatnya, agen yang berstatus `selesai` langsung dipaksa meninggalkan mejanya menuju lounge.

---

## 3. CAVEATS

1. Aspek geometri jendela 3D (R1) berada di luar cakupan investigasi ini dan ditangani secara terpisah oleh Explorer Geometry.
2. Kode visualizer Three.js berjalan pada lingkungan browser klien. Pengujian interaktivitas dinamis dapat dipantau langsung pada antarmuka web `http://127.0.0.1:8788/kerja`.
3. Tidak ditemukan ketergantungan paket pihak ketiga tambahan (Three.js dan modul kontrol telah tersedia secara vendor lokal di berkas runtime).

---

## 4. CONCLUSION

Akar masalah pergerakan, jalan menembus meja, karakter freeze/stuck, siklus navigasi marathon, dan kekakuan animasi berakar pada ketiadaan topologi graf koridor penghubung (highway network), kekeliruan urutan waypoint sofa, penentuan waktu tunggu lounge yang prematur, penanganan interupsi navigasi tanpa pembersihan escape path, serta ketidaksinkronan status `selesai` antara backend dan frontend.
Seluruh masalah dapat diselesaikan dengan aman pada tingkat frontend `kantor.js` dan sinkronisasi status di `office.mjs` tanpa merombak arsitektur Three.js yang sudah ada.

---

## 5. VERIFICATION METHOD

1. Verifikasi Data Backend:
   Jalankan perintah PowerShell:
   `Invoke-RestMethod -Uri "http://127.0.0.1:8788/kerja/api/state" | ConvertTo-Json -Depth 3`
   Pastikan properti `ketua`, `team`, dan `runs` terkirim dengan struktur JSON yang valid.

2. Verifikasi Visual Langsung:
   Buka browser pada alamat `http://127.0.0.1:8788/kerja#debug`.
   Di konsol pengembang browser, periksa array aktor via `window.__kantor.actors()`:
   - Amati koordinat `pos` dan status `walking`, `goal`, dan `i`.
   - Pastikan agen berpindah antar-zona (dari Row A ke Lounge) melalui koridor `X = 3.2` tanpa menabrak meja Row B.
   - Pastikan saat tiba di sofa TV/PS, agen tidak lagi melakukan osilasi maju-mundur.
   - Pastikan agen berdiam di spot santai minimal 38 detik sebelum berpindah lagi.
   - Pastikan agen di meja kerja yang berstatus `selesai` tetap duduk standby selama masa cooldown.

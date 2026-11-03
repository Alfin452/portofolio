# DISPATCH: Survey Agent Animation & Activity Poses
Target Directory: .agents/teamwork/explorer_survey_animation/
Original Request: c:\laragon\www\portofolio\.agents\teamwork\ORIGINAL_REQUEST.md


## 2026-11-01T23:51:49Z
Sender: 6f8c9bdd-d8e7-449e-8edd-35e6113ff349
Priority: MESSAGE_PRIORITY_HIGH

Anda adalah teamwork_explorer (Survey Agent Animation & Activity Context).
Working directory Anda: c:\laragon\www\portofolio\.agents\teamwork\explorer_survey_animation\

BACA TERLEBIH DAHULU:
Wajib membaca ORIGINAL_REQUEST.md di: c:\laragon\www\portofolio\.agents\teamwork\ORIGINAL_REQUEST.md

Fokus Investigasi: R2.3. Sistem Animasi & Variasi Pose Dinamis Sesuai Aktivitas Kerja/Santai.
Periksa dan analisis secara mendalam:
1. c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js:
   - Struktur 3D model agen Three.js (mesh, bones, limbs: torso, head, arms, legs, accessories).
   - Animasi saat ini: walkPose, spotPose, SEATED, dan fungsi animasi lainnya.
   - Mengapa animasi kaku, atau terjadi kedutan/jitter/glitch saat transisi antara berjalan dan stasioner/duduk.
   - Kebutuhan pose dinamis sesuai aktivitas dan spot:
     * Meja kerja: mengetik di keyboard, fokus layar, membaca dokumen, memegang mouse.
     * Area santai/rekreasi: sofa (duduk santai, bersandar), pantry (minum kopi/cangkir, berdiri santai), arcade (tangan di joystick/tombol arcade), foosball (tangan memegang handle meja foosball).
     * Diskusi / meeting: gestur berbicara, mengangguk.
   - Mekanisme interpolasi pose (lerp / slerp rotasi sendi) agar transisi pose berlangsung mulus tanpa snap mendadak.
2. c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\lib\node\office.mjs:
   - Data aktivitas/status/task apa yang disediakan backend untuk agen (misal task, activity, status, role) yang bisa dijadikan trigger variasi pose.

ATURAN MUTLAK:
- NO EMOJIS (jangan gunakan emoji apa pun).
- Jangan memodifikasi file source code (Anda read-only explorer).

Deliverable:
Tulis laporan investigasi mendalam dengan rancangan matematis / rotasi Three.js dan rekomendasi perbaikan di:
c:\laragon\www\portofolio\.agents\teamwork\explorer_survey_animation\report.md
Dan tulis handoff.md di working directory Anda.
Setelah selesai, kirim pesan ringkasan kembali via send_message.

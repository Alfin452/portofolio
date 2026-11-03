Perbaiki bug posisi jendela di dinding dan perbaiki sistem pergerakan serta animasi agen agar tidak stuck dan gerakannya dinamis sesuai aktivitas pekerjaannya pada visualizer kantor 3D lingkungan kerja aktual.

Working directory: c:\laragon\www\portofolio
Integrity mode: development

## Context & References
- Visualizer frontend: `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\public\assets\kantor.js` dan `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\views\page.html`
- Runtime backend: `c:\laragon\www\portofolio\kantor-agent\skills\kantor-agent\runtime\lib\node\office.mjs`
- Server aktif: `http://127.0.0.1:8788/kerja`
- Tata ruang 3D: 1 Lantai Studio Terbuka (Y=0)

## Requirements

### R1. Penyesuaian Posisi Jendela 3D di Dinding
Periksa dan perbaiki kalkulasi koordinat penempatan jendela (`buildWindow` di `kantor.js`) agar menempel presisi pada dinding belakang (`ROOM.z0`) atau dinding pembatas samping studio terbuka tanpa celah melayang dan tanpa terpotong (clipping/z-fighting) oleh geometri dinding.

### R2. Perbaikan Pergerakan, Pathfinding, dan State Animasi Agent
Perbaiki logika pergerakan dan navigasi agen (`goTo`, `arrive`, `walkPose`, `spotPose`, `SEATED`, waypoint `PLACES` & `SPOTS` di `kantor.js` serta sinkronisasi dari `office.mjs`) sehingga:
1. Agen tidak pernah macet/stuck permanen di suatu titik atau terjebak dalam siklus navigasi tanpa akhir.
2. Pergerakan saat berpindah tempat terlihat luwes dan tidak kaku.
3. Pose dan animasi agen secara dinamis merefleksikan aktivitas atau peran pekerjaannya saat berada di lokasi tertentu (misalnya mengetik di meja kerja, membaca dokumen, berdiskusi, atau beristirahat di area santai seperti sofa, pantry, arcade, foosball).

## Acceptance Criteria

### Posisi Geometri Jendela
- [ ] Jendela pada scene 3D menempel tepat pada permukaan dinding ruangan (`ROOM.z0` atau dinding samping) tanpa celah melayang (floating).
- [ ] Tidak terjadi z-fighting atau clipping yang membuat jendela tampak terpotong oleh geometri dinding.
- [ ] Posisi dan elevasi vertikal jendela selaras dengan arsitektur 1 Lantai Studio Terbuka (Y=0).

### Navigasi dan Pathfinding Agent
- [ ] Agen berpindah dari titik awal ke titik tujuan (`PLACES` / `SPOTS`) tanpa berhenti mendadak atau freeze/stuck di tengah lintasan.
- [ ] Agen tidak menumpuk secara anomali pada satu titik koordinat yang sama saat menuju atau menduduki suatu tempat.
- [ ] Setelah mencapai titik tujuan, agen berhasil transisi ke status yang dituju (`arrive`, duduk di kursi, atau berdiri pada spot yang ditentukan).

### Animasi dan Konteks Pekerjaan
- [ ] Saat agen berada di meja kerja, animasi menampilkan pose aktivitas kerja (misalnya mengetik atau fokus bekerja).
- [ ] Saat agen berada di area santai atau rekreasi (sofa, pantry, arcade, foosball), animasi menampilkan pose rileks atau interaksi santai sesuai spot tersebut.
- [ ] Transisi antara animasi berjalan (`walkPose`) dan animasi stasioner (`spotPose` / `SEATED`) berlangsung mulus tanpa kedutan posisi (glitch/jitter).

## Verification Resources
- Verifikasi visual langsung via antarmuka browser pada server aktif `http://127.0.0.1:8788/kerja` dengan memantau penempatan jendela 3D dan observasi pergerakan agen antar-waypoint beserta variasi animasi yang dijalankan.

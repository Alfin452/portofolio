export const portfolioData = {
  personal: {
    fullName: "Muhammad Alfin Nur Huda",
    nickname: "Finn",
    title: "Full-Stack Web Developer",
    subTitle: "Laravel & Modern Frontend Specialist",
    tagline: "Converting complex ideas into clean, high-performance web applications.",
    bio: "Saya suka mengubah ide kompleks menjadi aplikasi web yang rapi, intuitif, dan fungsional. Berpengalaman dalam ekosistem Laravel, React, dan Vue.js, saya menggabungkan backend yang kokoh dengan desain frontend yang estetis, interaktif, serta berfokus pada performa, keamanan, dan pengalaman pengguna yang luar biasa.",
    location: "Banjarmasin, Kalimantan Selatan, Indonesia",
    status: "Available for Freelance & Full-time",
    statusType: "success",
    experienceYears: "3+",
    completedProjects: "15+",
    happyClients: "10+",
    avatarUrl: "/assets/images/profile.jpg",
    avatarFallback: "F"
  },

  socials: {
    email: "muhammadalfinnurhuda@gmail.com",
    github: "https://github.com/Alfin452",
    whatsapp: "https://wa.me/6285821875404",
    whatsappDisplay: "+62 858-2187-5404",
    instagram: "https://www.instagram.com/alfinn.finn_?igsh=cGwzNXcwYm9qb2V1",
    instagramHandle: "@alfinn.finn_",
    discord: "https://discord.gg/CgcGz6XVse",
    discordServerName: "Finn Dev Community"
  },

  stats: [
    { label: "Tahun Pengalaman", value: "3+", icon: "Calendar" },
    { label: "Proyek Selesai", value: "15+", icon: "Code2" },
    { label: "Kepuasan Klien", value: "100%", icon: "Smile" },
    { label: "Modern Stack", value: "React, Vue, Laravel", icon: "Layers" }
  ],

  services: [
    {
      id: "web-saas",
      title: "Custom Web & SaaS Development",
      description: "Pengembangan sistem web skala penuh menggunakan ekosistem Laravel, React, & Vue.js dengan arsitektur bersih, aman, dan mudah diskalakan.",
      icon: "Layers",
      badge: "Utama",
      features: ["Arsitektur Modular", "Multi-user Roles & Permissions", "Keamanan Teruji"]
    },
    {
      id: "siakad-cbt",
      title: "Sistem Sekolah, SIAKAD & CBT Ujian Online",
      description: "Platform manajemen sekolah terpadu, portal siswa/guru, sistem penilaian KPI, serta sistem ujian online Computer-Based Test (CBT).",
      icon: "GraduationCap",
      badge: "Spesialis",
      features: ["Penilaian Otomatis", "Manajemen Bank Soal", "Portal Orang Tua/Klinik"]
    },
    {
      id: "interactive-learning",
      title: "Aplikasi Pembelajaran Interaktif & Scratch",
      description: "Pengembangan media pembelajaran interaktif berbasis visual & animasi gamifikasi untuk siswa agar belajar lebih menyenangkan dan efektif.",
      icon: "Gamepad2",
      badge: "Edukasi",
      features: ["Animasi Gamifikasi", "Interaktivitas Visual", "Modul Belajar Siswa"]
    },
    {
      id: "pos-koperasi",
      title: "E-Koperasi & POS Kasir Inventaris",
      description: "Aplikasi manajemen kasir toko, manajemen stok barang, pencatatan transaksi, serta platform koperasi simpan pinjam digital.",
      icon: "ShoppingBag",
      badge: "Bisnis",
      features: ["Point of Sale (POS)", "Laporan Keuangan", "Stok Real-time"]
    },
    {
      id: "realtime-api",
      title: "RESTful API & Real-time WebSockets",
      description: "Integrasi sistem real-time menggunakan Laravel Reverb / Pusher WebSockets dan API berkinerja tinggi untuk aplikasi mobile & web.",
      icon: "Zap",
      badge: "Real-time",
      features: ["Laravel Reverb / Redis", "Data Stream Instan", "Dokumentasi API"]
    },
    {
      id: "frontend-modern",
      title: "UI/UX Frontend Modernization",
      description: "Perancangan tampilan web modern dengan animasi halus, responsif di semua layar, serta *User Experience (UX)* yang memanjakan pengguna.",
      icon: "Layout",
      badge: "Design",
      features: ["Responsive Design", "Micro-animations", "Fast Load Time"]
    }
  ],

  flagshipProjects: [
    {
      id: "digivote-flagship",
      number: "01",
      selectorTitle: "DigiVote.id",
      selectorSubtitle: "E-Voting SaaS & WebSockets",
      badge: "FLAGSHIP SAAS",
      status: "Production Ready",
      title: "DigiVote.id",
      isDigiVote: true,
      tagline: "The Infinite Voting Experience",
      description: "Platform SaaS E-Voting premium berbasis web yang dirancang dengan Arsitektur Multi-Panel MVC di Laravel 12. Sistem mengimplementasikan live leaderboard real-time berlatensi ultra-rendah dan otomatisasi pembayaran QRIS via Xendit.",
      longDescription: "DigiVote.id adalah platform SaaS e-voting enterprise yang dibangun menggunakan Laravel 12, Alpine.js, Tailwind CSS, dan Laravel Reverb WebSockets. Mengimplementasikan pemrosesan suara secara asinkron via Axios untuk memastikan performa puncak tanpa reload halaman saat ribuan pemilih aktif bersamaan. Dilengkapi integrasi langsung dengan Xendit Payment Gateway untuk layanan E-Voting Berbayar dengan verifikasi QRIS instan dan transparan.",
      category: "Real-time SaaS & E-Voting",
      categorySlug: "realtime",
      browserUrl: "https://digivote.id",
      demoUrl: "https://digivote.id/",
      githubUrl: null,
      images: [
        {
          src: "/images/projects/digivote-mockup.png",
          caption: "Multi-Panel Dashboard Mockup",
          shortLabel: "Overview"
        },
        {
          src: "/images/projects/halamanevent.png",
          caption: "Live Event & Realtime Leaderboard",
          shortLabel: "Live Event"
        },
        {
          src: "/images/projects/daftarevent.png",
          caption: "Event Management & Candidate Registry",
          shortLabel: "Registry"
        },
        {
          src: "/images/projects/qris.png",
          caption: "Automated Dynamic QRIS Payment",
          shortLabel: "QRIS Pay"
        }
      ],
      image: "/images/projects/digivote-mockup.png",
      techStack: ["Laravel 12", "TALL Stack", "Reverb WebSockets", "Alpine.js", "Tailwind CSS", "Xendit Gateway"],
      tags: ["Laravel 12", "TALL Stack", "Reverb WebSockets", "Alpine.js", "Tailwind CSS", "Xendit Gateway"],
      stats: [
        { label: "Total Suara Publik", value: "36,282+" },
        { label: "Event Terselenggara", value: "8+ Events" },
        { label: "WebSocket Latency", value: "< 100ms" }
      ],
      metrics: [
        { label: "Total Suara Publik", value: "36,282+" },
        { label: "Event Terselenggara", value: "8+ Events" },
        { label: "WebSocket Latency", value: "< 100ms" }
      ],
      features: [
        "Arsitektur Multi-Panel MVC untuk Voter, Event Organizer, dan Superadmin",
        "Live Leaderboard Real-time dengan broadcast Laravel Reverb WebSockets",
        "Asynchronous Processing via Axios untuk load instan tanpa reload browser",
        "Automated Payment Gateway Xendit & verifikasi QRIS real-time"
      ],
      highlights: [
        "Arsitektur Multi-Panel MVC untuk Voter, Event Organizer, dan Superadmin",
        "Live Leaderboard Real-time dengan broadcast Laravel Reverb WebSockets",
        "Asynchronous Processing via Axios untuk load instan tanpa reload browser",
        "Automated Payment Gateway Xendit & verifikasi QRIS real-time"
      ]
    },
    {
      id: "cbt-gibs-system",
      number: "02",
      selectorTitle: "CBT GIBS System",
      selectorSubtitle: "Integrated School & CBT Exam",
      badge: "ENTERPRISE SCHOOL SYSTEM",
      status: "Active Deployment",
      title: "CBT GIBS System",
      isDigiVote: false,
      tagline: "Integrated School Portal & Computer-Based Online Examination",
      description: "Ekosistem sistem sekolah terpadu yang memadukan portal akademik santri (portal.gibs.sch.id), rekam medis klinik, serta Computer-Based Test (CBT) dengan auto-grading dan perlindungan anti-kecurangan real-time.",
      longDescription: "Sistem ekosistem sekolah berskala besar untuk Global Islamic Boarding School (GIBS). Menghubungkan portal utama akademik, pencatatan rekam medis klinik sekolah, hingga sistem Computer-Based Test (CBT) yang dirancang untuk mencegah kecurangan ujian dengan proteksi blur lock, timer ter sinkronisasi server, pengacak nomor soal/opsi jawaban dinamis, serta rekapitulasi nilai instan ke format Excel.",
      category: "Sistem Informasi Sekolah",
      categorySlug: "school",
      browserUrl: "https://portal.gibs.sch.id/cbt",
      demoUrl: "https://portal.gibs.sch.id",
      githubUrl: "https://github.com/Alfin452",
      images: [
        {
          src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
          caption: "Computer-Based Test Examination Engine",
          shortLabel: "CBT Engine"
        },
        {
          src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
          caption: "GIBS Academic Portal & Clinic Medical Records",
          shortLabel: "Portal & Klinik"
        }
      ],
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
      techStack: ["Laravel", "PHP 8", "MySQL", "Vue.js", "Tailwind CSS", "Multi-Unit RBAC"],
      tags: ["Laravel", "PHP 8", "MySQL", "Vue.js", "Tailwind CSS", "Multi-Unit RBAC"],
      stats: [
        { label: "Siswa & Staf Terdaftar", value: "1,200+" },
        { label: "Auto Grading Engine", value: "Instant" },
        { label: "Keamanan CBT", value: "Anti-Cheating" }
      ],
      metrics: [
        { label: "Siswa & Staf Terdaftar", value: "1,200+" },
        { label: "Auto Grading Engine", value: "Instant Result" },
        { label: "Keamanan CBT", value: "Anti-Cheating Sync" }
      ],
      features: [
        "Arsitektur terintegrasi multi-subdomain antar Portal GIBS, Klinik, dan Modul CBT",
        "Engine ujian anti-kecurangan dengan deteksi tab switch & timer sync server",
        "Pengacakan bank soal dan pilihan jawaban dinamis per santri",
        "Kalkulasi nilai otomatis instan dan export rekap hasil ujian ke Excel"
      ],
      highlights: [
        "Arsitektur terintegrasi multi-subdomain antar Portal GIBS, Klinik, dan Modul CBT",
        "Engine ujian anti-kecurangan dengan deteksi tab switch & timer sync server",
        "Pengacakan bank soal dan pilihan jawaban dinamis per santri",
        "Kalkulasi nilai otomatis instan dan export rekap hasil ujian ke Excel"
      ]
    },
    {
      id: "e-koperasi",
      number: "03",
      selectorTitle: "E-Koperasi & KopDes",
      selectorSubtitle: "Savings & Loans, POS & Ledger",
      badge: "FINTECH & POS RETAIL",
      status: "Operational",
      title: "E-Koperasi & KopDes Store",
      isDigiVote: false,
      tagline: "Village Cooperative Savings & Loans, POS Inventory & Automated Ledger",
      description: "Platform digitalisasi Koperasi Usaha Desa (KopDes) yang menggabungkan pembukuan simpan pinjam anggota, katalog produk UMKM lokal, mesin kasir Point of Sale (POS) dengan barcode scan, dan laporan neraca keuangan otomatis.",
      longDescription: "Solusi digitalisasi koperasi usaha desa (KopDes). Memfasilitasi transaksi simpan pinjam anggota (simpanan pokok, wajib, sukarela), katalog produk UMKM lokal dengan payment gateway, sistem kasir transaksi dengan barcode scanner, dan laporan saldo berkala secara transparan siap audit.",
      category: "POS & Koperasi Digital",
      categorySlug: "business",
      browserUrl: "https://kopdes.demo.id",
      demoUrl: "#",
      githubUrl: "https://github.com/Alfin452",
      images: [
        {
          src: "https://images.unsplash.com/photo-1556742049-0a67d577c773?auto=format&fit=crop&w=1200&q=80",
          caption: "Point of Sale Cashier & Village UMKM Store",
          shortLabel: "POS Kasir"
        },
        {
          src: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
          caption: "Savings & Loans, Automated Ledger & SHU",
          shortLabel: "Buku Kas & SHU"
        }
      ],
      image: "https://images.unsplash.com/photo-1556742049-0a67d577c773?auto=format&fit=crop&w=1200&q=80",
      techStack: ["Laravel", "MySQL", "Midtrans Payment", "Alpine.js", "Tailwind CSS"],
      tags: ["Laravel", "MySQL", "Midtrans Payment", "Alpine.js", "Tailwind CSS"],
      stats: [
        { label: "Pencatatan Finansial", value: "Auto Ledger" },
        { label: "Transaksi Kasir", value: "POS Barcode" },
        { label: "Integrasi Pembayaran", value: "Midtrans QRIS" }
      ],
      metrics: [
        { label: "Financial Reporting", value: "Automated Ledger" },
        { label: "Point of Sale", value: "Fast Barcode Scan" },
        { label: "Payment Gateway", value: "Midtrans QRIS" }
      ],
      features: [
        "Pencatatan transaksi simpanan pokok, simpanan wajib, dan kalkulasi pinjaman anggota",
        "Point of Sale (POS) kasir cepat dengan barcode scanner & invoice cetak struk",
        "Katalog belanja produk desa dengan sistem checkout terintegrasi",
        "Laporan neraca keuangan bulanan dan pembagian Sisa Hasil Usaha (SHU) otomatis"
      ],
      highlights: [
        "Pencatatan transaksi simpanan pokok, simpanan wajib, dan kalkulasi pinjaman anggota",
        "Point of Sale (POS) kasir cepat dengan barcode scanner & invoice cetak struk",
        "Katalog belanja produk desa dengan sistem checkout terintegrasi",
        "Laporan neraca keuangan bulanan dan pembagian Sisa Hasil Usaha (SHU) otomatis"
      ]
    }
  ],

  // Backward compatibility
  get featuredProject() {
    return this.flagshipProjects[0];
  },

  projects: [
    {
      id: "gibs-portal",
      title: "GIBS Integrated School & Clinic Portal",
      category: "Sistem Informasi Sekolah",
      categorySlug: "school",
      featured: true,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      description: "Portal terpadu manajemen sekolah, modul kesehatan/klinik, dan pelacak KPI santri di Global Islamic Boarding School.",
      longDescription: "Sistem ekosistem sekolah berskala besar untuk Global Islamic Boarding School (GIBS). Menghubungkan portal utama akademik (`portal.gibs.sch.id`), pencatatan rekam medis klinik sekolah (`gibs-klinik`), hingga evaluasi KPI indikator siswa dan staf (`gibs-kpi`).",
      tags: ["Laravel", "MySQL", "REST API", "Bootstrap/Tailwind", "Admin Panel"],
      demoUrl: "https://portal.gibs.sch.id",
      githubUrl: "https://github.com/Alfin452",
      metrics: [
        { label: "Domain", value: "portal.gibs.sch.id" },
        { label: "Modules", value: "Academic, Clinic, KPI" },
        { label: "Role Management", value: "Multi-level RBAC" }
      ],
      highlights: [
        "Arsitektur terintegrasi antar subunit (Portal, Klinik, dan KPI).",
        "Manajemen rekam medis santri dan riwayat pemeriksaan kesehatan.",
        "Dashboard evaluasi target KPI siswa dan performa pendidik."
      ]
    },
    {
      id: "cbt-project",
      title: "CBT School Online Examination System",
      category: "Sistem Informasi Sekolah",
      categorySlug: "school",
      featured: true,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      description: "Sistem ujian online Computer-Based Test dengan timer otomatis, acak soal, dan kalkulasi nilai otomatis.",
      longDescription: "Aplikasi CBT yang digunakan untuk memfasilitasi ujian sekolah berbasis komputer secara efisien. Dilengkapi dengan proteksi kecurangan, fitur timer ter sinkronisasi server, pengacak nomor soal/opsi jawaban, serta rekapitulasi nilai otomatis untuk para guru.",
      tags: ["Laravel", "PHP 8", "MySQL", "jQuery / Vue", "Tailwind CSS"],
      demoUrl: "#",
      githubUrl: "https://github.com/Alfin452",
      metrics: [
        { label: "Auto Grading", value: "Instant Result" },
        { label: "Security", value: "Anti-Cheating Sync" }
      ],
      highlights: [
        "Pengacakan urutan soal dan pilihan jawaban secara acak per siswa.",
        "Fitur auto-submit saat waktu ujian yang ditentukan habis.",
        "Export nilai hasil ujian ke format Excel siap olah."
      ]
    },
    {
      id: "e-koperasi",
      title: "E-Koperasi & KopDes Store Platform",
      category: "POS & E-Commerce",
      categorySlug: "business",
      featured: true,
      image: "https://images.unsplash.com/photo-1556742049-0a67d577c773?auto=format&fit=crop&w=800&q=80",
      description: "Platform simpan pinjam koperasi digital dan toko e-commerce produk desa terintegrasi.",
      longDescription: "Solusi digitalisasi koperasi usaha desa (KopDes). Memfasilitasi transaksi simpan pinjam anggota, katalog produk UMKM lokal, sistem kasir transaksi, dan laporan saldo berkala secara transparan.",
      tags: ["Laravel", "MySQL", "Midtrans Payment", "Alpine.js/Vue", "Bootstrap"],
      demoUrl: "#",
      githubUrl: "https://github.com/Alfin452",
      metrics: [
        { label: "Financial Reporting", value: "Automated Ledger" },
        { label: "E-Commerce", value: "Catalog & Checkout" }
      ],
      highlights: [
        "Pencatatan transaksi simpanan pokok, wajib, dan sukarela anggota.",
        "Katalog belanja produk desa dengan sistem checkout yang ramah pengguna.",
        "Laporan neraca keuangan bulanan dan tahunan otomatis."
      ]
    },
    {
      id: "e-apotek",
      title: "E-Apotek & POS Inventory System",
      category: "POS & E-Commerce",
      categorySlug: "business",
      featured: false,
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
      description: "Aplikasi manajemen stok obat apotek, peringatan tanggal kedaluwarsa, dan mesin kasir cepat.",
      longDescription: "Sistem informasi manajemen apotek yang mempermudah pengelompokan jenis obat, pelacakan stok masuk/keluar, notifikasi obat mendekati kadaluwarsa (expired date warning), dan transaksi penjualan obat resep/non-resep.",
      tags: ["Laravel", "MySQL", "Vue.js", "Chart.js", "Tailwind CSS"],
      demoUrl: "#",
      githubUrl: "https://github.com/Alfin452",
      metrics: [
        { label: "Inventory Alert", value: "Expired Warning" },
        { label: "POS Speed", value: "Instant Barcode Scan" }
      ],
      highlights: [
        "Sistem deteksi dini stok obat menipis & tanggal expired.",
        "Cetak struk belanja kasir dengan format penerimaan ringkas.",
        "Laporan grafik penjualan harian dan obat terlaris."
      ]
    },
    {
      id: "interactive-scratch-apps",
      title: "Interactive Scratch & Educational Apps",
      category: "Media Pembelajaran",
      categorySlug: "education",
      featured: true,
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
      description: "Proyek media pembelajaran interaktif berbasis animasi gamifikasi Scratch untuk mengasah logika siswa.",
      longDescription: "Rangkaian aplikasi dan gim edukatif interaktif yang dikembangkan menggunakan konsep modul visual Scratch. Dirancang untuk meningkatkan minat belajar siswa sekolah melalui logika pemrograman dasar, kuiz interaktif, dan simulasi sains visual.",
      tags: ["Scratch", "Interactive Media", "Logic Programming", "EdTech", "Gamification"],
      demoUrl: "#",
      githubUrl: "https://github.com/Alfin452",
      metrics: [
        { label: "Target Audience", value: "Siswa & EdTech" },
        { label: "Interactivity", value: "Gamified Quiz" }
      ],
      highlights: [
        "Desain antarmuka warna-warni yang mengundang antusiasme siswa.",
        "Penggabungan audio efek, kuis logika, dan animasi interaktif.",
        "Memudahkan pemahaman materi kompleks melalui simulasi visual."
      ]
    },
    {
      id: "survey-zi",
      title: "Survey ZI (Zona Integritas)",
      category: "Pelayanan Publik",
      categorySlug: "public",
      featured: false,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      description: "Sistem survei Indeks Kepuasan Masyarakat (IKM) & Evaluasi Zona Integritas instansi.",
      longDescription: "Aplikasi web berbasis kuesioner digital untuk mengukur kualitas pelayanan publik dan transparansi instansi. Menyajikan skor statistik IKM, saran masyarakat, dan grafik indikator integritas secara intuitif.",
      tags: ["Laravel", "MySQL", "Chart.js", "Tailwind CSS"],
      demoUrl: "#",
      githubUrl: "https://github.com/Alfin452",
      metrics: [
        { label: "Analytics", value: "IKM Calculation" },
        { label: "Feedback", value: "Real-time Charting" }
      ],
      highlights: [
        "Kuesioner digital mudah diakses masyarakat via scan QR Code.",
        "Perhitungan skor indeks kepuasan publik secara otomatis.",
        "Visualisasi grafik indikator integritas untuk laporan audit."
      ]
    }
  ],

  codeShowcases: [
    {
      id: "laravel-reverb",
      title: "Real-time WebSockets (Laravel + Reverb)",
      language: "php",
      fileName: "VoteCastEvent.php",
      code: `namespace App\\Events;

use App\\Models\\Vote;
use Illuminate\\Broadcasting\\Channel;
use Illuminate\\Broadcasting\\InteractsWithSockets;
use Illuminate\\Contracts\\Broadcasting\\ShouldBroadcastNow;

class VoteCastEvent implements ShouldBroadcastNow
{
    use InteractsWithSockets;

    public function __construct(
        public int $candidateId,
        public int $totalVotes
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('election-updates')
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'candidate_id' => $this->candidateId,
            'total_votes'  => $this->totalVotes,
            'timestamp'    => now()->toIso8601String()
        ];
    }
}`
    },
    {
      id: "vue-composables",
      title: "Vue 3 Reactive Vote Counter Composable",
      language: "javascript",
      fileName: "useRealtimeVotes.js",
      code: `import { ref, onMounted, onUnmounted } from 'vue'

export function useRealtimeVotes(initialVotes = {}) {
  const votes = ref(initialVotes)
  const isConnected = ref(false)

  onMounted(() => {
    // Listen to Laravel Reverb WebSockets channel
    window.Echo.channel('election-updates')
      .listen('VoteCastEvent', (e) => {
        votes.value[e.candidate_id] = e.total_votes
      })
    isConnected.value = true
  })

  onUnmounted(() => {
    window.Echo.leaveChannel('election-updates')
  })

  return { votes, isConnected }
}`
    },
    {
      id: "react-realtime-hook",
      title: "React Custom Hook (Real-time Leaderboard)",
      language: "jsx",
      fileName: "useLiveLeaderboard.js",
      code: `import { useState, useEffect } from 'react';

export function useLiveLeaderboard(initialCandidates = []) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [latencyMs, setLatencyMs] = useState(42);

  useEffect(() => {
    const channel = window.Echo?.channel('election-updates');
    if (!channel) return;

    channel.listen('VoteCastEvent', (payload) => {
      const sentAt = new Date(payload.timestamp).getTime();
      setLatencyMs(Math.max(12, Date.now() - sentAt));

      setCandidates((prev) =>
        prev
          .map((item) =>
            item.id === payload.candidate_id
              ? { ...item, votes: payload.total_votes }
              : item
          )
          .sort((a, b) => b.votes - a.votes)
      );
    });

    return () => window.Echo?.leaveChannel('election-updates');
  }, []);

  return { candidates, latencyMs };
}`
    }
  ],

  skills: {
    backend: [
      { name: "Laravel Framework", level: 92, experience: "12 / 11 / 10", icon: "Server", usedIn: "DigiVote.id • GIBS Portal • KopDes" },
      { name: "PHP (OOP / Architecture)", level: 90, experience: "3+ Tahun", icon: "Code", usedIn: "Multi-Panel MVC & Service Pattern" },
      { name: "MySQL & Database Optimization", level: 88, experience: "Advanced Queries", icon: "Database", usedIn: "1,200+ Siswa CBT & Auto-Ledger" },
      { name: "Laravel Reverb & WebSockets", level: 85, experience: "Real-time Apps", icon: "Zap", usedIn: "Live Leaderboard < 100ms" },
      { name: "RESTful API Development", level: 90, experience: "JSON / Authentication", icon: "Link", usedIn: "Xendit & Midtrans Webhook Sync" },
      { name: "Redis Caching", level: 80, experience: "Queue & Cache", icon: "Cpu", usedIn: "High-Concurrency Vote Queue" }
    ],
    frontend: [
      { name: "Vue.js 3 (Options & Composition API)", level: 88, experience: "SPA & Inertia", icon: "LayoutGrid", usedIn: "CBT Exam Engine & E-Apotek" },
      { name: "JavaScript (ES6+) / Async JS", level: 88, experience: "DOM & Logic", icon: "FileCode", usedIn: "Zero-Reload Axios & Timer Sync" },
      { name: "Tailwind CSS & Modern Styling", level: 94, experience: "Custom Design Tokens", icon: "Palette", usedIn: "Design System & Brutalist UI" },
      { name: "HTML5 & Semantic Markup", level: 95, experience: "SEO Friendly", icon: "Globe", usedIn: "WAI-ARIA & SEO Optimization" },
      { name: "React.js / Next.js", level: 88, experience: "Hooks, SPA & UI Components", icon: "Code2", usedIn: "Interactive Portfolio & SaaS UI" },
      { name: "Interactive Scratch & EdTech", level: 90, experience: "Media Pembelajaran", icon: "Gamepad2", usedIn: "Gamified Student Learning Modules" }
    ],
    tools: [
      { name: "Laravel", role: "Backend Core", logo: "/assets/images/Laravel.png" },
      { name: "React", role: "Frontend UI", logo: "/logos/React-icon.svg" },
      { name: "Git", role: "Version Control", logo: "/logos/Git.png" },
      { name: "GitHub", role: "Code & CI/CD", logo: "/logos/GitHub.png" },
      { name: "Vite", role: "Frontend Bundler", logo: "/logos/Vite.svg" },
      { name: "Postman", role: "API Testing", logo: "/logos/Postman.png" },
      { name: "Docker", role: "Containerization", logo: "/logos/Docker.png" },
      { name: "Antigravity", role: "Agentic AI IDE", logo: "/logos/Google-Antigravity-Icon-Full-Color.png" }
    ]
  },

  timeline: [
    {
      period: "2024 - Sekarang (Semester 8)",
      title: "Tahap Akhir Kuliah & Fresh Graduate Web Engineer",
      institution: "Universitas / Perguruan Tinggi",
      description: "Fokus pada penyelesaian tugas akhir, merancang proyek real-time Laravel (Digivote), serta aktif membangun solusi web kustom untuk sekolah dan bisnis."
    },
    {
      period: "2023 - 2024",
      title: "Pengembang Portal Sekolah & Sistem Informasi",
      institution: "Proyek GIBS & EduTech",
      description: "Mengembangkan portal terintegrasi `portal.gibs.sch.id`, sistem klinik kesehatan santri, serta modul penilaian KPI dan CBT ujian online."
    },
    {
      period: "2022 - 2023",
      title: "Pengembangan Aplikasi Bisnis & Koperasi Digital",
      institution: "Freelance & Client Projects",
      description: "Membangun sistem E-Koperasi, Toko KopDes, aplikasi Kasir E-Apotek, dan kuesioner publik Survey ZI."
    }
  ],

  testimonials: [
    {
      name: "Tim Pengelola IT GIBS",
      role: "Global Islamic Boarding School",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      content: "Finn berhasil mengembangkan portal terintegrasi sekolah kami dengan sangat rapi. Komunikasi responsif dan pemahaman arsitektur Laravel-nya sangat diacungi jempol!",
      rating: 5
    },
    {
      name: "Klien Aplikasi Digivote",
      role: "Panitia Pemilihan Digital",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      content: "Sistem E-Voting buatan Alfin sangat memukau! Perhitungan suaranya benar-benar real-time tanpa delay dan sangat mudah digunakan oleh pemilih.",
      rating: 5
    }
  ]
}

# Developer Portfolio - System & Agent Architecture Protocols

Dokumen ini adalah **Always-On Workspace Rules** yang otomatis dibaca oleh AI Agent (Gemini) pada setiap giliran prompt saat bekerja di repositori ini.

---

## 1. Aturan Mutlak Desain & Frontend (Ironclad UI Rules)

1. **NO EMOJIS IN WEB INTERFACES (ATURAN MUTLAK)**:
   - Dilarang keras menggunakan emoji apa pun (misal: 🚀, 📍, 💡, 🛠️, 💻, ⚡, 🎓, 💬, ❓, 📬, ★, dsb.) di dalam komponen web, layout, button, badge, atau konten antarmuka.
   - Wajib menggunakan icon SVG profesional (Lucide React icons dari `lucide-react` atau inline SVG yang rapi) untuk mempertahankan estetika *senior-level frontend engineering* dan mengeliminasi kesan *generic AI-generated*.

2. **Distinctive & Senior Engineering Aesthetic**:
   - Hindari desain template generic/cliché. Buat pilihan palet warna, tipografi, dan micro-interaction yang matang dan intentional.
   - Gunakan layout responsif *mobile-first* (dari viewport 375px hingga ultrawide) dan perhatikan kontras warna serta aksesibilitas.

3. **Integritas Kode & Anti-Lazy Output**:
   - Tulis kode komponen secara utuh saat membuat atau merefaktor file.
   - Jangan memotong kode dengan komentar pemalas seperti `// ...kode lainnya...`.

---

## 2. Workspace Skills yang Terpasang (`.agents/skills/`)

Project ini telah dipasangi 8 Agent Skills terkurasi dari repositori `anthropics/skills` untuk memaksimalkan kapabilitas web portfolio:

- **`frontend-design`**: Panduan desain antarmuka unik, berkarakter, dan non-template.
- **`theme-factory`**: Pemilihan dan orkestrasi palet warna serta pasangan tipografi profesional.
- **`web-artifacts-builder`**: Pembuatan komponen interaktif canggih berbasis React & Tailwind CSS.
- **`webapp-testing`**: Pengujian otomatis interaktivitas UI, visual bug, dan browser test dengan Playwright.
- **`algorithmic-art`**: Pembuatan elemen grafis/animasi algoritmik (p5.js / canvas / generative visual) untuk hero section / showcase.
- **`canvas-design`**: Perancangan visual, poster proyek, dan aset grafis statis.
- **`brand-guidelines`**: Penyelarasan identitas visual dan branding personal yang konsisten.
- **`skill-creator`**: Pembuatan dan optimasi skill kustom baru.

---

## 3. Protokol Virtual Office

Ketika diminta bekerja dalam mode kantor virtual multi-agen, patuhi panduan peran dan alur pada [.agents/VIRTUAL_OFFICE.md](file:///c:/laragon/www/portofolio/.agents/VIRTUAL_OFFICE.md).

<template>
  <section class="services-section" id="services">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <span class="section-tag flex-tag">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          <span>LAYANAN & SOLUSI</span>
        </span>
        <h2 class="section-title">Apa Yang Bisa Saya Bangun Untuk Anda</h2>
        <p class="section-description">
          Menyediakan layanan pengembangan aplikasi web modern yang scalable, berkinerja tinggi, dan ramah pengguna.
        </p>
      </div>

      <!-- Bento Grid Layout -->
      <div class="bento-grid">
        <!-- Bento 01: Wide Bento Box (Cyprus Theme) -->
        <div class="bento-box bento-cyprus bento-wide-1">
          <div class="bento-content-left">
            <span class="bento-number">01</span>
            <h3 class="bento-heading font-display">Custom Web & SaaS Development</h3>
            <p class="bento-desc">
              Pengembangan sistem web skala penuh menggunakan <strong>Laravel & Vue.js</strong> dengan arsitektur bersih, aman, dan mudah diskalakan.
            </p>
          </div>

          <div class="bento-icon-box">
            <div class="icon-circle icon-circle-sand">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            </div>
          </div>
        </div>

        <!-- Bento 02: Square Bento Box (White Theme) -->
        <div class="bento-box bento-white">
          <span class="bento-number">02</span>
          <h3 class="bento-subheading font-display">Real-time WebSockets & API</h3>
          <p class="bento-desc-sm">
            Pembaruan data instan tanpa refresh menggunakan <strong>Laravel Reverb WebSockets</strong> dan Redis.
          </p>
          <div class="bento-bottom-icon">
            <div class="icon-circle icon-circle-cyprus">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
          </div>
        </div>

        <!-- Bento 03: Square Bento Box (White Theme) -->
        <div class="bento-box bento-white">
          <span class="bento-number">03</span>
          <h3 class="bento-subheading font-display">Media Pembelajaran & Scratch</h3>
          <p class="bento-desc-sm">
            Pengembangan media pembelajaran interaktif berbasis animasi gamifikasi Scratch untuk mengasah logika siswa.
          </p>
          <div class="bento-bottom-icon">
            <div class="icon-circle icon-circle-cyprus">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><circle cx="15" cy="13" r="1"></circle><circle cx="18" cy="11" r="1"></circle><rect x="2" y="6" width="20" height="12" rx="6"></rect></svg>
            </div>
          </div>
        </div>

        <!-- Bento 04: Wide Bento Box (Sand Theme) -->
        <div class="bento-box bento-sand bento-wide-2">
          <div class="bento-content-right">
            <span class="bento-number">04</span>
            <h3 class="bento-heading font-display">Sistem Informasi Sekolah, SIAKAD & CBT</h3>
            <p class="bento-desc">
              Portal manajemen sekolah terpadu (`portal.gibs.sch.id`), sistem ujian online Computer-Based Test (CBT) dengan timer otomatis dan kalkulasi nilai instan.
            </p>
          </div>

          <div class="bento-icon-box">
            <div class="icon-circle icon-circle-cyprus">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { portfolioData } from '../data/portfolioData'
</script>

<style scoped>
.services-section {
  padding: 6rem 0;
  background-color: var(--bg-white);
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
}

.bento-wide-1 {
  grid-column: span 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bento-wide-2 {
  grid-column: span 2;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
}

.bento-content-left, .bento-content-right {
  max-width: 65%;
}

.bento-heading {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 0.75rem;
}

.bento-subheading {
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 0.75rem;
  color: var(--text-dark);
}

.bento-desc {
  font-size: 1rem;
  line-height: 1.65;
}

.bento-desc-sm {
  font-size: 0.925rem;
  color: var(--text-muted);
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 1.5rem;
}

.bento-icon-box {
  flex-shrink: 0;
}

.icon-circle {
  width: 68px;
  height: 68px;
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s ease;
}

.bento-box:hover .icon-circle {
  transform: scale(1.1);
}

.icon-circle-cyprus {
  background: rgba(241, 101, 26, 0.12);
  color: var(--cyprus-main);
}

.icon-circle-sand {
  background: var(--sand-main);
  color: var(--text-dark);
}

@media (max-width: 992px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .bento-wide-1, .bento-wide-2 {
    grid-column: span 1;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .bento-content-left, .bento-content-right {
    max-width: 100%;
  }
}
</style>

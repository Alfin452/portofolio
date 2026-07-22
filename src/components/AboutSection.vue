<template>
  <section class="about-section" id="about">
    <div class="container">
      <div class="section-header">
        <span class="section-tag flex-tag">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>
          <span>TENTANG SAYA</span>
        </span>
        <h2 class="section-title">Menggabungkan Backend Kokoh & Frontend Estetis</h2>
        <p class="section-description">
          Lulusan baru (Fresh Graduate) dengan semangat tinggi dan dedikasi penuh dalam merancang aplikasi web modern.
        </p>
      </div>

      <div class="about-grid">
        <!-- Left: Profile Avatar Card -->
        <div class="profile-card glass-card">
          <div class="avatar-wrapper">
            <img 
              v-if="!imageError" 
              :src="personal.avatarUrl" 
              :alt="personal.fullName" 
              class="avatar-img"
              @error="imageError = true"
            />
            <div v-else class="avatar-placeholder">
              <span>{{ personal.avatarFallback }}</span>
            </div>
          </div>

          <div class="profile-meta">
            <h3 class="profile-name font-display">{{ personal.fullName }}</h3>
            <p class="profile-title">{{ personal.title }}</p>
            <div class="badge badge-primary mt-2">
              <span class="pulse-dot"></span>
              <span>Available for Freelance & Work</span>
            </div>
          </div>

          <div class="profile-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <span>Simpan foto asli di <code>public/assets/images/profile.jpg</code></span>
          </div>
        </div>

        <!-- Right: Bio Content & Principles -->
        <div class="about-content">
          <div class="bio-card glass-card">
            <h3 class="bio-heading font-display">Filosofi & Pendekatan Kerja</h3>
            <p class="bio-text">
              {{ personal.bio }}
            </p>
            <p class="bio-text mt-3">
              Fokus utama saya adalah memecahkan masalah nyata melalui perangkat lunak. Baik itu membuat sistem e-voting skala real-time dengan <strong>Laravel Reverb WebSockets</strong>, portal manajemen sekolah terpadu (<strong>GIBS Portal</strong>), hingga media pembelajaran interaktif berbasis <strong>Scratch</strong>, saya selalu memastikan setiap baris kode mudah dirawat dan ramah pengguna.
            </p>
          </div>

          <div class="principles-grid">
            <div class="principle-card glass-card">
              <div class="principle-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div class="principle-info">
                <h4 class="font-display">Backend Aman & Robust</h4>
                <p>Arsitektur Laravel yang rapi dengan proteksi data & struktur database teroptimasi.</p>
              </div>
            </div>

            <div class="principle-card glass-card">
              <div class="principle-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              </div>
              <div class="principle-info">
                <h4 class="font-display">Frontend Estetis & Responsive</h4>
                <p>Pengalaman antarmuka Vue.js & CSS modern yang halus di HP, Tablet, maupun PC.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { portfolioData } from '../data/portfolioData'

const personal = portfolioData.personal
const imageError = ref(false)
</script>

<style scoped>
.about-section {
  padding: 6rem 0;
  background-color: var(--sand-main);
}

.about-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2.5rem;
  align-items: start;
}

.profile-card {
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
  margin-bottom: 1.5rem;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--cyprus-main);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--cyprus-main);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--sand-main);
  border: 4px solid var(--cyprus-main);
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  color: var(--cyprus-main);
}

.profile-title {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.profile-notice {
  margin-top: 1.5rem;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--sand-main);
  font-size: 0.75rem;
  color: var(--cyprus-main);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--sand-dark);
}

.profile-notice code {
  color: var(--cyprus-main);
  font-weight: 700;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bio-card {
  padding: 2rem;
}

.bio-heading {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--cyprus-main);
}

.bio-text {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
}

.principles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.principle-card {
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.principle-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--cyprus-soft);
  color: var(--cyprus-main);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(0, 71, 65, 0.15);
}

.principle-info h4 {
  font-size: 1rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  color: var(--cyprus-main);
}

.principle-info p {
  font-size: 0.875rem;
  color: var(--text-muted);
}

@media (max-width: 992px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
  .principles-grid {
    grid-template-columns: 1fr;
  }
}
</style>

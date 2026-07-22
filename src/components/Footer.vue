<template>
  <footer class="footer-cyprus">
    <div class="container footer-container">
      <div class="footer-grid">
        
        <!-- Col 1: Brand & Bio -->
        <div class="footer-col-main">
          <a href="#" class="brand-logo-link">
            <div class="logo-box">
              <span>F</span>
            </div>
            <span class="brand-name font-display">
              Finn<span class="brand-sub">.dev</span>
            </span>
          </a>

          <p class="footer-bio">
            Platform web engineering personal dengan arsitektur <span class="font-bold">Enterprise-grade</span>. Mengutamakan performa, keamanan, dan estetika tanpa kompromi.
          </p>

          <div class="mac-status-badge">
            <div class="badge-icon-box">
              <span class="pulse-dot"></span>
            </div>
            <div class="badge-meta">
              <span class="badge-tag">Status Engineer</span>
              <span class="badge-title font-display">Fresh Graduate Developer</span>
            </div>
          </div>
        </div>

        <!-- Col 2: Navigasi -->
        <div class="footer-col">
          <h3 class="col-title font-display">NAVIGASI</h3>
          <ul class="col-links">
            <li><a href="#about">Tentang Saya</a></li>
            <li><a href="#services">Layanan & Solusi</a></li>
            <li><a href="#projects">Showcase Proyek</a></li>
            <li><a href="#code">Code Architecture</a></li>
            <li><a href="#faq">Tanya Jawab (FAQ)</a></li>
          </ul>
        </div>

        <!-- Col 3: Tech Stack -->
        <div class="footer-col">
          <h3 class="col-title font-display">TECH STACK</h3>
          <ul class="col-links">
            <li><a href="#skills">Laravel Framework</a></li>
            <li><a href="#skills">Vue 3 & Inertia.js</a></li>
            <li><a href="#skills">Laravel Reverb WebSockets</a></li>
            <li><a href="#skills">MySQL & Redis</a></li>
            <li><a href="#skills">Tailwind CSS & Modern Styling</a></li>
          </ul>
        </div>

        <!-- Col 4: Hubungi Kami -->
        <div class="footer-col-apps">
          <h3 class="col-title font-display">HUBUNGI KAMI</h3>
          <div class="app-grid">
            
            <a :href="socials.whatsapp" target="_blank" class="app-item">
              <div class="app-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <div class="app-meta">
                <span class="app-lbl">WhatsApp</span>
                <span class="app-val font-display">{{ socials.whatsappDisplay }}</span>
              </div>
            </a>

            <a :href="'mailto:' + socials.email" class="app-item">
              <div class="app-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div class="app-meta">
                <span class="app-lbl">Email</span>
                <span class="app-val font-display">Email Direct</span>
              </div>
            </a>

            <a :href="socials.discord" target="_blank" class="app-item col-span-2">
              <div class="app-icon">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </div>
              <div class="app-meta">
                <span class="app-lbl">Discord Server</span>
                <span class="app-val font-display">{{ socials.discordServerName }}</span>
              </div>
            </a>

          </div>
        </div>

      </div>

      <!-- Bottom Status Bar -->
      <div class="footer-bottom-bar">
        <span class="copyright">
          © {{ currentYear }} {{ personal.fullName }} (Finn). Built with Vue 3, Vite, Cyprus & Sand Design System.
        </span>

        <button class="back-to-top" @click="scrollToTop" title="Kembali ke Atas">
          <span>Ke Atas</span>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polyline points="18 15 12 9 6 15"></polyline></svg>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { portfolioData } from '../data/portfolioData'

const personal = portfolioData.personal
const socials = portfolioData.socials

const currentYear = computed(() => new Date().getFullYear())

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.footer-cyprus {
  background: var(--cyprus-main);
  color: var(--sand-main);
  padding: 4rem 0 2rem 0;
}

.footer-container {
  position: relative;
  z-index: 10;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2.2fr 1fr 1fr 2fr;
  gap: 2.5rem;
  margin-bottom: 3.5rem;
}

.brand-logo-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  margin-bottom: 1.25rem;
}

.logo-box {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--sand-main);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: var(--cyprus-main);
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--sand-main);
}

.brand-sub {
  color: var(--sand-dark);
}

.footer-bio {
  color: rgba(240, 237, 228, 0.85);
  font-size: 0.925rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.mac-status-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 1.25rem;
  background: rgba(0, 45, 41, 0.6);
  border: 1px solid rgba(240, 237, 228, 0.2);
  width: fit-content;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--sand-main);
  box-shadow: 0 0 8px var(--sand-main);
}

.badge-meta {
  display: flex;
  flex-direction: column;
}

.badge-tag {
  font-size: 0.675rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(240, 237, 228, 0.7);
}

.badge-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--sand-main);
}

.col-title {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: rgba(240, 237, 228, 0.7);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.col-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.col-links a {
  color: rgba(240, 237, 228, 0.85);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s ease;
}

.col-links a:hover {
  color: #ffffff;
  transform: translateX(4px);
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.col-span-2 {
  grid-column: span 2;
}

.app-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 1.1rem;
  background: rgba(240, 237, 228, 0.1);
  border: 1px solid rgba(240, 237, 228, 0.2);
  text-decoration: none;
  color: var(--sand-main);
  transition: all 0.25s ease;
}

.app-item:hover {
  background: rgba(240, 237, 228, 0.2);
  transform: translateY(-2px);
}

.app-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(0, 45, 41, 0.5);
  color: var(--sand-main);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.app-meta {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-lbl {
  font-size: 0.65rem;
  font-weight: 700;
  color: rgba(240, 237, 228, 0.7);
  text-transform: uppercase;
}

.app-val {
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px dashed rgba(240, 237, 228, 0.2);
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  font-size: 0.85rem;
  color: rgba(240, 237, 228, 0.8);
}

.back-to-top {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  background: rgba(240, 237, 228, 0.15);
  border: 1px solid rgba(240, 237, 228, 0.3);
  color: var(--sand-main);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

.back-to-top:hover {
  background: var(--sand-main);
  color: var(--cyprus-main);
  transform: translateY(-2px);
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 576px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .app-grid {
    grid-template-columns: 1fr;
  }
  .col-span-2 {
    grid-column: span 1;
  }
}
</style>

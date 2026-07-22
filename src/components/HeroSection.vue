<template>
  <section class="hero-section" id="hero">
    <div class="container hero-container">
      <div class="hero-grid">
        
        <!-- Left Content Column -->
        <div class="hero-content">
          
          <!-- Top Badges with SVG Icons (NO EMOJIS) -->
          <div class="hero-top-badge hero-animate delay-1">
            <div class="badge badge-primary badge-premium">
              <img src="/assets/images/Laravel.png" alt="Laravel Logo" class="laravel-official-img" />
              <span class="badge-title font-mono">Laravel Specialist</span>
            </div>
            <div class="location-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>{{ personal.location }}</span>
            </div>
          </div>

          <!-- Main Headline & Dynamic Typing -->
          <h1 class="hero-title font-display hero-animate delay-2">
            Halo, Saya <span class="gradient-text">{{ personal.fullName }}</span>
            <br />
            <span class="typing-text">{{ currentTypedText }}<span class="cursor">|</span></span>
          </h1>

          <!-- Bio Paragraph -->
          <p class="hero-bio hero-animate delay-3">
            {{ personal.bio }}
          </p>

          <!-- Hero Actions (DigiVote Rounded-Full Grid & Animation Parity) -->
          <div class="hero-actions hero-animate delay-4">
            <a href="#projects" class="btn-hero-pill btn-hero-primary group">
              <span>Lihat Showcase Proyek</span>
              <svg class="btn-icon-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
            <a href="#contact" class="btn-hero-pill btn-hero-secondary group">
              <span>Diskusi Projek</span>
            </a>
            <a :href="socials.discord" target="_blank" class="btn-hero-pill btn-hero-discord group">
              <svg class="btn-icon-discord" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              <span>Discord Server</span>
            </a>
          </div>

          <!-- Horizontal Stats Array -->
          <div class="hero-stats-horizontal hero-animate delay-5">
            <div v-for="(stat, index) in stats" :key="index" class="stat-card horizontal-stat">
              <span class="stat-value font-display">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>

        </div>

        <!-- Right Side: Floating Metric Cards Stage with Scroll Fly-out Effect -->
        <div 
          class="hero-visual-stage hero-animate delay-3"
          :class="{ 'scrolled-out': isScrolledOut }"
        >
          <div class="floating-cards-stack">
            
            <!-- Floating Metric Card 1 (Top / Cyprus Card) -->
            <div class="metric-card card-cyprus -rotate-2">
              <div class="card-header">
                <div class="status-badge">
                  <span class="pulse-dot-sand"></span>
                  <span class="badge-text font-mono">PRODUCTION READY</span>
                </div>
                <span class="card-tag font-mono">interactive Apps</span>
              </div>
              
              <div class="card-body">
                <div class="card-title-row">
                  <div class="icon-box">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                  </div>
                  <div>
                    <h4 class="card-heading font-display">Integrated School System</h4>
                    <p class="card-sub">Multi-role RBAC & Examination Engine</p>
                  </div>
                </div>

                <div class="progress-bar-block">
                  <div class="progress-info">
                    <span>System Reliability</span>
                    <span class="font-mono">100%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Floating Metric Card 2 (Bottom / Sand Card) -->
            <div class="metric-card card-sand rotate-3">
              <div class="card-title-row">
                <div class="icon-box icon-cyprus-bg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </div>
                <div>
                  <h4 class="card-heading font-display text-cyprus">Modern Tech Stack</h4>
                  <p class="card-sub text-muted">Clean Code & High-Performance SPA</p>
                </div>
              </div>

              <div class="tech-pills">
                <span class="pill-badge">Laravel</span>
                <span class="pill-badge">Vue</span>
                <span class="pill-badge">Inertia.js</span>
                <span class="pill-badge">MySQL</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { portfolioData } from '../data/portfolioData'

const personal = portfolioData.personal
const socials = portfolioData.socials
const stats = portfolioData.stats

// Typing text animation
const titles = [
  "Full-Stack Web Developer",
  "Laravel Specialist",
  "Vue & Inertia SPA Engineer",
  "SIAKAD & Educational EdTech Builder"
]
const currentTypedText = ref("")
let titleIndex = 0
let charIndex = 0
let isDeleting = false
let typingTimer = null

const typeEffect = () => {
  const currentTitle = titles[titleIndex]
  if (isDeleting) {
    currentTypedText.value = currentTitle.substring(0, charIndex - 1)
    charIndex--
  } else {
    currentTypedText.value = currentTitle.substring(0, charIndex + 1)
    charIndex++
  }

  let typeSpeed = isDeleting ? 40 : 80

  if (!isDeleting && charIndex === currentTitle.length) {
    typeSpeed = 2000
    isDeleting = true
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    titleIndex = (titleIndex + 1) % titles.length
    typeSpeed = 400
  }

  typingTimer = setTimeout(typeEffect, typeSpeed)
}

// Scroll fly-out effect (scroll ke bawah membuang ke kanan, scroll ke atas kembali)
const isScrolledOut = ref(false)

const handleScroll = () => {
  isScrolledOut.value = window.scrollY > 150
}

onMounted(() => {
  typeEffect()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  if (typingTimer) clearTimeout(typingTimer)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 90vh;
  padding-top: 7.5rem;
  padding-bottom: 5rem;
  display: flex;
  align-items: center;
  background-color: var(--bg-white);
  overflow: hidden;
}

.hero-container {
  width: 100%;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 3rem;
  align-items: flex-start;
}

.hero-content {
  text-align: left;
}

.hero-top-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.badge-primary.badge-premium {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(0, 71, 65, 0.08);
  border: none;
  color: var(--cyprus-main);
  padding: 0.5rem 1.15rem;
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  font-weight: 700;
  transition: all 0.25s ease;
}

.badge-premium:hover {
  transform: translateY(-2px);
  background: rgba(0, 71, 65, 0.14);
}

.laravel-official-img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.badge-title {
  letter-spacing: 0.01em;
  color: var(--cyprus-main);
}

.location-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--text-dark);
  font-weight: 700;
  padding: 0.5rem 1.15rem;
  border-radius: var(--radius-pill);
  background: var(--sand-main);
  border: none;
  transition: all 0.25s ease;
}

.location-tag:hover {
  background: var(--sand-dark);
  transform: translateY(-2px);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  color: var(--text-dark);
}

.gradient-text {
  color: var(--cyprus-main);
}

.typing-text {
  color: var(--cyprus-main);
  font-family: var(--font-sans);
  font-weight: 800;
}

.cursor {
  display: inline-block;
  animation: blink 1s infinite;
  color: var(--cyprus-main);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-bio {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.75;
  margin-bottom: 2.25rem;
  max-width: 650px;
}

/* Hero Actions - DigiVote Rounded Pill Grid & Animation Parity */
.hero-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-hero-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 0.95rem 1.85rem;
  border-radius: 9999px; /* Rounded pill grid seperti DigiVote */
  font-size: 1rem;
  font-weight: 800;
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 71, 65, 0.12);
  cursor: pointer;
}

/* Primary Button (Showcase Proyek) - High Contrast White text on Cyprus */
.btn-hero-primary {
  background: var(--cyprus-main);
  color: #ffffff !important;
  border: 2px solid var(--cyprus-main);
}

.btn-hero-primary:hover {
  background: var(--cyprus-dark);
  border-color: var(--cyprus-dark);
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 71, 65, 0.28);
}

.btn-hero-primary:hover .btn-icon-arrow {
  transform: translateX(5px);
}

/* Secondary Button (Diskusi Projek) - High Contrast Cyprus text on Sand */
.btn-hero-secondary {
  background: var(--sand-main);
  color: var(--cyprus-main) !important;
  border: 2px solid var(--sand-dark);
}

.btn-hero-secondary:hover {
  background: var(--sand-dark);
  border-color: var(--cyprus-main);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 71, 65, 0.15);
}

/* Discord Button - High Contrast White text on Discord Accent */
.btn-hero-discord {
  background: #5865F2;
  color: #ffffff !important;
  border: 2px solid #5865F2;
}

.btn-hero-discord:hover {
  background: #4752C4;
  border-color: #4752C4;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(88, 101, 242, 0.35);
}

.btn-hero-discord:hover .btn-icon-discord {
  transform: rotate(15deg) scale(1.1);
}

.btn-icon-arrow,
.btn-icon-discord {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}

/* Horizontal Stats Below Buttons */
.hero-stats-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 2.75rem;
  margin-top: 3rem;
  padding-top: 1.75rem;
  border-top: 1.5px solid var(--sand-main);
}

.horizontal-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 900;
  color: var(--cyprus-main);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* ==========================================================================
   RIGHT SIDE FLOATING METRIC CARDS STAGE (SCROLL FLY-OUT EFFECT)
   ========================================================================== */

.hero-visual-stage {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 3.5rem;
  transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
  will-change: transform, opacity;
}

.hero-visual-stage.scrolled-out {
  transform: translateX(180px) rotate(8deg);
  opacity: 0;
  pointer-events: none;
}

.floating-cards-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 440px;
}

.metric-card {
  padding: 1.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 15px 35px rgba(0, 71, 65, 0.12);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.metric-card:hover {
  transform: translateY(-4px) rotate(0deg) !important;
  box-shadow: 0 22px 45px rgba(0, 71, 65, 0.2);
}

.-rotate-2 {
  transform: rotate(-2deg);
}

.rotate-3 {
  transform: rotate(3deg);
}

/* Card Cyprus Variant */
.card-cyprus {
  background: var(--cyprus-main);
  color: var(--sand-main);
  border: 2px solid var(--cyprus-dark);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(240, 237, 228, 0.12);
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
}

.pulse-dot-sand {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--sand-main);
  box-shadow: 0 0 8px var(--sand-main);
}

.badge-text {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.card-tag {
  font-size: 0.75rem;
  color: var(--sand-dark);
  font-weight: 700;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1rem;
}

.icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(240, 237, 228, 0.15);
  color: var(--sand-main);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-cyprus-bg {
  background: rgba(0, 71, 65, 0.1);
  color: var(--cyprus-main);
}

.card-heading {
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.25;
}

.card-sub {
  font-size: 0.8rem;
  opacity: 0.85;
}

.progress-bar-block {
  margin-top: 1rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  opacity: 0.9;
}

.progress-track {
  width: 100%;
  height: 6px;
  background: rgba(240, 237, 228, 0.2);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  width: 100%;
  height: 100%;
  background: var(--sand-main);
  border-radius: 9999px;
}

/* Card Sand Variant */
.card-sand {
  background: var(--sand-main);
  color: var(--cyprus-main);
  border: 2px solid var(--sand-dark);
}

.text-cyprus {
  color: var(--cyprus-main);
}

.text-muted {
  color: var(--text-muted);
}

.tech-pills {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.pill-badge {
  font-size: 0.75rem;
  font-weight: 700;
  background: #ffffff;
  color: var(--cyprus-main);
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  border: 1px solid var(--sand-dark);
}

/* Animations */
@keyframes heroReveal {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-animate {
  animation: heroReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

.delay-1 { animation-delay: 100ms; }
.delay-2 { animation-delay: 200ms; }
.delay-3 { animation-delay: 300ms; }
.delay-4 { animation-delay: 400ms; }
.delay-5 { animation-delay: 500ms; }

@media (max-width: 992px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
  .hero-visual-stage {
    margin-top: 1rem;
  }
  .hero-title {
    font-size: 2.75rem;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 2.25rem;
  }
  .hero-stats-horizontal {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>

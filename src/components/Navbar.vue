<template>
  <header 
    class="navbar-wrapper"
    :class="{ 'scrolled': isScrolled }"
  >
    <!-- Floating Capsule Container -->
    <div class="navbar-capsule-outer">
      <div class="navbar-capsule" :class="{ 'scrolled': isScrolled }">
        <!-- Logo / Brand -->
        <a href="#" class="brand-link">
          <div class="logo-box">
            <span>F</span>
          </div>
          <div class="brand-text">
            <span class="name font-display">Finn</span>
            <span class="sub font-display">.dev</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="desktop-nav">
          <a href="#about" class="nav-link">Tentang</a>
          <a href="#services" class="nav-link">Layanan</a>
          <a href="#projects" class="nav-link">Proyek</a>
          <a href="#code" class="nav-link">Code Snippet</a>
          <a href="#skills" class="nav-link">Keahlian</a>
          <a href="#faq" class="nav-link">FAQ</a>
          <a href="#contact" class="nav-link">Kontak</a>
        </nav>

        <!-- Right Action & Animated Theme Toggle -->
        <div class="navbar-right">
          <!-- Animated Theme Toggle Button (DigiVote Parity) -->
          <button 
            id="theme-toggle" 
            aria-label="Toggle theme" 
            type="button" 
            class="theme-toggle-btn"
            @click="toggleTheme"
            title="Ganti Mode Terang / Gelap"
          >
            <svg class="att-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <mask id="att-moon-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <circle class="att-mask-circle" cx="33" cy="0" r="9" fill="black" />
              </mask>
              <circle class="att-core" cx="12" cy="12" fill="currentColor" stroke="none" mask="url(#att-moon-mask)" r="5" />
              <g class="att-rays" style="transform-origin: 12px 12px;">
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="5.64" y1="5.64" x2="4.22" y2="4.22" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                <line x1="5.64" y1="18.36" x2="4.22" y2="19.78" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              </g>
            </svg>
          </button>

          <a :href="socials.whatsapp" target="_blank" class="btn btn-primary btn-sm">
            <span>Hubungi WA</span>
          </a>

        </div>
      </div>
    </div>

    <!-- Mobile Bottom Navigation Bar (App Style) -->
    <nav class="mobile-bottom-bar">
      <!-- Popup menu for "Lainnya" -->
      <transition name="fade-slide">
        <div v-if="isMoreMenuOpen" class="more-menu-popup">
          <a href="#skills" @click="closeMoreMenu" class="more-nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            Keahlian
          </a>
          <a href="#faq" @click="closeMoreMenu" class="more-nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            FAQ
          </a>
          <a href="#contact" @click="closeMoreMenu" class="more-nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Kontak
          </a>
        </div>
      </transition>

      <a href="#about" class="bottom-nav-item" @click="closeMoreMenu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span>Tentang</span>
      </a>
      <a href="#services" class="bottom-nav-item" @click="closeMoreMenu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        <span>Layanan</span>
      </a>
      <a href="#projects" class="bottom-nav-item" @click="closeMoreMenu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
        <span>Proyek</span>
      </a>
      <a href="#code" class="bottom-nav-item" @click="closeMoreMenu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
        <span>Code</span>
      </a>
      <button class="bottom-nav-item" @click="toggleMoreMenu" :class="{ 'active': isMoreMenuOpen }">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
        <span>Lainnya</span>
      </button>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { portfolioData } from '../data/portfolioData'

const socials = portfolioData.socials
const isScrolled = ref(false)
const isMoreMenuOpen = ref(false)
const isDarkMode = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 30
}

const toggleMoreMenu = () => {
  isMoreMenuOpen.value = !isMoreMenuOpen.value
}
const closeMoreMenu = () => {
  isMoreMenuOpen.value = false
}

const initTheme = () => {
  if (localStorage.getItem('color-theme') === 'dark') {
    document.documentElement.classList.add('dark')
    isDarkMode.value = true
  } else {
    document.documentElement.classList.remove('dark')
    isDarkMode.value = false
  }
}

const toggleTheme = () => {
  const isDark = document.documentElement.classList.contains('dark')
  
  const applyToggle = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('color-theme', 'light')
      isDarkMode.value = false
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('color-theme', 'dark')
      isDarkMode.value = true
    }
  }

  // View Transitions API circular animation if supported
  if (!document.startViewTransition) {
    applyToggle()
    return
  }

  const btn = document.getElementById('theme-toggle')
  if (!btn) {
    applyToggle()
    return
  }

  const rect = btn.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  // Disable global transitions during capture to avoid screenshot lag & GPU stutter
  document.documentElement.classList.add('disable-transitions')
  void document.documentElement.offsetHeight // Force reflow

  const transition = document.startViewTransition(applyToggle)
  transition.ready.then(() => {
    const animation = document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ],
      },
      {
        duration: 500,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        pseudoElement: '::view-transition-new(root)',
        fill: 'forwards'
      }
    )

    animation.finished.finally(() => {
      document.documentElement.classList.remove('disable-transitions')
    })
  })
}

onMounted(() => {
  initTheme()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Wrapper — uses same class as production so style.css dark rules apply */
.navbar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 1rem 0;
  transition: all 0.3s ease;
  /* NO background/backdrop here — the capsule handles it */
  background: transparent;
  border-bottom: none;
}

.navbar-wrapper.scrolled {
  padding: 0.65rem 0;
}

/* Capsule Outer — centering container */
.navbar-capsule-outer {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Capsule Design — Glassmorphism Pill */
.navbar-capsule {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  height: 60px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;

  /* Glassmorphism */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 
    inset 0 1px 0 0 rgba(255, 255, 255, 0.6),
    0 8px 32px -4px rgba(0, 71, 65, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.navbar-capsule.scrolled {
  height: 54px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 
    inset 0 1px 0 0 rgba(255, 255, 255, 0.8),
    0 12px 35px -5px rgba(0, 71, 65, 0.12);
  border-color: rgba(0, 71, 65, 0.12);
}

/* Brand Link */
.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-box {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: var(--cyprus-main);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
  color: #ffffff;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 800;
}

.brand-text .name {
  color: var(--text-dark);
}

.brand-text .sub {
  color: var(--cyprus-main);
}

/* Desktop Nav */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--cyprus-main);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0%;
  height: 2px;
  background: var(--cyprus-main);
  transition: width 0.25s ease;
  border-radius: 2px;
}

.nav-link:hover::after {
  width: 100%;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Animated Theme Toggle Button */
.theme-toggle-btn {
  background: var(--sand-main);
  border: 1.5px solid var(--sand-dark);
  color: var(--cyprus-main);
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: transform 0.25s ease, background 0.25s ease;
  outline: none;
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
  background: var(--sand-dark);
}

.theme-toggle-btn:active {
  transform: scale(0.95);
}

.att-svg {
  width: 20px;
  height: 20px;
  overflow: visible;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(html.dark) .att-svg {
  transform: rotate(270deg);
}

.att-mask-circle {
  transition: cx 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), cy 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(html.dark) .att-mask-circle {
  cx: 17px;
  cy: 8px;
}

.att-core {
  transition: r 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(html.dark) .att-core {
  r: 9px;
}

.att-rays {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
}

:deep(html.dark) .att-rays {
  transform: rotate(-30deg) scale(0);
  opacity: 0;
}

.btn-sm {
  padding: 0.55rem 1.15rem;
  font-size: 0.875rem;
  border-radius: 9999px;
}

/* Mobile Bottom Navigation (App Style) */
.mobile-bottom-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 65px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  z-index: 999;
  justify-content: space-around;
  align-items: center;
  padding: 0 0.5rem;
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--text-muted);
  text-decoration: none;
  background: none;
  border: none;
  padding: 0.5rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}
.bottom-nav-item svg {
  stroke-width: 2.2;
}
.bottom-nav-item span {
  font-size: 0.65rem;
  font-weight: 700;
}
.bottom-nav-item:active, .bottom-nav-item.active {
  color: var(--cyprus-main);
  transform: scale(0.95);
}

.more-menu-popup {
  position: absolute;
  bottom: 75px;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 71, 65, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  box-shadow: 0 10px 30px rgba(0, 71, 65, 0.15);
  min-width: 150px;
}
.more-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-dark);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  transition: background 0.2s;
}
.more-nav-link:active {
  background: rgba(0, 71, 65, 0.05);
}

:global(html.dark) .mobile-bottom-bar {
  background: rgba(15, 23, 42, 0.85);
  border-top-color: rgba(255, 255, 255, 0.05);
}
:global(html.dark) .bottom-nav-item {
  color: #94a3b8;
}
:global(html.dark) .bottom-nav-item:active, :global(html.dark) .bottom-nav-item.active {
  color: var(--sand-main);
}
:global(html.dark) .more-menu-popup {
  background: rgba(15, 23, 42, 0.95);
  border-color: rgba(255,255,255,0.1);
}
:global(html.dark) .more-nav-link {
  color: var(--text-dark);
}
:global(html.dark) .more-nav-link:active {
  background: rgba(255,255,255,0.05);
}

@media (max-width: 992px) {
  .desktop-nav {
    display: none;
  }
  .mobile-bottom-bar {
    display: flex;
  }
}
</style>
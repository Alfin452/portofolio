<template>
  <header 
    class="navbar-wrapper"
    :class="{ 'scrolled': isScrolled }"
  >
    <div class="container navbar-container">
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

        <!-- Mobile Toggle Button -->
        <button 
          class="mobile-toggle" 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          aria-label="Toggle Menu"
        >
          <span class="bar" :class="{ 'open': isMobileMenuOpen }"></span>
          <span class="bar" :class="{ 'open': isMobileMenuOpen }"></span>
          <span class="bar" :class="{ 'open': isMobileMenuOpen }"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <transition name="fade-slide">
      <div v-if="isMobileMenuOpen" class="mobile-drawer">
        <nav class="mobile-nav">
          <a href="#about" @click="closeMobileMenu" class="mobile-nav-link">Tentang</a>
          <a href="#services" @click="closeMobileMenu" class="mobile-nav-link">Layanan</a>
          <a href="#projects" @click="closeMobileMenu" class="mobile-nav-link">Proyek</a>
          <a href="#code" @click="closeMobileMenu" class="mobile-nav-link">Code Snippet</a>
          <a href="#skills" @click="closeMobileMenu" class="mobile-nav-link">Keahlian</a>
          <a href="#faq" @click="closeMobileMenu" class="mobile-nav-link">FAQ</a>
          <a href="#contact" @click="closeMobileMenu" class="mobile-nav-link">Kontak</a>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { portfolioData } from '../data/portfolioData'

const socials = portfolioData.socials
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isDarkMode = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 30
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
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
.navbar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 1.25rem 0;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--sand-dark);
}

.navbar-wrapper.scrolled {
  padding: 0.85rem 0;
  box-shadow: 0 4px 20px rgba(0, 71, 65, 0.08);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--cyprus-main);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
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

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.nav-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
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

/* Animated Theme Toggle Button (DigiVote Parity) */
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

.mobile-toggle {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
}

.mobile-toggle .bar {
  width: 24px;
  height: 2px;
  background-color: var(--cyprus-main);
  transition: all 0.3s ease;
}

.mobile-drawer {
  background: #ffffff;
  border-bottom: 1px solid var(--sand-dark);
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 71, 65, 0.1);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.mobile-nav-link {
  color: var(--cyprus-main);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 700;
}

@media (max-width: 992px) {
  .desktop-nav {
    display: none;
  }
  .mobile-toggle {
    display: flex;
  }
}
</style>

<template>
  <section class="hero-section" id="hero" ref="heroRef">

    <!-- Background Orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="grid-pattern"></div>



    <div class="container hero-container">
      <div class="hero-grid">

        <!-- LEFT: Content -->
        <div class="hero-content">

          <!-- Status Badge -->
          <div class="status-minimal gsap-reveal">
            <span class="highlight-line">{{ personal.status }}</span>
          </div>

          <!-- Heading -->
          <h1 class="hero-title font-display gsap-reveal">
            Halo, Saya<br />
            <span class="name-highlight">{{ personal.fullName }}</span>
          </h1>

          <!-- Typing Role -->
          <p class="hero-role gsap-reveal">
            <span class="role-prefix">→ </span>
            <span class="typed-text">{{ typedText }}</span>
            <span class="cursor-blink">_</span>
          </p>

          <!-- Bio -->
          <p class="hero-bio gsap-reveal">{{ personal.bio }}</p>

          <!-- CTA Buttons -->
          <div class="hero-actions gsap-reveal">
            <a href="#projects" class="btn-hero btn-primary-hero">
              Lihat Proyek
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="#contact" class="btn-hero btn-secondary-hero">Diskusi Projek</a>
            <a :href="socials.github" target="_blank" class="btn-hero btn-ghost-hero">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
            <a :href="socials.discord" target="_blank" class="btn-hero btn-ghost-hero" title="Join Finn Dev Community">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
              Discord
            </a>
          </div>

          <!-- Stats -->
          <div class="hero-stats gsap-reveal">
            <div v-for="(stat, i) in displayStats" :key="i" class="stat-item">
              <span class="stat-val font-display">{{ stat.value }}</span>
              <span class="stat-lbl">{{ stat.label }}</span>
            </div>
          </div>

        </div>

        <!-- RIGHT: Floating Metric Cards -->
        <div class="cards-stage" ref="terminalRef">

          <!-- Card 1: Cyprus — School System -->
          <div class="metric-card card-cyprus card-tilt-left">
            <div class="mc-header">
              <div class="mc-status">
                <span class="pulse-dot-sand"></span>
                <span class="mc-status-text font-mono">PRODUCTION READY</span>
              </div>
              <span class="mc-tag font-mono">Interactive Apps</span>
            </div>
            <div class="mc-body">
              <div class="mc-title-row">
                <div class="mc-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <div>
                  <h4 class="mc-heading font-display">Integrated School System</h4>
                  <p class="mc-sub">Multi-role RBAC &amp; Examination Engine</p>
                </div>
              </div>
              <div class="mc-progress">
                <div class="mc-progress-info">
                  <span>System Reliability</span>
                  <span class="font-mono">100%</span>
                </div>
                <div class="mc-track"><div class="mc-fill"></div></div>
              </div>
            </div>
          </div>

          <!-- Card 2: Sand — Tech Stack -->
          <div class="metric-card card-sand card-tilt-right">
            <div class="mc-title-row">
              <div class="mc-icon mc-icon-light">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              </div>
              <div>
                <h4 class="mc-heading font-display mc-text-cyprus">Modern Tech Stack</h4>
                <p class="mc-sub mc-text-muted">Clean Code &amp; High-Performance SPA</p>
              </div>
            </div>
            <div class="tech-pills">
              <span class="pill-badge">Laravel</span>
              <span class="pill-badge">Vue.js</span>
              <span class="pill-badge">Inertia.js</span>
              <span class="pill-badge">MySQL</span>
              <span class="pill-badge">Tailwind</span>
            </div>
          </div>

          <!-- Card 3: Dark Glass — Real-time Stats (NEW) -->
          <div class="metric-card card-dark card-tilt-left">
            <div class="mc-header">
              <div class="mc-status">
                <span class="pulse-dot-green"></span>
                <span class="mc-status-text font-mono">LIVE</span>
              </div>
              <span class="mc-tag font-mono">WebSockets</span>
            </div>
            <div class="mc-live-row">
              <div class="mc-live-item">
                <span class="mc-live-val font-display">{{ liveVotes }}</span>
                <span class="mc-live-lbl">Votes Cast</span>
              </div>
              <div class="mc-live-divider"></div>
              <div class="mc-live-item">
                <span class="mc-live-val font-display">&lt;100ms</span>
                <span class="mc-live-lbl">Latency</span>
              </div>
              <div class="mc-live-divider"></div>
              <div class="mc-live-item">
                <span class="mc-live-val font-display">{{ liveUsers }}</span>
                <span class="mc-live-lbl">Online</span>
              </div>
            </div>
            <p class="mc-live-desc">Powered by Laravel Reverb WebSockets</p>
          </div>

        </div>

      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="scroll-down">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { portfolioData } from '../data/portfolioData'

const personal = portfolioData.personal
const socials   = portfolioData.socials

// Only show 3 stats + override 4th label
const displayStats = [
  { value: '3+',   label: 'Tahun Pengalaman' },
  { value: '15+',  label: 'Proyek Selesai' },
  { value: '100%', label: 'Kepuasan Klien' },
  { value: 'Laravel', label: 'Full-Stack Web' },
]

const heroRef    = ref(null)
const terminalRef = ref(null)

// ─── Typing animation ────────────────────────────────────────────
const titles = [
  'Full-Stack Web Developer',
  'Laravel Specialist',
  'Vue & Inertia SPA Engineer',
  'EdTech & SIAKAD Builder',
]
const typedText = ref('')
let tIdx = 0, cIdx = 0, deleting = false, timer = null

const typeLoop = () => {
  const cur = titles[tIdx]
  typedText.value = deleting
    ? cur.slice(0, --cIdx)
    : cur.slice(0, ++cIdx)

  let speed = deleting ? 35 : 75
  if (!deleting && cIdx === cur.length)  { speed = 2000; deleting = true }
  else if (deleting && cIdx === 0)       { deleting = false; tIdx = (tIdx + 1) % titles.length; speed = 400 }
  timer = setTimeout(typeLoop, speed)
}

// ─── Live counter simulation (Card 3) ─────────────────────
// Simulates a real-time vote counter for visual effect
const liveVotes = ref(1247)
const liveUsers = ref(38)
let liveTimer = null

const tickLive = () => {
  if (Math.random() > 0.6) liveVotes.value++
  if (Math.random() > 0.8) liveUsers.value = Math.max(30, liveUsers.value + (Math.random() > 0.5 ? 1 : -1))
  liveTimer = setTimeout(tickLive, 1800 + Math.random() * 2000)
}


// ─── GSAP entrance animations ────────────────────────────────────
const initGsap = () => {
  const gsap = window.gsap
  if (!gsap || !heroRef.value) return

  // Left content stagger
  gsap.fromTo(
    heroRef.value.querySelectorAll('.gsap-reveal'),
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'expo.out', delay: 0.15 }
  )

  if (!terminalRef.value) return

  const cards = terminalRef.value.querySelectorAll('.metric-card')

  // Mobile vs Desktop animations
  if (window.innerWidth <= 992) {
    gsap.fromTo(cards, 
      { opacity: 0, y: 15, rotate: 0 },
      { opacity: 1, y: 0, rotate: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out', delay: 0.4 }
    )
  } else {
    // Timeline: cards appear in tight succession — total ~0.65s
    const tl = gsap.timeline({ delay: 0.4 })

    // Final resting positions: scattered, not perfectly aligned
    const rest = [
      { x: 10,  y: 0,  r: -2.5 },
      { x: -6,  y: 4,  r: 2.8  },
      { x: 14,  y: 8,  r: -1.5 },
    ]

    cards.forEach((card, i) => {
      const to = rest[i] || rest[0]
      tl.fromTo(
        card,
        { opacity: 0, x: to.x + 40, y: to.y - 20, rotate: to.r - 5, scale: 0.9 },
        { opacity: 1, x: to.x,      y: to.y,       rotate: to.r,     scale: 1,
          duration: 0.5, ease: 'expo.out' },
        i === 0 ? 0 : `-=0.32`  // cards overlap in time → fast cascade
      )
    })

    // Float stage after all cards done
    tl.to(terminalRef.value, {
      y: -10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut'
    }, '+=0.1')
  }
}

// ─── Auto-scroll for mobile cards ─────────────────────────────────
let autoScrollTimer2 = null
const startAutoScroll = () => {
  if (window.innerWidth > 992 || !terminalRef.value) return
  
  autoScrollTimer2 = setInterval(() => {
    const stage = terminalRef.value
    if (!stage) return
    const card = stage.querySelector('.metric-card')
    if (!card) return
    
    const cardWidth = card.offsetWidth
    const gap = parseInt(window.getComputedStyle(stage).gap) || 0
    const scrollAmount = cardWidth + gap
    
    let targetScroll = stage.scrollLeft + scrollAmount
    // if reached end, loop to start
    if (targetScroll >= stage.scrollWidth - stage.clientWidth - 10) {
      targetScroll = 0
    }
    
    stage.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }, 3500) // 3.5 seconds
}

onMounted(() => {
  typeLoop()
  setTimeout(tickLive, 2000)
  setTimeout(() => {
    initGsap()
    startAutoScroll()
  }, 100)
})

onUnmounted(() => {
  clearTimeout(timer)
  clearTimeout(liveTimer)
  clearInterval(autoScrollTimer2)
})
</script>

<style scoped>
/* ─── Base ─────────────────────────────────────── */
.hero-section {
  position: relative;
  min-height: 100vh;
  padding-top: 6rem;
  padding-bottom: 5rem;
  display: flex;
  align-items: center;
  background-color: var(--bg-white);
  overflow: hidden;
}

/* GSAP start state — GSAP sets opacity:1 on animate */
.gsap-reveal { opacity: 0; }

/* ─── Background ───────────────────────────────── */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  animation: drift 8s ease-in-out infinite alternate;
}
.orb-1 {
  width: 520px; height: 520px;
  background: radial-gradient(circle, rgba(0,71,65,0.12) 0%, transparent 70%);
  top: -100px; right: -100px;
}
.orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(0,102,93,0.09) 0%, transparent 70%);
  bottom: -80px; left: -80px;
  animation-delay: -4s;
}
@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(20px, 20px) scale(1.05); }
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle, rgba(0,71,65,0.07) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}


/* ─── Layout ───────────────────────────────────── */
.hero-container { width: 100%; }
.hero-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 4rem;
  align-items: center;
}

/* ─── Status badge (Minimalist Highlight) ──────── */
.status-minimal {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text-dark);
  letter-spacing: -0.01em;
}
.highlight-line {
  position: relative;
  display: inline-block;
  z-index: 1;
}
.highlight-line::before {
  content: '';
  position: absolute;
  left: -4px;
  right: -4px;
  bottom: 2px;
  height: 38%;
  background: var(--sand-main);
  z-index: -1;
  border-radius: 2px;
  transform: skewX(-12deg);
}
:global(html.dark) .status-minimal {
  color: var(--text-dark);
}
:global(html.dark) .highlight-line::before {
  background: rgba(45, 212, 191, 0.25); /* Soft teal highlight */
}

/* ─── Title ────────────────────────────────────── */
.hero-title {
  font-size: clamp(2.5rem, 4.5vw, 3.75rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--text-dark);
  margin-bottom: 1rem;
}
.name-highlight {
  color: var(--cyprus-main);
  background-image: linear-gradient(var(--cyprus-main), var(--cyprus-main));
  background-size: 0% 3px;
  background-repeat: no-repeat;
  background-position: left bottom;
  animation: bg-underline-draw 0.8s cubic-bezier(0.16,1,0.3,1) 0.8s both;
  padding-bottom: 4px;
}
@keyframes bg-underline-draw {
  to { background-size: 100% 3px; }
}

/* ─── Role typing ──────────────────────────────── */
.hero-role {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  min-height: 1.75rem;
}
.role-prefix { color: var(--cyprus-main); }
.typed-text  { color: var(--text-dark); }
.cursor-blink {
  color: var(--cyprus-main);
  animation: blink 1s step-end infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

/* ─── Bio ──────────────────────────────────────── */
.hero-bio {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 2rem;
  max-width: 560px;
}

/* ─── CTA Buttons ──────────────────────────────── */
.hero-actions {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}
.btn-hero {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.15rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
  white-space: nowrap;
}
.btn-primary-hero {
  background: var(--cyprus-main);
  color: #fff;
  border: 2px solid var(--cyprus-main);
  box-shadow: 0 4px 16px rgba(0,71,65,0.25);
}
.btn-primary-hero:hover {
  background: var(--cyprus-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,71,65,0.35);
}
.btn-secondary-hero {
  background: var(--sand-main);
  color: var(--cyprus-main);
  border: 2px solid var(--sand-dark);
}
.btn-secondary-hero:hover {
  background: var(--sand-dark);
  transform: translateY(-2px);
}
.btn-ghost-hero {
  background: transparent;
  color: var(--text-muted);
  border: 2px solid var(--sand-dark);
}
.btn-ghost-hero:hover {
  color: var(--cyprus-main);
  border-color: var(--cyprus-main);
  transform: translateY(-2px);
}

/* ─── Stats ────────────────────────────────────── */
.hero-stats {
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
  padding-top: 1.75rem;
  border-top: 1.5px solid var(--sand-main);
}
.stat-item { display: flex; flex-direction: column; gap: 0.2rem; }
.stat-val {
  font-size: 2rem;
  font-weight: 900;
  color: var(--cyprus-main);
  line-height: 1;
}
.stat-lbl {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* ─── Floating Metric Cards Stage ─────────────── */
.cards-stage {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: -4.5rem; /* Mengangkat kartu lebih ke atas lagi */
  opacity: 1; /* Stage always visible; individual cards animated by GSAP */
}

/* Each card starts hidden — GSAP reveals them */
.metric-card { opacity: 0; }

.metric-card {
  padding: 1.35rem 1.5rem;
  border-radius: 1.25rem;
  box-shadow: 0 12px 32px rgba(0,71,65,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.metric-card:hover {
  transform: translateY(-4px) rotate(0deg) !important;
  box-shadow: 0 20px 45px rgba(0,71,65,0.18);
}

.card-tilt-left  { transform: rotate(-1.5deg); }
.card-tilt-right { transform: rotate(2deg); }

/* Card Cyprus */
.card-cyprus {
  background: var(--cyprus-main);
  color: var(--sand-main);
  border: 2px solid var(--cyprus-dark);
}

/* Card Sand */
.card-sand {
  background: var(--sand-main);
  color: var(--cyprus-main);
  border: 2px solid var(--sand-dark);
}

/* Card Dark Glass (New) */
.card-dark {
  background: #0f172a;
  color: #e2e8f0;
  border: 1px solid rgba(45,212,191,0.25);
  box-shadow: 0 12px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(45,212,191,0.1);
}

/* Card Header */
.mc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.mc-status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(240,237,228,0.12);
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
}
.mc-status-text {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}
.mc-tag {
  font-size: 0.72rem;
  opacity: 0.7;
  font-weight: 700;
}

/* Card Title Row */
.mc-title-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1rem;
}
.mc-icon {
  width: 42px; height: 42px;
  border-radius: 10px;
  background: rgba(240,237,228,0.15);
  color: var(--sand-main);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mc-icon-light {
  background: rgba(0,71,65,0.1);
  color: var(--cyprus-main);
}
.mc-heading {
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.2;
}
.mc-sub { font-size: 0.78rem; opacity: 0.8; }
.mc-text-cyprus { color: var(--cyprus-main); }
.mc-text-muted  { color: var(--text-muted); }

/* Progress Bar */
.mc-progress { margin-top: 0.75rem; }
.mc-progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  opacity: 0.9;
}
.mc-track {
  height: 6px;
  background: rgba(240,237,228,0.2);
  border-radius: 9999px;
  overflow: hidden;
}
.mc-fill {
  height: 100%;
  width: 0;
  background: var(--sand-main);
  border-radius: 9999px;
  animation: fill-bar 1.8s cubic-bezier(0.16,1,0.3,1) 1.2s forwards;
}
@keyframes fill-bar { to { width: 100%; } }

/* Tech Pills */
.tech-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.25rem;
}
.pill-badge {
  font-size: 0.72rem;
  font-weight: 700;
  background: #fff;
  color: var(--cyprus-main);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--sand-dark);
}

/* Pulse Dots */
.pulse-dot-sand, .pulse-dot-green {
  width: 7px; height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.pulse-dot-sand  { background: var(--sand-main); box-shadow: 0 0 6px var(--sand-main); }
.pulse-dot-green {
  background: #22c55e;
  animation: pulse-ring 1.8s infinite;
}
@keyframes pulse-ring {
  0%  { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
  70% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
  100%{ box-shadow: 0 0 0 0 rgba(34,197,94,0); }
}

/* Live Stats Row (Card 3) */
.mc-live-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.mc-live-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
}
.mc-live-val {
  font-size: 1.5rem;
  font-weight: 900;
  color: #2dd4bf;
  line-height: 1;
}
.mc-live-lbl {
  font-size: 0.68rem;
  color: #94a3b8;
  font-weight: 600;
}
.mc-live-divider {
  width: 1px; height: 36px;
  background: rgba(255,255,255,0.1);
}
.mc-live-desc {
  font-size: 0.7rem;
  color: #64748b;
  font-family: var(--font-mono);
}

/* ─── Floating Chips ───────────────────────────── */
.chip {
  position: absolute;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
  background: #fff;
  border: 1.5px solid var(--sand-dark);
  color: var(--cyprus-main);
  box-shadow: 0 4px 12px rgba(0,71,65,0.12);
  animation: float-chip 4s ease-in-out infinite alternate;
}
.chip-1 { top: -16px; right: 20px; animation-delay: 0s; }
.chip-2 { bottom: 40px; left: -20px; animation-delay: 1.2s; }
.chip-3 { bottom: -14px; right: 30px; animation-delay: 2.4s; }
@keyframes float-chip {
  from { transform: translateY(0); }
  to   { transform: translateY(-8px); }
}

/* ─── Scroll indicator ─────────────────────────── */
.scroll-down {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-muted);
  animation: bounce 2s ease-in-out infinite;
  opacity: 0.5;
}
@keyframes bounce {
  0%,100% { transform: translateX(-50%) translateY(0); }
  50%     { transform: translateX(-50%) translateY(8px); }
}

/* ─── Dark Mode ────────────────────────────────── */
:global(html.dark) .hero-section { background-color: var(--bg-white); }
:global(html.dark) .card-dark { border-color: rgba(45,212,191,0.3); }
:global(html.dark) .pill-badge {
  background: var(--bg-card);
  border-color: rgba(255,255,255,0.15);
}
:global(html.dark) .metric-card.card-sand {
  background: var(--sand-main);
  border-color: var(--sand-dark);
}
:global(html.dark) .hero-stats { border-color: var(--sand-main); }
:global(html.dark) .status-pill {
  background: rgba(45,212,191,0.1);
  border-color: rgba(45,212,191,0.3);
}
:global(html.dark) .orb-1 {
  background: radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%);
}
:global(html.dark) .orb-2 {
  background: radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%);
}

/* ─── Responsive ───────────────────────────────── */
@media (max-width: 992px) {
  .hero-grid { grid-template-columns: 1fr; gap: 3rem; }
  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .hero-bio {
    margin-left: auto;
    margin-right: auto;
  }
  .name-highlight {
    background-image: none !important;
  }
  .cards-stage {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    margin-top: 1rem;
    padding-bottom: 2rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .cards-stage::-webkit-scrollbar {
    display: none;
  }
  .metric-card {
    scroll-snap-align: center;
    min-width: 85vw;
    flex-shrink: 0;
  }
}

@media (max-width: 576px) {
  .hero-section { padding-top: 7rem; }
  .hero-actions { 
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem; 
  }
  .btn-hero { padding: 1rem 0.5rem; font-size: 0.95rem; justify-content: center; }
  .hero-stats { gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
  .metric-card {
    min-width: 90vw;
  }
}
</style>

<template>
  <section class="skills-section" id="skills">
    <div class="container">
      <div class="section-header">
        <span class="section-tag flex-tag">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>
          <span>KEAHLIAN & TECH STACK</span>
        </span>
        <h2 class="section-title">Teknologi & Toolsets Yang Saya Kuasai</h2>
        <p class="section-description">
          Kombinasi backend Laravel yang kuat dan frontend Vue.js modern untuk menghasilkan web app kelas atas.
        </p>
      </div>

      <div class="skills-grid">
        <!-- Backend Skills Card -->
        <div class="skill-category-card glass-card">
          <div class="category-header">
            <div class="category-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
            </div>
            <h3 class="font-display">Backend & Architecture</h3>
          </div>

          <div class="skills-list">
            <div v-for="(sk, idx) in skills.backend" :key="idx" class="skill-item">
              <div class="skill-info">
                <span class="skill-name">{{ sk.name }}</span>
                <span class="skill-exp">{{ sk.experience }}</span>
              </div>
              <div class="progress-track">
                <div class="progress-bar bar-cyprus" :style="{ width: sk.level + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Frontend Skills Card -->
        <div class="skill-category-card glass-card">
          <div class="category-header">
            <div class="category-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            </div>
            <h3 class="font-display">Frontend & EdTech</h3>
          </div>

          <div class="skills-list">
            <div v-for="(sk, idx) in skills.frontend" :key="idx" class="skill-item">
              <div class="skill-info">
                <span class="skill-name">{{ sk.name }}</span>
                <span class="skill-exp">{{ sk.experience }}</span>
              </div>
              <div class="progress-track">
                <div class="progress-bar bar-cyprus-light" :style="{ width: sk.level + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tools Badges Section -->
      <div class="tools-panel glass-panel">
        <h4 class="tools-title font-display">Alat Kerja & Workflow Harian:</h4>
        <div class="tools-flex">
          <div v-for="(tool, tIdx) in skills.tools" :key="tIdx" class="tool-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
            <span>{{ tool }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { portfolioData } from '../data/portfolioData'
const skills = portfolioData.skills
</script>

<style scoped>
.skills-section {
  padding: 6rem 0;
  background-color: var(--bg-white);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.skill-category-card {
  padding: 2rem;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.category-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(241, 101, 26, 0.12);
  color: var(--cyprus-main);
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-header h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-dark);
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.skill-name {
  font-weight: 700;
  color: var(--text-dark);
}

.skill-exp {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.progress-track {
  width: 100%;
  height: 7px;
  border-radius: 9999px;
  background: var(--sand-main);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 9999px;
  transition: width 1s ease-in-out;
}

.bar-cyprus {
  background: var(--cyprus-main);
}

.bar-cyprus-light {
  background: var(--cyprus-light);
}

.tools-panel {
  padding: 1.75rem 2rem;
  background: #ffffff;
}

.tools-title {
  font-size: 1rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--cyprus-main);
}

.tools-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tool-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  background: var(--sand-main);
  border: 1px solid var(--sand-dark);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--cyprus-main);
  transition: all 0.2s ease;
}

.tool-badge:hover {
  background: var(--cyprus-main);
  color: var(--sand-main);
}

@media (max-width: 992px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>

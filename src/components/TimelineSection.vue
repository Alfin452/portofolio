<template>
  <section class="timeline-section" id="timeline">
    <div class="container">
      <div class="section-header">
        <span class="section-tag flex-tag">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
          <span>PERJALANAN & MILESTONE</span>
        </span>
        <h2 class="section-title">Rekam Jejak Akademik & Pengalaman Projek</h2>
        <p class="section-description">
          Perkembangan keahlian saya dari bangku perkuliahan hingga pengerjaan proyek nyata.
        </p>
      </div>

      <div class="timeline-wrapper">
        <div 
          v-for="(item, idx) in timeline" 
          :key="idx" 
          class="timeline-item"
        >
          <div class="timeline-marker">
            <div class="marker-dot"></div>
            <div class="marker-line"></div>
          </div>

          <div class="timeline-content glass-card">
            <span class="badge badge-sand timeline-period">{{ item.period }}</span>
            <h3 class="timeline-title font-display">{{ item.title }}</h3>
            <span class="timeline-institution">{{ item.institution }}</span>
            <p class="timeline-desc">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { portfolioData } from '../data/portfolioData'
const timeline = portfolioData.timeline
</script>

<style scoped>
.timeline-section {
  padding: 6rem 0;
  background-color: var(--sand-main);
}

.timeline-wrapper {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.timeline-item {
  display: flex;
  gap: 1.75rem;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--cyprus-main);
  box-shadow: 0 0 10px rgba(241, 101, 26, 0.4);
  border: 3px solid var(--bg-white);
  flex-shrink: 0;
  margin-top: 1.25rem;
}

.marker-line {
  width: 2px;
  height: 100%;
  background: var(--sand-dark);
  margin-top: 0.5rem;
}

.timeline-content {
  padding: 1.75rem;
  flex-grow: 1;
}

.timeline-period {
  margin-bottom: 0.75rem;
}

.timeline-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  color: var(--text-dark);
}

.timeline-institution {
  display: block;
  font-size: 0.85rem;
  color: var(--cyprus-light);
  margin-bottom: 0.75rem;
  font-weight: 700;
}

.timeline-desc {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.65;
}
</style>

<template>
  <section class="testimonials-section" id="testimonials">
    <div class="container">
      <div class="section-header">
        <span class="section-tag flex-tag">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          <span>TESTIMONI & REKOMENDASI</span>
        </span>
        <h2 class="section-title">Apa Kata Klien & Rekan Tim</h2>
        <p class="section-description">
          Pengalaman nyata bekerja sama dalam membangun solusi web.
        </p>
      </div>

      <div class="testimonials-grid">
        <div 
          v-for="(t, idx) in testimonials" 
          :key="idx" 
          class="testimonial-card glass-card"
        >
          <!-- Rating Stars -->
          <div class="stars-flex">
            <span v-for="s in t.rating" :key="s" class="star">★</span>
          </div>

          <p class="quote-text">"{{ t.content }}"</p>

          <div class="user-info">
            <img :src="t.avatar" :alt="t.name" class="user-avatar" />
            <div>
              <h4 class="user-name font-display">{{ t.name }}</h4>
              <span class="user-role">{{ t.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { portfolioData } from '../data/portfolioData'
const testimonials = portfolioData.testimonials
</script>

<style scoped>
.testimonials-section {
  padding: 6rem 0;
  background-color: var(--bg-white);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 960px;
  margin: 0 auto;
}

.testimonial-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stars-flex {
  display: flex;
  gap: 0.25rem;
  color: var(--cyprus-main);
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.quote-text {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.7;
  font-style: italic;
  margin-bottom: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--cyprus-main);
}

.user-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text-dark);
}

.user-role {
  font-size: 0.8rem;
  color: var(--text-dim);
}

@media (max-width: 768px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>

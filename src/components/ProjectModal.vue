<template>
  <transition name="modal-fade">
    <div v-if="project" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-card glass-panel">
        <!-- Close Button -->
        <button class="close-btn" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <!-- Modal Header Image -->
        <div class="modal-image-box">
          <img :src="project.image" :alt="project.title" class="modal-img" />
          <div class="modal-image-overlay"></div>
          <span class="badge badge-primary modal-cat-badge">{{ project.category }}</span>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <h2 class="modal-title">{{ project.title }}</h2>
          <p class="modal-description">{{ project.longDescription }}</p>

          <!-- Key Metrics Grid -->
          <div v-if="project.metrics && project.metrics.length" class="metrics-grid">
            <div v-for="(metric, idx) in project.metrics" :key="idx" class="metric-card">
              <span class="metric-val gradient-text-emerald">{{ metric.value }}</span>
              <span class="metric-lbl">{{ metric.label }}</span>
            </div>
          </div>

          <!-- Feature Highlights -->
          <div v-if="project.highlights && project.highlights.length" class="highlights-box">
            <h4 class="box-title">Fitur & Keunggulan Utama:</h4>
            <ul class="highlights-list">
              <li v-for="(hl, hIdx) in project.highlights" :key="hIdx">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>{{ hl }}</span>
              </li>
            </ul>
          </div>

          <!-- Tech Stack Tags -->
          <div class="tech-tags-box">
            <h4 class="box-title">Teknologi Yang Digunakan:</h4>
            <div class="tags-flex">
              <span v-for="(tag, tIdx) in project.tags" :key="tIdx" class="tech-tag-pill">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="modal-actions">
            <a v-if="project.demoUrl && project.demoUrl !== '#'" :href="project.demoUrl" target="_blank" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              <span>Kunjungi Live Demo</span>
            </a>
            <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              <span>Repository GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    default: null
  }
})

defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-card {
  width: 100%;
  max-width: 720px;
  background: #0f172a;
  border: 1px solid var(--border-glow);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--accent-rose);
  border-color: var(--accent-rose);
}

.modal-image-box {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.modal-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #0f172a 0%, transparent 100%);
}

.modal-cat-badge {
  position: absolute;
  bottom: 1rem;
  left: 1.5rem;
}

.modal-body {
  padding: 1.5rem 2rem 2rem 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.2;
}

.modal-description {
  color: var(--text-muted);
  font-size: 1.025rem;
  line-height: 1.7;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.metric-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  padding: 0.85rem;
  border-radius: var(--radius-md);
  text-align: center;
  display: flex;
  flex-direction: column;
}

.metric-val {
  font-size: 1.35rem;
  font-weight: 800;
}

.metric-lbl {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.box-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-main);
}

.highlights-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.highlights-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.tags-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag-pill {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.25);
  color: #a5b4fc;
  font-size: 0.8rem;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>

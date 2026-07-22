<template>
  <section class="projects-section" id="projects">
    <div class="container">
      <div class="section-header">
        <span class="section-tag flex-tag">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          <span>PORTOFOLIO KARYA</span>
        </span>
        <h2 class="section-title">Showcase Proyek Web Pilihan</h2>
        <p class="section-description">
          Daftar aplikasi web & sistem informasi yang telah saya bangun dengan fokus pada fungsionalitas, keamanan, dan performa tinggi.
        </p>
      </div>

      <!-- Category Filter Tabs -->
      <div class="filter-tabs">
        <button 
          v-for="cat in categories" 
          :key="cat.slug"
          class="filter-btn"
          :class="{ 'active': activeCategory === cat.slug }"
          @click="activeCategory = cat.slug"
        >
          <span>{{ cat.name }}</span>
        </button>
      </div>

      <!-- Projects Grid -->
      <div class="projects-grid">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="project-card glass-card"
          @click="openModal(project)"
        >
          <!-- Image Box -->
          <div class="card-image-box">
            <img :src="project.image" :alt="project.title" class="card-img" />
            <div class="image-overlay"></div>
            <span class="badge badge-primary card-cat-tag">{{ project.category }}</span>
            <span v-if="project.featured" class="badge badge-sand card-featured-tag flex-tag-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>Featured</span>
            </span>
          </div>

          <!-- Card Content -->
          <div class="card-content">
            <h3 class="card-title font-display">{{ project.title }}</h3>
            <p class="card-desc">{{ project.description }}</p>

            <!-- Tags -->
            <div class="card-tags">
              <span v-for="(t, idx) in project.tags.slice(0, 4)" :key="idx" class="mini-tag">
                {{ t }}
              </span>
              <span v-if="project.tags.length > 4" class="mini-tag more">+{{ project.tags.length - 4 }}</span>
            </div>

            <!-- Footer Actions -->
            <div class="card-footer">
              <button class="btn-detail-link" @click.stop="openModal(project)">
                <span>Detail Spesifikasi</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>

              <div class="quick-links">
                <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" @click.stop class="icon-link" title="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
                <a v-if="project.demoUrl && project.demoUrl !== '#'" :href="project.demoUrl" target="_blank" @click.stop class="icon-link" title="Live Demo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Modal Popup -->
    <ProjectModal 
      :project="selectedProject" 
      @close="selectedProject = null" 
    />
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { portfolioData } from '../data/portfolioData'
import ProjectModal from './ProjectModal.vue'

const projects = portfolioData.projects
const activeCategory = ref('all')
const selectedProject = ref(null)

const categories = [
  { name: 'Semua Proyek', slug: 'all' },
  { name: 'Real-time & WebSockets', slug: 'realtime' },
  { name: 'Sistem Sekolah & CBT', slug: 'school' },
  { name: 'POS & Bisnis', slug: 'business' },
  { name: 'Media Pembelajaran (Scratch)', slug: 'education' },
  { name: 'Pelayanan Publik', slug: 'public' }
]

const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') return projects
  return projects.filter(p => p.categorySlug === activeCategory.value)
})

const openModal = (proj) => {
  selectedProject.value = proj
}
</script>

<style scoped>
.projects-section {
  padding: 6rem 0;
  background-color: var(--sand-main);
}

.filter-tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.filter-btn {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  color: var(--text-muted);
  padding: 0.6rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.filter-btn:hover {
  color: var(--cyprus-main);
  border-color: var(--cyprus-main);
}

.filter-btn.active {
  background: var(--cyprus-main);
  color: #ffffff;
  border-color: var(--cyprus-main);
  box-shadow: 0 4px 15px rgba(241, 101, 26, 0.25);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.project-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
}

.card-image-box {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .card-img {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(39, 39, 39, 0.7) 0%, transparent 60%);
}

.card-cat-tag {
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-size: 0.75rem;
  background: var(--bg-white);
  color: var(--cyprus-main);
}

.card-featured-tag {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.75rem;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.35;
  color: var(--text-dark);
}

.card-desc {
  color: var(--text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
  flex-grow: 1;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.mini-tag {
  background: var(--sand-main);
  border: 1px solid var(--sand-dark);
  color: var(--cyprus-main);
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
}

.mini-tag.more {
  color: var(--cyprus-main);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-light);
  padding-top: 1rem;
}

.btn-detail-link {
  background: transparent;
  border: none;
  color: var(--cyprus-main);
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-detail-link:hover {
  color: var(--cyprus-light);
  transform: translateX(3px);
}

.quick-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-link {
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.icon-link:hover {
  color: var(--cyprus-main);
}

@media (max-width: 992px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>

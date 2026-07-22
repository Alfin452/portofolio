<template>
  <section class="code-section" id="code">
    <div class="container">
      <div class="section-header">
        <span class="section-tag flex-tag">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
          <span>CODE ARCHITECTURE</span>
        </span>
        <h2 class="section-title">Contoh Kualitas Kode & Stabilitas Backend</h2>
        <p class="section-description">
          Lihat langsung bagaimana saya mengorganisasi event real-time Laravel dan composable Vue 3 secara efisien.
        </p>
      </div>

      <div class="code-window">
        <!-- Window Bar -->
        <div class="window-header">
          <div class="window-dots">
            <span class="dot dot-cyprus"></span>
            <span class="dot dot-sand"></span>
            <span class="dot dot-light"></span>
          </div>

          <!-- Code Tabs -->
          <div class="window-tabs">
            <button 
              v-for="(snippet, idx) in codeShowcases" 
              :key="snippet.id"
              class="tab-btn"
              :class="{ 'active': activeIndex === idx }"
              @click="activeIndex = idx"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <span>{{ snippet.fileName }}</span>
            </button>
          </div>

          <!-- Copy Button -->
          <button class="copy-btn" @click="copyCurrentCode">
            <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F0EDE4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>{{ copied ? 'Tersalin!' : 'Copy' }}</span>
          </button>
        </div>

        <!-- Code Content -->
        <div class="code-body">
          <div class="code-title-bar">
            <span class="snippet-title font-display">{{ currentSnippet.title }}</span>
            <span class="badge badge-sand">{{ currentSnippet.language.toUpperCase() }}</span>
          </div>

          <pre class="code-pre"><code>{{ currentSnippet.code }}</code></pre>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { portfolioData } from '../data/portfolioData'

const codeShowcases = portfolioData.codeShowcases
const activeIndex = ref(0)
const copied = ref(false)

const currentSnippet = computed(() => codeShowcases[activeIndex.value])

const copyCurrentCode = () => {
  navigator.clipboard.writeText(currentSnippet.value.code)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<style scoped>
.code-section {
  padding: 6rem 0;
  background-color: var(--bg-dark-slate);
  color: var(--sand-main);
}

.code-section .section-title {
  color: #ffffff;
}

.code-section .section-description {
  color: var(--sand-dark);
}

.code-window {
  border-radius: var(--radius-card);
  overflow: hidden;
  background: var(--cyprus-main);
  border: 1.5px solid var(--cyprus-dark);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  color: var(--sand-main);
}

.window-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  background: var(--cyprus-dark);
  border-bottom: 1px solid rgba(240, 237, 228, 0.15);
}

.window-dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot-cyprus { background: #ff5f56; }
.dot-sand { background: #ffbd2e; }
.dot-light { background: #27c93f; }

.window-tabs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-btn {
  background: transparent;
  border: 1px solid transparent;
  color: rgba(240, 237, 228, 0.7);
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: var(--font-mono);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: #fff;
  background: rgba(240, 237, 228, 0.1);
}

.tab-btn.active {
  color: var(--cyprus-main);
  background: var(--sand-main);
  font-weight: 700;
}

.copy-btn {
  background: rgba(240, 237, 228, 0.1);
  border: 1px solid rgba(240, 237, 228, 0.2);
  color: var(--sand-main);
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: rgba(240, 237, 228, 0.2);
}

.code-body {
  padding: 1.5rem;
}

.code-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed rgba(240, 237, 228, 0.15);
}

.snippet-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--sand-main);
}

.code-pre {
  margin: 0;
  overflow-x: auto;
  color: #F0EDE4;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .window-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
}
</style>

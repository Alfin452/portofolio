<template>
  <section class="faq-section" id="faq">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">TANYA JAWAB (FAQ)</span>
        <h2 class="section-title">Hal Yang Sering <span class="gradient-text">Ditanyakan</span></h2>
        <p class="section-description">
          Punya pertanyaan seputar proses pengerjaan, kerjasama, atau stack teknologi? Temukan jawabannya di bawah ini.
        </p>
      </div>

      <div class="faq-list">
        <div 
          v-for="(faq, idx) in faqs" 
          :key="idx" 
          class="faq-item glass-card"
          :class="{ 'active': activeIndex === idx }"
        >
          <button class="faq-button" @click="toggleFaq(idx)">
            <span class="faq-question font-display">{{ faq.question }}</span>
            <div class="faq-icon-box">
              <svg 
                class="faq-chevron"
                :class="{ 'rotate': activeIndex === idx }" 
                width="20" 
                height="20" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </button>

          <transition name="accordion">
            <div v-if="activeIndex === idx" class="faq-answer-box">
              <p class="faq-answer">{{ faq.answer }}</p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const activeIndex = ref(0)

const toggleFaq = (idx) => {
  activeIndex.value = activeIndex.value === idx ? null : idx
}

const faqs = [
  {
    question: "Bagaimana alur kerjasama pembuatan aplikasi web dengan Finn?",
    answer: "Sangat mudah dan transparan. Dimulai dari diskusi analisis kebutuhan & spesifikasi fitur, perancangan prototipe/UI, dilanjutkan ke tahap pengkodean Laravel & Vue.js, hingga pengujian dan deployment ke server/hosting pilihan Anda."
  },
  {
    question: "Berapa lama estimasi pengerjaan proyek web kustom atau SIAKAD/CBT?",
    answer: "Waktu pengerjaan bervariasi tergantung skala fitur. Untuk landing page interaktif berkisar 3-7 hari, sedangkan untuk aplikasi SaaS full-stack atau Sistem Informasi Sekolah (SIAKAD/CBT) berkisar 2-4 minggu."
  },
  {
    question: "Apakah sistem web yang dibangun sudah aman dan siap diskalakan?",
    answer: "Ya, tentu saja. Arsitektur Laravel dan Vue.js yang diterapkan selalu mengikuti standar praktik terbaik (Clean Architecture, Enkripsi Data, Proteksi CSRF/XSS, dan query database yang teroptimasi)."
  },
  {
    question: "Apakah ada dukungan garansi atau pemeliharaan (maintenance) pasca-rilis?",
    answer: "Setiap projek yang diselesaikan mendapatkan garansi perbaikan bug gratis dan dukungan pemeliharaan teknis untuk memastikan aplikasi berjalan lancar di lingkungan produksi."
  }
]
</script>

<style scoped>
.faq-section {
  padding: 6rem 0;
  background-color: var(--sand-main);
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-button {
  width: 100%;
  padding: 1.35rem 1.75rem;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
}

.faq-question {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-dark);
}

.faq-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--cyprus-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cyprus-main);
  flex-shrink: 0;
  margin-left: 1rem;
}

.faq-chevron {
  transition: transform 0.3s ease;
}

.faq-chevron.rotate {
  transform: rotate(180deg);
}

.faq-answer-box {
  padding: 0 1.75rem 1.5rem 1.75rem;
  border-top: 1px dashed var(--border-light);
}

.faq-answer {
  color: var(--text-muted);
  font-size: 0.975rem;
  line-height: 1.7;
  padding-top: 1rem;
}
</style>

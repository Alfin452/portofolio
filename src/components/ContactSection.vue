<template>
  <section class="contact-section" id="contact">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">KONTAK & KOMUNITAS</span>
        <h2 class="section-title">Mari Berdiskusi & Berkolaborasi</h2>
        <p class="section-description">
          Apakah Anda membutuhkan aplikasi web kustom, sistem sekolah/CBT, atau ingin mengajak gabung di tim Anda?
        </p>
      </div>

      <div class="contact-grid">
        <!-- Left: Direct Contact Info & Discord Server Banner -->
        <div class="contact-info-col">
          <!-- Discord Community Card -->
          <div class="discord-card glass-card">
            <div class="discord-header">
              <div class="discord-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </div>
              <div>
                <span class="badge badge-sand">Discord Server</span>
                <h3 class="discord-title font-display">{{ socials.discordServerName }}</h3>
              </div>
            </div>
            <p class="discord-desc">Gabung di server Discord saya untuk ngobrol santai, diskusi projek Laravel & Vue, atau sekadar berjejaring!</p>
            <a :href="socials.discord" target="_blank" class="btn btn-primary btn-full">
              <span>Join Server Discord</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>

          <!-- Contact Cards Flex -->
          <div class="contact-links-grid">
            <a :href="socials.whatsapp" target="_blank" class="contact-item glass-card">
              <div class="item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div class="item-meta">
                <span class="label">WhatsApp Direct</span>
                <span class="value font-display">{{ socials.whatsappDisplay }}</span>
              </div>
            </a>

            <a :href="'mailto:' + socials.email" class="contact-item glass-card">
              <div class="item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div class="item-meta">
                <span class="label">Email Professional</span>
                <span class="value font-display">{{ socials.email }}</span>
              </div>
            </a>

            <a :href="socials.github" target="_blank" class="contact-item glass-card">
              <div class="item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </div>
              <div class="item-meta">
                <span class="label">GitHub Profile</span>
                <span class="value font-display">Alfin452</span>
              </div>
            </a>

            <a :href="socials.instagram" target="_blank" class="contact-item glass-card">
              <div class="item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <div class="item-meta">
                <span class="label">Instagram</span>
                <span class="value font-display">{{ socials.instagramHandle }}</span>
              </div>
            </a>
          </div>
        </div>

        <!-- Right: Interactive Contact Form -->
        <div class="contact-form-card glass-card">
          <h3 class="form-title font-display">Kirim Pesan Langsung</h3>
          <p class="form-sub">Isi form di bawah ini dan saya akan merespons pesan Anda secepatnya.</p>

          <form @submit.prevent="handleSubmit" class="form-body">
            <div class="form-group">
              <label class="form-label">Nama Anda *</label>
              <input 
                v-model="form.name"
                type="text" 
                class="form-input" 
                placeholder="misal: Budi Santoso"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Email Anda *</label>
              <input 
                v-model="form.email"
                type="email" 
                class="form-input" 
                placeholder="nama@domain.com"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Subjek / Topik Proyek</label>
              <input 
                v-model="form.subject"
                type="text" 
                class="form-input" 
                placeholder="misal: Aplikasi Web Sekolah / Proyek Laravel"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Pesan Anda *</label>
              <textarea 
                v-model="form.message"
                class="form-input form-textarea" 
                rows="4"
                placeholder="Jelaskan kebutuhan projek atau pertanyaan Anda..."
                required
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary btn-full" :disabled="isSubmitting">
              <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              <span v-else class="spinner"></span>
              <span>{{ isSubmitting ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang' }}</span>
            </button>

            <!-- Success Toast Notification -->
            <transition name="fade">
              <div v-if="submittedSuccess" class="success-alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Pesan berhasil dikirim! Terima kasih telah menghubungi Finn.</span>
              </div>
            </transition>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { portfolioData } from '../data/portfolioData'

const socials = portfolioData.socials

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submittedSuccess = ref(false)

const handleSubmit = () => {
  isSubmitting.value = true
  
  setTimeout(() => {
    isSubmitting.value = false
    submittedSuccess.value = true
    
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''

    setTimeout(() => {
      submittedSuccess.value = false
    }, 4000)
  }, 1000)
}
</script>

<style scoped>
.contact-section {
  padding: 6rem 0;
  background-color: var(--sand-main);
  color: var(--text-dark);
}

.contact-section .section-title {
  color: var(--cyprus-main);
}

.contact-section .section-description {
  color: var(--text-muted);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

.contact-info-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.discord-card {
  padding: 1.75rem;
  background: var(--cyprus-main);
  color: #ffffff;
}

.discord-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.discord-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(240, 237, 228, 0.2);
  color: var(--sand-main);
  display: flex;
  align-items: center;
  justify-content: center;
}

.discord-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
}

.discord-desc {
  color: rgba(240, 237, 228, 0.9);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.contact-links-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.contact-item {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: var(--cyprus-main);
  background: #ffffff;
}

.item-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(0, 71, 65, 0.08);
  color: var(--cyprus-main);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-meta {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.item-meta .label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.item-meta .value {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--cyprus-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-form-card {
  padding: 2rem;
  background: #ffffff;
  color: var(--text-dark);
}

.form-title {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  color: var(--cyprus-main);
}

.form-sub {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 1.75rem;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--cyprus-main);
}

.form-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: var(--radius-sm);
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  color: var(--text-dark);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s ease;
}

.form-input:focus {
  border-color: var(--cyprus-main);
  box-shadow: 0 0 10px rgba(0, 71, 65, 0.15);
}

.form-textarea {
  resize: vertical;
}

.btn-full {
  width: 100%;
  padding: 0.9rem;
  margin-top: 0.5rem;
}

.success-alert {
  padding: 0.85rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--sand-main);
  border: 1px solid var(--sand-dark);
  color: var(--cyprus-main);
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(240, 237, 228, 0.3);
  border-top-color: var(--sand-main);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 992px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .contact-links-grid {
    grid-template-columns: 1fr;
  }
}
</style>

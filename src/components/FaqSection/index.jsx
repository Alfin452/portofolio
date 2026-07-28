import React, { useState } from 'react';
import './style.css';

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  const faqs = [
    {
      question: "Bagaimana alur kerjasama pembuatan aplikasi web dengan Finn?",
      answer: "Sangat mudah dan transparan. Dimulai dari diskusi analisis kebutuhan & spesifikasi fitur, perancangan prototipe/UI, dilanjutkan ke tahap pengkodean Laravel & React.js, hingga pengujian dan deployment ke server/hosting pilihan Anda."
    },
    {
      question: "Berapa lama estimasi pengerjaan proyek web kustom atau SIAKAD/CBT?",
      answer: "Waktu pengerjaan bervariasi tergantung skala fitur. Untuk landing page interaktif berkisar 3-7 hari, sedangkan untuk aplikasi SaaS full-stack atau Sistem Informasi Sekolah (SIAKAD/CBT) berkisar 2-4 minggu."
    },
    {
      question: "Apakah sistem web yang dibangun sudah aman dan siap diskalakan?",
      answer: "Ya, tentu saja. Arsitektur Laravel dan React.js yang diterapkan selalu mengikuti standar praktik terbaik (Clean Architecture, Enkripsi Data, Proteksi CSRF/XSS, dan query database yang teroptimasi)."
    },
    {
      question: "Apakah ada dukungan garansi atau pemeliharaan (maintenance) pasca-rilis?",
      answer: "Setiap projek yang diselesaikan mendapatkan garansi perbaikan bug gratis dan dukungan pemeliharaan teknis untuk memastikan aplikasi berjalan lancar di lingkungan produksi."
    }
  ];

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">TANYA JAWAB (FAQ)</span>
          <h2 className="section-title">Hal Yang Sering <span className="gradient-text">Ditanyakan</span></h2>
          <p className="section-description">
            Punya pertanyaan seputar proses pengerjaan, kerjasama, atau stack teknologi? Temukan jawabannya di bawah ini.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`faq-item glass-card ${activeIndex === idx ? 'active' : ''}`}
            >
              <button className="faq-button" onClick={() => toggleFaq(idx)}>
                <span className="faq-question font-display">{faq.question}</span>
                <div className="faq-icon-box">
                  <svg 
                    className={`faq-chevron ${activeIndex === idx ? 'rotate' : ''}`}
                    width="20" 
                    height="20" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </button>

              {activeIndex === idx && (
                <div className="faq-answer-box">
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;


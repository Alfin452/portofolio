import React, { useState, useMemo, useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import ProjectModal from '../ProjectModal/index.jsx';
import './style.css';

const ProjectsSection = () => {
  const flagshipProjects = portfolioData.flagshipProjects || [portfolioData.featuredProject];
  const allProjects = portfolioData.projects || [];

  const [activeFlagshipIndex, setActiveFlagshipIndex] = useState(0);
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const showcaseRef = useRef(null);
  const gridRef = useRef(null);

  const currentFlagship = flagshipProjects[activeFlagshipIndex] || flagshipProjects[0];

  // Auto-cycle screenshots for DigiVote (or multi-image projects) when not paused
  useEffect(() => {
    if (!currentFlagship || !currentFlagship.images || currentFlagship.images.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveScreenshotIndex((prev) => (prev + 1) % currentFlagship.images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [currentFlagship, isPaused]);

  // Switch flagship project
  const handleSelectFlagship = (index) => {
    if (index === activeFlagshipIndex) return;
    setActiveFlagshipIndex(index);
    setActiveScreenshotIndex(0);
  };

  // Keyboard navigation for WAI-ARIA tablist
  const handleKeyDownTab = (e, index) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % flagshipProjects.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + flagshipProjects.length) % flagshipProjects.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = flagshipProjects.length - 1;
    }
    if (nextIndex !== index) {
      handleSelectFlagship(nextIndex);
      const nextBtn = document.getElementById(`tab-flagship-${flagshipProjects[nextIndex].id}`);
      if (nextBtn) nextBtn.focus();
    }
  };

  // Categories for the secondary project gallery
  const categories = [
    { id: 'all', label: 'All Works' },
    { id: 'school', label: 'School & CBT' },
    { id: 'business', label: 'Fintech & POS' },
    { id: 'education', label: 'Interactive / EdTech' },
    { id: 'public', label: 'Public Sector' }
  ];

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return allProjects;
    return allProjects.filter((p) => p.categorySlug === activeCategory);
  }, [activeCategory, allProjects]);

  // GSAP scroll animations
  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const ctx = gsap.context(() => {
      // Background text parallax
      gsap.to('.projects-bg-text', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Section title reveal
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%'
          }
        });
      }

      // Spotlight showcase reveal
      if (showcaseRef.current) {
        gsap.from(showcaseRef.current, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top 80%'
          }
        });
      }

      // Secondary grid reveal
      if (gridRef.current) {
        gsap.from('.secondary-project-card', {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%'
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="projects-section" id="projects" ref={sectionRef}>
      {/* Background Typography */}
      <div className="projects-bg-text-wrapper">
        <h2 className="projects-bg-text text-huge text-outline">SELECTED</h2>
      </div>

      <div className="container projects-container">
        {/* Section Header */}
        <div className="projects-header" ref={titleRef}>
          <div className="projects-header-left">
            <span className="section-label-chip">FLAGSHIP &amp; CLIENT PORTFOLIO</span>
            <h2 className="section-tag-slash">/SELECTED WORK</h2>
          </div>
          <p className="projects-header-lead">
            Curated selection of enterprise systems, high-concurrency SaaS applications, and modern web architectures engineered for reliability.
          </p>
        </div>

        {/* --- INTERACTIVE TABBED SPOTLIGHT SHOWCASE --- */}
        <div className="spotlight-showcase-wrapper" ref={showcaseRef}>
          {/* Elegant Spotlight Selector Tabs with WAI-ARIA Navigation */}
          <div className="spotlight-tabs-bar" role="tablist" aria-label="Flagship Project Selector">
            {flagshipProjects.map((proj, idx) => {
              const isActive = idx === activeFlagshipIndex;
              return (
                <button
                  key={proj.id}
                  id={`tab-flagship-${proj.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-flagship-${proj.id}`}
                  tabIndex={isActive ? 0 : -1}
                  className={`spotlight-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectFlagship(idx)}
                  onKeyDown={(e) => handleKeyDownTab(e, idx)}
                >
                  <span className="tab-idx-mono">{proj.number || `0${idx + 1}`}</span>
                  <div className="tab-text-group">
                    <span className="tab-proj-title">{proj.selectorTitle || proj.title}</span>
                    <span className="tab-proj-sub">{proj.selectorSubtitle || proj.category}</span>
                  </div>
                  {isActive && <span className="tab-active-indicator" />}
                </button>
              );
            })}
          </div>

          {/* Spotlight Main Card Panel */}
          <div
            className="spotlight-main-card"
            role="tabpanel"
            id={`panel-flagship-${currentFlagship.id}`}
            aria-labelledby={`tab-flagship-${currentFlagship.id}`}
            tabIndex={0}
          >
            {/* Left Column: Intelligence, Metrics & Specs */}
            <div
              key={`content-${currentFlagship.id}`}
              className="spotlight-content-col animate-spotlight-enter"
            >
              <div className="spotlight-meta-row">
                <span className="spotlight-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  {currentFlagship.badge}
                </span>

                <div className="spotlight-live-status">
                  <span className="live-ping-dot"></span>
                  <span className="live-status-text">{currentFlagship.status || 'Active Deployment'}</span>
                </div>
              </div>

              {/* Title with Brand Highlight */}
              <h3 className="spotlight-title">
                {currentFlagship.isDigiVote ? (
                  <>
                    Digi<span className="digivote-highlight">Vote</span>.id
                  </>
                ) : (
                  currentFlagship.title
                )}
              </h3>

              <h4 className="spotlight-tagline">{currentFlagship.tagline}</h4>
              <p className="spotlight-description">{currentFlagship.description}</p>

              {/* Key Metrics Grid */}
              <div className="spotlight-metrics-row">
                {currentFlagship.stats &&
                  currentFlagship.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="spotlight-metric-card">
                      <span className="spotlight-metric-val">{stat.value}</span>
                      <span className="spotlight-metric-lbl">{stat.label}</span>
                    </div>
                  ))}
              </div>

              {/* Feature Highlights Checklist */}
              <div className="spotlight-features-list">
                <h5 className="spotlight-features-heading">Architecture Highlights</h5>
                <div className="features-checklist-grid">
                  {currentFlagship.features &&
                    currentFlagship.features.map((feat, fIdx) => (
                      <div key={fIdx} className="feature-check-item">
                        <div className="feature-check-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="feature-check-text">{feat}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Tech Badges */}
              <div className="spotlight-tech-stack">
                {currentFlagship.techStack &&
                  currentFlagship.techStack.map((tech, tIdx) => (
                    <span key={tIdx} className="spotlight-tech-pill">
                      {tech}
                    </span>
                  ))}
              </div>

              {/* Action Buttons */}
              <div className="spotlight-actions-row">
                {currentFlagship.demoUrl && currentFlagship.demoUrl !== '#' ? (
                  <>
                    <a
                      href={currentFlagship.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-spotlight-primary"
                    >
                      <span>Visit Live Platform</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>

                    <button
                      type="button"
                      className="btn-spotlight-secondary"
                      onClick={() => setSelectedProject(currentFlagship)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="3" x2="9" y2="21"></line>
                      </svg>
                      <span>Case Study &amp; Specs</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn-spotlight-primary"
                    onClick={() => setSelectedProject(currentFlagship)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                    </svg>
                    <span>Explore Architecture &amp; Demo</span>
                  </button>
                )}

                {currentFlagship.githubUrl && (
                  <a
                    href={currentFlagship.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-spotlight-icon"
                    title="View GitHub Repository"
                    aria-label="View GitHub Repository"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    <span className="btn-github-text hide-desktop">View Source Code</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Sleek Browser Dashboard Mockup Frame */}
            <div
              key={`mockup-${currentFlagship.id}`}
              className="spotlight-mockup-col animate-spotlight-enter"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="browser-mockup-frame">
                {/* Browser Chrome Header */}
                <div className="browser-chrome-bar">
                  <div className="browser-window-controls">
                    <span className="control-dot dot-close"></span>
                    <span className="control-dot dot-min"></span>
                    <span className="control-dot dot-max"></span>
                  </div>

                  <div className="browser-address-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span className="browser-url-text">{currentFlagship.browserUrl || 'https://digivote.id'}</span>
                  </div>

                  <div className="browser-status-chip">
                    <span className="status-indicator-green"></span>
                    <span className="status-indicator-label">SSL SECURE</span>
                  </div>
                </div>

                {/* Viewport Screen */}
                <div
                  className="browser-screen-viewport"
                  onClick={() => setSelectedProject(currentFlagship)}
                  title="Click to view complete case study"
                >
                  {/* Digivote Specific Carousel with Real Local Screenshots */}
                  {currentFlagship.isDigiVote && currentFlagship.images ? (
                    <div className="carousel-stage">
                      {currentFlagship.images.map((imgObj, idx) => {
                        const imgSrc = typeof imgObj === 'string' ? imgObj : imgObj.src;
                        const caption = typeof imgObj === 'string' ? `Slide ${idx + 1}` : imgObj.caption;
                        return (
                          <div
                            key={idx}
                            className={`carousel-slide-item ${idx === activeScreenshotIndex ? 'active' : ''}`}
                          >
                            <img
                              src={imgSrc}
                              alt={`DigiVote Preview - ${caption}`}
                              className="carousel-slide-img"
                            />
                            <div className="slide-caption-badge">
                              <span className="caption-pulse"></span>
                              <span>{caption}</span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Floating Architecture HUD Tag */}
                      <div className="hud-floating-tag">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                        <span>Reverb WebSockets &lt; 100ms</span>
                      </div>
                    </div>
                  ) : currentFlagship.id === 'cbt-gibs-system' ? (
                    /* CBT GIBS System High-Fidelity UI Stage */
                    <div className="mockup-system-stage cbt-theme">
                      {activeScreenshotIndex === 0 ? (
                        /* Module View 1: CBT Examination Engine */
                        <div className="cbt-screen-module engine-view">
                          <div className="cbt-module-topbar">
                            <div className="cbt-module-identity">
                              <span className="cbt-core-badge">GIBS CBT v2.4</span>
                              <span className="cbt-candidate-tag">Santri: Ahmad Fauzi (#88219)</span>
                            </div>
                            <div className="cbt-timer-badge">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              <span>01:42:15 Server Sync</span>
                            </div>
                          </div>

                          <div className="cbt-module-body">
                            <div className="cbt-question-card">
                              <div className="cbt-question-header">
                                <span className="question-num-pill">Soal 14 / 50</span>
                                <span className="question-type-pill">Pilihan Ganda • Bobot 2.0</span>
                              </div>
                              <p className="cbt-question-stem">
                                Manakah protokol full-duplex yang digunakan pada engine Laravel Reverb untuk streaming leaderboard pemilih tanpa beban HTTP polling berulang?
                              </p>
                              <div className="cbt-options-grid">
                                <div className="cbt-option-item">
                                  <span className="opt-letter">A</span>
                                  <span className="opt-label">HTTP Long Polling</span>
                                </div>
                                <div className="cbt-option-item selected">
                                  <span className="opt-letter">B</span>
                                  <span className="opt-label">WebSockets Protocol (Laravel Reverb)</span>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opt-check-icon">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </div>
                                <div className="cbt-option-item">
                                  <span className="opt-letter">C</span>
                                  <span className="opt-label">Server-Sent Events (SSE) Uni-directional</span>
                                </div>
                              </div>
                            </div>

                            <div className="cbt-security-floating-card">
                              <div className="security-status-line">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                <span>Anti-Cheating Shield: Active</span>
                              </div>
                              <div className="security-metric-tags">
                                <span>0x Tab-Blur</span>
                                <span>Lock Screen</span>
                                <span>Randomized Bank</span>
                              </div>
                            </div>
                          </div>

                          <div className="cbt-module-footer">
                            <div className="cbt-palette-row">
                              <span className="palette-chip chip-done">Q1</span>
                              <span className="palette-chip chip-done">Q2</span>
                              <span className="palette-chip chip-done">Q3</span>
                              <span className="palette-chip chip-done">Q4</span>
                              <span className="palette-chip chip-active">Q5</span>
                              <span className="palette-chip chip-idle">Q6</span>
                              <span className="palette-chip chip-idle">Q7</span>
                              <span className="palette-chip chip-idle">Q8...</span>
                            </div>
                            <span className="cbt-auto-tag">Instant Auto-Grading &amp; Excel Export</span>
                          </div>
                        </div>
                      ) : (
                        /* Module View 2: Academic Portal & Clinic System */
                        <div className="cbt-screen-module portal-view">
                          <div className="cbt-module-topbar">
                            <div className="cbt-module-identity">
                              <span className="cbt-core-badge blue">GIBS PORTAL</span>
                              <span className="cbt-candidate-tag">portal.gibs.sch.id</span>
                            </div>
                            <div className="cbt-rbac-badge">
                              <span className="rbac-dot"></span>
                              <span>Multi-Unit RBAC Active</span>
                            </div>
                          </div>

                          <div className="cbt-portal-cards-grid">
                            <div className="portal-subsystem-card">
                              <div className="subsystem-header">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                </svg>
                                <span className="subsystem-name">Portal Akademik Santri</span>
                              </div>
                              <div className="subsystem-stat-line">
                                <span className="stat-lbl">Kehadiran Santri:</span>
                                <span className="stat-val highlight">98.4% On-Track</span>
                              </div>
                              <span className="subsystem-desc">Integrasi rapor digital &amp; jadwal kurikulum</span>
                            </div>

                            <div className="portal-subsystem-card">
                              <div className="subsystem-header">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                </svg>
                                <span className="subsystem-name">Rekam Medis Klinik</span>
                              </div>
                              <div className="subsystem-stat-line">
                                <span className="stat-lbl">Status Klinik:</span>
                                <span className="stat-val status-healthy">Siaga Sehat</span>
                              </div>
                              <span className="subsystem-desc">Pencatatan riwayat medis &amp; obat santri berkala</span>
                            </div>

                            <div className="portal-subsystem-card">
                              <div className="subsystem-header">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="8" x2="12" y2="12"></line>
                                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <span className="subsystem-name">Evaluasi KPI Staf</span>
                              </div>
                              <div className="subsystem-stat-line">
                                <span className="stat-lbl">Target Capaian:</span>
                                <span className="stat-val">100% Terevaluasi</span>
                              </div>
                              <span className="subsystem-desc">Pengukuran indikator kinerja guru &amp; musyrif</span>
                            </div>
                          </div>

                          <div className="cbt-module-footer">
                            <span className="single-signon-tag">Single Sign-On Multi-Subdomain Architecture</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* E-Koperasi & KopDes Store High-Fidelity UI Stage */
                    <div className="mockup-system-stage koperasi-theme">
                      {activeScreenshotIndex === 0 ? (
                        /* Module View 1: POS Barcode Cashier */
                        <div className="koperasi-screen-module pos-view">
                          <div className="koperasi-module-topbar">
                            <div className="koperasi-module-identity">
                              <span className="koperasi-core-badge">KopDes POS #01</span>
                              <span className="koperasi-operator-tag">Kasir: Utama Desa</span>
                            </div>
                            <div className="koperasi-scanner-pill">
                              <span className="scanner-laser-dot"></span>
                              <span>Barcode Scanner Ready</span>
                            </div>
                          </div>

                          <div className="koperasi-pos-stage">
                            <div className="pos-cart-register">
                              <div className="cart-item-row">
                                <span className="cart-item-name">Pupuk Organik Cair 1L (x2)</span>
                                <span className="cart-item-price">Rp 90.000</span>
                              </div>
                              <div className="cart-item-row">
                                <span className="cart-item-name">Beras Rojolele Desa 10kg</span>
                                <span className="cart-item-price">Rp 135.000</span>
                              </div>
                              <div className="cart-item-row discount">
                                <span className="cart-item-name">Diskon Anggota Koperasi</span>
                                <span className="cart-item-price">-Rp 10.000</span>
                              </div>
                              <div className="cart-divider"></div>
                              <div className="cart-total-row">
                                <span className="cart-total-lbl">TOTAL PEMBAYARAN</span>
                                <span className="cart-total-val">Rp 215.000</span>
                              </div>
                            </div>

                            <div className="pos-qris-status-box">
                              <div className="qris-settled-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>Midtrans Dynamic QRIS Settled</span>
                              </div>
                              <span className="pos-print-tag">Thermal Struk Ready • Inventory Synced</span>
                            </div>
                          </div>

                          <div className="koperasi-module-footer">
                            <div className="koperasi-feature-chips">
                              <span className="kop-chip">USB Barcode HID</span>
                              <span className="kop-chip">Struk Otomatis</span>
                              <span className="kop-chip">Multi-Kasir Desa</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Module View 2: Automated Double-Entry Ledger & SHU */
                        <div className="koperasi-screen-module ledger-view">
                          <div className="koperasi-module-topbar">
                            <div className="koperasi-module-identity">
                              <span className="koperasi-core-badge emerald">KopDes FINANCIAL</span>
                              <span className="koperasi-operator-tag">Simpan Pinjam &amp; SHU</span>
                            </div>
                            <div className="koperasi-audit-badge">
                              <span className="audit-dot"></span>
                              <span>Audit-Ready Reconciled</span>
                            </div>
                          </div>

                          <div className="ledger-metrics-deck">
                            <div className="ledger-card-deck-item">
                              <span className="deck-lbl">Simpanan Anggota</span>
                              <span className="deck-val">Rp 72.700.000</span>
                              <span className="deck-sub">Pokok, Wajib &amp; Sukarela</span>
                            </div>
                            <div className="ledger-card-deck-item">
                              <span className="deck-lbl">Pinjaman Produktif</span>
                              <span className="deck-val">Rp 38.500.000</span>
                              <span className="deck-sub">100% Kolektibilitas Lancar</span>
                            </div>
                            <div className="ledger-card-deck-item highlight">
                              <span className="deck-lbl">Sisa Hasil Usaha (SHU)</span>
                              <span className="deck-val text-emerald">Rp 14.850.000</span>
                              <span className="deck-sub">Auto Calculation Formula</span>
                            </div>
                          </div>

                          <div className="ledger-balance-check-bar">
                            <div className="balance-indicator-pair">
                              <span className="bal-lbl">Debit:</span>
                              <span className="bal-val">Rp 126.050.000</span>
                            </div>
                            <div className="balance-indicator-pair">
                              <span className="bal-lbl">Kredit:</span>
                              <span className="bal-val">Rp 126.050.000</span>
                            </div>
                            <span className="bal-status-chip">Selisih: Rp 0 (Balanced)</span>
                          </div>

                          <div className="koperasi-module-footer">
                            <span className="single-signon-tag">Buku Kas &amp; Neraca Keuangan Siap Musyawarah Desa</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Click to expand hover hint */}
                  <div className="viewport-hover-hint">
                    <div className="hint-pill">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                      <span>Explore System Details</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Screenshot & Module View Nav Strip for all Flagships */}
                {currentFlagship.images && currentFlagship.images.length > 0 && (
                  <div className="browser-screenshot-strip">
                    {currentFlagship.images.map((imgObj, idx) => {
                      const caption = typeof imgObj === 'string' ? `View ${idx + 1}` : imgObj.caption;
                      const shortLabel = (typeof imgObj === 'object' && imgObj.shortLabel) || caption;
                      const isActive = idx === activeScreenshotIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`screenshot-nav-btn ${isActive ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveScreenshotIndex(idx);
                          }}
                          title={caption}
                          aria-label={`Switch view to ${caption}`}
                        >
                          <span className="nav-btn-dot"></span>
                          <span className="nav-btn-text">{shortLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- SECONDARY PROJECT REPOSITORY / ARCHIVE --- */}
        <div className="secondary-projects-header">
          <div className="secondary-title-group">
            <span className="secondary-tag-chip">ARCHIVE &amp; CLIENT DEPLOYMENTS</span>
            <h3 className="secondary-section-title">/OTHER NOTEWORTHY PROJECTS</h3>
            <p className="secondary-section-subtitle">
              Enterprise management applications, inventory systems, educational software, and public services.
            </p>
          </div>

          {/* Minimal Filter Tabs */}
          <div className="filter-minimal-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-minimal-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Projects */}
        <div className="dribbble-projects-grid" ref={gridRef}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="dribbble-project-card secondary-project-card"
              onClick={() => setSelectedProject(project)}
            >
              <div className="dribbble-card-image">
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="card-hover-overlay">
                  <div className="hover-circle">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="19" x2="19" y2="5"></line>
                      <polyline points="9 5 19 5 19 15"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="dribbble-card-info">
                <div className="dribbble-card-meta">
                  <span className="meta-pill">{project.category}</span>
                  {project.tags && project.tags[0] && (
                    <span className="meta-pill tech-tag">{project.tags[0]}</span>
                  )}
                </div>
                <h4 className="dribbble-card-title">{project.title}</h4>
                <p className="dribbble-card-desc">{project.description}</p>
                <div className="dribbble-card-footer">
                  <span className="card-explore-link">
                    <span>View Architecture</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default ProjectsSection;

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import ProjectModal from '../ProjectModal/index.jsx';
import './style.css';

const DiagonalArrowSvg = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const mvpFeatureSpecs = [
  {
    title: 'Multi-Panel MVC Architecture',
    sub: 'Dedicated panels for Voter, Organizer & Superadmin'
  },
  {
    title: 'Laravel Reverb WebSockets',
    sub: 'Live leaderboard broadcast under 100ms latency'
  },
  {
    title: 'High-Concurrency Event Engine',
    sub: '36,282+ verified public votes across 8+ live events'
  },
  {
    title: 'Automated Xendit QRIS Gateway',
    sub: 'Instant dynamic QRIS for all banks & e-wallets'
  }
];

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeMvpSlide, setActiveMvpSlide] = useState(0);
  const [isMvpHovered, setIsMvpHovered] = useState(false);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const toolbarRef = useRef(null);
  const gridRef = useRef(null);

  // Extract DigiVote Flagship MVP data
  const digivoteFlagship = useMemo(() => {
    const found = (portfolioData.flagshipProjects || []).find(
      (p) => p.id === 'digivote-flagship'
    );
    if (!found) return null;
    const rawGh = found.github ?? found.githubUrl ?? null;
    const validGithub =
      typeof rawGh === 'string' && rawGh.trim() !== '' && rawGh.trim() !== '#'
        ? rawGh.trim()
        : null;
    return {
      ...found,
      github: validGithub,
      githubUrl: validGithub,
      displayTitle: 'DigiVote.id — Real-time E-Voting SaaS Platform',
      projectType: 'real',
      badgeLabel: 'MVP • REAL PROJECT',
      pillTags: ['Laravel 12', 'Reverb WebSockets', 'Xendit QRIS']
    };
  }, []);

  // Build curated list of regular projects (excluding digivote-flagship which has its own MVP showcase card)
  const regularProjects = useMemo(() => {
    const rawProjects = portfolioData.projects || [];

    const metaMap = {
      'gibs-portal': {
        displayTitle: 'GIBS Portal — Integrated School & Clinic System',
        projectType: 'real',
        badgeLabel: 'REAL PROJECT',
        pillTags: ['School Portal', 'GIBS Team']
      },
      'cbt-project': {
        displayTitle: 'CBT Exam — Computer-Based Online Examination Engine',
        projectType: 'real',
        badgeLabel: 'REAL PROJECT',
        pillTags: ['Dashboard', 'Laravel & Vue']
      },
      'e-koperasi': {
        displayTitle: 'KopDes — Digital Cooperative Savings & POS Platform',
        projectType: 'real',
        badgeLabel: 'REAL PROJECT',
        pillTags: ['Fintech & POS', 'Midtrans QRIS']
      },
      'e-apotek': {
        displayTitle: 'E-Apotek — Pharmacy Inventory & Fast Cashier System',
        projectType: 'exploration',
        badgeLabel: 'EXPLORATION',
        pillTags: ['POS System', 'Vue.js']
      },
      'interactive-scratch-apps': {
        displayTitle: 'EduScratch — Interactive Gamified Learning Media',
        projectType: 'exploration',
        badgeLabel: 'EXPLORATION',
        pillTags: ['Interactive Media', 'EdTech']
      },
      'survey-zi': {
        displayTitle: 'Survey ZI — Public Satisfaction & Integrity Analytics',
        projectType: 'real',
        badgeLabel: 'REAL PROJECT',
        pillTags: ['Web App', 'Chart.js']
      }
    };

    return rawProjects.map((proj) => {
      const custom = metaMap[proj.id] || {};
      const isExploration =
        custom.projectType === 'exploration' ||
        proj.categorySlug === 'education' ||
        proj.featured === false;
      const rawGh = proj.github ?? proj.githubUrl ?? null;
      const validGithub =
        typeof rawGh === 'string' && rawGh.trim() !== '' && rawGh.trim() !== '#'
          ? rawGh.trim()
          : null;

      return {
        ...proj,
        github: validGithub,
        githubUrl: validGithub,
        displayTitle: custom.displayTitle || proj.title,
        projectType: custom.projectType || (isExploration ? 'exploration' : 'real'),
        badgeLabel: custom.badgeLabel || (isExploration ? 'EXPLORATION' : 'REAL PROJECT'),
        pillTags: custom.pillTags || [
          proj.category || 'Web App',
          (proj.tags && proj.tags[0]) || 'Laravel'
        ]
      };
    });
  }, []);

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'real', label: 'Real Project' },
    { id: 'exploration', label: 'Exploration' }
  ];

  const showMvpCard =
    Boolean(digivoteFlagship) &&
    (activeFilter === 'all' || activeFilter === 'real');

  const filteredRegularProjects = useMemo(() => {
    if (activeFilter === 'all') return regularProjects;
    return regularProjects.filter((item) => item.projectType === activeFilter);
  }, [activeFilter, regularProjects]);

  const visibleRegularProjects = useMemo(() => {
    if (showAll || activeFilter !== 'all') {
      return filteredRegularProjects;
    }
    return filteredRegularProjects.slice(0, 4);
  }, [filteredRegularProjects, showAll, activeFilter]);

  const mvpImages =
    digivoteFlagship && Array.isArray(digivoteFlagship.images) && digivoteFlagship.images.length > 0
      ? digivoteFlagship.images
      : [
          {
            src: '/images/projects/digivote-mockup.png',
            caption: 'Multi-Panel Dashboard Mockup',
            shortLabel: 'Overview'
          }
        ];

  // Auto-cycle activeMvpSlide every 4500ms unless hovered or modal open
  useEffect(() => {
    if (isMvpHovered || Boolean(selectedProject) || mvpImages.length <= 1) {
      return undefined;
    }
    const timer = setInterval(() => {
      setActiveMvpSlide((prev) => (prev + 1) % mvpImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isMvpHovered, selectedProject, mvpImages.length]);

  // GSAP Scroll Animations
  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const ctx = gsap.context(() => {
      gsap.to('.selected-work-watermark', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%'
          }
        });
      }

      if (toolbarRef.current) {
        gsap.from(toolbarRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          delay: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: toolbarRef.current,
            start: 'top 88%'
          }
        });
      }

      if (gridRef.current) {
        gsap.from('.selected-work-mvp-card, .selected-work-card', {
          y: 36,
          opacity: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%'
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  const handleToggleViewAll = () => {
    if (activeFilter !== 'all') {
      setActiveFilter('all');
      setShowAll(true);
    } else {
      setShowAll((prev) => !prev);
    }
  };

  const activeImage = mvpImages[activeMvpSlide % mvpImages.length];
  const secondaryImages = mvpImages
    .map((img, idx) => ({ ...img, origIdx: idx }))
    .filter((item) => item.origIdx !== activeMvpSlide % mvpImages.length)
    .slice(0, 3);

  return (
    <section className="selected-work-section" id="projects" ref={sectionRef}>
      <div className="container selected-work-container">
        {/* Centered Header with Giant Faint PORTFOLIO Watermark */}
        <div className="selected-work-header" ref={headerRef}>
          <span className="selected-work-watermark" aria-hidden="true">
            PORTFOLIO
          </span>
          <h2 className="selected-work-title">/SELECTED WORK</h2>
        </div>

        {/* Filter Bar & View All Work Pill Action */}
        <div className="selected-work-toolbar" ref={toolbarRef}>
          <div className="selected-work-tabs" role="tablist" aria-label="Filter projects">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`selected-work-tab ${isActive ? 'active' : ''}`}
                  onClick={() => handleFilterChange(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="view-all-work-pill"
            onClick={handleToggleViewAll}
          >
            <span>
              {showAll && activeFilter === 'all' ? 'Show Featured' : 'View All Work'}
            </span>
            <DiagonalArrowSvg size={14} />
          </button>
        </div>

        {/* 2-Column Editorial Card Grid + Full-Span Dark Monolith MVP Showcase */}
        <div className="selected-work-grid" ref={gridRef}>
          {showMvpCard && (
            <article
              className="selected-work-mvp-card"
              onMouseEnter={() => setIsMvpHovered(true)}
              onMouseLeave={() => setIsMvpHovered(false)}
              onClick={() => setSelectedProject(digivoteFlagship)}
              tabIndex={0}
              role="button"
              aria-label={`View flagship case study for ${digivoteFlagship.displayTitle}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedProject(digivoteFlagship);
                }
              }}
            >
              {/* Left Column: Pure Editorial Monochrome + 01-04 Interactive Feature Sync */}
              <div className="mvp-card-content">
                <div className="mvp-status-row">
                  <span className="mvp-status-pill">MVP FLAGSHIP • DIGIVOTE.ID</span>
                  <span className="mvp-stat-summary">36,282+ Votes • 8+ Events</span>
                </div>

                <h3 className="mvp-card-title">
                  DigiVote.id — Real-time E-Voting SaaS Platform
                </h3>

                <p className="mvp-card-desc">{digivoteFlagship.description}</p>

                <div
                  className="mvp-feature-sync-list"
                  role="tablist"
                  aria-label="DigiVote Architecture & Screens"
                >
                  {mvpFeatureSpecs.map((spec, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={idx === activeMvpSlide}
                      className={`mvp-feature-sync-item ${idx === activeMvpSlide ? 'active' : ''}`}
                      onMouseEnter={() => setActiveMvpSlide(idx)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMvpSlide(idx);
                      }}
                    >
                      <span className="sync-item-idx">0{idx + 1}</span>
                      <div className="sync-item-text">
                        <span className="sync-item-title">{spec.title}</span>
                        <span className="sync-item-sub">{spec.sub}</span>
                      </div>
                      <span className="sync-item-indicator">
                        <DiagonalArrowSvg size={14} />
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mvp-card-footer">
                  <div className="mvp-actions-row">
                    <a
                      href={digivoteFlagship.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mvp-btn-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Visit digivote.id</span>
                      <DiagonalArrowSvg size={15} />
                    </a>

                    <button
                      type="button"
                      className="mvp-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(digivoteFlagship);
                      }}
                    >
                      <span>Read Case Study</span>
                      <DiagonalArrowSvg size={15} />
                    </button>
                  </div>

                  <div className="mvp-tags-row">
                    {['Laravel 12', 'Reverb WebSockets', 'Xendit QRIS'].map((tag) => (
                      <span key={tag} className="mvp-dark-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: FragWater Bento Collage Stage + Center Circular Arrow Button */}
              <div className="mvp-card-showcase">
                <div className="mvp-bento-stage">
                  <span className="work-type-badge">REAL PROJECT</span>

                  {/* Primary Main Stage Left */}
                  <div className="mvp-bento-primary">
                    <img
                      key={activeImage.src}
                      src={activeImage.src}
                      alt={activeImage.caption}
                      className="mvp-stage-img"
                    />
                    <div className="mvp-primary-caption">
                      <span className="caption-idx">
                        0{activeMvpSlide + 1} / 0{mvpImages.length}
                      </span>
                      <span className="caption-text">{activeImage.caption}</span>
                    </div>
                  </div>

                  {/* Secondary 3-Screen Vertical Bento Collage Strip Right */}
                  <div className="mvp-bento-strip">
                    {secondaryImages.map((item) => (
                      <button
                        key={item.origIdx}
                        type="button"
                        className="mvp-bento-thumb"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMvpSlide(item.origIdx);
                        }}
                        aria-label={`Switch to ${item.shortLabel}`}
                      >
                        <img
                          src={item.src}
                          alt={item.caption}
                          className="bento-thumb-img"
                        />
                        <span className="bento-thumb-label">{item.shortLabel}</span>
                      </button>
                    ))}
                  </div>

                  {/* FragWater Signature Center Circular White Arrow Button */}
                  <button
                    type="button"
                    className="mvp-bento-center-arrow"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(digivoteFlagship);
                    }}
                    aria-label="Open DigiVote Case Study"
                  >
                    <DiagonalArrowSvg size={20} />
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* Regular 2x2 Project Cards */}
          {visibleRegularProjects.map((project) => (
            <article
              key={project.id}
              className="selected-work-card"
              onClick={() => setSelectedProject(project)}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${project.displayTitle}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedProject(project);
                }
              }}
            >
              {/* Thumbnail Image Box */}
              <div className="work-card-media">
                <span className="work-type-badge">{project.badgeLabel}</span>
                <img
                  src={project.image}
                  alt={project.title}
                  className="work-card-img"
                  loading="lazy"
                />
                <div className="work-card-overlay">
                  <span className="work-hover-arrow" aria-hidden="true">
                    <DiagonalArrowSvg size={20} />
                  </span>
                </div>
              </div>

              {/* Card Footer Info: Title + 2 Pill Tags */}
              <div className="work-card-body">
                <h3 className="work-card-title">{project.displayTitle}</h3>
                <div className="work-card-tags">
                  {project.pillTags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="work-card-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default ProjectsSection;

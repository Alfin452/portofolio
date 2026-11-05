import React, { useState, useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import * as LucideIcons from 'lucide-react';
import { Check, Copy } from 'lucide-react';
import './style.css';

const SkillsSection = () => {
  const { backend, frontend, tools } = portfolioData.skills;
  const codeShowcases = portfolioData.codeShowcases || [];

  const [activeStackFilter, setActiveStackFilter] = useState('all');
  const [activeCodeTab, setActiveCodeTab] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  const currentShowcase = codeShowcases[activeCodeTab] || codeShowcases[0] || {
    title: '',
    fileName: '',
    language: '',
    code: ''
  };

  // Handlers for Magnetic Hover (GSAP only, no CSS transform conflict)
  const handleMagneticMove = (e) => {
    if (!window.gsap) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    window.gsap.to(card, {
      x: x * 0.08,
      y: y * 0.08,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  };

  const handleMagneticLeave = (e) => {
    if (!window.gsap) return;
    const card = e.currentTarget;
    window.gsap.to(card, {
      x: 0,
      y: 0,
      duration: 0.65,
      ease: 'elastic.out(1, 0.35)',
      overwrite: 'auto'
    });
  };

  // Handler for Glitch Text with interval cleanup guard
  const handleGlitch = (e, targetLevel) => {
    const el = e.currentTarget.querySelector('.skill-level-text');
    if (!el) return;

    if (el.dataset.glitchInterval) {
      clearInterval(Number(el.dataset.glitchInterval));
    }

    let iterations = 0;
    const maxIterations = 8;
    const intervalId = setInterval(() => {
      el.innerText = Math.floor(Math.random() * 100) + '%';
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(intervalId);
        delete el.dataset.glitchInterval;
        el.innerText = targetLevel + '%';
      }
    }, 35);

    el.dataset.glitchInterval = String(intervalId);
  };

  const handleCopyCode = () => {
    if (!currentShowcase?.code) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(currentShowcase.code);
    }
    setCopiedCode(true);
    setTimeout(() => {
      setCopiedCode(false);
    }, 2000);
  };

  // Initial section & marquee ScrollTrigger setup
  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const ctx = gsap.context(() => {
      // Horizontal Background Marquee text
      gsap.to('.skills-bg-text-inner', {
        x: '-100vw',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Reveal title block
      gsap.from(titleRef.current, {
        x: -40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%'
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Per-group ScrollTrigger & filter change animation
  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const ctx = gsap.context(() => {
      const groups = gsap.utils.toArray('.skills-group');

      groups.forEach((group) => {
        const cards = group.querySelectorAll('.skill-brutalist-card');
        const bars = group.querySelectorAll('.brutalist-progress-fill');

        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              stagger: 0.07,
              ease: 'power2.out',
              clearProps: 'transform',
              scrollTrigger: {
                trigger: group,
                start: 'top 85%'
              }
            }
          );
        }

        if (bars.length > 0) {
          gsap.fromTo(
            bars,
            { width: '0%' },
            {
              width: (index, target) => `${target.dataset.level}%`,
              duration: 1.25,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: group,
                start: 'top 85%'
              }
            }
          );
        }
      });

      ScrollTrigger.refresh();
    }, gridRef);

    return () => ctx.revert();
  }, [activeStackFilter]);

  const renderSkillCards = (skillsArray) => {
    return skillsArray.map((skill, idx) => {
      const IconComponent = LucideIcons[skill.icon] || LucideIcons.Code2;
      return (
        <div
          key={skill.name}
          className="skill-brutalist-card"
          onMouseMove={handleMagneticMove}
          onMouseLeave={handleMagneticLeave}
          onMouseEnter={(e) => handleGlitch(e, skill.level)}
        >
          <div className="skill-card-header">
            <div className="skill-icon-wrapper">
              <IconComponent size={22} strokeWidth={2} />
            </div>
            <div className="skill-title-wrapper">
              <h4 className="skill-name">{skill.name}</h4>
              <p className="skill-experience">{skill.experience}</p>
            </div>
            <span className="skill-index-badge">
              {String(idx + 1).padStart(2, '0')}
            </span>
          </div>

          {skill.usedIn && (
            <div className="skill-card-context">
              <span className="skill-context-pill">
                {skill.usedIn}
              </span>
            </div>
          )}

          <div className="skill-card-footer">
            <div className="brutalist-progress-track">
              <div
                className="brutalist-progress-fill"
                data-level={skill.level}
                style={{ width: `${skill.level}%` }}
              />
            </div>
            <span className="skill-level-text">{skill.level}%</span>
          </div>
        </div>
      );
    });
  };

  const repeatedTools = [...tools, ...tools, ...tools];

  return (
    <section className="skills-section" id="skills" ref={sectionRef}>
      {/* Giant Background Marquee */}
      <div className="skills-bg-marquee">
        <div className="skills-bg-text-inner">
          {`SKILLS  •  SKILLS  •  SKILLS  •  SKILLS`}
        </div>
      </div>

      <div className="container skills-container">
        <div className="skills-header" ref={titleRef}>
          <div className="skills-header-top">
            <div className="skills-title-block">
              <span className="skills-eyebrow-pill">
                12 CORE MODULES • PRODUCTION PROVEN
              </span>
              <h2 className="section-tag-slash">/SKILLS &amp; TOOLS</h2>
            </div>

            <div className="skills-filter-bar" role="tablist" aria-label="Filter Stack Kategori">
              <button
                type="button"
                role="tab"
                aria-selected={activeStackFilter === 'all'}
                className={`skills-filter-btn ${activeStackFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveStackFilter('all')}
              >
                All Stack (12)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeStackFilter === 'backend'}
                className={`skills-filter-btn ${activeStackFilter === 'backend' ? 'active' : ''}`}
                onClick={() => setActiveStackFilter('backend')}
              >
                Backend &amp; Arch (6)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeStackFilter === 'frontend'}
                className={`skills-filter-btn ${activeStackFilter === 'frontend' ? 'active' : ''}`}
                onClick={() => setActiveStackFilter('frontend')}
              >
                Frontend &amp; UI (6)
              </button>
            </div>
          </div>
        </div>

        <div className="skills-brutalist-grid" ref={gridRef}>
          {/* 01: Backend & Architecture */}
          {(activeStackFilter === 'all' || activeStackFilter === 'backend') && (
            <div className="skills-group">
              <div className="group-header-row">
                <div className="group-title-left">
                  <span className="group-index-tag">01</span>
                  <h3 className="group-title">BACKEND &amp; ARCHITECTURE</h3>
                </div>
                <span className="group-count-pill">06 MODULES</span>
              </div>
              <div className="cards-wrapper">
                {renderSkillCards(backend)}
              </div>
            </div>
          )}

          {/* 02: Frontend & UI/UX */}
          {(activeStackFilter === 'all' || activeStackFilter === 'frontend') && (
            <div className="skills-group">
              <div className="group-header-row">
                <div className="group-title-left">
                  <span className="group-index-tag">02</span>
                  <h3 className="group-title">FRONTEND &amp; UI/UX</h3>
                </div>
                <span className="group-count-pill">06 MODULES</span>
              </div>
              <div className="cards-wrapper">
                {renderSkillCards(frontend)}
              </div>
            </div>
          )}

          {/* 03: Live Architecture Blueprint */}
          {codeShowcases.length > 0 && (
            <div className="skills-group code-blueprint-group">
              <div className="group-header-row">
                <div className="group-title-left">
                  <span className="group-index-tag">03</span>
                  <h3 className="group-title">LIVE ARCHITECTURE BLUEPRINT</h3>
                </div>
                <span className="group-count-pill">END-TO-END REALTIME PIPELINE</span>
              </div>

              <div className="skills-code-blueprint">
                <div className="blueprint-topbar">
                  <div className="blueprint-tabs">
                    {codeShowcases.map((item, idx) => (
                      <button
                        key={item.id || idx}
                        type="button"
                        className={`blueprint-tab-btn ${idx === activeCodeTab ? 'active' : ''}`}
                        onClick={() => setActiveCodeTab(idx)}
                      >
                        <span className="blueprint-tab-idx">0{idx + 1}</span>
                        <span>{item.fileName}</span>
                        <span className="blueprint-tab-lang">{item.language}</span>
                      </button>
                    ))}
                  </div>

                  <div className="blueprint-actions">
                    <span className="blueprint-pipeline-tag">{currentShowcase.title}</span>
                    <button
                      type="button"
                      className="blueprint-copy-btn"
                      onClick={handleCopyCode}
                    >
                      {copiedCode ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2.2} />}
                      <span>{copiedCode ? 'COPIED' : 'COPY CODE'}</span>
                    </button>
                  </div>
                </div>

                <div className="blueprint-code-stage">
                  <pre className="blueprint-pre">
                    <code>{currentShowcase.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 04: Tools & Ecosystem */}
          <div className="skills-group tools-group">
            <div className="group-header-row">
              <div className="group-title-left">
                <span className="group-index-tag">04</span>
                <h3 className="group-title">TOOLS &amp; ECOSYSTEM</h3>
              </div>
              <span className="group-count-pill">DAILY WORKFLOW</span>
            </div>

            <div className="tools-marquee-container">
              <div className="tools-marquee-track">
                {repeatedTools.map((tool, idx) => (
                  <div key={`track-a-${idx}`} className="tool-logo-wrapper" title={tool.name}>
                    <div className="tool-img-box">
                      <img src={tool.logo} alt={tool.name} className="tool-logo-img" />
                    </div>
                    <div className="tool-meta-info">
                      <span className="tool-name-label">{tool.name}</span>
                      {tool.role && <span className="tool-role-label">{tool.role}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="tools-marquee-track" aria-hidden="true">
                {repeatedTools.map((tool, idx) => (
                  <div key={`track-b-${idx}`} className="tool-logo-wrapper" title={tool.name}>
                    <div className="tool-img-box">
                      <img src={tool.logo} alt={tool.name} className="tool-logo-img" />
                    </div>
                    <div className="tool-meta-info">
                      <span className="tool-name-label">{tool.name}</span>
                      {tool.role && <span className="tool-role-label">{tool.role}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

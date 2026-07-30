import React, { useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import * as LucideIcons from 'lucide-react';
import './style.css';

const SkillsSection = () => {
  const { backend, frontend, tools } = portfolioData.skills;
  
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  // Handlers for Magnetic Hover
  const handleMagneticMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    window.gsap.to(card, {
      x: x * 0.1,
      y: y * 0.1,
      duration: 0.4,
      ease: 'power3.out'
    });
  };

  const handleMagneticLeave = (e) => {
    const card = e.currentTarget;
    window.gsap.to(card, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  // Handler for Glitch Text
  const handleGlitch = (e, targetLevel) => {
    const el = e.currentTarget.querySelector('.skill-level-text');
    if (!el) return;
    
    let iterations = 0;
    const maxIterations = 8;
    const interval = setInterval(() => {
      el.innerText = Math.floor(Math.random() * 100) + '%';
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        el.innerText = targetLevel + '%';
      }
    }, 40);
  };

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    let ctx = gsap.context(() => {
      // Horizontal Marquee text
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

      // Reveal title
      gsap.from(titleRef.current, {
        x: -40,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        }
      });

      // Stagger cards
      gsap.from('.skill-brutalist-card, .tool-badge', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
        }
      });
      
      // Animate progress bars
      gsap.fromTo('.brutalist-progress-fill', 
        { width: '0%' },
        {
          width: (index, target) => target.dataset.level + '%',
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderSkillCards = (skillsArray) => {
    return skillsArray.map((skill, idx) => {
      const IconComponent = LucideIcons[skill.icon];
      return (
        <div 
          key={idx} 
          className="skill-brutalist-card"
          onMouseMove={handleMagneticMove}
          onMouseLeave={handleMagneticLeave}
          onMouseEnter={(e) => handleGlitch(e, skill.level)}
        >
          <div className="skill-card-header">
            <div className="skill-icon-wrapper">
              {IconComponent && <IconComponent size={24} strokeWidth={2} />}
            </div>
            <div className="skill-title-wrapper">
              <h4 className="skill-name">{skill.name}</h4>
              <p className="skill-experience">{skill.experience}</p>
            </div>
          </div>
          <div className="skill-card-footer">
            <div className="brutalist-progress-track">
              <div 
                className="brutalist-progress-fill" 
                data-level={skill.level}
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
            <span className="skill-level-text">{skill.level}%</span>
          </div>
        </div>
      );
    });
  };

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
          <h2 className="section-tag-slash">/SKILLS & TOOLS</h2>
        </div>

        <div className="skills-brutalist-grid" ref={gridRef}>
          {/* Backend */}
          <div className="skills-group">
            <h3 className="group-title">BACKEND & ARCHITECTURE</h3>
            <div className="cards-wrapper">
              {renderSkillCards(backend)}
            </div>
          </div>

          {/* Frontend */}
          <div className="skills-group">
            <h3 className="group-title">FRONTEND & UI/UX</h3>
            <div className="cards-wrapper">
              {renderSkillCards(frontend)}
            </div>
          </div>

          {/* Tools */}
          <div className="skills-group tools-group">
            <h3 className="group-title">TOOLS & ECOSYSTEM</h3>
            <div className="tools-marquee-container">
              <div className="tools-marquee-track">
                {[...tools, ...tools].map((tool, idx) => (
                  <div key={idx} className="tool-badge">
                    {tool}
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

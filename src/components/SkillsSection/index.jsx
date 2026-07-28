import React, { useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import './style.css';

const SkillsSection = () => {
  const { backend, frontend, tools } = portfolioData.skills;
  
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    let ctx = gsap.context(() => {
      // Parallax text
      gsap.to('.skills-bg-text', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
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

      // Stagger items
      gsap.from('.skill-minimal-item', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="skills-section" id="skills" ref={sectionRef}>
      
      <div className="skills-bg-text-wrapper">
        <h2 className="skills-bg-text text-huge text-outline">SKILLS</h2>
      </div>

      <div className="container skills-container">
        
        <div className="skills-header" ref={titleRef}>
          <h2 className="section-tag-slash">/SKILLS & TOOLS</h2>
        </div>

        <div className="skills-minimal-grid" ref={gridRef}>
          {/* Backend */}
          <div className="skills-group">
            <h3 className="group-title">Backend & Architecture</h3>
            <div className="pills-wrapper">
              {backend.map((skill, idx) => (
                <div key={idx} className="skill-minimal-item">
                  {skill.name}
                </div>
              ))}
            </div>
          </div>

          {/* Frontend */}
          <div className="skills-group">
            <h3 className="group-title">Frontend & UI/UX</h3>
            <div className="pills-wrapper">
              {frontend.map((skill, idx) => (
                <div key={idx} className="skill-minimal-item">
                  {skill.name}
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="skills-group">
            <h3 className="group-title">Tools & Ecosystem</h3>
            <div className="pills-wrapper">
              {tools.map((tool, idx) => (
                <div key={idx} className="skill-minimal-item tool-item">
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

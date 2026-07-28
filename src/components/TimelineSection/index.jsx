import React, { useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import './style.css';

const TimelineSection = () => {
  const experiences = portfolioData.timeline;
  
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    let ctx = gsap.context(() => {
      // Background text parallax
      gsap.to('.exp-bg-text', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Reveal header
      gsap.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      });

      // Reveal rows
      gsap.from('.exp-row', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 80%',
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="experience-section" id="experience" ref={sectionRef}>
      
      {/* Background Typography */}
      <div className="exp-bg-text-wrapper">
        <h2 className="exp-bg-text text-huge text-outline-dark">EXPERIENCE</h2>
      </div>

      <div className="container exp-container">
        
        <div className="exp-header" ref={titleRef}>
          <h2 className="section-tag-slash text-light">/EXPERIENCE</h2>
          <span className="exp-subtitle">3+ years of experience</span>
        </div>

        <div className="exp-list" ref={listRef}>
          {experiences.map((exp, idx) => (
            <div key={idx} className="exp-row">
              <div className="exp-company">
                <h3>{exp.institution}</h3>
                <p className="exp-role">{exp.title}</p>
              </div>
              
              <div className="exp-hover-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>

              <div className="exp-date">
                <span>{exp.period}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;

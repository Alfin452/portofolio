import React, { useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import * as LucideIcons from 'lucide-react';
import './style.css';

const AboutSection = () => {
  const { tagline, bio } = portfolioData.personal;
  const { stats } = portfolioData;
  
  // Split bio into words for text highlight effect
  const bioWords = bio.split(' ');
  
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    let ctx = gsap.context(() => {
      // Horizontal Marquee effect for background text
      gsap.to('.about-bg-text-inner', {
        x: '-100vw',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Reveal bio text word by word (Text Highlighting)
      gsap.to('.bio-word', {
        color: 'var(--text-dark)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: true,
        }
      });

      gsap.from('.stat-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    window.gsap.to(card, {
      rotationX: rotateX,
      rotationY: rotateY,
      scale: 1.02,
      duration: 0.1,
      ease: 'power1.out',
      transformPerspective: 1000
    });
  };

  const handleTiltLeave = (e) => {
    const card = e.currentTarget;
    window.gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      {/* Giant Background Marquee */}
      <div className="about-bg-marquee">
        <div className="about-bg-text-inner">
          {`KNOW ME  •  KNOW ME  •  KNOW ME  •  KNOW ME`}
        </div>
      </div>

      <div className="container about-container">
        <div className="about-header">
          <h2 className="section-tag-slash">/ABOUT</h2>
        </div>

        <div className="about-grid">
          {/* Left Column: Bold Tagline */}
          <div className="about-left">
            <h3 className="about-tagline">{tagline}</h3>
          </div>

          {/* Right Column: Bio & Stats */}
          <div className="about-right">
            <div className="about-bio-wrapper" ref={textRef}>
              <p className="about-bio-text">
                {bioWords.map((word, index) => (
                  <span key={index} className="bio-word">{word} </span>
                ))}
              </p>
            </div>

            <div className="about-stats-grid" ref={statsRef}>
              {stats.map((stat, index) => {
                const IconComponent = LucideIcons[stat.icon];
                return (
                  <div 
                    key={index} 
                    className="stat-card"
                    onMouseMove={handleTilt}
                    onMouseLeave={handleTiltLeave}
                  >
                    <div className="stat-icon-wrapper">
                      {IconComponent && <IconComponent size={24} strokeWidth={1.5} />}
                    </div>
                    <div className="stat-info">
                      <h4 className="stat-value">{stat.value}</h4>
                      <p className="stat-label">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Infinite Marquee */}
      <div className="tech-marquee-wrapper">
        <div className="tech-marquee">
          <span>LARAVEL • REACT • VUE.JS • TAILWIND • JAVASCRIPT • MYSQL • REDIS • </span>
          <span>LARAVEL • REACT • VUE.JS • TAILWIND • JAVASCRIPT • MYSQL • REDIS • </span>
          <span>LARAVEL • REACT • VUE.JS • TAILWIND • JAVASCRIPT • MYSQL • REDIS • </span>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

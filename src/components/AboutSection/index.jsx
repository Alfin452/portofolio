import React, { useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import './style.css';

const AboutSection = () => {
  const { bio } = portfolioData.personal;
  
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    let ctx = gsap.context(() => {
      // Background text parallax
      gsap.to('.about-bg-text', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Reveal text
      gsap.from(textRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      <div className="about-bg-text-wrapper">
        <h2 className="about-bg-text text-huge text-outline">ABOUT ME</h2>
      </div>

      <div className="container about-container">
        <div className="about-header">
          <h2 className="section-tag-slash">/ABOUT</h2>
        </div>

        <div className="about-content" ref={textRef}>
          <p className="about-huge-bio">
            {bio}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

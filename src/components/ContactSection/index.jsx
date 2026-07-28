import React, { useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import './style.css';

const ContactSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    let ctx = gsap.context(() => {
      // Scale up and fade in the whole CTA block
      gsap.from('.contact-cta-wrapper > *', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      <div className="container contact-container">
        
        <div className="contact-cta-wrapper">
          <div className="contact-status">
            <div className="availability-pill">
              <span className="avail-text">Available for New Project</span>
            </div>
          </div>

          <h2 className="contact-huge-title">
            HAVE A PROJECT IN MIND?
          </h2>

          <p className="contact-desc">
            Together, we can create something clear and impactful. Let's collaborate to bring our ideas to life in a way that resonates with everyone.
          </p>

          <a href={portfolioData.socials.whatsapp} target="_blank" rel="noreferrer" className="btn-pill-dark contact-btn">
            Contact Me 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="19" x2="19" y2="5"></line>
              <polyline points="9 5 19 5 19 15"></polyline>
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;

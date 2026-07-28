import React, { useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import './style.css';

const TestimonialsSection = () => {
  const testimonials = portfolioData.testimonials;
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    let ctx = gsap.context(() => {
      // Background text parallax
      gsap.to('.testi-bg-text', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.from('.testi-minimal-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="testimonials-section" id="testimonials" ref={sectionRef}>
      
      <div className="testi-bg-text-wrapper">
        <h2 className="testi-bg-text text-huge text-outline">CLIENTS</h2>
      </div>

      <div className="container testi-container">
        <div className="testi-header">
          <h2 className="section-tag-slash">/TESTIMONIALS</h2>
        </div>

        <div className="testi-minimal-grid" ref={gridRef}>
          {testimonials.map((testi, idx) => (
            <div key={idx} className="testi-minimal-card">
              <div className="quote-icon">"</div>
              <p className="testi-content">{testi.content}</p>
              
              <div className="testi-author">
                <div className="testi-avatar-box">
                  <img src={testi.avatar} alt={testi.name} />
                </div>
                <div className="testi-author-info">
                  <h4 className="author-name">{testi.name}</h4>
                  <span className="author-role">{testi.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

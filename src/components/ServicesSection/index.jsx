import React, { useState, useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import './style.css';

const ServicesSection = () => {
  const services = portfolioData.services;
  const [activeService, setActiveService] = useState(services[0].id); // First one open by default

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    let ctx = gsap.context(() => {
      // Parallax background text
      gsap.to('.services-bg-text', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Title reveal
      gsap.from(titleRef.current, {
        x: -50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
        }
      });

      // Accordion rows stagger
      gsap.from('.dribbble-service-row', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 80%',
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleService = (id) => {
    if (activeService === id) {
      setActiveService(null);
    } else {
      setActiveService(id);
    }
  };

  return (
    <section className="services-section" id="services" ref={sectionRef}>
      
      {/* Background Typography */}
      <div className="services-bg-text-wrapper">
        <h2 className="services-bg-text text-huge text-outline">SERVICE</h2>
      </div>

      <div className="container services-container">
        
        <div className="services-header" ref={titleRef}>
          <h2 className="section-tag-slash">/SERVICE</h2>
        </div>

        <div className="dribbble-services-list" ref={listRef}>
          {services.map((service) => {
            const isActive = activeService === service.id;
            
            return (
              <div 
                key={service.id} 
                className={`dribbble-service-row ${isActive ? 'active' : ''}`}
                onClick={() => toggleService(service.id)}
              >
                {/* Header Row */}
                <div className="service-row-header">
                  <h3 className="service-row-title">{service.title}</h3>
                  <div className="service-row-icon">
                    {isActive ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="19" x2="19" y2="5"></line>
                        <polyline points="9 5 19 5 19 15"></polyline>
                      </svg>
                    )}
                  </div>
                </div>

                {/* Expandable Content */}
                <div className="service-row-content" style={{ height: isActive ? 'auto' : '0' }}>
                  <div className="service-content-inner">
                    <div className="service-desc-box">
                      <p>{service.description}</p>
                      
                      <div className="service-features-tags">
                        {service.features.map((feat, idx) => (
                          <span key={idx} className="feat-pill">{feat}</span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Visual representation placeholder for Dribbble-style image */}
                    <div className="service-visual-box">
                      <div className="visual-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

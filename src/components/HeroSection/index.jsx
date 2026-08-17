import React, { useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import './style.css';

const HeroSection = () => {
  const socials = portfolioData.socials;
  
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);
  const socialRef = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      // PRELOADER TIMELINE (Sweaty Shop Style)
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Hide navbar initially (global selection since it's outside heroRef)
      const navbarEl = document.querySelector('.dribbble-navbar');
      if (navbarEl) {
        tl.set(navbarEl, { opacity: 0, y: -50 });
      }

      const itemTargets = [
        { x: "-32vw", y: "-15vh", rotation: -35 },
        { x: "18vw", y: "-35vh", rotation: 22 },
        { x: "-20vw", y: "32vh", rotation: 45 },
        { x: "35vw", y: "20vh", rotation: -18 },
        { x: "-42vw", y: "5vh", rotation: -10 },
        { x: "40vw", y: "-10vh", rotation: 35 },
        { x: "5vw", y: "40vh", rotation: -25 },
        { x: "-10vw", y: "-42vh", rotation: 12 },
      ];

      const EXIT_DISTANCE = 3.5;
      const itemExits = itemTargets.map((target) => ({
        x: parseFloat(target.x) * EXIT_DISTANCE + "vw",
        y: parseFloat(target.y) * EXIT_DISTANCE + "vh",
        rotation: target.rotation * 2.5,
      }));

      const items = heroRef.current.querySelectorAll('.preloader-item');
      const floatingTweens = [];

      // 1. Reveal Circles
      tl.to('.preloader-revealer', {
        clipPath: "circle(100% at 50% 50%)",
        duration: 1,
        stagger: 0.25,
        ease: "power2.inOut"
      });

      // 2. Scatter Items & Float
      items.forEach((item, i) => {
        const target = itemTargets[i];
        tl.to(item, {
          x: target.x,
          y: target.y,
          scale: 1,
          rotation: target.rotation,
          duration: 1,
          ease: "power3.out",
          onStart: () => {
            floatingTweens[i] = gsap.to(item.querySelector('.preloader-img'), {
              y: gsap.utils.random(-15, -25),
              duration: gsap.utils.random(1.5, 2.5),
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: gsap.utils.random(0, 0.5)
            });
          }
        }, i === 0 ? "-=0.55" : "<0.075");
      });

      // Show logo
      tl.fromTo('.preloader-logo', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "power3.out" }, "<");
      
      tl.to({}, { duration: 0.8 }); // Wait a bit

      // Kill floating tweens
      tl.add(() => floatingTweens.forEach((tween) => tween.kill()));

      // 3. Exit Items
      items.forEach((item, i) => {
        const exit = itemExits[i];
        tl.to(item, {
          x: exit.x,
          y: exit.y,
          scale: 2.5,
          rotation: exit.rotation,
          duration: 0.75,
          ease: "power2.in"
        }, i === 0 ? ">" : "<0.075");
      });

      // 4. Exit Logo
      tl.to('.preloader-logo', { y: "-120vh", scale: 2.5, duration: 0.75, ease: "power2.in" }, "<");

      // Hide preloader overlay completely
      tl.set('.preloader-overlay', { display: 'none' });

      // ============================================
      // 5. HERO REVEAL (Existing animation)
      // ============================================
      tl.from('.hero-bg-row.left-align', {
        x: -200,
        opacity: 0,
        duration: 1.2,
        clearProps: 'all'
      }, "-=0.4")
      .from('.hero-bg-row.right-align', {
        x: 200,
        opacity: 0,
        duration: 1.2,
        clearProps: 'all'
      }, "-=0.8") 
      
      .from('.hero-cutout-img', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        clearProps: 'all'
      }, "-=0.8") 

      .from('.reveal-text', {
        y: '100%',
        duration: 1.2,
        stagger: 0.15,
        clearProps: 'all',
        onComplete: () => {
          if (heroRef.current) {
            heroRef.current.querySelectorAll('.reveal-mask').forEach(el => {
              el.style.overflow = 'visible';
            });
          }
        }
      }, "-=1.0") 

      .from('.connect-glass-box, .social-icon-btn, .scroll-indicator-wrapper', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        clearProps: 'all'
      }, "-=0.8");

      if (navbarEl) {
        tl.to(navbarEl, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          clearProps: 'all'
        }, "-=1.0");
      }

      // Smooth Parallax Effects
      if (window.innerWidth > 1024) {
        gsap.to('.bg-text-alfin', {
          y: -250,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5 // Buttery smooth lag for parallax
          }
        });
        
        gsap.to('.bg-text-huda', {
          y: 200,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5
          }
        });
      }

    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Spotlight Effect Mouse Tracking (Removed)
  useEffect(() => {
    const magneticElements = heroRef.current.querySelectorAll('.hero-cta, .social-icon-btn');
    
    const handleMagneticMove = (e) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(el, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMagneticLeave = (e) => {
      const el = e.currentTarget;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', handleMagneticMove);
      el.addEventListener('mouseleave', handleMagneticLeave);
    });

    // Magnetic Elements Logic (kept as is)
    return () => {
      magneticElements.forEach(el => {
        el.removeEventListener('mousemove', handleMagneticMove);
        el.removeEventListener('mouseleave', handleMagneticLeave);
      });
    };
  }, []);

  return (
    <section className="hero-section" id="hero" ref={heroRef} style={{'--img-x': '50%', '--img-y': '50%'}}>
      {/* ======================================= */}
      {/* PRELOADER OVERLAY (Sweaty Shop Style) */}
      {/* ======================================= */}
      <div className="preloader-overlay">
        <div className="preloader-bg"></div>
        <div className="preloader-revealer preloader-revealer-1"></div>
        <div className="preloader-revealer preloader-revealer-2"></div>
        <div className="preloader-revealer preloader-revealer-3"></div>
        <div className="preloader-revealer preloader-revealer-4"></div>

        <div className="preloader-items">
          <div className="preloader-item preloader-item-1">
            <img src="/assets/images/Laravel.png" className="preloader-img" alt="Laravel" />
          </div>
          <div className="preloader-item preloader-item-2">
            <img src="/logos/Google-Antigravity-Icon-Full-Color.png" className="preloader-img" alt="Antigravity" />
          </div>
          <div className="preloader-item preloader-item-3">
            <img src="/logos/GitHub.png" className="preloader-img" alt="GitHub" />
          </div>
          <div className="preloader-item preloader-item-4">
            <img src="/logos/React-icon.svg" className="preloader-img" alt="React" />
          </div>
          <div className="preloader-item preloader-item-5">
            <img src="/logos/Docker.png" className="preloader-img" alt="Docker" />
          </div>
          <div className="preloader-item preloader-item-6">
            <img src="/logos/Git.png" className="preloader-img" alt="Git" />
          </div>
          <div className="preloader-item preloader-item-7">
            <img src="/logos/Postman.png" className="preloader-img" alt="Postman" />
          </div>
          <div className="preloader-item preloader-item-8">
            <img src="/logos/Vite.svg" className="preloader-img" alt="Vite" />
          </div>
        </div>

        <div className="preloader-logo">
          <img src="/assets/images/FD.jpg" alt="FD Solutions" />
        </div>
      </div>

      {/* Noise Texture Overlay */}
      <div className="noise-overlay"></div>

      {/* Stacked Outline Text Background */}
      <div className="hero-bg-text-wrapper">
        <div className="hero-bg-row left-align">
          <span className="dribbble-text-outline bg-text-alfin">ALFIN</span>
        </div>
        <div className="hero-bg-row right-align">
          <span className="dribbble-text-solid bg-text-huda">HUDA</span>
        </div>
      </div>

      <div className="container hero-container">
        
        {/* Left: Info */}
        <div className="hero-content-left" ref={textRef}>
          <div className="reveal-mask">
            <h2 className="hero-title font-display reveal-text">Full Stack Developer</h2>
          </div>
          <div className="reveal-mask">
            <p className="hero-desc reveal-text">
              Mengubah ide menjadi aplikasi web fungsional menggunakan Laravel.
            </p>
          </div>
          <div className="reveal-mask" style={{ marginTop: '0.5rem' }}>
            <a href="#contact" className="btn-pill-dark hero-cta reveal-text">
              Let's collaborate
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="19" x2="19" y2="5"></line>
                <polyline points="9 5 19 5 19 15"></polyline>
              </svg>
            </a>
          </div>
        </div>

        {/* Right: Connect Box (Horizontal instead of vertical) */}
        <div className="hero-content-right" ref={socialRef}>
          <div className="connect-glass-box">
            <span className="connect-label">Connect</span>
            <div className="social-inline-row">
              <a href={socials.github} target="_blank" rel="noreferrer" className="social-icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              <a href={socials.instagram} target="_blank" rel="noreferrer" className="social-icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href={socials.discord} target="_blank" rel="noreferrer" className="social-icon-btn">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
              </a>
              <a href={socials.whatsapp} target="_blank" rel="noreferrer" className="social-icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* New Vertical Scroll Indicator (Bottom Left) */}
      <div className="scroll-indicator-wrapper">
        <span className="scroll-indicator-text">SCROLL</span>
        <div className="scroll-indicator-line">
          <div className="scroll-indicator-dot"></div>
        </div>
      </div>

      {/* Center Image (Exact Cutout) */}
      <div className="hero-image-wrapper">
        <img 
          src="/assets/images/profilebgremove.png" 
          alt="Muhammad Alfin Nur Huda" 
          className="hero-cutout-img" 
          ref={imgRef} 
        />
      </div>

    </section>
  );
};

export default HeroSection;

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar/index.jsx';
import HeroSection from './components/HeroSection/index.jsx';
import AboutSection from './components/AboutSection/index.jsx';
import SkillsSection from './components/SkillsSection/index.jsx';
import ProjectsSection from './components/ProjectsSection/index.jsx';
import ServicesSection from './components/ServicesSection/index.jsx';
import TimelineSection from './components/TimelineSection/index.jsx'; // Now acts as Experience
import TestimonialsSection from './components/TestimonialsSection/index.jsx';
import ContactSection from './components/ContactSection/index.jsx';
import Footer from './components/Footer/index.jsx';
import './App.css';

function App() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    let rafId = null;
    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(updateLenis);
      window.gsap.ticker.lagSmoothing(0);
    } else if (window.gsap) {
      window.gsap.ticker.add(updateLenis);
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        lenis.scrollTo(targetEl, { offset: -20 });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      if (window.gsap) {
        window.gsap.ticker.remove(updateLenis);
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      lenis.destroy();
      if (window.__lenis === lenis) {
        delete window.__lenis;
      }
    };
  }, []);

  return (
    <div className="app-wrapper bg-section-white text-slate-800 min-h-screen font-sans selection:bg-teal-500 selection:text-white transition-colors duration-300">
      <Navbar />
      
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ServicesSection />
        <TimelineSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { portfolioData } from '../../data/portfolioData';
import './style.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const workCount = portfolioData.projects.length;
  const serviceCount = portfolioData.services.length;
  const expCount = portfolioData.timeline.length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`dribbble-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          
          {/* Left: Availability Pill */}
          <div className="nav-left">
            <div className="availability-pill">
              <span className="avail-text">Available <span className="hide-mobile">for New Project</span></span>
            </div>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="nav-center">
            <a href="#projects" className="nav-link">
              Work <span className="sup-count">[{workCount}]</span>
            </a>
            <a href="#services" className="nav-link">
              Service <span className="sup-count">[{serviceCount}]</span>
            </a>
            <a href="#experience" className="nav-link">
              Experience <span className="sup-count">[{expCount}y+]</span>
            </a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>

          {/* Right: CTA & Mobile Toggle */}
          <div className="nav-right">
            <a href="#contact" className="btn-pill-dark btn-nav-cta">
              Let's Talk
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="19" x2="19" y2="5"></line>
                <polyline points="9 5 19 5 19 15"></polyline>
              </svg>
            </a>

            <button 
              className="mobile-toggle" 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#projects" onClick={closeMenu}>Work <span>[{workCount}]</span></a>
          <a href="#services" onClick={closeMenu}>Service <span>[{serviceCount}]</span></a>
          <a href="#experience" onClick={closeMenu}>Experience <span>[{expCount}y+]</span></a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
      </div>
    </>
  );
};

export default Navbar;

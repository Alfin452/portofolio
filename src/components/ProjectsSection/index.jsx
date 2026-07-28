import React, { useState, useMemo, useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import ProjectModal from '../ProjectModal/index.jsx';
import './style.css';

const ProjectsSection = () => {
  const projects = portfolioData.projects;
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  // Extract unique categories for minimal tabs
  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.categorySlug));
    return ['all', ...Array.from(cats)].slice(0, 4); // Keep it minimal (4 tabs max)
  }, [projects]);

  const categoryNames = {
    'all': 'All',
    'realtime': 'Real Project',
    'school': 'System',
    'business': 'Business',
    'education': 'Exploration',
    'public': 'Public'
  };

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects.slice(0, 4); // Only show top 4 for minimal look
    return projects.filter(p => p.categorySlug === activeCategory).slice(0, 4);
  }, [activeCategory, projects]);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    let ctx = gsap.context(() => {
      // Background text parallax
      gsap.to('.projects-bg-text', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Section title reveal
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        }
      });
      
      // Grid items reveal
      gsap.from('.dribbble-project-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="projects-section" id="projects" ref={sectionRef}>
      
      {/* Background Typography */}
      <div className="projects-bg-text-wrapper">
        <h2 className="projects-bg-text text-huge text-outline">PORTOFOLIO</h2>
      </div>

      <div className="container projects-container">
        {/* Section Header */}
        <div className="projects-header" ref={titleRef}>
          <h2 className="section-tag-slash">/SELECTED WORK</h2>
          
          <div className="projects-nav-row">
            <div className="filter-minimal-tabs">
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`filter-minimal-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {categoryNames[cat] || cat}
                </button>
              ))}
            </div>
            
            <a href="#all" className="btn-pill-light">
              View All Work 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="19" x2="19" y2="5"></line>
                <polyline points="9 5 19 5 19 15"></polyline>
              </svg>
            </a>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="dribbble-projects-grid" ref={gridRef}>
          {filteredProjects.map(project => (
            <div 
              key={project.id}
              className="dribbble-project-card"
              onClick={() => setSelectedProject(project)}
            >
              <div className="dribbble-card-image">
                <img src={project.image} alt={project.title} />
                <div className="card-hover-overlay">
                  <div className="hover-circle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="19" x2="19" y2="5"></line>
                      <polyline points="9 5 19 5 19 15"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="dribbble-card-info">
                <h3 className="dribbble-card-title">{project.title}</h3>
                <div className="dribbble-card-meta">
                  <span className="meta-pill">{project.category}</span>
                  <span className="meta-pill">UI/UX</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
};

export default ProjectsSection;

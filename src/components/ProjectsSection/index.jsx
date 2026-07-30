import React, { useState, useMemo, useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import ProjectModal from '../ProjectModal/index.jsx';
import './style.css';

const ProjectsSection = () => {
  const projects = portfolioData.projects;
  const featuredProject = portfolioData.featuredProject;
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const featuredRef = useRef(null);
  const gridRef = useRef(null);

  // Extract unique categories for minimal tabs
  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.categorySlug));
    return ['all', ...Array.from(cats)].slice(0, 4); // Keep it minimal (4 tabs max)
  }, [projects]);

  // Featured Project Image Carousel
  useEffect(() => {
    if (!featuredProject || !featuredProject.images) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % featuredProject.images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [featuredProject]);

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
      
      // Featured Project Reveal
      if (featuredRef.current) {
        const featTl = gsap.timeline({
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 75%'
          }
        });
        
        featTl.from('.featured-left', { x: -50, opacity: 0, duration: 1, ease: 'power3.out' })
              .from('.featured-right', { x: 50, opacity: 0, duration: 1, ease: 'power3.out' }, "-=0.8")
              .from('.featured-stat', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'back.out' }, "-=0.5");
      }

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

        {/* --- FEATURED PROJECT HIGHLIGHT --- */}
        {featuredProject && (
          <div className="featured-project-container" ref={featuredRef}>
            <div className="featured-left">
              <div className="featured-badge">FLAGSHIP PROJECT</div>
              <h3 className="featured-title">
                {featuredProject.id === 'digivote-flagship' ? (
                  <>Digi<span className="digivote-highlight">Vote</span></>
                ) : (
                  featuredProject.title
                )}
              </h3>
              <h4 className="featured-tagline">{featuredProject.tagline}</h4>
              <p className="featured-desc">{featuredProject.description}</p>
              
              <div className="featured-tech-stack">
                {featuredProject.techStack.map((tech, idx) => (
                  <span key={idx} className="tech-pill">{tech}</span>
                ))}
              </div>

              <div className="featured-stats-row">
                {featuredProject.stats.map((stat, idx) => (
                  <div key={idx} className="featured-stat">
                    <span className="stat-val">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>

              <a href={featuredProject.demoUrl} target="_blank" rel="noreferrer" className="btn-featured-visit">
                Visit DigiVote
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>

            <div className="featured-right">
              <div className="featured-image-wrapper">
                {featuredProject.images ? (
                  featuredProject.images.map((imgSrc, idx) => (
                    <img 
                      key={idx}
                      src={imgSrc} 
                      alt={`${featuredProject.title} screenshot ${idx + 1}`}
                      className={`carousel-image ${idx === currentImageIndex ? 'active' : ''}`}
                    />
                  ))
                ) : (
                  <img src={featuredProject.image} alt={featuredProject.title} />
                )}
              </div>
            </div>
          </div>
        )}

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

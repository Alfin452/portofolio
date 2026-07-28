import React from 'react';
import './style.css';

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Modal Header Image */}
        <div className="modal-image-box">
          <img src={project.image} alt={project.title} className="modal-img" />
          <div className="modal-image-overlay"></div>
          <span className="badge badge-primary modal-cat-badge">{project.category}</span>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <h2 className="modal-title">{project.title}</h2>
          <p className="modal-description">{project.longDescription}</p>

          {/* Key Metrics Grid */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="metrics-grid">
              {project.metrics.map((metric, idx) => (
                <div key={idx} className="metric-card">
                  <span className="metric-val gradient-text-emerald">{metric.value}</span>
                  <span className="metric-lbl">{metric.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Feature Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="highlights-box">
              <h4 className="box-title">Fitur & Keunggulan Utama:</h4>
              <ul className="highlights-list">
                {project.highlights.map((hl, hIdx) => (
                  <li key={hIdx}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Tags */}
          <div className="tech-tags-box">
            <h4 className="box-title">Teknologi Yang Digunakan:</h4>
            <div className="tags-flex">
              {project.tags.map((tag, tIdx) => (
                <span key={tIdx} className="tech-tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-actions">
            {project.demoUrl && project.demoUrl !== '#' && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>Kunjungi Live Demo</span>
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <span>Repository GitHub</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;


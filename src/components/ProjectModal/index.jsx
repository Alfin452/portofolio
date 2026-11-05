import React, { useState, useEffect } from 'react';
import './style.css';

const DiagonalArrowSvg = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const CloseIconSvg = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowLeftSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ArrowRightSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ProjectModal = ({ project, onClose }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setActiveSlide(0);
  }, [project?.id]);

  const galleryImages =
    Array.isArray(project?.images) && project.images.length > 0
      ? project.images
      : [
          {
            src: project?.image,
            caption: project?.displayTitle || project?.title,
            shortLabel: 'Overview',
          },
        ];

  const isMultiImage = galleryImages.length > 1;
  const metricsList = project?.stats || project?.metrics || [];
  const featuresList = project?.features || project?.highlights || [];
  const techList = project?.techStack || project?.tags || [];
  const liveUrl =
    project?.demoUrl && project.demoUrl !== '#'
      ? project.demoUrl
      : project?.browserUrl || null;
  const rawGithubUrl = project?.github ?? project?.githubUrl ?? null;
  const validGithubUrl =
    typeof rawGithubUrl === 'string' &&
    rawGithubUrl.trim() !== '' &&
    rawGithubUrl.trim() !== '#'
      ? rawGithubUrl.trim()
      : null;
  const domainLabel = project?.browserUrl
    ? project.browserUrl.replace(/^https?:\/\//, '')
    : 'Live Preview';
  const badgeText = project?.badgeLabel || project?.badge || 'REAL PROJECT';

  useEffect(() => {
    if (!project) return;

    window.__lenis?.stop();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'ArrowRight' && isMultiImage) {
        setActiveSlide((prev) => (prev + 1) % galleryImages.length);
      } else if (e.key === 'ArrowLeft' && isMultiImage) {
        setActiveSlide(
          (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.__lenis?.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, isMultiImage, galleryImages.length]);

  if (!project) return null;

  const currentImage = galleryImages[activeSlide] || galleryImages[0];

  const handlePrevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % galleryImages.length);
  };

  return (
    <div className="case-modal-overlay" data-lenis-prevent onClick={onClose}>
      <div
        className="case-modal-sheet"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={project.displayTitle || project.title}
      >
        {/* Topbar */}
        <div className="case-modal-topbar">
          <div className="case-topbar-left">
            <span className="case-badge-pill">{badgeText}</span>
            <span className="case-category-label">{project.category}</span>
          </div>
          <div className="case-topbar-right">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="case-domain-pill"
              >
                <span>{domainLabel}</span>
                <DiagonalArrowSvg size={13} />
              </a>
            )}
            <button
              type="button"
              className="case-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <CloseIconSvg />
            </button>
          </div>
        </div>

        {/* Scrollable Area */}
        <div className="case-modal-scroll" data-lenis-prevent>
          {/* Media Stage */}
          <div
            className={`case-media-stage ${
              isMultiImage ? 'multi-mode' : 'single-mode'
            }`}
          >
            <div className="case-stage-viewport">
              <img
                key={currentImage.src}
                src={currentImage.src}
                alt={currentImage.caption || project.title}
                className="case-stage-img"
              />
              <div className="case-viewport-bar">
                <div className="case-viewport-caption">
                  <span className="case-slide-counter">
                    0{activeSlide + 1} / 0{galleryImages.length}
                  </span>
                  <span className="case-slide-caption-text">
                    {currentImage.caption || project.title}
                  </span>
                </div>
                {isMultiImage && (
                  <div className="case-viewport-nav">
                    <button
                      type="button"
                      className="case-nav-arrow"
                      onClick={handlePrevSlide}
                      aria-label="Previous screen"
                    >
                      <ArrowLeftSvg />
                    </button>
                    <button
                      type="button"
                      className="case-nav-arrow"
                      onClick={handleNextSlide}
                      aria-label="Next screen"
                    >
                      <ArrowRightSvg />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isMultiImage && (
              <div className="case-stage-thumbs">
                {galleryImages.map((imgObj, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`case-thumb-btn ${
                      idx === activeSlide ? 'active' : ''
                    }`}
                    onClick={() => setActiveSlide(idx)}
                  >
                    <img
                      src={imgObj.src}
                      alt={imgObj.caption || `Screen ${idx + 1}`}
                      className="case-thumb-img"
                    />
                    <div className="case-thumb-meta">
                      <span className="case-thumb-idx">0{idx + 1}</span>
                      <span className="case-thumb-label">
                        {imgObj.shortLabel || `Screen ${idx + 1}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Editorial Dossier Body */}
          <div className="case-dossier-body">
            <div className="case-dossier-header">
              <h2 className="case-project-title">
                {project.displayTitle || project.title}
              </h2>
              {project.tagline && (
                <p className="case-project-tagline">{project.tagline}</p>
              )}
            </div>

            <div className="case-dossier-grid">
              <div className="case-col-main">
                <div className="case-section-block">
                  <h3 className="case-slash-heading">/OVERVIEW</h3>
                  <p className="case-overview-text">
                    {project.longDescription || project.description}
                  </p>
                </div>

                {featuresList.length > 0 && (
                  <div className="case-section-block">
                    <h3 className="case-slash-heading">
                      /ARCHITECTURE &amp; HIGHLIGHTS
                    </h3>
                    <div className="case-highlights-list">
                      {featuresList.map((feat, idx) => (
                        <div
                          key={idx}
                          className={`case-highlight-item ${
                            isMultiImage && idx === activeSlide ? 'active' : ''
                          } ${isMultiImage ? 'interactive' : ''}`}
                          onClick={() => {
                            if (isMultiImage && idx < galleryImages.length) {
                              setActiveSlide(idx);
                            }
                          }}
                        >
                          <span className="case-highlight-idx">
                            0{idx + 1}
                          </span>
                          <span className="case-highlight-text">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="case-col-side">
                {metricsList.length > 0 && (
                  <div className="case-section-block">
                    <h3 className="case-slash-heading">/KEY METRICS</h3>
                    <div className="case-metrics-grid">
                      {metricsList.map((m, idx) => (
                        <div key={idx} className="case-metric-box">
                          <span className="case-metric-val">{m.value}</span>
                          <span className="case-metric-lbl">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="case-section-block">
                  <h3 className="case-slash-heading">/TECH STACK</h3>
                  <div className="case-tech-pills">
                    {techList.map((tag, idx) => (
                      <span key={idx} className="case-tech-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="case-modal-footer">
          <div className="case-footer-meta">
            <span className="case-footer-status-label">DEPLOYMENT STATUS</span>
            <span className="case-footer-status-val">
              {project.status || 'Production Ready'}
            </span>
          </div>
          <div className="case-footer-actions">
            {validGithubUrl && (
              <a
                href={validGithubUrl}
                target="_blank"
                rel="noreferrer"
                className="case-btn-secondary"
              >
                <span>GitHub Repository</span>
                <DiagonalArrowSvg size={15} />
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="case-btn-primary"
              >
                <span>Visit Live Platform</span>
                <DiagonalArrowSvg size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

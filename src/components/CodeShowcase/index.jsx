import React, { useState } from 'react';
import { portfolioData } from '../../data/portfolioData';
import './style.css';

const CodeShowcase = () => {
  const codeShowcases = portfolioData.codeShowcases;
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentSnippet = codeShowcases[activeIndex];

  const copyCurrentCode = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className="code-section" id="code">
      <div className="container">
        <div className="section-header">
          <span className="section-tag flex-tag">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
            <span>CODE ARCHITECTURE</span>
          </span>
          <h2 className="section-title">Contoh Kualitas Kode & Stabilitas Backend</h2>
          <p className="section-description">
            Lihat langsung bagaimana saya mengorganisasi event real-time Laravel dan komponen React secara efisien.
          </p>
        </div>

        <div className="code-window">
          {/* Window Bar */}
          <div className="window-header">
            <div className="window-dots">
              <span className="dot dot-cyprus"></span>
              <span className="dot dot-sand"></span>
              <span className="dot dot-light"></span>
            </div>

            {/* Code Tabs */}
            <div className="window-tabs">
              {codeShowcases.map((snippet, idx) => (
                <button 
                  key={snippet.id}
                  className={`tab-btn ${activeIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <span>{snippet.fileName}</span>
                </button>
              ))}
            </div>

            {/* Copy Button */}
            <button className="copy-btn" onClick={copyCurrentCode}>
              {!copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F0EDE4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
              <span>{copied ? 'Tersalin!' : 'Copy'}</span>
            </button>
          </div>

          {/* Code Content */}
          <div className="code-body">
            <div className="code-title-bar">
              <span className="snippet-title font-display">{currentSnippet.title}</span>
              <span className="badge badge-sand">{currentSnippet.language.toUpperCase()}</span>
            </div>

            <pre className="code-pre">
              <code>{currentSnippet.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeShowcase;


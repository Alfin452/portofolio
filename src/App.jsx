import React from 'react';
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

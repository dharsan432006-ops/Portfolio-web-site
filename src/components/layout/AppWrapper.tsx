import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion } from 'motion/react';
import { GitHubWidget } from '../ui/GitHubWidget';
import { ResumeFloating } from '../ui/ResumeFloating';
import { ThemeToggleFloating } from '../ui/ThemeToggleFloating';
import { AdminPanel } from '../admin/AdminPanel';

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. Analytics Injection (Mock)
    console.log('⚡ Initializing Google Analytics...');
    
    // 2. Scroll Progress Logic
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    // 3. Accessibility Enhancements: Keyboard Focus Navigation
    const handleFirstTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleFirstTab);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleFirstTab);
    };
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Sudharsan S | Professional Software Engineer Portfolio</title>
        <meta name="description" content="Explore the portfolio of Sudharsan S, an Aspiring Software Engineer specializing in AI, real-time systems, and high-performance web applications." />
        <meta name="keywords" content="Software Engineer, React, AI, TypeScript, Portfolio, Sudharsan" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sudharsan S | Software Engineer" />
        <meta property="og:description" content="Building exceptional digital experiences through code and AI." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&h=630&auto=format&fit=crop" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Sudharsan S | Software Engineer" />
        <meta property="twitter:description" content="Building exceptional digital experiences through code and AI." />
      </Helmet>

      {/* Global Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-[3000] pointer-events-none">
        <motion.div 
          className="h-full bg-accent shadow-[0_0_10px_var(--color-accent)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <main className="relative min-h-screen">
        {children}
        
        {/* Professional Overlays */}
        <GitHubWidget />
        <ResumeFloating />
        <ThemeToggleFloating />
        <AdminPanel />
      </main>
    </HelmetProvider>
  );
};

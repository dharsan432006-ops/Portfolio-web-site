import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, Cpu } from 'lucide-react';

export const ThemeToggleFloating = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('theme') as any || 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <button 
      onClick={toggleTheme}
      className="fixed bottom-24 right-8 z-[200] p-4 bg-white dark:bg-white/10 text-gray-900 dark:text-white rounded-full shadow-2xl border border-gray-100 dark:border-white/10 hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <motion.div
          animate={{ y: theme === 'light' ? 0 : 40, opacity: theme === 'light' ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <PenTool size={20} className="text-accent" />
        </motion.div>
        <motion.div
          animate={{ y: theme === 'dark' ? 0 : -40, opacity: theme === 'dark' ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Cpu size={20} className="text-accent" />
        </motion.div>
      </div>
      
      <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

import React from 'react';
import { FileText, Download } from 'lucide-react';

export const ResumeFloating = () => {
  const handleDownload = () => {
    window.open('/resume.pdf', '_blank');
  };

  return (
    <button 
      onClick={handleDownload}
      className="fixed bottom-40 right-8 z-[200] p-4 bg-accent text-white rounded-full shadow-2xl shadow-accent/40 hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      aria-label="Download Resume"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <FileText size={20} className="group-hover:opacity-0 transition-opacity" />
        <Download size={20} className="absolute opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
        Resume
      </div>
    </button>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code, 
  BookOpen, 
  Briefcase, 
  Award, 
  ChevronRight,
  Terminal,
  Cpu,
  Layers,
  Send,
  Menu,
  X,
  ChevronUp,
  Twitter,
  PenTool,
  ChevronLeft,
  Maximize2
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { PROJECTS as STATIC_PROJECTS, SKILLS, EXPERIENCE, EDUCATION, ACHIEVEMENTS, TESTIMONIALS } from './constants';
import { 
  subscribeToProjects, 
  subscribeToCollection,
  subscribeToConfig
} from './lib/firebase.ts';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-white/10 rounded-xl ${className}`} />
);

const ScrollProgress = () => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setWidth(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[2000] bg-transparent">
      <motion.div 
        className="h-full bg-accent"
        style={{ width: `${width}%` }}
        layoutId="progress-bar"
      />
    </div>
  );
};

const Navbar = ({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl px-4 py-2 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-gray-100 dark:border-white/10 shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-6 ml-4">
        {['Home', 'About', 'Projects', 'Contact'].map(item => (
          <a 
            key={item}
            href={`#${item.toLowerCase()}`} 
            className="hidden md:block text-[13px] font-bold text-gray-800 dark:text-gray-200 hover:text-accent transition-colors"
          >
            {item}
          </a>
        ))}
        <button className="md:hidden text-gray-800 dark:text-gray-200" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <PenTool size={18} /> : <Cpu size={18} />}
        </button>
        <button 
          onClick={() => window.open('/resume.pdf', '_blank')}
          className="btn-primary !px-5 !py-2.5 !text-[11px] !gap-2"
        >
          Resume <ExternalLink size={14} />
        </button>
      </div>
    </nav>
  );
};

const Hero = ({ profile }: { profile: any }) => {
  const [stats, setStats] = useState({ repos: '12', followers: '45', stars: '180' });

  const displayProfile = {
    name: profile?.name || 'Sudharsan',
    role: profile?.role || 'Software Engineer',
    photo: profile?.photo || 'https://github.com/dharsan432006-ops.png',
    summary: profile?.summary || 'Building high-performance applications with precision and modern technology stack.'
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden bg-bg-light dark:bg-[#050505]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-12 text-left">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent mb-4">
            Available for hire
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-gray-900 dark:text-white leading-[1.1] mb-6">
            I'm <span className="text-accent">{displayProfile.name.split(' ')[0]}</span>, <br />
            {displayProfile.role}
          </h1>
          <p className="max-w-md text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed font-sans">
            {displayProfile.summary}
          </p>
          <div className="flex gap-4">
            <a href="#projects" className="btn-primary">
              View Work <ChevronRight size={18} />
            </a>
            <a href="#contact" className="btn-secondary">
              Contact Me
            </a>
          </div>
          
          <div className="mt-12 flex items-center gap-10">
            {[
              { label: 'Public Repos', value: stats.repos },
              { label: 'Followers', value: stats.followers },
              { label: 'Github Stars', value: stats.stars }
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}+</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex justify-center"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-accent/20 rounded-full -z-10" />
          <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[550px] rounded-[100px] border-[12px] border-white dark:border-white/10 shadow-2xl overflow-hidden bg-gray-100 dark:bg-white/5">
            <img 
              src={displayProfile.photo} 
              alt={displayProfile.name} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          <div className="absolute bottom-10 right-0 md:-right-10 p-6 glass-card !bg-white/40 dark:!bg-white/5 !border-white/50 backdrop-blur-xl shadow-xl">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">3+</div>
            <div className="text-xs uppercase tracking-widest font-bold text-gray-500">Years Experience</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const About = ({ skills }: { skills: any }) => {
  const [activeTab, setActiveTab] = useState<'languages' | 'technologies' | 'tools'>('languages');
  
  const currentSkills = skills[activeTab] || [];

  return (
    <section id="about" className="py-32 bg-white dark:bg-[#050505] relative z-10 border-b border-gray-100 dark:border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full font-bold uppercase tracking-widest inline-flex mb-6">
              Expertise
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Crafting solutions <br />
              with modern technology.
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-sans leading-relaxed text-lg mb-8">
              Computer Science student at SRM Institute, passionate about algorithms, 
              software engineering, and creating intuitive user experiences.
            </p>
            <div className="flex gap-4">
              <a href="#contact" className="btn-primary">Get in Touch</a>
            </div>
          </div>
          
          <div className="glass-card !bg-gray-50 dark:!bg-white/5 !border-gray-200 dark:!border-white/10 p-8 shadow-sm">
            <div className="space-y-6">
              <div className="flex gap-4 border-b border-gray-200 dark:border-white/10 mb-6 font-mono">
                {(['languages', 'technologies', 'tools'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === tab ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="grid gap-6">
                {currentSkills.map((skill: any, index: number) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide uppercase">
                      <span>{skill.name}</span>
                      <span className="opacity-70">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ 
                          duration: 1.5, 
                          ease: [0.34, 1.56, 0.64, 1],
                          delay: index * 0.1 
                        }}
                        className="h-full bg-accent relative"
                      >
                         <motion.div 
                          animate={{ 
                            opacity: [0.2, 0.5, 0.2],
                            x: ['-100%', '100%']
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                        />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Description = ({ text, className }: { text: string, className?: string }) => {
  return (
    <div className={className}>
      {text.split(/(```[\s\S]*?```|`[^`]+`)/).map((part: string, i: number) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3).trim();
          return (
            <div key={i} className="my-4 rounded-xl overflow-hidden border border-white/5 bg-[#0d0d0d] dark:bg-black/60 description-code-block">
              <SyntaxHighlighter 
                language="javascript" 
                style={vscDarkPlus}
                customStyle={{
                  background: 'transparent',
                  padding: '1.25rem',
                  fontSize: '0.75rem',
                  margin: 0,
                  fontFamily: '"JetBrains Mono", monospace'
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          const code = part.slice(1, -1);
          return (
            <code 
              key={i} 
              className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-accent/10 dark:bg-accent/20 text-accent font-mono text-[0.85em] font-semibold border border-accent/20"
            >
              {code}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
};

const ImageCarousel = ({ images, title, onImageClick }: { images: string[], title: string, onImageClick?: (index: number) => void }) => {
  const [index, setIndex] = useState(0);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-white/5 group/carousel">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          alt={`${title} - ${index + 1}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover opacity-80 group-hover/carousel:scale-110 transition-transform duration-700 cursor-zoom-in"
          referrerPolicy="no-referrer"
          loading="lazy"
          onClick={() => onImageClick?.(index)}
        />
      </AnimatePresence>
      
      {images.length > 1 && (
        <>
          <button 
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white/20 hover:scale-110 active:scale-95 z-10"
          >
            <ChevronLeft size={18} className="text-white" />
          </button>
          <button 
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white/20 hover:scale-110 active:scale-95 z-10"
          >
            <ChevronRight size={18} className="text-white" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-accent w-5' : 'bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProjectModal = ({ project, onClose }: { project: any, onClose: () => void }) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="glass-card w-full max-w-5xl max-h-[90vh] overflow-y-auto relative no-scrollbar"
          onClick={e => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"
          >
            <X size={20} className="text-white" />
          </button>

          <div className="grid lg:grid-cols-2 gap-8 p-8 md:p-12">
            <div className="space-y-6">
              <div className="space-y-4">
                <span className="tag !bg-accent/10 !text-accent border-none uppercase tracking-widest text-[10px] font-bold">
                  {project.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 leading-tight">
                  {project.title}
                </h2>
              </div>

              {project.videoUrl && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <iframe 
                    src={project.videoUrl.replace('watch?v=', 'embed/')} 
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <Description 
                  text={project.description} 
                  className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed" 
                />
              </div>

              {project.codeSnippet && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                    <Terminal size={14} /> Core Implementation
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#1e1e1e]">
                    <SyntaxHighlighter 
                      language={project.tech[0].toLowerCase()} 
                      style={vscDarkPlus}
                      customStyle={{
                        background: 'transparent',
                        padding: '1.5rem',
                        fontSize: '0.8rem',
                        fontFamily: '"JetBrains Mono", monospace'
                      }}
                    >
                      {project.codeSnippet}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {project.tech.map((t: string) => (
                  <span key={t} className="tag border-none !bg-white/5 !text-gray-400">{t}</span>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <a href={project.demo} className="btn-primary flex items-center gap-2">
                  <ExternalLink size={16} /> Live Project
                </a>
                <a href={project.github} className="btn-secondary flex items-center gap-2">
                  <Github size={16} /> Source Code
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] font-mono">Project Gallery</h3>
                  <span className="text-[10px] text-gray-600 font-mono italic">{project.images.length} Assets</span>
              </div>
              
              <ImageCarousel images={project.images} title={project.title} onImageClick={(idx) => setLightboxImage(project.images[idx])} />

              <div className="grid grid-cols-3 gap-4">
                {project.images.map((img: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                    onClick={() => setLightboxImage(img)}
                    className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/40 shadow-xl transition-all cursor-zoom-in group"
                  >
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>

              {project.tags && project.tags.length > 0 && (
                <div className="pt-6 border-t border-white/5">
                  <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-4">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-accent/10 text-accent rounded-lg text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightboxImage}
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
              alt="Preview"
              referrerPolicy="no-referrer"
            />
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              <X size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Projects = ({ projects: liveProjects }: { projects: any[] }) => {
  const [activeCategories, setActiveCategories] = useState<string[]>(['All']);
  const [activeTech, setActiveTech] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const projects = liveProjects.length > 0 ? liveProjects : STATIC_PROJECTS;
  
  const categories = ['All', ...Array.from(new Set(projects.map(p => (p as any).category)))];
  const allTech = Array.from(new Set(projects.flatMap(p => (p as any).tech))).sort();
  const allTags = Array.from(new Set(projects.flatMap(p => (p as any).tags || []))).sort();
  
  const filteredProjects = projects.filter(p => {
    const categoryMatch = activeCategories.includes('All') || activeCategories.includes((p as any).category);
    const techMatch = activeTech.length === 0 || activeTech.some(t => (p as any).tech.includes(t));
    const tagMatch = activeTags.length === 0 || activeTags.some(t => (p as any).tags?.includes(t));
    return categoryMatch && techMatch && tagMatch;
  });

  const toggleCategory = (cat: string) => {
    if (cat === 'All') {
      setActiveCategories(['All']);
    } else {
      setActiveCategories(prev => {
        const next = prev.filter(c => c !== 'All');
        if (next.includes(cat)) {
          const filtered = next.filter(c => c !== cat);
          return filtered.length === 0 ? ['All'] : filtered;
        }
        return [...next, cat];
      });
    }
  };

  const toggleTech = (tech: string) => {
    setActiveTech(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const toggleTags = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <section id="projects" className="py-32 bg-bg-light dark:bg-[#050505] text-center relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/2 opacity-20 blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-10">
          <span className="text-[10px] items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full font-bold uppercase tracking-widest inline-flex mb-6">
            Portfolio
          </span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            Featured <span className="text-accent italic font-serif">Work</span>
          </motion.h2>
          <p className="max-w-2xl text-gray-500 dark:text-gray-400 text-lg">
            A selection of projects reflecting my journey in technical excellence.
          </p>
        </div>
        
        {/* Advanced Filter UI - Multi Select */}
        <div className="mb-20 space-y-8 bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-xl">
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">Categories</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all border ${
                    activeCategories.includes(cat)
                    ? 'bg-accent border-accent text-white shadow-[0_10px_20px_rgba(255,82,82,0.2)]' 
                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {allTags.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">Tags</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {allTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => toggleTags(tag)}
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      activeTags.includes(tag) 
                      ? 'bg-accent/20 border-accent/40 text-accent' 
                      : 'bg-transparent border-gray-100 dark:border-white/5 text-gray-400 hover:border-accent/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">Technologies</h4>
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              {allTech.map(t => (
                <button 
                  key={t}
                  onClick={() => toggleTech(t)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    activeTech.includes(t) 
                    ? 'bg-accent/20 border-accent/40 text-accent' 
                    : 'bg-transparent border-gray-100 dark:border-white/5 text-gray-400 hover:border-accent/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {(activeTech.length > 0 || activeTags.length > 0) && (
               <button 
                onClick={() => { setActiveTech([]); setActiveTags([]); }}
                className="text-[9px] uppercase tracking-widest text-accent font-bold mt-4 hover:underline"
               >
                 Clear all filters
               </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project: any) => (
              <motion.div 
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.02,
                  boxShadow: "0 40px 80px rgba(255, 82, 82, 0.15)"
                }}
                onClick={() => setSelectedProject(project)}
                className="glass-card overflow-hidden flex flex-col items-start p-8 text-left cursor-pointer group shadow-sm transition-all duration-500"
              >
                <div className="relative w-full rounded-2xl overflow-hidden mb-8 shadow-inner">
                  <ImageCarousel images={project.images} title={project.title} />
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white">
                      <Maximize2 size={16} />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-accent font-display tracking-tight">
                    {project.title}
                  </h3>
                  <div className="text-[10px] font-mono font-bold text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                    0{projects.indexOf(project) + 1}
                  </div>
                </div>
                
                <Description 
                  text={project.description} 
                  className="text-sm text-gray-500 dark:text-gray-400 mb-8 line-clamp-3 leading-relaxed" 
                />
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((t: string) => (
                    <button 
                      key={t} 
                      onClick={(e) => { e.stopPropagation(); toggleTech(t); }}
                      className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border ${
                        activeTech.includes(t) 
                        ? 'bg-accent/20 border-accent/40 text-accent' 
                        : 'bg-white/5 dark:bg-white/5 border-transparent text-gray-500 hover:border-white/10'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                
                <div className="flex w-full gap-3 mt-auto">
                  <a 
                    href={project.demo} 
                    onClick={e => e.stopPropagation()}
                    className="flex-1 btn-primary !py-2.5 !text-[10px] !uppercase !tracking-widest"
                  >
                    Launch Demo
                  </a>
                  <a 
                    href={project.github} 
                    onClick={e => e.stopPropagation()}
                    className="p-2.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-full text-gray-500 hover:text-accent hover:border-accent transition-all"
                    title="Source Code"
                  >
                    <Github size={18} />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

const Experience = ({ experience, education }: { experience: any[], education: any[] }) => {
  const [view, setView] = useState<'timeline' | 'list'>('timeline');
  const combined = [...experience, ...education].sort((a, b) => (b.order || 0) - (a.order || 0));

  return (
    <section id="experience" className="py-32 bg-white dark:bg-[#050505] text-center border-t border-gray-100 dark:border-white/5 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-20"
        >
          <span className="text-[10px] items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full font-bold uppercase tracking-[0.3em] inline-flex mb-6">
            Trajectory
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-10">Experience & Education</h2>
          <div className="flex bg-gray-100 dark:bg-white/5 rounded-2xl p-1.5 border border-gray-200 dark:border-white/10">
            <button 
              onClick={() => setView('timeline')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'timeline' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-xl' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Timeline
            </button>
            <button 
              onClick={() => setView('list')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'list' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-xl' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Detailed List
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {view === 'timeline' ? (
            <div className="relative pt-12 min-h-[400px]">
              <div className="timeline-line hidden md:block" />
              <div className="space-y-24">
                {combined.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center justify-center ${idx % 2 === 0 ? 'md:justify-start md:pl-20' : 'md:justify-end md:pr-20'}`}
                  >
                    <div className="timeline-dot hidden md:block" />
                    <div className="glass-card p-10 max-w-sm text-left hover:border-accent/30 transition-all border-white/10 group">
                      <div className="text-accent font-mono text-[9px] uppercase font-bold tracking-[0.2em] mb-3 flex items-center justify-between">
                        <span>{'role' in item ? 'Professional' : 'Academic'}</span>
                        <span className="opacity-40">{item.period}</span>
                      </div>
                      <h4 className="text-gray-900 dark:text-white font-bold text-xl mb-1 group-hover:text-accent transition-colors">
                        {'role' in item ? (item as any).role : (item as any).degree}
                      </h4>
                      <div className="text-gray-500 dark:text-gray-400 text-sm font-sans mb-4 italic">
                        {'company' in item ? (item as any).company : (item as any).school}
                      </div>
                      {'description' in item && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed font-sans line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-left max-w-3xl mx-auto">
              {combined.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:border-accent/40 bg-white/5 border-white/5 transition-all group"
                >
                  <div className="flex gap-8 items-start">
                    <div className={`w-1.5 h-16 rounded-full ${'role' in item ? 'bg-accent shadow-[0_0_20px_rgba(255,82,82,0.3)]' : 'bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]'} shrink-0 mt-1`} />
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[8px] px-2 py-0.5 rounded font-bold uppercase tracking-widest ${'role' in item ? 'bg-accent/10 text-accent' : 'bg-purple-500/10 text-purple-500'}`}>
                           {'role' in item ? 'EXP' : 'EDU'}
                        </span>
                        <h4 className="text-gray-900 dark:text-white font-bold text-xl leading-tight group-hover:text-accent transition-colors">
                          {'role' in item ? (item as any).role : (item as any).degree}
                        </h4>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 font-sans text-sm">{'company' in item ? (item as any).company : (item as any).school}</div>
                    </div>
                  </div>
                  <div className="text-gray-400 font-mono text-[10px] uppercase font-bold tracking-widest bg-white/5 py-2 px-5 rounded-xl border border-white/10 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                    {item.period}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

const Achievements = ({ achievements }: { achievements: any[] }) => {
  const currentAchievements = achievements.length > 0 ? achievements.sort((a,b) => (b.order || 0) - (a.order || 0)) : ACHIEVEMENTS;

  return (
    <section id="achievements" className="py-32 bg-bg-light dark:bg-[#050505] text-center border-t border-gray-100 dark:border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <span className="text-[10px] items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full font-bold uppercase tracking-[0.3em] inline-flex mb-6">
          Awards
        </span>
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-20"
        >
          Key Accomplishments
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentAchievements.map((ach, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="glass-card !bg-white/5 !border-white/10 p-12 flex flex-col items-center justify-center text-center shadow-xl hover:border-accent/40 shadow shadow-accent/5"
            >
              <div className="w-20 h-20 bg-accent/10 rounded-[32px] flex items-center justify-center text-accent mb-8 shadow-inner">
                {ach.category === 'Award' ? <Award size={36} /> : <Cpu size={36} />}
              </div>
              <h4 className="text-gray-900 dark:text-white font-bold text-2xl mb-3 tracking-tight">{ach.title}</h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-mono font-bold mb-6 italic">{ach.issuer} • {ach.date}</p>
              {ach.description && (
                <p className="text-sm text-gray-500 dark:text-gray-500 font-sans leading-relaxed">
                  {ach.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = ({ testimonials }: { testimonials: any[] }) => {
  const [index, setIndex] = useState(0);
  const currentTestimonials = testimonials.length > 0 ? testimonials : TESTIMONIALS;

  const next = () => setIndex((index + 1) % currentTestimonials.length);
  const prev = () => setIndex((index - 1 + currentTestimonials.length) % currentTestimonials.length);

  return (
    <section id="testimonials" className="py-32 bg-white dark:bg-[#050505] text-center overflow-hidden border-t border-gray-100 dark:border-white/5">
      <div className="max-w-5xl mx-auto px-6 relative">
        <span className="text-[10px] items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full font-bold uppercase tracking-[0.3em] inline-flex mb-6">
          Vouch
        </span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-20"
        >
          Kind Words
        </motion.h2>

        <div className="relative group max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="glass-card !bg-gray-50 dark:!bg-white/5 !border-white/10 p-12 md:p-24 relative shadow-2xl"
            >
              <div className="text-accent mb-12 opacity-10 flex justify-center">
                <Layers size={100} strokeWidth={1} />
              </div>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-sans italic leading-relaxed mb-16 relative z-10">
                "{currentTestimonials[index].quote}"
              </p>
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-accent blur-xl opacity-20" />
                    <img 
                      src={currentTestimonials[index].image} 
                      alt={currentTestimonials[index].name} 
                      className="w-20 h-20 rounded-full border-2 border-accent/40 relative z-10 object-cover shadow-2xl"
                      referrerPolicy="no-referrer"
                    />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{currentTestimonials[index].name}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-mono tracking-[0.4em] font-bold">{currentTestimonials[index].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-1/2 -left-4 md:-left-20 -translate-y-1/2 z-10 flex flex-col gap-4">
            <button onClick={prev} className="p-5 rounded-full bg-white dark:bg-black border border-white/10 shadow-2xl hover:text-accent hover:scale-110 active:scale-95 transition-all text-gray-400"><ChevronLeft size={24} /></button>
          </div>
          <div className="absolute top-1/2 -right-4 md:-right-20 -translate-y-1/2 z-10 flex flex-col gap-4">
            <button onClick={next} className="p-5 rounded-full bg-white dark:bg-black border border-white/10 shadow-2xl hover:text-accent hover:scale-110 active:scale-95 transition-all text-gray-400"><ChevronRight size={24} /></button>
          </div>
          
          <div className="flex justify-center gap-3 mt-12">
            {currentTestimonials.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setIndex(i)}
                  className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-12 bg-accent' : 'w-4 bg-white/10 hover:bg-white/20'}`}
                />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Goals = ({ goals }: { goals: any }) => {
  return (
    <section id="goals" className="py-32 bg-bg-light dark:bg-[#050505] relative overflow-hidden border-t border-gray-100 dark:border-white/5">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 text-left">
            <span className="text-[10px] items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full font-bold uppercase tracking-[0.3em] inline-flex mb-6">
              Vision
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-10 leading-tight">
              Projecting <span className="text-accent italic font-serif">Future</span> <br />
              Milestones
            </h2>
            <div className="prose prose-invert dark:prose-p:text-gray-400 prose-p:text-gray-600 prose-p:text-lg italic font-serif">
              "{goals.current || 'Evolving through continuous technical transformation.'}"
            </div>
          </div>
          <div className="w-full md:w-80 h-80 bg-accent/5 rounded-[60px] border border-accent/10 flex items-center justify-center shadow-2xl relative group">
            <div className="absolute inset-10 border-2 border-dashed border-accent/20 rounded-[40px] animate-pulse" />
            <div className="relative z-10 text-center">
                <Cpu size={80} className="text-accent opacity-20 mb-4 group-hover:scale-110 transition-transform duration-700" />
                <div className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">Active Evolution</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const validate = (data = formData) => {
    const newErrors: any = {};
    if (!data.name.trim()) newErrors.name = "Name is required";
    if (!data.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) newErrors.email = "Invalid email format";
    if (!data.message.trim()) newErrors.message = "Message cannot be empty";
    return newErrors;
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      setErrors(validate());
    }
  }, [formData, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStatus('loading');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <section id="contact" className="py-32 bg-white dark:bg-[#050505] text-center">
      <div className="max-w-2xl mx-auto px-6">
        <span className="badge-orange mb-6 inline-block">Connect</span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-16"
        >
          Let's Work Together
        </motion.h2>
        
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card !bg-green-500/5 !border-green-500/20 p-12 text-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
              <p className="text-gray-500 dark:text-gray-400">Thank you for reaching out. I'll get back to you within 24 hours.</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card !bg-gray-50 dark:!bg-white/5 !border-gray-200 dark:!border-white/10 p-8 md:p-12 relative overflow-hidden shadow-sm"
            >
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-2">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      value={formData.name}
                      onBlur={() => handleBlur('name')}
                      onChange={(e) => {
                        setFormData({...formData, name: e.target.value});
                      }}
                      className={`w-full px-6 py-4 rounded-2xl bg-white dark:bg-black/40 border ${touched.name && errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-accent transition-all text-sm`} 
                    />
                    {touched.name && errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-wider">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. john@example.com" 
                      value={formData.email}
                      onBlur={() => handleBlur('email')}
                      onChange={(e) => {
                        setFormData({...formData, email: e.target.value});
                      }}
                      className={`w-full px-6 py-4 rounded-2xl bg-white dark:bg-black/40 border ${touched.email && errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-accent transition-all text-sm`} 
                    />
                    {touched.email && errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-wider">{errors.email}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-2">Message</label>
                  <textarea 
                    rows={4} 
                    placeholder="Tell me about your project..." 
                    value={formData.message}
                    onBlur={() => handleBlur('message')}
                    onChange={(e) => {
                      setFormData({...formData, message: e.target.value});
                    }}
                    className={`w-full px-6 py-4 rounded-2xl bg-white dark:bg-black/40 border ${touched.message && errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-accent transition-all text-sm resize-none`} 
                  />
                  {touched.message && errors.message && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-wider">{errors.message}</p>}
                </div>
                <button 
                  disabled={status === 'loading'}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed justify-center"
                >
                  {status === 'loading' ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : 'Send Message'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-center gap-6 mt-16">
          <a href="#" className="p-4 rounded-full bg-gray-50 border border-gray-100 text-gray-600 hover:text-accent hover:border-accent transition-all animate-fade-in" style={{ animationDelay: '0.1s' }}><Github size={22} /></a>
          <a href="#" className="p-4 rounded-full bg-gray-50 border border-gray-100 text-gray-600 hover:text-accent hover:border-accent transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}><Linkedin size={22} /></a>
          <a href="#" className="p-4 rounded-full bg-gray-50 border border-gray-100 text-gray-600 hover:text-accent hover:border-accent transition-all animate-fade-in" style={{ animationDelay: '0.3s' }}><Twitter size={22} /></a>
          <a href="#" className="p-4 rounded-full bg-gray-50 border border-gray-100 text-gray-600 hover:text-accent hover:border-accent transition-all animate-fade-in" style={{ animationDelay: '0.4s' }}><PenTool size={22} /></a>
        </div>
      </div>
    </section>
  );
};

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[100] p-4 bg-accent text-white rounded-full shadow-2xl shadow-accent/40 hover:opacity-90 transition-all group"
          aria-label="Back to top"
        >
          <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as any) || 'light';
  });
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any>(SKILLS);
  const [experience, setExperience] = useState<any[]>(EXPERIENCE);
  const [education, setEducation] = useState<any[]>(EDUCATION);
  const [achievements, setAchievements] = useState<any[]>(ACHIEVEMENTS);
  const [testimonials, setTestimonials] = useState<any[]>(TESTIMONIALS);
  const [goals, setGoals] = useState<any>({ current: 'Building future-ready AI solutions.' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);

    const unsubs = [
      subscribeToConfig('profile', setProfile),
      subscribeToCollection('projects', setProjects),
      subscribeToCollection('skills', (data) => {
        if (data.length > 0) {
          const categorized: any = { languages: [], technologies: [], tools: [] };
          data.forEach(s => categorized[s.category]?.push(s));
          setSkills(categorized);
        }
      }),
      subscribeToCollection('experience', setExperience),
      subscribeToCollection('education', setEducation),
      subscribeToCollection('achievements', setAchievements),
      subscribeToCollection('testimonials', setTestimonials),
      subscribeToConfig('goals', setGoals)
    ];

    setLoading(false);

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <HelmetProvider>
      <div className="selection:bg-accent/30 dark:bg-[#050505] transition-colors duration-300">
        <Helmet>
          <title>Sudharsan S | Aspiring Software Engineer Portfolio</title>
          <meta name="description" content="Portfolio of Sudharsan S, skilled in building AI-powered web applications using React, TypeScript, and modern APIs." />
          <meta property="og:title" content="Sudharsan S Portfolio" />
          <meta property="og:type" content="website" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Sudharsan S",
              "jobTitle": "Software Engineer",
              "url": "https://sudharsan-portfolio.com",
              "keywords": "React, TypeScript, AI, Software Engineer, Portfolio"
            })}
          </script>
        </Helmet>
        
        <ScrollProgress />
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        
        <main>
          <header id="home">
            <Hero profile={profile} />
          </header>
          
          <About skills={skills} />
          <Projects projects={projects} />
          <Experience experience={experience} education={education} />
          <Achievements achievements={achievements} />
          <Goals goals={goals} />
          <Testimonials testimonials={testimonials} />
          <Contact />
        </main>
        
        <BackToTop />

        {/* Sync Status Overlay */}
        <div className="fixed bottom-8 left-8 z-[200] pointer-events-none hidden md:block">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 glass-card !bg-white/10 dark:!bg-black/40 backdrop-blur-xl border border-white/10 rounded-full"
          >
            <div className="flex items-center gap-2 px-2">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-[9px] font-bold text-gray-800 dark:text-white uppercase tracking-widest">
                {loading ? 'Cloud Syncing...' : 'Real-time Linked'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </HelmetProvider>
  );
}



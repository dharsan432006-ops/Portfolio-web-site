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
import { getProfile, getProjects } from './lib/firebase.ts';

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

  useEffect(() => {
    // Simulated fetch
  }, []);

  const displayProfile = {
    name: profile?.name || 'Sudharsan',
    role: profile?.role || 'Software Engineer',
    photo: profile?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&h=1100&auto=format&fit=crop',
    summary: profile?.summary || 'Building exceptional AI-powered web experiences with high-performance scalable architectures.'
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
          <div className="hello-bubble">
            Hello! 👋
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-gray-900 dark:text-white leading-[1.1] mb-6">
            I'm <span className="text-accent underline decoration-accent/20">{displayProfile.name.split(' ')[0]}</span>, <br />
            {displayProfile.role}
          </h1>
          <p className="max-w-md text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed font-sans">
            {displayProfile.summary}
          </p>
          <div className="flex gap-4">
            <a href="#projects" className="btn-primary">
              Portfolio <ChevronRight size={18} />
            </a>
            <button onClick={() => window.open('/resume.pdf')} className="btn-secondary">
              Download CV
            </button>
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

const About = () => {
  const [activeTab, setActiveTab] = useState<'languages' | 'technologies' | 'tools'>('languages');
  
  return (
    <section id="about" className="py-32 bg-white dark:bg-[#050505] relative z-10 border-b border-gray-100 dark:border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="badge-orange mb-6 inline-block">Services</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Exceptional software <br />
              solutions for your success.
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-sans leading-relaxed text-lg mb-8">
              I am a passionate Computer Science student at SRM Institute, 
              deeply interested in the intersection of algorithms, software engineering, 
              and artificial intelligence. I specialize in building real-time multimodal 
              AI systems and high-performance backend architectures.
            </p>
            <div className="flex gap-4">
              <a href="#contact" className="btn-primary !px-10">Contact Now</a>
            </div>
          </div>
          
          <div className="glass-card !bg-gray-50 dark:!bg-white/5 !border-gray-200 dark:!border-white/10 p-8 shadow-sm">
            <div className="space-y-6">
              <div className="flex gap-4 border-b border-gray-200 dark:border-white/10 mb-6">
                {(['languages', 'technologies', 'tools'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-[11px] uppercase tracking-widest font-display font-bold transition-all ${activeTab === tab ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="grid gap-6">
                {SKILLS[activeTab].map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-[12px] font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide uppercase">
                      <span>{skill.name}</span>
                      <span className="opacity-70">{skill.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ 
                          duration: 1.5, 
                          ease: [0.34, 1.56, 0.64, 1], // Custom bouncy ease for premium feel
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

const ImageCarousel = ({ images, title }: { images: string[], title: string }) => {
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
          className="w-full h-full object-cover opacity-80 group-hover/carousel:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
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
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
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
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] font-mono">Visual Assets Repository</h3>
                <span className="text-[10px] text-gray-600 font-mono italic">{project.images.length} Objects Loaded</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {project.images.map((img: string, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                  className={`rounded-[24px] overflow-hidden bg-white/5 group/image relative border border-white/5 hover:border-accent/40 shadow-xl transition-all cursor-zoom-in ${idx === 0 ? 'col-span-2' : ''}`}
                >
                  <img 
                    src={img} 
                    alt={`${project.title} asset ${idx + 1}`} 
                    className="w-full h-full object-cover opacity-80 group-hover/image:opacity-100 group-hover/image:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover/image:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-lg opacity-0 group-hover/image:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <Maximize2 size={12} className="text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = ({ projects: liveProjects }: { projects: any[] }) => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const projects = liveProjects.length > 0 ? liveProjects : STATIC_PROJECTS;
  
  // Extract unique categories and tech
  const categories = ['All', ...Array.from(new Set(projects.map(p => (p as any).category)))];
  const allTech = Array.from(new Set(projects.flatMap(p => (p as any).tech))).sort();
  
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => (p as any).category === filter || (p as any).tech.includes(filter));

  return (
    <section id="projects" className="py-32 bg-bg-light dark:bg-[#050505] text-center relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/2 opacity-20 blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-20">
          <span className="badge-orange mb-6">Archive</span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            Digital <span className="text-accent italic font-serif">Artifacts</span>
          </motion.h2>
          <p className="max-w-2xl text-gray-500 dark:text-gray-400 text-lg">
            A curated selection of experiments and precision-engineered solutions across AI, systems, and creative tech.
          </p>
        </div>
        
        {/* Advanced Filter UI */}
        <div className="mb-20 space-y-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all border ${
                  filter === cat 
                  ? 'bg-accent border-accent text-white shadow-[0_10px_20px_rgba(255,82,82,0.2)]' 
                  : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {allTech.map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  filter === t 
                  ? 'bg-accent/10 border-accent/30 text-accent' 
                  : 'bg-transparent border-gray-100 dark:border-white/5 text-gray-400 hover:border-accent/20'
                }`}
              >
                #{t}
              </button>
            ))}
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
                whileHover={{ y: -12, scale: 1.02 }}
                onClick={() => setSelectedProject(project)}
                className="glass-card overflow-hidden flex flex-col items-start p-8 text-left cursor-pointer group shadow-sm hover:shadow-2xl hover:shadow-accent/10 transition-shadow duration-500"
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
                    0{filteredProjects.indexOf(project) + 1}
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
                      onClick={(e) => { e.stopPropagation(); setFilter(t); }}
                      className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border ${
                        filter === t 
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

const Experience = () => {
  const [view, setView] = useState<'timeline' | 'list'>('timeline');

  return (
    <section id="experience" className="py-24 bg-white dark:bg-[#080808] text-center border-t border-gray-100 dark:border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-16"
        >
          <span className="badge-orange mb-6 inline-block">Experience / Education</span>
          <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
            <button 
              onClick={() => setView('timeline')}
              className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase transition-all ${view === 'timeline' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Timeline
            </button>
            <button 
              onClick={() => setView('list')}
              className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase transition-all ${view === 'list' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              List
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
              <div className="timeline-line" />
              <div className="space-y-24">
                {[...EXPERIENCE, ...EDUCATION].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative flex items-center justify-center"
                  >
                    <div className="timeline-dot" />
                    <div className={`mt-0 glass-card p-6 inline-block max-w-[280px] md:max-w-sm text-left ${idx % 2 === 0 ? 'md:mr-[30rem]' : 'md:ml-[30rem]'}`}>
                      <div className="text-accent font-mono text-[10px] uppercase mb-1">
                        {'role' in item ? 'Experience' : 'Education'}
                      </div>
                      <h4 className="text-gray-900 font-bold text-sm">{'role' in item ? (item as any).role : (item as any).degree}</h4>
                      <div className="text-gray-500 text-xs mt-1">{'company' in item ? (item as any).company : (item as any).school}</div>
                      <div className="text-gray-400 text-[10px] mt-2 font-mono">{item.period}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              {[...EXPERIENCE, ...EDUCATION].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/20 transition-colors"
                >
                  <div className="flex gap-4 items-start">
                    <div className={`w-1 h-12 rounded-full ${'role' in item ? 'bg-accent' : 'bg-purple-500'} shrink-0 mt-1`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-gray-900 font-bold text-base">{'role' in item ? (item as any).role : (item as any).degree}</h4>
                      </div>
                      <div className="text-gray-500 text-sm">{'company' in item ? (item as any).company : (item as any).school}</div>
                    </div>
                  </div>
                  <div className="text-gray-500 font-mono text-xs md:text-right bg-white/5 py-1 px-3 rounded-full border border-white/5">
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

const Achievements = () => {
  return (
    <section id="achievements" className="py-24 bg-bg-light dark:bg-[#050505] text-center">
      <div className="max-w-6xl mx-auto px-6">
        <span className="badge-orange mb-6 inline-block">Awards</span>
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-16"
        >
          Achievements
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ACHIEVEMENTS.slice(0, 3).map((ach, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card !bg-white dark:!bg-white/5 !border-gray-100 dark:!border-white/10 p-12 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition-all"
            >
              {idx === 0 ? <Award size={40} className="text-accent mb-6" /> : idx === 1 ? <Cpu size={40} className="text-accent mb-6" /> : <Award size={40} className="text-accent mb-6" />}
              <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-2">{ach.title}</h4>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">{ach.issuer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % TESTIMONIALS.length);
  const prev = () => setIndex((index - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-[#050505] text-center overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative">
        <span className="badge-orange mb-6 inline-block">Testimonials</span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-16"
        >
          Kind Words
        </motion.h2>

        <div className="relative group">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-card !bg-gray-50 dark:!bg-white/5 !border-gray-200 dark:!border-white/10 p-8 md:p-16 relative"
            >
              <div className="text-accent mb-8 opacity-20 flex justify-center">
                <Mail size={60} strokeWidth={1} />
              </div>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-sans italic leading-relaxed mb-10">
                "{TESTIMONIALS[index].quote}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img 
                  src={TESTIMONIALS[index].image} 
                  alt={TESTIMONIALS[index].name} 
                  className="w-12 h-12 rounded-full border-2 border-accent/20"
                />
                <div className="text-left">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{TESTIMONIALS[index].name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{TESTIMONIALS[index].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 z-10">
            <button onClick={prev} className="p-3 rounded-full bg-white dark:bg-black border border-gray-100 dark:border-white/10 shadow-lg hover:text-accent transition-all"><ChevronLeft size={18} /></button>
          </div>
          <div className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 z-10">
            <button onClick={next} className="p-3 rounded-full bg-white dark:bg-black border border-gray-100 dark:border-white/10 shadow-lg hover:text-accent transition-all"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<any>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStatus('loading');
      // Simulate real API integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
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
                      onChange={(e) => {
                        setFormData({...formData, name: e.target.value});
                        if (errors.name) setErrors({...errors, name: null});
                      }}
                      className={`w-full px-6 py-4 rounded-2xl bg-white dark:bg-black/40 border ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-accent transition-all text-sm`} 
                    />
                    {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-wider">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. john@example.com" 
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({...formData, email: e.target.value});
                        if (errors.email) setErrors({...errors, email: null});
                      }}
                      className={`w-full px-6 py-4 rounded-2xl bg-white dark:bg-black/40 border ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-accent transition-all text-sm`} 
                    />
                    {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-wider">{errors.email}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-2">Message</label>
                  <textarea 
                    rows={4} 
                    placeholder="Tell me about your project..." 
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({...formData, message: e.target.value});
                      if (errors.message) setErrors({...errors, message: null});
                    }}
                    className={`w-full px-6 py-4 rounded-2xl bg-white dark:bg-black/40 border ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-accent transition-all text-sm resize-none`} 
                  />
                  {errors.message && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 uppercase tracking-wider">{errors.message}</p>}
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);

    const fetchData = async () => {
      try {
        const [prof, projs] = await Promise.all([getProfile(), getProjects()]);
        if (prof) setProfile(prof);
        if (projs && projs.length > 0) setProjects(projs);
      } catch (err) {
        console.error("Failed to sync with live data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
          
          <About />
          <Projects projects={projects} />
          <Experience />
          <Achievements />
          <Testimonials />
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



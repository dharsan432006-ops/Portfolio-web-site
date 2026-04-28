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
  Play,
  Pause,
  ChevronUp,
  Twitter,
  PenTool,
  ChevronLeft,
  Maximize2,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { PROJECTS as STATIC_PROJECTS, SKILLS, EXPERIENCE, EDUCATION, ACHIEVEMENTS, TESTIMONIALS } from './constants';
import { 
  subscribeToProjects, 
  subscribeToCollection,
  subscribeToConfig
} from './lib/firebase.ts';

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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 w-full z-100 px-8 py-8 flex items-center justify-between pointer-events-none">
      <div className="flex items-center pointer-events-auto">
        <a href="#" className="font-display font-black text-2xl text-white tracking-tighter">Sudharsan S.</a>
      </div>

      <div className="hidden md:flex items-center gap-10 pointer-events-auto">
        {['Home', 'About', 'Projects'].map(item => (
          <a 
            key={item}
            href={`#${item.toLowerCase()}`} 
            className="nav-link"
          >
            {item}
          </a>
        ))}
        <a href="#contact" className="btn-primary">
          Get in touch
          <div className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center">
            <ChevronRight size={14} className="text-black" />
          </div>
        </a>
      </div>

      <button 
        className="md:hidden text-white pointer-events-auto" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-surface/95 backdrop-blur-2xl z-[60] flex flex-col items-center justify-center gap-8 pointer-events-auto"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-white"><X size={32} /></button>
            {['Home', 'About', 'Projects', 'Contact'].map(item => (
              <a 
                key={item}
                onClick={() => setIsOpen(false)}
                href={`#${item.toLowerCase()}`} 
                className="text-4xl font-display font-bold text-white hover:text-accent transition-colors"
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ profile }: { profile: any }) => {
  return (
    <div className="relative min-h-screen pt-32 flex flex-col items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
        <div className="glass-card relative overflow-hidden aspect-[16/8] md:aspect-[16/7] w-full flex items-center p-12 md:p-24 rounded-[80px]">
          {/* Main Background Image */}
          <div className="absolute inset-0">
             <img 
               src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000" 
               className="w-full h-full object-cover brightness-[0.35] contrast-125 scale-105"
               alt="Background"
               referrerPolicy="no-referrer"
               onError={(e) => {
                 const target = e.target as HTMLImageElement;
                 if (!target.src.includes('placeholder')) {
                    target.src = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000'; // Dark red secondary fallback
                 }
               }}
             />
             <div className="absolute inset-0 bg-linear-to-tr from-accent/40 via-black/40 to-transparent" />
             <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full gap-12">
            <div className="max-w-xl">
              <span className="text-white text-lg md:text-xl font-medium mb-4 block">Hey, I'm a</span>
              <h1 className="text-6xl md:text-8xl font-display font-bold text-white leading-[0.9] tracking-tighter">
                Computer <br />
                <span className="text-accent underline decoration-accent/30 underline-offset-8">Scientist</span>
              </h1>
            </div>

            <div className="max-w-xs md:text-left text-center">
              <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
                Building the future with code and AI.
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                B.Tech Student specialized in Python, React, and Intelligent Systems.
              </p>
            </div>
          </div>

          {/* Bullet points row at the bottom of the hero card */}
          <div className="absolute bottom-12 left-12 right-12 hidden md:grid grid-cols-4 gap-8">
            {[
              { id: '01', label: 'Full-Stack Development' },
              { id: '02', label: 'AI & Neural Platforms' },
              { id: '03', label: 'Cloud Architecture' },
              { id: '04', label: 'UI/UX Engineering' }
            ].map((item) => (
              <div key={item.id} className="space-y-1">
                <span className="text-accent text-xs font-black">#{item.id}</span>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Brands = () => {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-wrap items-center justify-between gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          <span className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] w-full md:w-auto mb-4 md:mb-0">Associated with Excellence</span>
          {[
            { name: 'SRM Institute', icon: BookOpen },
            { name: 'Microsoft', icon: Cpu },
            { name: 'IBM', icon: Layers },
            { name: 'AWS', icon: Zap }
          ].map((brand) => (
            <div key={brand.name} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                <brand.icon size={14} className="text-white" />
              </div>
              <span className="text-white font-bold text-sm tracking-tight">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = ({ profile }: { profile: any }) => {
  if (!profile) return null;

  return (
    <section id="about" className="py-40 bg-black">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="relative aspect-square rounded-[60px] overflow-hidden border border-white/10 group">
              <img 
                src={profile.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000"} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110" 
                alt="About me"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {/* Artistic Accents */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
            
            <div className="absolute top-10 right-10 flex flex-col gap-3">
               <div className="w-12 h-1 bg-accent/40 rounded-full" />
               <div className="w-8 h-1 bg-accent/30 rounded-full" />
               <div className="w-5 h-1 bg-accent/20 rounded-full" />
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <span className="section-subtitle">Core Identity</span>
              <h2 className="section-title">Who is <br /><span className="text-accent underline decoration-accent/20 underline-offset-8">Sudharsan?</span></h2>
            </div>
            
            <div className="space-y-8">
              <p className="text-2xl text-white font-serif italic border-l-4 border-accent pl-8 py-4 bg-white/[0.02] rounded-r-2xl">
                "{profile.summary || 'A computer scientist dedicated to pushing the boundaries of what is possible with code.'}"
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-8">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest">Current Focus</p>
                    <p className="text-white font-medium">{profile.role || 'Neural Intelligence & Distributed Systems'}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest">Philosophy</p>
                    <p className="text-white font-medium">Clean Code, Complex Architecture, Purposeful Impact</p>
                 </div>
              </div>
            </div>

            <div className="flex gap-12 pt-8 border-t border-white/5">
               <div>
                  <h4 className="text-accent text-3xl font-display font-bold">5+</h4>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Scale Projects</p>
               </div>
               <div>
                  <h4 className="text-white text-3xl font-display font-bold">100%</h4>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Deployment Rate</p>
               </div>
               <div>
                  <h4 className="text-white text-3xl font-display font-bold">AI</h4>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">First Approach</p>
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

const getVideoEmbedUrl = (url: string) => {
  if (!url) return null;
  
  // YouTube
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  
  // Vimeo
  const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  
  return null;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const VideoPlayer = ({ url }: { url: string }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [url]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const embedUrl = getVideoEmbedUrl(url);

  if (embedUrl) {
    return (
      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
        <iframe 
          src={embedUrl} 
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video preview"
        />
      </div>
    );
  }

  return (
    <div 
      className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black group/video"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Custom Controls Overlay */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: showControls || !isPlaying ? 1 : 0, y: showControls || !isPlaying ? 0 : 10 }}
        className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 pointer-events-none"
      >
        <div className="flex items-center gap-6 pointer-events-auto">
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-accent/20 hover:bg-accent/40 backdrop-blur-xl border border-accent/30 flex items-center justify-center text-white transition-all transform active:scale-95"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          
          <div className="flex-1 flex flex-col gap-2">
            <div className="relative group/progress h-6 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="0.01"
                value={progress}
                onChange={handleSeek}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-accent relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
                </motion.div>
              </div>
            </div>
            
            <div className="flex justify-between items-center px-1">
              <div className="text-[10px] font-mono font-bold text-white/50 tracking-widest flex items-center gap-2">
                <span className="text-white">{formatTime(videoRef.current?.currentTime || 0)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
              
              <div className="text-[9px] font-black text-accent uppercase tracking-[0.2em] opacity-40">
                Studio Quality Preview
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] cursor-pointer"
          onClick={togglePlay}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center group-hover/video:scale-110 transition-transform"
          >
            <Play size={32} className="text-white ml-2" fill="currentColor" />
          </motion.div>
        </div>
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
                <VideoPlayer url={project.videoUrl} />
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
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2">
                  <ExternalLink size={16} /> Live Project
                </a>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-2">
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
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const projects = liveProjects.length > 0 ? liveProjects : STATIC_PROJECTS;
  const categories = ['All', ...Array.from(new Set(projects.flatMap(p => [p.category, ...(p.categories || [])])))].filter(Boolean);
  
  const filteredProjects = projects.filter(p => {
    const pCats = [p.category, ...(p.categories || [])].filter(Boolean);
    return activeCategories.includes('All') || activeCategories.some(cat => pCats.includes(cat));
  });

  const toggleCategory = (cat: string) => {
    setActiveCategories(cat === 'All' ? ['All'] : [cat]);
  };

  return (
    <section id="projects" className="py-40 bg-[#080808] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-12 items-end mb-32">
          <div className="text-left">
            <span className="section-subtitle">Behind the Designs</span>
            <h2 className="section-title">Shaping Experiences That Make Life Simpler</h2>
          </div>
          <div className="text-left md:pl-20 space-y-8">
            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              I'm a product designer focused on building clean, intuitive interfaces that solve real-world problems.
            </p>
            <a href="#contact" className="btn-accent inline-flex w-auto px-6 py-3">
              Get in touch
              <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                <ChevronRight size={14} className="text-white" />
              </div>
            </a>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-20 flex flex-wrap justify-start gap-3">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${
                activeCategories.includes(cat)
                ? 'bg-accent border-accent text-white shadow-[0_10px_30px_rgba(255,77,0,0.2)]' 
                : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project: any) => (
              <motion.div 
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer relative aspect-[3/4] rounded-[60px] overflow-hidden border border-white/5 bg-white/[0.02]"
              >
                <img 
                  src={project.images[0]} 
                  alt={project.title}
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-60" />
                <div className="absolute bottom-12 left-12 right-12 text-left translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-3 block">
                    {project.categories?.length > 0 ? project.categories.join(' · ') : project.category}
                  </span>
                  <h3 className="text-3xl font-bold text-white font-display tracking-tight leading-none">{project.title}</h3>
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

const TechStack = ({ projects, skills }: { projects: any[], skills: any[] }) => {
  // Frequency of tech across projects
  const techFrequency = projects.reduce((acc: any, p) => {
    p.tech?.forEach((t: string) => {
      acc[t] = (acc[t] || 0) + 1;
    });
    return acc;
  }, {});

  const barData = Object.entries(techFrequency)
    .map(([name, count]) => ({ name, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Skills radar data
  const categories = ['languages', 'technologies', 'tools'];
  const radarData = categories.map(cat => {
    const catSkills = skills.filter(s => s.category === cat);
    const avgLevel = catSkills.length > 0 
      ? catSkills.reduce((sum, s) => sum + s.level, 0) / catSkills.length 
      : 0;
    return {
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      level: Math.round(avgLevel),
      fullMark: 100
    };
  });

  // Top Skills Horizontal bar data
  const topSkills = [...skills]
    .sort((a, b) => b.level - a.level)
    .slice(0, 5);

  return (
    <section id="tech-stack" className="py-40 bg-[#000000] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-24 items-start mb-32">
          <div className="text-left">
            <span className="section-subtitle">Infrastructure</span>
            <h2 className="section-title">Technical <br /> Architecture</h2>
            <p className="text-gray-400 text-lg leading-relaxed font-medium mt-12 max-w-sm">
              Visualizing the collision of design systems and scalable engineering. I build with speed and stability in mind.
            </p>
            
            <div className="mt-16 space-y-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shrink-0">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Performance First</h4>
                  <p className="text-gray-500 text-sm mt-1">Optimization isn't an afterthought, it's the foundation of my development cycle.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
                  <Terminal size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Clean Implementation</h4>
                  <p className="text-gray-500 text-sm mt-1">Modular, typed, and well-documented code that scales with the product.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="glass-card p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <BarChartIcon size={120} className="text-accent" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent" />
                Tech Frequency in Projects
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#4b5563" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#4b5563" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                      itemStyle={{ color: '#ff4d00' }}
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    />
                    <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                      {barData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ff4d00' : 'rgba(255,255,255,0.08)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">Skill Proficiency</h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.05)" />
                      <PolarAngleAxis dataKey="category" stroke="#4b5563" fontSize={10} />
                      <Radar
                        name="Skills"
                        dataKey="level"
                        stroke="#ff4d00"
                        fill="#ff4d00"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-8 flex flex-col justify-center">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-6">Expertise Level</h3>
                <div className="space-y-5">
                  {topSkills.map((skill, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-white">{skill.name}</span>
                        <span className="text-accent">{skill.level}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Experience = ({ experience, education }: { experience: any[], education: any[] }) => {
  return (
    <section className="py-40 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          <div>
            <span className="section-subtitle">Experience</span>
            <h2 className="section-title">Career Path</h2>
            <div className="space-y-16 mt-16">
              {experience.map((exp, idx) => (
                <div key={idx} className="group relative">
                  <span className="text-accent text-[10px] font-black tracking-widest block mb-4">/ {exp.period || exp.date}</span>
                  <h3 className="text-3xl font-display font-bold text-white mb-2 group-hover:text-accent transition-colors">{exp.role}</h3>
                  <p className="text-gray-400 font-medium text-lg mb-6">{exp.company}</p>
                  <p className="text-gray-500 leading-relaxed text-sm max-w-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="section-subtitle">Education</span>
            <h2 className="section-title">Academics</h2>
            <div className="space-y-16 mt-16">
              {education.map((edu, idx) => (
                <div key={idx} className="group relative">
                  <span className="text-accent text-[10px] font-black tracking-widest block mb-4">/ {edu.period || edu.date}</span>
                  <h3 className="text-3xl font-display font-bold text-white mb-2 group-hover:text-accent transition-colors">{edu.degree}</h3>
                  <p className="text-gray-400 font-medium text-lg mb-4">{edu.school}</p>
                  <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full inline-block text-[10px] font-bold text-accent uppercase tracking-widest">
                    Result: {edu.cgpa}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Achievements = ({ achievements }: { achievements: any[] }) => {
  const currentAchievements = achievements.length > 0 ? achievements.sort((a,b) => (b.order || 0) - (a.order || 0)) : ACHIEVEMENTS;

  return (
    <section className="py-40 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-8 border-t border-white/5 pt-40">
        <div className="grid md:grid-cols-2 items-end mb-24">
           <div>
             <span className="section-subtitle">Recognition</span>
             <h2 className="section-title">Awards & <br /> Certifications</h2>
           </div>
           <p className="text-gray-500 text-lg md:pl-20">A collection of industry-recognized achievements and technical excellence milestones.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentAchievements.map((ach, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass-card p-12 hover:border-accent/40 transition-all group"
            >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-accent mb-10 group-hover:scale-110 transition-transform">
                {ach.category === 'Award' ? <Award size={24} /> : <Cpu size={24} />}
              </div>
              <h4 className="text-white font-display font-bold text-2xl mb-3 tracking-tight">{ach.title}</h4>
              <p className="text-accent text-[10px] font-bold uppercase tracking-widest mb-6">{ach.issuer}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{ach.description}</p>
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
    <section className="py-40 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-8 text-center bg-accent/5 rounded-[80px] py-32 border border-accent/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/10 blur-[120px] rounded-full" />
        
        <span className="section-subtitle">Kind Words</span>
        <h2 className="section-title mb-24">What people are saying</h2>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-16"
            >
              <p className="text-3xl md:text-5xl text-white font-display font-medium leading-[1.2] tracking-tight">
                "{currentTestimonials[index].quote}"
              </p>
              <div className="flex items-center justify-center gap-6">
                <img 
                  src={currentTestimonials[index].image} 
                  alt={currentTestimonials[index].name} 
                  className="w-16 h-16 rounded-full border border-white/20 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <h4 className="text-white font-bold text-xl">{currentTestimonials[index].name}</h4>
                  <p className="text-accent text-[10px] font-bold uppercase tracking-widest">{currentTestimonials[index].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-8 mt-24">
            <button onClick={prev} className="p-5 rounded-full border border-white/10 text-white hover:bg-white/10 transition-all hover:scale-110"><ChevronLeft size={20} /></button>
            <button onClick={next} className="p-5 rounded-full border border-white/10 text-white hover:bg-white/10 transition-all hover:scale-110"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="contact" className="py-40 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <span className="section-subtitle">Get in touch</span>
            <h2 className="section-title !text-6xl md:!text-8xl">Let's build <br /> something <br /> <span className="italic font-serif">Legendary.</span></h2>
            <p className="text-gray-500 text-lg mt-12 max-w-sm">
              Currently accepting new projects and collaborations for 2026.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <input 
                type="text" 
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-transparent border-b-2 border-white/10 py-6 text-2xl text-white focus:border-accent transition-all outline-none"
                required
              />
              <input 
                type="email" 
                placeholder="Email Address"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-transparent border-b-2 border-white/10 py-6 text-2xl text-white focus:border-accent transition-all outline-none"
                required
              />
              <textarea 
                rows={4}
                placeholder="Project Description"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-transparent border-b-2 border-white/10 py-6 text-2xl text-white focus:border-accent transition-all outline-none resize-none"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="btn-accent px-12 py-5 text-sm !pr-5"
            >
              {status === 'loading' ? 'Transmitting...' : status === 'success' ? 'Link Established!' : 'Send Transmission'}
              <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                <ChevronRight size={18} className="text-white" />
              </div>
            </button>
          </form>
        </div>

        <div className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">Sudharsan S. Portfolio &copy; 2026</p>
          <div className="flex gap-10">
            <a 
              href="https://github.com/dharsan432006-ops" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-all hover:scale-110"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://linkedin.com/in/sudharsan-s-7b573135" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-all hover:scale-110"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="mailto:Sudharsan4326@gmail.com" 
              className="text-gray-500 hover:text-white transition-all hover:scale-110"
            >
              <Mail size={20} />
            </a>
          </div>
          <p className="text-white font-display font-black tracking-tighter uppercase text-sm italic">Engineering Innovation.</p>
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
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>(EXPERIENCE);
  const [education, setEducation] = useState<any[]>(EDUCATION);
  const [achievements, setAchievements] = useState<any[]>(ACHIEVEMENTS);
  const [testimonials, setTestimonials] = useState<any[]>(TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    const unsubs = [
      subscribeToConfig('profile', setProfile),
      subscribeToCollection('projects', setProjects),
      subscribeToCollection('skills', setSkills),
      subscribeToCollection('experience', setExperience),
      subscribeToCollection('education', setEducation),
      subscribeToCollection('achievements', setAchievements),
      subscribeToCollection('testimonials', setTestimonials)
    ];

    setLoading(false);
    return () => unsubs.forEach(unsub => unsub());
  }, []);

  return (
    <HelmetProvider>
      <div className="bg-black text-white selection:bg-accent/30 min-h-screen">
        <Helmet>
          <title>Sudharsan S. | Computer Scientist Portfolio</title>
          <meta name="description" content="Portfolio of Sudharsan S., focusing on AI, Full-stack Development, and Software Engineering." />
        </Helmet>
        
        <ScrollProgress />
        <Navbar />
        
        <main>
          <header id="home">
            <Hero profile={profile} />
            <Brands />
          </header>
          
          <About profile={profile} />
          <Projects projects={projects} />
          <TechStack projects={projects} skills={skills.length > 0 ? skills : Object.values(SKILLS).flat()} />
          <Experience experience={experience} education={education} />
          <Achievements achievements={achievements} />
          <Contact />
        </main>
        
        <BackToTop />
      </div>
    </HelmetProvider>
  );
}



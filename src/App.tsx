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
  ChevronUp
} from 'lucide-react';
import { PROJECTS, SKILLS, EXPERIENCE, EDUCATION, ACHIEVEMENTS } from './constants';

const Navbar = () => (
  <nav className="absolute top-0 left-0 right-0 z-50 py-8">
    <div className="max-w-7xl mx-auto px-6">
      <a href="#" className="text-sm font-bold tracking-widest text-white uppercase opacity-80 hover:opacity-100 transition-opacity">
        Mohamed Sarbudeen
      </a>
    </div>
  </nav>
);

const Hero = () => (
  <div className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 aurora-container">
    <div className="aurora-bg animate-pulse" />
    <motion.h1 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-[12vw] md:text-[8rem] font-bold text-white tracking-tighter leading-none mb-4"
    >
      MOHAMED SARBUDEEN
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-lg md:text-xl text-white/70 font-medium tracking-wide mb-8"
    >
      "Aspiring Software Developer | Problem Solver"
    </motion.p>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex gap-4"
    >
      <a href="#projects" className="btn-primary">View Projects</a>
      <a href="#contact" className="btn-secondary">Contact Me</a>
    </motion.div>
  </div>
);

const About = () => {
  const [activeTab, setActiveTab] = useState<'languages' | 'technologies' | 'tools'>('languages');
  
  return (
    <section id="about" className="py-24 bg-surface relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-xl font-display font-bold text-white mb-8"
        >
          About
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-[1.2fr_1fr] gap-8"
        >
          <div className="glass-card p-8">
            <p className="text-gray-400 font-sans leading-relaxed text-sm mb-6">
              I am a passionate B.Tech Computer Science student at Anna University, 
              deeply interested in the intersection of algorithms, software engineering, 
              and artificial intelligence. As a Python developer at heart, I love tackling 
              complex problems and turning them into elegant pieces of code.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 border-b border-white/5 mb-4">
                {(['languages', 'technologies', 'tools'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-[10px] uppercase tracking-widest font-display font-bold transition-all ${activeTab === tab ? 'text-blue-500 border-b border-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="grid gap-4">
                {SKILLS[activeTab].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-[11px] font-display font-medium text-gray-400 mb-1 tracking-wide">
                      <span>{skill.name}</span>
                      <span className="font-sans opacity-70">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="glass-card p-8 flex flex-wrap gap-2 h-fit mb-4">
              <h3 className="w-full text-xs font-display font-bold text-white mb-4 uppercase tracking-widest opacity-60">Focus Areas</h3>
              {['AI & ML', 'Cloud Systems', 'Distributed Systems', 'Backend Architecture'].map(tag => (
                <span key={tag} className="tag font-sans !bg-blue-500/10 !border-blue-500/20 !text-blue-300">{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Projects = () => {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];
  
  const filteredProjects = filter === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 bg-surface text-center">
      <div className="max-w-5xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-display font-bold text-white mb-8"
        >
          Projects
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 mb-16 overflow-x-auto pb-4"
        >
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-display font-bold uppercase tracking-widest transition-all border shrink-0 ${filter === cat ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div 
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="glass-card overflow-hidden flex flex-col items-start p-6 text-left"
              >
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-white/5">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map(t => <span key={t} className="tag border-none !bg-white/5 !text-gray-400">{t}</span>)}
                </div>
                <div className="flex w-full gap-2 mt-auto">
                  <a href={project.demo} className="flex-1 py-2 text-xs font-bold text-center bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors">Live Demo</a>
                  <a href={project.github} className="flex-1 py-2 text-xs font-bold text-center bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">GitHub</a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const Experience = () => {
  const [view, setView] = useState<'timeline' | 'list'>('timeline');

  return (
    <section className="py-24 bg-surface text-center">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-16"
        >
          <h2 className="text-xl font-display font-bold text-white mb-6 uppercase tracking-widest opacity-80">Experience / Education</h2>
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10 backdrop-blur-sm">
            <button 
              onClick={() => setView('timeline')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-display font-bold uppercase transition-all ${view === 'timeline' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-400 hover:text-white'}`}
            >
              Timeline
            </button>
            <button 
              onClick={() => setView('list')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-display font-bold uppercase transition-all ${view === 'list' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-400 hover:text-white'}`}
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
                      <div className="text-blue-400 font-mono text-[10px] uppercase mb-1">
                        {'role' in item ? 'Experience' : 'Education'}
                      </div>
                      <h4 className="text-white font-bold text-sm">{'role' in item ? (item as any).role : (item as any).degree}</h4>
                      <div className="text-gray-400 text-xs mt-1">{'company' in item ? (item as any).company : (item as any).school}</div>
                      <div className="text-gray-500 text-[10px] mt-2 font-mono">{item.period}</div>
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
                    <div className={`w-1 h-12 rounded-full ${'role' in item ? 'bg-blue-500' : 'bg-purple-500'} shrink-0 mt-1`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-bold text-base">{'role' in item ? (item as any).role : (item as any).degree}</h4>
                      </div>
                      <div className="text-gray-400 text-sm">{'company' in item ? (item as any).company : (item as any).school}</div>
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
    <section className="py-24 bg-surface text-center">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-xl font-display font-bold text-white mb-12 uppercase tracking-widest opacity-80"
        >
          Achievements
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACHIEVEMENTS.slice(0, 3).map((ach, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-10 flex flex-col items-center justify-center text-center"
            >
              {idx === 0 ? <Code size={32} className="text-blue-400 mb-4" /> : idx === 1 ? <Cpu size={32} className="text-purple-400 mb-4" /> : <Award size={32} className="text-green-400 mb-4" />}
              <h4 className="text-white font-bold text-sm mb-1">{ach.title}</h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{ach.issuer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: false, email: false, message: false });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email),
      message: !formData.message.trim()
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).some(Boolean)) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <section id="contact" className="py-24 bg-surface text-center">
      <div className="max-w-xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-display font-bold text-white mb-12"
        >
          Contact
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 relative overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Name" 
                value={formData.name}
                onChange={(e) => {
                  setFormData({...formData, name: e.target.value});
                  if (errors.name) setErrors({...errors, name: false});
                }}
                className={`w-full px-6 py-4 rounded-xl bg-white/5 border ${errors.name ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'border-white/10'} text-white placeholder:text-gray-600 focus:outline-hidden focus:border-blue-500/50 transition-all text-sm group-hover:border-white/20`} 
              />
              {errors.name && <span className="absolute left-1 -bottom-4 text-[9px] text-red-500 font-bold uppercase tracking-wider">Name is required</span>}
            </div>
            <div className="relative group pt-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value});
                  if (errors.email) setErrors({...errors, email: false});
                }}
                className={`w-full px-6 py-4 rounded-xl bg-white/5 border ${errors.email ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'border-white/10'} text-white placeholder:text-gray-600 focus:outline-hidden focus:border-blue-500/50 transition-all text-sm group-hover:border-white/20`} 
              />
              {errors.email && <span className="absolute left-1 -bottom-4 text-[9px] text-red-500 font-bold uppercase tracking-wider">Please enter a valid email</span>}
            </div>
            <div className="relative group pt-2">
              <textarea 
                rows={4} 
                placeholder="Your Message..." 
                value={formData.message}
                onChange={(e) => {
                  setFormData({...formData, message: e.target.value});
                  if (errors.message) setErrors({...errors, message: false});
                }}
                className={`w-full px-6 py-4 rounded-xl bg-white/5 border ${errors.message ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'border-white/10'} text-white placeholder:text-gray-600 focus:outline-hidden focus:border-blue-500/50 transition-all text-sm resize-none group-hover:border-white/20`} 
              />
              {errors.message && <span className="absolute left-1 -bottom-4 text-[9px] text-red-500 font-bold uppercase tracking-wider">Message is required</span>}
            </div>
            <button 
              disabled={submitted}
              className="w-full py-4 rounded-xl bg-emerald-600 font-bold hover:bg-emerald-500 transition-all text-sm text-white shadow-lg shadow-emerald-600/20 disabled:bg-green-600/50 disabled:cursor-not-allowed"
            >
              {submitted ? 'Inquiry Received!' : 'Send Message'}
            </button>
          </form>
        </motion.div>
        <div className="flex justify-center gap-6 mt-12 opacity-60">
          <a href="#" className="text-white hover:opacity-100 transition-opacity"><Github size={24} /></a>
          <a href="#" className="text-white hover:opacity-100 transition-opacity"><Linkedin size={24} /></a>
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
          className="fixed bottom-8 right-8 z-[100] p-4 bg-emerald-600 text-white rounded-full shadow-2xl shadow-emerald-600/40 hover:bg-emerald-500 transition-all group"
          aria-label="Back to top"
        >
          <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <div className="selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Achievements />
      <Contact />
      <BackToTop />
    </div>
  );
}



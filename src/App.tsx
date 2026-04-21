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
  X
} from 'lucide-react';
import { PROJECTS, SKILLS, EXPERIENCE, EDUCATION, ACHIEVEMENTS } from './constants';

const BentoCard = ({ children, className = '', title, icon: Icon }: { children: React.ReactNode, className?: string, title?: string, icon?: any }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className={`bento-card ${className}`}
  >
    {title && (
      <div className="card-title-bento">
        {Icon && <Icon size={14} className="text-accent" />}
        <span>{title}</span>
      </div>
    )}
    {children}
  </motion.div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Portfolio', href: '#' },
    { name: 'Projects', href: '#' },
    { name: 'Experience', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-surface/80 backdrop-blur-md py-4 border-b border-border-dim' : 'bg-transparent py-6'}`}>
      <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
        <a href="#" className="text-xl font-display font-bold">
          Sudarshan<span className="text-accent">.</span>
        </a>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-xs font-mono uppercase tracking-widest text-text-dim hover:text-white transition-colors">
              {link.name}
            </a>
          ))}
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default function App() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Web', 'Backend', 'AI'];
  
  const filteredProjects = filter === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === filter);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-12 md:grid-rows-[auto_auto_auto_auto] gap-4">
        
        {/* HERO SECTION */}
        <BentoCard className="md:col-span-8 md:row-span-1 flex flex-col justify-center bg-[radial-gradient(circle_at_top_right,var(--color-accent-glow),transparent)] min-h-[300px]">
          <div className="card-title-bento flex items-center gap-2">
            <span className="text-accent">✧</span>
            <span>Available for opportunities</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent">
            Sudarshan
          </h1>
          <p className="text-lg text-text-dim max-w-2xl leading-relaxed mb-8">
            B.Tech Computer Science Student specializing in Python architecture 
            and scalable software engineering. I build systems that solve real-world problems.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#projects" className="bg-accent text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
              View Projects
            </a>
            <button className="bg-white/5 border border-border-dim px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors">
              Resume
            </button>
          </div>
        </BentoCard>

        {/* SKILLS SECTION */}
        <BentoCard title="Technical Stack" icon={Cpu} className="md:col-span-4 md:row-span-1">
          <div className="flex flex-wrap mt-2">
            {[...SKILLS.languages, ...SKILLS.technologies, ...SKILLS.tools].slice(0, 12).map(skill => (
              <span key={skill.name} className="skill-tag-bento">{skill.name}</span>
            ))}
          </div>
        </BentoCard>

        {/* EXPERIENCE SECTION */}
        <BentoCard title="Experience" icon={Briefcase} className="md:col-span-4 md:row-span-2">
          <div className="mt-4 space-y-6">
            {EXPERIENCE.map((exp, idx) => (
              <div key={idx} className="relative pl-6 border-l border-border-dim group">
                <div className="absolute -left-1 top-0 w-2 h-2 bg-accent rounded-full" />
                <div className="text-[10px] font-mono text-accent mb-1 uppercase">{exp.period}</div>
                <div className="text-sm font-semibold text-white">{exp.role}</div>
                <div className="text-xs text-text-dim mb-2">{exp.company}</div>
              </div>
            ))}
            {EDUCATION.map((edu, idx) => (
              <div key={idx} className="relative pl-6 border-l border-border-dim group">
                <div className="absolute -left-1 top-0 w-2 h-2 bg-purple-500 rounded-full" />
                <div className="text-[10px] font-mono text-purple-400 mb-1 uppercase">{edu.period}</div>
                <div className="text-sm font-semibold text-white">{edu.degree}</div>
                <div className="text-xs text-text-dim">{edu.school}</div>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* PROJECTS SECTION */}
        <div className="md:col-span-8 md:row-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProjects.slice(0, 2).map((project) => (
            <div key={project.id} className="bento-card flex flex-col justify-between group">
              <div>
                <div className="card-title-bento">Featured Project</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
                <p className="text-xs text-text-dim leading-relaxed">{project.description}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span key={t} className="tech-pill-bento">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* STATS SECTION */}
        <BentoCard className="md:col-span-4 md:row-span-1 grid grid-cols-2 gap-3 !p-3">
          <div className="bg-white/2 border border-border-dim rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-accent">12+</div>
            <div className="text-[10px] text-text-dim uppercase">Projects</div>
          </div>
          <div className="bg-white/2 border border-border-dim rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-accent">400+</div>
            <div className="text-[10px] text-text-dim uppercase">Commits</div>
          </div>
          <div className="bg-white/2 border border-border-dim rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-accent">5</div>
            <div className="text-[10px] text-text-dim uppercase">Awards</div>
          </div>
          <div className="bg-white/2 border border-border-dim rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-accent">100%</div>
            <div className="text-[10px] text-text-dim uppercase">Dedication</div>
          </div>
        </BentoCard>

        {/* CONTACT SECTION */}
        <BentoCard title="Get In Touch" icon={Mail} className="md:col-span-4 md:row-span-1 flex flex-col justify-center gap-3">
          <a href="#" className="flex items-center gap-3 text-sm text-white bg-white/3 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <Mail size={16} className="text-accent" />
            <span>sudarshan@cs.edu</span>
          </a>
          <a href="#" className="flex items-center gap-3 text-sm text-white bg-white/3 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <Linkedin size={16} className="text-accent" />
            <span>linkedin/sudarshan-dev</span>
          </a>
          <a href="#" className="flex items-center gap-3 text-sm text-white bg-white/3 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <Github size={16} className="text-accent" />
            <span>github/sudarshan-python</span>
          </a>
        </BentoCard>

      </div>

      <footer className="max-w-[1240px] mx-auto mt-12 py-6 border-t border-border-dim flex justify-between items-center text-[10px] font-mono text-text-dim uppercase tracking-widest">
        <div>© 2026 Sudarshan</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Dribbble</a>
        </div>
      </footer>
    </div>
  );
}



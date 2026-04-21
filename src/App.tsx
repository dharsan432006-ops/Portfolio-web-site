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

const Navbar = () => (
  <nav className="absolute top-0 left-0 right-0 z-50 py-8">
    <div className="max-w-7xl mx-auto px-6">
      <a href="#" className="text-sm font-bold tracking-widest text-white uppercase opacity-80 hover:opacity-100 transition-opacity">
        Sudarshan
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
      SUDARSHAN
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
  const allSkills = [...SKILLS.languages, ...SKILLS.technologies, ...SKILLS.tools].map(s => s.name);
  return (
    <section id="about" className="py-24 bg-surface relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-xl font-bold text-white mb-8">About</h2>
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-8">
          <div className="glass-card p-8">
            <p className="text-gray-400 leading-relaxed text-sm">
              I am a passionate B.Tech Computer Science student at Anna University, 
              deeply interested in the intersection of algorithms, software engineering, 
              and artificial intelligence. As a Python developer at heart, I love tackling 
              complex problems and turning them into elegant pieces of code.
            </p>
          </div>
          <div className="glass-card p-8 flex flex-wrap gap-2 h-fit">
            {allSkills.slice(0, 10).map(skill => (
              <span key={skill} className="tag">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-24 bg-surface text-center">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-white mb-16">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <motion.div 
              key={project.id}
              whileHover={{ y: -5 }}
              className="glass-card overflow-hidden flex flex-col items-start p-6 text-left"
            >
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-white/5">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
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
        </div>
      </div>
    </section>
  );
};

const Experience = () => {
  return (
    <section className="py-24 bg-surface text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-xl font-bold text-white mb-16 uppercase tracking-widest opacity-80">Experience / Education</h2>
        <div className="relative pt-12">
          <div className="timeline-line" />
          <div className="relative mb-20">
            <div className="text-xs font-mono text-gray-500 mb-8 tracking-widest uppercase">Timeline</div>
            <div className="flex flex-col items-center">
              <div className="timeline-dot top-20" />
              <div className="mt-24 text-left glass-card p-6 inline-block max-w-sm">
                <div className="text-blue-400 font-mono text-[10px] uppercase mb-1">Education</div>
                <h4 className="text-white font-bold text-sm">B.Tech Computer Science</h4>
                <div className="text-gray-500 text-xs mt-1">Anna University (2022—2026)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Achievements = () => {
  return (
    <section className="py-24 bg-surface text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-xl font-bold text-white mb-12 uppercase tracking-widest opacity-80">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACHIEVEMENTS.slice(0, 3).map((ach, idx) => (
            <div key={idx} className="glass-card p-10 flex flex-col items-center justify-center text-center">
              {idx === 0 ? <Code size={32} className="text-blue-400 mb-4" /> : idx === 1 ? <Cpu size={32} className="text-purple-400 mb-4" /> : <Award size={32} className="text-green-400 mb-4" />}
              <h4 className="text-white font-bold text-sm mb-1">{ach.title}</h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{ach.issuer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-surface text-center">
      <div className="max-w-xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-white mb-12">Contact</h2>
        <div className="glass-card p-8 md:p-12">
          <form className="space-y-4">
            <input type="text" placeholder="Name" className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-hidden focus:border-blue-500/50 transition-all text-sm" />
            <input type="email" placeholder="Email" className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-hidden focus:border-blue-500/50 transition-all text-sm" />
            <textarea rows={4} placeholder="Message" className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-hidden focus:border-blue-500/50 transition-all text-sm resize-none" />
            <button className="w-full py-4 rounded-xl bg-blue-600 font-bold hover:bg-blue-500 transition-all text-sm text-white shadow-lg shadow-blue-600/20">Contact</button>
          </form>
        </div>
        <div className="flex justify-center gap-6 mt-12 opacity-60">
          <a href="#" className="text-white hover:opacity-100 transition-opacity"><Github size={24} /></a>
          <a href="#" className="text-white hover:opacity-100 transition-opacity"><Linkedin size={24} /></a>
        </div>
      </div>
    </section>
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
    </div>
  );
}



import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, LogOut, X, Camera, Plus, Trash2, 
  Save, Edit3, Link as LinkIcon, Github as GithubIcon, 
  ExternalLink, Code, Layers, Info, ChevronRight,
  AlertTriangle, Loader2, Image as ImageIcon,
  Layout, Briefcase, Terminal, Database, Shield
} from 'lucide-react';
import { 
  auth, login, logout, getProfile, updateProfile, 
  getProjects, updateProject, createProject, deleteProject 
} from '../../lib/firebase.ts';
import { onAuthStateChanged, User } from 'firebase/auth';

// --- Types ---
interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  category: string;
  images: string[];
  codeSnippet: string;
  order?: number;
}

interface Profile {
  name: string;
  role: string;
  photo: string;
  summary: string;
}

// --- Components ---

const AdminModal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#0f0f12] border border-white/10 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div>
                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest block mb-1">Subsystem: Operational</span>
                <h3 className="text-xl font-display font-bold text-white tracking-tight">{title}</h3>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-all text-white border border-white/5">
              <X size={20} />
            </button>
          </div>
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#0f0f12]">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const FormLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1 italic">{children}</label>
);

const AdminInput = ({ icon: Icon, ...props }: any) => (
  <div className="relative group">
    {Icon && <Icon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-accent transition-colors" />}
    <input 
      {...props}
      className={`w-full bg-white/[0.02] border border-white/10 rounded-2xl ${Icon ? 'pl-14' : 'px-6'} py-4 text-sm text-white focus:border-accent/40 focus:bg-white/[0.04] outline-none transition-all placeholder:text-gray-700 font-sans`} 
    />
  </div>
);

const ProjectForm = ({ 
  project, 
  onSave, 
  onCancel, 
  isLoading 
}: { 
  project?: Partial<Project>; 
  onSave: (data: any) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState<Partial<Project>>(project || {
    title: '',
    description: '',
    category: 'AI',
    tech: [],
    github: '',
    demo: '#',
    images: [''],
    codeSnippet: ''
  });

  const [techInput, setTechInput] = useState(formData.tech?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = techInput.split(',').map(s => s.trim()).filter(Boolean);
    onSave({ ...formData, tech: techArray });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <FormLabel>Module Title</FormLabel>
          <AdminInput 
            value={formData.title}
            onChange={(e: any) => setFormData({...formData, title: e.target.value})}
            placeholder="Neural Nexus..."
            required
          />
        </div>
        <div className="space-y-1">
          <FormLabel>Tier Classification</FormLabel>
          <div className="relative">
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-accent/40 focus:bg-white/[0.04] outline-none transition-all appearance-none cursor-pointer"
              >
                {['AI', 'Web', 'Mobile', 'Tools', 'Blockchain', 'Creative'].map(cat => (
                  <option key={cat} value={cat} className="bg-[#0f0f12]">{cat}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-gray-600 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <FormLabel>Documentation / Overview</FormLabel>
        <textarea 
          required
          rows={6}
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          placeholder="Enter project metrics and architectural overview..."
          className="w-full bg-white/[0.02] border border-white/10 rounded-[32px] px-8 py-6 text-sm text-gray-300 focus:border-accent/40 focus:bg-white/[0.04] outline-none transition-all resize-none placeholder:text-gray-700"
        />
      </div>

      <div className="space-y-1">
        <FormLabel>Logic Libraries (Separated by Comma)</FormLabel>
        <AdminInput 
          icon={Layers}
          value={techInput}
          onChange={(e: any) => setTechInput(e.target.value)}
          placeholder="React, PyTorch..."
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <FormLabel>Source Control</FormLabel>
          <AdminInput 
            icon={GithubIcon}
            value={formData.github}
            onChange={(e: any) => setFormData({...formData, github: e.target.value})}
            placeholder="github.com/..."
          />
        </div>
        <div className="space-y-1">
          <FormLabel>Live Endpoint</FormLabel>
          <AdminInput 
            icon={ExternalLink}
            value={formData.demo}
            onChange={(e: any) => setFormData({...formData, demo: e.target.value})}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-1">
        <FormLabel>Primary Visual Matrix (URL)</FormLabel>
        <AdminInput 
          icon={ImageIcon}
          value={formData.images?.[0]}
          onChange={(e: any) => setFormData({...formData, images: [e.target.value, ...(formData.images?.slice(1) || [])]})}
          placeholder="https://images.unsplash..."
        />
      </div>

      <div className="space-y-1">
        <FormLabel>Core Algorithm Snippet (JS/TS)</FormLabel>
        <textarea 
          rows={8}
          value={formData.codeSnippet}
          onChange={e => setFormData({...formData, codeSnippet: e.target.value})}
          placeholder="// Paste high-impact logic here..."
          className="w-full bg-[#08080a] border border-white/10 rounded-[32px] px-8 py-6 text-[12px] text-accent font-mono focus:border-accent/40 outline-none transition-all resize-none shadow-inner"
        />
      </div>

      <div className="flex items-center gap-4 pt-8 border-t border-white/5">
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex-1 bg-accent text-white py-5 rounded-[24px] font-bold uppercase tracking-[0.2em] text-[11px] shadow-[0_15px_30px_rgba(255,82,82,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {project ? 'Commit Patch' : 'Execute Initialization'}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="px-10 py-5 border border-white/10 rounded-[24px] text-gray-500 hover:text-white hover:bg-white/5 transition-all font-bold text-[11px] uppercase tracking-[0.2em]"
        >
          Abort
        </button>
      </div>
    </form>
  );
};

// --- Main Panel ---

export const AdminPanel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'projects'>('profile');
  const [loading, setLoading] = useState(false);

  // States
  const [profile, setProfile] = useState<Profile>({
    name: '',
    role: '',
    photo: '',
    summary: ''
  });
  const [projects, setProjects] = useState<Project[]>([]);
  
  // UI States
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
      if (currUser) loadSystemState();
    });
    return () => unsubscribe();
  }, []);

  const loadSystemState = async () => {
    setLoading(true);
    try {
      const [pData, projs] = await Promise.all([getProfile(), getProjects()]);
      if (pData) setProfile(pData as Profile);
      if (projs) setProjects(projs as Project[]);
    } catch (err) {
      console.error("System Fault:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profile);
      alert('SUCCESS: Global identity parameters synchronized.');
    } catch (err) {
      console.error(err);
      alert('FAULT: Authorization denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSync = async (data: any) => {
    setLoading(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
      } else {
        const id = data.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        await createProject({ ...data, id, order: projects.length });
      }
      await loadSystemState();
      setEditingProject(null);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert('FAULT: Write operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteProject(id);
      await loadSystemState();
      setIsDeleting(null);
    } catch (err) {
      console.error(err);
      alert('FAULT: Delete operation rejected.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <button 
        onClick={() => login()}
        className="fixed bottom-12 right-12 z-[4000] p-1.5 bg-white/[0.05] backdrop-blur-3xl border border-white/10 rounded-[30px] hover:scale-110 active:scale-95 transition-all shadow-2xl group flex items-center pr-8"
      >
        <div className="w-14 h-14 bg-accent text-white rounded-[26px] flex items-center justify-center shadow-lg">
          <Shield size={24} className="group-hover:rotate-90 transition-transform duration-500" />
        </div>
        <div className="ml-5 text-left">
            <span className="block text-[8px] font-mono font-bold text-gray-500 uppercase tracking-[0.3em] mb-1">Terminal</span>
            <span className="block text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap">Restricted Access</span>
        </div>
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-12 right-12 z-[4000] p-1.5 bg-accent/10 backdrop-blur-3xl border border-accent/20 rounded-[30px] hover:scale-110 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,82,82,0.2)] group flex items-center pr-8"
      >
        <div className="w-14 h-14 bg-accent text-white rounded-[26px] flex items-center justify-center shadow-[0_10px_20px_rgba(255,82,82,0.3)]">
          <Terminal size={24} className="group-hover:rotate-180 transition-transform duration-700" />
        </div>
        <div className="ml-5 text-left">
            <span className="block text-[8px] font-mono font-bold text-accent uppercase tracking-[0.3em] mb-1">Pulse Online</span>
            <span className="block text-[10px] font-bold text-white uppercase tracking-widest">Admin Control</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[4500] bg-[#050505]/98 backdrop-blur-2xl flex items-center justify-center p-4 lg:p-16"
          >
            <motion.div 
              initial={{ scale: 0.98, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 20 }}
              className="bg-[#0a0a0c] border border-white/5 w-full max-w-7xl h-[90vh] rounded-[50px] overflow-hidden flex flex-col shadow-[0_0_120px_rgba(0,0,0,0.8)]"
            >
              {/* Architecture: Split Screen Management */}
              <div className="flex h-full overflow-hidden">
                
                {/* Navigation Rail - Vertical */}
                <div className="w-80 border-r border-white/5 bg-white/[0.01] p-12 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-px h-full bg-linear-to-b from-transparent via-white/10 to-transparent" />
                  
                  <div className="space-y-16">
                    <div className="pl-2">
                        <div className="text-3xl font-display font-bold text-white tracking-tighter flex items-center gap-3">
                            <span className="text-accent underline decoration-accent/20">Control</span>
                            <span className="opacity-20 italic font-serif">Center</span>
                        </div>
                        <div className="text-[10px] font-mono text-gray-600 font-bold uppercase tracking-[0.4em] mt-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Secure Environment
                        </div>
                    </div>

                    <nav className="space-y-3">
                      {[
                        { id: 'profile', icon: Database, label: 'Identity Matrix' },
                        { id: 'projects', icon: Briefcase, label: 'Project Registry' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id as any)}
                          className={`w-full flex items-center gap-5 px-8 py-5 rounded-[28px] text-[11px] font-bold uppercase tracking-[0.2em] transition-all group relative overflow-hidden ${
                            activeTab === item.id 
                            ? 'bg-accent text-white shadow-xl shadow-accent/20' 
                            : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
                          }`}
                        >
                          <item.icon size={20} className={activeTab === item.id ? '' : 'group-hover:scale-110 transition-transform'} />
                          {item.label}
                          {activeTab === item.id && (
                              <motion.div layoutId="nav-glow" className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="space-y-10">
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] flex flex-col items-center text-center shadow-inner">
                        <div className="relative mb-4 group">
                            <img src={user.photoURL || ''} alt="" className="w-18 h-18 rounded-full border-2 border-accent/20 group-hover:scale-105 transition-transform" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0a0a0c] rounded-full" />
                        </div>
                        <p className="text-[11px] font-bold text-white uppercase tracking-widest">{user.displayName || 'Authorized'}</p>
                        <p className="text-[9px] text-gray-500 font-medium truncate w-full mt-2 font-mono">{user.email}</p>
                    </div>
                    <button 
                      onClick={logout} 
                      className="w-full flex items-center justify-center gap-4 px-8 py-5 rounded-[28px] text-[11px] font-bold uppercase tracking-widest text-red-500/80 hover:text-red-500 hover:bg-red-500/5 transition-all border border-red-500/10"
                    >
                      <LogOut size={18} />
                      Purge Session
                    </button>
                  </div>
                </div>

                {/* Dashboard Viewport */}
                <div className="flex-1 flex flex-col bg-linear-to-br from-transparent via-white/[0.01] to-transparent">
                  <header className="p-12 pb-6 flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-display font-bold text-white capitalize tracking-tighter">{activeTab}</h1>
                            <span className="px-3 py-1 bg-white/5 rounded text-[9px] font-mono text-gray-500 uppercase tracking-widest">Live</span>
                        </div>
                        <p className="text-gray-600 text-sm italic font-serif">Synchronizing live data with operational parameters.</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-full transition-all text-white border border-white/5 shadow-lg">
                      <X size={24} />
                    </button>
                  </header>

                  <main className="flex-1 overflow-y-auto p-12 pt-6 custom-scrollbar">
                    {activeTab === 'profile' && (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                        <form onSubmit={handleProfileUpdate} className="max-w-3xl space-y-12">
                          <div className="flex items-start gap-12 bg-white/[0.01] p-10 rounded-[50px] border border-white/5 shadow-inner">
                            <div className="relative group">
                              <div className="w-48 h-48 rounded-[44px] overflow-hidden border border-white/10 bg-[#0f0f12] relative shadow-2xl">
                                {profile.photo ? (
                                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-800"><Camera size={60} /></div>
                                )}
                                <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="absolute -bottom-4 -right-4 p-5 bg-accent text-white rounded-[24px] shadow-2xl hover:scale-110 active:scale-95 transition-all">
                                <Camera size={20} />
                              </div>
                            </div>
                            <div className="flex-1 space-y-8 pt-4">
                              <div className="space-y-2">
                                <FormLabel>Global Alias</FormLabel>
                                <AdminInput 
                                  value={profile.name}
                                  onChange={(e: any) => setProfile({...profile, name: e.target.value})}
                                  placeholder="Full Name"
                                />
                              </div>
                              <div className="space-y-2">
                                <FormLabel>Operational Role</FormLabel>
                                <AdminInput 
                                  value={profile.role}
                                  onChange={(e: any) => setProfile({...profile, role: e.target.value})}
                                  placeholder="Software Engineer..."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <FormLabel>Professional Narrative / Bio</FormLabel>
                            <textarea 
                              rows={7}
                              value={profile.summary}
                              onChange={e => setProfile({...profile, summary: e.target.value})}
                              placeholder="Describe your architectural journey..."
                              className="w-full bg-white/[0.01] border border-white/5 rounded-[40px] px-10 py-8 text-sm text-gray-300 focus:border-accent/30 focus:bg-white/[0.03] outline-none transition-all resize-none placeholder:text-gray-800" 
                            />
                          </div>

                          <div className="space-y-2">
                            <FormLabel>Visual CDN Route (Avatar)</FormLabel>
                            <AdminInput 
                                icon={ImageIcon}
                                value={profile.photo}
                                onChange={(e: any) => setProfile({...profile, photo: e.target.value})}
                                placeholder="https://..."
                            />
                          </div>

                          <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-white text-black px-14 py-6 rounded-[30px] font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-accent hover:text-white transition-all transform hover:-translate-y-2 shadow-2xl flex items-center gap-4 disabled:opacity-50"
                          >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            Synchronize Matrix
                          </button>
                        </form>
                      </motion.div>
                    )}

                    {activeTab === 'projects' && (
                      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                        <div className="flex justify-between items-center bg-white/[0.02] p-10 rounded-[50px] border border-white/5 shadow-inner">
                          <div>
                            <h3 className="text-white font-bold text-2xl tracking-tight">System Registry</h3>
                            <p className="text-gray-600 text-sm mt-2 italic font-serif">Deployment logs and prototype configuration.</p>
                          </div>
                          <button 
                            onClick={() => setIsCreating(true)}
                            className="flex items-center gap-4 px-10 py-5 bg-accent text-white rounded-[28px] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,82,82,0.3)] font-bold text-[11px] uppercase tracking-[0.3em]"
                          >
                            <Plus size={20} /> Initialize New
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          {projects.map((proj, idx) => (
                            <motion.div 
                                key={proj.id} 
                                layout
                                className="p-10 bg-white/[0.01] border border-white/5 rounded-[50px] flex items-center justify-between group hover:border-accent/20 hover:bg-white/[0.03] transition-all relative overflow-hidden"
                            >
                              <div className="absolute top-10 left-10 opacity-5 pointer-events-none">
                                  <span className="text-7xl font-mono font-black text-white italic">{idx + 1}</span>
                              </div>
                              <div className="flex items-center gap-10 relative z-10">
                                <div className="w-28 h-28 rounded-[40px] overflow-hidden bg-white/5 border border-white/10 relative shadow-2xl">
                                    <img src={proj.images[0]} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" alt="" />
                                    <div className="absolute inset-0 bg-linear-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="space-y-4">
                                  <h4 className="text-2xl font-bold text-white group-hover:text-accent transition-colors tracking-tighter">{proj.title}</h4>
                                  <div className="flex flex-wrap gap-2">
                                     <span className="text-[10px] font-mono font-bold text-gray-500 uppercase px-4 py-1.5 bg-white/5 rounded-xl border border-white/5">{proj.category}</span>
                                     <span className="text-[10px] font-mono font-bold text-accent uppercase px-4 py-1.5 bg-accent/5 rounded-xl border border-accent/10">{proj.tech.slice(0, 3).join(' • ')} {proj.tech.length > 3 ? `+${proj.tech.length - 3}` : ''}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 pr-4">
                                 <button 
                                    onClick={() => setEditingProject(proj)}
                                    className="p-5 bg-white/[0.02] text-gray-500 hover:text-white hover:bg-white/10 rounded-[28px] transition-all border border-white/5 shadow-lg" 
                                    title="Edit Protocol"
                                  >
                                   <Edit3 size={22} />
                                 </button>
                                 <button 
                                    onClick={() => setIsDeleting(proj.id)}
                                    className="p-5 bg-white/[0.02] text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-[28px] transition-all border border-white/5 shadow-lg" 
                                    title="Terminate Record"
                                  >
                                   <Trash2 size={22} />
                                 </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </main>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Operation Confirmations --- */}

      <AdminModal 
        isOpen={!!isDeleting} 
        onClose={() => setIsDeleting(null)} 
        title="Execute Purge"
      >
        <div className="flex flex-col items-center text-center space-y-10 py-10">
            <div className="w-32 h-32 bg-red-500/10 rounded-[50px] flex items-center justify-center text-red-500 relative shadow-2xl">
                <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse" />
                <AlertTriangle size={60} className="relative z-10" />
            </div>
            <div className="space-y-4">
                <p className="text-white font-bold text-3xl tracking-tighter">Terminate Project Record?</p>
                <p className="text-gray-500 text-base max-w-sm leading-relaxed italic font-serif">This will permanently de-fragment the project from our live registry. This action is irreversible.</p>
            </div>
            <div className="flex gap-5 w-full">
                <button 
                    onClick={() => isDeleting && executeDelete(isDeleting)}
                    disabled={loading}
                    className="flex-1 py-5 bg-red-500 text-white font-bold text-[12px] uppercase tracking-widest rounded-3xl hover:bg-red-600 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
                >
                    {loading ? <Loader2 size={24} className="animate-spin mx-auto" /> : 'Execute Absolute Deletion'}
                </button>
                <button 
                    onClick={() => setIsDeleting(null)}
                    className="flex-1 py-5 bg-white/5 text-gray-500 font-bold text-[12px] uppercase tracking-widest rounded-3xl hover:bg-white/10 transition-all font-mono"
                >
                    Abort
                </button>
            </div>
        </div>
      </AdminModal>

      <AdminModal 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)} 
        title="Operational initialization"
      >
        <ProjectForm 
          onSave={handleProjectSync}
          onCancel={() => setIsCreating(false)}
          isLoading={loading}
        />
      </AdminModal>

      <AdminModal 
        isOpen={!!editingProject} 
        onClose={() => setEditingProject(null)} 
        title={`Edit Config: ${editingProject?.title}`}
      >
        {editingProject && (
          <ProjectForm 
            project={editingProject}
            onSave={handleProjectSync}
            onCancel={() => setEditingProject(null)}
            isLoading={loading}
          />
        )}
      </AdminModal>
    </>
  );
};

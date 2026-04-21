import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, LogOut, X, Camera, Plus, Trash2, 
  Save, Edit3, Link as LinkIcon, Github as GithubIcon, 
  ExternalLink, Code, Layers, MessageCircle, Info, ChevronRight,
  AlertTriangle, Loader2
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

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[4000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#0f0f12] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-display font-bold text-white">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Project Title</label>
          <input 
            required
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-accent/50 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
          <select 
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-accent/50 outline-none transition-colors appearance-none"
          >
            <option value="AI">AI</option>
            <option value="Web">Web</option>
            <option value="Mobile">Mobile</option>
            <option value="Tools">Tools</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Description (Markdown Supported)</label>
        <textarea 
          required
          rows={4}
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent/50 outline-none transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tech Stack (comma separated)</label>
        <input 
          value={techInput}
          onChange={e => setTechInput(e.target.value)}
          placeholder="React, TypeScript, Firebase..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-accent/50 outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">GitHub URL</label>
          <div className="relative">
            <GithubIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              value={formData.github}
              onChange={e => setFormData({...formData, github: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-accent/50 outline-none transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Demo URL</label>
          <div className="relative">
            <ExternalLink size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              value={formData.demo}
              onChange={e => setFormData({...formData, demo: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-accent/50 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Primary Image URL</label>
        <input 
          value={formData.images?.[0]}
          onChange={e => setFormData({...formData, images: [e.target.value]})}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-accent/50 outline-none transition-colors"
        />
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {project ? 'Save Changes' : 'Create Project'}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 transition-colors font-bold text-xs uppercase tracking-widest"
        >
          Cancel
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
  const [mounted, setMounted] = useState(false);

  // States for list and forms
  const [profile, setProfile] = useState<Profile>({
    name: '',
    role: '',
    photo: '',
    summary: ''
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
      if (currUser) loadData();
    });
    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [pData, projs] = await Promise.all([getProfile(), getProjects()]);
    if (pData) setProfile(pData as Profile);
    if (projs) setProjects(projs as Project[]);
    setLoading(false);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profile);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = async (data: any) => {
    setLoading(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
      } else {
        const id = data.title.toLowerCase().replace(/ /g, '-');
        await createProject({ ...data, id, order: projects.length });
      }
      await loadData();
      setEditingProject(null);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save project.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteProject(id);
      await loadData();
      setIsDeleting(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete project.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (!user) {
    return (
      <button 
        onClick={() => login()}
        className="fixed bottom-8 right-32 z-50 p-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full hover:bg-white/10 transition-all text-white shadow-2xl"
        title="Admin Login"
      >
        <Settings size={20} className="hover:rotate-90 transition-transform duration-500" />
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-32 z-50 p-4 bg-accent text-white rounded-full shadow-[0_0_20px_var(--color-accent)] hover:scale-110 active:scale-95 transition-all"
      >
        <Settings size={20} className="hover:rotate-90 transition-transform duration-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-10"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#08080a] border border-white/5 w-full max-w-5xl h-[85vh] rounded-[40px] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Layout Sidebar + Content */}
              <div className="flex h-full overflow-hidden">
                {/* Sidebar Navigation */}
                <div className="w-64 border-right border-white/5 bg-white/[0.02] p-8 flex flex-col justify-between">
                  <div>
                    <div className="mb-10 pl-2">
                        <div className="text-xl font-display font-bold text-white tracking-tight">Admin<span className="text-accent">Panel</span></div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Management Console</div>
                    </div>
                    <nav className="space-y-1">
                      {[
                        { id: 'profile', icon: Info, label: 'Bio & Identity' },
                        { id: 'projects', icon: Layers, label: 'Project Lab' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id as any)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                            activeTab === item.id 
                            ? 'bg-accent text-white shadow-[0_10px_20px_rgba(255,82,82,0.1)]' 
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <item.icon size={16} />
                          {item.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-white/10" />
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-bold text-white truncate">{user.displayName || 'Developer'}</p>
                            <p className="text-[8px] text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button 
                      onClick={logout} 
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={16} />
                      Terminate
                    </button>
                  </div>
                </div>

                {/* Main Viewport */}
                <div className="flex-1 flex flex-col bg-white/[0.01]">
                  <div className="p-8 pb-4 flex justify-between items-center bg-gradient-to-b from-[#08080a] to-transparent">
                    <h1 className="text-2xl font-display font-bold text-white capitalize">{activeTab}</h1>
                    <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {activeTab === 'profile' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <form onSubmit={handleProfileSave} className="max-w-xl space-y-10">
                          <div className="flex items-start gap-8">
                            <div className="relative group">
                              <div className="w-32 h-32 rounded-[32px] overflow-hidden border-2 border-white/5 bg-white/5">
                                {profile.photo ? (
                                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700"><Camera size={40} /></div>
                                )}
                              </div>
                              <div className="absolute -bottom-2 -right-2 p-2 bg-accent text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                <Camera size={16} />
                              </div>
                            </div>
                            <div className="flex-1 space-y-5">
                              <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Name</label>
                                <input 
                                  value={profile.name}
                                  onChange={e => setProfile({...profile, name: e.target.value})}
                                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-accent/30 outline-none transition-all" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Headline</label>
                                <input 
                                  value={profile.role}
                                  onChange={e => setProfile({...profile, role: e.target.value})}
                                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-accent/30 outline-none transition-all" 
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Professional Summary</label>
                            <textarea 
                              rows={5}
                              value={profile.summary}
                              onChange={e => setProfile({...profile, summary: e.target.value})}
                              className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] px-5 py-4 text-white focus:border-accent/30 outline-none transition-all resize-none" 
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Avatar CDN URL</label>
                            <input 
                              value={profile.photo}
                              onChange={e => setProfile({...profile, photo: e.target.value})}
                              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-accent/30 outline-none transition-all text-gray-400 text-sm" 
                            />
                          </div>

                          <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-white text-black px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-all transform hover:-translate-y-1 shadow-2xl flex items-center gap-2"
                          >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Synchronize Profile
                          </button>
                        </form>
                      </motion.div>
                    )}

                    {activeTab === 'projects' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-white font-bold">Active Projects</h3>
                            <p className="text-gray-500 text-xs">Manage your portfolio showcase items</p>
                          </div>
                          <button 
                            onClick={() => setIsCreating(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent/20 text-accent rounded-[18px] hover:bg-accent hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest"
                          >
                            <Plus size={16} /> Initiate New Record
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                          {projects.map((proj) => (
                            <div key={proj.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-accent/20 hover:bg-white/[0.04] transition-all">
                              <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                                    <img src={proj.images[0]} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt="" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-bold text-white group-hover:text-accent transition-colors">{proj.title}</h4>
                                  <div className="flex flex-wrap gap-2">
                                     <span className="text-[8px] font-bold text-gray-500 uppercase px-2 py-0.5 bg-white/5 rounded-sm">{proj.category}</span>
                                     <span className="text-[8px] font-bold text-accent uppercase px-2 py-0.5 bg-accent/5 rounded-sm">{proj.tech.length} Techs</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 origin-right">
                                 <button 
                                    onClick={() => setEditingProject(proj)}
                                    className="p-3 bg-white/5 text-gray-400 hover:text-white hover:bg-accent rounded-xl transition-all" 
                                    title="Edit"
                                  >
                                   <Edit3 size={16} />
                                 </button>
                                 <button 
                                    onClick={() => setIsDeleting(proj.id)}
                                    className="p-3 bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all" 
                                    title="Delete"
                                  >
                                   <Trash2 size={16} />
                                 </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Modals for CRUD --- */}

      {/* Confirmation Modal */}
      <Modal 
        isOpen={!!isDeleting} 
        onClose={() => setIsDeleting(null)} 
        title="Confirm Deletion"
      >
        <div className="flex flex-col items-center text-center space-y-6 pt-4">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
                <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
                <p className="text-white font-bold text-lg">Are you sure?</p>
                <p className="text-gray-500 text-sm">This project record will be permanently purged from the cloud storage. This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 w-full pt-4">
                <button 
                    onClick={() => isDeleting && handleDelete(isDeleting)}
                    className="flex-1 py-4 bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-red-600 transition-colors"
                >
                    Confirm Purge
                </button>
                <button 
                    onClick={() => setIsDeleting(null)}
                    className="flex-1 py-4 bg-white/5 text-gray-400 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
      </Modal>

      {/* Create Modal */}
      <Modal 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)} 
        title="Initiate New Record"
      >
        <ProjectForm 
          onSave={handleSaveProject}
          onCancel={() => setIsCreating(false)}
          isLoading={loading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={!!editingProject} 
        onClose={() => setEditingProject(null)} 
        title="Modify Existing Record"
      >
        {editingProject && (
          <ProjectForm 
            project={editingProject}
            onSave={handleSaveProject}
            onCancel={() => setEditingProject(null)}
            isLoading={loading}
          />
        )}
      </Modal>
    </>
  );
};

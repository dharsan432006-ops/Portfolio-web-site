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
  getProjects, updateProject, createProject, deleteProject,
  subscribeToCollection, updateDocGeneric, createDocGeneric, deleteDocGeneric,
  subscribeToConfig, updateConfig
} from '../../lib/firebase.ts';
import { onAuthStateChanged, User } from 'firebase/auth';

// --- Types ---
interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  tags: string[];
  github: string;
  demo: string;
  category: string;
  images: string[];
  codeSnippet: string;
  order: number;
  videoUrl?: string;
}

interface Profile {
  name: string;
  role: string;
  photo: string;
  summary: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: 'languages' | 'technologies' | 'tools';
}

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  order: number;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  period: string;
  order: number;
}

interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  category: 'Award' | 'Certification';
  order: number;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  order: number;
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
                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest block mb-1">System Status: Active</span>
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
    <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">{children}</label>
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
    category: 'Web',
    tech: [],
    tags: [],
    github: '',
    demo: '#',
    images: [],
    codeSnippet: '',
    order: 0,
    videoUrl: ''
  });

  const [techInput, setTechInput] = useState(formData.tech?.join(', ') || '');
  const [tagsInput, setTagsInput] = useState(formData.tags?.join(', ') || '');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { uploadImage } = await import('../../lib/firebase.ts');
      const url = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), url]
      }));
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = techInput.split(',').map(s => s.trim()).filter(Boolean);
    const tagsArray = tagsInput.split(',').map(s => s.trim()).filter(Boolean);
    onSave({ ...formData, tech: techArray, tags: tagsArray });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <FormLabel>Project Title</FormLabel>
          <AdminInput 
            value={formData.title}
            onChange={(e: any) => setFormData({...formData, title: e.target.value})}
            placeholder="Project name..."
            required
          />
        </div>
        <div className="space-y-1">
          <FormLabel>Category</FormLabel>
          <div className="relative">
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-accent/40 focus:bg-white/[0.04] outline-none transition-all appearance-none cursor-pointer"
              >
                {['Web', 'Mobile', 'AI', 'Cloud', 'Open Source'].map(cat => (
                  <option key={cat} value={cat} className="bg-[#0f0f12]">{cat}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-gray-600 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <FormLabel>Description</FormLabel>
        <textarea 
          required
          rows={4}
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          placeholder="Professional overview of the project..."
          className="w-full bg-white/[0.02] border border-white/10 rounded-[28px] px-8 py-6 text-sm text-gray-300 focus:border-accent/40 focus:bg-white/[0.04] outline-none transition-all resize-none placeholder:text-gray-700"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <FormLabel>Technologies (Comma separated)</FormLabel>
          <AdminInput 
            icon={Layers}
            value={techInput}
            onChange={(e: any) => setTechInput(e.target.value)}
            placeholder="React, Firebase..."
          />
        </div>
        <div className="space-y-1">
          <FormLabel>Tags (Comma separated)</FormLabel>
          <AdminInput 
            icon={Plus}
            value={tagsInput}
            onChange={(e: any) => setTagsInput(e.target.value)}
            placeholder="Fintech, SaaS..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <FormLabel>GitHub URL</FormLabel>
          <AdminInput 
            icon={GithubIcon}
            value={formData.github}
            onChange={(e: any) => setFormData({...formData, github: e.target.value})}
            placeholder="https://github.com/..."
          />
        </div>
        <div className="space-y-1">
          <FormLabel>Live Demo URL</FormLabel>
          <AdminInput 
            icon={ExternalLink}
            value={formData.demo}
            onChange={(e: any) => setFormData({...formData, demo: e.target.value})}
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="space-y-1">
        <FormLabel>Video URL (Optional)</FormLabel>
        <AdminInput 
          icon={ImageIcon}
          value={formData.videoUrl}
          onChange={(e: any) => setFormData({...formData, videoUrl: e.target.value})}
          placeholder="YouTube or Vimeo URL"
        />
      </div>

      <div className="space-y-4">
        <FormLabel>Project Gallery</FormLabel>
        <div className="grid grid-cols-4 gap-4">
          {formData.images?.map((url, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
              <img src={url} className="w-full h-full object-cover" alt="" />
              <button 
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <label className={`aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-accent/40 hover:bg-white/[0.02] transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? <Loader2 className="animate-spin text-accent" /> : <Plus className="text-gray-500" />}
            <span className="text-[10px] font-bold text-gray-500 uppercase">Upload</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <div className="space-y-1">
        <FormLabel>Code Implementation Snippet</FormLabel>
        <textarea 
          rows={6}
          value={formData.codeSnippet}
          onChange={e => setFormData({...formData, codeSnippet: e.target.value})}
          placeholder="// Optional implementation details..."
          className="w-full bg-[#08080a] border border-white/10 rounded-[28px] px-8 py-6 text-[12px] text-accent font-mono focus:border-accent/40 outline-none transition-all resize-none shadow-inner"
        />
      </div>

      <div className="flex items-center gap-4 pt-8 border-t border-white/5">
        <button 
          type="submit" 
          disabled={isLoading || uploading}
          className="flex-1 bg-accent text-white py-5 rounded-[24px] font-bold uppercase tracking-[0.2em] text-[11px] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {project ? 'Save Changes' : 'Create Project'}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="px-10 py-5 border border-white/10 rounded-[24px] text-gray-500 hover:text-white hover:bg-white/5 transition-all font-bold text-[11px] uppercase tracking-[0.2em]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const SkillForm = ({ item, onSave, onCancel, isLoading }: { item?: any; onSave: (data: any) => void; onCancel: () => void; isLoading: boolean }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    level: item?.level || 80,
    category: item?.category || 'technologies'
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
      <div className="space-y-1">
        <FormLabel>Skill Name</FormLabel>
        <AdminInput value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} placeholder="React, Node.js..." required />
      </div>
      <div className="space-y-1">
        <FormLabel>Proficiency (%)</FormLabel>
        <AdminInput type="number" min="0" max="100" value={formData.level} onChange={(e: any) => setFormData({...formData, level: parseInt(e.target.value)})} required />
      </div>
      <div className="space-y-1">
        <FormLabel>Category</FormLabel>
        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none appearance-none cursor-pointer">
          <option value="languages">Languages</option>
          <option value="technologies">Technologies</option>
          <option value="tools">Tools</option>
        </select>
      </div>
      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={isLoading} className="flex-1 bg-accent text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Save Skill</button>
        <button type="button" onClick={onCancel} className="px-8 py-4 border border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold">Cancel</button>
      </div>
    </form>
  );
};

const ExperienceForm = ({ item, onSave, onCancel, isLoading }: { item?: any; onSave: (data: any) => void; onCancel: () => void; isLoading: boolean }) => {
  const [formData, setFormData] = useState({
    role: item?.role || '',
    company: item?.company || '',
    period: item?.period || '',
    description: item?.description || ''
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <FormLabel>Role</FormLabel>
          <AdminInput value={formData.role} onChange={(e: any) => setFormData({...formData, role: e.target.value})} placeholder="Software Engineer..." required />
        </div>
        <div className="space-y-1">
          <FormLabel>Company</FormLabel>
          <AdminInput value={formData.company} onChange={(e: any) => setFormData({...formData, company: e.target.value})} placeholder="Tech Corp..." required />
        </div>
      </div>
      <div className="space-y-1">
        <FormLabel>Period</FormLabel>
        <AdminInput value={formData.period} onChange={(e: any) => setFormData({...formData, period: e.target.value})} placeholder="2022 - Present" required />
      </div>
      <div className="space-y-1">
        <FormLabel>Description</FormLabel>
        <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none" placeholder="Key responsibilities..." />
      </div>
      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={isLoading} className="flex-1 bg-accent text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Save Experience</button>
        <button type="button" onClick={onCancel} className="px-8 py-4 border border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold">Cancel</button>
      </div>
    </form>
  );
};

const EducationForm = ({ item, onSave, onCancel, isLoading }: { item?: any; onSave: (data: any) => void; onCancel: () => void; isLoading: boolean }) => {
  const [formData, setFormData] = useState({
    degree: item?.degree || '',
    school: item?.school || '',
    period: item?.period || ''
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
      <div className="space-y-1">
        <FormLabel>Degree</FormLabel>
        <AdminInput value={formData.degree} onChange={(e: any) => setFormData({...formData, degree: e.target.value})} placeholder="B.Tech CS..." required />
      </div>
      <div className="space-y-1">
        <FormLabel>School/University</FormLabel>
        <AdminInput value={formData.school} onChange={(e: any) => setFormData({...formData, school: e.target.value})} placeholder="University Name" required />
      </div>
      <div className="space-y-1">
        <FormLabel>Period</FormLabel>
        <AdminInput value={formData.period} onChange={(e: any) => setFormData({...formData, period: e.target.value})} placeholder="2020 - 2024" required />
      </div>
      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={isLoading} className="flex-1 bg-accent text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Save Education</button>
        <button type="button" onClick={onCancel} className="px-8 py-4 border border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold">Cancel</button>
      </div>
    </form>
  );
};

const AchievementForm = ({ item, onSave, onCancel, isLoading }: { item?: any; onSave: (data: any) => void; onCancel: () => void; isLoading: boolean }) => {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    issuer: item?.issuer || '',
    date: item?.date || '',
    description: item?.description || '',
    category: item?.category || 'Award'
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <FormLabel>Title</FormLabel>
          <AdminInput value={formData.title} onChange={(e: any) => setFormData({...formData, title: e.target.value})} placeholder="1st Place Hackathon..." required />
        </div>
        <div className="space-y-1">
          <FormLabel>Issuer</FormLabel>
          <AdminInput value={formData.issuer} onChange={(e: any) => setFormData({...formData, issuer: e.target.value})} placeholder="Google, SRM..." required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <FormLabel>Date</FormLabel>
          <AdminInput value={formData.date} onChange={(e: any) => setFormData({...formData, date: e.target.value})} placeholder="June 2023" required />
        </div>
        <div className="space-y-1">
          <FormLabel>Category</FormLabel>
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none appearance-none cursor-pointer">
            <option value="Award">Award</option>
            <option value="Certification">Certification</option>
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <FormLabel>Description</FormLabel>
        <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none" placeholder="Brief details..." />
      </div>
      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={isLoading} className="flex-1 bg-accent text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Save Achievement</button>
        <button type="button" onClick={onCancel} className="px-8 py-4 border border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold">Cancel</button>
      </div>
    </form>
  );
};

const TestimonialForm = ({ item, onSave, onCancel, isLoading }: { item?: any; onSave: (data: any) => void; onCancel: () => void; isLoading: boolean }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    role: item?.role || '',
    quote: item?.quote || '',
    image: item?.image || ''
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { uploadImage } = await import('../../lib/firebase.ts');
      const url = await uploadImage(file);
      setFormData({...formData, image: url});
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 bg-white/5 relative">
          {formData.image ? <img src={formData.image} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="absolute inset-0 m-auto text-gray-700" size={30} />}
        </div>
        <label className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-all text-white">
          {uploading ? 'Uploading...' : 'Upload Photo'}
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <FormLabel>Client Name</FormLabel>
          <AdminInput value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" required />
        </div>
        <div className="space-y-1">
          <FormLabel>Role/Company</FormLabel>
          <AdminInput value={formData.role} onChange={(e: any) => setFormData({...formData, role: e.target.value})} placeholder="CEO @ Company" required />
        </div>
      </div>
      <div className="space-y-1">
        <FormLabel>Testimonial Quote</FormLabel>
        <textarea rows={4} value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none" placeholder="Personal feedback..." required />
      </div>
      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={isLoading || uploading} className="flex-1 bg-accent text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Save Testimonial</button>
        <button type="button" onClick={onCancel} className="px-8 py-4 border border-white/10 rounded-2xl text-gray-500 hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold">Cancel</button>
      </div>
    </form>
  );
};

// --- Main Panel ---

type Tab = 'profile' | 'projects' | 'skills' | 'experience' | 'education' | 'achievements' | 'testimonials' | 'goals';

export const AdminPanel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // States
  const [profile, setProfile] = useState<Profile>({ name: '', role: '', photo: '', summary: '' });
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [achievements, setAchievementList] = useState<Achievement[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [goals, setGoals] = useState({ current: '' });
  
  // UI States
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
      if (currUser) {
        const unsubs = [
          subscribeToConfig('profile', setProfile),
          subscribeToCollection('projects', (data) => setProjects(data.sort((a,b) => (a.order || 0) - (b.order || 0)))),
          subscribeToCollection('skills', (data) => setSkills(data.sort((a,b) => (a.order || 0) - (b.order || 0)))),
          subscribeToCollection('experience', (data) => setExperience(data.sort((a,b) => (b.order || 0) - (a.order || 0)))),
          subscribeToCollection('education', (data) => setEducation(data.sort((a,b) => (a.order || 0) - (b.order || 0)))),
          subscribeToCollection('achievements', (data) => setAchievementList(data.sort((a,b) => (a.order || 0) - (b.order || 0)))),
          subscribeToCollection('testimonials', (data) => setTestimonials(data.sort((a,b) => (a.order || 0) - (b.order || 0)))),
          subscribeToConfig('goals', setGoals)
        ];
        return () => unsubs.forEach(unsub => unsub());
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleSync = async (data: any) => {
    setLoading(true);
    try {
      const collectionName = activeTab;
      if (editingItem) {
        await updateDocGeneric(collectionName, editingItem.id, data);
      } else {
        const order = (activeTab === 'projects' ? projects : activeTab === 'skills' ? skills : activeTab === 'experience' ? experience : activeTab === 'education' ? education : activeTab === 'achievements' ? achievements : testimonials).length;
        await createDocGeneric(collectionName, { ...data, order });
      }
      setEditingItem(null);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert('Sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteDocGeneric(activeTab, id);
      setIsDeleting(null);
    } catch (err) {
      alert('Delete failed.');
    } finally {
      setLoading(false);
    }
  };

  const moveItem = async (idx: number, direction: 'up' | 'down') => {
    const list = [...(activeTab === 'projects' ? projects : activeTab === 'skills' ? skills : activeTab === 'experience' ? experience : activeTab === 'education' ? education : activeTab === 'achievements' ? achievements : testimonials)];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    setLoading(true);
    try {
      const [moved] = list.splice(idx, 1);
      list.splice(targetIdx, 0, moved);
      await Promise.all(list.map((p, i) => updateDocGeneric(activeTab, p.id, { order: i })));
    } finally {
      setLoading(false);
    }
  };

  // Profile and Goal updates
  const handleConfigUpdate = async (type: 'profile' | 'goals', data: any) => {
    setLoading(true);
    try {
      await updateConfig(type, data);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="flex h-full overflow-hidden">
                {/* Navigation Rail */}
                <div className="w-80 border-r border-white/5 bg-white/[0.01] p-12 flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-16">
                    <div className="pl-2">
                        <div className="text-3xl font-display font-bold text-white tracking-tighter flex items-center gap-3">
                            <span className="text-accent underline decoration-accent/20">Control</span>
                            <span className="opacity-20 italic font-serif">Center</span>
                        </div>
                    </div>

                    <nav className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                      {[
                        { id: 'profile', icon: Database, label: 'Profile' },
                        { id: 'goals', icon: Info, label: 'Future Goals' },
                        { id: 'projects', icon: Briefcase, label: 'Projects' },
                        { id: 'skills', icon: Terminal, label: 'Skills' },
                        { id: 'experience', icon: Layers, label: 'Experience' },
                        { id: 'education', icon: Code, label: 'Education' },
                        { id: 'achievements', icon: Shield, label: 'Achievements' },
                        { id: 'testimonials', icon: ImageIcon, label: 'Testimonials' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id as Tab)}
                          className={`w-full flex items-center gap-4 px-6 py-4 rounded-[22px] text-[10px] font-bold uppercase tracking-[0.2em] transition-all group relative overflow-hidden ${
                            activeTab === item.id 
                            ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                            : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
                          }`}
                        >
                          <item.icon size={18} />
                          {item.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="space-y-10">
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] flex flex-col items-center text-center">
                        <img src={profile.photo || user.photoURL || ''} alt="" className="w-16 h-16 rounded-full border-2 border-accent/20 mb-4" />
                        <p className="text-[11px] font-bold text-white uppercase tracking-widest">{profile.name || user.displayName || 'Admin'}</p>
                    </div>
                    <button onClick={logout} className="w-full flex items-center justify-center gap-4 px-8 py-5 rounded-[28px] text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all border border-red-500/10">
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-linear-to-br from-transparent via-white/[0.01] to-transparent">
                  <header className="p-12 pb-6 flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-display font-bold text-white capitalize tracking-tighter">{activeTab}</h1>
                            {loading && <Loader2 className="animate-spin text-accent" size={20} />}
                        </div>
                        <p className="text-gray-600 text-sm italic font-serif">System states and deployment management.</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-full transition-all text-white border border-white/5 shadow-lg">
                      <X size={24} />
                    </button>
                  </header>

                  <main className="flex-1 overflow-y-auto p-12 pt-6 custom-scrollbar">
                    {activeTab === 'profile' && (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                        <form onSubmit={(e) => { e.preventDefault(); handleConfigUpdate('profile', profile); }} className="max-w-3xl space-y-10">
                          <div className="flex items-start gap-10 bg-white/[0.01] p-10 rounded-[50px] border border-white/5">
                            <div className="relative group">
                              <div className="w-40 h-40 rounded-[44px] overflow-hidden border border-white/10 bg-[#0f0f12] relative shadow-2xl">
                                {profile.photo ? (
                                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-800"><Camera size={50} /></div>
                                )}
                              </div>
                              <label className="absolute -bottom-2 -right-2 p-4 bg-accent text-white rounded-[20px] shadow-2xl hover:scale-110 transition-all cursor-pointer">
                                <Camera size={18} />
                                <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setLoading(true);
                                    try {
                                      const { uploadImage } = await import('../../lib/firebase.ts');
                                      const url = await uploadImage(file, 'profile');
                                      setProfile({...profile, photo: url});
                                    } finally {
                                      setLoading(false);
                                    }
                                  }
                                }} />
                              </label>
                            </div>
                            <div className="flex-1 space-y-6 pt-2">
                              <div className="space-y-2">
                                <FormLabel>Full Name</FormLabel>
                                <AdminInput value={profile.name} onChange={(e: any) => setProfile({...profile, name: e.target.value})} placeholder="Display Name" />
                              </div>
                              <div className="space-y-2">
                                <FormLabel>Role</FormLabel>
                                <AdminInput value={profile.role} onChange={(e: any) => setProfile({...profile, role: e.target.value})} placeholder="Professional Title" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <FormLabel>Short Bio</FormLabel>
                            <textarea rows={5} value={profile.summary} onChange={e => setProfile({...profile, summary: e.target.value})} placeholder="Professional summary..." className="w-full bg-white/[0.01] border border-white/5 rounded-[30px] px-8 py-6 text-sm text-gray-300 focus:border-accent/30 outline-none transition-all resize-none" />
                          </div>

                          <button type="submit" disabled={loading} className="bg-white text-black px-12 py-5 rounded-[24px] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-accent hover:text-white transition-all shadow-xl flex items-center gap-3">
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Update Profile
                          </button>
                        </form>
                      </motion.div>
                    )}

                    {activeTab === 'goals' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                        <form onSubmit={(e) => { e.preventDefault(); handleConfigUpdate('goals', goals); }} className="space-y-10">
                          <div className="space-y-4">
                            <FormLabel>Future Vision & Goals</FormLabel>
                            <textarea rows={10} value={goals.current} onChange={e => setGoals({current: e.target.value})} placeholder="Outline your 5-year vision..." className="w-full bg-white/[0.02] border border-white/10 rounded-[40px] px-10 py-10 text-lg italic font-serif text-white focus:border-accent/40 outline-none transition-all resize-none shadow-2xl" />
                          </div>
                          <button type="submit" disabled={loading} className="bg-accent text-white px-12 py-5 rounded-[24px] font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all shadow-xl flex items-center gap-3">
                             <Save size={18} /> Update Vision
                          </button>
                        </form>
                      </motion.div>
                    )}

                    {activeTab !== 'profile' && activeTab !== 'goals' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white/[0.02] p-8 rounded-[40px] border border-white/5">
                          <div className="flex-1 w-full max-w-md">
                            <AdminInput 
                              placeholder={`Search ${activeTab}...`} 
                              value={searchQuery}
                              onChange={(e: any) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          <button onClick={() => setIsCreating(true)} className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-[24px] hover:scale-105 transition-all shadow-lg font-bold text-[10px] uppercase tracking-[0.2em]">
                            <Plus size={18} /> Add {activeTab.slice(0, -1)}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {(activeTab === 'projects' ? projects : activeTab === 'skills' ? skills : activeTab === 'experience' ? experience : activeTab === 'education' ? education : activeTab === 'achievements' ? achievements : testimonials)
                            .filter((item: any) => {
                                const searchField = item.title || item.name || item.role || item.degree;
                                return searchField?.toLowerCase().includes(searchQuery.toLowerCase());
                            })
                            .map((item: any, idx: number) => (
                              <motion.div key={item.id} layout className="p-6 bg-white/[0.01] border border-white/5 rounded-[30px] flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                                <div className="flex items-center gap-6">
                                  <div className="flex flex-col gap-1 items-center mr-2">
                                    <button onClick={() => moveItem(idx, 'up')} className="p-1 hover:text-accent transition-colors"><ChevronRight className="-rotate-90" size={16} /></button>
                                    <button onClick={() => moveItem(idx, 'down')} className="p-1 hover:text-accent transition-colors"><ChevronRight className="rotate-90" size={16} /></button>
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-bold text-white group-hover:text-accent transition-colors">{item.title || item.name || item.role || item.degree}</h4>
                                    <p className="text-[9px] text-gray-500 font-mono mt-1 uppercase tracking-widest">
                                        {item.category || item.company || item.school || item.period}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => setEditingItem(item)} className="p-3 bg-white/5 text-gray-500 hover:text-white rounded-xl transition-all"><Edit3 size={16} /></button>
                                  <button onClick={() => setIsDeleting(item.id)} className="p-3 bg-white/5 text-gray-500 hover:text-red-500 rounded-xl transition-all"><Trash2 size={16} /></button>
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

      <AdminModal isOpen={!!isDeleting} onClose={() => setIsDeleting(null)} title="Delete Project">
        <div className="py-10 text-center space-y-8">
            <div className="w-24 h-24 bg-red-500/10 rounded-[40px] flex items-center justify-center text-red-500 mx-auto shadow-2xl">
                <AlertTriangle size={48} />
            </div>
            <div className="space-y-2">
                <p className="text-white font-bold text-2xl">Permanent Deletion</p>
                <p className="text-gray-500 text-sm italic font-serif">Remove this project record from the live database?</p>
            </div>
            <div className="flex gap-4">
                <button onClick={() => isDeleting && executeDelete(isDeleting)} disabled={loading} className="flex-1 py-4 bg-red-500 text-white font-bold text-[11px] uppercase tracking-widest rounded-2xl">Confirm Delete</button>
                <button onClick={() => setIsDeleting(null)} className="flex-1 py-4 bg-white/5 text-gray-500 font-bold text-[11px] uppercase tracking-widest rounded-2xl border border-white/5">Cancel</button>
            </div>
        </div>
      </AdminModal>

      <AdminModal isOpen={isCreating} onClose={() => setIsCreating(false)} title={`Initialize ${activeTab.slice(0, -1)}`}>
        {activeTab === 'projects' && <ProjectForm onSave={handleSync} onCancel={() => setIsCreating(false)} isLoading={loading} />}
        {activeTab === 'skills' && <SkillForm onSave={handleSync} onCancel={() => setIsCreating(false)} isLoading={loading} />}
        {activeTab === 'experience' && <ExperienceForm onSave={handleSync} onCancel={() => setIsCreating(false)} isLoading={loading} />}
        {activeTab === 'education' && <EducationForm onSave={handleSync} onCancel={() => setIsCreating(false)} isLoading={loading} />}
        {activeTab === 'achievements' && <AchievementForm onSave={handleSync} onCancel={() => setIsCreating(false)} isLoading={loading} />}
        {activeTab === 'testimonials' && <TestimonialForm onSave={handleSync} onCancel={() => setIsCreating(false)} isLoading={loading} />}
      </AdminModal>

      <AdminModal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title={`Modify ${activeTab.slice(0, -1)}`}>
        {activeTab === 'projects' && editingItem && <ProjectForm project={editingItem} onSave={handleSync} onCancel={() => setEditingItem(null)} isLoading={loading} />}
        {activeTab === 'skills' && editingItem && <SkillForm item={editingItem} onSave={handleSync} onCancel={() => setEditingItem(null)} isLoading={loading} />}
        {activeTab === 'experience' && editingItem && <ExperienceForm item={editingItem} onSave={handleSync} onCancel={() => setEditingItem(null)} isLoading={loading} />}
        {activeTab === 'education' && editingItem && <EducationForm item={editingItem} onSave={handleSync} onCancel={() => setEditingItem(null)} isLoading={loading} />}
        {activeTab === 'achievements' && editingItem && <AchievementForm item={editingItem} onSave={handleSync} onCancel={() => setEditingItem(null)} isLoading={loading} />}
        {activeTab === 'testimonials' && editingItem && <TestimonialForm item={editingItem} onSave={handleSync} onCancel={() => setEditingItem(null)} isLoading={loading} />}
      </AdminModal>
    </>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, LogOut, X, Camera, Plus, Trash2, 
  Save, Edit3, Link as LinkIcon, Github as GithubIcon, 
  ExternalLink, Code, Layers, Info, ChevronRight,
  AlertTriangle, Loader2, Image as ImageIcon,
  Layout, Briefcase, Terminal, Database, Shield,
  Search, GripVertical, Filter
} from 'lucide-react';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from '@hello-pangea/dnd';
import { 
  auth, login, logout, 
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
  categories?: string[];
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

const AdminInput = ({ icon: Icon, className = '', ...props }: any) => (
  <div className="relative group">
    {Icon && <Icon size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-all duration-300" />}
    <input 
      {...props}
      className={`w-full bg-white/[0.03] border rounded-2xl ${Icon ? 'pl-16' : 'px-8'} py-5 text-sm text-white focus:border-accent/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(255,82,82,0.1)] outline-none transition-all placeholder:text-gray-600 font-sans backdrop-blur-md ${className || 'border-white/10'}`} 
    />
  </div>
);

const AdminButton = ({ children, variant = 'primary', isLoading, ...props }: any) => {
  const variants = {
    primary: 'bg-accent text-white hover:shadow-[0_0_30px_rgba(255,82,82,0.4)] hover:scale-[1.02]',
    secondary: 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:text-white',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20'
  };
  
  return (
    <button 
      {...props}
      disabled={props.disabled || isLoading}
      className={`px-8 py-5 rounded-[22px] font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] ${variants[variant as keyof typeof variants]}`}
    >
      {isLoading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
};

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
    categories: [],
    codeSnippet: '',
    order: 0,
    videoUrl: ''
  });

  const [techInput, setTechInput] = useState(formData.tech?.join(', ') || '');
  const [tagsInput, setTagsInput] = useState(formData.tags?.join(', ') || '');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [fileName: string]: number }>({});
  const [videoError, setVideoError] = useState('');
  const [placeholderCount, setPlaceholderCount] = useState(1);
  const [placeholderTheme, setPlaceholderTheme] = useState('tech');
  const [isDragging, setIsDragging] = useState(false);

  const THEMES = [
    { id: 'tech', label: 'Tech & AI', keywords: 'technology,ai,circuit,coding' },
    { id: 'abstract', label: 'Abstract', keywords: 'abstract,gradient,art,modern' },
    { id: 'architecture', label: 'Architecture', keywords: 'architecture,building,modern-design' },
    { id: 'business', label: 'Business', keywords: 'office,business,startup,meeting' },
    { id: 'nature', label: 'Nature', keywords: 'nature,landscape,mountain,forest' }
  ];

  const toggleCategory = (cat: string) => {
    setFormData(prev => {
      const current = prev.categories || [];
      const next = current.includes(cat)
        ? current.filter(c => c !== cat)
        : [...current, cat];
      return { ...prev, categories: next };
    });
  };

  const generatePlaceholders = () => {
    const theme = THEMES.find(t => t.id === placeholderTheme) || THEMES[0];
    const keywords = theme.keywords.split(',');
    
    const newImages = Array.from({ length: placeholderCount }).map((_, i) => {
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      const seed = Math.random().toString(36).substring(7);
      return `https://picsum.photos/seed/${seed}/800/600?${randomKeyword}`;
    });

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages]
    }));
  };

  const validateVideoUrl = (url: string) => {
    if (!url) return true;
    // Strict YouTube: matches watch?v=ID or youtu.be/ID
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}.*$/;
    // Strict Vimeo: matches vimeo.com/ID
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/\d+(\?.*)?$/;
    return youtubeRegex.test(url) || vimeoRegex.test(url);
  };

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return null;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: File[] = [];
    if ('files' in e.target && (e.target as HTMLInputElement).files) {
      files = Array.from((e.target as HTMLInputElement).files!);
    } else if ('dataTransfer' in e) {
      e.preventDefault();
      files = Array.from(e.dataTransfer.files);
    }
    
    if (files.length === 0) return;

    setUploading(true);
    setIsDragging(false);
    
    try {
      const { uploadImageWithProgress } = await import('../../lib/firebase.ts');
      
      // Upload files in parallel but update state as each one completes
      await Promise.all(files.map(async (file) => {
        try {
          const url = await uploadImageWithProgress(file, (progress) => {
            setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
          });
          
          setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), url]
          }));
          
          // Clear progress for this file
          setUploadProgress(prev => {
            const next = { ...prev };
            delete next[file.name];
            return next;
          });
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
        }
      }));
    } catch (error) {
      console.error(error);
      alert('Upload failed. Some images might not have been uploaded.');
    } finally {
      // Check if any progress is still left (in case of errors)
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleImageDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(formData.images || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormData(prev => ({ ...prev, images: items }));
  };

  const removeImage = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoError) {
      alert('Please fix the validation errors before saving.');
      return;
    }
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

      <div className="space-y-4">
        <FormLabel>Professional Categories (Select multiple)</FormLabel>
        <div className="flex flex-wrap gap-3">
          {['Web Development', 'AI/ML', 'DevOps', 'UI/UX Design'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                formData.categories?.includes(cat)
                  ? 'bg-accent border-accent text-white shadow-[0_0_20px_rgba(255,82,82,0.3)]'
                  : 'bg-white/[0.02] border-white/10 text-gray-500 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
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
          icon={LinkIcon}
          value={formData.videoUrl}
          onChange={(e: any) => {
            const val = e.target.value;
            setFormData({...formData, videoUrl: val});
            if (val && !validateVideoUrl(val)) {
              setVideoError('Please enter a valid YouTube or Vimeo URL');
            } else {
              setVideoError('');
            }
          }}
          placeholder="YouTube or Vimeo URL"
          className={`w-full bg-white/[0.03] border ${videoError ? 'border-red-500' : 'border-white/10'} rounded-2xl pl-16 py-5 text-sm text-white focus:border-accent/50 outline-none`}
        />
        {videoError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight mt-1 ml-2">{videoError}</p>}
        {formData.videoUrl && !videoError && getVideoEmbedUrl(formData.videoUrl) && (
          <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
            <iframe 
              src={getVideoEmbedUrl(formData.videoUrl)!} 
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 border-b border-white/5 pb-8 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <FormLabel>Smart Assets</FormLabel>
              <p className="text-[9px] text-gray-500 font-medium -mt-2">Generate theme-based placeholders instantly</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-1 gap-1">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPlaceholderTheme(t.id)}
                    className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                      placeholderTheme === t.id 
                        ? 'bg-accent text-white shadow-lg' 
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {t.id}
                  </button>
                ))}
              </div>
              
              <div className="h-8 w-px bg-white/5 mx-2" />

              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={placeholderCount}
                  onChange={(e) => setPlaceholderCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-12 bg-white/[0.03] border border-white/10 rounded-xl px-2 py-2 text-[10px] text-center text-white outline-none focus:border-accent/40 transition-all font-mono"
                />
                <button 
                  type="button"
                  onClick={generatePlaceholders}
                  className="px-6 py-2 bg-accent/10 border border-accent/20 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] text-accent hover:bg-accent/20 transition-all flex items-center gap-2"
                >
                  <Plus size={14} />
                  Assemble {placeholderCount} Assets
                </button>
              </div>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={handleImageDragEnd}>
          <Droppable droppableId="gallery-images" direction="horizontal">
            {(provided) => (
              <div className="space-y-6">
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {formData.images?.map((url, idx) => (
                    <Draggable key={url} draggableId={url} index={idx}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`relative aspect-square rounded-2xl overflow-hidden border group transition-all duration-300 ${
                            snapshot.isDragging 
                              ? 'border-accent shadow-[0_0_40px_rgba(255,82,82,0.3)] z-50 scale-105' 
                              : 'border-white/10'
                          }`}
                        >
                          <img src={url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" referrerPolicy="no-referrer" />
                          
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/20">
                              <GripVertical size={16} className="text-white" />
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-all active:scale-95"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-md border border-white/10">
                            <span className="text-[8px] font-bold text-white uppercase tracking-widest">{idx + 1}</span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {/* Uploading Placeholders */}
                  {Object.entries(uploadProgress).map(([name, progress]) => (
                    <div 
                      key={name}
                      className="relative aspect-square rounded-2xl overflow-hidden border border-accent/30 bg-accent/5 flex flex-col items-center justify-center p-4 text-center animate-pulse"
                    >
                      <Loader2 className="animate-spin text-accent mb-3" size={24} />
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[80%] mb-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-accent"
                        />
                      </div>
                      <p className="text-[8px] font-bold text-accent uppercase tracking-widest truncate w-full px-2">{name}</p>
                      <p className="text-[10px] font-mono text-white mt-1">{Math.round(progress)}%</p>
                    </div>
                  ))}

                  {provided.placeholder}
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleImageUpload}
                  className={`relative h-40 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                    isDragging 
                      ? 'border-accent bg-accent/5 scale-[0.98]' 
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                  } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <ImageIcon className="text-accent" size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-1">Upload Media Assets</p>
                      <p className="text-[9px] text-gray-500 font-medium">Drag & Drop or Click to browse your files</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
        <AdminButton 
          type="submit" 
          isLoading={isLoading || uploading}
          className="flex-1 rounded-[24px]"
        >
          {project ? 'Save Changes' : 'Create Project'}
        </AdminButton>
        <AdminButton 
          type="button"
          onClick={onCancel}
          variant="secondary"
          className="px-10 rounded-[24px]"
          disabled={isLoading || uploading}
        >
          Cancel
        </AdminButton>
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
        <AdminButton type="submit" isLoading={isLoading} className="flex-1">Save Skill</AdminButton>
        <AdminButton type="button" variant="secondary" onClick={onCancel} className="px-8" disabled={isLoading}>Cancel</AdminButton>
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
        <AdminButton type="submit" isLoading={isLoading} className="flex-1">Save Experience</AdminButton>
        <AdminButton type="button" variant="secondary" onClick={onCancel} className="px-8" disabled={isLoading}>Cancel</AdminButton>
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
        <AdminButton type="submit" isLoading={isLoading} className="flex-1">Save Education</AdminButton>
        <AdminButton type="button" variant="secondary" onClick={onCancel} className="px-8" disabled={isLoading}>Cancel</AdminButton>
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
        <AdminButton type="submit" isLoading={isLoading} className="flex-1">Save Achievement</AdminButton>
        <AdminButton type="button" variant="secondary" onClick={onCancel} className="px-8" disabled={isLoading}>Cancel</AdminButton>
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
          {formData.image ? <img src={formData.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" /> : <ImageIcon className="absolute inset-0 m-auto text-gray-700" size={30} />}
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
        <AdminButton type="submit" isLoading={isLoading || uploading} className="flex-1">Save Testimonial</AdminButton>
        <AdminButton type="button" variant="secondary" onClick={onCancel} className="px-8" disabled={isLoading || uploading}>Cancel</AdminButton>
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
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'order', direction: 'asc' });
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterTechnologies, setFilterTechnologies] = useState<string[]>([]);

  // States
  const [profile, setProfile] = useState<Profile>({ name: '', role: '', photo: '', summary: '' });
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [achievements, setAchievementList] = useState<Achievement[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [goals, setGoals] = useState({ current: '' });

  const getSingularLabel = (tab: Tab) => {
    switch (tab) {
      case 'projects': return 'Project';
      case 'skills': return 'Skill';
      case 'experience': return 'Experience';
      case 'education': return 'Education';
      case 'achievements': return 'Achievement';
      case 'testimonials': return 'Testimonial';
      default: return tab;
    }
  };
  
  // UI States
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState<any | null>(null);
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
        await createDocGeneric(collectionName, { ...data, order, createdAt: Date.now() });
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

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const list = [...(activeTab === 'projects' ? projects : activeTab === 'skills' ? skills : activeTab === 'experience' ? experience : activeTab === 'education' ? education : activeTab === 'achievements' ? achievements : testimonials)];
    const [moved] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, moved);

    setLoading(true);
    try {
      // Optimistic update
      if (activeTab === 'projects') setProjects(list as any);
      else if (activeTab === 'skills') setSkills(list as any);
      else if (activeTab === 'experience') setExperience(list as any);
      else if (activeTab === 'education') setEducation(list as any);
      else if (activeTab === 'achievements') setAchievementList(list as any);
      else setTestimonials(list as any);

      await Promise.all(list.map((p, i) => updateDocGeneric(activeTab, p.id, { order: i })));
    } catch (err) {
      console.error("Reorder failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Profile and Goal updates
  const handleConfigUpdate = async (type: 'profile' | 'goals', data: any) => {
    setLoading(true);
    console.log(`Updating ${type}...`, data);
    try {
      await updateConfig(type, data);
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
    } catch (err) {
      console.error(`Update failed for ${type}:`, err);
      alert(`Update failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAdminUser = user?.email === 'dharsan432006@gmail.com';

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
        {!isAdminUser && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-full z-10 animate-bounce">
            AUTH_ERR
          </div>
        )}
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
                        <img src={profile.photo || user.photoURL || ''} alt="" className="w-16 h-16 rounded-full border-2 border-accent/20 mb-4" referrerPolicy="no-referrer" />
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
                    {!isAdminUser && (
                      <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-4 text-red-500">
                        <AlertTriangle size={24} />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest">Unauthorized Account</p>
                          <p className="text-sm opacity-80">You are logged in as {user.email}. Only dharsan432006@gmail.com can commit changes to the production system.</p>
                        </div>
                      </div>
                    )}
                    {activeTab === 'profile' && (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                        <form onSubmit={(e) => { e.preventDefault(); handleConfigUpdate('profile', profile); }} className="max-w-3xl space-y-10">
                          <div className="flex items-start gap-10 bg-white/[0.01] p-10 rounded-[50px] border border-white/5">
                            <div className="relative group">
                              <div className="w-40 h-40 rounded-[44px] overflow-hidden border border-white/10 bg-[#0f0f12] relative shadow-2xl">
                                {profile.photo ? (
                                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                                      console.log("Starting profile photo upload...", file.name);
                                      const url = await uploadImage(file, 'profile');
                                      console.log("Profile photo uploaded successfully:", url);
                                      const updatedProfile = {...profile, photo: url};
                                      setProfile(updatedProfile);
                                      
                                      // Auto-save photo to firestore
                                      await updateConfig('profile', updatedProfile);
                                      console.log("Profile photo synced to Firestore");
                                    } catch (error) {
                                      console.error("Upload/Sync failed:", error);
                                      alert(`Failed to update profile photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

                          <AdminButton type="submit" disabled={loading}>
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Update Profile
                          </AdminButton>
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
                          <AdminButton type="submit" disabled={loading}>
                             <Save size={18} /> Update Vision
                          </AdminButton>
                        </form>
                      </motion.div>
                    )}

                    {activeTab !== 'profile' && activeTab !== 'goals' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                        <div className="space-y-6 bg-white/[0.03] p-10 rounded-[40px] border border-white/10 backdrop-blur-2xl shadow-2xl">
                          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                            <div className="flex-1 w-full max-w-xl flex items-center gap-4">
                              <div className="flex-1">
                                <AdminInput 
                                  icon={Search}
                                  placeholder={`Search ${activeTab} by title, name, role, or company...`} 
                                  value={searchQuery}
                                  onChange={(e: any) => setSearchQuery(e.target.value)}
                                />
                              </div>
                              <div className="relative">
                                <select 
                                  value={`${sortConfig.key}-${sortConfig.direction}`}
                                  onChange={(e) => {
                                    const [key, direction] = e.target.value.split('-');
                                    setSortConfig({ key, direction: direction as any });
                                  }}
                                  className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white outline-none cursor-pointer appearance-none pr-12 min-w-[180px]"
                                >
                                  <option value="order-asc" className="bg-[#0f0f12]">Default Order</option>
                                  <option value="title-asc" className="bg-[#0f0f12]">Title (A-Z)</option>
                                  <option value="title-desc" className="bg-[#0f0f12]">Title (Z-A)</option>
                                  <option value="category-asc" className="bg-[#0f0f12]">Category (A-Z)</option>
                                  <option value="createdAt-desc" className="bg-[#0f0f12]">Newest First</option>
                                  <option value="createdAt-asc" className="bg-[#0f0f12]">Oldest First</option>
                                </select>
                                <ChevronRight size={14} className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none" />
                              </div>
                            </div>
                            <AdminButton onClick={() => setIsCreating(true)}>
                              <Plus size={18} /> Add New {getSingularLabel(activeTab)}
                            </AdminButton>
                          </div>

                          {activeTab === 'projects' && (
                            <div className="pt-6 border-t border-white/5 space-y-4">
                              <div className="flex items-center gap-4">
                                <Filter size={14} className="text-gray-500" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Multi-Select Filters</span>
                              </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                  <FormLabel>Filter by Categories</FormLabel>
                                  <div className="flex flex-wrap gap-2">
                                    {['Web', 'Mobile', 'AI', 'Cloud', 'Open Source'].map(cat => (
                                      <button 
                                        key={cat}
                                        onClick={() => setFilterCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                                        className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                          filterCategories.includes(cat) 
                                          ? 'bg-accent/20 border-accent/40 text-accent ring-1 ring-accent/20' 
                                          : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                                        }`}
                                      >
                                        {cat}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <FormLabel>Filter by Tags</FormLabel>
                                  <div className="flex flex-wrap gap-2">
                                    {Array.from(new Set(projects.flatMap(p => p.tags || []))).sort().map(tag => (
                                      <button 
                                        key={tag}
                                        onClick={() => setFilterTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                                        className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                          filterTags.includes(tag) 
                                          ? 'bg-accent/20 border-accent/40 text-accent ring-1 ring-accent/20' 
                                          : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                                        }`}
                                      >
                                        {tag}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <FormLabel>Filter by Technologies</FormLabel>
                                  <div className="flex flex-wrap gap-2">
                                    {Array.from(new Set(projects.flatMap(p => p.tech || []))).sort().map(tech => (
                                      <button 
                                        key={tech}
                                        onClick={() => setFilterTechnologies(prev => prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech])}
                                        className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                          filterTechnologies.includes(tech) 
                                          ? 'bg-accent/20 border-accent/40 text-accent ring-1 ring-accent/20' 
                                          : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                                        }`}
                                      >
                                        {tech}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {(filterCategories.length > 0 || filterTags.length > 0 || filterTechnologies.length > 0) && (
                                <button onClick={() => {setFilterCategories([]); setFilterTags([]); setFilterTechnologies([]);}} className="text-[9px] text-accent uppercase tracking-widest font-bold hover:underline">Clear Filters</button>
                              )}
                            </div>
                          )}
                        </div>

                        <DragDropContext onDragEnd={onDragEnd}>
                          <Droppable droppableId="admin-list">
                            {(provided) => (
                              <div 
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="grid grid-cols-1 gap-6"
                              >
                                {(activeTab === 'projects' ? projects : activeTab === 'skills' ? skills : activeTab === 'experience' ? experience : activeTab === 'education' ? education : activeTab === 'achievements' ? achievements : testimonials)
                                  .filter((item: any) => {
                                      const fields = [
                                        item.title, item.name, item.role, item.degree, 
                                        item.company, item.school, item.issuer, item.category,
                                        item.description, item.summary
                                      ].filter(Boolean).join(' ').toLowerCase();
                                      
                                      const matchesSearch = fields.includes(searchQuery.toLowerCase());
                                      
                                      if (activeTab === 'projects') {
                                        const matchesCat = filterCategories.length === 0 || filterCategories.includes(item.category);
                                        const matchesTag = filterTags.length === 0 || filterTags.some((tag: string) => item.tags?.includes(tag));
                                        const matchesTech = filterTechnologies.length === 0 || filterTechnologies.some((t: string) => item.tech?.includes(t));
                                        return matchesSearch && matchesCat && matchesTag && matchesTech;
                                      }
                                      
                                      return matchesSearch;
                                  })
                                  .sort((a: any, b: any) => {
                                    const key = sortConfig.key;
                                    const valA = a[key] || '';
                                    const valB = b[key] || '';
                                    
                                    let comparison = 0;
                                    if (typeof valA === 'string' && typeof valB === 'string') {
                                      comparison = valA.localeCompare(valB);
                                    } else {
                                      comparison = valA < valB ? -1 : valA > valB ? 1 : 0;
                                    }
                                    
                                    return sortConfig.direction === 'asc' ? comparison : -comparison;
                                  })
                                  .map((item: any, index: number) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                      {(provided, snapshot) => (
                                        <div 
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          className={`p-6 bg-white/[0.01] border border-white/5 rounded-[30px] flex items-center justify-between group hover:bg-white/[0.03] transition-all ${snapshot.isDragging ? 'shadow-2xl bg-white/[0.08] !border-accent/30 z-[1000]' : ''}`}
                                        >
                                          <div className="flex items-center gap-6">
                                            <div {...provided.dragHandleProps} className="p-2 text-gray-700 hover:text-accent transition-colors cursor-grab active:cursor-grabbing">
                                              <GripVertical size={20} />
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
                                            <button onClick={() => setIsDeleting(item)} className="p-3 bg-white/5 text-gray-500 hover:text-red-500 rounded-xl transition-all"><Trash2 size={16} /></button>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </motion.div>
                    )}
                  </main>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminModal isOpen={!!isDeleting} onClose={() => setIsDeleting(null)} title={`Delete ${getSingularLabel(activeTab)}`}>
        <div className="py-10 text-center space-y-8">
            <div className="w-24 h-24 bg-red-500/10 rounded-[40px] flex items-center justify-center text-red-500 mx-auto shadow-2xl">
                <AlertTriangle size={48} />
            </div>
            <div className="space-y-2">
                <p className="text-white font-bold text-2xl">Permanent Deletion</p>
                <p className="text-gray-500 text-sm italic font-serif px-12">
                   Are you sure you want to remove <span className="text-white font-bold not-italic">"{isDeleting?.title || isDeleting?.name || isDeleting?.role || isDeleting?.degree}"</span> from your records? This action cannot be undone.
                </p>
            </div>
            <div className="flex gap-4">
                <AdminButton 
                  variant="danger" 
                  onClick={() => isDeleting && executeDelete(isDeleting.id)} 
                  isLoading={loading} 
                  className="flex-1"
                >
                    Delete {getSingularLabel(activeTab)}
                </AdminButton>
                <AdminButton 
                  variant="secondary" 
                  onClick={() => setIsDeleting(null)} 
                  disabled={loading} 
                  className="flex-1"
                >
                    Cancel
                </AdminButton>
            </div>
        </div>
      </AdminModal>

      <AdminModal isOpen={isCreating} onClose={() => setIsCreating(false)} title={`Initialize ${getSingularLabel(activeTab)}`}>
        {activeTab === 'projects' && <ProjectForm onSave={handleSync} onCancel={() => setIsCreating(false)} isLoading={loading} />}
        {activeTab === 'skills' && <SkillForm onSave={handleSync} onCancel={() => setIsCreating(false)} isLoading={loading} />}
        {activeTab === 'experience' && <ExperienceForm onSave={handleSync} onCancel={() => setIsCreating(false)} isLoading={loading} />}
        {activeTab === 'education' && <EducationForm onSave={handleSync} onCancel={() => setIsCreating(false)} isLoading={loading} />}
        {activeTab === 'achievements' && <AchievementForm onSave={handleSync} onCancel={() => setIsCreating(false)} isLoading={loading} />}
        {activeTab === 'testimonials' && <TestimonialForm onSave={handleSync} onCancel={() => setIsCreating(false)} isLoading={loading} />}
      </AdminModal>

      <AdminModal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title={`Modify ${getSingularLabel(activeTab)}`}>
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

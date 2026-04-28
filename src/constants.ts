export const PROJECTS = [
  {
    id: 'vitalsguard',
    title: 'VitalsGuard',
    description: 'Developed a full-stack central authority dashboard for Life Verification Intelligence Layer targeting government welfare schemes. Built real-time sector-specific modules for Ayushman Bharat (Health), Insurance, PDS Ration, and Housing with fraud detection features.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase'],
    github: 'https://github.com/dharsan432006-ops',
    demo: '#',
    category: 'Full-Stack',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    codeSnippet: 'const verifyBeneficiary = async (id) => {\n  const ref = doc(db, "beneficiaries", id);\n  const snap = await getDoc(ref);\n  return snap.exists() && snap.data().verified;\n};'
  },
  {
    id: 'top-res-ai',
    title: 'TOP RES AI',
    description: 'AI-powered resume analysis and candidate ranking platform (Neural Intelligence Platform). Developed automated ranking system, Neural Assistant chatbot for shortlisting, summarization, and interview generation, and real-time scoring engine.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Gemini API', 'Recharts'],
    github: 'https://github.com/dharsan432006-ops/TOP-RES-AI.git',
    demo: '#',
    category: 'AI',
    images: [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    codeSnippet: 'const model = genAI.getGenerativeModel({ model: "gemini-pro" });\nconst result = await model.generateContent([prompt, resumeData]);\nconst text = result.response.text();'
  },
  {
    id: 'signspeak-ai',
    title: 'SignSpeak AI',
    description: 'Built a real-time multimodal sign language communication platform translating speech to sign animations and gestures to text. Implemented gesture recognition, speech processing, and end-to-end real-time pipeline.',
    tech: ['React', 'MediaPipe', 'WebSockets', 'JavaScript'],
    github: 'https://github.com/dharsan432006-ops/sign',
    demo: '#',
    category: 'AI',
    images: [
      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    codeSnippet: 'const recognizer = new Holistic({\n  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,\n});\nrecognizer.onResults(onResults);'
  }
];

export const SKILLS = {
  languages: [
    { name: 'Python', level: 95, category: 'languages' },
    { name: 'JavaScript', level: 90, category: 'languages' },
    { name: 'SQL', level: 85, category: 'languages' }
  ],
  technologies: [
    { name: 'React', level: 90, category: 'technologies' },
    { name: 'FastAPI', level: 80, category: 'technologies' },
    { name: 'Docker', level: 75, category: 'technologies' },
    { name: 'Gemini API', level: 90, category: 'technologies' },
    { name: 'AWS EC2', level: 70, category: 'technologies' },
    { name: 'PostgreSQL', level: 80, category: 'technologies' },
    { name: 'Supabase', level: 85, category: 'technologies' }
  ],
  tools: [
    { name: 'Git', level: 95, category: 'tools' },
    { name: 'GitHub', level: 95, category: 'tools' },
    { name: 'Prompt Engineering', level: 90, category: 'tools' }
  ]
};

export const EXPERIENCE = [
  {
    role: 'Full-Stack Developer (Project)',
    company: 'VitalsGuard',
    period: '2026',
    description: 'Developed a central authority dashboard for government welfare schemes. Built real-time fraud detection modules for Ayushman Bharat and integrated secure Google Sign-In authentication.'
  },
  {
    role: 'AI System Architect',
    company: 'TOP RES AI',
    period: 'Feb 2026',
    description: 'Pioneered a Neural Intelligence Platform for candidate ranking. Achieved 95% accuracy in resume analysis and reduced screening time by 40% using Gemini API.'
  },
  {
    role: 'Hackathon Lead',
    company: 'SRM NOOB HACKFEST',
    period: '2024',
    description: 'Led a team of developers to win 1st place. Designed a scalable AI-driven resume scoring engine under high-pressure competitive environment.'
  }
];

export const EDUCATION = [
  {
    school: 'SRM Institute of Science and Technology',
    degree: 'Bachelor of Science in Computer Science',
    period: '2024 - 2027 (Expected)',
    cgpa: 'Pursuing',
    description: 'Located in Tiruchirapalli, Tamil Nadu, India. Focus on AI, Cloud Computing, and Software Development.'
  }
];

export const ACHIEVEMENTS = [
  {
    title: 'Hackathon Winner – SRM NOOB HACKFEST',
    issuer: 'SRM Institute of Science and Technology',
    date: '2024',
    description: 'Led a team to develop an AI-powered resume scoring and candidate-matching platform. 1st Rank winner.'
  },
  {
    title: 'Data Structures and Algorithms',
    issuer: 'Microsoft',
    date: 'May 2025',
    description: 'Professional certification in core computer science fundamentals.'
  },
  {
    title: 'Internet of Things and Embedded Systems',
    issuer: 'UC Irvine',
    date: 'May 2025',
    description: 'Advanced certification in IoT architectures and embedded processing.'
  },
  {
    title: 'Databases and SQL for Data Science',
    issuer: 'IBM',
    date: 'May 2025',
    description: 'Comprehensive certification in database management and SQL for analytical tasks.'
  },
  {
    title: 'Lean Six Sigma Yellow Belt',
    issuer: 'Anexas Europe',
    date: 'April 2026',
    description: 'Certification in process improvement and operational excellence.'
  }
];

export const TESTIMONIALS = [];


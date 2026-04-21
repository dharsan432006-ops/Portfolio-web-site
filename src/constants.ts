export const PROJECTS = [
  {
    id: 'signspeak-ai',
    title: 'SignSpeak AI',
    description: 'Real-time multimodal AI system translating speech ↔ sign language using `MediaPipe` and WebSockets. Low-latency gesture recognition pipeline. \n\n ```javascript\nconst results = await holistic.send({image: videoElement});\n```',
    tech: ['React', 'MediaPipe', 'WebSockets', 'JavaScript'],
    github: 'https://github.com/dharsan432006-ops/sign',
    demo: '#',
    category: 'AI',
    images: [
      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    codeSnippet: 'const recognizer = new Holistic({\n  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,\n});\nrecognizer.onResults(onResults);'
  },
  {
    id: 'top-res-ai',
    title: 'TOP RES AI',
    description: 'AI-powered resume analysis and ranking system using `Gemini API`. Features keyword extraction, scoring engine, and neural chatbot assistant.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Node.js'],
    github: 'https://github.com/dharsan432006-ops/TOP-RES-AI.git',
    demo: '#',
    category: 'AI',
    images: [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    codeSnippet: 'const model = genAI.getGenerativeModel({ model: "gemini-pro" });\nconst result = await model.generateContent([prompt, resumeData]);\nconst text = result.response.text();'
  }
];

export const SKILLS = {
  languages: [
    { name: 'JavaScript', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'Python', level: 95 }
  ],
  technologies: [
    { name: 'React', level: 90 },
    { name: 'Tailwind CSS', level: 95 },
    { name: 'Node.js', level: 85 },
    { name: 'Flask', level: 75 },
    { name: 'FastAPI', level: 80 }
  ],
  tools: [
    { name: 'Git', level: 95 },
    { name: 'VS Code', level: 95 },
    { name: 'Linux', level: 85 }
  ]
};

export const EXPERIENCE = [];

export const EDUCATION = [
  {
    school: 'SRM Institute of Science and Technology',
    degree: 'B.Sc Computer Science',
    period: '2024 - 2027',
    description: 'Focusing on Software Engineering, Artificial Intelligence and Web Technologies.'
  }
];

export const ACHIEVEMENTS = [
  {
    title: 'Hackathon Winner – NOOB HACKFEST',
    issuer: 'NOOB HACKFEST',
    date: '2024',
    description: 'Built AI-based surveillance system using TensorFlow & Firebase. Rank: 1st out of 285 participants.'
  }
];

export const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Senior Software Engineer @ TechCorp",
    quote: "Sudharsan's ability to translate complex AI requirements into seamless user interfaces is rare. His work on SignSpeak AI was particularly impressive.",
    image: "https://i.pravatar.cc/150?u=alex"
  },
  {
    name: "Sarah Chen",
    role: "Product Manager @ SRM Innovations",
    quote: "A highly dedicated developer who consistently delivers high-quality code. His attention to detail in UI/UX is world-class.",
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "James Wilson",
    role: "AI Research Lead",
    quote: "His technical proficiency in Python and React combined with a solid understanding of ML principles makes him a great asset to any team.",
    image: "https://i.pravatar.cc/150?u=james"
  }
];

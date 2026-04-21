import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, Users, Star, GitBranch } from 'lucide-react';

export const GitHubWidget = ({ username = 'dharsan432006-ops' }: { username?: string }) => {
  const [stats, setStats] = useState({ repos: 0, followers: 0, stars: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call for professional stats
    const fetchStats = async () => {
      try {
        // In a real app: 
        // const res = await fetch(`https://api.github.com/users/${username}`);
        // const data = await res.json();
        await new Promise(r => setTimeout(r, 1500));
        setStats({ repos: 34, followers: 82, stars: 156 });
      } catch (err) {
        console.error('Failed to fetch github stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [username]);

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-8 left-8 z-[200] hidden lg:block"
    >
      <div className="glass-card !bg-white/80 dark:!bg-black/60 !backdrop-blur-2xl !p-4 !rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl min-w-[200px]">
        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-100 dark:border-white/5">
          <Github size={18} className="text-gray-900 dark:text-white" />
          <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">GitHub Activity</span>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-sm animate-pulse w-full" />
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-sm animate-pulse w-2/3" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <GitBranch size={12} className="text-accent" />
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                <span className="block text-gray-900 dark:text-white text-sm">{stats.repos}</span>
                Repos
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={12} className="text-accent" />
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                <span className="block text-gray-900 dark:text-white text-sm">{stats.followers}</span>
                Followers
              </div>
            </div>
          </div>
        )}
        
        <a 
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          View Profile
        </a>
      </div>
    </motion.div>
  );
};

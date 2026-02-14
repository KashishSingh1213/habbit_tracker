import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, ExternalLink, Plus, Trash2, Hash, Code, Filter } from 'lucide-react';
import clsx from 'clsx';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DSATracker = () => {
    const [problems, setProblems] = useLocalStorage('dsa-problems', [
        { id: 1, title: 'Two Sum', platform: 'LeetCode', difficulty: 'Easy', topic: 'Array', status: 'done', notes: 'Hash map approach O(n)' },
        { id: 2, title: 'LRU Cache', platform: 'LeetCode', difficulty: 'Medium', topic: 'Design', status: 'pending', notes: '' },
        { id: 3, title: 'Merge K Lists', platform: 'LeetCode', difficulty: 'Hard', topic: 'Heap', status: 'pending', notes: '' },
    ]);

    const [filter, setFilter] = useState('All'); // All, Easy, Medium, Hard
    const [isAdding, setIsAdding] = useState(false);
    const [newProblem, setNewProblem] = useState({ title: '', platform: 'LeetCode', difficulty: 'Easy', topic: '' });

    const toggleStatus = (id) => {
        setProblems(prev => prev.map(p =>
            p.id === id ? { ...p, status: p.status === 'done' ? 'pending' : 'done' } : p
        ));
    };

    const addProblem = (e) => {
        e.preventDefault();
        if (!newProblem.title) return;
        setProblems(prev => [...prev, { ...newProblem, id: Date.now(), status: 'pending' }]);
        setIsAdding(false);
        setNewProblem({ title: '', platform: 'LeetCode', difficulty: 'Easy', topic: '' });
    };

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Easy': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
            case 'Medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
            case 'Hard': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
            default: return 'text-white/50 border-white/10';
        }
    };

    const filteredProblems = filter === 'All' ? problems : problems.filter(p => p.difficulty === filter);

    return (
        <div className="w-full max-w-3xl mx-auto h-full flex flex-col p-4 text-white overflow-y-auto custom-scrollbar pb-24">

            {/* Header & Controls */}
            <div className="flex justify-between items-end mb-8 relative">
                <div>
                    <h2 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 mb-1">
                        Code Vault
                    </h2>
                    <p className="text-xs text-blue-200/50 tracking-widest uppercase font-mono">Algorithm Mastery Log</p>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="text-right hidden sm:block">
                        <div className="text-2xl font-bold font-mono">{problems.filter(p => p.status === 'done').length}<span className="text-white/30">/{problems.length}</span></div>
                        <div className="text-[10px] uppercase tracking-widest opacity-40">Solved</div>
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`p-3 rounded-full border transition-all ${isAdding ? 'bg-white/20 border-white/40 rotate-45' : 'bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30'}`}
                    >
                        <Plus size={20} className={isAdding ? 'text-white' : 'text-blue-200'} />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
                {['All', 'Easy', 'Medium', 'Hard'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={clsx(
                            "px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-all",
                            filter === f
                                ? "bg-white text-black border-white shadow-lg shadow-white/10 scale-105"
                                : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:border-white/20"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Add Problem Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ height: 0, opacity: 0, mb: 0 }}
                        animate={{ height: 'auto', opacity: 1, mb: 24 }}
                        exit={{ height: 0, opacity: 0, mb: 0 }}
                        onSubmit={addProblem}
                        className="glass-panel p-6 border border-blue-500/20 overflow-hidden"
                    >
                        <div className="space-y-4">
                            <div>
                                <input
                                    placeholder="Problem Title"
                                    className="w-full bg-transparent border-b border-white/10 p-2 text-lg font-serif text-white focus:border-blue-500/50 outline-none placeholder:text-white/20 transition-colors"
                                    value={newProblem.title}
                                    onChange={e => setNewProblem({ ...newProblem, title: e.target.value })}
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <select
                                        className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white/90 outline-none focus:bg-white/10 transition-colors"
                                        value={newProblem.difficulty}
                                        onChange={e => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                                    >
                                        <option value="Easy" className="text-black">Easy</option>
                                        <option value="Medium" className="text-black">Medium</option>
                                        <option value="Hard" className="text-black">Hard</option>
                                    </select>
                                    <div className="absolute right-3 top-3 pointer-events-none opacity-50">
                                        <Filter size={14} />
                                    </div>
                                </div>
                                <input
                                    placeholder="Platform"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:bg-white/10 transition-colors placeholder:text-white/20"
                                    value={newProblem.platform}
                                    onChange={e => setNewProblem({ ...newProblem, platform: e.target.value })}
                                />
                            </div>

                            <input
                                placeholder="Topic / Tags"
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:bg-white/10 transition-colors placeholder:text-white/20"
                                value={newProblem.topic}
                                onChange={e => setNewProblem({ ...newProblem, topic: e.target.value })}
                            />

                            <button type="submit" className="w-full bg-blue-500/20 text-blue-200 py-3 rounded-lg text-sm font-bold border border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-500/50 transition-all uppercase tracking-widest">
                                Add to Vault
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* List */}
            <div className="space-y-3 flex-1">
                {filteredProblems.map(problem => (
                    <motion.div
                        layout
                        key={problem.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-panel p-4 flex items-center justify-between group hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 relative overflow-hidden"
                    >
                        {/* Subtle background pill for difficulty */}
                        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none ${problem.difficulty === 'Easy' ? 'bg-emerald-500' :
                                problem.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
                            }`} />

                        <div className="flex items-center gap-5 relative z-10">
                            <button
                                onClick={() => toggleStatus(problem.id)}
                                className={`transition-all duration-300 transform active:scale-90 ${problem.status === 'done' ? 'text-emerald-400 scale-110' : 'text-white/20 hover:text-white/50'}`}
                            >
                                {problem.status === 'done' ? <CheckCircle size={24} weight="fill" /> : <Circle size={24} />}
                            </button>

                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className={clsx("font-medium text-lg", problem.status === 'done' && "text-white/30 line-through decoration-white/20")}>
                                        {problem.title}
                                    </h3>
                                    <span className={clsx("text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold border", getDifficultyColor(problem.difficulty))}>
                                        {problem.difficulty}
                                    </span>
                                </div>
                                <div className="flex gap-4 text-[10px] text-white/40 font-mono">
                                    <span className="flex items-center gap-1.5"><Code size={12} /> {problem.platform}</span>
                                    {problem.topic && <span className="flex items-center gap-1.5"><Hash size={12} /> {problem.topic}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-3 z-10">
                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"><ExternalLink size={16} /></button>
                            <button className="p-2 hover:bg-rose-500/20 rounded-lg text-white/40 hover:text-rose-400 transition-colors"><Trash2 size={16} /></button>
                        </div>
                    </motion.div>
                ))}

                {filteredProblems.length === 0 && (
                    <div className="text-center py-12 opacity-30">
                        <Code size={48} className="mx-auto mb-4" />
                        <p className="text-sm font-mono uppercase tracking-widest">No Problems Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DSATracker;

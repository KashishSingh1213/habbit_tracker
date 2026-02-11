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
            case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-white/50';
        }
    };

    const filteredProblems = filter === 'All' ? problems : problems.filter(p => p.difficulty === filter);

    return (
        <div className="w-full max-w-2xl mx-auto h-full flex flex-col p-4">

            {/* Header & Controls */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Problem Vault
                    </h2>
                    <p className="text-xs text-white/50 tracking-widest uppercase">Mastery Log</p>
                </div>

                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['All', 'Easy', 'Medium', 'Hard'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={clsx(
                            "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                            filter === f
                                ? "bg-white text-black border-white"
                                : "bg-transparent text-white/50 border-white/10 hover:border-white/30"
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
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={addProblem}
                        className="mb-6 bg-white/5 border border-white/10 p-4 rounded-xl space-y-3 overflow-hidden"
                    >
                        <input
                            placeholder="Problem Title"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none"
                            value={newProblem.title}
                            onChange={e => setNewProblem({ ...newProblem, title: e.target.value })}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <select
                                className="bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white/70 outline-none"
                                value={newProblem.difficulty}
                                onChange={e => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                            <input
                                placeholder="Platform (e.g. LeetCode)"
                                className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                                value={newProblem.platform}
                                onChange={e => setNewProblem({ ...newProblem, platform: e.target.value })}
                            />
                            <input
                                placeholder="Topic"
                                className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                                value={newProblem.topic}
                                onChange={e => setNewProblem({ ...newProblem, topic: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-500/20 text-blue-300 py-2 rounded-lg text-sm font-bold border border-blue-500/30 hover:bg-blue-500/30">
                            Add Problem
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* List */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {filteredProblems.map(problem => (
                    <motion.div
                        key={problem.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-4 flex items-center justify-between group hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <button onClick={() => toggleStatus(problem.id)} className="text-white/30 hover:text-green-400 transition-colors">
                                {problem.status === 'done' ? <CheckCircle className="text-green-400" size={20} /> : <Circle size={20} />}
                            </button>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className={clsx("font-medium", problem.status === 'done' && "text-white/30 line-through")}>
                                        {problem.title}
                                    </h3>
                                    <span className={clsx("text-[10px] px-2 py-0.5 rounded-full border", getDifficultyColor(problem.difficulty))}>
                                        {problem.difficulty}
                                    </span>
                                </div>
                                <div className="flex gap-3 text-[10px] text-white/40 mt-1">
                                    <span className="flex items-center gap-1"><Code size={10} /> {problem.platform}</span>
                                    {problem.topic && <span className="flex items-center gap-1"><Hash size={10} /> {problem.topic}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button className="p-1 hover:text-white text-white/30"><ExternalLink size={14} /></button>
                            <button className="p-1 hover:text-red-400 text-white/30"><Trash2 size={14} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default DSATracker;

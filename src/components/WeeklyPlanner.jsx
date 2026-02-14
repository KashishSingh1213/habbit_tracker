import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Calendar, Clock, Target } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WeeklyPlanner = () => {
    const [priorities, setPriorities] = useLocalStorage('weekly-priorities', [
        { id: 1, text: 'Finish Project Nova', done: false },
        { id: 2, text: 'Call Mom', done: true },
    ]);
    const [intentions, setIntentions] = useLocalStorage('weekly-intentions', [
        { id: 1, text: 'Be present in meetings', done: false },
    ]);

    const [newPriority, setNewPriority] = useState('');
    const [newIntention, setNewIntention] = useState('');

    const addPriority = (e) => {
        e.preventDefault();
        if (!newPriority) return;
        setPriorities([...priorities, { id: Date.now(), text: newPriority, done: false }]);
        setNewPriority('');
    };

    const addIntention = (e) => {
        e.preventDefault();
        if (!newIntention) return;
        setIntentions([...intentions, { id: Date.now(), text: newIntention, done: false }]);
        setNewIntention('');
    };

    const togglePriority = (id) => {
        setPriorities(priorities.map(p => p.id === id ? { ...p, done: !p.done } : p));
    };

    // Calculate week progress
    const now = new Date();
    const dayIndex = now.getDay(); // 0 (Sun) - 6 (Sat)
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];
    const weekProgress = ((dayIndex + 1) / 7) * 100;

    return (
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col p-4 text-white custom-scrollbar overflow-y-auto pb-24">

            {/* Header Widget */}
            <div className="mb-8 p-8 glass-panel relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Clock size={120} />
                </div>

                <div className="z-10">
                    <h2 className="text-3xl font-light font-serif italic mb-2 text-white/90">Progress over Perfection</h2>
                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">{dayName.toUpperCase()}</span>
                        <span className="text-xs opacity-60 uppercase tracking-widest border px-2 py-0.5 rounded-full border-white/20">Weekly Sync</span>
                    </div>
                </div>

                <div className="w-full md:w-1/2 z-10">
                    <div className="flex justify-between text-xs uppercase tracking-widest opacity-50 mb-2">
                        <span>Week Progress</span>
                        <span>{Math.round(weekProgress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${weekProgress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-white/30 font-mono">
                        <span>SUN</span><span>SAT</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Priorities Section */}
                <div className="glass-panel p-6 min-h-[400px] flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-orange-400" />

                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-rose-500/20 rounded-lg text-rose-300">
                            <Target size={20} />
                        </div>
                        <h3 className="uppercase tracking-widest text-sm font-bold text-rose-100">Top Priorities</h3>
                    </div>

                    <div className="flex-1 space-y-3 mb-6">
                        {priorities.map(p => (
                            <motion.div
                                layout
                                key={p.id}
                                onClick={() => togglePriority(p.id)}
                                className={`flex items-center gap-3 cursor-pointer group/item p-3 rounded-xl transition-all ${p.done ? 'bg-white/5 opacity-50' : 'bg-white/10 hover:bg-white/20'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border border-white/20 flex items-center justify-center transition-all ${p.done ? 'bg-rose-500 border-rose-500 scale-110' : 'group-hover/item:border-rose-400'}`}>
                                    {p.done && <Check size={12} className="text-white" />}
                                </div>
                                <span className={`text-sm ${p.done ? 'line-through decoration-white/30' : ''}`}>{p.text}</span>
                            </motion.div>
                        ))}
                        {priorities.length === 0 && <p className="text-white/20 italic text-sm text-center py-4">No priorities set.</p>}
                    </div>

                    <form onSubmit={addPriority} className="relative mt-auto">
                        <input
                            type="text"
                            placeholder="Add a priority..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-4 pr-10 text-sm focus:outline-none focus:border-rose-400/50 transition-colors placeholder:text-white/20 text-white"
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value)}
                        />
                        <button type="submit" className="absolute right-3 top-3 text-white/20 hover:text-rose-400 transition-colors"><Plus size={18} /></button>
                    </form>
                </div>

                {/* Intentions Section */}
                <div className="glass-panel p-6 min-h-[400px] flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-yellow-400" />

                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-300">
                            <Calendar size={20} />
                        </div>
                        <h3 className="uppercase tracking-widest text-sm font-bold text-amber-100">Weekly Intentions</h3>
                    </div>

                    <div className="flex-1 space-y-3 mb-6">
                        <p className="text-xs text-white/40 italic mb-4 bg-white/5 p-3 rounded-lg border border-white/5 text-center">"What would make this week feel successful?"</p>
                        {intentions.map(i => (
                            <motion.div
                                layout
                                key={i.id}
                                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
                            >
                                <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] shrink-0" />
                                <span className="text-sm font-light text-white/90">{i.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    <form onSubmit={addIntention} className="relative mt-auto">
                        <input
                            type="text"
                            placeholder="Set an intention..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-4 pr-10 text-sm focus:outline-none focus:border-amber-400/50 transition-colors placeholder:text-white/20 text-white"
                            value={newIntention}
                            onChange={(e) => setNewIntention(e.target.value)}
                        />
                        <button type="submit" className="absolute right-3 top-3 text-white/20 hover:text-amber-400 transition-colors"><Plus size={18} /></button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default WeeklyPlanner;

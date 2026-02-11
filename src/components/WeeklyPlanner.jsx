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
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    // Rough estimate logic for visual
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

    return (
        <div className="w-full max-w-2xl mx-auto h-full flex flex-col p-4 text-white">

            {/* Header Widget */}
            <div className="mb-8 p-6 glass-panel relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Clock size={100} />
                </div>
                <h2 className="text-3xl font-light font-serif italic mb-2">Progress over Perfection</h2>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">{dayName.toUpperCase()}</span>
                    <span className="text-sm opacity-60 uppercase tracking-widest">Weekly Sync</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Priorities Section */}
                <div className="glass-panel p-6 min-h-[300px] flex flex-col">
                    <div className="flex items-center gap-2 mb-4 text-rose-300">
                        <Target size={18} />
                        <h3 className="uppercase tracking-widest text-xs font-bold">Top Priorities</h3>
                    </div>

                    <div className="flex-1 space-y-3 mb-4">
                        {priorities.map(p => (
                            <motion.div
                                layout
                                key={p.id}
                                onClick={() => togglePriority(p.id)}
                                className={`flex items-center gap-3 cursor-pointer group ${p.done ? 'opacity-40' : 'opacity-100'}`}
                            >
                                <div className={`w-5 h-5 rounded border border-white/20 flex items-center justify-center transition-colors ${p.done ? 'bg-rose-400 border-rose-400' : 'group-hover:border-white/50'}`}>
                                    {p.done && <Check size={12} className="text-black" />}
                                </div>
                                <span className={`text-sm ${p.done ? 'line-through' : ''}`}>{p.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    <form onSubmit={addPriority} className="relative">
                        <input
                            type="text"
                            placeholder="Add a priority..."
                            className="w-full bg-white/5 border-b border-white/10 p-2 text-sm focus:outline-none focus:border-rose-400/50 transition-colors placeholder:text-white/20"
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value)}
                        />
                        <button type="submit" className="absolute right-2 top-2 text-white/30 hover:text-white"><Plus size={16} /></button>
                    </form>
                </div>

                {/* Intentions Section */}
                <div className="glass-panel p-6 min-h-[300px] flex flex-col">
                    <div className="flex items-center gap-2 mb-4 text-amber-300">
                        <Calendar size={18} />
                        <h3 className="uppercase tracking-widest text-xs font-bold">Weekly Intentions</h3>
                    </div>

                    <div className="flex-1 space-y-3 mb-4">
                        <p className="text-xs text-white/40 italic mb-4">"What would make this week feel successful?"</p>
                        {intentions.map(i => (
                            <motion.div
                                layout
                                key={i.id}
                                className="flex items-start gap-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-200/50 mt-1.5 shrink-0" />
                                <span className="text-sm font-light">{i.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    <form onSubmit={addIntention} className="relative">
                        <input
                            type="text"
                            placeholder="Set an intention..."
                            className="w-full bg-white/5 border-b border-white/10 p-2 text-sm focus:outline-none focus:border-amber-400/50 transition-colors placeholder:text-white/20"
                            value={newIntention}
                            onChange={(e) => setNewIntention(e.target.value)}
                        />
                        <button type="submit" className="absolute right-2 top-2 text-white/30 hover:text-white"><Plus size={16} /></button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default WeeklyPlanner;

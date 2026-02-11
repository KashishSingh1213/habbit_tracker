import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Star, Mountain, Heart, Crown, Rocket } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const VisionBoard = () => {
    const [goals, setGoals] = useLocalStorage('vision-goals', [
        { id: 1, text: 'Launch my SaaS Product', category: 'Career', icon: Rocket, color: 'from-blue-500 to-cyan-500' },
        { id: 2, text: 'Run a Marathon', category: 'Health', icon: Heart, color: 'from-rose-500 to-pink-500' },
        { id: 3, text: 'Financial Freedom', category: 'Wealth', icon: Crown, color: 'from-amber-500 to-yellow-500' },
    ]);

    const [manifestations, setManifestations] = useLocalStorage('vision-manifestations', [
        'I attract abundance easily.',
        'I am capable of detailed, high-quality work.',
        'My energy is my currency.'
    ]);

    const [newManifestation, setNewManifestation] = useState('');

    const addManifestation = (e) => {
        e.preventDefault();
        if (!newManifestation) return;
        setManifestations([...manifestations, newManifestation]);
        setNewManifestation('');
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col p-4 text-white custom-scrollbar overflow-y-auto pb-24">

            {/* Header */}
            <div className="text-center mb-10">
                <h2 className="text-4xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200 mb-2">
                    2026 Vision
                </h2>
                <p className="text-xs uppercase tracking-[0.3em] opacity-50">Design Your Reality</p>
            </div>

            {/* Big Goals Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {goals.map((goal) => (
                    <motion.div
                        key={goal.id}
                        whileHover={{ y: -10, rotate: 1 }}
                        className={`relative overflow-hidden rounded-2xl p-6 glass-panel border-t border-white/20 shadow-2xl group`}
                    >
                        <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${goal.color} opacity-20 blur-2xl rounded-full group-hover:opacity-40 transition-opacity`} />

                        <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${goal.color} flex items-center justify-center mb-4 shadow-lg text-white`}>
                                <goal.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold font-serif mb-1">{goal.text}</h3>
                            <p className="text-xs opacity-50 uppercase tracking-widest">{goal.category}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Manifestation List */}
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="flex items-center gap-3 mb-6">
                    <Star className="text-yellow-200 fill-yellow-200/20" />
                    <h3 className="text-lg font-bold tracking-wide">Affirmations</h3>
                </div>

                <div className="space-y-4">
                    {manifestations.map((text, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-4 text-lg font-light italic opacity-80 hover:opacity-100 transition-opacity"
                        >
                            <span className="text-purple-400">✨</span>
                            "{text}"
                        </motion.div>
                    ))}
                </div>

                <form onSubmit={addManifestation} className="mt-8 border-t border-white/10 pt-4">
                    <input
                        value={newManifestation}
                        onChange={(e) => setNewManifestation(e.target.value)}
                        placeholder="Type a new affirmation..."
                        className="w-full bg-transparent text-sm p-2 outline-none placeholder:text-white/20 text-center"
                    />
                </form>
            </div>

            {/* Decorative Motivation */}
            <div className="mt-12 text-center opacity-30">
                <Mountain size={48} className="mx-auto mb-4" />
                <p className="text-[10px] uppercase tracking-[0.5em]">Keep Climbing</p>
            </div>

        </div>
    );
};

export default VisionBoard;

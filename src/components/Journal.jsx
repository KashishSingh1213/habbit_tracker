import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
    PenTool, Calendar, Sun, Moon,
    Smile, Frown, Meh, Heart
} from 'lucide-react';

const Journal = () => {
    // History: array of mood logs + short snippet
    const [entries, setEntries] = useLocalStorage('journal-entries', [
        { date: '2026-02-10', mood: 'Great', text: 'Started building Nova. Feeling energetic.' },
        { date: '2026-02-09', mood: 'Okay', text: 'Struggled with fatigue but pushed through.' },
    ]);
    const [newText, setNewText] = useState('');
    const [selectedMood, setSelectedMood] = useState('Great');

    // Typing Energy State
    const [typingHeat, setTypingHeat] = useState(0);

    // Heat decay effect
    React.useEffect(() => {
        const interval = setInterval(() => {
            setTypingHeat(prev => Math.max(0, prev - 2)); // Cool down
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const handleTyping = (e) => {
        setNewText(e.target.value);
        setTypingHeat(prev => Math.min(100, prev + 15)); // Heat up
    };

    // Calculate dynamic color based on heat (0 = Blue/Teal, 100 = Red/Orange)
    // 180 (Cyan) -> 0 (Red)
    const heatColor = `hsl(${180 - (typingHeat * 1.8)}, 100%, ${50 + (typingHeat * 0.1)}%)`;
    const glowIntensity = typingHeat / 5; // 0 to 20px

    const addEntry = (e) => {
        e.preventDefault();
        // Allow mood-only entries
        const today = new Date().toISOString().split('T')[0];
        setEntries([{ date: today, mood: selectedMood, text: newText }, ...entries]);
        setNewText('');
        setTypingHeat(0); // Reset heat on submit
    };

    const getMoodIcon = (mood) => {
        switch (mood) {
            case 'Great': return <Sun className="text-yellow-400" />;
            case 'Good': return <Smile className="text-green-400" />;
            case 'Okay': return <Meh className="text-blue-400" />;
            case 'Bad': return <Frown className="text-gray-400" />;
            default: return <Sun />;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col p-4 text-white overflow-y-auto custom-scrollbar pb-24">

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-emerald-200/90 mb-2">Daily Log</h2>
                    <p className="text-sm opacity-60">"Document your journey."</p>
                </div>
                <PenTool className="text-emerald-400 opacity-50" size={24} />
            </div>

            {/* Input Area with Typing Energy Effect */}
            <div
                className="glass-panel p-6 mb-8 relative group transition-all duration-300"
                style={{
                    borderColor: typingHeat > 5 ? heatColor : undefined,
                    boxShadow: typingHeat > 5 ? `0 0 ${glowIntensity}px ${heatColor}` : undefined
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs uppercase tracking-widest font-bold opacity-50">Today's Reflection</span>
                    <div className="flex gap-2">
                        {['Great', 'Good', 'Okay', 'Bad'].map(m => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setSelectedMood(m)}
                                className={`p-2 rounded-full transition-all ${selectedMood === m ? 'bg-white/20 scale-110 shadow-lg ring-1 ring-white/50' : 'opacity-40 hover:opacity-100'}`}
                            >
                                {getMoodIcon(m)}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={addEntry}>
                    <textarea
                        value={newText}
                        onChange={handleTyping}
                        placeholder="What went well today? What did you learn?"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 min-h-[100px] text-sm focus:border-emerald-400/50 outline-none transition-colors mb-4 placeholder:text-white/20 resize-none"
                        style={{
                            color: typingHeat > 30 ? '#fff' : 'rgba(255,255,255,0.9)',
                            // subtle text brightness increase with heat
                        }}
                    />
                    <div className="flex justify-between items-center">
                        <div className="h-1 w-32 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full transition-all duration-100"
                                style={{ width: `${typingHeat}%`, backgroundColor: heatColor }}
                            />
                        </div>
                        <button type="submit" className="bg-emerald-500/20 px-6 py-2 rounded-lg text-emerald-200 text-sm font-bold border border-emerald-500/30 hover:bg-emerald-500/30 transition-all">
                            Log Entry
                        </button>
                    </div>
                </form>
            </div>

            {/* Timeline */}
            <div className="space-y-6 relative ml-4 border-l border-white/10 pl-8 pb-10">
                {entries.map((entry, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative"
                    >
                        {/* Dot on timeline */}
                        <div className="absolute -left-[41px] top-2 w-5 h-5 rounded-full bg-black border border-white/20 flex items-center justify-center z-10 shadow-lg">
                            <div className="scale-75">{getMoodIcon(entry.mood)}</div>
                        </div>

                        <div className="glass-panel p-5 hover:bg-white/5 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-serif font-bold text-lg text-white/90">{entry.date}</span>
                                <span className={`text-[10px] uppercase px-2 py-0.5 rounded border border-white/10 ${entry.mood === 'Great' ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/50'}`}>{entry.mood}</span>
                            </div>
                            <p className="text-sm opacity-70 font-light leading-relaxed">{entry.text}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

        </div>
    );
};

export default Journal;

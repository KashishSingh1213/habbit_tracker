import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BatteryCharging, Zap, Target, Clock, AlertCircle } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

const CreateHabitModal = ({ isOpen, onClose }) => {
    const { addHabit } = useHabits();
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const [formData, setFormData] = useState({
        name: '',
        intention: '',
        category: 'mind', // mind, body, soul, focus
        difficulty: 'medium',
        energyCost: 0, // -1 (gains), 0 (neutral), 1 (drains)
        timeOfDay: 'anytime',
        minVersion: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addHabit(formData);
        onClose();
        // Reset form after delay
        setTimeout(() => {
            setStep(1);
            setFormData({ name: '', intention: '', category: 'mind', difficulty: 'medium', energyCost: 0, timeOfDay: 'anytime', minVersion: '' });
        }, 500);
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md bg-[#1e1b4b] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }} />

                <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
                    <X size={20} />
                </button>

                <form onSubmit={handleSubmit} className="mt-4">
                    <AnimatePresence mode="wait">

                        {/* Step 1: Basics */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-4"
                            >
                                <h2 className="text-xl font-bold text-white mb-6">Let's define a new ritual.</h2>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-blue-300 mb-1">What is it?</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="e.g. Morning Meditation"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-purple-300 mb-1">Why does it matter?</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. To find calm before chaos"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        value={formData.intention}
                                        onChange={e => setFormData({ ...formData, intention: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Energy & Cost */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <h2 className="text-xl font-bold text-white">How does it check your battery?</h2>

                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, energyCost: -1 })}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.energyCost === -1 ? 'bg-green-500/20 border-green-500' : 'bg-white/5 border-white/10 opacity-60'}`}
                                    >
                                        <BatteryCharging className="text-green-400" />
                                        <span className="text-xs">Gives Energy</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, energyCost: 0 })}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.energyCost === 0 ? 'bg-blue-500/20 border-blue-500' : 'bg-white/5 border-white/10 opacity-60'}`}
                                    >
                                        <Target className="text-blue-400" />
                                        <span className="text-xs">Neutral</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, energyCost: 1 })}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.energyCost === 1 ? 'bg-red-500/20 border-red-500' : 'bg-white/5 border-white/10 opacity-60'}`}
                                    >
                                        <Zap className="text-red-400" />
                                        <span className="text-xs">Drains Energy</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Difficulty & Time */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <h2 className="text-xl font-bold text-white">Effort & Timing</h2>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-3">Difficulty Level</label>
                                    <input
                                        type="range"
                                        min="1" max="3"
                                        step="1"
                                        className="w-full accent-purple-500"
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            const diff = val === 1 ? 'easy' : val === 2 ? 'medium' : 'hard';
                                            setFormData({ ...formData, difficulty: diff });
                                        }}
                                    />
                                    <div className="flex justify-between text-xs text-white/50 mt-2">
                                        <span>Easy</span>
                                        <span>Medium</span>
                                        <span>Hard</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-3">Ideal Time</label>
                                    <div className="flex gap-2">
                                        {['Morning', 'Afternoon', 'Evening', 'Anytime'].map(t => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, timeOfDay: t.toLowerCase() })}
                                                className={`px-3 py-2 rounded-lg text-xs border transition-all ${formData.timeOfDay === t.toLowerCase() ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/20'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Min Version */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-4"
                            >
                                <h2 className="text-xl font-bold text-white mb-2">The "Bad Day" Protocol</h2>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="text-yellow-400 shrink-0" size={20} />
                                        <p className="text-sm text-white/70">
                                            On low energy days, what is the <span className="text-white font-bold">minimum viable version</span> of this habit?
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-yellow-300 mb-1">Tiny Version</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Read just one paragraph"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                        value={formData.minVersion}
                                        onChange={e => setFormData({ ...formData, minVersion: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
                        {step > 1 ? (
                            <button type="button" onClick={prevStep} className="text-white/50 text-sm hover:text-white">Back</button>
                        ) : <div />}

                        {step < totalSteps ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                disabled={!formData.name}
                                className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all"
                            >
                                Create Ritual
                            </button>
                        )}
                    </div>

                </form>
            </motion.div>
        </div>
    );
};

export default CreateHabitModal;

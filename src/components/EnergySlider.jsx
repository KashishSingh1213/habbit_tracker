import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, BatteryCharging, Zap } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

const EnergySlider = () => {
    const { energyLevel, setEnergyLevel } = useHabits();
    const [isDragging, setIsDragging] = useState(false);

    // Calculate height percentage for the fill
    const heightPercent = `${energyLevel}%`;

    // Dynamic color based on energy
    const getEnergyColor = (level) => {
        if (level > 70) return '#10b981'; // Green
        if (level > 40) return '#f59e0b'; // Amber
        return '#ef4444'; // Red
    };

    const handleDrag = (event, info) => {
        // Map vertical drag to energy level (0-100)
        // Canvas/container height assumed to be ~300px for drag area
        // Negative Y is up (increasing energy), Positive Y is down (decreasing)

        // Using a simpler approach: Just a range input styled heavily or a specialized drag area
        // Let's use a specialized draggable handle constrain to Y axis
    };

    return (
        <div className="flex flex-col items-center gap-4 relative">
            <div className="absolute -left-16 rotate-[-90deg] text-xs font-mono tracking-widest text-slate-400 opacity-50">
                ENERGY LEVEL
            </div>

            <div className="relative w-12 h-64 bg-slate-800/50 rounded-full border border-white/10 overflow-hidden shadow-inner backdrop-blur-sm">
                {/* Background Fill */}
                <motion.div
                    className="absolute bottom-0 w-full rounded-b-full transition-colors duration-500"
                    style={{
                        height: heightPercent,
                        backgroundColor: getEnergyColor(energyLevel),
                        boxShadow: `0 0 20px ${getEnergyColor(energyLevel)}40`
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />

                {/* Draggable Handle (Using input range for accessibility & touch ease, styled transparently over) */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                    orient="vertical"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ns-resize z-20"
                    style={{ appearance: 'slider-vertical' }} // Webkit specific usually
                />

                {/* Visual Icons inside bar */}
                <div className="absolute inset-0 flex flex-col justify-between items-center py-4 pointer-events-none z-10 text-white/50">
                    <Zap size={16} className={energyLevel > 80 ? "text-white animate-pulse" : ""} />
                    <div className="h-px w-4 bg-white/20" />
                    <div className="h-px w-4 bg-white/20" />
                    <div className="h-px w-4 bg-white/20" />
                    <BatteryCharging size={16} className={energyLevel < 20 ? "text-red-400 animate-pulse" : ""} />
                </div>
            </div>

            <motion.div
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
                key={energyLevel}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                {energyLevel}%
            </motion.div>
        </div>
    );
};

export default EnergySlider;

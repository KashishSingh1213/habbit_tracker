import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, XCircle, Moon, Zap, BatteryCharging } from 'lucide-react';
import clsx from 'clsx';
import { useHabits } from '../context/HabitContext';

// Animation variants
const orbVariants = {
    idle: {
        y: [0, -10, 0],
        scale: [1, 1.05, 1],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    },
    hover: {
        scale: 1.15,
        boxShadow: "0px 0px 30px rgba(255, 255, 255, 0.4)",
        transition: { duration: 0.3 }
    }
};

const HabitOrb = ({ habit }) => {
    const { updateHabitStatus, energyLevel } = useHabits();
    const [dragDirection, setDragDirection] = useState(null);

    const orbSize = 80 + (habit.resilience * 2);
    const isRecoveryMode = energyLevel < 30;

    const handleDrag = (_, info) => {
        if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
            // Horizontal
            if (info.offset.x > 30) setDragDirection('right');
            else if (info.offset.x < -30) setDragDirection('left');
            else setDragDirection(null);
        } else {
            // Vertical
            if (info.offset.y < -30) setDragDirection('up');
            else if (info.offset.y > 30) setDragDirection('down');
            else setDragDirection(null);
        }
    };

    const handleDragEnd = (_, info) => {
        const { x, y } = info.offset;
        const threshold = 60; // Lower threshold for better UX

        if (Math.abs(x) > Math.abs(y)) {
            // Horizontal
            if (x > threshold) updateHabitStatus(habit.id, 'completed', 5);
            else if (x < -threshold) updateHabitStatus(habit.id, 'skipped_guilt_free', 0);
        } else {
            // Vertical
            if (y < -threshold) updateHabitStatus(habit.id, 'tried', 3); // Effort made
            else if (y > threshold) updateHabitStatus(habit.id, 'rest_day', 0); // Intentional rest
        }
        setDragDirection(null);
    };

    return (
        <div className="relative flex justify-center items-center w-[160px] h-[160px]">

            {/* Instruction Labels */}
            <AnimatePresence>
                {dragDirection === 'right' && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="absolute right-0 translate-x-full text-green-400 font-bold text-xs bg-black/50 px-2 py-1 rounded border border-green-500/30 whitespace-nowrap z-50">DID IT</motion.div>
                )}
                {dragDirection === 'left' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="absolute left-0 -translate-x-full text-stone-400 font-bold text-xs bg-black/50 px-2 py-1 rounded border border-stone-500/30 whitespace-nowrap z-50">SKIP</motion.div>
                )}
                {dragDirection === 'up' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-0 -translate-y-full text-blue-400 font-bold text-xs bg-black/50 px-2 py-1 rounded border border-blue-500/30 whitespace-nowrap z-50">TRIED</motion.div>
                )}
                {dragDirection === 'down' && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-0 translate-y-full text-purple-400 font-bold text-xs bg-black/50 px-2 py-1 rounded border border-purple-500/30 whitespace-nowrap z-50">REST</motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className={clsx(
                    "rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg backdrop-blur-md transition-shadow relative",
                    habit.status === 'completed' && 'bg-emerald-500/20 border border-emerald-400/50',
                    habit.status === 'tried' && 'bg-blue-500/20 border border-blue-400/50',
                    habit.status === 'rest_day' && 'bg-purple-500/20 border border-purple-400/50',
                    habit.status === 'skipped_guilt_free' && 'bg-stone-500/10 border border-stone-600/50',
                    habit.status === 'none' && 'bg-white/5 border border-white/10'
                )}
                style={{
                    width: Math.min(orbSize, 120),
                    height: Math.min(orbSize, 120),
                    boxShadow: dragDirection ? '0 0 40px rgba(255,255,255,0.2)' : '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                }}
                variants={orbVariants}
                animate="idle"
                whileHover="hover"
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragSnapToOrigin={true}
                dragElastic={0.4}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
            >
                {/* Status indicator ring */}
                <div className="absolute inset-0 rounded-full border border-white/5" />

                <div className="text-white flex flex-col items-center pointer-events-none p-2 text-center">
                    {/* Main Icon */}
                    {habit.status === 'completed' ? <CheckCircle size={24} className="text-emerald-400 drop-shadow-lg" /> :
                        habit.status === 'tried' ? <Sparkles size={24} className="text-blue-400 drop-shadow-lg" /> :
                            habit.status === 'rest_day' ? <Moon size={20} className="text-purple-400 drop-shadow-lg" /> :
                                habit.status === 'skipped_guilt_free' ? <XCircle size={20} className="text-stone-400 drop-shadow-lg" /> :
                                    <Sparkles size={24} className="opacity-40" />}

                    <span className="text-[10px] mt-2 font-medium tracking-widest uppercase opacity-90 leading-tight drop-shadow-md max-w-[90%]">
                        {isRecoveryMode && habit.minVersion ? (
                            <span className="text-yellow-300 animate-pulse">{habit.minVersion}</span>
                        ) : habit.name}
                    </span>
                </div>

                {/* Energy Cost Indicator (Small) */}
                {habit.energyCost !== 0 && (
                    <div className="absolute top-2 right-2 text-[10px] opacity-70">
                        {habit.energyCost > 0 ? <Zap size={10} className="text-red-400" /> : <BatteryCharging size={10} className="text-green-400" />}
                    </div>
                )}

            </motion.div>
        </div>
    );
};

export default HabitOrb;

import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { motion } from 'framer-motion';
import { format, getDaysInMonth, setDate, isSameDay } from 'date-fns';
import { Leaf } from 'lucide-react';

const categoryColors = {
    movement: 'bg-emerald-500',
    mind: 'bg-indigo-500',
    health: 'bg-sky-500',
    soul: 'bg-rose-500',
    work: 'bg-amber-600',
    life: 'bg-teal-600',
    default: 'bg-purple-500'
};

const MonthGrid = () => {
    const { habits, history, toggleHabitDate } = useHabits();
    const [currentDate] = useState(new Date()); // Stick to current month for now

    const daysInMonth = getDaysInMonth(currentDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const monthLabel = format(currentDate, 'MMMM').toLowerCase();

    const getStatus = (habitId, day) => {
        const dateStr = format(setDate(currentDate, day), 'yyyy-MM-dd');
        const entry = history.find(h => h.date === dateStr && h.habitId === habitId);
        return entry ? entry.status : 'none';
    };

    const handleToggle = (habitId, day) => {
        const dateStr = format(setDate(currentDate, day), 'yyyy-MM-dd');
        const currentStatus = getStatus(habitId, day);
        const newStatus = currentStatus === 'completed' ? 'none' : 'completed';
        toggleHabitDate(habitId, dateStr, newStatus);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-8 glass-panel overflow-visible min-h-[600px] relative">

            {/* Decorative Header */}
            <div className="flex flex-col items-center mb-10 relative">
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-5 pointer-events-none select-none overflow-hidden">
                    <span className="text-[120px] md:text-[200px] font-handwriting text-white blur-sm transform -rotate-6 whitespace-nowrap">tracker</span>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                    <Leaf className="text-emerald-300/80 transform -rotate-45" size={32} strokeWidth={1.5} />
                    <h2 className="text-5xl md:text-7xl font-light text-white drop-shadow-lg tracking-tighter" style={{ fontFamily: '"Dancing Script", cursive' }}>
                        habit tracker
                    </h2>
                    <Leaf className="text-emerald-300/80 transform rotate-12 scale-x-[-1]" size={32} strokeWidth={1.5} />
                </div>
                <div className="mt-2 px-8 py-1 border-b border-white/30 backdrop-blur-md">
                    <span className="text-xl tracking-[0.4em] uppercase font-light text-white/80">{monthLabel}</span>
                </div>
            </div>

            <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div className="min-w-[900px] border border-white/20 bg-white/5 rounded-xl backdrop-blur-sm p-6 relative shadow-2xl">
                    {/* Header Row */}
                    <div className="grid grid-cols-[180px_repeat(31,1fr)] gap-0 border-b border-white/20 mb-2">
                        <div className="font-handwriting text-2xl text-white/60 pr-4 pb-2 text-right self-end" style={{ fontFamily: '"Dancing Script", cursive' }}>habits</div>
                        {days.map(day => (
                            <div key={day} className="text-center text-xs opacity-60 font-mono pb-2 border-l border-white/10 flex items-end justify-center h-12">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Habit Rows */}
                    <div className="flex flex-col">
                        {habits.map((habit) => {
                            // Priority: habit.color -> category color -> default
                            const activeColor = habit.color ? habit.color : (categoryColors[habit.category] || categoryColors.default);

                            return (
                                <div key={habit.id} className="grid grid-cols-[180px_repeat(31,1fr)] items-center group hover:bg-white/5 transition-colors duration-200 py-[2px]">
                                    <div
                                        className="text-right pr-4 text-2xl font-handwriting text-white/90 group-hover:text-white transition-colors truncate"
                                        style={{ fontFamily: '"Dancing Script", cursive' }}
                                    >
                                        {habit.name}
                                    </div>

                                    {days.map(day => {
                                        const status = getStatus(habit.id, day);
                                        const isCompleted = status === 'completed';
                                        const isToday = isSameDay(setDate(currentDate, day), new Date());

                                        return (
                                            <div key={day} className="h-8 flex items-center justify-center border-l border-white/5 relative">
                                                {isToday && <div className="absolute inset-0 bg-yellow-400/10 pointer-events-none" />}

                                                <motion.button
                                                    whileTap={{ scale: 0.8 }}
                                                    onClick={() => handleToggle(habit.id, day)}
                                                    className={`
                            w-5 h-5 flex items-center justify-center transition-all duration-300 rounded-[2px]
                            ${isCompleted ? `${activeColor} shadow-md opacity-90 scale-90` : 'bg-white/5 hover:bg-white/10 scale-75'}
                          `}
                                                >
                                                </motion.button>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {habits.length === 0 && (
                <div className="text-center py-10 opacity-50 font-handwriting text-2xl">
                    No habits yet...
                </div>
            )}
        </div>
    );
};

export default MonthGrid;

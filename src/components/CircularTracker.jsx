import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { motion } from 'framer-motion';
import { format, setDate } from 'date-fns';
import { Check } from 'lucide-react';

const CircularTracker = () => {
    const { habits, history, toggleHabitDate, weeklyHabits, toggleWeeklyHabit, monthlyHabits, toggleMonthlyHabit, addMonthlyHabit } = useHabits();
    const [currentDate] = useState(new Date());

    const daysInMonth = 31; // Image shows 1-31
    const centerX = 300;
    const centerY = 300;
    // Increase max radius to fit more content if needed, but keep it within viewbox
    const maxRadius = 250;
    const minRadius = 80;
    const trackWidth = (maxRadius - minRadius) / habits.length;

    const getStatus = (habitId, day) => {
        // Handling day overflow for months with < 31 days just by date object logic (it rolls over), 
        // but for visual consistency with the image (1-31), we'll just check if the date is valid for this month.
        // If we are in Feb, day 30 might wrap to March 2. 
        // Visual tracker usually just lists 1-31. Let's assume strict 1-31 visual.

        // We will construct the date. If it rolls over to next month, we count it as 'none' or handle it.
        // For simplicity:
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (targetDate.getMonth() !== currentDate.getMonth()) return 'none'; // Date doesn't exist in this month

        const dateStr = format(targetDate, 'yyyy-MM-dd');
        const entry = history.find(h => h.date === dateStr && h.habitId === habitId);
        return entry ? entry.status : 'none';
    };

    const handleToggle = (habitId, day) => {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (targetDate.getMonth() !== currentDate.getMonth()) return;

        const dateStr = format(targetDate, 'yyyy-MM-dd');
        const currentStatus = getStatus(habitId, day);
        const newStatus = currentStatus === 'completed' ? 'none' : 'completed';
        toggleHabitDate(habitId, dateStr, newStatus);
    };

    // Helper to create arc path
    const describeArc = (x, y, radius, startAngle, endAngle) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    };

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    // Calculate segment angle
    // Total usable angle: The image shows a full circle with a cut or a full circle.
    // The numbers 1-31 go around. Let's do a 270 degree arc to leave room for labels on the left?
    // Actually, in the image, the labels are just lists on the left, but lines point to the rings.
    // The rings are a "C" shape.
    // Let's use 260 degrees, starting from roughly -130 to +130? 
    // Visual: 1 is at top left (~10 o'clock), 31 is at bottom left (~8 o'clock).
    // So opening is on the left.
    // Angles: 0 is top. 
    // Let's start at -160 (roughly 7 o'clock) and go to +160 (roughly 5 o'clock) ? No that's bottom.
    // Let's start at 200 degrees (bottom left) and go clockwise to 160 (bottom right)? 
    // Image: 1 is top, 31 is bottom. It's a C shape opening to the LEFT.
    // So start angle: ~20 degrees? End angle: ~340 degrees?
    // Let's try Start: 30, End: 330. (0 is top).
    // The text 1-31 is on the OUTER rim.

    // Revised angles for "C" shape opening Left:
    // 0 deg is Top/North.
    // We want opening on West (270 deg).
    // So start from ~200 deg (SSW) to ~340 deg (NNW)? No that's small.
    // Start from 45 deg (NE) -> 135 (SE) -> 225 (SW) -> 315 (NW).
    // Let's do: Start 40 deg, go CW to 320 deg. Total 280 deg.
    // Wait, image shows 1 at top-ish.
    // Let's define: 1 is at -30 deg (roughly 11 o'clock). 31 is at -150 deg (roughly 7 o'clock).
    // So we go CLOCKWISE from 1 to 31.
    // Start Angle: -30. End Angle: -330? (That's almost full circle).
    // Let's try a gap on the LEFT side.
    // Start: 20 deg (just right of top). End: 340 deg? 
    // Let's try: Start at 15 degrees, go to 345 degrees. Gap at top.
    // Image: The gap is where the text labels lines come in. They come from left.
    // So gap is on LEFT.
    // Angle 0 is Up.
    // 1 is at ~30 deg? No, 1 is top-left.
    // Let's assume standard math notation: 0 is East.
    // We want gap at West (180).
    // So start at 200, go to 160?
    // Let's stick to SVG coords where 0 is -90deg (North).
    // Let's try: Start 20 deg, End 340 deg. (Gap at top).
    // User image: Gap is on the LEFT.
    // So we want the arc to cover Right side.
    // Start: -150 (bottom left). End: -30 (top left). Long way round.
    // Angle range: 200 degrees?
    // Let's look at the image again. It has 31 segments. 
    // If it's a full circle, each day is ~11.6 deg.
    // If it's a semi-circle, it's ~5.8 deg.
    // The cells look fairly square-ish.
    // Let's do a 270 degree arc opening to the left.
    // Start Angle: 45 (Top Right)
    // End Angle: 315 (Bottom Right)? No that leaves huge gap.
    // Let's try: Start -140 (Bottom Left), go clockwise to -40 (Top Left)? 
    // No, that's the gap.
    // We want the FILLED part to be the right side.
    // Start: -40 (Top Left). Go CW to -140 (Bottom Left)? No that's the gap.
    // Start: -40. Go CW to 220? That is 260 degrees.

    // Full circle logic
    const anglePerSegment = 360 / daysInMonth;

    // Helper to get angle for day index (0 to 30)
    // 0 starts at top (-90 degrees in SVG, but our helper handles the offset)
    const getAngle = (index) => {
        return index * anglePerSegment;
    };

    // Calculate today's progress for the center display
    const todayStr = format(currentDate, 'yyyy-MM-dd');
    const todayHabitsCount = habits.length;
    const completedTodayCount = habits.filter(h => {
        const entry = history.find(entry => entry.date === todayStr && entry.habitId === h.id);
        return entry?.status === 'completed';
    }).length;
    const completionPercentage = Math.round((completedTodayCount / todayHabitsCount) * 100) || 0;

    return (
        <div className="w-full flex flex-col xl:flex-row gap-8 p-4 text-slate-800">

            {/* LEFT SIDE: CIRCULAR TRACKER */}
            <div className="flex-1 glass-panel p-6 relative overflow-visible flex flex-col items-center justify-center min-h-[600px]">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none rounded-2xl" />

                <div className="flex flex-col items-center relative z-10 w-full">
                    <h2 className="text-4xl font-serif font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">
                        Habit Cycles
                    </h2>

                    <div className="flex flex-col lg:flex-row items-center justify-center w-full relative mt-8">

                        {/* Habit Labels (Left side lines) */}
                        <div className="hidden lg:flex flex-col justify-center items-end mr-4 space-y-1 text-right text-xs font-handwriting h-[500px]" style={{ width: '150px' }}>
                            {habits.map((habit, index) => (
                                <div key={habit.id} className="h-6 flex items-center justify-end w-full relative group">
                                    <span className="mr-2 whitespace-nowrap overflow-visible text-white/80 group-hover:text-white transition-colors" style={{ fontFamily: '"Dancing Script", cursive', fontSize: '1.2rem' }}>{habit.name}</span>
                                    <div className={`w-12 h-[1px] ${habit.color ? habit.color.replace('bg-', 'bg-') : 'bg-gray-400'} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                                </div>
                            ))}
                        </div>

                        {/* The SVG Chart */}
                        <div className="relative">
                            <svg width="600" height="600" viewBox="0 0 600 600" className="transform -rotate-90 drop-shadow-2xl">
                                {/* CENTER INFO ORB ("Something New") */}
                                {/* We rotate it back 90 deg so text is upright because the whole SVG is rotated -90 */}
                                <g transform={`rotate(90, ${centerX}, ${centerY})`}>
                                    <circle cx={centerX} cy={centerY} r={minRadius - 10} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" className="backdrop-blur-sm" />
                                    <text x={centerX} y={centerY - 15} textAnchor="middle" className="text-xl font-bold font-serif fill-indigo-200/80">
                                        {format(currentDate, 'MMMM d')}
                                    </text>
                                    <text x={centerX} y={centerY + 10} textAnchor="middle" className="text-5xl font-bold fill-white filter drop-shadow-lg font-handwriting">
                                        {completionPercentage}%
                                    </text>
                                    <text x={centerX} y={centerY + 30} textAnchor="middle" className="text-[10px] uppercase tracking-widest fill-white/40">
                                        DONE TODAY
                                    </text>
                                </g>

                                {/* Outer Ring Numbers */}
                                {Array.from({ length: 31 }).map((_, i) => {
                                    const startA = getAngle(i);
                                    const endA = getAngle(i + 1);
                                    const midA = startA + (anglePerSegment / 2);
                                    const rad = maxRadius + 20;
                                    const pos = polarToCartesian(centerX, centerY, rad, midA);

                                    return (
                                        <g key={i}>
                                            <text
                                                x={pos.x}
                                                y={pos.y}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="text-[10px] font-bold fill-white/50"
                                                style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `rotate(${midA + 90}deg)` }}
                                            >
                                                {i + 1}
                                            </text>
                                            <path
                                                d={describeArc(centerX, centerY, maxRadius + 10, startA, endA)}
                                                fill="none"
                                                stroke="rgba(255,255,255,0.1)"
                                                strokeWidth="20"
                                                className="opacity-50"
                                            />
                                        </g>
                                    );
                                })}

                                {/* Grid Lines (Radial) */}
                                {Array.from({ length: 32 }).map((_, i) => {
                                    const angle = getAngle(i);
                                    const start = polarToCartesian(centerX, centerY, minRadius, angle);
                                    const end = polarToCartesian(centerX, centerY, maxRadius, angle);
                                    return <line key={i} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
                                })}

                                {/* Habits Rings */}
                                {habits.map((habit, hIndex) => {
                                    // Outer to Inner? Or Inner to Outer?
                                    // Image shows top items correspond to outer rings usually. 
                                    // Let's do Outer = first habit.
                                    const rOuter = maxRadius - (hIndex * ((maxRadius - minRadius) / habits.length));
                                    const rInner = rOuter - ((maxRadius - minRadius) / habits.length);

                                    // Ring Path (background)
                                    // const ringPath = describeArc(centerX, centerY, (rOuter + rInner) / 2, 15, 315);

                                    return (
                                        <g key={habit.id}>
                                            {/* Concentric Circle Lines */}
                                            <path d={describeArc(centerX, centerY, rInner, 0, 359.9)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                                            {Array.from({ length: 31 }).map((_, dIndex) => {
                                                const day = dIndex + 1;
                                                const status = getStatus(habit.id, day);
                                                const isCompleted = status === 'completed';

                                                const sa = getAngle(dIndex);
                                                const ea = getAngle(dIndex + 1);

                                                // Click target
                                                // We need a thick stroke or a filled arc
                                                // const arcPath = describeArc(centerX, centerY, (rOuter + rInner) / 2, sa, ea);

                                                // Specific color for habit
                                                const colorMap = {
                                                    'bg-cyan-200': 'text-cyan-200', 'bg-orange-300': 'text-orange-300',
                                                    'bg-rose-300': 'text-rose-300', 'bg-yellow-200': 'text-yellow-200',
                                                    'bg-stone-400': 'text-stone-400', 'bg-teal-300': 'text-teal-300',
                                                    'bg-orange-200': 'text-orange-200', 'bg-purple-300': 'text-purple-300',
                                                    'bg-amber-200': 'text-amber-200', 'bg-stone-500': 'text-stone-500',
                                                    'bg-emerald-300': 'text-emerald-300', 'bg-orange-400': 'text-orange-400',
                                                    'bg-fuchsia-300': 'text-fuchsia-300', 'bg-cyan-400': 'text-cyan-400',
                                                    'bg-sky-400': 'text-sky-400', 'bg-teal-400': 'text-teal-400', 'bg-purple-400': 'text-purple-400',
                                                    'bg-red-500': 'text-red-500', 'bg-orange-400': 'text-orange-400', 'bg-yellow-400': 'text-yellow-400',
                                                    'bg-green-400': 'text-green-400', 'bg-emerald-500': 'text-emerald-500', 'bg-blue-600': 'text-blue-600'
                                                };
                                                const txtColor = colorMap[habit.color] || 'text-white';

                                                return (
                                                    <g key={day} onClick={() => handleToggle(habit.id, day)} className="cursor-pointer hover:opacity-100 opacity-90 transition-opacity">
                                                        <path
                                                            d={describeArc(centerX, centerY, (rOuter + rInner) / 2, sa + 0.5, ea - 0.5)}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={(rOuter - rInner) - 3}
                                                            className={`${isCompleted ? txtColor : 'text-white/5 hover:text-white/20'} transition-all duration-300`}
                                                            strokeLinecap="round"
                                                        />
                                                    </g>
                                                );
                                            })}
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: WEEKLY & MONTHLY */}
            <div className="w-full xl:w-96 flex flex-col gap-8">

                {/* WEEKLY HABITS CARD */}
                <div className="glass-panel p-6">
                    <div className="border border-white/20 rounded-lg overflow-hidden">
                        <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
                            <span className="font-bold text-xs tracking-widest text-white/60">MONTH</span>
                            <span className="font-handwriting text-xl text-white">{format(currentDate, 'MMMM')}</span>
                        </div>
                        <div className="text-center font-bold border-b border-white/10 py-2 bg-white/5 text-xs tracking-widest text-white/80">WEEKLY GOALS</div>

                        {/* Table Header */}
                        <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] text-center text-[10px] font-bold bg-white/10 text-white/70 py-2">
                            <div className="text-left pl-3">TASK</div>
                            <div>W1</div><div>W2</div><div>W3</div><div>W4</div><div>W5</div>
                        </div>

                        {/* Rows */}
                        {weeklyHabits.map((h) => (
                            <div key={h.id} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] text-center border-b border-white/10 items-center h-10 hover:bg-white/5 transition-colors">
                                <div className="text-left pl-3 font-handwriting text-lg leading-none pt-1 truncate text-white/90">{h.name}</div>
                                {['w1', 'w2', 'w3', 'w4', 'w5'].map(week => (
                                    <div key={week} className="flex items-center justify-center cursor-pointer h-full border-l border-white/5" onClick={() => toggleWeeklyHabit(h.id, week)}>
                                        {h.history[week] ? (
                                            <div className={`w-3 h-3 rounded-full ${h.color.replace('bg-', 'bg-')} shadow-[0_0_8px_rgba(255,255,255,0.5)]`}></div>
                                        ) : (
                                            <div className="w-1 h-1 rounded-full bg-white/10"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* MONTHLY HABITS CARD */}
                <div className="glass-panel p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-full pointer-events-none" />

                    <h3 className="text-center font-bold mb-6 text-xs uppercase tracking-[0.2em] text-white/50 border-b border-white/10 pb-2">Monthly Targets</h3>
                    <div className="space-y-4">
                        {monthlyHabits.map(h => (
                            <div key={h.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => toggleMonthlyHabit(h.id)}>
                                <div className={`w-6 h-6 border border-white/30 rounded flex items-center justify-center transition-all ${h.completed ? `${h.color} border-transparent shadow-[0_0_10px_rgba(255,255,255,0.3)]` : 'bg-transparent group-hover:border-white/60'}`}>
                                    {h.completed && <Check size={14} className="text-white" />}
                                </div>
                                <span className={`${h.completed ? 'line-through opacity-40' : 'opacity-90'} font-handwriting text-xl text-white transition-all`}>{h.name}</span>
                            </div>
                        ))}

                        {/* Add New Monthly Habit Input */}
                        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10 opacity-60 hover:opacity-100 transition-opacity">
                            <Plus size={18} className="text-white/50" />
                            <input
                                type="text"
                                placeholder="Add new target..."
                                className="font-handwriting text-xl bg-transparent border-b border-white/20 w-full focus:outline-none placeholder-white/30 text-white focus:border-white/50 transition-colors pb-1"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        addMonthlyHabit(e.target.value.trim());
                                        e.target.value = '';
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CircularTracker;

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Brain, Zap, Moon } from 'lucide-react';
import { useHabits, HabitProvider } from './context/HabitContext';
import HabitOrb from './components/HabitOrb';
import EnergySlider from './components/EnergySlider';
import './index.css';

import CreateHabitModal from './components/CreateHabitModal';
import DSATracker from './components/DSATracker';
import WeeklyPlanner from './components/WeeklyPlanner';
import BookTracker from './components/BookTracker';
import VisionBoard from './components/VisionBoard';
import Journal from './components/Journal';
import MonthGrid from './components/MonthGrid';
import CircularTracker from './components/CircularTracker';
import { Plus, LayoutGrid, Database, Calendar, BookOpen, Target, PenTool, Grid3X3, CircleDashed } from 'lucide-react';

const AppContent = () => {
  const { habits, energyLevel, mood, setMood, totalResilience } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('rituals'); // 'rituals', 'tracker', 'spiral', 'planner', 'vision', 'journal', 'library', 'problems'

  // Dynamic Background based on Energy Level
  useEffect(() => {
    // Map energy (0-100) to hue shift
    const hue = 280 - (energyLevel * 1.2);
    const saturation = energyLevel < 30 ? '30%' : '60%'; // Desaturate when low energy (Recovery Mode)
    const lightness = energyLevel < 30 ? '15%' : '20%';

    document.documentElement.style.setProperty('--hue-energy', hue);
    document.body.style.background = `
      radial-gradient(circle at 50% 30%,
        hsl(${hue}, ${saturation}, ${lightness}),
        hsl(${hue + 40}, ${parseInt(saturation) - 10}%, 10%),
        #0f0c29
      )
    `;
  }, [energyLevel]);

  // Mood Selection UI
  const moods = [
    { name: 'Tired', icon: Moon, color: 'text-purple-400' },
    { name: 'Calm', icon: Smile, color: 'text-blue-400' },
    { name: 'Focused', icon: Brain, color: 'text-cyan-400' },
    { name: 'Energetic', icon: Zap, color: 'text-yellow-400' },
  ];

  const isRecoveryMode = energyLevel < 30;

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto min-h-screen px-4 py-4 flex flex-col items-center justify-start text-white overflow-hidden font-sans">

      {/* Recovery Mode Indicator */}
      <AnimatePresence>
        {isRecoveryMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 bg-purple-900/40 border border-purple-500/30 text-purple-200 px-4 py-1 rounded-full text-xs font-medium tracking-wide shadow-lg backdrop-blur-md z-50 flex items-center gap-2"
          >
            <Moon size={12} />
            <span>Recovery Mode Active</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <header className="w-full flex justify-between items-start mb-6 z-20 mt-8 px-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight glow-text">
            {totalResilience}
          </h1>
          <p className="text-sm font-light uppercase tracking-widest text-white/50">Resilience Score</p>
        </div>

        {/* Mood Selector (Mini) */}
        <div className="flex gap-4">
          {moods.map((m) => (
            <motion.button
              key={m.name}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMood(m.name)}
              className={`p-2 rounded-full glass-panel transition-all ${mood === m.name ? 'bg-white/20 scale-110 shadow-lg' : 'opacity-50'}`}
            >
              <m.icon size={20} className={m.color} />
            </motion.button>
          ))}
        </div>
      </header>

      {/* Navigation Tabs - Scrollable on mobile */}
      <div className="w-full overflow-x-auto pb-2 mb-4 z-30 custom-scrollbar px-4">
        <div className="flex gap-4 min-w-max mx-auto justify-center">
          <button
            onClick={() => setActiveTab('rituals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === 'rituals' ? 'bg-white/20 text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}
          >
            <LayoutGrid size={16} /> Rituals
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === 'tracker' ? 'bg-indigo-500/20 text-indigo-100 shadow-lg' : 'text-white/40 hover:text-white/70'}`}
          >
            <Grid3X3 size={16} /> Month
          </button>
          <button
            onClick={() => setActiveTab('spiral')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === 'spiral' ? 'bg-orange-500/20 text-orange-100 shadow-lg' : 'text-white/40 hover:text-white/70'}`}
          >
            <CircleDashed size={16} /> Spiral
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === 'planner' ? 'bg-rose-500/20 text-rose-100 shadow-lg' : 'text-white/40 hover:text-white/70'}`}
          >
            <Calendar size={16} /> Planner
          </button>
          <button
            onClick={() => setActiveTab('vision')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === 'vision' ? 'bg-purple-500/20 text-purple-100 shadow-lg' : 'text-white/40 hover:text-white/70'}`}
          >
            <Target size={16} /> Vision
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === 'journal' ? 'bg-emerald-500/20 text-emerald-100 shadow-lg' : 'text-white/40 hover:text-white/70'}`}
          >
            <PenTool size={16} /> Journal
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === 'library' ? 'bg-amber-500/20 text-amber-100 shadow-lg' : 'text-white/40 hover:text-white/70'}`}
          >
            <BookOpen size={16} /> Library
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === 'problems' ? 'bg-cyan-500/20 text-cyan-100 shadow-lg' : 'text-white/40 hover:text-white/70'}`}
          >
            <Database size={16} /> Vault
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col justify-start items-center relative overflow-visible min-h-[500px]">

        <AnimatePresence mode="wait">
          {activeTab === 'rituals' && (
            <motion.div
              key="rituals"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full flex flex-col items-center max-w-md"
            >
              {/* Dashboard Today Overview */}
              <div className="w-full mb-8 glass-panel p-6 relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-light">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</h2>
                    <p className="text-sm opacity-60 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-bold">{habits.filter(h => h.status === 'completed').length}</span>
                    <span className="text-xl opacity-50">/{habits.length}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(habits.filter(h => h.status === 'completed').length / Math.max(habits.length, 1)) * 100}%` }}
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                  />
                </div>

                <p className="text-xs text-center mt-4 opacity-40 uppercase tracking-widest">
                  {habits.filter(h => h.status === 'completed').length === habits.length ? "All Rituals Complete" : "Swipe Orbs to Log"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 w-full place-items-center pb-24">
                <AnimatePresence>
                  {habits.map((habit, index) => (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, scale: 0.5, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                      className="relative group"
                    >
                      <HabitOrb habit={habit} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeTab === 'tracker' && (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, scaling: 0.95 }}
              animate={{ opacity: 1, scaling: 1 }}
              exit={{ opacity: 0, scaling: 0.95 }}
              className="w-full h-full"
            >
              <MonthGrid />
            </motion.div>
          )}

          {activeTab === 'spiral' && (
            <motion.div
              key="spiral"
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 5 }}
              className="w-full h-full overflow-y-auto"
            >
              <CircularTracker />
            </motion.div>
          )}

          {activeTab === 'planner' && (
            <motion.div
              key="planner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full h-full"
            >
              <WeeklyPlanner />
            </motion.div>
          )}

          {activeTab === 'vision' && (
            <motion.div
              key="vision"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full h-full"
            >
              <VisionBoard />
            </motion.div>
          )}

          {activeTab === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full h-full"
            >
              <Journal />
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full h-full"
            >
              <BookTracker />
            </motion.div>
          )}

          {activeTab === 'problems' && (
            <motion.div
              key="problems"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full max-w-2xl"
            >
              <DSATracker />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer Area - Energy Slider (Only on Rituals Tab) */}
      {activeTab === 'rituals' && (
        <footer className="w-full flex justify-center items-end h-32 relative z-0 mt-4 mb-4 pointer-events-none">
          <div className="pointer-events-auto scale-75 origin-bottom">
            <EnergySlider />
          </div>
        </footer>
      )}

      {/* FAB for Adding Habit (Only on Rituals Tab) */}
      {activeTab === 'rituals' && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg shadow-purple-500/40 z-50 border border-white/20 pointer-events-auto"
        >
          <Plus size={24} />
        </motion.button>
      )}

      <AnimatePresence>
        {isModalOpen && <CreateHabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>

      {/* Floating particles/stars could go here */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {/* Simple CSS stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-20 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDuration: `${Math.random() * 5 + 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

const App = () => (
  <HabitProvider>
    <AppContent />
  </HabitProvider>
);

export default App;

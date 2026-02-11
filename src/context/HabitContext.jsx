import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

const HabitContext = createContext();

export const useHabits = () => useContext(HabitContext); // Custom hook to consume context

const initialHabits = [
  { id: '1', name: 'water', intention: 'Hydrate body', category: 'health', icon: 'Droplets', color: 'bg-cyan-200', resilience: 5, streak: 0, difficulty: 'easy', energyCost: 1, minVersion: '1 glass' },
  { id: '2', name: 'stretching', intention: 'Flexibility', category: 'movement', icon: 'Activity', color: 'bg-orange-300', resilience: 5, streak: 0, difficulty: 'easy', energyCost: 1, minVersion: '1 min stretch' },
  { id: '3', name: 'log food', intention: 'Mindful eating', category: 'health', icon: 'Utensils', color: 'bg-rose-300', resilience: 10, streak: 0, difficulty: 'medium', energyCost: 2, minVersion: 'Log 1 meal' },
  { id: '4', name: 'walking', intention: 'Daily movement', category: 'movement', icon: 'Footprints', color: 'bg-yellow-200', resilience: 10, streak: 0, difficulty: 'medium', energyCost: 2, minVersion: '5 min walk' },
  { id: '5', name: 'instagram', intention: 'Limit usage', category: 'mind', icon: 'Smartphone', color: 'bg-stone-400', resilience: 5, streak: 0, difficulty: 'medium', energyCost: 1, minVersion: 'Check once' },
  { id: '6', name: 'facebook', intention: 'Connect', category: 'mind', icon: 'Facebook', color: 'bg-teal-300', resilience: 5, streak: 0, difficulty: 'medium', energyCost: 1, minVersion: 'Check once' },
  { id: '7', name: 'pinterest', intention: 'Inspiration', category: 'mind', icon: 'Layout', color: 'bg-orange-200', resilience: 5, streak: 0, difficulty: 'easy', energyCost: 1, minVersion: 'Pin 1 item' },
  { id: '8', name: 'blog', intention: 'Create content', category: 'work', icon: 'PenTool', color: 'bg-purple-300', resilience: 15, streak: 0, difficulty: 'hard', energyCost: 3, minVersion: 'Write 1 sentence' },
  { id: '9', name: 'journal', intention: 'Reflect', category: 'soul', icon: 'Book', color: 'bg-amber-200', resilience: 10, streak: 0, difficulty: 'medium', energyCost: 2, minVersion: '1 line' },
  { id: '10', name: 'meditate', intention: 'Calm mind', category: 'soul', icon: 'Moon', color: 'bg-stone-500', resilience: 10, streak: 0, difficulty: 'medium', energyCost: 1, minVersion: '1 min breath' },
  { id: '11', name: 'chores', intention: 'Tidiness', category: 'life', icon: 'Home', color: 'bg-emerald-300', resilience: 8, streak: 0, difficulty: 'medium', energyCost: 2, minVersion: '1 task' },
  { id: '12', name: 'vitamins', intention: 'Health boost', category: 'health', icon: 'Pill', color: 'bg-orange-400', resilience: 5, streak: 0, difficulty: 'easy', energyCost: 0, minVersion: 'Take pills' },
  { id: '13', name: 'gratitude', intention: 'Stay positive', category: 'soul', icon: 'Heart', color: 'bg-fuchsia-300', resilience: 8, streak: 0, difficulty: 'easy', energyCost: -1, minVersion: 'List 1 thing' },
  { id: '14', name: 'bed @ 10', intention: 'Restoration', category: 'health', icon: 'Clock', color: 'bg-cyan-400', resilience: 10, streak: 0, difficulty: 'medium', energyCost: 0, minVersion: 'In bed' },
];

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('habitHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [energyLevel, setEnergyLevel] = useState(50); // 0-100
  const [mood, setMood] = useState('Neutral'); // 'Calm', 'Focused', 'Tired', 'Energetic'

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('habitHistory', JSON.stringify(history));
  }, [history]);

  const addHabit = (habit) => {
    setHabits(prev => [...prev, { ...habit, id: Date.now().toString(), status: 'none', resilience: 0, streak: 0 }]);
  };

  const updateHabitStatus = (id, newStatus, effortRating = 0) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        let newResilience = h.resilience;
        if (newStatus === 'completed') newResilience += 2;
        if (newStatus === 'tried') newResilience += 1;
        if (newStatus === 'skipped_guilt_free') newResilience += 0.5;

        return { ...h, status: newStatus, resilience: newResilience, lastEffort: effortRating };
      }
      return h;
    }));

    // Log to history for TODAY
    const today = format(new Date(), 'yyyy-MM-dd');
    toggleHabitDate(id, today, newStatus);
  };

  const toggleHabitDate = (habitId, date, status) => {
    setHistory(prev => {
      const existingIndex = prev.findIndex(h => h.date === date && h.habitId === habitId);
      if (existingIndex >= 0) {
        const newHist = [...prev];
        // If status is 'none' or 'uncheck', remove it? Or just update.
        // For simplicity, let's update. If 'none', maybe remove?
        if (status === 'none') {
          newHist.splice(existingIndex, 1);
          return newHist;
        }
        newHist[existingIndex] = { ...newHist[existingIndex], status };
        return newHist;
      } else {
        if (status === 'none') return prev; // Don't add if none
        return [...prev, { date, habitId, status }];
      }
    });
  }

  // ... existing daily habits state ...
  const [weeklyHabits, setWeeklyHabits] = useState(() => {
    const saved = localStorage.getItem('weeklyHabits');
    return saved ? JSON.parse(saved) : [
      { id: 'w1', name: 'Family time', color: 'bg-red-500', history: { w1: false, w2: false, w3: false, w4: false, w5: false } },
      { id: 'w2', name: 'Home cleaning', color: 'bg-orange-400', history: { w1: false, w2: false, w3: false, w4: false, w5: false } }, // Fixed typo in key
      { id: 'w3', name: 'Dog park', color: 'bg-yellow-400', history: { w1: false, w2: false, w3: false, w4: false, w5: false } },
      { id: 'w4', name: 'Massage', color: 'bg-green-400', history: { w1: false, w2: false, w3: false, w4: false, w5: false } },
      { id: 'w5', name: 'Haircut', color: 'bg-emerald-500', history: { w1: false, w2: false, w3: false, w4: false, w5: false } },
      { id: 'w6', name: 'Dermatologist', color: 'bg-blue-600', history: { w1: false, w2: false, w3: false, w4: false, w5: false } },
    ];
  });

  const [monthlyHabits, setMonthlyHabits] = useState(() => {
    const saved = localStorage.getItem('monthlyHabits');
    return saved ? JSON.parse(saved) : [
      { id: 'm1', name: 'Budget planning', color: 'bg-sky-400', completed: false },
      { id: 'm2', name: 'Hiking', color: 'bg-teal-400', completed: false },
      { id: 'm3', name: 'Weekend getaway', color: 'bg-purple-400', completed: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem('weeklyHabits', JSON.stringify(weeklyHabits));
  }, [weeklyHabits]);

  useEffect(() => {
    localStorage.setItem('monthlyHabits', JSON.stringify(monthlyHabits));
  }, [monthlyHabits]);

  const toggleWeeklyHabit = (id, week) => {
    setWeeklyHabits(prev => prev.map(h =>
      h.id === id ? { ...h, history: { ...h.history, [week]: !h.history[week] } } : h
    ));
  };

  const toggleMonthlyHabit = (id) => {
    setMonthlyHabits(prev => prev.map(h =>
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

  const addMonthlyHabit = (name) => {
    setMonthlyHabits(prev => [
      ...prev,
      { id: Date.now().toString(), name, color: 'bg-indigo-400', completed: false }
    ]);
  };

  const calculateTotalResilience = () => {
    return habits.reduce((acc, curr) => acc + curr.resilience, 0);
  };

  return (
    <HabitContext.Provider value={{
      habits,
      addHabit,
      energyLevel,
      setEnergyLevel,
      mood,
      setMood,
      updateHabitStatus,
      toggleHabitDate,
      history,
      weeklyHabits,
      toggleWeeklyHabit,
      monthlyHabits,
      toggleMonthlyHabit,
      addMonthlyHabit,
      totalResilience: calculateTotalResilience()
    }}>
      {children}
    </HabitContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

const HabitContext = createContext();

export const useHabits = () => useContext(HabitContext); // Custom hook to consume context

const initialHabits = [
  { id: '1', name: 'Morning Stroll', intention: 'Connect with nature', category: 'movement', icon: 'Sun', status: 'none', resilience: 10, streak: 3, difficulty: 'medium', energyCost: 1, minVersion: 'Walk around block' },
  { id: '2', name: 'Deep Reading', intention: 'Expand my mind', category: 'mind', icon: 'BookOpen', status: 'none', resilience: 15, streak: 5, difficulty: 'hard', energyCost: 2, minVersion: 'Read 2 pages' },
  { id: '3', name: 'Hydration', intention: 'Feel vibrant', category: 'health', icon: 'Droplets', status: 'none', resilience: 5, streak: 12, difficulty: 'easy', energyCost: 0, minVersion: 'Drink 1 glass' },
  { id: '4', name: 'Gratitude', intention: 'Stay positive', category: 'soul', icon: 'Heart', status: 'none', resilience: 8, streak: 2, difficulty: 'easy', energyCost: -1, minVersion: 'List 1 thing' },
];

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const [energyLevel, setEnergyLevel] = useState(50); // 0-100
  const [mood, setMood] = useState('Neutral'); // 'Calm', 'Focused', 'Tired', 'Energetic'
  const [history, setHistory] = useState([]);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit) => {
    setHabits(prev => [...prev, { ...habit, id: Date.now().toString(), status: 'none', resilience: 0, streak: 0 }]);
  };

  const updateHabitStatus = (id, newStatus, effortRating = 0) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        let newResilience = h.resilience;
        // Simple logic for resilience score update
        if (newStatus === 'completed') newResilience += 2;
        if (newStatus === 'tried') newResilience += 1;
        if (newStatus === 'skipped_guilt_free') newResilience += 0.5; // Reward honesty

        return { ...h, status: newStatus, resilience: newResilience, lastEffort: effortRating };
      }
      return h;
    }));

    // Log to history
    const today = format(new Date(), 'yyyy-MM-dd');
    setHistory(prev => [...prev, { date: today, habitId: id, status: newStatus, effort: effortRating }]);
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
      totalResilience: calculateTotalResilience()
    }}>
      {children}
    </HabitContext.Provider>
  );
};

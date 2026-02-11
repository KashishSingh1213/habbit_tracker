# Nova Habit Tracker - Product Vision & Roadmap 🌌

## Core Philosophy
**Nova** is not just a habit tracker; it is a **Resilience Companion**. 
Traditional apps punish you for missing a day (broken streaks). Nova rewards you for **returning** (Resilience Score).
It acknowledges that human energy fluctuates (daily energy levels) and adapts expectations accordingly.

---

## 1. Deep Analysis of Current State
### strengths
- **Gestural Interface**: Dragging orbs feels more physical and "real" than clicking checkboxes.
- **Energy Awareness**: The concept of "Energy Level" affecting the UI is a strong foundation for a "living" app.
- **Resilience Score**: A superior metric to binary streaks.

### Missing Elements & Room for Evolution
- **Emotional Context**: We track *what* we did, but not *how we felt* doing it or *why* we skipped.
- **Feedback Loop**: The "Energy Level" currently only changes visuals. It needs to change the *system* (e.g., lower expectation on low energy days).
- **History & Memory**: Habits currently disappear after logging. We need a "constellation" or timeline view to see the journey.
- **Onboarding**: The app drops users into the deep end. We need a soulful onboarding experience.

---

## 2. Feature Roadmap

### Phase 1: The "Feeling" Engine (Immediate Focus)
- **Enhanced Habit Orbs**: 
  - *Pulse Speed* = Urgency or Strength.
  - *Inner Glow* = Current Streak/Consistency.
  - *Size* = Total Resilience.
- **Smart Energy System**:
  - If Energy < 30%, logging a habit as "Tried" gives the same Resilience boost as "Completed" on a normal day.
  - **Recovery Mode**: Activates automatically after 2 days of low energy. The UI softens, and habit goals are reduced to "Minimum Viable Effort".

### Phase 2: Memory & Insights
- **The Constellation View**: 
  - A scrollable timeline where every logged habit adds a "star" to your sky. 
  - Different colors for different moods/statuses.
- **Micro-Reflections**:
  - After logging, a non-intrusive prompt: "One word for today?" (e.g., *Sluggish*, *Victorious*, *Numb*).
- **Pattern Detection (AI/Algo)**:
  - "You tend to skip 'Reading' when your energy is below 40%."
  - "You feel 'Anxious' most often on Tuesdays."

### Phase 3: Social & Companion
- **Silent Partners**: Share your "Sky" with a friend. No text, no pressure. Just seeing their lights flicker on.
- **AI Companion**: A chatbot that doesn't nag but asks deep questions. "I saw you skipped Meditation for 3 days. heavy week?"

---

## 3. UI/UX Refinement Plan
- **Orbs**: Add a "gravity" effect. Low energy = Orbs feel heavy/slow to drag. High energy = Snappy and light.
- **Sound Design**: Subtle ambient sounds that shift with the energy slider.
- **Typography**: Complete migration to `Outfit` (already started) with cleaner, wider spacing for a "breathing" feel.

---

## 4. Technical Stack Recommendations

### Frontend (Living UI)
- **Framework**: React 19 + Vite (Keep current).
- **Animation**: `Framer Motion` for layout/gestures. Consider `react-spring` if physics need to be more complex (gravity simulation).
- **State**: `Zustand`. Minimal boilerplate, perfect for managing energy/habit state.
- **Styling**: `Tailwind CSS v4` + CSS Variables for dynamic theming (Hue shifts).

### Backend (Data & Intelligence)
- **Database**: **Supabase** (PostgreSQL).
  - *Why?* Native support for JSON columns (flexible habit data), Real-time subscriptions (for future social features), and easy auth.
- **Edge Functions**: For "Pattern Detection" logic. We don't need a heavy server. Run analysis once a week via cron.
- **Authentication**: Supabase Auth (Passwordless/Magic Link fits the "minimal" vibe).

### Infrastructure
- **Hosting**: Vercel (Frontend) + Supabase (Backend).
- **PWA**: Essential. This must live on the home screen.

---

## 5. Next Immediate Step
**Implement "Recovery Mode" Visuals**:
Make the interface physically react when Energy < 30%. Show the user that the app "understands" they are tired.


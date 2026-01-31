
import React, { useMemo } from 'react';
import { Habit } from '../types';
import { Award, Star, Zap, Flame, Trophy, ShieldCheck, Lock, Target, Medal } from 'lucide-react';

interface BadgesProps {
  habits: Habit[];
  themeColor: string;
}

interface BadgeDef {
  id: string;
  name: string;
  desc: string;
  requirement: number;
  icon: React.ElementType;
}

const GLOBAL_BADGES: BadgeDef[] = [
  { id: 'streak-5', name: 'Iron Focus', desc: 'Maintain any 5-day streak', requirement: 5, icon: Zap },
  { id: 'streak-10', name: 'Silver Routine', desc: 'Maintain any 10-day streak', requirement: 10, icon: Star },
  { id: 'streak-20', name: 'Golden Warrior', desc: 'Maintain any 20-day streak', requirement: 20, icon: ShieldCheck },
  { id: 'streak-30', name: 'Platinum Master', desc: 'Complete 30 days straight', requirement: 30, icon: Trophy },
  { id: 'architect', name: 'Habit Architect', desc: 'Create 5 unique habits', requirement: 5, icon: Target },
];

const Badges: React.FC<BadgesProps> = ({ habits, themeColor }) => {
  
  // Cross-month best streak calculation for all habits
  const stats = useMemo(() => {
    let globalMaxStreak = 0;
    const habitStreaks: Record<string, number> = {};

    habits.forEach(habit => {
      let currentStreak = 0;
      let maxStreakForHabit = 0;

      for (let m = 0; m < 12; m++) {
        const daysInMonth = new Date(2026, m + 1, 0).getDate();
        const completions = habit.completions[`${m}-2026`] || [];

        for (let d = 1; d <= daysInMonth; d++) {
          const date = new Date(2026, m, d);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          
          if (completions.includes(d)) {
            currentStreak++;
            maxStreakForHabit = Math.max(maxStreakForHabit, currentStreak);
          } else if (isWeekend && habit.weekendsOff) {
            continue;
          } else {
            currentStreak = 0;
          }
        }
      }
      habitStreaks[habit.id] = maxStreakForHabit;
      globalMaxStreak = Math.max(globalMaxStreak, maxStreakForHabit);
    });

    return { globalMaxStreak, habitStreaks };
  }, [habits]);

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="text-center space-y-2 pt-4">
        <h2 className="text-2xl font-black text-slate-900">Achievements</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mastering Consistency</p>
      </div>

      {/* Global Milestones */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Global Milestones</h3>
        <div className="grid grid-cols-1 gap-4">
          {GLOBAL_BADGES.map((badge) => {
            let progress = 0;
            let currentVal = 0;
            if (badge.id === 'architect') {
              currentVal = habits.length;
              progress = Math.min(100, (currentVal / badge.requirement) * 100);
            } else {
              currentVal = stats.globalMaxStreak;
              progress = Math.min(100, (currentVal / badge.requirement) * 100);
            }
            
            const isUnlocked = progress >= 100;

            return (
              <BadgeCard 
                key={badge.id}
                badge={badge}
                isUnlocked={isUnlocked}
                progress={progress}
                currentVal={currentVal}
                themeColor={themeColor}
              />
            );
          })}
        </div>
      </section>

      {/* Habit-Specific Badges */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Habit Specialists</h3>
        <div className="grid grid-cols-1 gap-4">
          {habits.map(habit => {
            const streak = stats.habitStreaks[habit.id] || 0;
            const requirement = 7;
            const progress = Math.min(100, (streak / requirement) * 100);
            const isUnlocked = progress >= 100;

            const badgeDef = {
              id: `habit-${habit.id}`,
              name: `${habit.name} Specialist`,
              desc: `Reach a 7-day streak in ${habit.name}`,
              requirement,
              icon: Medal
            };

            return (
              <BadgeCard 
                key={badgeDef.id}
                badge={badgeDef}
                isUnlocked={isUnlocked}
                progress={progress}
                currentVal={streak}
                themeColor={habit.color || themeColor}
                special
              />
            );
          })}
        </div>
      </section>

      <div className="bg-slate-900 p-8 rounded-[40px] text-center space-y-4">
        <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest">The Ultimate Goal</h4>
        <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
          "Discipline is the bridge between goals and accomplishment."
        </p>
      </div>
    </div>
  );
};

const BadgeCard: React.FC<{ 
  badge: BadgeDef, 
  isUnlocked: boolean, 
  progress: number, 
  currentVal: number, 
  themeColor: string,
  special?: boolean
}> = ({ badge, isUnlocked, progress, currentVal, themeColor, special }) => (
  <div 
    className={`bg-white p-4 rounded-[32px] border transition-all duration-500 relative overflow-hidden flex items-center gap-4 ${isUnlocked ? 'border-transparent shadow-lg' : 'border-slate-100 opacity-70'}`}
    style={{ boxShadow: isUnlocked ? `0 8px 24px ${themeColor}20` : undefined }}
  >
    <div 
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 ${isUnlocked ? 'text-white' : 'bg-slate-50 text-slate-200'}`}
      style={{ backgroundColor: isUnlocked ? themeColor : undefined }}
    >
      {isUnlocked ? <badge.icon size={24} /> : <Lock size={18} />}
    </div>

    <div className="flex-1">
      <h3 className={`font-black text-sm tracking-tight ${isUnlocked ? 'text-slate-900' : 'text-slate-400'}`}>
        {badge.name}
      </h3>
      <p className="text-[10px] font-bold text-slate-400 leading-tight">
        {badge.desc}
      </p>
      
      {!isUnlocked && (
        <div className="mt-2">
          <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000" 
              style={{ width: `${progress}%`, backgroundColor: themeColor }}
            />
          </div>
        </div>
      )}
    </div>

    {isUnlocked && (
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
        <Award size={48} style={{ color: themeColor }} />
      </div>
    )}
  </div>
);

export default Badges;

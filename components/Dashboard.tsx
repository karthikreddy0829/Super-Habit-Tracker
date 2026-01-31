import React, { useMemo, useState } from 'react';
import { Habit } from '../types.ts';
import { Award, Flame, Filter, Calendar } from 'lucide-react';

interface DashboardProps {
  habits: Habit[];
  monthYearKey: string;
  year: number;
  month: number;
  themeColor: string;
}

const Dashboard: React.FC<DashboardProps> = ({ habits, monthYearKey, year, month, themeColor }) => {
  const [selectedHabitId, setSelectedHabitId] = useState<string | 'all'>(habits[0]?.id || 'all');
  
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const currentMonthDays = getDaysInMonth(year, month);

  const getPossibleCount = (y: number, m: number, weekendsOff: boolean) => {
    const totalDays = getDaysInMonth(y, m);
    if (!weekendsOff) return totalDays;
    let count = 0;
    for (let d = 1; d <= totalDays; d++) {
      const dayOfWeek = new Date(y, m, d).getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    }
    return count;
  };

  const habitStats = useMemo(() => {
    return habits.map(habit => {
      const currentCompletions = habit.completions[monthYearKey] || [];
      const possibleInMonth = getPossibleCount(year, month, habit.weekendsOff);
      
      let streak = 0;
      const today = new Date();
      const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
      let checkDay = isCurrentMonth ? today.getDate() : currentMonthDays;

      if (isCurrentMonth && habit.weekendsOff) {
        const todayDay = new Date(year, month, checkDay).getDay();
        if (todayDay === 0 || todayDay === 6) {
           checkDay = today.getDate() - (todayDay === 0 ? 2 : 1);
        }
      }

      if (isCurrentMonth && checkDay > 0 && !currentCompletions.includes(checkDay)) {
        checkDay--;
      }

      for (let i = checkDay; i > 0; i--) {
        const date = new Date(year, month, i);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        if (currentCompletions.includes(i)) {
          streak++;
        } else if (isWeekend && habit.weekendsOff) {
          continue; 
        } else {
          break;
        }
      }

      return {
        id: habit.id,
        name: habit.name.length > 15 ? habit.name.slice(0, 15) + '...' : habit.name,
        fullName: habit.name,
        count: currentCompletions.length,
        possible: possibleInMonth,
        percent: Math.round((currentCompletions.length / possibleInMonth) * 100),
        streak,
        color: habit.color,
        weekendsOff: habit.weekendsOff
      };
    });
  }, [habits, monthYearKey, year, month, currentMonthDays]);

  const selectedHabit = habits.find(h => h.id === selectedHabitId) || habits[0];

  const lifetimeStats = useMemo(() => {
    if (!selectedHabit) return null;
    let totalCompleted = 0;
    let totalPossible = 0;

    for (let m = 0; m <= month; m++) {
      const key = `${m}-2026`;
      totalCompleted += (selectedHabit.completions[key]?.length || 0);
      totalPossible += getPossibleCount(2026, m, selectedHabit.weekendsOff);
    }

    return {
      rate: Math.round((totalCompleted / totalPossible) * 100),
      count: totalCompleted,
      total: totalPossible
    };
  }, [selectedHabit, month]);

  const activeStreaks = useMemo(() => habitStats.filter(s => s.streak > 0).sort((a, b) => b.streak - a.streak), [habitStats]);
  const averageConsistency = useMemo(() => {
    if (habitStats.length === 0) return 0;
    const total = habitStats.reduce((acc, s) => acc + s.percent, 0);
    return Math.round(total / habitStats.length);
  }, [habitStats]);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-32">
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex flex-col relative z-10">
            <span className="text-3xl font-black text-slate-900 leading-none">{averageConsistency}%</span>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Consistency</span>
          </div>
          <div className="absolute -bottom-2 -right-2 opacity-5" style={{ color: themeColor }}>
            <Award size={64} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex flex-col relative z-10">
            <span className="text-3xl font-black text-slate-900 leading-none">{activeStreaks.length}</span>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Streaks</span>
          </div>
          <div className="absolute -bottom-2 -right-2 opacity-5 text-orange-500">
            <Flame size={64} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
          <Flame size={14} className="text-orange-500" /> Active Streaks
        </h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {activeStreaks.length > 0 ? activeStreaks.map(s => (
            <div key={s.id} className="flex-shrink-0 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm min-w-[120px] text-center">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
                <Flame size={20} fill="currentColor" />
              </div>
              <div className="text-xl font-black text-slate-900 leading-none mb-1">{s.streak}</div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider truncate">{s.fullName}</div>
            </div>
          )) : (
            <div className="w-full text-center py-6 bg-slate-100 rounded-3xl border border-dashed border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active streaks!</span>
            </div>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
          <Filter size={14} style={{ color: themeColor }} /> Analysis
        </h3>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <select 
            value={selectedHabitId}
            onChange={(e) => setSelectedHabitId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
            style={{ '--tw-ring-color': themeColor } as any}
          >
            {habits.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

          {selectedHabit && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Monthly</div>
                <div className="text-2xl font-black text-slate-900" style={{ color: themeColor }}>
                  {habitStats.find(s => s.id === selectedHabitId)?.percent || 0}%
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Lifetime</div>
                <div className="text-2xl font-black text-slate-900" style={{ color: themeColor }}>
                  {lifetimeStats?.rate || 0}%
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
          <Calendar size={14} className="text-slate-400" /> Progress
        </h3>
        <div className="space-y-3">
          {habitStats.map((habit) => (
            <div key={habit.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-800 tracking-tight">{habit.fullName}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{habit.count} / {habit.possible} days</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <div className="text-xs font-black text-slate-900">{habit.percent}%</div>
                  <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${habit.percent}%`, backgroundColor: habit.color }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
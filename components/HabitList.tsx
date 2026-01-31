
import React, { useState } from 'react';
import { Habit } from '../types';
import { Edit2, Check, Coffee, PlusCircle, Trash2, X } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  monthYearKey: string;
  year: number;
  month: number;
  onToggleDay: (habitId: string, day: number) => void;
  onUpdate: (habitId: string, updates: Partial<Habit>) => void;
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const HabitList: React.FC<HabitListProps> = ({ habits, monthYearKey, year, month, onToggleDay, onUpdate, onAdd, onDelete, themeColor }) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleAdd = () => {
    if (newHabitName.trim()) {
      onAdd(newHabitName.trim());
      setNewHabitName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="py-4 space-y-6">
      {habits.map((habit) => (
        <HabitItem 
          key={habit.id} 
          habit={habit} 
          monthYearKey={monthYearKey}
          days={days} 
          year={year}
          month={month}
          onToggleDay={onToggleDay} 
          onUpdate={onUpdate} 
          onDelete={onDelete}
          themeColor={themeColor}
        />
      ))}

      {/* Add New Habit Button/Form */}
      <div className="px-4 pt-4">
        {isAdding ? (
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase text-slate-400 tracking-widest">New Habit</span>
              <button onClick={() => setIsAdding(false)} className="text-slate-300 hover:text-slate-500">
                <X size={16} />
              </button>
            </div>
            <input 
              type="text" 
              placeholder="e.g., Morning Yoga"
              autoFocus
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-opacity-50 mb-3"
              style={{ '--tw-ring-color': themeColor } as any}
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button 
              onClick={handleAdd}
              className="w-full py-3 rounded-xl text-white font-black uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95"
              style={{ backgroundColor: themeColor, boxShadow: `0 4px 12px ${themeColor}40` }}
            >
              Add Habit
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[32px] flex items-center justify-center gap-2 text-slate-400 font-black uppercase text-xs tracking-widest hover:border-slate-300 hover:text-slate-500 transition-all"
          >
            <PlusCircle size={18} />
            Add New Habit
          </button>
        )}
      </div>

      <div className="h-4" />
    </div>
  );
};

const HabitItem: React.FC<{
  habit: Habit;
  monthYearKey: string;
  days: number[];
  year: number;
  month: number;
  onToggleDay: (id: string, day: number) => void;
  onUpdate: (id: string, updates: Partial<Habit>) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}> = ({ habit, monthYearKey, days, year, month, onToggleDay, onUpdate, onDelete, themeColor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(habit.name);

  const handleUpdate = () => {
    if (editValue.trim()) {
      onUpdate(habit.id, { name: editValue.trim() });
      setIsEditing(false);
    }
  };

  const toggleWeekends = () => {
    onUpdate(habit.id, { weekendsOff: !habit.weekendsOff });
  };

  const completedDays = habit.completions[monthYearKey] || [];

  return (
    <div className="px-4 group animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-between mb-3 px-2">
        {isEditing ? (
          <div className="flex flex-col gap-2 w-full bg-slate-100 p-3 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200 shadow-inner">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                autoFocus
                className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-opacity-50 font-semibold"
                style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
              />
              <button onClick={handleUpdate} className="bg-white p-1 rounded-lg shadow-sm" style={{ color: themeColor }}>
                <Check size={16} />
              </button>
              <button onClick={() => onDelete(habit.id)} className="bg-white p-1 rounded-lg shadow-sm text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
            <button 
              onClick={toggleWeekends}
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all ${habit.weekendsOff ? 'text-white shadow-sm' : 'bg-white text-slate-400 border border-slate-200'}`}
              style={{ backgroundColor: habit.weekendsOff ? themeColor : undefined }}
            >
              <Coffee size={12} />
              {habit.weekendsOff ? 'Weekends: OFF' : 'Weekends: ON'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <h3 
                className="text-sm font-bold text-slate-700 cursor-pointer hover:opacity-70 transition-colors"
                onDoubleClick={() => setIsEditing(true)}
              >
                {habit.name}
              </h3>
              {habit.weekendsOff && (
                <span className="text-[8px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-black uppercase tracking-tight">Weekends Off</span>
              )}
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-500 transition-all"
            >
              <Edit2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {days.map((day) => {
          const date = new Date(year, month, day);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isCompleted = completedDays.includes(day);
          
          return (
            <button
              key={day}
              onClick={() => onToggleDay(habit.id, day)}
              className={`
                flex-shrink-0 w-10 h-10 rounded-2xl flex flex-col items-center justify-center text-[10px] font-bold transition-all duration-300 relative
                ${isCompleted 
                  ? 'text-white shadow-lg scale-105' 
                  : isWeekend && habit.weekendsOff 
                    ? 'bg-slate-100 text-slate-300 border border-dashed border-slate-200' 
                    : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}
              `}
              style={{ 
                backgroundColor: isCompleted ? themeColor : undefined,
                boxShadow: isCompleted ? `0 4px 12px ${themeColor}40` : undefined
              }}
            >
              <span className="opacity-60 font-medium">D</span>
              <span className="text-xs">{day}</span>
              {isWeekend && habit.weekendsOff && !isCompleted && (
                <div className="absolute top-0 right-0 p-0.5">
                  <Coffee size={8} className="text-slate-300" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HabitList;


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, CheckCircle2, BarChart3, Settings as SettingsIcon, Plus, Sparkles, ChevronLeft, ChevronRight, Edit2, Info, User, PlusCircle, Award, MessageSquareText } from 'lucide-react';
import { Habit } from './types';
import HabitList from './components/HabitList';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import About from './components/About';
import Badges from './components/Badges';
import AskGemini from './components/AskGemini';

const STORAGE_KEY = 'super_habit_tracker_v6_2026';
const SETTINGS_KEY = 'super_habit_tracker_settings';

const DEFAULT_HABITS: Habit[] = [
  { id: '1', name: 'Morning Meditation', completions: {}, color: '#A855F7', weekendsOff: false },
  { id: '2', name: 'Read 20 Pages', completions: {}, color: '#8B5CF6', weekendsOff: false },
  { id: '3', name: 'Workout', completions: {}, color: '#7C3AED', weekendsOff: true },
  { id: '4', name: 'Journaling', completions: {}, color: '#6366F1', weekendsOff: false },
];

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activeTab, setActiveTab] = useState<'track' | 'stats' | 'badges' | 'ai' | 'settings' | 'about'>('track');
  const [viewDate, setViewDate] = useState(new Date(2026, 0, 1));
  const [isLoaded, setIsLoaded] = useState(false);

  // Global Settings
  const [userName, setUserName] = useState('Super User');
  const [userIcon, setUserIcon] = useState('User');
  const [themeColor, setThemeColor] = useState('#9333ea');
  const [appIcon, setAppIcon] = useState('Sparkles');

  const monthYearKey = `${viewDate.getMonth()}-${viewDate.getFullYear()}`;
  const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(viewDate);

  // Initialize data
  useEffect(() => {
    const savedHabits = localStorage.getItem(STORAGE_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (e) {
        setHabits(DEFAULT_HABITS);
      }
    } else {
      setHabits(DEFAULT_HABITS);
    }

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setUserName(settings.userName || 'Super User');
        setUserIcon(settings.userIcon || 'User');
        setThemeColor(settings.themeColor || '#9333ea');
        setAppIcon(settings.appIcon || 'Sparkles');
      } catch (e) {
        console.error("Failed to load settings");
      }
    }
    
    setIsLoaded(true);
  }, []);

  // Save data
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ userName, userIcon, themeColor, appIcon }));
    }
  }, [habits, userName, userIcon, themeColor, appIcon, isLoaded]);

  const toggleDay = useCallback((habitId: string, day: number) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const currentCompletions = habit.completions[monthYearKey] || [];
        const isCompleted = currentCompletions.includes(day);
        const newCompletions = isCompleted 
          ? currentCompletions.filter(d => d !== day) 
          : [...currentCompletions, day].sort((a, b) => a - b);
        
        return {
          ...habit,
          completions: { ...habit.completions, [monthYearKey]: newCompletions }
        };
      }
      return habit;
    }));
  }, [monthYearKey]);

  const updateHabit = useCallback((habitId: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, ...updates } : habit
    ));
  }, []);

  const addHabit = useCallback((name: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      completions: {},
      color: themeColor,
      weekendsOff: false
    };
    setHabits(prev => [...prev, newHabit]);
  }, [themeColor]);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const changeMonth = (delta: number) => {
    setViewDate(prev => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + delta);
      if (next.getFullYear() !== 2026) return prev;
      return next;
    });
  };

  const renderAppIcon = () => {
    switch(appIcon) {
      case 'Zap': return <Layout size={18} />;
      case 'Target': return <CheckCircle2 size={18} />;
      case 'Book': return <Plus size={18} rotate={45} />;
      default: return <Sparkles size={18} />;
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative shadow-2xl pb-24 overflow-hidden">
      {/* Header */}
      <header className="p-6 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-colors duration-500"
              style={{ backgroundColor: themeColor }}
            >
              {renderAppIcon()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Super Habit Tracker</h1>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                <User size={10} />
                {userName}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-2 transition-colors ${activeTab === 'settings' ? 'text-purple-600' : 'text-slate-400 hover:text-purple-600'}`}
          >
            <SettingsIcon size={20} />
          </button>
        </div>

        {(activeTab === 'track' || activeTab === 'stats') && (
          <div className="flex items-center justify-between mt-4 bg-slate-50 p-2 rounded-2xl animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => changeMonth(-1)}
              disabled={viewDate.getMonth() === 0}
              className="p-1 hover:bg-white rounded-lg disabled:opacity-30 transition-all text-slate-600"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-widest leading-none mb-1" style={{ color: themeColor }}>2026</span>
              <span className="text-sm font-bold text-slate-800">{currentMonthName}</span>
            </div>
            <button 
              onClick={() => changeMonth(1)}
              disabled={viewDate.getMonth() === 11}
              className="p-1 hover:bg-white rounded-lg disabled:opacity-30 transition-all text-slate-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'track' && (
          <HabitList 
            habits={habits} 
            monthYearKey={monthYearKey}
            year={viewDate.getFullYear()}
            month={viewDate.getMonth()}
            onToggleDay={toggleDay} 
            onUpdate={updateHabit}
            onAdd={addHabit}
            onDelete={deleteHabit}
            themeColor={themeColor}
          />
        )}
        {activeTab === 'stats' && (
          <Dashboard 
            habits={habits} 
            monthYearKey={monthYearKey}
            year={viewDate.getFullYear()}
            month={viewDate.getMonth()}
            themeColor={themeColor}
          />
        )}
        {activeTab === 'badges' && (
          <Badges 
            habits={habits}
            themeColor={themeColor}
          />
        )}
        {activeTab === 'ai' && (
          <AskGemini 
            habits={habits}
            userName={userName}
            themeColor={themeColor}
          />
        )}
        {activeTab === 'settings' && (
          <Settings 
            userName={userName}
            setUserName={setUserName}
            userIcon={userIcon}
            setUserIcon={setUserIcon}
            themeColor={themeColor}
            setThemeColor={setThemeColor}
            appIcon={appIcon}
            setAppIcon={setAppIcon}
            habits={habits}
          />
        )}
        {activeTab === 'about' && <About themeColor={themeColor} />}
      </main>

      {/* Improved Bottom Navigation Menu */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white/80 backdrop-blur-md border-t border-slate-100 px-2 py-3 flex justify-around items-center z-20">
        <NavButton 
          active={activeTab === 'track'} 
          onClick={() => setActiveTab('track')} 
          icon={<CheckCircle2 size={24} />} 
          label="Track" 
          color={themeColor}
        />
        <NavButton 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')} 
          icon={<BarChart3 size={24} />} 
          label="Stats" 
          color={themeColor}
        />
        <NavButton 
          active={activeTab === 'badges'} 
          onClick={() => setActiveTab('badges')} 
          icon={<Award size={24} />} 
          label="Badges" 
          color={themeColor}
        />
        <NavButton 
          active={activeTab === 'ai'} 
          onClick={() => setActiveTab('ai')} 
          icon={<MessageSquareText size={24} />} 
          label="Ask AI" 
          color={themeColor}
        />
        <NavButton 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
          icon={<SettingsIcon size={24} />} 
          label="Sets" 
          color={themeColor}
        />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }> = ({ active, onClick, icon, label, color }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'scale-110' : 'text-slate-400 opacity-60'}`}
    style={{ color: active ? color : undefined }}
  >
    <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-opacity-10' : ''}`} style={{ backgroundColor: active ? color : 'transparent' }}>
      {icon}
    </div>
    <span className="text-[8px] font-black uppercase tracking-wider">{label}</span>
  </button>
);

export default App;

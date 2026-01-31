
import React from 'react';
import { User, Palette, Sparkles, Zap, Target, Book, Smile, Heart, Star, Share2, FileText, Send } from 'lucide-react';
import { Habit } from '../types';

interface SettingsProps {
  userName: string;
  setUserName: (val: string) => void;
  userIcon: string;
  setUserIcon: (val: string) => void;
  themeColor: string;
  setThemeColor: (val: string) => void;
  appIcon: string;
  setAppIcon: (val: string) => void;
  habits: Habit[];
}

const THEME_COLORS = [
  { name: 'Classic Purple', hex: '#9333ea' },
  { name: 'Soft Rose', hex: '#fb7185' },
  { name: 'Sage Green', hex: '#2dd4bf' },
  { name: 'Ocean Blue', hex: '#3b82f6' },
  { name: 'Pastel Slate', hex: '#64748b' },
  { name: 'Sunset Orange', hex: '#f97316' },
];

const USER_ICONS = ['User', 'Smile', 'Heart', 'Star'];
const APP_ICONS = ['Sparkles', 'Zap', 'Target', 'Book'];

const Settings: React.FC<SettingsProps> = ({ 
  userName, setUserName, userIcon, setUserIcon, 
  themeColor, setThemeColor, appIcon, setAppIcon,
  habits
}) => {

  const generateReport = () => {
    let report = `🏆 SUPER HABIT REPORT: ${userName.toUpperCase()} (2026)\n\n`;
    habits.forEach(h => {
      const count = Object.values(h.completions).flat().length;
      report += `• ${h.name}: ${count} completions\n`;
    });
    report += `\nKeep building discipline! Sent from Super Habit Tracker.`;
    return report;
  };

  const handleShare = async () => {
    const text = generateReport();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Habit Analysis',
          text: text,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Report copied to clipboard! You can now paste it into WhatsApp or Email.');
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      
      <section>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Share2 size={14} /> Analysis & Export
        </h2>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
            Generate a full analysis of your consistency to share with your coach or friends via WhatsApp or Email.
          </p>
          <button 
            onClick={handleShare}
            className="w-full py-4 rounded-2xl text-white font-black uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            style={{ backgroundColor: themeColor, boxShadow: `0 8px 20px ${themeColor}30` }}
          >
            <FileText size={18} />
            Generate & Share Report
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <User size={14} /> Profile Settings
        </h2>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">Your Name</label>
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{ '--tw-ring-color': themeColor } as any}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">User Avatar</label>
            <div className="flex gap-4">
              {USER_ICONS.map(icon => (
                <button 
                  key={icon}
                  onClick={() => setUserIcon(icon)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${userIcon === icon ? 'text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  style={{ backgroundColor: userIcon === icon ? themeColor : undefined }}
                >
                  {icon === 'User' && <User size={20} />}
                  {icon === 'Smile' && <Smile size={20} />}
                  {icon === 'Heart' && <Heart size={20} />}
                  {icon === 'Star' && <Star size={20} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Palette size={14} /> Appearance
        </h2>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-4 block">Theme Accent</label>
            <div className="grid grid-cols-3 gap-3">
              {THEME_COLORS.map(color => (
                <button
                  key={color.hex}
                  onClick={() => setThemeColor(color.hex)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${themeColor === color.hex ? 'border-slate-900 shadow-md scale-105' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
                >
                  <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: color.hex }} />
                  <span className="text-[9px] font-black uppercase text-slate-500">{color.name.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 mb-4 block">App Symbol</label>
            <div className="flex gap-4">
              {APP_ICONS.map(icon => (
                <button 
                  key={icon}
                  onClick={() => setAppIcon(icon)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${appIcon === icon ? 'text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  style={{ backgroundColor: appIcon === icon ? themeColor : undefined }}
                >
                  {icon === 'Sparkles' && <Sparkles size={20} />}
                  {icon === 'Zap' && <Zap size={20} />}
                  {icon === 'Target' && <Target size={20} />}
                  {icon === 'Book' && <Book size={20} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;

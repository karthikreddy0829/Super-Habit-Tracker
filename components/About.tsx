import React from 'react';
import { Sparkles, Heart, Coffee } from 'lucide-react';

const About: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <div className="flex flex-col items-center text-center space-y-4 pt-10">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-4" style={{ backgroundColor: themeColor }}>
          <Sparkles size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Super Habit Tracker</h2>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Version 2026.1.0</p>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <Heart size={16} style={{ color: themeColor }} /> Our Mission
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            Super Habit Tracker was created to empower individuals with a minimalist, aesthetic, and non-intrusive way to build consistency. 
          </p>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            We believe that tracking your progress should be a moment of calm, not stress. This app is designed to celebrate small wins and allow for life's rest days through our "Weekends Off" philosophy.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-50">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Created By</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
              <span className="font-black text-xs">SH</span>
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">SuperHero</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Lead Architect</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
          Made with <Coffee size={10} /> for a better tomorrow
        </p>
      </div>
    </div>
  );
};

export default About;
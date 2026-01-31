
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { Habit } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AskGeminiProps {
  habits: Habit[];
  userName: string;
  themeColor: string;
}

const AskGemini: React.FC<AskGeminiProps> = ({ habits, userName, themeColor }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hi ${userName}! I'm your AI Habit Coach. How can I help you reach your goals today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const habitSummary = habits.map(h => `${h.name}: ${Object.values(h.completions).flat().length} completions in 2026`).join(', ');

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are a high-performance habit coach. The user's name is ${userName}. Their habits are: ${habitSummary}. Provide short, aesthetic, motivating, and actionable advice. Use bullet points if needed. Be professional yet friendly.`
        }
      });

      const text = response.text || "I'm sorry, I couldn't process that. Try asking about your progress!";
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Please ensure your environment is set up correctly!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-slate-50 animate-in fade-in duration-500">
      <div className="px-6 py-4 bg-white border-b border-slate-100">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Sparkles size={14} style={{ color: themeColor }} /> AI Habit Coach
        </h2>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar"
      >
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-purple-600'}`}>
                {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div 
                className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-white text-slate-700 rounded-tl-none shadow-sm border border-slate-100'
                }`}
                style={{ backgroundColor: m.role === 'user' ? themeColor : undefined }}
              >
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-2 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-purple-600">
                <Bot size={14} />
              </div>
              <div className="p-4 bg-white text-slate-400 rounded-2xl rounded-tl-none text-sm border border-slate-100 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Thinking...
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your habits..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
            style={{ '--tw-ring-color': themeColor } as any}
          />
          <button 
            onClick={handleSend}
            disabled={isTyping}
            className="absolute right-2 p-2 rounded-xl text-white shadow-lg active:scale-90 transition-all disabled:opacity-50"
            style={{ backgroundColor: themeColor }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskGemini;

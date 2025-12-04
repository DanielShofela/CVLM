import React from 'react';
import { LayoutGrid, FileText, Database, Settings } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, setScreen }) => {
  const navItems = [
    { id: Screen.DASHBOARD, icon: LayoutGrid, label: 'Modèles' },
    { id: Screen.MY_CVS, icon: FileText, label: 'Mes CVLMs' },
    { id: Screen.COMMUNITY, icon: Database, label: 'Versions' },
    { id: Screen.SETTINGS, icon: Settings, label: 'Compte' },
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 h-20 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 flex items-center justify-around z-50">
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className="flex flex-col items-center gap-1 w-16 group"
          >
            <div className={`p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-electric-50 text-electric-600 translate-y-[-8px] shadow-neon' : 'text-slate-400 group-hover:text-slate-600'}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            {isActive && (
              <span className="text-[10px] font-bold text-electric-600 animate-fade-in absolute bottom-2">
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
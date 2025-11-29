import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Bell, Shield, Smartphone, LogOut, ChevronRight } from 'lucide-react';
import { Screen } from '../types';

export const Settings: React.FC<{ setScreen: (s: Screen) => void }> = ({ setScreen }) => {
  return (
    <div className="pb-28 pt-6 px-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Paramètres</h1>

      <GlassCard className="flex items-center gap-4 mb-6">
        <img src="https://picsum.photos/100/100" alt="Profile" className="w-16 h-16 rounded-full border-2 border-white shadow-md" />
        <div className="flex-1">
          <h2 className="font-bold text-slate-800">Alexandre Dupont</h2>
          <p className="text-sm text-slate-500">Premium Member</p>
        </div>
        <button className="text-electric-600 text-sm font-medium">Éditer</button>
      </GlassCard>

      <div className="space-y-4">
        {[
          { icon: Bell, label: 'Notifications', value: 'On' },
          { icon: Shield, label: 'Sécurité & Privacy', value: '' },
          { icon: Smartphone, label: 'Télécharger l\'App', value: 'New' },
        ].map((item, idx) => (
          <GlassCard key={idx} className="!p-4 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                <item.icon size={20} />
              </div>
              <span className="font-medium text-slate-700">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.value && <span className="text-xs font-bold text-electric-600 bg-electric-50 px-2 py-1 rounded-full">{item.value}</span>}
              <ChevronRight size={18} className="text-slate-400" />
            </div>
          </GlassCard>
        ))}

        <button 
          onClick={() => setScreen(Screen.ONBOARDING)}
          className="w-full flex items-center justify-center gap-2 text-red-500 font-medium py-4 mt-8 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} /> Déconnexion
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs text-slate-400">CVLM Version 2.0.4 (Build 890)</p>
      </div>
    </div>
  );
};
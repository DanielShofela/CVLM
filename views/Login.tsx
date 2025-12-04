import React, { useState } from 'react';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { Lock, Mail, Fingerprint } from 'lucide-react';
import { Screen } from '../types';

export const Login: React.FC<{ setScreen: (s: Screen) => void }> = ({ setScreen }) => {
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setScreen(Screen.DASHBOARD);
  };

  return (
    <div className="h-screen flex flex-col justify-center p-6 relative">
       {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-electric-50/50 to-white -z-10" />

      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-16 rounded-2xl bg-electric-600 text-white mb-6 shadow-neon">
          <span className="text-2xl font-bold tracking-tighter">CVLM</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Bienvenue</h2>
        <p className="text-slate-500">Connectez-vous pour façonner votre avenir.</p>
      </div>

      <GlassCard className="mb-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-electric-500 transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Email professionnel" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-500 transition-all text-slate-700"
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-electric-500 transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-500 transition-all text-slate-700"
            />
          </div>
          
          <div className="flex justify-end">
            <button type="button" className="text-sm text-electric-600 font-medium">Mot de passe oublié ?</button>
          </div>

          <Button type="submit" fullWidth>Se connecter</Button>
        </form>
      </GlassCard>

      <div className="flex items-center gap-4 my-6">
        <div className="h-[1px] bg-slate-200 flex-1"></div>
        <span className="text-slate-400 text-xs uppercase tracking-wider">Ou continuer avec</span>
        <div className="h-[1px] bg-slate-200 flex-1"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="secondary" className="justify-center">Google</Button>
        <Button variant="secondary" className="justify-center">Apple</Button>
      </div>

      <div className="mt-8 text-center">
        <button className="flex items-center justify-center gap-2 mx-auto text-slate-500 p-4">
          <Fingerprint size={24} className="text-electric-600" />
          <span className="text-sm">Connexion Biométrique</span>
        </button>
      </div>
    </div>
  );
};
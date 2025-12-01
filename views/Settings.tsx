
import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Bell, Shield, Smartphone, ChevronRight, Trash2, CheckCircle, Info, X, User, Mail, Save } from 'lucide-react';
import { Screen, UserProfile } from '../types';
import { Button } from '../components/Button';

interface SettingsProps {
  setScreen: (s: Screen) => void;
  userProfile: UserProfile;
  onUpdateProfile: (p: Partial<UserProfile>) => void;
}

export const Settings: React.FC<SettingsProps> = ({ setScreen, userProfile, onUpdateProfile }) => {
  const [notifications, setNotifications] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  
  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleAction = (label: string) => {
    if (label === 'Notifications') {
      const newState = !notifications;
      setNotifications(newState);
      showToast(`Notifications ${newState ? 'activées' : 'désactivées'}`, 'success');
    } else if (label === 'Éditer') {
      setEditForm({ name: userProfile.name, email: userProfile.email });
      setIsEditing(true);
    } else if (label.includes('Sécurité')) {
      showToast("Vos données sont cryptées localement", 'success');
    } else if (label.includes('Télécharger')) {
      showToast("Installez via le menu : Ajouter à l'écran d'accueil", 'info');
    } else if (label === 'Réinitialiser') {
      if(window.confirm("Voulez-vous vraiment effacer toutes vos données ? Cette action est irréversible.")) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editForm);
    setIsEditing(false);
    showToast('Profil mis à jour avec succès', 'success');
  };

  return (
    <div className="pb-28 pt-6 px-4 relative min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Paramètres</h1>

      <GlassCard className="flex items-center gap-4 mb-6">
        <img src="https://picsum.photos/100/100" alt="Profile" className="w-16 h-16 rounded-full border-2 border-white shadow-md" />
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-slate-800 truncate">{userProfile.name}</h2>
          <p className="text-sm text-slate-500 truncate">{userProfile.email}</p>
        </div>
        <button onClick={() => handleAction('Éditer')} className="text-electric-600 text-sm font-medium hover:text-electric-700 transition-colors">Éditer</button>
      </GlassCard>

      <div className="space-y-4">
        {/* Notifications */}
        <GlassCard 
          onClick={() => handleAction('Notifications')} 
          className="!p-4 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
        >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                <Bell size={20} />
              </div>
              <span className="font-medium text-slate-700">Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-electric-500' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${notifications ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
        </GlassCard>

        {[
          { icon: Shield, label: 'Sécurité & Privacy', value: '' },
          { icon: Smartphone, label: 'Télécharger l\'App', value: 'PWA' },
        ].map((item, idx) => (
          <GlassCard 
            key={idx} 
            onClick={() => handleAction(item.label)}
            className="!p-4 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer hover:bg-white/60"
          >
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

        <GlassCard 
          onClick={() => handleAction('Réinitialiser')}
          className="!p-4 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer border-red-100 bg-red-50/30 hover:bg-red-50/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-500">
              <Trash2 size={20} />
            </div>
            <span className="font-medium text-red-600">Réinitialiser les données</span>
          </div>
          <ChevronRight size={18} className="text-red-300" />
        </GlassCard>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs text-slate-400">CVLM Version 2.0.5 (Build 891)</p>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <div className="bg-white rounded-2xl w-full max-w-sm relative z-10 shadow-2xl p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Modifier le Profil</h2>
              <button onClick={() => setIsEditing(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nom Complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-400 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-400 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" fullWidth>
                  <Save size={18} /> Enregistrer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[90%] max-w-sm">
          <div className="bg-slate-800/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            {toast.type === 'success' ? <CheckCircle size={20} className="text-green-400" /> : <Info size={20} className="text-blue-400" />}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

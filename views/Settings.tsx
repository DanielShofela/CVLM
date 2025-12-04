
import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Bell, Shield, Smartphone, ChevronRight, Trash2, CheckCircle, Info, X, User, Mail, Save, Copy } from 'lucide-react';
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
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    referralCode: '',
    phone: '',
    jobTitle: '',
    locationCity: '',
    locationCountry: '',
    linkedinUrl: '',
    portfolioUrl: '',
    websiteUrl: '',
    bio: '',
    openToWork: false
  });
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Listen for the PWA install prompt (Android/Chrome)
  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const installedHandler = () => {
      showToast("Application installée", 'success');
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    window.addEventListener('appinstalled', installedHandler as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
      window.removeEventListener('appinstalled', installedHandler as EventListener);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const generateReferralCode = (name: string, email: string): string => {
    // Génère un code de parrainage unique basé sur le nom et l'email
    const namePrefix = name.substring(0, 3).toUpperCase();
    const emailPrefix = email.substring(0, 2).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${namePrefix}${emailPrefix}-${randomSuffix}`;
  };

  const handleAction = (label: string) => {
    if (label === 'Notifications') {
      const newState = !notifications;
      setNotifications(newState);
      
      if (newState) {
        // Demander la permission pour les notifications
        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            showToast('Notifications activées - Vous recevrez des alertes à chaque mise à jour', 'success');
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                // Envoyer une notification de test
                new Notification('CVLM Notifications Activées', {
                  body: 'Vous recevrez désormais des notifications pour chaque mise à jour de l\'application.',
                  icon: '/favicon.ico',
                  tag: 'cvlm-notification-test',
                });
                showToast('Notifications activées - Vous recevrez des alertes à chaque mise à jour', 'success');
              } else {
                showToast('Permission de notification refusée', 'info');
                setNotifications(false);
              }
            });
          }
        } else {
          showToast('Notifications non supportées par votre navigateur', 'info');
          setNotifications(false);
        }
      } else {
        showToast('Notifications désactivées', 'success');
      }
    } else if (label === 'Éditer') {
      setEditForm({ 
        name: userProfile.name || '', 
        email: userProfile.email || '',
        referralCode: userProfile.referralCode || '',
        phone: userProfile.phone || '',
        jobTitle: (userProfile as any).jobTitle || '',
        locationCity: (userProfile as any).locationCity || '',
        locationCountry: (userProfile as any).locationCountry || '',
        linkedinUrl: (userProfile as any).linkedinUrl || '',
        portfolioUrl: (userProfile as any).portfolioUrl || '',
        websiteUrl: (userProfile as any).websiteUrl || '',
        bio: (userProfile as any).bio || '',
        openToWork: (userProfile as any).openToWork || false
      });
      setEditAvatar(userProfile.avatarUrl || null);
      setIsEditing(true);
    } else if (label.includes('Sécurité')) {
      showToast("Vos données sont cryptées localement", 'success');
    } else if (label.includes('Télécharger') || label.includes('Installer')) {
      // If the install prompt is available (Chrome/Android) -> show it
      if (deferredPrompt) {
        (async () => {
          try {
            deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;
            if (choice && choice.outcome === 'accepted') {
              showToast("Merci ! L'application a été installée.", 'success');
            } else {
              showToast("Installation annulée.", 'info');
            }
          } catch (err) {
            showToast("Impossible d'ouvrir la fenêtre d'installation.", 'info');
          }
          setDeferredPrompt(null);
        })();
      } else {
        // Show a modal with installation instructions for iOS and desktop browsers
        setShowInstallModal(true);
      }
    } else if (label === 'Réinitialiser') {
      setShowResetConfirmation(true);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProfile(true);

    try {
      // Générer le code de parrainage s'il n'existe pas
      let referralCode = editForm.referralCode;
      if (!referralCode || referralCode.trim() === '') {
        referralCode = generateReferralCode(editForm.name, editForm.email);
      }

      const updatedProfile: any = {
        ...editForm,
        referralCode,
        phone: editForm.phone,
        jobTitle: editForm.jobTitle,
        locationCity: editForm.locationCity,
        locationCountry: editForm.locationCountry,
        linkedinUrl: editForm.linkedinUrl,
        portfolioUrl: editForm.portfolioUrl,
        websiteUrl: editForm.websiteUrl,
        bio: editForm.bio,
        openToWork: editForm.openToWork
      };

      if (editAvatar) {
        updatedProfile.avatarUrl = editAvatar;
      }

      // Envoyer les données via FormSpree
      const response = await fetch('https://formspree.io/f/mldqlrlr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          jobTitle: editForm.jobTitle,
          locationCity: editForm.locationCity,
          locationCountry: editForm.locationCountry,
          linkedinUrl: editForm.linkedinUrl,
          portfolioUrl: editForm.portfolioUrl,
          websiteUrl: editForm.websiteUrl,
          bio: editForm.bio,
          openToWork: editForm.openToWork,
          referralCode: referralCode,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Mettre à jour le profil localement
        onUpdateProfile(updatedProfile);
        setIsEditing(false);
        showToast('Profil enregistré avec succès!', 'success');
      } else {
        showToast('Erreur lors de l\'envoi des données', 'info');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur de connexion. Les données ont été sauvegardées localement.', 'info');
      // Sauvegarder localement même si FormSpree échoue
      const referralCode = editForm.referralCode || generateReferralCode(editForm.name, editForm.email);
      onUpdateProfile({
        ...editForm,
        referralCode,
        phone: editForm.phone,
        jobTitle: editForm.jobTitle,
        locationCity: editForm.locationCity,
        locationCountry: editForm.locationCountry,
        linkedinUrl: editForm.linkedinUrl,
        portfolioUrl: editForm.portfolioUrl,
        websiteUrl: editForm.websiteUrl,
        bio: editForm.bio,
        openToWork: editForm.openToWork,
        avatarUrl: editAvatar || userProfile.avatarUrl || null
      });
      setIsEditing(false);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleAvatarFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setEditAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  const copyReferral = async () => {
    if (!userProfile.referralCode) return showToast('Aucun code disponible', 'info');
    try {
      await navigator.clipboard.writeText(userProfile.referralCode);
      showToast('Code copié !', 'success');
    } catch (err) {
      showToast('Impossible de copier', 'info');
    }
  };

  return (
    <div className="pb-28 pt-6 px-4 relative min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Paramètres</h1>

      <GlassCard className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden flex items-center justify-center text-white font-bold text-xl">
          {userProfile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-electric-400 to-electric-600 flex items-center justify-center text-white font-bold text-xl">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'A'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-slate-800 truncate">{userProfile.name}</h2>
          {userProfile.jobTitle && <p className="text-sm text-slate-600 truncate">{userProfile.jobTitle}</p>}
          <p className="text-sm text-slate-500 truncate">{userProfile.email}</p>
          {userProfile.phone && (
            <p className="text-sm text-slate-500 truncate">{userProfile.phone}</p>
          )}
          {(userProfile.locationCity || userProfile.locationCountry) && (
            <p className="text-sm text-slate-500 truncate">{[userProfile.locationCity, userProfile.locationCountry].filter(Boolean).join(', ')}</p>
          )}
          {userProfile.referralCode && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs bg-electric-50 text-electric-700 px-2 py-1 rounded-md font-medium">Code: {userProfile.referralCode}</span>
              <button onClick={copyReferral} className="text-slate-400 hover:text-slate-600 p-1">
                <Copy size={14} />
              </button>
            </div>
          )}
        </div>
        <button onClick={() => handleAction('Éditer')} className="text-electric-600 text-sm font-medium hover:text-electric-700 transition-colors">Éditer</button>
      </GlassCard>

      <div className="space-y-4">
        {/* Notifications */}
        <div>
          <GlassCard 
            onClick={() => handleAction('Notifications')} 
            className="!p-4 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
          >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-slate-700">Notifications</span>
                  <p className="text-xs text-slate-500 mt-1">Recevez des alertes à chaque mise à jour de l'app</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-electric-500' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${notifications ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>
          </GlassCard>
        </div>

        {[
          { icon: Shield, label: 'Sécurité & Privacy', value: '' },
          { icon: Smartphone, label: "Installer l'app", value: 'PWA' },
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
              {item.label.includes("Télécharger") || item.label.includes("Installer") ? (
                // Show a clear "Installer l'app" badge when the PWA install prompt is available
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${deferredPrompt ? 'text-white bg-emerald-600 shadow-sm animate-pulse ring-2 ring-emerald-100' : 'text-electric-600 bg-electric-50'}`}
                  title={deferredPrompt ? "L'installation native est disponible. Cliquez pour installer." : "Progressive Web App (PWA) - installable via le menu"}
                  aria-live="polite"
                >
                  {deferredPrompt ? "Installer l'app" : item.value}
                </span>
              ) : (
                item.value && <span className="text-xs font-bold text-electric-600 bg-electric-50 px-2 py-1 rounded-full">{item.value}</span>
              )}
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

      {/* Reset Confirmation Modal */}
      {showResetConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowResetConfirmation(false)} />
          <div className="bg-white rounded-2xl w-full max-w-sm relative z-10 shadow-2xl p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Réinitialiser les données</h2>
              <button onClick={() => setShowResetConfirmation(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-700">
                  <strong>Attention !</strong> Cette action supprimera toutes vos données locales (CVs, demandes, profil). Cette action est irréversible.
                </p>
              </div>
              <p className="text-sm text-slate-600">
                Êtes-vous sûr de vouloir continuer ?
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                fullWidth 
                onClick={() => setShowResetConfirmation(false)}
              >
                Annuler
              </Button>
              <Button 
                fullWidth 
                onClick={() => {
                  localStorage.clear();
                  showToast('Données réinitialisées', 'success');
                  setTimeout(() => window.location.reload(), 1500);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 size={18} /> Réinitialiser
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <div className="bg-white rounded-2xl w-full max-w-sm relative z-10 shadow-2xl p-6 animate-fade-in-up max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/60 backdrop-blur-sm -mx-6 px-6 pt-6">
              <h2 className="text-xl font-bold text-slate-800">Modifier le Profil</h2>
              <button onClick={() => setIsEditing(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <form id="editProfileForm" onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Photo de profil</label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100">
                          {editAvatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={editAvatar} alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">A</div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <label className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm cursor-pointer hover:bg-slate-50">
                            Choisir
                            <input type="file" accept="image/*" onChange={(e) => handleAvatarFile(e.target.files?.[0])} className="hidden" />
                          </label>
                          <button type="button" onClick={() => setEditAvatar(null)} className="bg-red-50 text-red-600 px-3 py-2 rounded-xl text-sm">Supprimer</button>
                        </div>
                      </div>
                    </div>
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Téléphone</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="tel" 
                    value={editForm.phone}
                    onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-400 transition-all"
                    placeholder="+225 01 23 45 67"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Poste / Titre</label>
                <input
                  type="text"
                  value={editForm.jobTitle}
                  onChange={e => setEditForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-400 transition-all"
                  placeholder="Développeur React, Product Manager..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Ville</label>
                  <input
                    type="text"
                    value={editForm.locationCity}
                    onChange={e => setEditForm(prev => ({ ...prev, locationCity: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-400 transition-all"
                    placeholder="Paris"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Pays</label>
                  <input
                    type="text"
                    value={editForm.locationCountry}
                    onChange={e => setEditForm(prev => ({ ...prev, locationCountry: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-400 transition-all"
                    placeholder="France"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">LinkedIn</label>
                <input
                  type="url"
                  value={editForm.linkedinUrl}
                  onChange={e => setEditForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-400 transition-all"
                  placeholder="https://www.linkedin.com/in/username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Portfolio / GitHub</label>
                <input
                  type="url"
                  value={editForm.portfolioUrl}
                  onChange={e => setEditForm(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-400 transition-all"
                  placeholder="https://github.com/username or https://portfolio.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Site web</label>
                <input
                  type="url"
                  value={editForm.websiteUrl}
                  onChange={e => setEditForm(prev => ({ ...prev, websiteUrl: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-400 transition-all"
                  placeholder="https://your-site.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Bio courte</label>
                <textarea
                  value={editForm.bio}
                  onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-400 transition-all"
                  rows={3}
                  placeholder="Résumé court (2-3 phrases)"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="openToWork"
                  type="checkbox"
                  checked={!!editForm.openToWork}
                  onChange={e => setEditForm(prev => ({ ...prev, openToWork: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="openToWork" className="text-sm">Ouvert aux opportunités</label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Code de Parrainage</label>
                <p className="text-xs text-slate-500 mb-2">Ce code sera généré automatiquement lors de la sauvegarde</p>
                <div className="relative">
                  <input 
                    type="text" 
                    value={editForm.referralCode}
                    readOnly
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 px-4 outline-none text-slate-600 cursor-not-allowed"
                    placeholder="Sera généré automatiquement"
                  />
                </div>
              </div>


            </form>
            <div className="sticky bottom-0 bg-white/60 backdrop-blur-sm -mx-6 px-6 py-4 border-t border-slate-100">
              <Button type="submit" form="editProfileForm" fullWidth disabled={isSubmittingProfile}>
                <Save size={18} /> {isSubmittingProfile ? 'Envoi...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {/* Install Instructions Modal (iOS) */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowInstallModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-sm relative z-10 shadow-2xl p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Installer CVLM</h2>
              <button onClick={() => setShowInstallModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">Instructions d'installation selon votre appareil :</p>
            <div className="space-y-3 text-sm text-slate-700">
              <div>
                <strong>iPhone / iPad (Safari)</strong>
                <ol className="list-decimal list-inside mt-2 ml-4">
                  <li>Appuyez sur l'icône de partage (en bas)</li>
                  <li>Sélectionnez <strong>Ajouter à l'écran d'accueil</strong></li>
                  <li>Confirmez l'ajout</li>
                </ol>
              </div>
              <div>
                <strong>Android / Chrome</strong>
                <ol className="list-decimal list-inside mt-2 ml-4">
                  <li>Ouvrez le menu (⋮) dans Chrome</li>
                  <li>Sélectionnez <strong>Installer l'application</strong> ou <strong>Ajouter à l'écran d'accueil</strong></li>
                </ol>
              </div>
              <div>
                <strong>Desktop</strong>
                <ol className="list-decimal list-inside mt-2 ml-4">
                  <li>Dans Chrome/Edge : Menu (⋮) → <strong>Installer</strong></li>
                  <li>Sinon utilisez l'option <strong>Ajouter à l'écran d'accueil</strong> si disponible</li>
                </ol>
              </div>
            </div>
            <div className="mt-6">
              <Button fullWidth onClick={() => { setShowInstallModal(false); showToast("Ouvrez Safari → Partage → Ajouter à l'écran d'accueil", 'info'); }}>
                J'ai compris
              </Button>
            </div>
          </div>
        </div>
      )}
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

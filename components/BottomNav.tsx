import React, { useEffect, useState } from 'react';
import { showToast } from '../components/toast';
import { LayoutGrid, FileText, Database, Settings, Smartphone } from 'lucide-react';
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

  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      const standalone = typeof window !== 'undefined' && (
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        // @ts-ignore
        (navigator as any).standalone === true
      );
      setIsInstalled(Boolean(standalone));
    };

    checkInstalled();

    const onInstalled = () => setIsInstalled(true);
    window.addEventListener('appinstalled', onInstalled as EventListener);

    return () => {
      window.removeEventListener('appinstalled', onInstalled as EventListener);
    };
  }, []);

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

        {/* Install button (PWA) - mobile install prompt; hide when app is installed */}
        {!isInstalled && (
          <button
            key="install"
            onClick={() => {
              // Access global deferredPrompt if available
              const dp: any = (window as any).deferredPrompt;
              if (dp) {
                dp.prompt();
                dp.userChoice.then((choiceResult: any) => {
                  console.log('User choice for install:', choiceResult);
                  // Clear prompt reference
                  (window as any).deferredPrompt = null;
                });
              } else {
                // Fallback: show a short instruction for iOS
                import('../components/toast').then(mod => {
                  mod.showToast("Pour installer l'application : ouvrez le menu du navigateur et choisissez « Ajouter à l'écran d'accueil ».", 'info');
                }).catch(() => {
                  showToast("Pour installer l'application : ouvrez le menu du navigateur et choisissez « Ajouter à l'écran d'accueil ».", 'info');
                });
              }
            }}
            className="flex flex-col items-center gap-1 w-12 group"
            title="Installer l'app"
          >
            <div className="p-2 rounded-full text-slate-500 group-hover:text-slate-700">
              <Smartphone size={22} />
            </div>
          </button>
        )}
    </div>
  );
};
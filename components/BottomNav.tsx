import React, { useEffect, useState } from 'react';
import InstallInstructions from './InstallInstructions';
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

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

    const onBeforeInstall = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      // also store globally so other components can access it if needed
      (window as any).deferredPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall as EventListener);

    return () => {
      window.removeEventListener('appinstalled', onInstalled as EventListener);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall as EventListener);
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
              // Access deferredPrompt captured from the browser (Android/Chrome)
              const dp: any = deferredPrompt ?? (window as any).deferredPrompt;
              if (dp) {
                (async () => {
                  try {
                    await dp.prompt();
                    const choiceResult = await dp.userChoice;
                    console.log('User choice for install:', choiceResult);
                    if (choiceResult && choiceResult.outcome === 'accepted') {
                      import('../components/toast').then(mod => {
                        mod.showToast('Merci ! L\'application a été installée.', 'success');
                      }).catch(() => showToast('Merci ! L\'application a été installée.', 'success'));
                      setIsInstalled(true);
                    } else {
                      import('../components/toast').then(mod => {
                        mod.showToast('Installation annulée.', 'info');
                      }).catch(() => showToast('Installation annulée.', 'info'));
                    }
                  } catch (err) {
                    console.warn('Install prompt failed', err);
                    import('../components/toast').then(mod => {
                      mod.showToast('Impossible d\'ouvrir la fenêtre d\'installation.', 'info');
                    }).catch(() => showToast('Impossible d\'ouvrir la fenêtre d\'installation.', 'info'));
                  }
                  setDeferredPrompt(null);
                  (window as any).deferredPrompt = null;
                })();
              } else {
                // Fallback: show a short instruction for iOS
                // On iOS there's no programmatic install: show an instruction modal
                setShowInstallModal(true);
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
      {showInstallModal && (
        <InstallInstructions onClose={() => setShowInstallModal(false)} />
      )}
  );
};
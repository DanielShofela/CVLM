import React, { FC } from 'react';
import { GlassCard } from './GlassCard';
import { Zap, Star, Award } from 'lucide-react';

interface AdBannerProps {
  variant?: 'premium' | 'feature' | 'success';
}

export const AdBanner: FC<AdBannerProps> = ({ variant = 'feature' }) => {
  const ads = {
    premium: {
      icon: Star,
      title: 'Abonnement Premium',
      desc: 'Accédez à tous les modèles exclusifs et créez des CV sans limites.',
      cta: 'Activer Premium',
      bg: 'from-amber-400/20 to-orange-400/20',
      border: 'border-amber-200',
      button: 'bg-amber-600 hover:bg-amber-700'
    },
    feature: {
      icon: Zap,
      title: 'Optimisez avec l\'IA',
      desc: 'Laissez Gemini rédiger et optimiser votre CV pour maximiser vos chances.',
      cta: 'Générer avec l\'IA',
      bg: 'from-blue-400/20 to-cyan-400/20',
      border: 'border-blue-200',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    success: {
      icon: Award,
      title: 'Rejoignez la communauté',
      desc: 'Connectez-vous avec d\'autres professionnels et accédez à des offres exclusives.',
      cta: 'Découvrir',
      bg: 'from-green-400/20 to-emerald-400/20',
      border: 'border-green-200',
      button: 'bg-green-600 hover:bg-green-700'
    }
  };

  const ad = ads[variant];
  const Icon = ad.icon;

  return (
    <GlassCard className={`p-4 bg-gradient-to-r ${ad.bg} border ${ad.border} overflow-hidden`}>
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white/30 rounded-lg flex-shrink-0">
          <Icon size={24} className="text-slate-700" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 mb-1">{ad.title}</h3>
          <p className="text-sm text-slate-600 mb-3">{ad.desc}</p>
          <button className={`px-4 py-1.5 rounded-lg text-white text-sm font-semibold ${ad.button} transition-colors`}>
            {ad.cta}
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

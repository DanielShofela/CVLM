import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Share2, Copy, Gift, Users } from 'lucide-react';

export const Community: React.FC = () => {
  const [referralCode] = useState('CVLM-PREM-2024');
  
  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Code copié !");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CVLM Premium',
          text: `Utilise mon code ${referralCode} pour obtenir 1 mois Premium gratuit sur CVLM !`,
          url: 'https://cvlm.app',
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      alert("Partage non supporté sur ce navigateur");
    }
  };

  return (
    <div className="pb-28 pt-6 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Communauté</h1>
        <p className="text-slate-500">Parrainez des amis, gagnez du Premium</p>
      </div>

      {/* Promo Card */}
      <div className="relative mb-8 group perspective-1000">
        <div className="absolute -inset-1 bg-gradient-to-r from-electric-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
        <GlassCard className="relative !bg-slate-900/95 !border-slate-800 text-white overflow-hidden">
           {/* Decorative circles */}
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-electric-500/20 rounded-full blur-2xl"></div>
           <div className="absolute bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>

           <div className="flex flex-col items-center justify-center space-y-4 py-4">
             <div className="bg-white/10 p-3 rounded-full mb-2 backdrop-blur-md">
               <Gift size={32} className="text-electric-400" />
             </div>
             <h2 className="text-xl font-bold">Votre Code Unique</h2>
             
             {/* QR Code Simulation (CSS based for performance/dependencies) */}
             <div className="w-40 h-40 bg-white p-2 rounded-xl flex items-center justify-center">
               <div className="w-full h-full border-4 border-slate-900 relative flex flex-wrap content-center justify-center p-1">
                  {/* Fake QR Pattern */}
                  <div className="w-8 h-8 border-2 border-black absolute top-1 left-1 bg-black/10"></div>
                  <div className="w-8 h-8 border-2 border-black absolute top-1 right-1 bg-black/10"></div>
                  <div className="w-8 h-8 border-2 border-black absolute bottom-1 left-1 bg-black/10"></div>
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-2">
                     {[...Array(24)].map((_, i) => (
                       <div key={i} className={`bg-black rounded-sm ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                     ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-1 rounded-full px-2">
                       <div className="h-6 bg-electric-600 rounded-full flex items-center justify-center px-1">
                         <span className="text-[8px] font-bold text-white">CVLM</span>
                       </div>
                    </div>
                  </div>
               </div>
             </div>

             <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/10">
               <span className="font-mono tracking-widest text-lg font-semibold">{referralCode}</span>
               <button onClick={handleCopy} className="p-1 hover:text-electric-400 transition-colors">
                 <Copy size={16} />
               </button>
             </div>

             <p className="text-xs text-slate-400 text-center max-w-[200px]">
               Partagez ce code pour offrir -20% et gagner 1 mois Premium.
             </p>
           </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <Button onClick={handleShare} fullWidth>
           <Share2 size={18} /> Partager
         </Button>
         <Button variant="secondary" fullWidth>
           <Users size={18} /> Mes Amis
         </Button>
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-slate-800 mb-4">Statistiques</h3>
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="text-center py-4">
             <div className="text-3xl font-bold text-electric-600 mb-1">12</div>
             <div className="text-xs text-slate-500 uppercase">Amis invité</div>
          </GlassCard>
          <GlassCard className="text-center py-4">
             <div className="text-3xl font-bold text-purple-600 mb-1">3</div>
             <div className="text-xs text-slate-500 uppercase">Mois Gratuits</div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { FileText, Download, Wand2, Share, Trash2, Plus, Heart, ArrowRight, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { UserCV, Template, CVRequest } from '../types';
import { generateCVAdvice } from '../services/geminiService';

interface MyCVsProps {
  cvs: UserCV[];
  requests: CVRequest[];
  onDeleteCV: (id: string) => void;
  templates: Template[];
  onToggleFavorite: (id: string) => void;
  onCreateCV: (templateId: string) => void;
}

export const MyCVs: React.FC<MyCVsProps> = ({ cvs, requests, onDeleteCV, templates, onToggleFavorite, onCreateCV }) => {
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const favorites = templates.filter(t => t.isFavorite);

  const handleAiReview = async (title: string) => {
    setLoadingAi(true);
    setAiTip(null);
    const advice = await generateCVAdvice(title);
    setAiTip(advice);
    setLoadingAi(false);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock size={16} className="text-amber-500" />;
      case 'processing': return <Loader2 size={16} className="text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      default: return <Clock size={16} className="text-slate-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  return (
    <div className="pb-28 pt-6 px-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Mes CVLMs</h1>

      {aiTip && (
        <GlassCard className="mb-6 !bg-electric-50/80 !border-electric-200 animate-fade-in">
          <div className="flex items-start gap-3">
             <div className="bg-electric-100 p-2 rounded-lg text-electric-600">
                <Wand2 size={20} />
             </div>
             <div>
               <h4 className="font-bold text-electric-800 text-sm mb-1">Conseil IA Gemini</h4>
               <p className="text-sm text-slate-600 whitespace-pre-line">{aiTip}</p>
               <button 
                onClick={() => setAiTip(null)}
                className="text-xs text-electric-600 underline mt-2"
               >
                 Fermer
               </button>
             </div>
          </div>
        </GlassCard>
      )}

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <Heart size={16} className="text-red-500 fill-red-500" />
              Modèles Favoris
            </h2>
            <span className="text-xs text-slate-400">{favorites.length} modèles</span>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide -mx-4 px-4 snap-x">
            {favorites.map(template => (
              <GlassCard key={template.id} className="min-w-[160px] w-[160px] !p-0 overflow-hidden flex-none snap-start group relative">
                 <div className="h-24 bg-slate-200 relative">
                   <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                   <button 
                    onClick={() => onToggleFavorite(template.id)}
                    className="absolute top-2 right-2 bg-white/20 backdrop-blur-md p-1.5 rounded-full hover:bg-white/40"
                   >
                     <Heart size={14} className="text-red-500 fill-red-500" />
                   </button>
                 </div>
                 <div className="p-3">
                   <h3 className="font-bold text-slate-800 text-sm truncate mb-1">{template.name}</h3>
                   <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{template.tags[0]}</span>
                   <button 
                    onClick={() => onCreateCV(template.id)}
                    className="mt-3 w-full bg-electric-100 hover:bg-electric-200 text-electric-700 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                   >
                     <Plus size={14} /> Utiliser
                   </button>
                 </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Pending Requests Section */}
      {requests.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Clock size={18} className="text-amber-500" /> Demandes en attente
          </h2>
          <div className="space-y-3">
            {requests.map(req => (
              <GlassCard key={req.id} className="flex items-center justify-between !p-4 border-l-4 border-l-amber-400">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
                      {getStatusIcon(req.status)}
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-800 text-sm">{req.templateName}</h3>
                     <p className="text-xs text-slate-500">Envoyé: {req.date}</p>
                   </div>
                </div>
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full uppercase tracking-wide">
                  {getStatusText(req.status)}
                </span>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Modèles déjà utilisés Section */}
      <div className="space-y-4">
        <h2 className="font-bold text-slate-700 mb-2">Modèles déjà utilisés</h2>

        {cvs.map(cv => (
          <GlassCard key={cv.id} className="flex gap-4 items-center">
            <div className="w-16 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 relative overflow-hidden flex-shrink-0">
                <FileText size={28} />
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-electric-400 to-electric-600" style={{width: `${cv.completion}%`}} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 truncate">{cv.title}</h3>
              <p className="text-xs text-slate-500 mb-2">Modifié: {cv.lastModified}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAiReview(cv.title)}
                  disabled={loadingAi}
                  className="px-2 py-1 bg-electric-50 text-electric-600 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-electric-100 transition-colors"
                >
                  <Wand2 size={10} /> {loadingAi ? '...' : 'AI Boost'}
                </button>
                <button className="px-2 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-slate-100" onClick={() => window.print()}>
                  <Download size={10} /> PDF
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1 border-l border-slate-100 pl-3">
               <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" onClick={() => onDeleteCV(cv.id)}>
                 <Trash2 size={16} />
               </button>
               <button className="p-2 text-slate-400 hover:text-electric-600 hover:bg-electric-50 rounded-lg transition-colors">
                 <ArrowRight size={16} />
               </button>
            </div>
          </GlassCard>
        ))}
        
        {cvs.length === 0 && (
          <div className="text-center py-8 opacity-50">
            <p className="text-slate-400 text-sm">Aucun modèle utilisé pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

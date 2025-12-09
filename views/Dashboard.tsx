
import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { ImageCarousel } from '../components/ImageCarousel';
import { Heart, Eye, Share2, Plus, Search, X, Check, FileText } from 'lucide-react';
import { showToast } from '../components/toast';
import { Template, Screen, UserProfile } from '../types';
import { Button } from '../components/Button';

interface DashboardProps {
  setScreen: (screen: Screen) => void;
  onCreateCV: (templateId: string) => void;
  onCreateLM?: (templateId: string) => void;
  templates: Template[];
  onToggleFavorite: (id: string) => void;
  userProfile?: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ setScreen, onCreateCV, onCreateLM, templates, onToggleFavorite, userProfile }) => {
  const [filter, setFilter] = useState('TOUT');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const selectedTemplate = selectedTemplateId ? templates.find(t => t.id === selectedTemplateId) || null : null;

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplateId(null);
    onCreateCV(template.id);
  };

  const categories = ['TOUT', 'CV', 'LM'];

  const filteredTemplates = filter === 'TOUT' 
    ? templates 
    : templates.filter(t => t.tags.includes(filter));

  return (
    <div className="pb-28 pt-6 px-4 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Découvrir</h1>
          <p className="text-slate-500 text-sm">Trouvez votre modèle idéal</p>
        </div>
        <button onClick={() => setScreen(Screen.SETTINGS)} className="w-10 h-10 rounded-full overflow-hidden border border-electric-200">
          {userProfile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-electric-400 to-electric-600 flex items-center justify-center text-white font-bold text-xs">
              {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'A'}
            </div>
          )}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div className="w-10 h-10 min-w-[40px] rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
            <Search size={20} className="text-slate-400" />
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === cat 
                ? 'bg-electric-600 text-white shadow-lg shadow-electric-500/30' 
                : 'bg-white text-slate-500 border border-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Ads / Promo Carousel Section */}
      <div className="space-y-3 mb-8">
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider px-1">À découvrir</h2>
        <div className="space-y-6">
          <ImageCarousel
            images={[
              '/pub/594958602_1306971441187616_2000253200515186132_n.jpg',
              '/pub/595091091_122096383569156712_4442960375816810774_n.jpg'
            ]}
            width={520}
            height={250}
            autoPlay
            autoPlayInterval={4500}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredTemplates.map(template => (
          <GlassCard key={template.id} className="p-3 relative group overflow-hidden">
            <div 
              onClick={() => setSelectedTemplateId(template.id)}
              className="relative rounded-xl overflow-hidden aspect-[3/4] mb-3 cursor-pointer"
            >
              <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-2 right-2">
                 <button 
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(template.id); }}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors"
                 >
                   <Heart 
                      size={16} 
                      className={template.isFavorite ? "fill-red-500 text-red-500" : "text-white"} 
                   />
                 </button>
              </div>
              {template.isPremium && (
                <div className="absolute top-2 left-2 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Premium</span>
                </div>
              )}
              
              {/* Overlay Actions - Visible on hover or focus */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedTemplateId(template.id); }}
                  className="bg-white text-slate-900 p-3 rounded-full hover:scale-110 transition-transform hover:bg-slate-50"
                  title="Voir le modèle"
                >
                  <Eye size={20} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleUseTemplate(template); }}
                  className="bg-electric-600 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg shadow-electric-500/50 hover:bg-electric-500"
                  title="Utiliser ce modèle"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center px-1">
              <div>
                <h3 className="font-semibold text-slate-800">{template.name}</h3>
                <span className="text-xs text-slate-400">{template.tags.join(', ')}</span>
              </div>
              <button
                className="text-slate-400 hover:text-electric-600"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const shareUrl = `${window.location.origin}/?template=${template.id}`;
                    if (navigator.share) {
                      await navigator.share({
                        title: template.name,
                        text: `Regarde ce modèle sur CVLM: ${template.name}`,
                        url: shareUrl
                      });
                      showToast('Partage réussi', 'success');
                    } else if (navigator.clipboard) {
                      await navigator.clipboard.writeText(shareUrl);
                      showToast('Lien copié dans le presse-papier', 'success');
                    } else {
                      showToast('Partage non supporté sur ce navigateur', 'info');
                    }
                  } catch (err) {
                    console.error('Share error', err);
                    showToast('Le partage a échoué ou a été annulé', 'error');
                  }
                }}
              >
                <Share2 size={18} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTemplateId(null)} />
          <div className="bg-white rounded-3xl overflow-hidden w-full max-w-sm relative z-10 shadow-2xl animate-fade-in scale-100">
            <div className="relative h-96">
               <img src={selectedTemplate.thumbnail} alt={selectedTemplate.name} className="w-full h-full object-cover" />
               <button 
                 onClick={() => setSelectedTemplateId(null)}
                 className="absolute top-4 right-4 bg-black/30 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/50"
               >
                 <X size={20} />
               </button>
               <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                 <h2 className="text-2xl font-bold mb-1">{selectedTemplate.name}</h2>
                 <p className="text-sm opacity-80">{selectedTemplate.tags.join(' • ')}</p>
               </div>
            </div>
            <div className="p-6 bg-white">
               <div className="flex justify-between items-center mb-6">
                 <div className="flex gap-2">
                    {selectedTemplate.isPremium && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">PREMIUM</span>}
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">POPULAIRE</span>
                 </div>
                 <button onClick={() => onToggleFavorite(selectedTemplate.id)}>
                    <Heart size={24} className={selectedTemplate.isFavorite ? "fill-red-500 text-red-500" : "text-slate-300"} />
                 </button>
               </div>

               <div className="space-y-3">
                 {/* Show only the action matching the template type */}
                 {selectedTemplate.tags?.includes('CV') && (
                   <Button onClick={() => handleUseTemplate(selectedTemplate)} fullWidth>
                     <Check size={20} /> Créer un CV
                   </Button>
                 )}

                 {selectedTemplate.tags?.includes('LM') && onCreateLM && (
                   <Button 
                     onClick={() => {
                       setSelectedTemplateId(null);
                       onCreateLM(selectedTemplate.id);
                     }} 
                     variant="secondary" 
                     fullWidth
                   >
                     <FileText size={20} /> Créer une LM
                   </Button>
                 )}

                 {/* Fallback if no tag present */}
                 {!selectedTemplate.tags?.includes('CV') && !selectedTemplate.tags?.includes('LM') && (
                   <Button onClick={() => handleUseTemplate(selectedTemplate)} fullWidth>
                     <Check size={20} /> Utiliser ce modèle
                   </Button>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

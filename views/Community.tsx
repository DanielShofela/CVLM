import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { VersionManagement } from '../components/VersionManagement';
import { Database, Download, Trash2, Edit2, FileText } from 'lucide-react';
import { getAllVersions, deleteVersion } from '../services/cvVersionService';
import { getAllLMVersions, deleteLMVersion } from '../services/lmVersionService';
import { CVVersion, LMVersion } from '../types';

type Version = CVVersion | LMVersion;

export const Community: React.FC = () => {
  const [cvVersions, setCvVersions] = useState<CVVersion[]>([]);
  const [lmVersions, setLmVersions] = useState<LMVersion[]>([]);
  const [showManagement, setShowManagement] = useState(false);

  useEffect(() => {
    const loadVersions = () => {
      const allCvVersions = getAllVersions();
      const allLmVersions = getAllLMVersions();
      setCvVersions(allCvVersions);
      setLmVersions(allLmVersions);
    };
    loadVersions();
  }, []);

  const handleDeleteCVVersion = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette version CV ?')) {
      deleteVersion(id);
      setCvVersions(cvVersions.filter(v => v.id !== id));
    }
  };

  const handleDeleteLMVersion = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette version LM ?')) {
      deleteLMVersion(id);
      setLmVersions(lmVersions.filter(v => v.id !== id));
    }
  };

  const handleRefresh = () => {
    const allCvVersions = getAllVersions();
    const allLmVersions = getAllLMVersions();
    setCvVersions(allCvVersions);
    setLmVersions(allLmVersions);
  };

  const totalVersions = cvVersions.length + lmVersions.length;

  return (
    <div className="pb-28 pt-6 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Gestion des Versions</h1>
        <p className="text-slate-500">Gérez vos CV et Lettres de Motivation sauvegardés</p>
      </div>

      {/* Stats Card */}
      <GlassCard className="mb-6 bg-gradient-to-r from-electric-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">Total de Versions</p>
            <h2 className="text-3xl font-bold text-slate-800">{totalVersions}</h2>
          </div>
          <div className="bg-electric-100 p-4 rounded-full">
            <Database size={32} className="text-electric-600" />
          </div>
        </div>
      </GlassCard>

      {/* CV Versions Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
          <FileText size={20} />
          Versions CV ({cvVersions.length})
        </h2>
        
        {cvVersions.length === 0 ? (
          <GlassCard className="text-center py-8 opacity-60">
            <p className="text-slate-500 text-sm">Aucune version CV sauvegardée</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {cvVersions.map((version) => (
              <GlassCard key={version.id} className="!p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-electric-100 text-electric-700 text-xs font-semibold rounded">
                        CV - {version.profileType}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 truncate">{version.name}</h3>
                    <p className="text-sm text-slate-500">
                      {version.data?.fullName || 'Sans nom'} • {new Date(version.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const json = JSON.stringify(version.data, null, 2);
                        const blob = new Blob([json], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${version.name}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Exporter"
                    >
                      <Download size={18} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteCVVersion(version.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* LM Versions Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
          <FileText size={20} />
          Versions LM ({lmVersions.length})
        </h2>
        
        {lmVersions.length === 0 ? (
          <GlassCard className="text-center py-8 opacity-60">
            <p className="text-slate-500 text-sm">Aucune version LM sauvegardée</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {lmVersions.map((version) => (
              <GlassCard key={version.id} className="!p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                        LM - {version.profileType}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 truncate">{version.name}</h3>
                    <p className="text-sm text-slate-500">
                      {version.data?.fullName || 'Sans nom'} • {new Date(version.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const json = JSON.stringify(version.data, null, 2);
                        const blob = new Blob([json], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${version.name}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Exporter"
                    >
                      <Download size={18} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteLMVersion(version.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Management Button */}
      {totalVersions > 0 && (
        <div className="mt-6">
          <Button onClick={() => setShowManagement(true)} fullWidth>
            <Edit2 size={18} /> Gérer les versions
          </Button>
        </div>
      )}

      {/* Management Modal */}
      {showManagement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowManagement(false)} />
          <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 shadow-2xl p-6 my-8 animate-fade-in-up">
            <VersionManagement onClose={() => { setShowManagement(false); handleRefresh(); }} />
          </div>
        </div>
      )}
    </div>
  );
};
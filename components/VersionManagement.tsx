import React, { useState, useEffect } from 'react';
import { CVVersion, LMVersion } from '../types';
import {
  getAllVersions,
  deleteVersion,
  renameVersion
} from '../services/cvVersionService';
import {
  getAllLMVersions,
  deleteLMVersion,
  updateLMVersion
} from '../services/lmVersionService';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { Trash2, Edit2, X, CheckCircle } from 'lucide-react';

type AnyVersion = CVVersion | LMVersion;

interface VersionManagementProps {
  onClose?: () => void;
}

export const VersionManagement: React.FC<VersionManagementProps> = ({ onClose }) => {
  const [cvVersions, setCVVersions] = useState<CVVersion[]>([]);
  const [lmVersions, setLMVersions] = useState<LMVersion[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadVersions();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadVersions = () => {
    setCVVersions(getAllVersions().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    setLMVersions(getAllLMVersions().sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleDelete = (versionId: string, type: 'cv' | 'lm') => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette version ?')) {
      const success = type === 'cv' ? deleteVersion(versionId) : deleteLMVersion(versionId);
      if (success) {
        loadVersions();
        showToast('Version supprimée avec succès', 'success');
      } else {
        showToast('Erreur lors de la suppression', 'error');
      }
    }
  };

  const handleStartEdit = (version: AnyVersion) => {
    setEditingId(version.id);
    setEditingName(version.name);
  };

  const handleSaveEdit = (versionId: string, type: 'cv' | 'lm') => {
    if (editingName.trim()) {
      const updated = type === 'cv' 
        ? renameVersion(versionId, editingName.trim())
        : updateLMVersion(versionId, { name: editingName.trim() });
      if (updated) {
        loadVersions();
        setEditingId(null);
        showToast('Version renommée avec succès', 'success');
      }
    }
  };

  // Export disabled: exporting versions is not permitted per product requirements

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des versions</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-3 rounded-lg ${
            toast.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* CV Versions Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">CVs ({cvVersions.length})</h3>
        {cvVersions.length === 0 ? (
          <GlassCard>
            <div className="text-center py-8">
              <p className="text-gray-600">Aucune version CV enregistrée pour l'instant.</p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {cvVersions.map(version => (
              <GlassCard key={version.id} className="p-4">
                <div className="space-y-3">
                  {/* Header with Profile Type and Created Date */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-electric-100 text-electric-700 rounded text-xs font-semibold">
                          {version.profileType}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(version.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Editable Name */}
                      {editingId === version.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={e => setEditingName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(version.id, 'cv')}
                            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <h3 className="font-semibold text-gray-800">{version.name}</h3>
                      )}

                      {/* User Details */}
                      <p className="text-sm text-gray-600 mt-2">
                        {version.data.fullName} • {version.data.jobTitle || 'Pas de poste'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    {editingId !== version.id && (
                      <>
                        <button
                          onClick={() => handleStartEdit(version)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                          Renommer
                        </button>
                        <button
                          onClick={() => handleDelete(version.id, 'cv')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* LM Versions Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Lettres de motivation ({lmVersions.length})</h3>
        {lmVersions.length === 0 ? (
          <GlassCard>
            <div className="text-center py-8">
              <p className="text-gray-600">Aucune lettre de motivation enregistrée pour l'instant.</p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {lmVersions.map(version => (
              <GlassCard key={version.id} className="p-4">
                <div className="space-y-3">
                  {/* Header with LM Tag and Created Date */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                          LM
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(version.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Editable Name */}
                      {editingId === version.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={e => setEditingName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(version.id, 'lm')}
                            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <h3 className="font-semibold text-gray-800">{version.name}</h3>
                      )}

                      {/* Company Details */}
                      <p className="text-sm text-gray-600 mt-2">
                        {version.companyName || 'Entreprise non spécifiée'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    {editingId !== version.id && (
                      <>
                        <button
                          onClick={() => handleStartEdit(version)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                          Renommer
                        </button>
                        <button
                          onClick={() => handleDelete(version.id, 'lm')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

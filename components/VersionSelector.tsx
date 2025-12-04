import React, { useState, useEffect } from 'react';
import { CVVersion } from '../types';
import { getAllVersions, groupVersionsByProfileType } from '../services/cvVersionService';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { ChevronRight, Plus, Copy } from 'lucide-react';

interface VersionSelectorProps {
  onSelectVersion: (version: CVVersion) => void;
  onCreateNew: () => void;
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({
  onSelectVersion,
  onCreateNew
}) => {
  const [groupedVersions, setGroupedVersions] = useState<Record<string, CVVersion[]>>({});
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);

  useEffect(() => {
    const grouped = groupVersionsByProfileType();
    setGroupedVersions(grouped);
    // Expand le premier profil par défaut
    const firstProfile = Object.keys(grouped)[0];
    if (firstProfile) setExpandedProfile(firstProfile);
  }, []);

  const profileTypes = Object.keys(groupedVersions).sort();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Vos versions CV</h2>
      <p className="text-gray-600 mb-6">
        Sélectionnez une version existante pour préremplir le formulaire, ou créez une nouvelle version.
      </p>

      {profileTypes.length === 0 ? (
        <GlassCard>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Aucune version enregistrée pour l'instant.</p>
            <Button onClick={onCreateNew} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Créer une nouvelle version
            </Button>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {profileTypes.map(profileType => (
            <div key={profileType}>
              <button
                onClick={() =>
                  setExpandedProfile(expandedProfile === profileType ? null : profileType)
                }
                className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-electric-50 to-electric-100 hover:from-electric-100 hover:to-electric-200 rounded-lg transition"
              >
                <span className="font-semibold text-electric-600">{profileType}</span>
                <span className="text-sm text-gray-600">
                  {groupedVersions[profileType].length} version(s)
                </span>
              </button>

              {expandedProfile === profileType && (
                <div className="mt-2 space-y-2 pl-2">
                  {groupedVersions[profileType].map(version => (
                    <GlassCard key={version.id} className="p-3">
                      <div
                        onClick={() => onSelectVersion(version)}
                        className="cursor-pointer hover:opacity-80 transition flex items-start justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{version.name}</p>
                          <p className="text-sm text-gray-600">
                            {version.data.fullName} • {version.data.jobTitle}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Créée le {new Date(version.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-electric-500 flex-shrink-0" />
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-gray-200">
            <Button onClick={onCreateNew} variant="secondary" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Créer une nouvelle version
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

import { CVFormData, CVVersion } from '../types';

const STORAGE_KEY = 'cvlm_versions';

/**
 * Formate la date au format français avec heure
 */
export const formatDateWithTime = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}h${minutes}`;
};

/**
 * Génère un timestamp ISO
 */
export const generateTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Génère un ID unique pour une version
 * Format: CVLM_<profileType>_<timestamp>
 */
export const generateVersionId = (profileType: string): string => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.]/g, '')
    .slice(0, 14); // YYYYMMDDHHmmss
  return `CVLM_${profileType.toUpperCase()}_${timestamp}`;
};

/**
 * Génère un nom d'affichage pour une version
 * Format: "DEV - 03/12/2025 10h22"
 */
export const generateVersionName = (profileType: string, date: Date): string => {
  return `${profileType} - ${formatDateWithTime(date)}`;
};

/**
 * Récupère toutes les versions stockées localement
 */
export const getAllVersions = (): CVVersion[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Erreur lors de la lecture des versions:', err);
    return [];
  }
};

/**
 * Sauvegarde une nouvelle version
 */
export const saveVersion = (profileType: string, formData: CVFormData): CVVersion => {
  const now = new Date();
  const version: CVVersion = {
    id: generateVersionId(profileType),
    profileType: profileType.toUpperCase(),
    name: generateVersionName(profileType, now),
    data: formData,
    createdAt: generateTimestamp(),
    updatedAt: generateTimestamp()
  };

  const allVersions = getAllVersions();
  allVersions.push(version);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allVersions));
    console.log(`✓ Version sauvegardée: ${version.id}`);
  } catch (err) {
    console.error('Erreur lors de la sauvegarde de la version:', err);
  }

  return version;
};

/**
 * Récupère une version spécifique par ID
 */
export const getVersionById = (versionId: string): CVVersion | null => {
  const versions = getAllVersions();
  return versions.find(v => v.id === versionId) || null;
};

/**
 * Récupère toutes les versions d'un type de profil
 */
export const getVersionsByProfileType = (profileType: string): CVVersion[] => {
  const versions = getAllVersions();
  return versions.filter(v => v.profileType === profileType.toUpperCase());
};

/**
 * Met à jour une version existante
 */
export const updateVersion = (versionId: string, newData: CVFormData): CVVersion | null => {
  const allVersions = getAllVersions();
  const index = allVersions.findIndex(v => v.id === versionId);

  if (index === -1) return null;

  allVersions[index].data = newData;
  allVersions[index].updatedAt = generateTimestamp();

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allVersions));
    console.log(`✓ Version mise à jour: ${versionId}`);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la version:', err);
  }

  return allVersions[index];
};

/**
 * Renomme une version
 */
export const renameVersion = (versionId: string, newName: string): CVVersion | null => {
  const allVersions = getAllVersions();
  const index = allVersions.findIndex(v => v.id === versionId);

  if (index === -1) return null;

  allVersions[index].name = newName;
  allVersions[index].updatedAt = generateTimestamp();

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allVersions));
    console.log(`✓ Version renommée: ${versionId} → ${newName}`);
  } catch (err) {
    console.error('Erreur lors du renommage de la version:', err);
  }

  return allVersions[index];
};

/**
 * Supprime une version
 */
export const deleteVersion = (versionId: string): boolean => {
  const allVersions = getAllVersions();
  const filtered = allVersions.filter(v => v.id !== versionId);

  if (filtered.length === allVersions.length) {
    console.warn(`Version introuvable: ${versionId}`);
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    console.log(`✓ Version supprimée: ${versionId}`);
  } catch (err) {
    console.error('Erreur lors de la suppression de la version:', err);
  }

  return true;
};

/**
 * Récupère les profils types uniques (DEV, COMMERCIAL, etc.)
 */
export const getUniqueProfileTypes = (): string[] => {
  const versions = getAllVersions();
  const types = new Set(versions.map(v => v.profileType));
  return Array.from(types).sort();
};

/**
 * Grouper les versions par type de profil
 */
export const groupVersionsByProfileType = (): Record<string, CVVersion[]> => {
  const versions = getAllVersions();
  const grouped: Record<string, CVVersion[]> = {};

  versions.forEach(version => {
    if (!grouped[version.profileType]) {
      grouped[version.profileType] = [];
    }
    grouped[version.profileType].push(version);
  });

  // Trier chaque groupe par date de création (plus récent en premier)
  Object.keys(grouped).forEach(key => {
    grouped[key].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  return grouped;
};

/**
 * Exporte une version (pour sauvegarde/partage)
 */
export const exportVersion = (versionId: string): string | null => {
  const version = getVersionById(versionId);
  if (!version) return null;

  try {
    return JSON.stringify(version, null, 2);
  } catch (err) {
    console.error('Erreur lors de l\'export:', err);
    return null;
  }
};

/**
 * Importe une version depuis un JSON
 */
export const importVersion = (jsonData: string): CVVersion | null => {
  try {
    const version: CVVersion = JSON.parse(jsonData);

    // Validation basique
    if (!version.profileType || !version.data) {
      console.error('Format d\'import invalide');
      return null;
    }

    const allVersions = getAllVersions();
    // Générer un nouvel ID si l'ID existe déjà
    if (allVersions.find(v => v.id === version.id)) {
      version.id = generateVersionId(version.profileType);
    }

    allVersions.push(version);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allVersions));

    console.log(`✓ Version importée: ${version.id}`);
    return version;
  } catch (err) {
    console.error('Erreur lors de l\'import:', err);
    return null;
  }
};

/**
 * Vérifie s'il existe des données CV enregistrées
 */
export const hasAnyVersions = (): boolean => {
  return getAllVersions().length > 0;
};

// Type de retour pour getVersionSummary
export interface VersionSummary {
  id: string;
  name: string;
  profileType: string;
  createdAt: string;
  fullName: string;
  jobTitle: string;
}

/**
 * Récupère un résumé pour affichage (sans les données volumineuses)
 */
export const getVersionSummary = (version: CVVersion): VersionSummary => {
  return {
    id: version.id,
    name: version.name,
    profileType: version.profileType,
    createdAt: version.createdAt,
    fullName: version.data.fullName,
    jobTitle: version.data.jobTitle
  };
};

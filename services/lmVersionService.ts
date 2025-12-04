import { LMVersion, LMFormData, LMVersionHistoryResponse } from '../types';

const LM_VERSIONS_STORAGE_KEY = 'lm_versions';

/**
 * Saves an LM version to localStorage
 */
export const saveLMVersion = (
  profileType: string,
  name: string,
  formData: LMFormData,
  templateId?: string,
  templateName?: string
): LMVersion => {
  const id = `LM_${profileType}_${Date.now()}`;
  const now = new Date().toISOString();

  const version: LMVersion = {
    id,
    profileType,
    name: name || `LM ${profileType} - ${new Date().toLocaleDateString()}`,
    data: formData,
    createdAt: now,
    updatedAt: now,
    templateId,
    templateName
  };

  const versions = getAllLMVersions();
  versions.push(version);

  try {
    localStorage.setItem(LM_VERSIONS_STORAGE_KEY, JSON.stringify(versions));
  } catch (err) {
    console.error('Erreur sauvegarde LM version:', err);
  }

  return version;
};

/**
 * Get all LM versions from localStorage
 */
export const getAllLMVersions = (): LMVersion[] => {
  try {
    const stored = localStorage.getItem(LM_VERSIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Erreur lecture LM versions:', err);
    return [];
  }
};

/**
 * Get a specific LM version by ID
 */
export const getLMVersionById = (id: string): LMVersion | null => {
  const versions = getAllLMVersions();
  return versions.find(v => v.id === id) || null;
};

/**
 * Update an LM version
 */
export const updateLMVersion = (id: string, updates: Partial<LMVersion>): LMVersion | null => {
  const versions = getAllLMVersions();
  const index = versions.findIndex(v => v.id === id);

  if (index === -1) return null;

  const updated = {
    ...versions[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  versions[index] = updated;

  try {
    localStorage.setItem(LM_VERSIONS_STORAGE_KEY, JSON.stringify(versions));
  } catch (err) {
    console.error('Erreur update LM version:', err);
  }

  return updated;
};

/**
 * Delete an LM version
 */
export const deleteLMVersion = (id: string): boolean => {
  const versions = getAllLMVersions();
  const filtered = versions.filter(v => v.id !== id);

  if (filtered.length === versions.length) return false; // Version not found

  try {
    localStorage.setItem(LM_VERSIONS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Erreur suppression LM version:', err);
    return false;
  }
};

/**
 * Get LM version history (API response format)
 */
export const getLMVersionHistory = (): LMVersionHistoryResponse => {
  const versions = getAllLMVersions();
  return {
    versions,
    hasData: versions.length > 0
  };
};

/**
 * Export all LM versions as JSON
 */
export const exportLMVersionsJSON = (): string => {
  const versions = getAllLMVersions();
  return JSON.stringify(versions, null, 2);
};

/**
 * Clear all LM versions
 */
export const clearAllLMVersions = (): void => {
  try {
    localStorage.removeItem(LM_VERSIONS_STORAGE_KEY);
  } catch (err) {
    console.error('Erreur clear LM versions:', err);
  }
};

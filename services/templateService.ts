import { Template } from '../types';

/**
 * Génère une liste de templates en utilisant les vraies images CV et LM
 * Les images sont stockées dans public/cv-samples et public/lm-samples
 */

const CV_SAMPLES = [
  '/cv-samples/CV 001H.png',
  '/cv-samples/CV 002F.png',
  '/cv-samples/CV 003H.png',
  '/cv-samples/CV 004H.png',
  '/cv-samples/CV 005M.png',
  '/cv-samples/CV 006H.png',
  '/cv-samples/CV 007F.png',
  '/cv-samples/CV 008F.png',
  '/cv-samples/CV 009F.png',
  '/cv-samples/CV 010F.png',
  '/cv-samples/CV 011H.png',
  '/cv-samples/CV 012H.png',
  '/cv-samples/CV 013F.png',
  '/cv-samples/CV 014H.png',
  '/cv-samples/CV 015F.png',
  '/cv-samples/CV 016M.png',
  '/cv-samples/CV 017F.png',
  '/cv-samples/CV 018H.png',
  '/cv-samples/CV 019M.png',
  '/cv-samples/CV 020F.png',
  '/cv-samples/CV 021F.png',
  '/cv-samples/CV 022F.png',
  '/cv-samples/CV 023H.png',
  '/cv-samples/CV 024H.png',
  '/cv-samples/CV 025F.png',
  '/cv-samples/CV 026F.png',
  '/cv-samples/CV 027F.png',
  '/cv-samples/CV 028H.png',
  '/cv-samples/CV 029H.png',
  '/cv-samples/CV 030F.png',
  '/cv-samples/CV 031F.png',
  '/cv-samples/CV 032H.png',
  '/cv-samples/CV 033H.png',
  '/cv-samples/CV 034F.png',
  '/cv-samples/CV 035H.png',
  '/cv-samples/CV 036H.png',
  '/cv-samples/CV 037F.png',
  '/cv-samples/CV 038H.png',
  '/cv-samples/CV 039F.png',
  '/cv-samples/CV 040F.png',
  '/cv-samples/CV 041F.png',
];

const LM_SAMPLES = [
  '/lm-samples/LM 001.png',
  '/lm-samples/LM 002.png',
  '/lm-samples/LM 003.png',
  '/lm-samples/LM 004.png',
  '/lm-samples/LM 005.png',
  '/lm-samples/LM 006.png',
  '/lm-samples/LM 007.png',
  '/lm-samples/LM 008.png',
  '/lm-samples/LM 009.png',
  '/lm-samples/LM 010.png',
  '/lm-samples/LM 011.png',
  '/lm-samples/LM 012.png',
  '/lm-samples/LM 013.png',
  '/lm-samples/LM 014.png',
  '/lm-samples/LM 015.png',
  '/lm-samples/LM 016.png',
  '/lm-samples/LM 017.png',
  '/lm-samples/LM 018.png',
  '/lm-samples/LM 019.png',
  '/lm-samples/LM 020.png',
  '/lm-samples/LM 021.png',
  '/lm-samples/LM 022.png',
  '/lm-samples/LM 023.png',
  '/lm-samples/LM 024.png',
  '/lm-samples/LM 025.png',
  '/lm-samples/LM 026.png',
  '/lm-samples/LM 027.png',
  '/lm-samples/LM 028.png',
  '/lm-samples/LM 029.png',
  '/lm-samples/LM 030.png',
  '/lm-samples/LM 031.png',
  '/lm-samples/LM 032.png',
  '/lm-samples/LM 033.png',
  '/lm-samples/LM 034.png',
  '/lm-samples/LM 035.png',
  '/lm-samples/LM 036.png',
  '/lm-samples/LM 037.png',
  '/lm-samples/LM 038.png',
  '/lm-samples/LM 039.png',
  '/lm-samples/LM 040.png',
  '/lm-samples/LM 041.png',
  '/lm-samples/LM 042.png',
  '/lm-samples/LM 043.png',
];

const CV_NAMES = [
  'Futurism Alpha',
  'Minimalist Pro',
  'Executive Suite',
  'Creative Burst',
  'Modern Tech',
  'Professional Blue',
  'Elegant Gold',
  'Dynamic Red',
  'Soft Gray',
  'Vibrant Green',
  'Classic Black',
  'Ocean Wave',
];

const LM_NAMES = [
  'Lettre Neo',
  'Correspondance Pro',
  'Business Letter',
  'Modern Style',
  'Elegant Format',
  'Professional Touch',
  'Classic Letter',
  'Contemporary',
];

/**
 * Génère les templates à partir des images réelles
 */
export const generateTemplates = (): Template[] => {
  const templates: Template[] = [];
  let templateId = 1;

  // Ajouter les templates CV
  CV_SAMPLES.forEach((thumbnail, index) => {
    const nameIndex = index % CV_NAMES.length;
    templates.push({
      id: String(templateId++),
      name: `${CV_NAMES[nameIndex]} #${index + 1}`,
      thumbnail,
      tags: ['CV'],
      isPremium: false,
      isFavorite: false,
    });
  });

  // Ajouter les templates LM
  LM_SAMPLES.forEach((thumbnail, index) => {
    const nameIndex = index % LM_NAMES.length;
    templates.push({
      id: String(templateId++),
      name: `${LM_NAMES[nameIndex]} #${index + 1}`,
      thumbnail,
      tags: ['LM'],
      isPremium: false,
      isFavorite: false,
    });
  });

  return templates;
};

/**
 * Récupère le nombre total de templates
 */
export const getTotalTemplatesCount = (): number => {
  return CV_SAMPLES.length + LM_SAMPLES.length;
};

/**
 * Récupère les templates CV uniquement
 */
export const getCVTemplates = (): Template[] => {
  return generateTemplates().filter(t => t.tags.includes('CV'));
};

/**
 * Récupère les templates LM uniquement
 */
export const getLMTemplates = (): Template[] => {
  return generateTemplates().filter(t => t.tags.includes('LM'));
};

/**
 * Récupère les templates favoris
 */
export const getFavoriteTemplates = (): Template[] => {
  return generateTemplates().filter(t => t.isFavorite);
};

/**
 * Récupère les templates premium
 */
export const getPremiumTemplates = (): Template[] => {
  return generateTemplates().filter(t => t.isPremium);
};

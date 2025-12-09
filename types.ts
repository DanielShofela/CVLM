
export enum Screen {
  ONBOARDING = 'ONBOARDING',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  MY_CVS = 'MY_CVS',
  COMMUNITY = 'COMMUNITY',
  SETTINGS = 'SETTINGS',
  CV_PREVIEW = 'CV_PREVIEW',
  CV_FORM = 'CV_FORM',
  LM_FORM = 'LM_FORM' // New Screen for the Lettre de Motivation form
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  tags: string[];
  isPremium: boolean;
  isFavorite: boolean;
}

export interface UserCV {
  id: string;
  title: string;
  templateId: string;
  lastModified: string;
  completion: number; // 0-100
}

export interface CVRequest {
  id: string;
  templateName: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'archived';
}

export interface UserProfile {
  name: string;
  email: string;
  referralCode: string;
  avatarUrl?: string | null;
  phone?: string | null;
  // Useful profile fields
  jobTitle?: string | null;
  locationCity?: string | null;
  locationCountry?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  websiteUrl?: string | null;
  bio?: string | null;
  openToWork?: boolean;
  languages?: string[];
  points: number;
}



// CV Data Versioning System
export interface CVFormData {
  fullName: string;
  email: string;
  phonePrimary: string;
  phoneSecondary: string;
  address: string;
  birthYear: string;
  nationality: string;
  jobTitle: string;
  portfolioUrl: string;
  educations: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  experiences: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  skillsTechnical: string;
  skillsTools: string;
  skillsLanguages: string;
  certifications: string;
  interestsHobbies: string;
  interestsVolunteering: string;
  references: string;
  draft: string;
  message: string;
}

export interface CVVersion {
  id: string; // Unique identifier: CVLM_<profile>_<timestamp>
  profileType: string; // e.g., "DEV", "COMMERCIAL", "DESIGNER"
  name: string; // Display name: "DEV - 2025-12-03 10:22"
  data: CVFormData; // All form data
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  templateId?: string;
  templateName?: string;
}

export interface LMFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  positionTitle: string;
  companyName: string;
  hiringManager: string;
  industry: string;
  keySkills: string;
  achievements: string;
  coverLetter: string;
}

export interface LMVersion {
  id: string; // Unique identifier: LM_<profile>_<timestamp>
  profileType: string; // e.g., "DEV", "COMMERCIAL", "DESIGNER"
  name: string; // Display name: "LM DEV - 2025-12-03 10:22"
  data: LMFormData; // All LM form data
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  templateId?: string;
  templateName?: string;
}

export interface CVVersionHistoryResponse {
  versions: CVVersion[];
  hasData: boolean;
}

export interface LMVersionHistoryResponse {
  versions: LMVersion[];
  hasData: boolean;
}

/**
 * Vérifie si le profil utilisateur est complet
 * Retourne true si les champs essentiels sont remplis
 */
export function isProfileComplete(profile: UserProfile): boolean {
  return !!(
    profile.name?.trim() &&
    profile.email?.trim() &&
    profile.phone?.trim() &&
    profile.jobTitle?.trim() &&
    profile.locationCity?.trim() &&
    profile.locationCountry?.trim()
  );
}
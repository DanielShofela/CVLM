
export enum Screen {
  ONBOARDING = 'ONBOARDING',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  MY_CVS = 'MY_CVS',
  COMMUNITY = 'COMMUNITY',
  SETTINGS = 'SETTINGS',
  CV_PREVIEW = 'CV_PREVIEW',
  CV_FORM = 'CV_FORM' // New Screen for the multi-step form
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
  status: 'pending' | 'processing' | 'completed';
}

export interface UserProfile {
  name: string;
  email: string;
  referralCode: string;
  points: number;
}
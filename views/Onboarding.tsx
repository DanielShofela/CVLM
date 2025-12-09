import React, { useEffect } from 'react';
import { Screen } from '../types';

interface OnboardingProps {
  setScreen: (screen: Screen) => void;
}

// Onboarding slides removed — redirect directly to dashboard
export const Onboarding: React.FC<OnboardingProps> = ({ setScreen }) => {
  useEffect(() => {
    setScreen(Screen.DASHBOARD);
  }, [setScreen]);

  return null;
};
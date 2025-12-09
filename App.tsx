
import React, { useState, useEffect } from 'react';
import { Screen, UserCV, Template, CVRequest, UserProfile } from './types';
import { Onboarding } from './views/Onboarding';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { MyCVs } from './views/MyCVs';
import { Community } from './views/Community';
import { Settings } from './views/Settings';
import { CVForm } from './views/CVForm';
import { LMForm } from './views/LMForm';
import { BottomNav } from './components/BottomNav';
import { generateTemplates } from './services/templateService';

const MOCK_CVS_INITIAL: UserCV[] = [];

const MOCK_REQUESTS_INITIAL: CVRequest[] = [];

const MOCK_TEMPLATES: Template[] = generateTemplates();

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  referralCode: '',
  phone: '',
  jobTitle: '',
  locationCity: '',
  locationCountry: '',
  linkedinUrl: '',
  portfolioUrl: '',
  websiteUrl: '',
  bio: '',
  openToWork: false,
  languages: [],
  points: 0
};

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.DASHBOARD);
  
  // Persistence State Initialization
  const [cvs, setCvs] = useState<UserCV[]>(() => {
    const saved = localStorage.getItem('cvs');
    return saved ? JSON.parse(saved) : MOCK_CVS_INITIAL;
  });
  
  const [requests, setRequests] = useState<CVRequest[]>(() => {
    const saved = localStorage.getItem('requests');
    return saved ? JSON.parse(saved) : MOCK_REQUESTS_INITIAL;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [selectedTemplateForForm, setSelectedTemplateForForm] = useState<Template | null>(null);

  // Nettoyer le localStorage au premier démarrage (optionnel)
  useEffect(() => {
    // Vide complètement le localStorage pour recommencer de zéro
    localStorage.removeItem('cvs');
    localStorage.removeItem('requests');
    localStorage.removeItem('userProfile');
  }, []);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('cvs', JSON.stringify(cvs));
  }, [cvs]);

  useEffect(() => {
    localStorage.setItem('requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  const handleStartForm = (templateId: string) => {
    const tmpl = templates.find(t => t.id === templateId) || null;
    setSelectedTemplateForForm(tmpl);
    setScreen(Screen.CV_FORM);
  };

  const handleStartLMForm = (templateId: string) => {
    const tmpl = templates.find(t => t.id === templateId) || null;
    setSelectedTemplateForForm(tmpl);
    setScreen(Screen.LM_FORM);
  };

  const handleNewRequest = (templateName: string) => {
    const newRequest: CVRequest = {
      id: Date.now().toString(),
      templateName: templateName,
      date: "A l'instant",
      status: 'pending'
    };
    setRequests([newRequest, ...requests]);
    setScreen(Screen.MY_CVS);
  };

  const handleUpdateRequestStatus = (id: string, status: 'pending' | 'processing' | 'completed') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDeleteRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleArchiveRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'archived' } : r));
  };

  const handleUnarchiveRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'completed' } : r));
  };

  const handleDeleteCV = (id: string) => {
    setCvs(cvs.filter(c => c.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t));
  };

  const handleUpdateProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...newProfile }));
  };

  const renderScreen = () => {
    switch (screen) {
      case Screen.ONBOARDING:
        return <Onboarding setScreen={setScreen} />;
      case Screen.LOGIN:
        return <Login setScreen={setScreen} />;
      case Screen.DASHBOARD:
        return (
          <Dashboard 
            setScreen={setScreen} 
              onCreateCV={handleStartForm}
              onCreateLM={handleStartLMForm}
            templates={templates}
            onToggleFavorite={handleToggleFavorite}
              userProfile={userProfile}
          />
        );
      case Screen.MY_CVS:
        return (
          <MyCVs 
            cvs={cvs} 
            requests={requests}
            onDeleteCV={handleDeleteCV} 
            templates={templates}
            onToggleFavorite={handleToggleFavorite}
            onCreateCV={handleStartForm}
            onUpdateRequest={handleUpdateRequestStatus}
            onDeleteRequest={handleDeleteRequest}
            onArchiveRequest={handleArchiveRequest}
            onUnarchiveRequest={handleUnarchiveRequest}
          />
        );
      case Screen.COMMUNITY:
        return <Community />;
      case Screen.SETTINGS:
        return (
          <Settings 
            setScreen={setScreen} 
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case Screen.CV_FORM:
        return (
          <CVForm 
            setScreen={setScreen} 
            selectedTemplate={selectedTemplateForForm} 
            onSubmitSuccess={handleNewRequest}
            userProfile={userProfile}
          />
        );
      case Screen.LM_FORM:
        return (
          <LMForm 
            setScreen={setScreen} 
            selectedTemplate={selectedTemplateForForm} 
            onSubmitSuccess={handleNewRequest}
            userProfile={userProfile}
          />
        );
      default:
        return (
          <Dashboard 
            setScreen={setScreen} 
            onCreateCV={handleStartForm} 
            templates={templates}
            onToggleFavorite={handleToggleFavorite}
            userProfile={userProfile}
          />
        );
    }
  };

  const showNav = screen !== Screen.ONBOARDING && screen !== Screen.LOGIN && screen !== Screen.CV_FORM && screen !== Screen.LM_FORM;

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto shadow-2xl relative overflow-hidden md:border-x md:border-slate-200">
      {/* Background Ambience */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-electric-200/40 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-[100px] pointer-events-none -z-0" />

      <main className="relative z-10 min-h-screen">
        {renderScreen()}
      </main>
      
      {showNav && <BottomNav currentScreen={screen} setScreen={setScreen} />}
    </div>
  );
};

export default App;

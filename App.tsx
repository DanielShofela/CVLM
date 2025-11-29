
import React, { useState } from 'react';
import { Screen, UserCV, Template, CVRequest } from './types';
import { Onboarding } from './views/Onboarding';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { MyCVs } from './views/MyCVs';
import { Community } from './views/Community';
import { Settings } from './views/Settings';
import { CVForm } from './views/CVForm';
import { BottomNav } from './components/BottomNav';

const MOCK_CVS_INITIAL: UserCV[] = [
  { id: '101', title: 'Développeur React Senior', templateId: '1', lastModified: '2h', completion: 90 },
  { id: '102', title: 'Consultant UX/UI', templateId: '3', lastModified: '2j', completion: 45 },
];

const MOCK_REQUESTS_INITIAL: CVRequest[] = [
  { id: 'req-1', templateName: 'Executive Suite', date: 'Hier', status: 'processing' }
];

const MOCK_TEMPLATES: Template[] = [
  { id: '1', name: 'Futurism Alpha', thumbnail: 'https://picsum.photos/300/400?random=1', tags: ['CV', 'Creative'], isPremium: true, isFavorite: false },
  { id: '2', name: 'Minimalist Pro', thumbnail: 'https://picsum.photos/300/400?random=2', tags: ['CV', 'Clean'], isPremium: false, isFavorite: true },
  { id: '3', name: 'Lettre Neo', thumbnail: 'https://picsum.photos/300/400?random=3', tags: ['LM', 'Modern'], isPremium: true, isFavorite: false },
  { id: '4', name: 'Executive Suite', thumbnail: 'https://picsum.photos/300/400?random=4', tags: ['CV', 'Manager'], isPremium: false, isFavorite: false },
];

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.ONBOARDING);
  const [cvs, setCvs] = useState<UserCV[]>(MOCK_CVS_INITIAL);
  const [requests, setRequests] = useState<CVRequest[]>(MOCK_REQUESTS_INITIAL);
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [selectedTemplateForForm, setSelectedTemplateForForm] = useState<Template | null>(null);

  const handleStartForm = (templateId: string) => {
    const tmpl = templates.find(t => t.id === templateId) || null;
    setSelectedTemplateForForm(tmpl);
    setScreen(Screen.CV_FORM);
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

  const handleDeleteCV = (id: string) => {
    setCvs(cvs.filter(c => c.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t));
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
            templates={templates}
            onToggleFavorite={handleToggleFavorite}
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
          />
        );
      case Screen.COMMUNITY:
        return <Community />;
      case Screen.SETTINGS:
        return <Settings setScreen={setScreen} />;
      case Screen.CV_FORM:
        return (
          <CVForm 
            setScreen={setScreen} 
            selectedTemplate={selectedTemplateForForm} 
            onSubmitSuccess={handleNewRequest}
          />
        );
      default:
        return (
          <Dashboard 
            setScreen={setScreen} 
            onCreateCV={handleStartForm} 
            templates={templates}
            onToggleFavorite={handleToggleFavorite}
          />
        );
    }
  };

  const showNav = screen !== Screen.ONBOARDING && screen !== Screen.LOGIN && screen !== Screen.CV_FORM;

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

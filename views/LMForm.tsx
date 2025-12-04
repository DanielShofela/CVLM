import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import {
  ArrowRight, ArrowLeft, Check, User, Mail, MapPin,
  Briefcase, Send, AlertCircle, FileText, X
} from 'lucide-react';
import { Screen, Template, LMFormData, UserProfile } from '../types';
import { saveLMVersion, getAllLMVersions } from '../services/lmVersionService';

interface LMFormProps {
  setScreen: (screen: Screen) => void;
  selectedTemplate: Template | null;
  onSubmitSuccess: (templateName: string) => void;
  userProfile: UserProfile;
}

export const LMForm: React.FC<LMFormProps> = ({ setScreen, selectedTemplate, onSubmitSuccess, userProfile }) => {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [generateCover, setGenerateCover] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLoadVersions, setShowLoadVersions] = useState(true);
  const [savedVersions, setSavedVersions] = useState(getAllLMVersions());
  
  // Form State
  const [formData, setFormData] = useState<LMFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    positionTitle: '',
    companyName: '',
    hiringManager: '',
    industry: '',
    keySkills: '',
    achievements: '',
    coverLetter: ''
  });

  // Prefill from user profile once
  const [didPrefill, setDidPrefill] = useState(false);
  useEffect(() => {
    if (!didPrefill && userProfile) {
      setFormData(prev => ({
        ...prev,
        fullName: userProfile.name || prev.fullName,
        email: userProfile.email || prev.email,
        phone: userProfile.phone || prev.phone,
        address: [(userProfile as any).locationCity, (userProfile as any).locationCountry].filter(Boolean).join(', ') || prev.address,
        positionTitle: (userProfile as any).jobTitle || prev.positionTitle
      }));
      setDidPrefill(true);
    }
  }, [didPrefill, userProfile]);

  useEffect(() => {
    // Load saved versions on mount
    const versions = getAllLMVersions();
    setSavedVersions(versions);
    if (versions.length === 0) {
      setShowLoadVersions(false);
    }
  }, []);

  const loadVersionData = (versionData: LMFormData) => {
    setFormData(versionData);
    setShowLoadVersions(false);
  };

  const updateField = (field: keyof LMFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    // If user requested generation and coverLetter is empty, generate it
    if (generateCover && (!formData.coverLetter || formData.coverLetter.trim() === '')) {
      setIsGenerating(true);
      const generated = generateCoverLetter(formData);
      setFormData(prev => ({ ...prev, coverLetter: generated }));
      setIsGenerating(false);
    }

    try {
      // Valider les champs obligatoires
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.positionTitle.trim() || !formData.companyName.trim()) {
        setErrorMessage('Veuillez remplir tous les champs obligatoires');
        setStatus('error');
        return;
      }

      // Envoyer les données via FormSpree
      const response = await fetch('https://formspree.io/f/mzznvpvz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          positionTitle: formData.positionTitle,
          companyName: formData.companyName,
          hiringManager: formData.hiringManager,
          industry: formData.industry,
          keySkills: formData.keySkills,
          achievements: formData.achievements,
          coverLetter: formData.coverLetter,
          templateName: selectedTemplate?.name || 'Sans modèle',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Save LM version after successful submission
        saveLMVersion(
          formData.positionTitle || 'LM',
          `${formData.positionTitle} - ${new Date().toLocaleDateString()}`,
          formData,
          selectedTemplate?.id,
          selectedTemplate?.name
        );

        setStatus('success');
        setTimeout(() => {
          onSubmitSuccess(selectedTemplate?.name || 'Lettre de Motivation');
          setScreen(Screen.DASHBOARD);
        }, 2000);
      } else {
        setErrorMessage('Erreur lors de l\'envoi du formulaire');
        setStatus('error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Erreur de connexion. Veuillez réessayer.');
      setStatus('error');
    }
  };

  const generateCoverLetter = (data: LMFormData) => {
    // Simple template-based generation using provided fields
    const intro = `Bonjour ${data.hiringManager ? data.hiringManager + ' / ' : ''}${data.companyName || ''},\n\n`;
    const body = `Je me permets de vous adresser ma candidature pour le poste de ${data.positionTitle} au sein de ${data.companyName}. ` +
      `${data.keySkills ? 'Mes compétences principales incluent: ' + data.keySkills + '. ' : ''}` +
      `${data.achievements ? 'Parmi mes réalisations: ' + data.achievements + '. ' : ''}`;
    const closing = `\n\nJe reste à votre disposition pour un entretien et vous remercie par avance pour votre considération.\n\nCordialement,\n${data.fullName}`;
    return intro + body + closing;
  };

  const steps = [
    {
      title: 'Informations Personnelles',
      icon: User,
      fields: [
        { label: 'Nom Complet *', key: 'fullName', type: 'text', required: true },
        { label: 'Email *', key: 'email', type: 'email', required: true },
        { label: 'Téléphone', key: 'phone', type: 'tel' },
        { label: 'Adresse', key: 'address', type: 'text', placeholder: "Côte d'Ivoire, Abidjan" },
      ]
    },
    {
      title: 'Offre d\'Emploi',
      icon: Briefcase,
      fields: [
        { label: 'Titre du Poste *', key: 'positionTitle', type: 'text', required: true },
        { label: 'Nom de l\'Entreprise *', key: 'companyName', type: 'text', required: true },
        { label: 'Nom du Responsable RH', key: 'hiringManager', type: 'text' },
        { label: 'Secteur d\'Activité', key: 'industry', type: 'text' },
      ]
    },
    {
      title: 'Qualifications',
      icon: Check,
      fields: [
        { label: 'Compétences Clés', key: 'keySkills', type: 'textarea', placeholder: 'Énumérez vos compétences principales...' },
        { label: 'Réalisations Principales', key: 'achievements', type: 'textarea', placeholder: 'Décrivez vos accomplissements les plus pertinents...' },
      ]
    },
    {
      title: 'Lettre de Motivation',
      icon: FileText,
      fields: [
        { label: 'Lettre de Motivation', key: 'coverLetter', type: 'textarea', required: false, placeholder: 'Rédigez votre lettre de motivation personnalisée (optionnel)...' },
      ]
    }
  ];

  const currentStep = steps[step];
  const StepIcon = currentStep.icon;

  return (
    <div className="pb-28 pt-6 px-4 min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => setScreen(Screen.DASHBOARD)}
          className="text-electric-600 text-sm font-medium hover:text-electric-700 mb-4 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Lettre de Motivation</h1>
        <p className="text-slate-500">Modèle: {selectedTemplate?.name || 'Sans modèle'}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-slate-700">Étape {step + 1}/{steps.length}</span>
          <span className="text-sm text-slate-500">{Math.round((step / (steps.length - 1)) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-electric-500 to-purple-500 transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step Title */}
        <GlassCard className="bg-gradient-to-r from-electric-50 to-purple-50 border-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-electric-100 rounded-lg text-electric-600">
              <StepIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{currentStep.title}</h2>
              <p className="text-sm text-slate-600">
                {step === 0 && "Commençons par vos informations personnelles"}
                {step === 1 && "Parlez-moi du poste visé"}
                {step === 2 && "Mettez en avant vos qualifications"}
                {step === 3 && "Rédigez votre lettre personnalisée"}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Form Fields */}
        <div className="space-y-4">
          {currentStep.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.key as keyof LMFormData]}
                  onChange={(e) => updateField(field.key as keyof LMFormData, e.target.value)}
                  placeholder={field.placeholder || ''}
                  rows={4}
                  required={field.key === 'coverLetter' ? (!generateCover) : field.required}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-400 transition-all resize-none"
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={formData[field.key as keyof LMFormData]}
                  onChange={(e) => updateField(field.key as keyof LMFormData, e.target.value)}
                  required={field.required}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-electric-200 focus:border-electric-400 transition-all"
                />
              )}
            </div>
          ))}

          {step === 3 && (
            <GlassCard className="!p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800">Besoin d'aide pour rédiger ?</h3>
                  <p className="text-sm text-slate-500">Choisissez de rédiger votre lettre ou laissez-nous la générer automatiquement à partir des informations fournies.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGenerateCover(false)}
                  className={`px-4 py-2 rounded-xl border ${!generateCover ? 'bg-electric-50 border-electric-200' : 'bg-white border-slate-200'}`}>
                  Je rédige
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGenerateCover(true);
                    setIsGenerating(true);
                    const generated = generateCoverLetter(formData);
                    updateField('coverLetter', generated);
                    setIsGenerating(false);
                  }}
                  className={`px-4 py-2 rounded-xl border ${generateCover ? 'bg-electric-50 border-electric-200' : 'bg-white border-slate-200'}`}>
                  Générer pour moi
                </button>
              </div>
              {generateCover && (
                <div className="mt-4">
                  <p className="text-sm text-slate-600 mb-2">Lettre générée (vous pouvez la modifier si besoin)</p>
                </div>
              )}
            </GlassCard>
          )}
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <GlassCard className="bg-red-50/50 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-700">Erreur</p>
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Success Message */}
        {status === 'success' && (
          <GlassCard className="bg-green-50/50 border-green-200">
            <div className="flex items-center gap-3">
              <Check size={20} className="text-green-600" />
              <div>
                <p className="font-medium text-green-700">Succès!</p>
                <p className="text-sm text-green-600">Votre lettre de motivation a été envoyée avec succès.</p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0 || status === 'sending'}
          >
            <ArrowLeft size={18} /> Précédent
          </Button>
          
          {step < steps.length - 1 ? (
            <Button
              type="button"
              fullWidth
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              disabled={status === 'sending'}
            >
              Suivant <ArrowRight size={18} />
            </Button>
          ) : (
            <Button
              type="submit"
              fullWidth
              disabled={status === 'sending'}
            >
              <Send size={18} /> {status === 'sending' ? 'Envoi...' : 'Envoyer la Lettre'}
            </Button>
          )}
        </div>
      </form>

      {/* Load Version Modal */}
      {showLoadVersions && savedVersions.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoadVersions(false)} />
          <div className="bg-white rounded-2xl w-full max-w-sm relative z-10 shadow-2xl p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Vos versions LM</h2>
              <button onClick={() => setShowLoadVersions(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-4">
              Sélectionnez une version précédente ou créez une nouvelle lettre :
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
              {savedVersions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => loadVersionData(version.data)}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-electric-50 border border-slate-200 rounded-lg transition-colors"
                >
                  <div className="font-semibold text-slate-800">{version.name}</div>
                  <div className="text-xs text-slate-500">
                    {version.data.fullName} • {new Date(version.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button 
                fullWidth 
                onClick={() => setShowLoadVersions(false)}
              >
                Nouvelle lettre
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

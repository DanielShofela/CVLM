import React, { useState } from 'react';
import { Button } from '../components/Button';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Screen } from '../types';

interface OnboardingProps {
  setScreen: (screen: Screen) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ setScreen }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Sparkles,
      title: "Design Futuriste",
      desc: "Créez des CV qui sortent du lot avec nos modèles CVLM néo-glassmorphism exclusifs.",
      img: "https://picsum.photos/400/500?grayscale"
    },
    {
      icon: Zap,
      title: "Intelligence Artificielle",
      desc: "Laissez Gemini optimiser vos CV et Lettres de Motivation pour maximiser vos chances.",
      img: "https://picsum.photos/401/500?grayscale"
    },
    {
      icon: ShieldCheck,
      title: "Carrière Boostée",
      desc: "Rejoignez la communauté CVLM et accédez à des offres premium.",
      img: "https://picsum.photos/402/500?grayscale"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setScreen(Screen.DASHBOARD);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-electric-400/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-purple-400/20 rounded-full blur-[100px]" />

      <div className="w-full flex justify-end pt-4">
        <button onClick={() => setScreen(Screen.DASHBOARD)} className="text-slate-400 text-sm font-medium">Passer</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center mt-8">
        <div className="relative mb-12">
           <div className="absolute inset-0 bg-electric-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
           <div className="w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 relative z-10 rotate-3 transition-all duration-500">
              <img src={steps[step].img} alt="Illustration" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-electric-900/40 to-transparent" />
           </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-4">{steps[step].title}</h1>
        <p className="text-slate-500 leading-relaxed max-w-[300px]">{steps[step].desc}</p>
      </div>

      <div className="pb-8 w-full">
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-electric-600' : 'w-2 bg-slate-200'}`} 
            />
          ))}
        </div>
        
        <Button onClick={handleNext} fullWidth>
          {step === steps.length - 1 ? "Commencer" : "Suivant"} <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};
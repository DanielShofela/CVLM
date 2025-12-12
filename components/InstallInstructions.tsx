import React from 'react';

export const InstallInstructions: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
        <h3 className="font-bold mb-2">Installer l'application</h3>
        <p className="text-sm mb-4">Sur iPhone / iPad :</p>
        <ol className="list-decimal list-inside text-sm mb-4">
          <li>Ouvrez le menu du navigateur (icône de partage).</li>
          <li>Choisissez « Ajouter à l'écran d'accueil ».</li>
          <li>Validez en cliquant sur « Ajouter ».</li>
        </ol>
        <p className="text-sm mb-4">Sur Android (Chrome) : si un bouton « Installer » s'affiche, cliquez dessus pour installer comme application native.</p>
        <div className="text-right">
          <button className="px-4 py-2 rounded-md bg-electric-50 text-electric-600" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default InstallInstructions;

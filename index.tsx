import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

// Global Error Handler for "White Screen" debugging
const showError = (message: string) => {
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; color: #ef4444; font-family: sans-serif; text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="font-size: 24px; margin-bottom: 10px;">Une erreur est survenue</h1>
        <p style="color: #374151; max-width: 400px; margin: 0 auto; background: #f3f4f6; padding: 15px; rounded: 8px; border: 1px solid #e5e7eb;">
          ${message}
        </p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 8px; cursor: pointer;">
          Recharger l'application
        </button>
      </div>
    `;
  }
};

window.addEventListener('error', (event) => {
  showError(event.message || 'Erreur inconnue');
});

window.addEventListener('unhandledrejection', (event) => {
  showError(event.reason?.message || 'Erreur asynchrone (Promise)');
});

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error: any) {
  showError(error.message || "Erreur lors de l'initialisation");
}
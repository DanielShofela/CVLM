<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CVLM - CV & Lettres de Motivation avec IA

Une application web progressive (PWA) pour créer des CV et lettres de motivation avec l'aide de l'IA Gemini.

🚀 **Nouvelle fonctionnalité :** L'app est maintenant **installable sur mobile** (iOS & Android)

## ✨ Fonctionnalités

- ✅ Création de CV avec templates professionnels
- ✅ Génération de conseils avec l'IA (Google Gemini)
- ✅ 📱 Progressive Web App (PWA) - Installable sur mobile
- ✅ 📴 Mode offline - Fonctionne sans connexion
- ✅ 💾 Synchronisation avec Supabase
- ✅ 🎨 Design moderne avec glassmorphism
- ✅ 🔄 Mise à jour automatique de l'app

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

1. **Cloner/Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Configuration API (obligatoire) :**
   - Créer un fichier `.env.local` à la racine
   - Ajouter votre clé Gemini API :
     ```
     VITE_GEMINI_API_KEY=votre_clé_api_ici
     ```
   - [Obtenir une clé Gemini](https://aistudio.google.com/app/apikey)

3. **Développement local :**
   ```bash
   npm run dev
   ```
   L'app s'ouvre sur http://localhost:3000

4. **Build pour production :**
   ```bash
   npm run build
   npm run preview
   ```

---

## 📱 Installation Mobile (PWA)

L'app est maintenant une **Progressive Web App** complète !

### Étape 1 : Générer les icônes PWA

```bash
# Générer automatiquement les icônes
.\setup-pwa.ps1          # Windows PowerShell
# OU
setup-pwa.bat            # Windows Batch
# OU manuellement
npm run generate-icons
```

### Étape 2 : Déployer

**Recommandé - Vercel (gratuit, automatique) :**
```bash
npm install -g vercel
vercel
```

**Alternative - Netlify :**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Alternative - Local (test) :**
```bash
npm run dev
```

### Étape 3 : Installer sur mobile

**iPhone/iPad :**
1. Safari → Votre app
2. Partage → "Sur l'écran d'accueil"

**Android :**
1. Chrome → Votre app
2. Menu (⋮) → "Installer l'app"

---

## 📚 Documentation

- 📖 **[MOBILE_READY.md](./MOBILE_READY.md)** - Résumé complet PWA
- 📖 **[PWA_SETUP.md](./PWA_SETUP.md)** - Guide détaillé
- 📖 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guide déploiement (4 options)
- 📖 **[SETUP_SUMMARY.txt](./SETUP_SUMMARY.txt)** - Résumé avec checklist

---

## 🏗️ Architecture

```
cvlm/
├── src/
│   ├── App.tsx                  # Composant principal
│   ├── types.ts                 # Types TypeScript
│   ├── components/              # Composants réutilisables
│   ├── views/                   # Pages (Dashboard, CVForm, etc.)
│   └── services/                # Services (Gemini, Supabase)
├── public/
│   ├── manifest.json            # PWA Manifest ✨
│   ├── service-worker.js        # Service Worker ✨
│   └── icons/                   # Icônes PWA (à générer)
├── scripts/
│   ├── generate-icons.mjs       # Générateur d'icônes
│   └── generate-screenshots.mjs # Générateur de screenshots
└── vite.config.ts               # Config Vite
```

---

## 🔧 Technos utilisées

| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 19.2 | UI Framework |
| TypeScript | 5.8 | Type Safety |
| Vite | 6.2 | Bundler |
| Tailwind CSS | Latest | Styling |
| Lucide React | 0.555 | Icônes |
| Google Gemini | 1.30 | IA/LLM |
| Supabase | 2.39 | Backend DB |

---

## 📊 Vérification PWA

### Chrome DevTools
```
F12 → Application Tab
  ✓ Manifest (tous icônes présents)
  ✓ Service Workers (registered & running)
  ✓ Cache Storage (données cachées)
```

### Lighthouse Audit
```
F12 → Lighthouse → PWA Audit
Objectif : Score > 90 ✓
```

### Mode Offline
```
F12 → Service Workers → ☑ Offline
L'app reste fonctionnelle avec localStorage
```

---

## 🐛 Dépannage

**"Module not found: sharp"**
```bash
npm install --save-dev sharp
npm run generate-icons
```

**"PWA pas installable"**
- ✓ Vérifier HTTPS (obligatoire)
- ✓ Vérifier manifest.json valide
- ✓ Attendre 30 sec après déploiement
- ✓ Effacer le cache

**"Service Worker ne s'enregistre pas"**
- Vérifier console (F12)
- Vérifier service-worker.js existe
- Unregister all → Rafraîchir

**"Icônes ne s'affichent pas"**
- npm run generate-icons
- Vérifier public/icons/ a 12 fichiers PNG

---

## 📈 Performance

| Métrique | Valeur |
|----------|--------|
| App Shell | ~50-100 KB |
| Offline Load | < 1s |
| Auto-Update Check | 60s |
| Cache Strategy | Network first for API |

---

## 🔐 Sécurité

- ✅ HTTPS requis en production
- ✅ Clés API managées via env vars
- ✅ Service Worker authentifié
- ✅ Isolation offline/online
- ⚠️ **NEVER** commit `.env.local` (ajouté au .gitignore)

---

## 🤝 Contribution

Les contributions sont bienvenues ! Pour modifier :

1. Fork le repo
2. Créer une branche (git checkout -b feature/amazing)
3. Commit (git commit -m 'Add amazing feature')
4. Push (git push origin feature/amazing)
5. Créer une Pull Request

---

## 📄 Licence

Propriétaire - 2024

---

## 🎯 Roadmap

- [ ] Templates additionnels (5+ nouveaux)
- [ ] Partage de CV public
- [ ] Mode collaboratif (équipes)
- [ ] Export PDF avancé
- [ ] Intégration LinkedIn
- [ ] Analytiques & dashboards

---

## 📞 Support

Pour les questions ou problèmes :

1. Consulter la [documentation PWA](./PWA_SETUP.md)
2. Vérifier les [logs du navigateur](./PWA_SETUP.md#debugging)
3. Ouvrir une issue GitHub

---

## 🎉 Merci d'utiliser CVLM !

**Prêt à déployer ?** Consultez [DEPLOYMENT.md](./DEPLOYMENT.md)

**Besoin d'aide mobile ?** Consultez [MOBILE_READY.md](./MOBILE_READY.md)

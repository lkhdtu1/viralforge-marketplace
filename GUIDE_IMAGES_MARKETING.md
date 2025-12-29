# Guide d'Intégration des Images pour le Chapitre Marketing

Ce document liste toutes les images suggérées dans le chapitre amélioré avec leurs sources et instructions d'obtention.

## Images Requises

### 1. Figure \ref{fig:dashboard-marketing} : Tableau de bord avec analytics
**Fichier suggéré** : `Chapters/img/dashboard.png`  
**Source** : Capture d'écran de `/dashboard` ou `/creator-dashboard`  
**Instructions** :
- Se connecter à l'application
- Accéder au dashboard (créateur ou marque)
- Capturer la vue complète du tableau de bord avec les métriques
- S'assurer que les graphiques et statistiques sont visibles
- URL : `http://localhost:5173/dashboard` ou `/creator-dashboard`

**Alternative** : Utiliser une capture de `/analytics` qui montre mieux les KPIs

---

### 2. Figure \ref{fig:marketing-funnel} : Modèle de funnel marketing
**Fichier suggéré** : `Chapters/img/marketing-objectifs-funnel.png`  
**Type** : Schéma à créer  
**Outils recommandés** :
- Canva (template "Funnel Marketing")
- Figma
- PowerPoint/Keynote
- Draw.io

**Éléments à inclure** :
- 4 étapes : Acquisition → Activation → Rétention → Revenus
- Pourcentages de conversion entre chaque étape
- Couleurs dégradées (du haut vers le bas)
- Flèches montrant le flux

**Création** : Cette image doit être créée manuellement car elle représente un concept marketing

---

### 3. Figure \ref{fig:analytics-kpis} : Tableau de bord analytique
**Fichier suggéré** : `Chapters/img/analytics.png`  
**Source** : Capture d'écran de `/analytics`  
**Instructions** :
- Se connecter à l'application
- Accéder à `/analytics`
- Capturer la page complète montrant :
  - Les métriques clés (Total Views, Engagement, Revenue)
  - Les graphiques (Line Chart, Bar Chart)
  - Les indicateurs de performance
- URL : `http://localhost:5173/analytics`

---

### 4. Figure \ref{fig:ai-coach-automation} : Coach IA
**Fichier suggéré** : `Chapters/img/ai-coach.png`  
**Source** : Capture d'écran du composant AIGrowthCoach  
**Instructions** :
- Le composant apparaît dans le dashboard
- Capturer l'interface du coach IA montrant :
  - Les recommandations personnalisées
  - Les statistiques d'engagement
  - Les suggestions d'action
- Si le composant n'est pas visible par défaut, chercher dans le code source ou ajouter temporairement au dashboard

**Note** : Vérifier que le composant `AIGrowthCoach` est bien intégré dans l'interface

---

### 5. Figure \ref{fig:home-conversion} : Page d'accueil
**Fichier suggéré** : `Chapters/img/home.png`  
**Source** : Capture d'écran de `/` (landing page)  
**Instructions** :
- Accéder à la page d'accueil (sans être connecté de préférence)
- Capturer la vue complète de la landing page
- S'assurer que les éléments clés sont visibles :
  - Hero section
  - Fonctionnalités principales
  - Témoignages
  - Call-to-action
- URL : `http://localhost:5173/`

---

### 6. Figure \ref{fig:discover-segmentation} : Interface de découverte
**Fichier suggéré** : `Chapters/img/discover.png`  
**Source** : Capture d'écran de `/discover`  
**Instructions** :
- Accéder à `/discover`
- Capturer l'interface montrant :
  - Les filtres de recherche
  - Les résultats de recherche (créateurs ou services)
  - Les options de tri et filtrage
- Mettre en évidence les fonctionnalités de segmentation
- URL : `http://localhost:5173/discover`

---

### 7. Figure \ref{fig:campaign-automation} : Création de campagne
**Fichier suggéré** : `Chapters/img/create-compaign.png`  
**Source** : Capture d'écran de `/campaigns/new`  
**Instructions** :
- Se connecter en tant que Brand
- Accéder à `/campaigns/new`
- Capturer le formulaire de création de campagne
- S'assurer que les étapes du processus sont visibles
- URL : `http://localhost:5173/campaigns/new`

---

### 8. Figure \ref{fig:settings-security} : Paramètres et sécurité
**Fichier suggéré** : `Chapters/img/settings-creator.png`  
**Source** : Capture d'écran de `/settings`  
**Instructions** :
- Se connecter
- Accéder à `/settings`
- Capturer les onglets de paramètres montrant :
  - Profil
  - Sécurité (2FA, changement de mot de passe)
  - Notifications
- URL : `http://localhost:5173/settings`

---

### 9. Figure \ref{fig:positionnement-marketing} : Carte de positionnement
**Fichier suggéré** : `Chapters/img/marketing-positioning-map.png`  
**Type** : Schéma à créer  
**Outils recommandés** :
- Canva (template "Positioning Map")
- Figma
- PowerPoint/Keynote
- Draw.io

**Éléments à inclure** :
- Axe X : Spécialisation/Nichage (Généraliste ← → Spécialisé)
- Axe Y : Technologie/Innovation (Basique ← → Avancé)
- Positionner ViralForge dans le quadrant supérieur droit (Spécialisé + Avancé)
- Positionner les concurrents :
  - Fiverr : Généraliste, Basique
  - Upwork : Généraliste, Moyen
  - Plateformes sociales : Spécialisé, Basique

**Création** : Cette image doit être créée manuellement

---

## Checklist de Capture

### Images à Capturer depuis l'Application

- [ ] `/dashboard` ou `/creator-dashboard` → `dashboard.png`
- [ ] `/analytics` → `analytics.png`
- [ ] `/` (landing page) → `home.png`
- [ ] `/discover` → `discover.png`
- [ ] `/campaigns/new` → `create-compaign.png`
- [ ] `/settings` → `settings-creator.png`
- [ ] Coach IA (dans dashboard) → `ai-coach.png`

### Images à Créer

- [ ] Funnel marketing (Acquisition → Activation → Rétention → Revenus) → `marketing-objectifs-funnel.png`
- [ ] Carte de positionnement (2x2 avec axes) → `marketing-positioning-map.png`

---

## Conseils pour les Captures

1. **Résolution** : Minimum 1920x1080, idéalement 2560x1440
2. **Format** : PNG pour qualité, vérifier que les textes sont lisibles
3. **Données de test** : Utiliser des données réalistes mais anonymes
4. **Mise en évidence** : Si nécessaire, ajouter des annotations avec des flèches ou encadrés
5. **Cohérence** : Utiliser le même thème (clair/sombre) pour toutes les captures
6. **Masquage** : Masquer les informations sensibles (emails, noms réels) si nécessaire

---

## Ordre de Priorité

### Priorité Haute (Essentielles)
1. `dashboard.png` - Tableau de bord
2. `home.png` - Page d'accueil
3. `analytics.png` - Analytics
4. `discover.png` - Découverte

### Priorité Moyenne (Importantes)
5. `create-compaign.png` - Création campagne
6. `settings-creator.png` - Paramètres
7. `marketing-objectifs-funnel.png` - Funnel (à créer)

### Priorité Basse (Optionnelles mais recommandées)
8. `ai-coach.png` - Coach IA
9. `marketing-positioning-map.png` - Carte positionnement (à créer)

---

## Outils pour Créer les Schémas

### Canva
- Templates : "Marketing Funnel", "Positioning Map"
- URL : https://www.canva.com
- Gratuit avec compte

### Figma
- Création manuelle de diagrammes
- URL : https://www.figma.com
- Gratuit avec compte

### Draw.io (diagrams.net)
- Spécialisé dans les diagrammes
- URL : https://app.diagrams.net
- Gratuit, pas de compte requis

### PowerPoint/Keynote
- Création manuelle avec formes
- Professionnel et simple

---

## Structure de Dossier Recommandée

```
Chapters/
  img/
    dashboard.png
    analytics.png
    home.png
    discover.png
    create-compaign.png
    settings-creator.png
    ai-coach.png
    marketing-objectifs-funnel.png
    marketing-positioning-map.png
```

---

## Notes Finales

- Toutes les captures doivent être faites avec l'application en cours d'exécution
- Pour les schémas à créer, privilégier un style cohérent avec le reste du document
- Vérifier les droits d'utilisation si vous utilisez des templates externes
- Sauvegarder les fichiers sources (.fig, .pptx) pour modifications ultérieures



# Guide d'Intégration des Images pour le Chapitre KPIs

Ce document liste toutes les images nécessaires pour le chapitre amélioré avec leurs sources et instructions détaillées.

## Images Requises par Section

### Section Introduction

#### 1. Figure \ref{fig:analytics-dashboard-overview} : Tableau de bord analytique
**Fichier suggéré** : `Chapters/img/analytics-dashboard-overview.png`  
**Source** : Capture d'écran de `/analytics`  
**Instructions** :
- Se connecter à l'application
- Accéder à `http://localhost:5173/analytics`
- Capturer la vue complète du tableau de bord montrant :
  - Les métriques clés (Total Views, Engagement, Revenue, Active Campaigns)
  - Les métriques d'engagement utilisateur (Login Count, Daily Usage, Total Clicks, Streak)
  - Les graphiques (Views & Engagement, Performance Metrics)
  - Le sélecteur de période (Last 7 days, 30 days, etc.)
- S'assurer que les onglets (Overview, Engagement, Revenue) sont visibles
- Capturer la vue "Overview" par défaut

---

### Section Indicateurs Marketing

#### 2. Figure \ref{fig:taux_conversion} : Taux de conversion
**Fichier suggéré** : `Chapters/img/taux_conversion.png`  
**Type** : Graphique à créer  
**Instructions** :

**Option A - Créer un graphique** :
- Utiliser Excel, Google Sheets, ou un outil de visualisation
- Créer un graphique en barres ou linéaire montrant :
  - Axe X : Mois (Octobre, Novembre, Décembre 2024)
  - Axe Y : Taux de conversion (%)
  - Données : 4,2% (Oct), 5,8% (Nov), 6,0% (Déc)
  - Ligne de référence : Benchmark secteur (4%)
- Style : Professionnel, couleurs cohérentes avec la marque

**Option B - Utiliser un outil en ligne** :
- Canva : Template "Line Chart" ou "Bar Chart"
- Chart.js ou Recharts : Générer un graphique
- Exporter en PNG haute résolution (1920x1080 minimum)

---

#### 3. Figure \ref{fig:cac} : Coût d'acquisition client
**Fichier suggéré** : `Chapters/img/cac.png`  
**Type** : Graphique à créer  
**Instructions** :
- Créer un graphique combiné montrant :
  - Ligne : Évolution du CAC mensuel (5,00€ constant)
  - Barres : CAC par canal (Google Ads: 6,67€, Facebook: 4,17€, SEO: 4,00€, etc.)
- Inclure une légende et des labels clairs
- Style professionnel, couleurs distinctes pour chaque canal

---

#### 4. Figure \ref{fig:trafficsources} : Provenance du trafic
**Fichier suggéré** : `Chapters/img/trafficsources.png`  
**Type** : Graphique en camembert ou barres empilées  
**Instructions** :
- Créer un graphique montrant la répartition du trafic :
  - Réseaux sociaux : 60% (Instagram 30%, Facebook 20%, LinkedIn 10%)
  - SEO : 25%
  - Direct : 10%
  - Publicités : 5%
- Utiliser un graphique en camembert (pie chart) ou barres empilées
- Couleurs distinctes pour chaque source
- Labels avec pourcentages

---

### Section Indicateurs Commerciaux

#### 5. Figure \ref{fig:chiffre_affaires} : Chiffre d'affaires
**Fichier suggéré** : `Chapters/img/chiffre_affaires.png`  
**Type** : Graphique à créer  
**Instructions** :
- Créer un graphique en barres montrant :
  - Évolution trimestrielle : Q3 2024 (1 800€), Q4 2024 (2 700€)
  - Répartition par source : Commissions (2 025€), Abonnements (675€)
- Utiliser des couleurs différentes pour chaque source
- Inclure des annotations de croissance (+50%)

---

#### 6. Figure \ref{fig:panier_moyen} : Panier moyen
**Fichier suggéré** : `Chapters/img/panier_moyen.png`  
**Type** : Graphique à créer  
**Instructions** :
- Créer un graphique combiné :
  - Ligne : Évolution mensuelle (Oct: 135€, Nov: 145€, Déc: 150€)
  - Barres : Panier moyen par type de service (Vidéo: 200€, Graphisme: 120€, etc.)
- Inclure une ligne de référence (benchmark secteur : 100€)

---

#### 7. Figure \ref{fig:taux_retention} : Taux de rétention
**Fichier suggéré** : `Chapters/img/taux_retention.png`  
**Type** : Courbe de rétention à créer  
**Instructions** :
- Créer une courbe de rétention (cohort analysis) montrant :
  - Jours : 0, 7, 30, 60, 90
  - Taux de rétention : 100%, 85%, 75%, 70%, 66,7%
  - Ligne de référence : Benchmark secteur (40-50% à 90 jours)
- Style : Courbe décroissante avec points de données marqués
- Zone ombrée pour montrer la zone "excellent" vs "acceptable"

---

### Section Indicateurs d'Engagement

#### 8. Figure \ref{fig:taux_engagement} : Taux d'engagement
**Fichier suggéré** : `Chapters/img/taux_engagement.png`  
**Source** : Capture d'écran de `/analytics` (onglet Engagement)  
**Instructions** :
- Accéder à `/analytics`
- Cliquer sur l'onglet "Engagement"
- Capturer le graphique "Engagement Trends" (BarChart)
- S'assurer que les données et la légende sont visibles

**Alternative** : Si le graphique n'est pas disponible, créer un graphique en barres montrant les interactions par session (4,2) et l'évolution temporelle

---

#### 9. Figure \ref{fig:taux_satisfaction} : Taux de satisfaction
**Fichier suggéré** : `Chapters/img/taux_satisfaction.png`  
**Type** : Graphique à créer  
**Instructions** :
- Créer un graphique en barres horizontales ou camembert montrant :
  - Très satisfait : 45%
  - Satisfait : 40%
  - Neutre : 10%
  - Insatisfait : 5%
- Utiliser des couleurs : Vert (satisfait), Jaune (neutre), Rouge (insatisfait)
- Inclure la note moyenne (4,3/5) en évidence

---

#### 10. Figure \ref{fig:nps} : Net Promoter Score
**Fichier suggéré** : `Chapters/img/nps.png`  
**Type** : Graphique NPS standard à créer  
**Instructions** :
- Créer un graphique NPS classique montrant :
  - Barres pour chaque score (0-10)
  - Zone des Promoteurs (9-10) en vert
  - Zone des Passifs (7-8) en jaune
  - Zone des Détracteurs (0-6) en rouge
  - Score NPS : +40 affiché en évidence
- Style : Graphique en barres avec codes couleur standard NPS

---

### Section Indicateurs Opérationnels

#### 11. Figure \ref{fig:disponibilite} : Disponibilité
**Fichier suggéré** : `Chapters/img/disponibilite.png`  
**Type** : Graphique à créer  
**Instructions** :
- Créer un graphique en barres ou ligne montrant :
  - Disponibilité mensuelle : 99,5% (constant)
  - Marquer les périodes d'incidents (3 incidents sur le trimestre)
  - Ligne de référence : Objectif 99,7%
- Inclure des annotations pour les incidents (dates et durées)

---

#### 12. Figure \ref{fig:temps_reponse} : Temps de réponse
**Fichier suggéré** : `Chapters/img/temps_reponse.png`  
**Type** : Graphique à créer  
**Instructions** :
- Créer un graphique en barres montrant :
  - Temps de réponse moyen : 1,2s
  - Répartition par type de page (Accueil: 0,9s, Découverte: 1,1s, etc.)
  - Ligne de référence : Objectif 1,5s
- Utiliser des couleurs : Vert (< 1,5s), Orange (1,5-2,0s), Rouge (> 2,0s)

---

#### 13. Figure \ref{fig:incidents} : Incidents techniques
**Fichier suggéré** : `Chapters/img/incidents.png`  
**Type** : Graphique à créer  
**Instructions** :
- Créer un graphique en barres ou timeline montrant :
  - 3 incidents sur le trimestre
  - Classification : 2 mineurs, 1 majeur
  - Temps de résolution pour chaque incident
- Utiliser des couleurs selon la sévérité (Rouge: majeur, Orange: mineur)

---

### Section Marketing 5.0

#### 14. Figure \ref{fig:personalisation} : Personnalisation
**Fichier suggéré** : `Chapters/img/personalisation.png`  
**Type** : Graphique à créer  
**Instructions** :
- Créer un graphique en barres montrant :
  - Taux d'utilisation global : 70%
  - Répartition par type : Services similaires (75%), Complémentaires (65%), Coach IA (60%), Campagnes (80%)
- Inclure une ligne de référence (benchmark : 60%)

---

#### 15. Figure \ref{fig:exploitation_data} : Exploitation des données
**Fichier suggéré** : `Chapters/img/exploitation_data.png`  
**Type** : Graphique à créer OU capture d'écran  
**Instructions** :

**Option A - Graphique** :
- Créer un graphique en barres montrant l'impact des optimisations :
  - Réajustement offre : +15% conversions
  - Optimisation checkout : -30% abandons
  - Personnalisation : +25% utilisation
  - Ajustement prix : +10% revenus
  - Amélioration onboarding : +12% rétention

**Option B - Capture d'écran** :
- Capturer une vue du dashboard analytics montrant les métriques d'optimisation
- Accéder à `/analytics` et capturer les graphiques de performance

---

## Outils Recommandés pour Créer les Graphiques

### Outils en Ligne (Gratuits)

1. **Canva** (https://www.canva.com)
   - Templates : "Line Chart", "Bar Chart", "Pie Chart"
   - Facile à utiliser, export PNG haute qualité
   - Gratuit avec compte

2. **Google Sheets** (https://sheets.google.com)
   - Créer des graphiques directement dans Sheets
   - Exporter en image (PNG)
   - Gratuit, pas de compte requis pour usage basique

3. **Chart.js / Recharts** (si vous codez)
   - Bibliothèques JavaScript pour graphiques
   - Très personnalisables
   - Nécessite des compétences en développement

### Outils Desktop

1. **Microsoft Excel**
   - Créer des graphiques professionnels
   - Exporter en PNG
   - Très flexible

2. **LibreOffice Calc** (Gratuit)
   - Alternative gratuite à Excel
   - Fonctionnalités similaires

### Outils Spécialisés

1. **Tableau Public** (Gratuit)
   - Outil professionnel de visualisation
   - Courbe d'apprentissage plus élevée
   - Résultats très professionnels

2. **Datawrapper** (https://www.datawrapper.de)
   - Outil en ligne spécialisé pour graphiques
   - Gratuit pour usage basique
   - Très simple d'utilisation

---

## Checklist Complète

### Images à Capturer depuis l'Application

- [ ] `/analytics` (Overview) → `analytics-dashboard-overview.png`
- [ ] `/analytics` (Engagement tab) → `taux_engagement.png` (si disponible)

### Images à Créer (Graphiques)

- [ ] Taux de conversion → `taux_conversion.png`
- [ ] CAC → `cac.png`
- [ ] Provenance trafic → `trafficsources.png`
- [ ] Chiffre d'affaires → `chiffre_affaires.png`
- [ ] Panier moyen → `panier_moyen.png`
- [ ] Taux de rétention → `taux_retention.png`
- [ ] Taux de satisfaction → `taux_satisfaction.png`
- [ ] NPS → `nps.png`
- [ ] Disponibilité → `disponibilite.png`
- [ ] Temps de réponse → `temps_reponse.png`
- [ ] Incidents → `incidents.png`
- [ ] Personnalisation → `personalisation.png`
- [ ] Exploitation données → `exploitation_data.png`

---

## Instructions Détaillées par Type de Graphique

### Graphiques en Ligne (Line Charts)

**Utilisation** : Évolution temporelle (taux de conversion, CAC, panier moyen)

**Éléments à inclure** :
- Axe X : Période (mois, trimestres)
- Axe Y : Valeur (%, €, etc.)
- Ligne de données principale
- Ligne de référence (benchmark) si applicable
- Titre clair
- Légende
- Grille pour faciliter la lecture

**Couleurs recommandées** :
- Ligne principale : Bleu (#3B82F6) ou Violet (#8B5CF6)
- Ligne de référence : Gris (#94A3B8) en pointillés

---

### Graphiques en Barres (Bar Charts)

**Utilisation** : Comparaisons (CAC par canal, panier par service, etc.)

**Éléments à inclure** :
- Axe X : Catégories
- Axe Y : Valeurs
- Barres avec valeurs affichées
- Couleurs distinctes par catégorie
- Titre et légende

**Couleurs recommandées** :
- Utiliser une palette cohérente (5-7 couleurs max)
- Éviter le rouge pour les valeurs positives (utiliser vert/bleu)

---

### Graphiques en Camembert (Pie Charts)

**Utilisation** : Répartition (provenance trafic, satisfaction)

**Éléments à inclure** :
- Pourcentages sur chaque segment
- Légende claire
- Couleurs distinctes
- Titre

**Conseil** : Limiter à 5-6 segments maximum pour la lisibilité

---

### Courbes de Rétention

**Utilisation** : Taux de rétention

**Éléments à inclure** :
- Axe X : Jours (0, 7, 30, 60, 90)
- Axe Y : Taux de rétention (%)
- Courbe décroissante
- Zone ombrée pour benchmarks
- Points de données marqués

---

## Format et Résolution

### Paramètres Recommandés

- **Format** : PNG (meilleure qualité pour graphiques)
- **Résolution** : Minimum 1920x1080, idéalement 2560x1440
- **DPI** : 300 DPI pour impression de qualité
- **Couleurs** : RVB pour écran, CMJN si impression prévue

### Style Uniforme

- **Police** : Sans-serif moderne (Arial, Helvetica, Inter)
- **Taille de police** : Minimum 12pt pour les labels, 14-16pt pour les titres
- **Couleurs** : Palette cohérente avec la marque ViralForge
  - Primaire : Bleu (#3B82F6)
  - Secondaire : Violet (#8B5CF6)
  - Accent : Vert (#10B981)
  - Neutre : Gris (#6B7280)

---

## Structure de Dossier Recommandée

```
Chapters/
  img/
    analytics-dashboard-overview.png
    taux_conversion.png
    cac.png
    trafficsources.png
    chiffre_affaires.png
    panier_moyen.png
    taux_retention.png
    taux_engagement.png
    taux_satisfaction.png
    nps.png
    disponibilite.png
    temps_reponse.png
    incidents.png
    personalisation.png
    exploitation_data.png
```

---

## Ordre de Priorité

### Priorité Haute (Essentielles)

1. `analytics-dashboard-overview.png` - Dashboard principal
2. `taux_conversion.png` - KPI marketing clé
3. `cac.png` - Rentabilité acquisition
4. `chiffre_affaires.png` - Performance commerciale
5. `taux_retention.png` - Satisfaction utilisateur

### Priorité Moyenne (Importantes)

6. `trafficsources.png` - Stratégie marketing
7. `panier_moyen.png` - Optimisation revenus
8. `taux_satisfaction.png` - Qualité service
9. `nps.png` - Fidélité et recommandation

### Priorité Basse (Complémentaires)

10. `taux_engagement.png` - Engagement utilisateur
11. `disponibilite.png` - Performance technique
12. `temps_reponse.png` - Performance technique
13. `incidents.png` - Stabilité
14. `personalisation.png` - Marketing 5.0
15. `exploitation_data.png` - Marketing 5.0

---

## Conseils pour la Création

### Données à Utiliser

Toutes les données sont fournies dans le chapitre. Utilisez exactement ces valeurs pour maintenir la cohérence.

### Qualité Visuelle

- **Clarté** : Les graphiques doivent être lisibles même en petite taille
- **Simplicité** : Éviter la surcharge d'informations
- **Cohérence** : Utiliser le même style pour tous les graphiques
- **Accessibilité** : Contraste suffisant, labels clairs

### Vérification

Avant intégration dans LaTeX :
- [ ] Vérifier que toutes les valeurs correspondent au texte
- [ ] S'assurer que les labels sont lisibles
- [ ] Vérifier la cohérence des couleurs
- [ ] Tester la taille dans le document final

---

## Notes Finales

- Tous les graphiques doivent être créés avec des données cohérentes avec le texte du chapitre
- Utiliser des outils professionnels pour garantir la qualité
- Sauvegarder les fichiers sources (.xlsx, .fig) pour modifications ultérieures
- Vérifier la lisibilité avant intégration dans LaTeX
- Tester l'intégration pour vérifier la taille et le positionnement



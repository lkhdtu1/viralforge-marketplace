# Guide d'Intégration des Images pour le Chapitre Plan de Marchéage

Ce document liste toutes les images nécessaires pour le chapitre amélioré avec leurs sources et instructions détaillées.

## Images Requises par Section

### Section Politique de Produit

#### 1. Figure \ref{fig:services-catalogue} : Catalogue de services
**Fichier suggéré** : `Chapters/img/discover.png`  
**Source** : Capture d'écran de `/discover`  
**Instructions** :
- Accéder à `http://localhost:5173/discover`
- Sélectionner l'onglet "Services" (si disponible) ou "Listings"
- Capturer la vue complète montrant :
  - Les différentes catégories de services
  - Les cartes de services avec images, prix, descriptions
  - Les filtres disponibles
- S'assurer que plusieurs services sont visibles pour montrer la diversité de l'offre

---

#### 2. Figure \ref{fig:pricing-plans} : Page de tarification
**Fichier suggéré** : `Chapters/img/pricing-plans.png`  
**Source** : Capture d'écran de `/pricing`  
**Instructions** :
- Accéder à `http://localhost:5173/pricing`
- Capturer la vue complète montrant les 3 plans :
  - Starter (Gratuit)
  - Pro ($49/mois)
  - Enterprise ($199/mois)
- S'assurer que les fonctionnalités de chaque plan sont visibles
- Mettre en évidence le badge "Most Popular" sur le plan Pro

**Alternative** : Si la page pricing est différente, capturer la section pricing de la landing page (`/`)

---

### Section Politique de Prix

#### 3. Figure \ref{fig:service-pricing} : Détail d'un service avec prix
**Fichier suggéré** : `Chapters/img/service-details-price.png`  
**Source** : Capture d'écran d'un service individuel  
**Instructions** :
- Accéder à `/discover` ou `/marketplace`
- Cliquer sur un service pour voir les détails
- Capturer la page de détail montrant :
  - Le prix clairement affiché
  - Les options disponibles
  - La description détaillée
  - Les informations du prestataire
  - Le bouton de commande
- URL typique : `http://localhost:5173/discover` puis clic sur un service

---

### Section Politique de Distribution

#### 4. Figure \ref{fig:distribution-architecture} : Architecture Docker
**Fichier suggéré** : `Chapters/img/architecture-docker.png`  
**Source** : Schéma à créer OU capture de la documentation  
**Instructions** :

**Option A - Créer un schéma** :
- Utiliser Draw.io, Figma ou Canva
- Représenter l'architecture containerisée :
  - Frontend Container
  - Backend Container  
  - Database Container
  - Proxy Container
  - Docker Compose orchestrant tout
- Montrer les connexions entre conteneurs
- Style : Diagramme technique professionnel

**Option B - Documentation existante** :
- Vérifier s'il existe déjà une documentation d'architecture
- Capturer ou adapter un schéma existant

---

#### 5. Figure \ref{fig:distribution-homepage} : Page d'accueil
**Fichier suggéré** : `Chapters/img/home.png`  
**Source** : Capture d'écran de `/` (landing page)  
**Instructions** :
- Accéder à `http://localhost:5173/`
- Capturer la vue complète de la page d'accueil
- S'assurer que les éléments clés sont visibles :
  - Hero section avec call-to-action
  - Présentation des fonctionnalités
  - Témoignages
  - Section pricing (si présente)
- Scroll et capturer plusieurs sections si nécessaire (utilisation d'outil de capture "full page")

**Outils recommandés** :
- Extension Chrome "Full Page Screen Capture"
- Outil Windows : Snipping Tool (Win + Shift + S)
- Outil Mac : Screenshot (Cmd + Shift + 4)

---

### Section Politique de Communication

#### 6-14. Figures des réseaux sociaux
**Note** : Ces images existent déjà dans votre document. Voici les références à maintenir :

- **Figure \ref{fig:linkedin-page}** : `Chapters/img/Screenshot 2025-12-26 223354.png` (LinkedIn page)
- **Figure \ref{fig:linkedin-about}** : `Chapters/img/Screenshot 2025-12-26 223423.png` (LinkedIn About)
- **Figure \ref{fig:linkedin-posts}** : `Chapters/img/Screenshot 2025-12-26 223508.png` (LinkedIn posts)
- **Figure \ref{fig:instagram-page}** : `Chapters/img/Screenshot 2025-12-26 223615.png` (Instagram page)
- **Figure \ref{fig:youtube-channel}** : `Chapters/img/Screenshot 2025-12-26 224853.png` (YouTube channel)
- **Figure \ref{fig:facebook-page}** : `Chapters/img/Screenshot 2025-12-26 225104.png` (Facebook page)
- **Figure \ref{fig:facebook-posts}** : `Chapters/img/Screenshot 2025-12-26 225238.png` (Facebook posts)
- **Figure \ref{fig:pinterest-page}** : `Chapters/img/Screenshot 2025-12-26 232313.png` (Pinterest page)
- **Figure \ref{fig:google-business}** : `Chapters/img/Screenshot 2025-12-26 234950.png` (Google Business)

**Recommandations pour ces captures** :
- S'assurer que les captures sont à jour
- Masquer les informations sensibles si nécessaire
- Uniformiser le format (même résolution, même style)
- Vérifier la lisibilité des textes

---

## Checklist Complète

### Images à Capturer depuis l'Application

- [ ] `/discover` → `discover.png` (catalogue de services)
- [ ] `/pricing` → `pricing-plans.png` (plans d'abonnement)
- [ ] Détail d'un service → `service-details-price.png` (tarification)
- [ ] `/` (landing page) → `home.png` (page d'accueil)

### Images à Créer

- [ ] Architecture Docker → `architecture-docker.png` (schéma à créer)

### Images Existantes (à Vérifier/Mettre à Jour)

- [ ] LinkedIn page → `Screenshot 2025-12-26 223354.png`
- [ ] LinkedIn About → `Screenshot 2025-12-26 223423.png`
- [ ] LinkedIn Posts → `Screenshot 2025-12-26 223508.png`
- [ ] Instagram page → `Screenshot 2025-12-26 223615.png`
- [ ] YouTube channel → `Screenshot 2025-12-26 224853.png`
- [ ] Facebook page → `Screenshot 2025-12-26 225104.png`
- [ ] Facebook posts → `Screenshot 2025-12-26 225238.png`
- [ ] Pinterest page → `Screenshot 2025-12-26 232313.png`
- [ ] Google Business → `Screenshot 2025-12-26 234950.png`

---

## Instructions Détaillées par Image

### 1. Catalogue de Services (`discover.png`)

**URL** : `http://localhost:5173/discover`

**Étapes** :
1. Démarrer l'application (`./start-dev.sh`)
2. Ouvrir le navigateur sur l'URL
3. Naviguer vers `/discover`
4. Si plusieurs onglets (Créateurs/Services), sélectionner "Services"
5. Scroller pour voir plusieurs services
6. Capturer la vue complète

**Éléments à inclure** :
- Liste de services avec cartes
- Filtres de recherche (catégories, prix, etc.)
- Options de tri

---

### 2. Plans de Tarification (`pricing-plans.png`)

**URL** : `http://localhost:5173/pricing`

**Étapes** :
1. Accéder à `/pricing`
2. Capturer la vue montrant les 3 plans côte à côte
3. S'assurer que les prix et fonctionnalités sont lisibles

**Si la page pricing n'existe pas séparément** :
- Accéder à `/` (landing page)
- Scroller jusqu'à la section "Pricing"
- Capturer cette section

**Éléments à inclure** :
- 3 colonnes avec les plans Starter, Pro, Enterprise
- Prix clairement visible
- Liste des fonctionnalités
- Boutons d'action (Start Free, Get Pro, Contact Sales)
- Badge "Most Popular" sur Pro

---

### 3. Détail de Service avec Prix (`service-details-price.png`)

**URL** : Variable selon le service

**Étapes** :
1. Accéder à `/discover` ou `/marketplace`
2. Cliquer sur un service pour voir les détails
3. Capturer la page de détail complète

**Éléments à inclure** :
- Image/preview du service
- Titre et description
- Prix en évidence
- Informations du prestataire (nom, note, avis)
- Options de personnalisation (si disponibles)
- Bouton "Book Service" ou "Add to Cart"
- Métriques (reach, engagement, etc.)

**Conseil** : Choisir un service avec un prix visible et des informations complètes

---

### 4. Architecture Docker (`architecture-docker.png`)

**Type** : Schéma à créer

**Outils recommandés** :
- **Draw.io (diagrams.net)** : https://app.diagrams.net
  - Template : "Docker Architecture"
  - Gratuit, pas de compte requis
  
- **Figma** : https://www.figma.com
  - Création manuelle avec formes
  - Style professionnel
  
- **Canva** : https://www.canva.com
  - Template : "Technical Architecture Diagram"
  - Gratuit avec compte

**Éléments à inclure** :
- 4 conteneurs principaux :
  - Frontend Container (React/Vite)
  - Backend Container (Node.js/API)
  - Database Container (PostgreSQL)
  - Proxy Container (Nginx)
- Docker Compose comme orchestrateur (en haut)
- Connexions réseau entre conteneurs
- Flèches montrant le flux de données
- Labels clairs pour chaque composant

**Style** :
- Couleurs cohérentes (bleu pour frontend, orange pour backend, vert pour database)
- Boîtes arrondies pour les conteneurs
- Flèches claires pour les connexions
- Texte lisible (police sans-serif, taille 12pt minimum)

---

### 5. Page d'Accueil (`home.png`)

**URL** : `http://localhost:5173/`

**Étapes** :
1. Accéder à la page d'accueil (sans être connecté de préférence)
2. Utiliser un outil de capture "full page" pour capturer toute la page

**Outils de capture full page** :
- **Extension Chrome** : "Full Page Screen Capture"
- **Firefox** : Outil de capture intégré (Ctrl + Shift + S)
- **Windows** : Snipping Tool → Mode "Free-form" ou "Full-screen"
- **Mac** : Screenshot (Cmd + Shift + 4) puis Espace pour fenêtre complète

**Éléments à inclure** :
- Hero section (en-tête avec titre principal)
- Section des fonctionnalités
- Section pricing (si présente)
- Témoignages
- Call-to-action principal
- Footer

**Alternative si page trop longue** :
- Capturer plusieurs sections séparément
- Utiliser un outil de montage pour combiner
- OU capturer seulement les sections les plus importantes

---

## Conseils Généraux

### Résolution et Format

- **Résolution minimale** : 1920x1080
- **Format** : PNG (meilleure qualité pour textes et schémas)
- **Compression** : Éviter une compression trop agressive qui dégrade la lisibilité

### Uniformité

- Utiliser la même résolution pour toutes les captures
- Même thème visuel (clair ou sombre) selon vos préférences
- Polices lisibles dans les captures

### Anonymisation

- Masquer les emails et noms réels dans les captures
- Utiliser des données de test cohérentes
- Vérifier qu'aucune information sensible n'est visible

### Nommage des Fichiers

Suggérer un nommage cohérent :
- `marketing-product-catalogue.png`
- `marketing-pricing-plans.png`
- `marketing-service-detail.png`
- `marketing-architecture-docker.png`
- `marketing-homepage.png`

Les captures de réseaux sociaux gardent leurs noms actuels.

---

## Ordre de Priorité

### Priorité Haute (Essentielles)

1. `pricing-plans.png` - Plans de tarification (section Prix)
2. `discover.png` - Catalogue de services (section Produit)
3. `home.png` - Page d'accueil (section Distribution)

### Priorité Moyenne (Importantes)

4. `service-details-price.png` - Détail service avec prix
5. `architecture-docker.png` - Architecture (à créer)

### Priorité Basse (Vérification)

6-14. Captures réseaux sociaux (existent déjà, à vérifier/mettre à jour)

---

## Structure de Dossier Recommandée

```
Chapters/
  img/
    discover.png
    pricing-plans.png
    service-details-price.png
    architecture-docker.png
    home.png
    Screenshot 2025-12-26 223354.png (LinkedIn)
    Screenshot 2025-12-26 223423.png (LinkedIn About)
    Screenshot 2025-12-26 223508.png (LinkedIn Posts)
    Screenshot 2025-12-26 223615.png (Instagram)
    Screenshot 2025-12-26 224853.png (YouTube)
    Screenshot 2025-12-26 225104.png (Facebook)
    Screenshot 2025-12-26 225238.png (Facebook Posts)
    Screenshot 2025-12-26 232313.png (Pinterest)
    Screenshot 2025-12-26 234950.png (Google Business)
```

---

## Notes Finales

- Toutes les captures doivent être faites avec l'application en cours d'exécution
- Pour le schéma Docker, privilégier un style cohérent avec le reste du document
- Vérifier la qualité et la lisibilité avant intégration dans LaTeX
- Sauvegarder les fichiers sources (.fig, .drawio) pour modifications ultérieures
- Tester l'intégration dans LaTeX pour vérifier la taille et le positionnement



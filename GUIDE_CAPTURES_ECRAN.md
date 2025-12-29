# Guide de Capture d'Écran - ViralForge Marketplace

Ce guide vous aide à capturer toutes les fonctionnalités de l'application pour votre documentation.

## 📋 Prérequis

1. **Démarrer l'application** : Assurez-vous que l'application est en cours d'exécution
   ```bash
   ./start-dev.sh
   ```
   L'application devrait être accessible sur `http://localhost:5173`

2. **Comptes de test nécessaires** :
   - Un compte **Prestataire (Creator)**
   - Un compte **Client (Brand)**
   - Un compte **Admin** (optionnel)

3. **Outils de capture** :
   - Windows : `Win + Shift + S` (Snipping Tool) ou `Win + G` (Game Bar)
   - Mac : `Cmd + Shift + 4`
   - Navigateur : Extensions de capture d'écran (Full Page Screen Capture)

---

## 🎯 1. Fonctionnalités Destinées aux Prestataires

### 1.1 Création de Profils Professionnels

#### Page : `/settings` (Onglet Profile)
**URL** : `http://localhost:5173/settings`
**Compte** : Prestataire (Creator)

**Éléments à capturer** :
- [ ] Formulaire de profil avec :
  - Nom d'affichage
  - Email
  - Photo de profil (Avatar)
  - Bio/Description
  - Site web
  - Informations de contact
- [ ] Section de téléchargement d'avatar
- [ ] Bouton "Save Changes"
- [ ] Message de confirmation après sauvegarde

**Navigation** : Se connecter → Cliquer sur l'avatar en haut à droite → Settings → Onglet "Profile"

---

#### Page : `/creators/:id` (Profil Public)
**URL** : `http://localhost:5173/creators/[ID_CREATOR]`
**Compte** : Visiteur ou connecté

**Éléments à capturer** :
- [ ] En-tête du profil avec avatar, nom, badge vérifié
- [ ] Statistiques (followers, engagement, rating)
- [ ] Bio et description
- [ ] Liens vers réseaux sociaux (Instagram, YouTube, Twitter, etc.)
- [ ] Liste des services proposés
- [ ] Bouton "Contact" ou "Message"

**Navigation** : Marketplace → Cliquer sur un créateur → Voir son profil

---

### 1.2 Publication et Gestion des Services

#### Page : `/services/manage` ou `/creator/listings`
**URL** : `http://localhost:5173/services/manage`
**Compte** : Prestataire (Creator)

**Éléments à capturer** :

**Vue Liste des Services** :
- [ ] Liste de tous les services créés
- [ ] Statut de chaque service (Actif, Inactif, En attente)
- [ ] Actions disponibles (Éditer, Supprimer, Voir)
- [ ] Bouton "Create Listing" / "Créer un Service"

**Formulaire de Création/Édition** :
- [ ] Modal/Dialog de création avec :
  - Titre du service
  - Description détaillée
  - Catégorie
  - Plateformes (Instagram, YouTube, TikTok, etc.)
  - Prix
  - Images/Photos du service
  - Métriques (Reach, Engagement)
  - Délai de livraison
- [ ] Boutons "Save" / "Cancel"
- [ ] Validation des champs obligatoires

**Navigation** : Dashboard Creator → "Manage Services" ou Menu → "My Services"

---

### 1.3 Gestion des Commandes

#### Page : `/orders`
**URL** : `http://localhost:5173/orders`
**Compte** : Prestataire (Creator)

**Éléments à capturer** :
- [ ] Onglets de filtrage : All, Pending, In Progress, Completed
- [ ] Liste des commandes/contrats avec :
  - Titre de la commande
  - Client (Brand)
  - Montant
  - Statut (Pending, Signed, In Progress, Completed, Cancelled)
  - Date de création
  - Date limite
- [ ] Actions disponibles :
  - Voir les détails
  - Accepter/Refuser une commande
  - Mettre à jour le statut
  - Marquer comme complété
- [ ] Informations de paiement
- [ ] Timeline/Progression de la commande

**Navigation** : Dashboard → "My Contracts" ou Menu → "Orders"

---

#### Page : `/bookings`
**URL** : `http://localhost:5173/bookings`
**Compte** : Prestataire (Creator)

**Éléments à capturer** :
- [ ] Vue calendrier ou liste des réservations
- [ ] Détails de chaque réservation
- [ ] Statut des réservations

---

### 1.4 Suivi des Performances et des Revenus

#### Page : `/analytics`
**URL** : `http://localhost:5173/analytics`
**Compte** : Prestataire (Creator)

**Éléments à capturer** :

**Onglet Overview** :
- [ ] Métriques clés :
  - Total Views (Vues totales)
  - Total Engagement (Engagement total)
  - Total Revenue (Revenus totaux)
  - Active Campaigns (Campagnes actives)
  - Login Count (Nombre de connexions)
  - Daily Usage (Utilisation quotidienne)
  - Total Clicks (Clics totaux)
  - Streak (Série de jours)
- [ ] Graphiques :
  - Graphique linéaire : Views & Engagement
  - Barres de progression : Average Engagement Rate, Virality Score
- [ ] Sélecteur de période (7 jours, 30 jours, 90 jours, 1 an)

**Onglet Engagement** :
- [ ] Graphique en barres des tendances d'engagement
- [ ] Données détaillées par période

**Onglet Revenue** :
- [ ] Vue d'ensemble des revenus
- [ ] Historique des paiements

**Navigation** : Dashboard → "Analytics" ou Menu → "Analytics"

---

#### Page : `/creator-dashboard`
**URL** : `http://localhost:5173/creator-dashboard`
**Compte** : Prestataire (Creator)

**Éléments à capturer** :
- [ ] Cartes de statistiques :
  - Total Earnings (Gains totaux)
  - Active Contracts (Contrats actifs)
  - My Services (Mes services)
  - Available Campaigns (Campagnes disponibles)
- [ ] Section "Available Campaigns" avec liste
- [ ] Section "My Listings" avec lien vers gestion
- [ ] Section "My Contracts" avec aperçu
- [ ] Section "Messages"

**Navigation** : Se connecter en tant que Creator → Redirection automatique ou Menu → "Dashboard"

---

### 1.5 Interaction avec les Clients

#### Page : `/messages`
**URL** : `http://localhost:5173/messages`
**Compte** : Prestataire (Creator)

**Éléments à capturer** :
- [ ] Liste des conversations (sidebar gauche)
- [ ] Zone de conversation principale
- [ ] Champ de saisie de message
- [ ] Bouton d'envoi
- [ ] Indicateur de messages non lus
- [ ] Timestamps des messages
- [ ] Indicateur de "typing" (si disponible)
- [ ] Options : Fichiers joints, emojis

**Navigation** : Menu → "Messages" ou Icône de cloche/notifications → Messages

---

#### Page : `/creators/:id` (Vue Client)
**URL** : `http://localhost:5173/creators/[ID_CREATOR]`
**Compte** : Client (Brand)

**Éléments à capturer** :
- [ ] Bouton "Contact Creator" ou "Message"
- [ ] Formulaire de contact (si modal)
- [ ] Redirection vers Messages après contact

---

## 🔄 2. Fonctionnalités Transversales

### 2.1 Notifications Automatiques

#### Composant : Badge de Notifications
**Emplacement** : Navbar (en haut à droite)
**Compte** : Connecté (tous rôles)

**Éléments à capturer** :
- [ ] Icône de cloche avec badge de nombre
- [ ] Badge affichant le nombre de notifications non lues
- [ ] Badge "9+" si plus de 9 notifications
- [ ] Clic sur l'icône → Redirection vers `/messages`

**Comment déclencher** :
1. Se connecter avec un compte
2. Recevoir un message ou une notification
3. Capturer la navbar avec le badge

---

#### Page : `/settings` (Onglet Notifications)
**URL** : `http://localhost:5173/settings`
**Compte** : Connecté

**Éléments à capturer** :
- [ ] Section "Email Notifications" avec toggles :
  - Campaign activity
  - New messages
  - Payment updates
  - Security alerts
- [ ] Section "Push Notifications" avec toggles :
  - Campaign activity
  - New messages
  - Payment updates
- [ ] Bouton "Save Preferences"

**Navigation** : Settings → Onglet "Notifications"

---

### 2.2 Système d'Évaluation et d'Avis

#### Page : `/creators/:id` (Section Reviews)
**URL** : `http://localhost:5173/creators/[ID_CREATOR]`
**Compte** : Visiteur ou connecté

**Éléments à capturer** :
- [ ] Note moyenne affichée (étoiles)
- [ ] Nombre total d'avis
- [ ] Liste des avis avec :
  - Nom de l'auteur
  - Note (étoiles)
  - Commentaire
  - Date
  - Avatar
- [ ] Bouton "Write a Review" (si connecté et client)

**Navigation** : Marketplace → Profil d'un créateur → Section "Reviews"

---

#### Page : `/campaigns/:id` (Avis sur Campagne)
**URL** : `http://localhost:5173/campaigns/[ID_CAMPAIGN]`
**Compte** : Client (Brand) ou Prestataire (Creator)

**Éléments à capturer** :
- [ ] Section d'évaluation après complétion
- [ ] Formulaire de notation avec étoiles
- [ ] Champ de commentaire
- [ ] Bouton "Submit Review"

---

### 2.3 Support Client Intégré

#### Page : `/help`
**URL** : `http://localhost:5173/help`
**Compte** : Tous

**Éléments à capturer** :
- [ ] Page d'aide avec FAQ
- [ ] Catégories de questions
- [ ] Barre de recherche
- [ ] Articles populaires
- [ ] Formulaire de contact support

**Navigation** : Footer → "Help" ou Menu → "Help"

---

#### Page : `/contact`
**URL** : `http://localhost:5173/contact`
**Compte** : Tous

**Éléments à capturer** :
- [ ] Formulaire de contact
- [ ] Champs : Nom, Email, Sujet, Message
- [ ] Bouton "Send Message"
- [ ] Informations de contact (email, adresse)

**Navigation** : Footer → "Contact" ou Menu → "Contact"

---

#### Composant : Chatbot (si disponible)
**Emplacement** : Coin inférieur droit ou intégré

**Éléments à capturer** :
- [ ] Icône/Widget de chatbot
- [ ] Interface de chat
- [ ] Réponses automatiques
- [ ] Options de conversation

---

### 2.4 Outils d'Analyse de Performance

#### Page : `/analytics` (Déjà couvert en 1.4)
**Voir section 1.4 pour les détails**

**Éléments supplémentaires à capturer** :
- [ ] Export de données (si disponible)
- [ ] Filtres avancés
- [ ] Comparaisons de périodes
- [ ] Alertes et seuils

---

#### Page : `/campaigns/:id/analytics`
**URL** : `http://localhost:5173/campaigns/[ID_CAMPAIGN]/analytics`
**Compte** : Client (Brand) ou Prestataire (Creator)

**Éléments à capturer** :
- [ ] Métriques spécifiques à la campagne
- [ ] Graphiques de performance
- [ ] Engagement par créateur
- [ ] ROI et conversions

**Navigation** : Campaigns → Sélectionner une campagne → "Analytics"

---

### 2.5 Gestion des Droits et des Accès

#### Page : `/settings` (Onglet Security)
**URL** : `http://localhost:5173/settings`
**Compte** : Connecté

**Éléments à capturer** :
- [ ] Section "Change Password" :
  - Champ "Current Password"
  - Champ "New Password"
  - Champ "Confirm New Password"
  - Bouton "Update Password"
- [ ] Section "Two-Factor Authentication (2FA)" :
  - Toggle pour activer/désactiver 2FA
  - QR Code pour configuration
  - Codes de récupération
- [ ] Section "Active Sessions" :
  - Liste des appareils connectés
  - Bouton "Revoke Access" pour chaque session
- [ ] Section "API Keys" (si disponible) :
  - Liste des clés API
  - Bouton "Generate New Key"
  - Bouton "Revoke" pour chaque clé

**Navigation** : Settings → Onglet "Security"

---

#### Page : `/settings` (Onglet Account)
**URL** : `http://localhost:5173/settings`
**Compte** : Connecté

**Éléments à capturer** :
- [ ] Type de compte (Creator, Brand, Admin)
- [ ] Statut de vérification
- [ ] Options de suppression de compte
- [ ] Préférences de confidentialité

---

#### Composant : RoleBasedRoute
**Fonctionnalité** : Contrôle d'accès basé sur les rôles

**Éléments à capturer** :
- [ ] Tentative d'accès à une page réservée (ex: `/brand-dashboard` en tant que Creator)
- [ ] Message d'erreur "Access Denied" ou redirection
- [ ] Redirection vers le dashboard approprié

**Comment tester** :
1. Se connecter en tant que Creator
2. Essayer d'accéder à `/brand-dashboard`
3. Capturer le message d'erreur ou la redirection

---

## 🔒 3. Sécurité et Conformité

### 3.1 Authentification Sécurisée

#### Page : `/auth`
**URL** : `http://localhost:5173/auth`
**Compte** : Non connecté

**Éléments à capturer** :

**Onglet Login** :
- [ ] Formulaire de connexion :
  - Champ Email
  - Champ Password
  - Bouton "Sign In"
  - Lien "Forgot Password?"
  - Lien "Don't have an account? Sign up"
- [ ] Options de connexion sociale (Google, GitHub, etc.) si disponibles
- [ ] Message d'erreur en cas d'échec
- [ ] Validation des champs

**Onglet Sign Up** :
- [ ] Formulaire d'inscription :
  - Champ Email
  - Champ Password
  - Champ Confirm Password
  - Sélection du rôle (Creator/Brand)
  - Checkbox "Terms of Service"
  - Checkbox "Privacy Policy"
  - Bouton "Sign Up"
- [ ] Validation en temps réel
- [ ] Messages d'erreur de validation

**Onglet Forgot Password** :
- [ ] Formulaire de réinitialisation :
  - Champ Email
  - Bouton "Send Reset Link"
  - Message de confirmation

**Navigation** : Cliquer sur "Sign In" dans la navbar ou accéder directement à `/auth`

---

#### Page : `/settings` (Section 2FA)
**Voir section 2.5 pour les détails**

---

### 3.2 Protection contre les Attaques Courantes

#### Fonctionnalités à documenter (visuellement) :
- [ ] **Rate Limiting** : Essayer de soumettre un formulaire plusieurs fois rapidement
  - Capturer le message "Too many requests"
- [ ] **CSRF Protection** : Vérifier les tokens dans les formulaires (inspecter le code)
- [ ] **XSS Protection** : Tester avec des scripts dans les champs de texte
  - Capturer le rejet ou l'échappement des caractères
- [ ] **SQL Injection Protection** : Vérifier la validation des entrées (backend)

**Note** : Certaines protections ne sont pas visibles directement. Capturer les messages d'erreur appropriés.

---

### 3.3 Gestion du Consentement Utilisateur (Cookies)

#### Composant : CookieConsent
**Emplacement** : Bannière en bas de page (première visite)

**Éléments à capturer** :
- [ ] Bannière de consentement avec :
  - Message expliquant l'utilisation des cookies
  - Bouton "Accept All"
  - Bouton "Reject All"
  - Bouton "Customize" ou lien "Learn More"
- [ ] Modal de personnalisation (si disponible) :
  - Toggles pour différents types de cookies
  - Cookies essentiels
  - Cookies analytiques
  - Cookies marketing
  - Bouton "Save Preferences"
- [ ] Disparition de la bannière après acceptation
- [ ] Réapparition après suppression des cookies

**Comment tester** :
1. Ouvrir l'application en navigation privée
2. Capturer la bannière au chargement
3. Accepter/Refuser et capturer

---

#### Page : `/cookies`
**URL** : `http://localhost:5173/cookies`
**Compte** : Tous

**Éléments à capturer** :
- [ ] Page d'information sur les cookies
- [ ] Explication des types de cookies utilisés
- [ ] Instructions pour gérer les cookies
- [ ] Bouton pour modifier les préférences

**Navigation** : Footer → "Cookies Policy" ou Settings → Cookies

---

### 3.4 Respect des Principes de Protection des Données Personnelles

#### Page : `/privacy`
**URL** : `http://localhost:5173/privacy`
**Compte** : Tous

**Éléments à capturer** :
- [ ] Page de politique de confidentialité complète
- [ ] Sections :
  - Collecte de données
  - Utilisation des données
  - Partage des données
  - Droits des utilisateurs
  - Contact pour questions
- [ ] Date de dernière mise à jour

**Navigation** : Footer → "Privacy Policy"

---

#### Page : `/gdpr`
**URL** : `http://localhost:5173/gdpr`
**Compte** : Tous

**Éléments à capturer** :
- [ ] Page de conformité GDPR
- [ ] Droits des utilisateurs (accès, rectification, suppression, etc.)
- [ ] Formulaire de demande d'exercice des droits
- [ ] Informations sur le traitement des données

**Navigation** : Footer → "GDPR" ou Privacy → Lien GDPR

---

#### Page : `/settings` (Section Data)
**URL** : `http://localhost:5173/settings`
**Compte** : Connecté

**Éléments à capturer** :
- [ ] Section "Data Management" :
  - Bouton "Download My Data" (export des données)
  - Bouton "Delete My Account" (suppression de compte)
  - Confirmation avant suppression
- [ ] Section "Privacy Settings" :
  - Options de visibilité du profil
  - Partage de données avec tiers
  - Préférences de marketing

**Navigation** : Settings → Onglet "Privacy" ou "Data"

---

### 3.5 Accès Contrôlé aux Ressources

#### Fonctionnalités à documenter :

**Protection des Routes** :
- [ ] Tentative d'accès à `/dashboard` sans être connecté
  - Redirection vers `/auth`
  - Message "Please sign in to continue"
- [ ] Accès à `/creator-dashboard` en tant que Brand
  - Redirection ou message d'erreur
- [ ] Accès à `/brand-dashboard` en tant que Creator
  - Redirection ou message d'erreur

**Protection des Ressources** :
- [ ] Tentative d'édition d'un service d'un autre créateur
  - Message "You don't have permission"
- [ ] Tentative d'accès à une commande d'un autre utilisateur
  - Message "Access Denied"

**Navigation** : Tester manuellement les accès non autorisés

---

## 📸 Checklist Complète de Capture

### Pages Principales
- [ ] `/` - Landing Page
- [ ] `/marketplace` - Marketplace
- [ ] `/discover` - Découverte de créateurs
- [ ] `/pricing` - Plans tarifaires
- [ ] `/about` - À propos

### Pages Prestataires
- [ ] `/creator-dashboard` - Dashboard créateur
- [ ] `/services/manage` - Gestion des services
- [ ] `/orders` - Commandes
- [ ] `/bookings` - Réservations
- [ ] `/analytics` - Analytics
- [ ] `/creators/:id` - Profil public créateur

### Pages Clients
- [ ] `/brand-dashboard` - Dashboard marque
- [ ] `/campaigns` - Campagnes
- [ ] `/campaigns/new` - Création de campagne
- [ ] `/campaigns/:id` - Détails campagne
- [ ] `/campaigns/:id/analytics` - Analytics campagne

### Pages Transversales
- [ ] `/messages` - Messages
- [ ] `/settings` - Paramètres (tous les onglets)
- [ ] `/help` - Aide
- [ ] `/contact` - Contact

### Pages Sécurité
- [ ] `/auth` - Authentification
- [ ] `/privacy` - Confidentialité
- [ ] `/cookies` - Cookies
- [ ] `/gdpr` - GDPR
- [ ] `/terms` - Conditions d'utilisation

---

## 💡 Conseils pour les Captures

1. **Résolution** : Utilisez une résolution minimale de 1920x1080
2. **Format** : PNG pour qualité, JPG pour taille réduite
3. **Nommage** : Utilisez des noms descriptifs :
   - `01-creator-dashboard-overview.png`
   - `02-service-creation-form.png`
   - `03-order-management-list.png`
4. **Annotations** : Ajoutez des flèches ou encadrés pour mettre en évidence les fonctionnalités importantes
5. **Données de test** : Utilisez des données réalistes mais anonymes
6. **Navigation** : Capturez les transitions et animations si pertinentes
7. **Responsive** : Capturez aussi les vues mobile/tablet si nécessaire

---

## 🚀 Démarrage Rapide

1. **Démarrer l'application** :
   ```bash
   ./start-dev.sh
   ```

2. **Créer des comptes de test** :
   - Aller sur `/auth`
   - Créer un compte Creator
   - Créer un compte Brand
   - (Optionnel) Créer un compte Admin

3. **Commencer par les fonctionnalités prestataires** :
   - Se connecter en tant que Creator
   - Suivre la checklist section 1

4. **Continuer avec les fonctionnalités transversales** :
   - Suivre la checklist section 2

5. **Terminer avec la sécurité** :
   - Suivre la checklist section 3

---

## 📝 Notes Importantes

- **Données sensibles** : Masquez les emails, noms réels, et informations personnelles dans les captures finales
- **État de l'application** : Assurez-vous que l'application fonctionne correctement avant de capturer
- **Cohérence** : Utilisez le même compte de test pour des captures cohérentes
- **Complétude** : Vérifiez que toutes les fonctionnalités listées sont bien implémentées avant de capturer

---

Bon courage pour vos captures d'écran ! 🎉



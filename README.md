# JOJ Dakar 2026 – Transport Hub 🇸🇳🚌

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)

---

# 📖 Présentation

Le projet **JOJ Dakar 2026 – Transport Hub** https://joj-dakar-transport.vercel.app/ est une plateforme web développée dans le cadre d'un système de gestion du transport des Jeux Olympiques de la Jeunesse Dakar 2026.

L'objectif principal est de fournir aux administrateurs un outil moderne permettant de superviser l'ensemble des déplacements des différents acteurs des Jeux (athlètes, chauffeurs, personnel d'organisation, équipes de support, etc.).

La plateforme permet notamment de gérer les véhicules, suivre les réservations, contrôler la disponibilité de la flotte, visualiser les utilisateurs connectés en temps réel et répartir efficacement les ressources entre les différents sites olympiques.

Grâce à l'utilisation de **React**, **TypeScript**, **Supabase**, **PostgreSQL** et **Tailwind CSS**, l'application bénéficie d'une architecture moderne, performante et facilement maintenable.

---

# 🎯 Objectifs du projet

Le projet poursuit plusieurs objectifs :

- Digitaliser la gestion du transport des JOJ Dakar 2026.
- Offrir une plateforme centralisée pour les administrateurs.
- Réduire les erreurs liées à la gestion manuelle des véhicules.
- Suivre les réservations en temps réel.
- Répartir intelligemment les véhicules entre les différents sites olympiques.
- Garantir la sécurité des données grâce au système de rôles.
- Fournir une interface intuitive et responsive.

---

# 🌍 Contexte

Les Jeux Olympiques de la Jeunesse Dakar 2026 accueilleront plusieurs milliers de participants provenant du monde entier.

La gestion du transport constitue un défi majeur puisqu'il faudra déplacer :

- les athlètes ;
- les entraîneurs ;
- les officiels ;
- les bénévoles ;
- les équipes médicales ;
- les journalistes ;
- les visiteurs.

Ces déplacements doivent être organisés entre plusieurs sites olympiques :

- Dakar
- Diamniadio
- Saly

Une mauvaise gestion pourrait provoquer :

- des retards ;
- une mauvaise répartition des véhicules ;
- des embouteillages ;
- une perte de temps pour les organisateurs.

Le Transport Hub répond à ce besoin en proposant une plateforme centralisée permettant de suivre l'ensemble des opérations en temps réel.

---

# 🚀 Fonctionnalités principales

La plateforme offre les fonctionnalités suivantes :

## Tableau de bord Administrateur

Le tableau de bord fournit une vue globale du système :

- nombre total de véhicules ;
- réservations actives ;
- véhicules en maintenance ;
- utilisateurs connectés ;
- statistiques générales.

---

## Gestion de la flotte

L'administrateur peut :

- ajouter un véhicule ;
- modifier son état ;
- supprimer un véhicule ;
- affecter un véhicule à un site olympique.

---

## Gestion des réservations

Le système permet :

- la création d'une réservation ;
- la validation par l'administrateur ;
- le suivi de son état ;
- l'historique des déplacements.

---

## Gestion des utilisateurs

Les utilisateurs disposent de différents rôles :

- Administrateur
- Chauffeur
- Support
- Utilisateur

Chaque rôle possède des autorisations spécifiques.

---

## Temps réel

Grâce à Supabase Realtime, les informations sont mises à jour automatiquement sans recharger la page.

Les administrateurs voient immédiatement :

- les nouveaux utilisateurs ;
- les nouvelles réservations ;
- les modifications de véhicules ;
- les connexions.

---

## Sécurité

La plateforme utilise :

- PostgreSQL
- Supabase Auth
- Row Level Security (RLS)

afin que chaque utilisateur n'accède qu'aux données autorisées.

---

# 🛠 Technologies utilisées

| Technologie | Rôle |
|-------------|------|
| React | Construction de l'interface utilisateur |
| TypeScript | Typage statique et fiabilité du code |
| Tailwind CSS | Mise en forme moderne |
| Supabase | Backend et authentification |
| PostgreSQL | Base de données |
| Supabase Realtime | Synchronisation en temps réel |
| Lucide React | Icônes |
---

# 📂 Structure du projet

Le projet est organisé selon une architecture modulaire afin de faciliter son développement, sa maintenance et son évolution.

```
joj-dakar-transport/
│
├── public/                    # Ressources statiques
│
├── src/
│   ├── components/            # Composants React réutilisables
│   ├── pages/                 # Pages principales de l'application
│   ├── lib/                   # Fonctions utilitaires et logique métier
│   ├── hooks/                 # Hooks personnalisés
│   ├── integrations/
│   │      └── supabase/       # Configuration de Supabase
│   ├── assets/                # Images, logos et icônes
│   ├── styles/                # Feuilles de style CSS
│   ├── App.tsx                # Composant principal
│   └── main.tsx               # Point d'entrée de l'application
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

Cette organisation permet de séparer clairement les responsabilités entre l'interface utilisateur, la logique métier, les communications avec la base de données et les ressources graphiques.

---

# 🏗️ Architecture générale

L'application repose sur une architecture **Client – Serveur**.

```
                   Utilisateur
                        │
                        ▼
              Interface React (Frontend)
                        │
                        ▼
               API Supabase (Backend)
                        │
                        ▼
              Base PostgreSQL (Database)
                        │
                        ▼
             Synchronisation Temps Réel
```

Chaque couche possède une responsabilité bien définie.

### Frontend

Le frontend est développé avec **React** et **TypeScript**.

Il est responsable de :

- l'affichage des interfaces ;
- la navigation entre les pages ;
- la récupération des données ;
- l'interaction avec les utilisateurs ;
- l'envoi des requêtes vers Supabase.

---

### Backend

Le backend est assuré par **Supabase**.

Il prend en charge :

- l'authentification ;
- les requêtes SQL ;
- le stockage des données ;
- la sécurité ;
- la synchronisation en temps réel.

Aucun serveur Node.js supplémentaire n'est nécessaire puisque Supabase fournit directement ces services.

---

### Base de données

Toutes les données sont stockées dans une base **PostgreSQL**.

Les principales tables utilisées sont :

## Table `profiles`

Elle contient les informations des utilisateurs.

Exemple :

| Champ | Description |
|--------|-------------|
| id | Identifiant unique |
| full_name | Nom complet |
| email | Adresse email |
| role | Rôle utilisateur |
| created_at | Date de création |

---

## Table `vehicles`

Elle contient tous les véhicules disponibles.

Exemple :

| Champ | Description |
|--------|-------------|
| id | Identifiant |
| plate_number | Immatriculation |
| model | Modèle |
| category | Catégorie |
| capacity | Nombre de places |
| site | Site olympique |
| status | Disponible, Occupé ou Maintenance |

---

## Table `reservations`

Elle stocke les demandes de transport.

Exemple :

| Champ | Description |
|--------|-------------|
| id | Identifiant |
| user_id | Utilisateur concerné |
| pickup_site | Site de départ |
| destination_site | Site d'arrivée |
| status | État de la réservation |
| created_at | Date de création |

---

# 🔐 Authentification

Le système utilise **Supabase Authentication**.

Lorsqu'un utilisateur se connecte :

1. son identité est vérifiée ;
2. un jeton sécurisé (JWT) est créé ;
3. ce jeton accompagne toutes les requêtes ;
4. Supabase vérifie automatiquement les autorisations.

Cette approche évite qu'un utilisateur puisse accéder aux données d'un autre.

---

# 👥 Gestion des rôles

L'application implémente un système de rôles permettant d'attribuer des droits spécifiques.

## Administrateur

L'administrateur possède tous les privilèges.

Il peut :

- gérer les utilisateurs ;
- ajouter des véhicules ;
- modifier les véhicules ;
- supprimer les véhicules ;
- consulter toutes les réservations ;
- accéder au tableau de bord.

---

## Chauffeur

Le chauffeur peut uniquement consulter les informations liées à ses missions.

Il ne peut pas modifier les données administratives.

---

## Support

Le personnel support peut suivre les opérations afin d'aider les utilisateurs et signaler les incidents.

---

## Utilisateur

L'utilisateur classique peut :

- créer une réservation ;
- consulter ses réservations ;
- suivre leur état.

---

# 🛡️ Sécurité

La plateforme utilise le mécanisme **Row Level Security (RLS)** de PostgreSQL.

Chaque table possède des politiques de sécurité empêchant un utilisateur d'accéder à des données qui ne lui appartiennent pas.

Les principales protections sont :

- authentification obligatoire ;
- contrôle des rôles ;
- politiques RLS ;
- vérification des permissions avant chaque requête.

Cette architecture garantit un haut niveau de sécurité.

---

# 📡 Synchronisation en temps réel

L'une des fonctionnalités majeures du projet est la synchronisation en temps réel grâce à **Supabase Realtime**.

À chaque modification :

- ajout d'un véhicule ;
- suppression d'un véhicule ;
- nouvelle réservation ;
- changement de statut ;
- connexion d'un utilisateur ;

Supabase envoie automatiquement une notification à tous les clients connectés.

L'interface React se met alors à jour sans nécessiter de rechargement de la page.

Cette fonctionnalité est particulièrement importante pour une plateforme destinée à superviser un événement sportif où les informations évoluent en permanence.

---

# ⚙️ Installation du projet

## 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/joj-dakar-transport.git
```

---

## 2. Accéder au projet

```bash
cd joj-dakar-transport
```

---

## 3. Installer les dépendances

```bash
npm install
```

---

## 4. Configurer Supabase

Créer un fichier `.env` à la racine du projet contenant les variables suivantes :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_publique
```

Ces informations sont disponibles dans le tableau de bord Supabase.

---

## 5. Lancer l'application

```bash
npm run dev
```

Par défaut, l'application est accessible à l'adresse :

```
http://localhost:5173
```

---

# 📈 Performances

Le projet met en œuvre plusieurs techniques afin d'améliorer les performances :

- utilisation de `useMemo()` pour éviter les recalculs inutiles ;
- exécution parallèle des requêtes grâce à `Promise.all()` ;
- composants React réutilisables ;
- synchronisation temps réel sans rafraîchissement manuel ;
- architecture modulaire facilitant les évolutions futures.
---

# 📄 Explication détaillée du fichier `AdminDashboard.tsx`

## Introduction

Le fichier `AdminDashboard.tsx` constitue le cœur de la plateforme **JOJ Dakar 2026 – Transport Hub**. Il représente l'interface principale destinée aux administrateurs. Son rôle est de centraliser toutes les informations importantes liées à la gestion du transport, notamment les véhicules, les réservations, les utilisateurs connectés et les sites olympiques.

Grâce à ce tableau de bord, l'administrateur peut superviser l'ensemble des opérations en temps réel sans avoir à naviguer entre plusieurs pages. Toutes les informations sont récupérées depuis la base de données Supabase et sont automatiquement mises à jour lorsqu'un changement intervient.

L'utilisation de React, TypeScript et Supabase permet d'obtenir une interface moderne, dynamique et performante.

---

# 1. Les importations

Au début du fichier, plusieurs bibliothèques sont importées.

```tsx
import { useEffect, useMemo, useState } from "react";
```

Ces hooks React permettent de gérer le comportement dynamique du composant.

### useState

`useState` est utilisé pour mémoriser les données qui peuvent évoluer pendant l'exécution de l'application.

Dans ce composant, il sert notamment à stocker :

- l'onglet actuellement sélectionné ;
- la liste des utilisateurs ;
- la liste des véhicules ;
- la liste des réservations ;
- l'état de chargement de la page.

Grâce à `useState`, toute modification des données entraîne automatiquement une mise à jour de l'interface.

---

### useEffect

Le hook `useEffect` permet d'exécuter automatiquement certaines opérations.

Dans ce projet, il est utilisé pour :

- charger les données au démarrage ;
- ouvrir une connexion temps réel avec Supabase ;
- lancer un rafraîchissement automatique toutes les 30 secondes ;
- fermer correctement les connexions lorsque l'utilisateur quitte la page.

Sans ce hook, les données resteraient figées.

---

### useMemo

Le hook `useMemo` sert à optimiser les performances.

Certaines statistiques nécessitent de parcourir de nombreuses listes.

Par exemple :

- nombre de véhicules ;
- nombre de réservations actives ;
- nombre de véhicules en maintenance.

Plutôt que de recalculer ces valeurs à chaque affichage, `useMemo` les mémorise jusqu'à ce qu'une donnée change.

Cette technique améliore considérablement la fluidité de l'application.

---

# 2. Les icônes Lucide React

Le projet utilise la bibliothèque **Lucide React**.

Exemple :

```tsx
import {
Car,
Activity,
AlertTriangle,
Users,
MapPin,
TrendingUp,
Radio,
Shield
} from "lucide-react";
```

Chaque icône possède un rôle précis.

| Icône | Signification |
|--------|---------------|
| Car | Véhicules |
| Users | Utilisateurs |
| Activity | Activité |
| AlertTriangle | Maintenance |
| Radio | Temps réel |
| Shield | Sécurité |
| MapPin | Sites olympiques |
| TrendingUp | Statistiques |

Ces icônes améliorent la compréhension de l'interface.

---

# 3. Les constantes

Le fichier définit plusieurs constantes importantes.

## Les sites olympiques

```tsx
const SITES = [
"Dakar",
"Diamniadio",
"Saly"
];
```

Cette constante représente les trois principaux sites des Jeux Olympiques.

Elle est utilisée pour :

- affecter un véhicule ;
- filtrer les véhicules ;
- afficher les statistiques.

L'avantage est qu'en cas d'ajout d'un nouveau site, une seule modification est nécessaire.

---

## Les couleurs des rôles

Une autre constante associe une couleur à chaque rôle.

Par exemple :

- administrateur → rouge
- chauffeur → vert
- utilisateur → bleu
- support → jaune

Cela permet d'identifier immédiatement le rôle d'une personne connectée.

---

# 4. Le composant AdminDashboard

Le composant principal est déclaré ainsi :

```tsx
export function AdminDashboard()
```

Il représente toute la page du tableau de bord.

Toutes les autres fonctions du fichier sont utilisées par ce composant.

---

# 5. Les états (States)

Le tableau de bord possède plusieurs états.

## Onglet actif

```tsx
const [tab, setTab] = useState(...)
```

Il mémorise l'onglet actuellement ouvert.

Les valeurs possibles sont :

- Overview
- Sessions
- Fleet
- Sites

Lorsque l'utilisateur clique sur un bouton, cet état est mis à jour.

---

## Liste des profils

```tsx
const [profiles, setProfiles]
```

Contient tous les utilisateurs.

---

## Liste des réservations

```tsx
const [reservations, setReservations]
```

Stocke toutes les réservations enregistrées.

---

## Liste des véhicules

```tsx
const [vehicles, setVehicles]
```

Contient tous les véhicules disponibles.

---

## Chargement

```tsx
const [loading, setLoading]
```

Permet d'afficher une animation de chargement tant que les données ne sont pas récupérées.

---

# 6. La fonction load()

La fonction :

```tsx
async function load()
```

est l'une des fonctions les plus importantes.

Elle est responsable de récupérer toutes les données nécessaires au fonctionnement du tableau de bord.

Les requêtes sont exécutées simultanément grâce à :

```tsx
Promise.all()
```

Les trois tables interrogées sont :

- profiles
- reservations
- vehicles

L'utilisation de `Promise.all()` permet d'améliorer les performances en exécutant plusieurs requêtes en parallèle.

Une fois les données reçues, elles sont enregistrées dans les différents états React.

---

# 7. Synchronisation en temps réel

Après le premier chargement, le composant ouvre un canal Realtime.

```tsx
supabase.channel(...)
```

Ce canal surveille automatiquement les modifications des tables.

Chaque fois qu'un utilisateur :

- ajoute un véhicule ;
- supprime une réservation ;
- modifie un profil ;

Supabase envoie une notification.

Le tableau de bord appelle alors automatiquement :

```tsx
load()
```

Les données sont donc toujours synchronisées.

---

# 8. Rafraîchissement automatique

Le composant lance également :

```tsx
setInterval(...)
```

Toutes les 30 secondes :

- les profils sont rechargés ;
- les réservations sont rechargées ;
- les véhicules sont rechargés.

Cela évite de conserver des informations obsolètes.

---

# 9. Calcul des statistiques

Les statistiques sont calculées grâce à :

```tsx
useMemo()
```

Les indicateurs affichés sont :

- nombre total de véhicules ;
- réservations actives ;
- réservations terminées ;
- réservations en attente ;
- véhicules en maintenance ;
- utilisateurs connectés.

Toutes ces valeurs sont calculées automatiquement à partir des données récupérées dans Supabase.

---

# 10. Organisation du tableau de bord

Le tableau de bord est divisé en quatre grandes sections.

## Vue d'ensemble

Cette page affiche les indicateurs principaux.

L'administrateur visualise immédiatement :

- le nombre total de véhicules ;
- les réservations actives ;
- les véhicules en maintenance ;
- les utilisateurs connectés.

Cette vue permet d'obtenir rapidement l'état global du système.

---

## Sessions temps réel

Cette partie affiche tous les utilisateurs actuellement connectés.

Ils sont classés selon leur rôle :

- utilisateurs ;
- chauffeurs ;
- support ;
- administrateurs.

Chaque utilisateur possède un voyant vert indiquant qu'il est connecté.

---

## Gestion de la flotte

Cette section permet de gérer tous les véhicules.

L'administrateur peut :

- ajouter un véhicule ;
- modifier son statut ;
- supprimer un véhicule ;
- consulter toute la flotte.

Toutes les modifications sont directement enregistrées dans Supabase.

---

## Sites olympiques

Cette page présente les statistiques pour chaque site.

Pour Dakar, Diamniadio et Saly, le tableau de bord affiche :

- le nombre total de véhicules ;
- le nombre de véhicules disponibles.

Cela permet de répartir efficacement la flotte.

---

# 11. Les composants secondaires

Pour rendre le code plus lisible, plusieurs composants React ont été créés.

## StatCard

Affiche une carte contenant :

- une icône ;
- un titre ;
- une valeur.

Elle est utilisée pour les statistiques principales.

---

## OnlineGroup

Affiche un groupe d'utilisateurs appartenant au même rôle.

Exemple :

- Chauffeurs
- Administrateurs
- Support

---

## OnlineList

Affiche la liste détaillée des personnes connectées.

Chaque ligne contient :

- le nom ;
- le rôle ;
- un indicateur de connexion.

---

## FleetTab

Ce composant est entièrement consacré à la gestion des véhicules.

Il permet :

- l'ajout ;
- la modification ;
- la suppression.

Toutes les opérations communiquent directement avec Supabase.

---

# 12. Communication avec Supabase

Le tableau de bord utilise quatre opérations SQL principales.

## SELECT

Récupère les données.

## INSERT

Ajoute un véhicule.

## UPDATE

Met à jour son statut.

## DELETE

Supprime un véhicule.

Grâce à ces opérations, toutes les informations affichées sont directement synchronisées avec la base PostgreSQL.

---

# Conclusion

Le composant `AdminDashboard.tsx` constitue le centre de pilotage de la plateforme JOJ Dakar 2026. Il regroupe les fonctionnalités essentielles de supervision, de gestion des véhicules, des réservations et des utilisateurs. L'association de React, TypeScript et Supabase permet d'obtenir une interface réactive, performante et synchronisée en temps réel, offrant ainsi aux administrateurs une vision complète et actualisée de l'ensemble du système de transport.
---

# 🎨 Explication détaillée du fichier `style.css`

## Introduction

Le fichier `style.css` est la feuille de style principale de la plateforme **JOJ Dakar 2026 – Transport Hub**. Il définit l'identité visuelle de l'application en utilisant **Tailwind CSS**, des variables CSS personnalisées et des utilitaires graphiques. Son rôle est d'assurer une interface moderne, cohérente et facilement maintenable.

Contrairement à une feuille CSS classique contenant uniquement des règles de style, ce fichier sert également de système de design (*Design System*). Toutes les couleurs, les espacements, les rayons de bordure et les composants graphiques sont centralisés afin de garantir une uniformité sur l'ensemble de l'application.

---

# 1. Importation de Tailwind CSS

Le fichier commence par importer Tailwind CSS.

```css
@import "tailwindcss" source(none);
```

Cette instruction charge le framework Tailwind CSS, qui fournit des centaines de classes utilitaires permettant de construire rapidement des interfaces modernes.

Le paramètre `source(none)` désactive la détection automatique des fichiers afin d'améliorer les performances de compilation. Les fichiers utilisés sont ensuite déclarés explicitement.

---

# 2. Déclaration des fichiers sources

```css
@source "../src";
```

Cette instruction indique à Tailwind que toutes les classes CSS utilisées dans le dossier `src` doivent être analysées.

Lors de la compilation, Tailwind ne conserve que les classes réellement utilisées dans l'application. Cette technique réduit considérablement la taille du fichier CSS final et améliore les performances de chargement.

---

# 3. Importation des animations

```css
@import "tw-animate-css";
```

Cette bibliothèque ajoute des animations prédéfinies à l'application.

Elle permet notamment :

- l'apparition progressive des composants ;
- les transitions fluides ;
- les effets de chargement ;
- les animations des icônes.

Ces animations améliorent l'expérience utilisateur en rendant l'interface plus dynamique.

---

# 4. Gestion du mode sombre

Le code suivant permet d'activer automatiquement le thème sombre.

```css
@custom-variant dark (&:is(.dark *));
```

Cette instruction crée une variante `dark`.

Lorsque la classe `.dark` est présente sur la page, toutes les couleurs sont automatiquement remplacées par celles du thème sombre.

L'avantage est qu'aucun composant React n'a besoin d'être modifié : seul le thème change.

---

# 5. Le système de thème (`@theme`)

Le bloc :

```css
@theme inline
```

constitue le cœur du système graphique.

Il associe les variables CSS aux classes Tailwind.

Par exemple :

```css
--color-primary
```

correspond à la couleur principale de l'application.

Toutes les autres couleurs sont définies selon le même principe.

Le thème contient notamment :

- couleur de fond ;
- couleur du texte ;
- couleur des cartes ;
- couleur des bordures ;
- couleur des boutons ;
- couleur des alertes ;
- couleurs personnalisées JOJ.

Cette approche permet de modifier facilement l'apparence globale de l'application en changeant uniquement les variables.

---

# 6. Les variables CSS globales

Toutes les variables sont regroupées dans :

```css
:root
```

Ces variables définissent l'identité graphique de l'application.

Par exemple :

```css
--radius
```

détermine le rayon des bordures.

Les différentes tailles sont ensuite calculées automatiquement :

- radius-sm
- radius-md
- radius-lg
- radius-xl
- radius-2xl

Grâce à ce système, tous les composants possèdent les mêmes coins arrondis.

---

# 7. Les couleurs principales

Le projet utilise plusieurs catégories de couleurs.

## Couleur d'arrière-plan

```css
--background
```

Définit la couleur générale de la page.

---

## Couleur du texte

```css
--foreground
```

Détermine la couleur principale utilisée pour tous les textes.

---

## Cartes

```css
--card
```

Correspond à la couleur des panneaux d'information.

Toutes les cartes du tableau de bord utilisent cette variable.

---

## Bordures

```css
--border
```

Détermine la couleur de toutes les bordures de l'application.

---

## Boutons principaux

```css
--primary
```

Correspond à la couleur utilisée pour les actions principales.

---

## Couleurs secondaires

Les variables

```css
--secondary
```

et

```css
--accent
```

sont utilisées pour mettre en évidence certaines informations sans détourner l'attention de l'utilisateur.

---

# 8. Les couleurs officielles JOJ

Le projet définit également une palette spécifique.

## Bleu JOJ

```css
--joj-blue
```

Cette couleur représente l'identité principale de la plateforme.

Elle est utilisée sur :

- les boutons ;
- les cartes ;
- les statistiques ;
- les icônes.

---

## Vert Émeraude

```css
--joj-emerald
```

Utilisé pour représenter :

- les succès ;
- les validations ;
- les véhicules disponibles.

---

## Jaune

```css
--joj-yellow
```

Utilisé pour signaler les avertissements.

Par exemple :

- maintenance ;
- notifications.

---

## Rouge

```css
--joj-red
```

Correspond aux erreurs et aux alertes importantes.

---

# 9. Le mode sombre

Le bloc :

```css
.dark
```

redéfinit toutes les couleurs précédentes.

Par exemple :

- arrière-plan plus sombre ;
- texte plus clair ;
- bordures plus discrètes.

Grâce à ce mécanisme, toute l'application devient compatible avec le mode sombre sans modifier les composants React.

---

# 10. Les styles de base

Le bloc :

```css
@layer base
```

définit les styles communs à toute l'application.

Il applique notamment :

- les bordures ;
- le fond général ;
- la couleur du texte ;
- la hauteur minimale de la fenêtre.

Le fond utilise un dégradé très léger entre deux nuances de bleu afin d'obtenir une interface élégante.

---

# 11. Les utilitaires personnalisés

Le projet crée également ses propres classes réutilisables.

## joj-gradient

```css
@utility joj-gradient
```

Cette classe génère automatiquement un dégradé entre le bleu JOJ et le vert Émeraude.

Elle est utilisée sur :

- les boutons ;
- certaines cartes ;
- les icônes ;
- les éléments importants.

Cette classe évite de répéter plusieurs lignes de CSS.

---

## joj-card

```css
@utility joj-card
```

Cette classe définit le style de toutes les cartes du tableau de bord.

Elle applique automatiquement :

- un fond blanc ;
- une bordure ;
- des coins arrondis ;
- une ombre légère.

Toutes les cartes possèdent ainsi la même apparence.

Cette homogénéité améliore la lisibilité de l'interface.

---

# 12. Pourquoi utiliser des variables CSS ?

L'utilisation de variables présente plusieurs avantages.

## Réutilisation

Une couleur n'est définie qu'une seule fois.

Tous les composants utilisent ensuite cette variable.

---

## Maintenance

Si l'on souhaite modifier la couleur principale de l'application, une seule ligne est à changer.

Toutes les pages seront automatiquement mises à jour.

---

## Cohérence graphique

Toutes les cartes, tous les boutons et toutes les icônes utilisent exactement les mêmes couleurs.

Cela donne une identité visuelle professionnelle.

---

## Compatibilité avec Tailwind

Les variables sont directement intégrées au système Tailwind.

Les développeurs peuvent donc utiliser les classes Tailwind tout en conservant une palette totalement personnalisée.

---

# 13. Avantages du fichier `style.css`

Cette architecture CSS apporte de nombreux bénéfices :

- séparation entre le style et la logique métier ;
- personnalisation complète de Tailwind CSS ;
- système de thème centralisé ;
- compatibilité avec le mode sombre ;
- réutilisation des styles ;
- réduction du code dupliqué ;
- maintenance simplifiée ;
- interface moderne et cohérente.

---

# Conclusion

Le fichier `style.css` constitue la base graphique de la plateforme **JOJ Dakar 2026 – Transport Hub**. Il ne se limite pas à appliquer des couleurs ou des marges : il met en place un véritable système de design permettant d'assurer une cohérence visuelle sur l'ensemble de l'application. Grâce à l'utilisation de Tailwind CSS, de variables CSS et d'utilitaires personnalisés, la plateforme est facilement maintenable, évolutive et adaptée aux besoins d'une application moderne de gestion des transports en temps réel.

---

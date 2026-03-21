# Guide Opérationnel — Premier Voyage Eventy

> **Créé** : 20 mars 2026
> **Objectif** : Checklist complète de J-90 à J+7 pour le tout premier voyage Eventy (bus complet 53 places)
> **Contexte** : Ce guide est conçu pour un PDG solo (Phase 1). Chaque étape est concrète, datée, et liée aux outils de la plateforme.

---

## Prérequis avant de lancer le premier voyage

| Prérequis | Statut attendu | Fichier référence |
|-----------|----------------|-------------------|
| SAS créée + Kbis | ✅ Obligatoire | `01-legal/STRUCTURE-JURIDIQUE.md` |
| Immatriculation Atout France | ✅ Obligatoire | `01-legal/IMMATRICULATION-ATOUT-FRANCE.md` |
| Garantie financière APST | ✅ Obligatoire | `08-assurance-conformite/GARANTIE-FINANCIERE.md` |
| RC Pro souscrite | ✅ Obligatoire | `08-assurance-conformite/RC-PRO.md` |
| Compte bancaire pro ouvert | ✅ Obligatoire | `14-pitch/PITCH-BANQUE.md` |
| Stripe Connect configuré | ✅ Obligatoire | Backend prêt |
| Site eventylife.fr en production | ✅ Obligatoire | `09-site-beta/PLAN-DEPLOIEMENT.md` |
| Contrat assurance voyage (Pack Sérénité) | ✅ Obligatoire | `08-assurance-conformite/ASSURANCE-VOYAGE-CLIENTS.md` |
| CGV validées par avocat | ✅ Obligatoire | `01-legal/CGV-TEMPLATE.md` |
| Au moins 1 hôtel partenaire signé | ✅ Obligatoire | `05-partenaires/SUIVI-PARTENAIRES.md` |
| Au moins 1 autocariste contacté | ✅ Obligatoire | `03-transport/COMPARATIF-TRANSPORT.md` |

---

## Phase 1 — Conception du voyage (J-90 à J-60)

### Semaine 1-2 : Choisir la destination et le concept

- [ ] **Choisir la destination** du premier voyage
  - Recommandation : **Week-end France** (2-3 jours), distance < 500km, risque minimal
  - Destinations faciles : Pays Basque, Alsace, Côte d'Azur, Normandie, Loire
  - Pourquoi France d'abord : pas de passeports, pas de vols, logistique simple
- [ ] **Définir les dates** (idéal : vendredi soir → dimanche soir)
  - Éviter les ponts/vacances scolaires pour le 1er voyage (concurrence prix hôtels)
  - Viser un week-end de basse/moyenne saison → meilleurs tarifs partenaires
- [ ] **Définir le programme prévisionnel** (grandes lignes)
  - Jour 1 : Départ + arrivée + installation + dîner
  - Jour 2 : Activité principale + déjeuner + activité secondaire + dîner festif
  - Jour 3 : Temps libre/activité optionnelle + déjeuner + retour
- [ ] **Fixer le prix cible par personne** (utiliser la grille tarifaire)
  - Budget type WE France 53 pers : **349-449€/personne** tout compris
  - Décomposition : transport ~40€ + hébergement 2N ~120€ + repas ~80€ + activités ~50€ + marge + Pack Sérénité

### Semaine 3-4 : Sécuriser les partenaires

- [ ] **Négocier l'hébergement** (objectif : 27+ chambres, tarif groupe)
  - Appeler l'hôtel partenaire → demander bloc 27 chambres (doubles/twins)
  - Négocier tarif groupe (-15 à -25% vs rack rate)
  - Obtenir option de blocage 30 jours sans engagement
  - Confirmer : petit-déjeuner inclus, salle commune, parking bus
- [ ] **Réserver le transport** (1 bus 53 places)
  - Contacter 2-3 autocaristes → demander devis aller-retour
  - Budget cible : 1 000-1 500€/jour (bus grand tourisme 53 places)
  - Points à vérifier : assurance véhicule, conducteur logé, heures supplémentaires
- [ ] **Réserver les activités** (2-3 activités groupe)
  - Contacter prestataires locaux → tarif groupe 50+ personnes
  - Obtenir devis écrits avec conditions d'annulation
  - Prévoir 1 activité indoor (plan B météo)
- [ ] **Réserver la restauration** (si hors hôtel)
  - 2-3 restaurants capables d'accueillir 53+ couverts
  - Menu groupe fixe (3 choix max) pour simplifier la logistique
  - Prévoir options végétarien/halal/sans gluten

---

## Phase 2 — Création sur la plateforme (J-60 à J-45)

### Sur le portail Pro (eventylife.fr/pro)

- [ ] **Créer le voyage** dans l'outil Pro
  - Titre accrocheur (ex : "Week-end Pays Basque — 53 places, tout compris")
  - Description qui respire l'Âme Eventy (chaleureux, direct, honnête)
  - Photos de qualité (minimum 5, format paysage, résolution 1920x1080+)
  - Programme détaillé jour par jour
  - Prix par personne tout compris (Pack Sérénité inclus)
  - Conditions : acompte 30% à la réservation, solde J-30
- [ ] **Configurer les options**
  - Chambre single (supplément ~30-50€/nuit)
  - Chambre triple (réduction ~10-15€/nuit)
  - Activité optionnelle si prévue
  - Régimes alimentaires (tags)
- [ ] **Configurer le paiement Stripe**
  - Acompte 30% immédiat
  - Solde automatique J-30
  - Split payment si nécessaire (2-3 échéances)
- [ ] **Rédiger la page voyage** (ton Eventy)
  - Accroche émotionnelle en haut
  - "Pack Sérénité inclus — vous partez l'esprit tranquille"
  - Widget "X places restantes" activé
  - FAQ spécifique au voyage (3-5 questions)

---

## Phase 3 — Remplissage (J-45 à J-15)

### Objectif : 53 réservations confirmées (acompte payé)

| Source | Objectif | % cible | Actions |
|--------|----------|---------|---------|
| Groupe organisateur | 30-37 pers | 55-70% | Réseau David + organisateur partenaire |
| Places ouvertes (site) | 10-16 pers | 20-30% | SEO + réseaux sociaux + newsletter |
| Auto-entrepreneurs | 5-10 pers | 10-20% | Activation réseau si disponible |

### Actions marketing (J-45)

- [ ] **Publier le voyage** sur eventylife.fr (page publique)
- [ ] **Post LinkedIn** (profil David + page Eventy)
  - Photo destination + prix + "53 places, tout compris"
  - Lien direct vers la page de réservation
- [ ] **Post Instagram/Facebook** (si comptes créés)
- [ ] **Envoyer newsletter** aux contacts/inscrits (template `EMAILS-CLIENTS.md` #1)
- [ ] **Activer SEO** : page `/depart/[ville]` dynamique déjà en place

### Suivi remplissage (J-45 à J-15)

- [ ] **Dashboard quotidien** : vérifier nombre de réservations + acomptes reçus
- [ ] **J-30** : Si < 27 réservations → intensifier marketing + relance email
- [ ] **J-21** : Si < 35 réservations → activer plan B :
  - Relancer tous les prospects en attente (template relance)
  - Proposer -5% early bird aux 10 prochains inscrits
  - Partager sur groupes Facebook/WhatsApp ciblés
- [ ] **J-15** : **DÉCISION GO/NO-GO**
  - ✅ **GO** si ≥ 40 réservations (75% remplissage minimum)
  - ⚠️ **GO conditionnel** si 35-39 réservations (avec ajustement marge)
  - ❌ **NO-GO** si < 35 → appliquer politique NoGo (template email #10)

### Seuil de départ Eventy

> **"On part même si le bus n'est pas plein"** — mais jamais en dessous de 40 personnes (75%).
> En dessous de 40, la marge est trop compressée. Proposer report ou avoir client.

---

## Phase 4 — Préparation opérationnelle (J-15 à J-1)

### J-15 : Confirmations définitives

- [ ] **Confirmer l'hôtel** (nombre exact de chambres, rooming list J-7)
- [ ] **Confirmer le bus** (horaires, point de départ, conducteur)
- [ ] **Confirmer les activités** (nombre exact de participants)
- [ ] **Confirmer les restaurants** (nombre de couverts, menus, allergies)
- [ ] **Relancer les impayés** (solde J-30 — template relance paiement)

### J-7 : Préparation logistique

- [ ] **Envoyer le carnet de voyage** à tous les voyageurs (template email #4)
  - Programme détaillé heure par heure
  - Point de RDV bus (adresse exacte, plan, parking)
  - Numéro d'urgence David
  - Check-list valise (suggestions)
  - Infos pratiques destination
- [ ] **Préparer la rooming list** (noms + chambres) → envoyer à l'hôtel
- [ ] **Préparer les listes** :
  - Liste passagers (nom, tél, email, chambre, régime alimentaire)
  - Liste contacts partenaires (hôtel, restaurant, activités, bus)
  - Liste numéros d'urgence (hôpital local, police, consulat si étranger)
- [ ] **Imprimer les documents** (même si tout est digital) :
  - Confirmation hôtel (papier)
  - Attestation assurance groupe
  - Programme jour par jour
  - Badges/étiquettes si besoin

### J-3 : Derniers préparatifs

- [ ] **Vérifier météo** → adapter programme si besoin (plan B indoor)
- [ ] **Confirmer heure de départ bus** avec le chauffeur
- [ ] **Préparer le kit de bienvenue** (optionnel mais différenciant) :
  - Pochette voyage Eventy (programme, plan, contacts)
  - Petit cadeau brandé (stylo, magnet, bonbon local)
  - QR code pour avis post-voyage
- [ ] **Charger le téléphone**, powerbank, chargeur voiture
- [ ] **Prévenir les voyageurs** (email J-3 ou SMS/WhatsApp)

### J-1 : Veille de départ

- [ ] **SMS/WhatsApp de rappel** à tous les voyageurs :
  - "Rendez-vous demain [heure] au [lieu]. Bus n°XX. Contact : [tél David]."
- [ ] **Appeler le chauffeur** — confirmer heure et lieu
- [ ] **Vérifier paiements Stripe** — tous les soldes encaissés ?
- [ ] **Préparer sa valise personnelle** 😄

---

## Phase 5 — Le voyage (Jour J à J+2)

### Jour J — Départ

| Heure | Action | Notes |
|-------|--------|-------|
| H-1h30 | Arriver au point de départ AVANT les voyageurs | Vérifier bus présent, accueillir chauffeur |
| H-1h | Accueil des voyageurs — sourire, énergie, bienveillance | "Bienvenue ! Content de vous voir !" |
| H-0h30 | Appel des présents (liste) | Noter absents, appeler si besoin |
| H | Départ ! | Micro dans le bus → présentation rapide |

**Dans le bus :**
- Se présenter, expliquer le programme
- Rappeler le numéro d'urgence
- Mentionner le Pack Sérénité ("vous êtes couverts, profitez !")
- Ambiance : musique, bonne humeur, convivialité

### Pendant le voyage

- [ ] **Être le point de contact unique** pour les voyageurs
- [ ] **Gérer les imprévus** calmement (c'est la valeur ajoutée Eventy)
- [ ] **Prendre des photos/vidéos** (avec permission) → contenu marketing
- [ ] **Noter les feedbacks à chaud** (ce qui plaît, ce qui peut être amélioré)
- [ ] **Gérer les repas** : vérifier menus, allergies respectées, qualité
- [ ] **Gérer les activités** : timing, sécurité, satisfaction
- [ ] **Check-in hôtel** : rooming list, clés, informations locales

### Problèmes courants et solutions

| Problème | Solution |
|----------|----------|
| Voyageur en retard au bus | Appeler → attendre 15 min max → décision PDG |
| Chambre d'hôtel non conforme | Contacter réception → exiger échange → noter pour déduire |
| Voyageur malade | Pack Sérénité → contacter assurance → hôpital local si urgence |
| Panne de bus | Appeler autocariste → bus de remplacement (vérifier contrat) |
| Mauvaise météo | Plan B indoor → adapter programme → rester positif |
| Conflit entre voyageurs | Médiation calme → séparer si besoin → professionnalisme |
| Restaurant surréservé | Contact direct → plan B resto (toujours avoir un backup) |

---

## Phase 6 — Post-voyage (J+1 à J+7)

### J+1 : Retour et remerciement

- [ ] **Email de remerciement** à tous les voyageurs (template #5)
  - Ton chaleureux, photos du voyage
  - Lien vers formulaire d'avis (template #7 — avis Google/Trustpilot)
  - Code promo -5% prochain voyage (fidélisation)
- [ ] **Remercier les partenaires** (email/appel)
  - Hôtel, chauffeur, restaurants, activités
  - Partager les retours positifs des clients
  - Commencer à poser les bases du prochain voyage

### J+3 : Bilan financier

- [ ] **Réconcilier les paiements Stripe** vs factures fournisseurs
- [ ] **Calculer la marge réelle** du voyage
  - CA total = prix × nombre de voyageurs
  - Coûts = transport + hôtel + repas + activités + assurance + frais
  - Marge brute = CA - Coûts
  - Objectif : **≥ 22% de marge brute**
- [ ] **Payer les fournisseurs** (délai contractuel, généralement J+30)
- [ ] **Mettre à jour le plan de trésorerie** (`02-finance/PLAN-TRESORERIE.md`)

### J+7 : Analyse et amélioration

- [ ] **Analyser les avis clients** (formulaire + Google + Trustpilot)
- [ ] **Réunion post-mortem** (même si c'est seul — écrire un compte-rendu)
  - Ce qui a bien marché
  - Ce qui doit être amélioré
  - Actions concrètes pour le prochain voyage
- [ ] **Mettre à jour le DASHBOARD-PDG** avec les résultats réels
- [ ] **Planifier le prochain voyage** (idéalement dans les 3-4 semaines)

---

## Checklist express — Récapitulatif

| Phase | Quand | Actions clés | ✅ |
|-------|-------|-------------|-----|
| Conception | J-90 → J-60 | Destination + prix + partenaires signés | ☐ |
| Plateforme | J-60 → J-45 | Voyage créé + paiement configuré + page publiée | ☐ |
| Remplissage | J-45 → J-15 | Marketing + suivi quotidien + Go/No-Go J-15 | ☐ |
| Préparation | J-15 → J-1 | Confirmations + carnet voyage + rooming + logistique | ☐ |
| Voyage | J → J+2 | Accueil + coordination + photos + gestion imprévus | ☐ |
| Post-voyage | J+1 → J+7 | Remerciement + bilan financier + avis + prochaine planif | ☐ |

---

## Budget type — WE France 53 personnes (2 jours/2 nuits)

| Poste | Coût unitaire | Coût total (53 pers) | % du prix |
|-------|---------------|----------------------|-----------|
| Transport bus (2 jours) | ~38€/pers | ~2 000€ | 10% |
| Hébergement (2 nuits) | ~120€/pers | ~6 360€ | 32% |
| Restauration (4 repas) | ~80€/pers | ~4 240€ | 22% |
| Activités (2) | ~50€/pers | ~2 650€ | 14% |
| Pack Sérénité assurance | ~17€/pers | ~900€ | 5% |
| **Total coûts** | **~305€/pers** | **~16 150€** | |
| **Prix de vente** | **~389€/pers** | **~20 617€** | |
| **Marge brute** | **~84€/pers** | **~4 467€** | **~21,7%** |

> Ce budget est un exemple. Adapter selon la destination, la saison, et les partenaires négociés.

---

*Créé le 20 mars 2026 — Guide opérationnel V1*
